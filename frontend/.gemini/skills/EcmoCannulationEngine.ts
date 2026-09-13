/**
 * EcmoCannulationEngine.ts
 *
 * Biophysical Simulation Engine for Extracorporeal Membrane Oxygenation (ECMO):
 * VV vs VA vs VAV Hybrid Configurations, The Harlequin (North-South) Syndrome,
 * Right Radial Arterial Line Monitoring Rule, LV Afterload & Overdistension (ECPELLA Venting),
 * and Distal Perfusion Catheter (DPC) Limb Salvage.
 *
 * Location: frontend/.gemini/skills/EcmoCannulationEngine.ts
 */

export type EcmoModality =
  | 'VV_RESPIRATORY'
  | 'VA_CARDIOCIRCULATORY'
  | 'VAV_HYBRID_TRIPLE'
  | 'VVA_DUAL_DRAINAGE';

export type CannulationGeometry =
  | 'FEM_FEM_PERIPHERAL'
  | 'FEM_FEM_WITH_DPC'
  | 'FEM_IJ_BIFEMORAL'
  | 'AVALON_DUAL_LUMEN_IJ'
  | 'CENTRAL_AORTIC_RIGHT_ATRIAL';

export type LvVentingStrategy =
  | 'NONE_UNVENTED'
  | 'IMPELLA_ECPELLA'
  | 'SURGICAL_LV_VENT'
  | 'ATRIAL_SEPTOSTOMY';

export type ArterialLineMonitoringSite =
  | 'RIGHT_RADIAL_MANDATORY'
  | 'LEFT_RADIAL'
  | 'FEMORAL_ARTERY';

export interface EcmoPatientParams {
  modality: EcmoModality;
  cannulation: CannulationGeometry;
  ecmoBloodFlowLpm: number;
  sweepGasFlowLpm: number;
  membraneFio2: number;
  nativeCardiacOutputLpm: number;
  nativeLungPaO2MmHg: number;
  artLineSite: ArterialLineMonitoringSite;
  distalPerfusionCatheterInPlace: boolean;
  lvVenting: LvVentingStrategy;
  aorticValveOpening: boolean;
  pao2Fio2Ratio: number;
}

export interface EcmoSimulationResult {
  harlequinSyndromeActive: boolean;
  harlequinSeverity: 'NONE' | 'MILD_MIXING_ZONE' | 'CRITICAL_CEREBRAL_CORONARY_HYPOXIA';
  mixingZoneLocation: string;
  coronaryCerebralPaO2MmHg: number;
  subdiaphragmaticPaO2MmHg: number;
  lvDistensionRisk: 'LOW' | 'MODERATE' | 'CRITICAL_PULMONARY_EDEMA';
  distalLimbIschemiaRisk: 'PROTECTED' | 'CRITICAL_LIMB_THREAT';
  recirculationFractionPercent: number;
  systemicOxygenDeliveryDo2MlMin: number;
  safetyScore: number;
  criticalAlerts: string[];
  physiologicMechanisms: string[];
  stepByStepProtocol: string[];
  contraindicationFlags: {
    harlequinDisasterActive: boolean;
    unventedLvDistensionHazard: boolean;
    distalLimbIschemiaHazard: boolean;
    misleadingLeftRadialArtLine: boolean;
  };
}

/**
 * Calculates dual-circulation hemodynamics and gas exchange in ECMO
 */
export function simulateEcmoWorkstation(params: EcmoPatientParams): EcmoSimulationResult {
  // 1. Compute Post-Membrane ECMO Gas Tension
  const ecmoPostMembranePaO2 = Math.round(params.membraneFio2 * 450);

  // 2. Subdiaphragmatic (South) Circulation
  let subdiaphragmaticPaO2MmHg = ecmoPostMembranePaO2;
  if (params.modality === 'VV_RESPIRATORY') {
    subdiaphragmaticPaO2MmHg = Math.round(params.nativeLungPaO2MmHg * 0.4 + ecmoPostMembranePaO2 * 0.6);
  }

  // 3. Harlequin (North-South) Syndrome Detection (in VA-ECMO with peripheral femoral cannulation)
  let harlequinSyndromeActive = false;
  let harlequinSeverity: EcmoSimulationResult['harlequinSeverity'] = 'NONE';
  let mixingZoneLocation = 'N/A (Single Circulation)';
  let coronaryCerebralPaO2MmHg = ecmoPostMembranePaO2;

  if (
    params.modality === 'VA_CARDIOCIRCULATORY' &&
    (params.cannulation === 'FEM_FEM_PERIPHERAL' || params.cannulation === 'FEM_FEM_WITH_DPC')
  ) {
    // If native heart is ejecting against poor lung oxygenation:
    const isNativeLVEjecting = params.nativeCardiacOutputLpm >= 1.5;
    const isLungHypoxic = params.nativeLungPaO2MmHg < 65;

    if (isNativeLVEjecting && isLungHypoxic) {
      harlequinSyndromeActive = true;
      coronaryCerebralPaO2MmHg = Math.round(params.nativeLungPaO2MmHg);

      if (params.nativeCardiacOutputLpm >= 3.0 && params.nativeLungPaO2MmHg < 55) {
        harlequinSeverity = 'CRITICAL_CEREBRAL_CORONARY_HYPOXIA';
        mixingZoneLocation = 'Distal Descending Thoracic Aorta (Diaphragm level) - Upper body completely hypoxic!';
      } else {
        harlequinSeverity = 'MILD_MIXING_ZONE';
        mixingZoneLocation = 'Aortic Arch / Mid-Descending Aorta';
      }
    } else if (isNativeLVEjecting && !isLungHypoxic) {
      coronaryCerebralPaO2MmHg = Math.round(params.nativeLungPaO2MmHg);
      mixingZoneLocation = 'Ascending Aorta (Both circulations normoxic)';
    } else {
      // Stunned LV, ECMO provides 100% flow retrograde to aortic root
      coronaryCerebralPaO2MmHg = ecmoPostMembranePaO2;
      mixingZoneLocation = 'Aortic Root (Complete ECMO retrograde perfusion)';
    }
  } else if (params.modality === 'VAV_HYBRID_TRIPLE') {
    // VAV pre-oxygenates native RV/LV, curing Harlequin!
    coronaryCerebralPaO2MmHg = Math.round(Math.max(85, params.nativeLungPaO2MmHg + 50));
    mixingZoneLocation = 'Aortic Root (VAV hybrid delivers pink blood to native right heart)';
    harlequinSyndromeActive = false;
    harlequinSeverity = 'NONE';
  } else if (params.modality === 'VV_RESPIRATORY') {
    coronaryCerebralPaO2MmHg = subdiaphragmaticPaO2MmHg;
    mixingZoneLocation = 'Pulmonary Circulation (Serial gas exchange)';
  } else if (params.cannulation === 'CENTRAL_AORTIC_RIGHT_ATRIAL') {
    coronaryCerebralPaO2MmHg = ecmoPostMembranePaO2;
    mixingZoneLocation = 'Ascending Aorta (Anterograde central cannulation)';
  }

  // 4. Arterial Line Monitoring Trap
  const misleadingLeftRadialArtLine =
    harlequinSyndromeActive && params.artLineSite !== 'RIGHT_RADIAL_MANDATORY';

  // 5. LV Distension Risk in VA-ECMO
  let lvDistensionRisk: EcmoSimulationResult['lvDistensionRisk'] = 'LOW';
  if (params.modality === 'VA_CARDIOCIRCULATORY' || params.modality === 'VAV_HYBRID_TRIPLE') {
    if (!params.aorticValveOpening && params.lvVenting === 'NONE_UNVENTED') {
      lvDistensionRisk = 'CRITICAL_PULMONARY_EDEMA';
    } else if (!params.aorticValveOpening && params.lvVenting !== 'NONE_UNVENTED') {
      lvDistensionRisk = 'LOW';
    } else if (params.ecmoBloodFlowLpm >= 4.5 && params.lvVenting === 'NONE_UNVENTED') {
      lvDistensionRisk = 'MODERATE';
    }
  }

  // 6. Distal Limb Ischemia Risk
  let distalLimbIschemiaRisk: EcmoSimulationResult['distalLimbIschemiaRisk'] = 'PROTECTED';
  const distalLimbIschemiaHazard =
    (params.cannulation === 'FEM_FEM_PERIPHERAL' || params.modality === 'VA_CARDIOCIRCULATORY') &&
    !params.distalPerfusionCatheterInPlace &&
    params.cannulation !== 'CENTRAL_AORTIC_RIGHT_ATRIAL';

  if (distalLimbIschemiaHazard) {
    distalLimbIschemiaRisk = 'CRITICAL_LIMB_THREAT';
  }

  // 7. Recirculation in VV-ECMO
  let recirculationFractionPercent = 12;
  if (params.modality === 'VV_RESPIRATORY') {
    if (params.cannulation === 'FEM_IJ_BIFEMORAL') {
      recirculationFractionPercent = Math.round(15 + (params.ecmoBloodFlowLpm / 6.0) * 20);
    } else if (params.cannulation === 'AVALON_DUAL_LUMEN_IJ') {
      recirculationFractionPercent = 8;
    }
  }

  // 8. Total Systemic Oxygen Delivery (DO2)
  const totalFlow =
    params.modality === 'VA_CARDIOCIRCULATORY'
      ? params.ecmoBloodFlowLpm + params.nativeCardiacOutputLpm * 0.4
      : params.nativeCardiacOutputLpm;
  const systemicOxygenDeliveryDo2MlMin = Math.round(totalFlow * 195);

  const criticalAlerts: string[] = [];
  const physiologicMechanisms: string[] = [];
  const stepByStepProtocol: string[] = [];

  // Critical Alerts Checks
  if (harlequinSeverity === 'CRITICAL_CEREBRAL_CORONARY_HYPOXIA') {
    criticalAlerts.push(
      `HARLEQUIN (NORTH-SOUTH) SYNDROME CATASTROPHE: Dual circulation phenomenon! Recovering native left ventricle is ejecting severely deoxygenated blood (PaO2 ${coronaryCerebralPaO2MmHg} mmHg) into aortic arch, starving the brain and coronary arteries of oxygen while the lower body is well-perfused by ECMO (PaO2 ${subdiaphragmaticPaO2MmHg} mmHg). Immediate conversion to VAV-ECMO or ventilator recruitment mandated!`
    );
  }

  if (misleadingLeftRadialArtLine) {
    criticalAlerts.push(
      'MONITORING PRACTICE ERROR: Arterial line placed in LEFT radial or femoral artery during peripheral VA-ECMO! In Harlequin syndrome, retrograde ECMO blood can falsely show 100% SpO2 in left arm and groin while the right arm, carotid, and brain suffer profound hypoxia. A RIGHT radial arterial line is mandatory!'
    );
  }

  if (lvDistensionRisk === 'CRITICAL_PULMONARY_EDEMA') {
    criticalAlerts.push(
      'CRITICAL LV OVERDISTENSION & HYDROSTATIC ARDS: Retrograde VA-ECMO arterial inflow has increased LV afterload beyond ejection capacity; aortic valve remains closed! Blood stagnates in left ventricle, spiking end-diastolic pressure (> 30 mmHg) and precipitating massive alveolar hemorrhage and LV thrombus. Immediate LV unloading (ECPELLA / Impella or septostomy) required!'
    );
  }

  if (distalLimbIschemiaHazard) {
    criticalAlerts.push(
      'DISTAL LIMB ISCHEMIA HAZARD: Large bore arterial cannula placed in common femoral artery without a distal perfusion catheter (DPC)! Occlusion of superficial femoral artery blood flow causes acute compartment syndrome, rhabdomyolysis, and limb loss in 20-30% of patients. Place a 6-8 Fr anterograde DPC immediately!'
    );
  }

  // Physiologic Mechanisms
  if (harlequinSyndromeActive) {
    physiologicMechanisms.push(
      `Two Watershed Circulations: Native cardiac output (${params.nativeCardiacOutputLpm} L/min) ejects poorly oxygenated blood from damaged lungs (PaO2 ${params.nativeLungPaO2MmHg} mmHg), which collides with retrograde ECMO flow (${params.ecmoBloodFlowLpm} L/min). The mixing zone lies in the ${mixingZoneLocation}, rendering the brachiocephalic and coronary arteries severely hypoxic.`
    );
  } else if (params.modality === 'VAV_HYBRID_TRIPLE') {
    physiologicMechanisms.push(
      'VAV-ECMO Hybrid Solution: A fraction of post-membrane oxygenated blood is split to a venous cannula in the right internal jugular vein. This raises mixed venous oxygen saturation entering the native right ventricle and pulmonary bed, ensuring the native LV ejects oxygen-rich blood into the coronary and cerebral circulations.'
    );
  }

  if (params.lvVenting === 'IMPELLA_ECPELLA') {
    physiologicMechanisms.push(
      'ECPELLA Mechanical Synergy: Transvalvular Impella continuously draws blood from LV cavity into ascending aorta, decompressing LV wall tension, reducing myocardial MVO2, and facilitating coronary microvascular perfusion despite retrograde ECMO afterload.'
    );
  }

  // Safety Score (0-100)
  let safetyScore = 100;
  if (harlequinSeverity === 'CRITICAL_CEREBRAL_CORONARY_HYPOXIA') safetyScore -= 50;
  if (misleadingLeftRadialArtLine) safetyScore -= 20;
  if (lvDistensionRisk === 'CRITICAL_PULMONARY_EDEMA') safetyScore -= 30;
  if (distalLimbIschemiaHazard) safetyScore -= 25;
  safetyScore = Math.max(0, Math.min(100, safetyScore));

  // Step-by-Step Clinical Protocol
  stepByStepProtocol.push(
    '1. Cannulation Confirmation & Baseline: Verify ECMO circuit integrity, circuit pressure drops (delta P < 50 mmHg), and target blood flow index (> 2.2 L/min/m2).'
  );

  if (params.modality === 'VA_CARDIOCIRCULATORY') {
    stepByStepProtocol.push(
      '2. Mandatory Right Radial Arterial Line: Place arterial line exclusively in RIGHT radial artery to sample pre-ductal innominate blood, guaranteeing early detection of upper-body hypoxemia.'
    );
    stepByStepProtocol.push(
      '3. Mandatory Distal Perfusion Catheter: Insert a 6-8 Fr anterograde catheter into superficial femoral artery (SFA) under duplex ultrasound guidance to maintain limb viability.'
    );

    if (harlequinSyndromeActive) {
      stepByStepProtocol.push(
        '4. Resolution of Harlequin Syndrome: Upgrade peripheral VA-ECMO to VAV-ECMO by adding a venous infusion cannula (15-17 Fr) in the right internal jugular vein, pre-oxygenating blood destined for the aortic arch.'
      );
    }

    if (lvDistensionRisk === 'CRITICAL_PULMONARY_EDEMA') {
      stepByStepProtocol.push(
        '5. Emergent LV Venting (ECPELLA): Insert transvalvular microaxial Impella pump or perform balloon atrial septostomy to unload the left ventricle and eliminate hydrostatic alveolar flooding.'
      );
    }
  } else {
    stepByStepProtocol.push(
      '2. VV-ECMO Ultra-Protective Ventilation: Rest lungs with Vt 4-6 mL/kg PBW, plateau pressure <= 25 cmH2O, PEEP 10-15 cmH2O, and respiratory rate 10-15/min to foster alveolar healing.'
    );
    stepByStepProtocol.push(
      '3. Recirculation Surveillance: Maintain >= 10-15 cm distance between drainage (femoral) and re-infusion (jugular) cannula tips to minimize futile recirculation of oxygenated blood.'
    );
  }

  return {
    harlequinSyndromeActive,
    harlequinSeverity,
    mixingZoneLocation,
    coronaryCerebralPaO2MmHg,
    subdiaphragmaticPaO2MmHg,
    lvDistensionRisk,
    distalLimbIschemiaRisk,
    recirculationFractionPercent,
    systemicOxygenDeliveryDo2MlMin,
    safetyScore,
    criticalAlerts,
    physiologicMechanisms,
    stepByStepProtocol,
    contraindicationFlags: {
      harlequinDisasterActive: harlequinSeverity === 'CRITICAL_CEREBRAL_CORONARY_HYPOXIA',
      unventedLvDistensionHazard: lvDistensionRisk === 'CRITICAL_PULMONARY_EDEMA',
      distalLimbIschemiaHazard,
      misleadingLeftRadialArtLine,
    },
  };
}

/**
 * Standard Clinical Presets
 */
export const ECMO_PRESETS: Record<string, EcmoPatientParams> = {
  vvArdsProtective: {
    modality: 'VV_RESPIRATORY',
    cannulation: 'FEM_IJ_BIFEMORAL',
    ecmoBloodFlowLpm: 4.5,
    sweepGasFlowLpm: 6.0,
    membraneFio2: 1.0,
    nativeCardiacOutputLpm: 5.5,
    nativeLungPaO2MmHg: 55,
    artLineSite: 'RIGHT_RADIAL_MANDATORY',
    distalPerfusionCatheterInPlace: false,
    lvVenting: 'NONE_UNVENTED',
    aorticValveOpening: true,
    pao2Fio2Ratio: 65,
  },
  harlequinNorthSouthCrisis: {
    modality: 'VA_CARDIOCIRCULATORY',
    cannulation: 'FEM_FEM_PERIPHERAL',
    ecmoBloodFlowLpm: 4.2,
    sweepGasFlowLpm: 5.0,
    membraneFio2: 1.0,
    nativeCardiacOutputLpm: 3.8, // Recovering heart ejecting hypoxic blood!
    nativeLungPaO2MmHg: 42, // Severe ARDS / wet lungs!
    artLineSite: 'RIGHT_RADIAL_MANDATORY',
    distalPerfusionCatheterInPlace: true,
    lvVenting: 'NONE_UNVENTED',
    aorticValveOpening: true,
    pao2Fio2Ratio: 50,
  },
  harlequinLeftRadialTrap: {
    modality: 'VA_CARDIOCIRCULATORY',
    cannulation: 'FEM_FEM_PERIPHERAL',
    ecmoBloodFlowLpm: 4.0,
    sweepGasFlowLpm: 5.0,
    membraneFio2: 1.0,
    nativeCardiacOutputLpm: 3.5,
    nativeLungPaO2MmHg: 45,
    artLineSite: 'LEFT_RADIAL', // MONITORING TRAP! Misses cerebral hypoxia!
    distalPerfusionCatheterInPlace: true,
    lvVenting: 'NONE_UNVENTED',
    aorticValveOpening: true,
    pao2Fio2Ratio: 52,
  },
  unventedLvOverdistension: {
    modality: 'VA_CARDIOCIRCULATORY',
    cannulation: 'FEM_FEM_WITH_DPC',
    ecmoBloodFlowLpm: 5.0,
    sweepGasFlowLpm: 6.0,
    membraneFio2: 1.0,
    nativeCardiacOutputLpm: 0.8, // Severely stunned LV!
    nativeLungPaO2MmHg: 60,
    artLineSite: 'RIGHT_RADIAL_MANDATORY',
    distalPerfusionCatheterInPlace: true,
    lvVenting: 'NONE_UNVENTED', // CRITICAL OVERDISTENSION!
    aorticValveOpening: false, // Closed aortic valve!
    pao2Fio2Ratio: 70,
  },
  vavHybridRescued: {
    modality: 'VAV_HYBRID_TRIPLE',
    cannulation: 'FEM_IJ_BIFEMORAL',
    ecmoBloodFlowLpm: 4.8,
    sweepGasFlowLpm: 6.5,
    membraneFio2: 1.0,
    nativeCardiacOutputLpm: 3.5,
    nativeLungPaO2MmHg: 48,
    artLineSite: 'RIGHT_RADIAL_MANDATORY',
    distalPerfusionCatheterInPlace: true,
    lvVenting: 'IMPELLA_ECPELLA',
    aorticValveOpening: true,
    pao2Fio2Ratio: 55,
  },
};
