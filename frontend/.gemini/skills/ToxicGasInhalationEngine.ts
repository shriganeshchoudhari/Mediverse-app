/**
 * ToxicGasInhalationEngine.ts
 * Toxicology, Critical Care & Emergency Medicine Engine.
 * Implements Toxic Gas & Chemical Warfare Inhalational Injury:
 * Cellular Asphyxiants (Cyanide vs Hydrogen Sulfide H2S) &
 * Irritant Gases (Chlorine vs Phosgene Delayed Alveolar Leak).
 * Features Cytochrome c Oxidase Inhibition, Hydroxocobalamin Stoichiometry,
 * Nitrite-Induced Methemoglobinemia Kinetics (Contraindicated in Smoke/CO),
 * Nebulized Sodium Bicarbonate Acid Neutralization, and Latent Phosgene ARDS Windows.
 * Location: frontend/.gemini/skills/ToxicGasInhalationEngine.ts
 */

export type ToxicGasAgent = 'cyanide' | 'hydrogen_sulfide_h2s' | 'chlorine_gas' | 'phosgene';

export interface AntidoteState {
  hydroxocobalaminGrams: number; // 0 to 10g (standard initial dose 5g IV)
  sodiumThiosulfateGiven: boolean; // 12.5g IV
  sodiumNitriteGiven: boolean; // 300mg IV (or amyl nitrite)
  nebulizedBicarbonateGiven: boolean; // 3.75% or 4.2% NaHCO3
  inhaledBetaAgonistsGiven: boolean;
}

export interface PatientToxicGasState {
  patientAge: number;
  gasAgent: ToxicGasAgent;
  exposureDosePpm: number;
  exposureDurationMinutes: number;
  timeSinceExposureHours: number; // vital for Phosgene latent period (4-24h)

  // Concomitant Smoke / Hemoglobin Bindings
  concomitantCarbonMonoxidePresent: boolean;
  carboxyhemoglobinPercent: number; // COHb %
  methemoglobinPercent: number; // MetHb %

  // Cellular Energetics & Hemodynamics
  arterialLactateMmolL: number; // Surrogate for Cytochrome c Oxidase block (normal < 2)
  svo2Percent: number; // Mixed venous O2 saturation (elevated > 85-90% in histotoxic hypoxia)
  arterialPo2MmHg: number; // Often normal in pure histotoxic asphyxia, low in irritant ARDS
  systolicBpMmHg: number;
  heartRateBpm: number;

  // Pulmonary Mechanics & Edema
  lungWaterEdemaIndex: number; // 0 (dry normal) to 10 (fulminant pulmonary edema)
  stridorAndUpperAirwayCompromise: boolean;

  // Active Antidotes
  activeAntidotes: AntidoteState;
}

export interface CellularAsphyxiationAudit {
  cytochromeInhibitionPercent: number;
  isHistotoxicHypoxia: boolean;
  lactateToxicitySeverity: 'Normal / Mild' | 'Moderate Cytotoxic Strain' | 'Profound Cytotoxic Lactic Acidosis';
  cellularSummary: string;
}

export interface IrritantGasArdsAudit {
  airwayBurnSeverity: 'None / Minimal' | 'Moderate Tracheobronchial' | 'Severe Alveolocapillary Disruption';
  latentPhaseActive: boolean;
  projectedArdsRiskPercent: number;
  pulmonaryEdemaSummary: string;
}

export interface AntidoteSafetyAudit {
  recommendedFirstLineAntidote: string;
  contraindicatedAntidotes: string[];
  antidoteEfficacyPercent: number;
  actionableProtocolSteps: string[];
}

export interface ToxicGasScenario {
  id: string;
  name: string;
  patientSummary: string;
  initialState: PatientToxicGasState;
  clinicalPearls: string[];
}

/**
 * 1. Calculate Cellular Histotoxic Asphyxiation (Complex IV Blockade)
 */
export function calculateCellularAsphyxiation(state: PatientToxicGasState): CellularAsphyxiationAudit {
  const { gasAgent, arterialLactateMmolL: lactate, svo2Percent: svo2, activeAntidotes } = state;

  let baseInhibition = 0;
  if (gasAgent === 'cyanide' || gasAgent === 'hydrogen_sulfide_h2s') {
    // Lactate is direct functional surrogate for Cytochrome c Oxidase shutdown
    baseInhibition = Math.min(98, Math.round(lactate * 8.5));
  } else {
    baseInhibition = 5; // Irritant gases primarily cause pulmonary/ARDS injury, not primary Complex IV block
  }

  // Antidote Relief Factor
  let reliefFraction = 0;
  if (gasAgent === 'cyanide') {
    if (activeAntidotes.hydroxocobalaminGrams >= 5) reliefFraction += 0.70;
    if (activeAntidotes.sodiumThiosulfateGiven) reliefFraction += 0.25;
  } else if (gasAgent === 'hydrogen_sulfide_h2s') {
    if (activeAntidotes.sodiumNitriteGiven) reliefFraction += 0.75;
  }

  const cytochromeInhibitionPercent = Math.max(0, Math.round(baseInhibition * (1 - reliefFraction)));
  const isHistotoxicHypoxia = (gasAgent === 'cyanide' || gasAgent === 'hydrogen_sulfide_h2s') && svo2 >= 85 && lactate >= 6;

  let lactateToxicitySeverity: CellularAsphyxiationAudit['lactateToxicitySeverity'] = 'Normal / Mild';
  if (lactate >= 10) lactateToxicitySeverity = 'Profound Cytotoxic Lactic Acidosis';
  else if (lactate >= 5) lactateToxicitySeverity = 'Moderate Cytotoxic Strain';

  let cellularSummary = 'Cellular respiration intact. Oxidative phosphorylation functioning normally.';
  if (cytochromeInhibitionPercent >= 60) {
    cellularSummary = `SEVERE MITOCHONDRIAL ARREST: Cytochrome c Oxidase inhibited by ${cytochromeInhibitionPercent}%. Cells unable to utilize oxygen despite normal arterial PO2 (SvO2 ${svo2}%, Lactate ${lactate} mmol/L).`;
  } else if (cytochromeInhibitionPercent >= 25) {
    cellularSummary = `Partial mitochondrial inhibition (${cytochromeInhibitionPercent}%). Active anaerobic glycolysis yielding lactic acidosis.`;
  }

  return {
    cytochromeInhibitionPercent,
    isHistotoxicHypoxia,
    lactateToxicitySeverity,
    cellularSummary,
  };
}

/**
 * 2. Audit Irritant Inhalation Injury & Latent Phosgene ARDS
 */
export function auditIrritantPulmonaryInjury(state: PatientToxicGasState): IrritantGasArdsAudit {
  const { gasAgent, timeSinceExposureHours: timeHr, lungWaterEdemaIndex: edema, activeAntidotes } = state;

  let airwayBurnSeverity: IrritantGasArdsAudit['airwayBurnSeverity'] = 'None / Minimal';
  let latentPhaseActive = false;
  let projectedArdsRiskPercent = 0;
  let pulmonaryEdemaSummary = 'No significant alveolar-capillary barrier disruption detected.';

  if (gasAgent === 'chlorine_gas') {
    airwayBurnSeverity = edema > 5 ? 'Severe Alveolocapillary Disruption' : 'Moderate Tracheobronchial';
    projectedArdsRiskPercent = Math.min(95, edema * 12);
    pulmonaryEdemaSummary = activeAntidotes.nebulizedBicarbonateGiven
      ? 'Hydrochloric/hypochlorous acid partially neutralized by nebulized bicarbonate. Monitor for bronchospasm.'
      : 'Chlorine reacts with airway moisture to form hydrochloric acid (HCl) and hypochlorous acid (HOCl), inducing immediate mucosal necrosis and non-cardiogenic pulmonary edema.';
  } else if (gasAgent === 'phosgene') {
    // Phosgene is poorly water soluble; deep alveolar penetration with a deceptive 4-24h latent phase
    if (timeHr >= 4 && timeHr <= 24 && edema < 6) {
      latentPhaseActive = true;
    }
    projectedArdsRiskPercent = Math.min(99, Math.round(timeHr * 8 + edema * 10));
    airwayBurnSeverity = edema > 4 ? 'Severe Alveolocapillary Disruption' : 'Moderate Tracheobronchial';
    pulmonaryEdemaSummary = latentPhaseActive
      ? `DECEPTIVE PHOSGENE LATENT PHASE: Patient currently at hour ${timeHr}. Alveolar acylation occurring silently. Mandatory ICU observation; explosive non-cardiogenic pulmonary edema impending within 12-24 hours.`
      : `Fulminant phosgene alveolar flooding (Lung Edema Score ${edema}/10). Alveolocapillary membrane destroyed; high-PEEP lung-protective mechanical ventilation required.`;
  }

  return {
    airwayBurnSeverity,
    latentPhaseActive,
    projectedArdsRiskPercent,
    pulmonaryEdemaSummary,
  };
}

/**
 * 3. Evaluate Antidote Indications, Contraindications & MetHb Kinetics
 */
export function evaluateAntidoteSafety(state: PatientToxicGasState): AntidoteSafetyAudit {
  const { gasAgent, concomitantCarbonMonoxidePresent, carboxyhemoglobinPercent, activeAntidotes } = state;

  const contraindicatedAntidotes: string[] = [];
  const actionableProtocolSteps: string[] = [];
  let recommendedFirstLineAntidote = 'Supportive care & high-flow oxygen.';
  let antidoteEfficacyPercent = 0;

  if (gasAgent === 'cyanide') {
    recommendedFirstLineAntidote = 'Hydroxocobalamin (Cyanokit 5g IV over 15 min)';
    actionableProtocolSteps.push('1. Administer Hydroxocobalamin 5g IV infusion over 15 minutes (binds CN- to form nontoxic cyanocobalamin).');
    actionableProtocolSteps.push('2. Administer Sodium Thiosulfate 12.5g IV (rhodanese sulfur donor for thiocyanate clearance).');

    // Check Nitrite Contraindication in Smoke / CO
    if (concomitantCarbonMonoxidePresent || carboxyhemoglobinPercent > 10) {
      contraindicatedAntidotes.push(
        'STRICT CONTRAINDICATION: Sodium Nitrite / Amyl Nitrite. In smoke inhalation with concomitant Carbon Monoxide (COHb ' +
          carboxyhemoglobinPercent +
          '%), inducing methemoglobinemia lethally eliminates remaining blood oxygen-carrying capacity!'
      );
    }

    if (activeAntidotes.hydroxocobalaminGrams >= 5) antidoteEfficacyPercent += 70;
    if (activeAntidotes.sodiumThiosulfateGiven) antidoteEfficacyPercent += 25;
  } else if (gasAgent === 'hydrogen_sulfide_h2s') {
    recommendedFirstLineAntidote = 'Sodium Nitrite 300mg IV (Target MetHb 15-25%)';
    actionableProtocolSteps.push('1. Immediately administer Sodium Nitrite 300mg IV to generate Methemoglobin (Fe3+), which extracts sulfide from Cytochrome c Oxidase.');
    actionableProtocolSteps.push('2. Provide 100% normobaric or hyperbaric oxygen (HBOT).');
    actionableProtocolSteps.push('3. Note: Hydroxocobalamin has poor binding affinity for H2S and is not a substitute for nitrites.');

    if (activeAntidotes.sodiumNitriteGiven) antidoteEfficacyPercent = 85;
  } else if (gasAgent === 'chlorine_gas') {
    recommendedFirstLineAntidote = 'Nebulized Sodium Bicarbonate (3.75%-4.2%) + Inhaled Beta-Agonists';
    actionableProtocolSteps.push('1. Administer Nebulized Sodium Bicarbonate (3.75% to 4.2% solution) to neutralize mucosal acid formation.');
    actionableProtocolSteps.push('2. Inhaled Albuterol + Ipratropium for acute reactive airway bronchospasm.');
    actionableProtocolSteps.push('3. Systemic IV corticosteroids (Methylprednisolone 1-2 mg/kg) to mitigate delayed inflammatory alveolitis.');

    if (activeAntidotes.nebulizedBicarbonateGiven) antidoteEfficacyPercent += 60;
    if (activeAntidotes.inhaledBetaAgonistsGiven) antidoteEfficacyPercent += 30;
  } else if (gasAgent === 'phosgene') {
    recommendedFirstLineAntidote = 'Strict Absolute Bedrest, Prophylactic PEEP/CPAP & IV N-Acetylcysteine';
    actionableProtocolSteps.push('1. Enforce STRICT ABSOLUTE BEDREST (any physical exertion precipitates sudden, fatal alveolar flooding).');
    actionableProtocolSteps.push('2. Initiate prophylactic CPAP / PEEP (5-10 cmH2O) to stent alveoli before clinical pulmonary edema manifests.');
    actionableProtocolSteps.push('3. Restrict IV fluids to avoid accelerating capillary extravasation.');

    antidoteEfficacyPercent = 65; // Supportive / mechanical mitigation
  }

  return {
    recommendedFirstLineAntidote,
    contraindicatedAntidotes,
    antidoteEfficacyPercent: Math.min(100, antidoteEfficacyPercent),
    actionableProtocolSteps,
  };
}

/**
 * 4. High-Acuity Toxic Gas Inhalation Clinical Scenarios Catalog
 */
export const TOXIC_GAS_SCENARIOS: Record<string, ToxicGasScenario> = {
  smoke_inhalation_cyanide: {
    id: 'smoke_inhalation_cyanide',
    name: '1. Industrial Fire: Cyanide Smoke Inhalation (Nitrite Hazard)',
    patientSummary:
      '42yo male recovered unconscious from a burning plastics warehouse. Severe soot in oropharynx, carboxyhemoglobin 24%, arterial lactate 13.8 mmol/L, SvO2 92% (severe histotoxic uncoupling), SBP 76/40 mmHg. Nitrites strictly contraindicated.',
    initialState: {
      patientAge: 42,
      gasAgent: 'cyanide',
      exposureDosePpm: 250,
      exposureDurationMinutes: 20,
      timeSinceExposureHours: 0.5,
      concomitantCarbonMonoxidePresent: true,
      carboxyhemoglobinPercent: 24,
      methemoglobinPercent: 1.2,
      arterialLactateMmolL: 13.8,
      svo2Percent: 92,
      arterialPo2MmHg: 185,
      systolicBpMmHg: 76,
      heartRateBpm: 124,
      lungWaterEdemaIndex: 2,
      stridorAndUpperAirwayCompromise: true,
      activeAntidotes: {
        hydroxocobalaminGrams: 0,
        sodiumThiosulfateGiven: false,
        sodiumNitriteGiven: false,
        nebulizedBicarbonateGiven: false,
        inhaledBetaAgonistsGiven: false,
      },
    },
    clinicalPearls: [
      'In smoke inhalation fires with synthetic polymers, Cyanide toxicity occurs concurrently with Carbon Monoxide.',
      'Sodium Nitrite is LETHAL here: converting hemoglobin to methemoglobin when 24% is already carboxyhemoglobin eliminates oxygen transport and causes immediate hypoxic death.',
      'Hydroxocobalamin (Cyanokit 5g) is the non-toxic, lifesaving antidote of choice.',
    ],
  },
  sewer_h2s_knockdown: {
    id: 'sewer_h2s_knockdown',
    name: '2. Sewer Gas: Hydrogen Sulfide (H2S) Sudden Knockdown',
    patientSummary:
      '38yo sanitation worker entered manure pit, collapsed instantly ("knockdown"). Olfactory fatigue masked lethal concentration. Lactate 11.2 mmol/L, coma, cyanosis, no carbon monoxide. Requires emergent Sodium Nitrite to generate methemoglobin.',
    initialState: {
      patientAge: 38,
      gasAgent: 'hydrogen_sulfide_h2s',
      exposureDosePpm: 600,
      exposureDurationMinutes: 10,
      timeSinceExposureHours: 0.3,
      concomitantCarbonMonoxidePresent: false,
      carboxyhemoglobinPercent: 1.0,
      methemoglobinPercent: 0.8,
      arterialLactateMmolL: 11.2,
      svo2Percent: 88,
      arterialPo2MmHg: 95,
      systolicBpMmHg: 82,
      heartRateBpm: 110,
      lungWaterEdemaIndex: 3,
      stridorAndUpperAirwayCompromise: false,
      activeAntidotes: {
        hydroxocobalaminGrams: 0,
        sodiumThiosulfateGiven: false,
        sodiumNitriteGiven: false,
        nebulizedBicarbonateGiven: false,
        inhaledBetaAgonistsGiven: false,
      },
    },
    clinicalPearls: [
      'Hydrogen sulfide inhibits Cytochrome c Oxidase similarly to Cyanide but has low affinity for Hydroxocobalamin.',
      'Sodium Nitrite 300mg IV produces methemoglobin (Fe3+), which competes with Cytochrome c Oxidase for sulfide, restoring cellular respiration.',
      'Olfactory nerve paralysis occurs rapidly at > 100-150 ppm, falsely reassuring victims before respiratory arrest.',
    ],
  },
  chlorine_industrial_spill: {
    id: 'chlorine_industrial_spill',
    name: '3. Chlorine Tanker Rupture: Acidic Airway Burn & Bronchospasm',
    patientSummary:
      '29yo chemical plant worker exposed to green-yellow chlorine cloud. Immediate intense ocular/pharyngeal burning, severe wheezing, stridor, and dyspnea. PaO2 58 mmHg on room air. Needs Nebulized Sodium Bicarbonate.',
    initialState: {
      patientAge: 29,
      gasAgent: 'chlorine_gas',
      exposureDosePpm: 80,
      exposureDurationMinutes: 15,
      timeSinceExposureHours: 1.0,
      concomitantCarbonMonoxidePresent: false,
      carboxyhemoglobinPercent: 0.8,
      methemoglobinPercent: 0.5,
      arterialLactateMmolL: 2.8,
      svo2Percent: 68,
      arterialPo2MmHg: 58,
      systolicBpMmHg: 136,
      heartRateBpm: 128,
      lungWaterEdemaIndex: 6,
      stridorAndUpperAirwayCompromise: true,
      activeAntidotes: {
        hydroxocobalaminGrams: 0,
        sodiumThiosulfateGiven: false,
        sodiumNitriteGiven: false,
        nebulizedBicarbonateGiven: false,
        inhaledBetaAgonistsGiven: true,
      },
    },
    clinicalPearls: [
      'Chlorine dissolves in epithelial lining fluid to generate hypochlorous acid (HOCl) and hydrochloric acid (HCl).',
      'Nebulized 3.75% to 4.2% Sodium Bicarbonate neutralizes generated acid in the tracheobronchial tree.',
      'Early intubation is mandatory if progressive laryngeal stridor or hoarseness develops.',
    ],
  },
  phosgene_delayed_pulmonary_edema: {
    id: 'phosgene_delayed_pulmonary_edema',
    name: '4. Phosgene Exposure: The Lethal 8-Hour Silent Latent Phase',
    patientSummary:
      '46yo industrial chemist smelled freshly mown hay 7 hours ago. Initially felt fine with minimal cough. Now presenting at hour 7 with sudden chest tightness, explosive cough, hemoconcentration, and bilateral alveolar infiltrates.',
    initialState: {
      patientAge: 46,
      gasAgent: 'phosgene',
      exposureDosePpm: 40,
      exposureDurationMinutes: 30,
      timeSinceExposureHours: 7.0,
      concomitantCarbonMonoxidePresent: false,
      carboxyhemoglobinPercent: 0.6,
      methemoglobinPercent: 0.4,
      arterialLactateMmolL: 3.4,
      svo2Percent: 70,
      arterialPo2MmHg: 52,
      systolicBpMmHg: 92,
      heartRateBpm: 130,
      lungWaterEdemaIndex: 8,
      stridorAndUpperAirwayCompromise: false,
      activeAntidotes: {
        hydroxocobalaminGrams: 0,
        sodiumThiosulfateGiven: false,
        sodiumNitriteGiven: false,
        nebulizedBicarbonateGiven: false,
        inhaledBetaAgonistsGiven: false,
      },
    },
    clinicalPearls: [
      'Phosgene is poorly water-soluble and causes virtually no initial upper airway burning, giving false reassurance.',
      'The silent latent phase lasts 4-24 hours before catastrophic capillary leak and non-cardiogenic pulmonary edema.',
      'Any physical exertion during the latent phase exponentially increases mortality. Strict mandatory rest and early prophylactic CPAP/PEEP are lifesaving.',
    ],
  },
};
