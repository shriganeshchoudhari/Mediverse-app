/**
 * TbiIcpMonroeKellieEngine.ts
 * Biophysical, Hemodynamic & Neurocritical Care Simulation Engine
 * Modeling Traumatic Brain Injury (TBI), Monroe-Kellie Intracranial Volume-Pressure Dynamics,
 * Lundberg A/B/C Waveform Synthesis, CPP Optimization, Hyperosmolar Therapy & Decompressive Craniectomy.
 *
 * Adheres to:
 * - Brain Trauma Foundation (BTF) Guidelines for the Management of Severe TBI (4th Edition)
 * - Seattle International Severe Traumatic Brain Injury Consensus Conference (SIBICC) Algorithm
 * - Neurocritical Care Society (NCS) Guidelines on Hyperosmolar Therapy and Intracranial Monitoring
 * - RESCUEicp and DECRA Decompressive Craniectomy Trial Consensus
 *
 * Location: frontend/.gemini/skills/TbiIcpMonroeKellieEngine.ts
 */

export interface IntracranialCompartments {
  brainTissueVolumeMl: number;   // Normal ~1400 mL (80%)
  cerebralBloodVolumeMl: number; // Normal ~150 mL (10%)
  csfVolumeMl: number;           // Normal ~150 mL (10%)
  massLesionVolumeMl: number;    // Hematoma / contusion / tumor (0 to 120 mL)
  vasogenicEdemaMl: number;      // Perilesional edema / cytotoxic swelling (0 to 80 mL)
  totalVaultCapacityMl: number;  // Rigid adult cranial vault ~1700 mL
}

export type ComplianceState = 'HIGH_COMPLIANCE' | 'COMPENSATED' | 'CRITICAL_ELASTANCE' | 'DECOMPENSATED_HERNIATION';

export type LundbergWaveType = 'NORMAL_C_WAVE' | 'LUNDBERG_B_RHYTHMIC' | 'LUNDBERG_A_PLATEAU' | 'TERMINAL_COLLAPSE';

export type HerniationSyndrome =
  | 'NONE'
  | 'IMPENDING_HERNIATION'
  | 'UNCAL_HERNIATION'
  | 'CENTRAL_TRANSTENTORIAL'
  | 'SUBFALCINE_CINGULATE'
  | 'TONSILLAR_HERNIATION';

export type BtfManagementTier = 'TIER_0_BASELINE' | 'TIER_1_FIRST_LINE' | 'TIER_2_SECOND_LINE' | 'TIER_3_REFRACTORY_RESCUE';

export interface PulseWaveformComponents {
  p1PercussionMmhg: number; // Choroid arterial pulse peak
  p2TidalMmhg: number;      // Brain elastance rebound peak
  p3DicroticMmhg: number;   // Venous dicrotic notch pulsation
  p2p1Ratio: number;        // Normal < 0.8; Elevated >= 1.0 (impaired compliance)
  morphologyLabel: string;
}

export interface HyperosmolarRegimen {
  agent: 'MANNITOL_20' | 'HYPERTONIC_SALINE_3' | 'HYPERTONIC_SALINE_23_4' | 'NONE';
  doseAmount: number;         // g/kg or mL
  serumSodiumMeqL: number;    // Normal 135-145, target 145-155 mEq/L
  serumOsmolalityMosmKg: number; // Normal 275-295, cutoff < 320 mOsm/kg
  measuredOsmolalityMosmKg: number;
  calculatedOsmolalityMosmKg: number;
  osmolalGap: number;         // Normal < 10-14, safety limit < 20 mOsm/kg
  osmolalGapExceeded: boolean;
  hypernatremiaWarning: boolean;
}

export interface VentilationStatus {
  paco2Mmhg: number;          // Normal 35-40 mmHg, mild hyperventilation 30-35 mmHg
  pao2Mmhg: number;           // Target >= 80-100 mmHg
  pbto2Mmhg: number;          // Brain tissue oxygen tension (normal 20-35, ischemia < 15-20 mmHg)
  cerebralVasoconstrictionIndex: number; // Relative reduction in CBV (0 to 0.35)
}

export interface TbiSimulationState {
  patientWeightKg: number;
  meanArterialPressureMmhg: number; // SBP/DBP derived or measured MAP
  systolicBpMmhg: number;
  diastolicBpMmhg: number;
  compartments: IntracranialCompartments;
  gcsTotal: number;                // Glasgow Coma Scale (3 to 15)
  gcsMotor: number;                // GCS Motor component (1 to 6)
  pupils: {
    rightDiameterMm: number;
    rightReactivity: 'BRISK' | 'SLUGGISH' | 'FIXED_NONREACTIVE';
    leftDiameterMm: number;
    leftReactivity: 'BRISK' | 'SLUGGISH' | 'FIXED_NONREACTIVE';
  };
  evdClamped: boolean;
  evdDrainageRateMlHr: number;     // CSF drainage via external ventricular drain
  midlineShiftMm: number;          // CT imaging midline shift (0 to 25 mm)
  ambientTemperatureC: number;     // Target 36.0-37.5 normothermia
  headOfBedAngleDeg: number;       // Target 30 degrees
  sedationDepthRass: number;       // Richmond Agitation-Sedation Scale (-5 to +4)
  neuromuscularBlockadeActive: boolean;
  decompressiveCraniectomyDone: boolean;
  burstSuppressionEegActive: boolean;
  prxAutoregulationIndex: number;  // -1.0 (intact) to +1.0 (passive / defective)
}

export interface TbiSimulationOutput {
  icpMmhg: number;
  cppMmhg: number;
  complianceState: ComplianceState;
  elastanceCoefficient: number;
  pulseWaveform: PulseWaveformComponents;
  lundbergWave: LundbergWaveType;
  lundbergWaveAmplitudeMmhg: number;
  herniationRisk: HerniationSyndrome;
  herniationIndexPct: number;
  currentTier: BtfManagementTier;
  targetCppAchieved: boolean;      // BTF 60-70 mmHg
  cppDeficitMmhg: number;
  ischemicThreatActive: boolean;   // CPP < 60 or PbtO2 < 15
  hyperemiaThreatActive: boolean;  // CPP > 70 with disrupted autoregulation
  recommendedActions: string[];
  safetyAlerts: string[];
}

export class TbiIcpMonroeKellieEngine {
  /**
   * Calculates dynamic baseline ICP using the Monroe-Kellie exponential volume-pressure relationship.
   * Total volume of intracranial vault is ~1700 mL.
   * Compensatory capacity of CSF displacement + venous blood extrusion is ~65-75 mL.
   * Once compensation is exhausted, ICP rises exponentially.
   */
  public static calculateIcp(
    compartments: IntracranialCompartments,
    evdClamped: boolean,
    evdDrainageRateMlHr: number,
    paco2Mmhg: number,
    headOfBedAngleDeg: number,
    decompressiveCraniectomyDone: boolean
  ): { icp: number; elastance: number; complianceState: ComplianceState } {
    // If craniectomy has been performed, the rigid skull is unroofed:
    if (decompressiveCraniectomyDone) {
      const residualMass = compartments.massLesionVolumeMl + compartments.vasogenicEdemaMl;
      const baseIcp = 8.0 + residualMass * 0.05;
      const finalIcp = Math.max(5, Math.min(20, baseIcp));
      return {
        icp: Math.round(finalIcp * 10) / 10,
        elastance: 0.22,
        complianceState: 'HIGH_COMPLIANCE'
      };
    }

    // Baseline physiological parameters
    const baselineIcp = 10.0; // Normal adult resting ICP: 7-15 mmHg

    // Added pathological volume: mass lesion + vasogenic edema
    const addedPathologicVolume = compartments.massLesionVolumeMl + compartments.vasogenicEdemaMl;

    // Compensatory clearance:
    // Endogenous spatial reserve: ~65 mL
    let compensatoryCapacityMl = 65.0;

    // Head of bed effect: Flat (0 deg) reduces venous outflow; 30 deg optimizes jugular venous drainage
    if (headOfBedAngleDeg < 15) {
      compensatoryCapacityMl -= 15.0;
    } else if (headOfBedAngleDeg >= 30 && headOfBedAngleDeg <= 45) {
      compensatoryCapacityMl += 8.0;
    } else if (headOfBedAngleDeg > 45) {
      compensatoryCapacityMl += 4.0;
    }

    // External Ventricular Drain (EVD) CSF removal:
    if (!evdClamped && evdDrainageRateMlHr > 0) {
      const activeCsfClearance = Math.min(35, evdDrainageRateMlHr * 1.5);
      compensatoryCapacityMl += activeCsfClearance;
    }

    // PaCO2 effect on Cerebral Blood Volume (CBV):
    const deltaPaco2 = paco2Mmhg - 38.0;
    const cbvVolumeShiftMl = deltaPaco2 * 1.5;

    const netAddedVolume = addedPathologicVolume + cbvVolumeShiftMl;

    let computedIcp = baselineIcp;
    let elastance = 0.45;
    let state: ComplianceState = 'HIGH_COMPLIANCE';

    if (netAddedVolume <= 30) {
      computedIcp = baselineIcp + netAddedVolume * 0.12;
      elastance = 0.4 + (netAddedVolume / 30) * 0.3;
      state = 'HIGH_COMPLIANCE';
    } else if (netAddedVolume <= compensatoryCapacityMl) {
      const fraction = (netAddedVolume - 30) / Math.max(1, compensatoryCapacityMl - 30);
      computedIcp = 13.6 + fraction * 6.4; // 13.6 to 20.0 mmHg
      elastance = 0.7 + fraction * 0.7;
      state = 'COMPENSATED';
    } else {
      // Decompensated phase: exponential elastance rise
      const excessVolume = netAddedVolume - compensatoryCapacityMl;
      computedIcp = 20.0 + 2.0 * Math.exp(excessVolume * 0.055);
      elastance = 1.5 + excessVolume * 0.08;

      if (computedIcp < 35) {
        state = 'CRITICAL_ELASTANCE';
      } else {
        state = 'DECOMPENSATED_HERNIATION';
      }
    }

    computedIcp = Math.min(95.0, Math.max(3.0, computedIcp));

    return {
      icp: Math.round(computedIcp * 10) / 10,
      elastance: Math.round(elastance * 100) / 100,
      complianceState: state
    };
  }

  /**
   * Computes Cerebral Perfusion Pressure (CPP) and evaluates target achievement.
   * BTF 4th Ed: CPP target is 60 to 70 mmHg.
   */
  public static calculateCpp(
    mapMmhg: number,
    icpMmhg: number,
    prx: number
  ): {
    cpp: number;
    targetAchieved: boolean;
    deficit: number;
    ischemicThreat: boolean;
    hyperemiaThreat: boolean;
  } {
    const cpp = Math.round((mapMmhg - icpMmhg) * 10) / 10;
    const targetAchieved = cpp >= 60.0 && cpp <= 70.0;
    const deficit = cpp < 60.0 ? Math.round((60.0 - cpp) * 10) / 10 : 0;
    const ischemicThreat = cpp < 60.0;
    const hyperemiaThreat = cpp > 70.0 && prx > 0.25;

    return {
      cpp,
      targetAchieved,
      deficit,
      ischemicThreat,
      hyperemiaThreat
    };
  }

  /**
   * Synthesizes ICP arterial pulse wave components (P1 percussion, P2 tidal, P3 dicrotic)
   * and calculates P2/P1 ratio.
   * P2 > P1 is a hallmark of severely decreased intracranial compliance.
   */
  public static calculatePulseWaveform(icp: number, elastance: number): PulseWaveformComponents {
    // P1 (percussion wave): sharply transmitted choroid plexus arterial pulsation
    const p1Base = icp * 0.35 + 4.0;

    // P2 (tidal wave): brain elastance rebound wave.
    // In low elastance (<0.8, normal compliance), P2 is well below P1 (<0.8 ratio).
    // In high elastance (>1.5, exhausted compliance), P2 rebounds aggressively above P1 (>=1.0 ratio).
    const elastanceFactor = Math.max(0.2, elastance);
    const p2Base = (icp * 0.22) * (0.55 + elastanceFactor * 0.65) + 2.5;

    // P3 (dicrotic wave): venous reflection notch
    const p3Base = icp * 0.18 + 2.0;

    const p2p1Ratio = Math.round((p2Base / Math.max(1, p1Base)) * 100) / 100;

    let morphologyLabel = 'Normal Configuration (P1 > P2 > P3)';
    if (p2p1Ratio >= 1.25) {
      morphologyLabel = 'Severely Exhausted Compliance (P2 >> P1 Rounded Dome)';
    } else if (p2p1Ratio >= 1.0) {
      morphologyLabel = 'Impaired Intracranial Compliance (P2 >= P1 Inverted)';
    } else if (p2p1Ratio >= 0.85) {
      morphologyLabel = 'Transitional Compliance (P2 Approaching P1)';
    }

    return {
      p1PercussionMmhg: Math.round(p1Base * 10) / 10,
      p2TidalMmhg: Math.round(p2Base * 10) / 10,
      p3DicroticMmhg: Math.round(p3Base * 10) / 10,
      p2p1Ratio,
      morphologyLabel
    };
  }

  /**
   * Classifies and generates Lundberg Wave slow oscillation patterns.
   */
  public static determineLundbergPattern(
    icp: number,
    complianceState: ComplianceState,
    p2p1Ratio: number
  ): { waveType: LundbergWaveType; amplitudeMmhg: number; clinicalSignificance: string } {
    if (icp >= 40 || complianceState === 'DECOMPENSATED_HERNIATION') {
      return {
        waveType: 'LUNDBERG_A_PLATEAU',
        amplitudeMmhg: Math.min(45, Math.round(icp * 0.65)),
        clinicalSignificance:
          'Lundberg A (Plateau) Waves: Urgent indicator of decompensated intracranial compliance and imminent transtentorial herniation. Cerebral vasodilation cascade responding to low CPP spikes intracranial volume.'
      };
    }

    if (icp >= 22 || p2p1Ratio >= 1.0 || complianceState === 'CRITICAL_ELASTANCE') {
      return {
        waveType: 'LUNDBERG_B_RHYTHMIC',
        amplitudeMmhg: Math.round(8.0 + (icp - 20) * 0.4),
        clinicalSignificance:
          'Lundberg B Waves: Rhythmic 0.5-2 waves/minute fluctuations indicating diminishing intracranial compliance and unstable cerebrovascular vasomotor tone.'
      };
    }

    if (icp < 5) {
      return {
        waveType: 'TERMINAL_COLLAPSE',
        amplitudeMmhg: 1.0,
        clinicalSignificance: 'Overdrainage or post-decompression intracranial hypotension.'
      };
    }

    return {
      waveType: 'NORMAL_C_WAVE',
      amplitudeMmhg: 3.5,
      clinicalSignificance:
        'Lundberg C Waves: Normal physiological Traube-Hering-Mayer 4-8 waves/minute oscillations synchronous with systemic blood pressure variations.'
    };
  }

  /**
   * Evaluates Herniation Syndromes based on ICP, Pupillary asymmetry, Midline shift, and GCS.
   */
  public static evaluateHerniationRisk(
    icp: number,
    midlineShiftMm: number,
    pupils: {
      rightDiameterMm: number;
      rightReactivity: string;
      leftDiameterMm: number;
      leftReactivity: string;
    },
    gcsMotor: number
  ): { syndrome: HerniationSyndrome; riskPercent: number; manifestations: string[] } {
    const isRightPupilBlown = pupils.rightDiameterMm >= 6.0 && pupils.rightReactivity === 'FIXED_NONREACTIVE';
    const isLeftPupilBlown = pupils.leftDiameterMm >= 6.0 && pupils.leftReactivity === 'FIXED_NONREACTIVE';
    const isBilateralBlown = isRightPupilBlown && isLeftPupilBlown;
    const anisocoriaMm = Math.abs(pupils.rightDiameterMm - pupils.leftDiameterMm);

    const manifestations: string[] = [];

    if (icp >= 50 && (isBilateralBlown || gcsMotor <= 2)) {
      manifestations.push('Cushing Triad (severe hypertension, bradycardia, irregular bradypnea)');
      manifestations.push('Bilateral fixed dilated pupils with flaccid or extensor posturing');
      manifestations.push('Medullary tonsillar impaction through foramen magnum');
      return {
        syndrome: 'TONSILLAR_HERNIATION',
        riskPercent: 95,
        manifestations
      };
    }

    if ((isRightPupilBlown || isLeftPupilBlown) || anisocoriaMm >= 2.5) {
      const blownSide = isRightPupilBlown ? 'Right' : 'Left';
      manifestations.push(`${blownSide} uncal herniation compressing ipsilateral Oculomotor Nerve (CN III)`);
      manifestations.push('Ipsilateral pupillary dilation and loss of light reflex');
      manifestations.push('Contralateral hemiparesis or Kernohan notch paradoxical ipsilateral hemiparesis');
      return {
        syndrome: 'UNCAL_HERNIATION',
        riskPercent: 88,
        manifestations
      };
    }

    if (midlineShiftMm >= 10.0 || (icp >= 35 && gcsMotor <= 3)) {
      manifestations.push('Downward displacement of diencephalon through tentorial incisura');
      manifestations.push('Midpoint unreactive pupils and Cheyne-Stokes breathing');
      manifestations.push('Decorticate progressing to decerebrate posturing');
      return {
        syndrome: 'CENTRAL_TRANSTENTORIAL',
        riskPercent: 78,
        manifestations
      };
    }

    if (midlineShiftMm >= 5.0) {
      manifestations.push('Cingulate gyrus herniation beneath the rigid falx cerebri');
      manifestations.push('Compression of Anterior Cerebral Artery (ACA) branches');
      manifestations.push('Contralateral lower extremity paresis');
      return {
        syndrome: 'SUBFALCINE_CINGULATE',
        riskPercent: 55,
        manifestations
      };
    }

    if (icp >= 25) {
      manifestations.push('Progressive intracranial hypertension exhausting spatial compensation');
      manifestations.push('Headache, nausea, progressive lethargy');
      return {
        syndrome: 'IMPENDING_HERNIATION',
        riskPercent: 40,
        manifestations
      };
    }

    return {
      syndrome: 'NONE',
      riskPercent: 10,
      manifestations: ['No active mechanical brain tissue herniation detected']
    };
  }

  /**
   * Calculates Hyperosmolar Therapy Parameters
   */
  public static calculateHyperosmolarTherapy(
    agent: 'MANNITOL_20' | 'HYPERTONIC_SALINE_3' | 'HYPERTONIC_SALINE_23_4' | 'NONE',
    doseAmount: number,
    weightKg: number,
    currentSodiumMeqL: number,
    serumGlucoseMgDl: number = 140,
    serumBunMgDl: number = 18
  ): HyperosmolarRegimen {
    const calculatedOsm = Math.round(2 * currentSodiumMeqL + serumGlucoseMgDl / 18 + serumBunMgDl / 2.8);

    let measuredOsm = calculatedOsm;
    let expectedDeltaSodium = 0;

    if (agent === 'MANNITOL_20') {
      const estimatedGapRise = (doseAmount / 0.25) * 7.0;
      measuredOsm = calculatedOsm + estimatedGapRise;
    } else if (agent === 'HYPERTONIC_SALINE_3') {
      const tbw = weightKg * 0.6;
      const mEqInfused = (doseAmount / 1000) * 513;
      expectedDeltaSodium = Math.round((mEqInfused / tbw) * 10) / 10;
    } else if (agent === 'HYPERTONIC_SALINE_23_4') {
      const tbw = weightKg * 0.6;
      const mEqInfused = (doseAmount / 1000) * 4000;
      expectedDeltaSodium = Math.round((mEqInfused / tbw) * 10) / 10;
    }

    const finalSodium = Math.round((currentSodiumMeqL + expectedDeltaSodium) * 10) / 10;
    const finalCalculatedOsm = Math.round(2 * finalSodium + serumGlucoseMgDl / 18 + serumBunMgDl / 2.8);
    const finalMeasuredOsm = agent === 'MANNITOL_20' ? measuredOsm : finalCalculatedOsm + 4;
    const osmolalGap = Math.round((finalMeasuredOsm - finalCalculatedOsm) * 10) / 10;

    const osmolalGapExceeded = agent === 'MANNITOL_20' && (osmolalGap >= 20 || finalMeasuredOsm >= 320);
    const hypernatremiaWarning = finalSodium >= 160;

    return {
      agent,
      doseAmount,
      serumSodiumMeqL: finalSodium,
      serumOsmolalityMosmKg: finalMeasuredOsm,
      measuredOsmolalityMosmKg: finalMeasuredOsm,
      calculatedOsmolalityMosmKg: finalCalculatedOsm,
      osmolalGap,
      osmolalGapExceeded,
      hypernatremiaWarning
    };
  }

  /**
   * Evaluates Brain Tissue Oxygen tension (PbtO2) and ventilation targets.
   */
  public static evaluateVentilation(
    paco2Mmhg: number,
    pao2Mmhg: number,
    cppMmhg: number
  ): VentilationStatus {
    const vasoconstrictionIndex = Math.max(0, Math.min(0.4, (40 - paco2Mmhg) * 0.025));

    let pbto2 = 28.0 * (pao2Mmhg / 100) * Math.min(1.2, cppMmhg / 65);

    if (paco2Mmhg < 35) {
      const hypocapniaPenalty = (35 - paco2Mmhg) * 1.8;
      pbto2 -= hypocapniaPenalty;
    }

    pbto2 = Math.max(5.0, Math.min(55.0, Math.round(pbto2 * 10) / 10));

    return {
      paco2Mmhg,
      pao2Mmhg,
      pbto2Mmhg: pbto2,
      cerebralVasoconstrictionIndex: Math.round(vasoconstrictionIndex * 100) / 100
    };
  }

  /**
   * Evaluates Brain Trauma Foundation (BTF) / SIBICC tiered escalation status.
   */
  public static determineManagementTier(
    icp: number,
    cpp: number,
    herniation: HerniationSyndrome,
    osmoRegimen: HyperosmolarRegimen,
    ventilation: VentilationStatus,
    evdActive: boolean,
    burstSuppression: boolean,
    decompressiveCraniectomy: boolean
  ): { tier: BtfManagementTier; rationale: string; nextTierStep: string } {
    if (decompressiveCraniectomy || burstSuppression || (icp >= 30 && osmoRegimen.agent !== 'NONE')) {
      return {
        tier: 'TIER_3_REFRACTORY_RESCUE',
        rationale:
          'Refractory intracranial hypertension unresponsive to medical tiers. Evaluated for surgical Decompressive Craniectomy or high-dose Barbiturate Coma with burst-suppression EEG.',
        nextTierStep: 'Surgical hemicraniectomy / bifrontal craniectomy or transition to organ preservation.'
      };
    }

    if (
      icp >= 22 ||
      herniation !== 'NONE' ||
      osmoRegimen.agent !== 'NONE' ||
      ventilation.paco2Mmhg < 35
    ) {
      return {
        tier: 'TIER_2_SECOND_LINE',
        rationale:
          'Persistent ICP > 22 mmHg despite Tier 1 measures. Requiring hyperosmolar therapy (Mannitol or Hypertonic Saline), mild hypocapnia (PaCO2 30-35), or neuromuscular blockade.',
        nextTierStep:
          'Escalate to Tier 3 (Decompressive Craniectomy or Pentobarbital burst suppression) if ICP remains > 22 mmHg.'
      };
    }

    if (icp > 15 || evdActive) {
      return {
        tier: 'TIER_1_FIRST_LINE',
        rationale:
          'Mild to moderate ICP elevation (15-22 mmHg). Managed with CSF drainage via External Ventricular Drain (EVD), optimized analgesia/sedation, and normocapnia.',
        nextTierStep: 'Prepare Tier 2 hyperosmolar therapy if ICP exceeds 22 mmHg for > 5-10 minutes.'
      };
    }

    return {
      tier: 'TIER_0_BASELINE',
      rationale:
        'Standard neuroprotective foundation: HOB 30 degrees, neutral neck, normothermia (36-37.5C), normoglycemia, and normocapnia.',
      nextTierStep: 'Continuous ICP and CPP monitoring; maintain CPP between 60 and 70 mmHg.'
    };
  }

  /**
   * Synthesizes full patient clinical state and delivers comprehensive simulation analytics.
   */
  public static runSimulation(state: TbiSimulationState): TbiSimulationOutput {
    const { icp, elastance, complianceState } = this.calculateIcp(
      state.compartments,
      state.evdClamped,
      state.evdDrainageRateMlHr,
      38,
      state.headOfBedAngleDeg,
      state.decompressiveCraniectomyDone
    );

    const { cpp, targetAchieved, deficit, ischemicThreat, hyperemiaThreat } = this.calculateCpp(
      state.meanArterialPressureMmhg,
      icp,
      state.prxAutoregulationIndex
    );

    const pulseWaveform = this.calculatePulseWaveform(icp, elastance);
    const lundbergData = this.determineLundbergPattern(icp, complianceState, pulseWaveform.p2p1Ratio);
    const herniationData = this.evaluateHerniationRisk(icp, state.midlineShiftMm, state.pupils, state.gcsMotor);

    const osmoDummy = this.calculateHyperosmolarTherapy('NONE', 0, state.patientWeightKg, 140);
    const ventDummy = this.evaluateVentilation(38, 95, cpp);

    const tierData = this.determineManagementTier(
      icp,
      cpp,
      herniationData.syndrome,
      osmoDummy,
      ventDummy,
      !state.evdClamped && state.evdDrainageRateMlHr > 0,
      state.burstSuppressionEegActive,
      state.decompressiveCraniectomyDone
    );

    const recommendedActions: string[] = [];
    const safetyAlerts: string[] = [];

    if (herniationData.syndrome === 'UNCAL_HERNIATION' || herniationData.syndrome === 'TONSILLAR_HERNIATION') {
      safetyAlerts.push('CRITICAL EMERGENCY: Active transtentorial/uncal herniation syndrome detected!');
      recommendedActions.push('Stat Hyperosmolar Bullet: Administer 30 mL of 23.4% Hypertonic Saline IV over 10 minutes (or Mannitol 1.0 g/kg).');
      recommendedActions.push('Emergency Neurosurgical Consultation for emergent craniotomy / hematoma evacuation.');
      recommendedActions.push('Stat Head CT if acute expansion or rebleeding is suspected.');
    }

    if (icp > 22 && !state.decompressiveCraniectomyDone) {
      recommendedActions.push(`Target ICP <= 22 mmHg (Current: ${icp} mmHg). Escalate BTF Protocol.`);
      if (state.evdClamped) {
        recommendedActions.push('Open External Ventricular Drain (EVD) to drain CSF against a 10-15 cmH2O pressure head.');
      }
    }

    if (ischemicThreat) {
      safetyAlerts.push(`CEREBRAL ISCHEMIA THREAT: CPP is ${cpp} mmHg (< 60 mmHg minimum target).`);
      recommendedActions.push('Titrate vasopressor (Norepinephrine) to augment MAP and restore CPP >= 60 mmHg.');
    }

    if (hyperemiaThreat) {
      safetyAlerts.push(`HYPERPERFUSION RISK: CPP is ${cpp} mmHg with disrupted autoregulation (PRx +${state.prxAutoregulationIndex}).`);
      recommendedActions.push('Wean unnecessary vasopressors; excessive MAP risks capillary leak and ARDS.');
    }

    if (pulseWaveform.p2p1Ratio >= 1.0) {
      safetyAlerts.push(`COMPROMISED COMPLIANCE: Waveform demonstrates P2 >= P1 ratio (${pulseWaveform.p2p1Ratio}). Intracranial buffer exhausted.`);
    }

    if (state.headOfBedAngleDeg < 30) {
      recommendedActions.push(`Elevate Head of Bed to 30 degrees (currently ${state.headOfBedAngleDeg} deg) to optimize jugular venous outflow.`);
    }

    return {
      icpMmhg: icp,
      cppMmhg: cpp,
      complianceState,
      elastanceCoefficient: elastance,
      pulseWaveform,
      lundbergWave: lundbergData.waveType,
      lundbergWaveAmplitudeMmhg: lundbergData.amplitudeMmhg,
      herniationRisk: herniationData.syndrome,
      herniationIndexPct: herniationData.riskPercent,
      currentTier: tierData.tier,
      targetCppAchieved: targetAchieved,
      cppDeficitMmhg: deficit,
      ischemicThreatActive: ischemicThreat,
      hyperemiaThreatActive: hyperemiaThreat,
      recommendedActions,
      safetyAlerts
    };
  }

  public static getClinicalPresets(): Record<string, TbiSimulationState> {
    return {
      epidural_uncal: {
        patientWeightKg: 75,
        meanArterialPressureMmhg: 90,
        systolicBpMmhg: 130,
        diastolicBpMmhg: 70,
        compartments: {
          brainTissueVolumeMl: 1400,
          cerebralBloodVolumeMl: 150,
          csfVolumeMl: 120,
          massLesionVolumeMl: 75,
          vasogenicEdemaMl: 15,
          totalVaultCapacityMl: 1700
        },
        gcsTotal: 6,
        gcsMotor: 3,
        pupils: {
          rightDiameterMm: 6.5,
          rightReactivity: 'FIXED_NONREACTIVE',
          leftDiameterMm: 3.0,
          leftReactivity: 'BRISK'
        },
        evdClamped: true,
        evdDrainageRateMlHr: 0,
        midlineShiftMm: 9.5,
        ambientTemperatureC: 37.1,
        headOfBedAngleDeg: 30,
        sedationDepthRass: -4,
        neuromuscularBlockadeActive: false,
        decompressiveCraniectomyDone: false,
        burstSuppressionEegActive: false,
        prxAutoregulationIndex: 0.35
      },
      dai_plateau_waves: {
        patientWeightKg: 80,
        meanArterialPressureMmhg: 88,
        systolicBpMmhg: 125,
        diastolicBpMmhg: 70,
        compartments: {
          brainTissueVolumeMl: 1400,
          cerebralBloodVolumeMl: 155,
          csfVolumeMl: 105,
          massLesionVolumeMl: 15,
          vasogenicEdemaMl: 70,
          totalVaultCapacityMl: 1700
        },
        gcsTotal: 5,
        gcsMotor: 2,
        pupils: {
          rightDiameterMm: 3.5,
          rightReactivity: 'SLUGGISH',
          leftDiameterMm: 3.5,
          leftReactivity: 'SLUGGISH'
        },
        evdClamped: false,
        evdDrainageRateMlHr: 5,
        midlineShiftMm: 2.0,
        ambientTemperatureC: 37.8,
        headOfBedAngleDeg: 20,
        sedationDepthRass: -3,
        neuromuscularBlockadeActive: false,
        decompressiveCraniectomyDone: false,
        burstSuppressionEegActive: false,
        prxAutoregulationIndex: 0.15
      },
      contusion_dysautoregulation: {
        patientWeightKg: 70,
        meanArterialPressureMmhg: 105,
        systolicBpMmhg: 150,
        diastolicBpMmhg: 82,
        compartments: {
          brainTissueVolumeMl: 1400,
          cerebralBloodVolumeMl: 160,
          csfVolumeMl: 110,
          massLesionVolumeMl: 35,
          vasogenicEdemaMl: 40,
          totalVaultCapacityMl: 1700
        },
        gcsTotal: 8,
        gcsMotor: 4,
        pupils: {
          rightDiameterMm: 4.0,
          rightReactivity: 'SLUGGISH',
          leftDiameterMm: 3.0,
          leftReactivity: 'BRISK'
        },
        evdClamped: false,
        evdDrainageRateMlHr: 12,
        midlineShiftMm: 5.5,
        ambientTemperatureC: 36.8,
        headOfBedAngleDeg: 30,
        sedationDepthRass: -3,
        neuromuscularBlockadeActive: false,
        decompressiveCraniectomyDone: false,
        burstSuppressionEegActive: false,
        prxAutoregulationIndex: 0.52
      },
      refractory_rescueicp: {
        patientWeightKg: 72,
        meanArterialPressureMmhg: 85,
        systolicBpMmhg: 120,
        diastolicBpMmhg: 68,
        compartments: {
          brainTissueVolumeMl: 1400,
          cerebralBloodVolumeMl: 165,
          csfVolumeMl: 85,
          massLesionVolumeMl: 45,
          vasogenicEdemaMl: 60,
          totalVaultCapacityMl: 1700
        },
        gcsTotal: 4,
        gcsMotor: 2,
        pupils: {
          rightDiameterMm: 5.0,
          rightReactivity: 'SLUGGISH',
          leftDiameterMm: 5.0,
          leftReactivity: 'SLUGGISH'
        },
        evdClamped: false,
        evdDrainageRateMlHr: 15,
        midlineShiftMm: 7.0,
        ambientTemperatureC: 36.5,
        headOfBedAngleDeg: 30,
        sedationDepthRass: -5,
        neuromuscularBlockadeActive: true,
        decompressiveCraniectomyDone: false,
        burstSuppressionEegActive: false,
        prxAutoregulationIndex: 0.40
      }
    };
  }
}
