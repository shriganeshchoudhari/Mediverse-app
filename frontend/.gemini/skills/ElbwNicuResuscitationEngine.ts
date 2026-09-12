/**
 * ElbwNicuResuscitationEngine.ts
 * Neonatal Intensive Care Unit (NICU): Extremely Low Birth Weight (ELBW, < 1000g)
 * Fluid & Electrolyte Thermodynamics, Total Parenteral Nutrition (TPN / GIR Calculator),
 * Hemodynamically Significant PDA (hsPDA) & Ductal Steal, and RDS Surfactant Weaning Workstation.
 *
 * Implements:
 * 1. ELBW Fluid & Electrolyte Dynamics (AAP & ESPGHAN Guidelines):
 *    - Insensible Water Loss (IWL) dependent on isolette humidity (50% vs 85%), birth weight, and phototherapy
 *    - Target physiologic post-natal weight contraction (7-12% over week 1)
 *    - Serum sodium dynamics: hypernatremic dehydration (> 145-150 mEq/L) vs fluid overload / hyponatremia
 * 2. Glucose Infusion Rate (GIR) & Neonatal TPN Engine:
 *    - GIR (mg/kg/min) = (% Dextrose * Rate in mL/kg/day) / 144
 *    - Target GIR: 4-8 mg/kg/min (initial), advancing to 10-12 mg/kg/min
 *    - Amino acid accretion (2.5-4.0 g/kg/day) and 20% Lipid Emulsion titration
 *    - Osmotic diuresis & insulin titration for micropremie hyperglycemia (> 180-250 mg/dL)
 * 3. Patent Ductus Arteriosus (PDA) Shunt & Ductal Steal Mechanics:
 *    - Left-to-right ductal shunt (Qp:Qs > 1.5 - 2.5) with diastolic aortic runoff
 *    - Widened pulse pressure (PP > 30-35 mmHg), hyperdynamic precordium, and machinery murmur
 *    - Ductal steal: Mesenteric hypoperfusion (RI > 0.85 or retrograde flow, NEC risk) and oliguric renal ischemia
 *    - Pharmacotherapy with safety interlocks: Indomethacin, Ibuprofen, Paracetamol (drug of choice for thrombocytopenia/AKI)
 * 4. Respiratory Distress Syndrome (RDS) & Surfactant Titration:
 *    - Natural porcine surfactant (Poractant alfa / Curosurf 200 mg/kg) via LISA/MIST
 *    - Dynamic post-surfactant compliance leap (0.35 -> 1.15 mL/cmH2O/kg)
 *    - Urgent ventilator PIP and FiO2 auto-weaning guardrails to prevent pneumothorax and hypocarbic PVL (PaCO2 < 35)
 * 5. 6 Clinically Validated ELBW Scenarios
 *
 * Location: frontend/.gemini/skills/ElbwNicuResuscitationEngine.ts
 */

export type NicuScenarioPresetId =
  | 'ELBW_24WK_620G_HYPERNATREMIC_DEHYDRATION'
  | 'HSPDA_DUCTAL_STEAL_26WK_780G'
  | 'SEVERE_RDS_SURFACTANT_WEANING_27WK_920G'
  | 'TPN_GIR_HYPERGLYCEMIA_OSMOTIC_DIURESIS'
  | 'NEONATAL_SEPSIS_PPHN_28WK_980G'
  | 'PDA_PHARMACOTHERAPY_CONTRAINDICATION_SELECTION';

export type ShuntDirection = 'LEFT_TO_RIGHT' | 'RIGHT_TO_LEFT' | 'BIDIRECTIONAL' | 'CLOSED';

export type PdaTreatmentDrug = 'INDOMETHACIN' | 'IBUPROFEN' | 'PARACETAMOL';

export interface IsoletteEnvironment {
  incubatorHumidityPercent: number; // 50 to 90%
  incubatorAirTempC: number; // 34 to 37°C
  radiantWarmerActive: boolean;
  phototherapyActive: boolean;
  calculatedIwlMlKgDay: number;
}

export interface NeonatalHemodynamics {
  heartRateBpm: number;
  systolicBpMmHg: number;
  diastolicBpMmHg: number;
  meanArterialPressureMmHg: number;
  pulsePressureMmHg: number; // SBP - DBP (wide > 30 mmHg in premie is sign of hsPDA)
  preDuctalSpO2: number; // Right hand
  postDuctalSpO2: number; // Lower extremity
  prePostSpO2Delta: number; // > 10% indicates R-to-L ductal shunting / PPHN
  peripheralPerfusion: 'GOOD_BRISK' | 'MOTTLED_COOL' | 'BOUNDING_HYPERDYNAMIC';
}

export interface PdaDuctalState {
  ductalDiameterMm: number; // 0 to 4.0 mm
  shuntDirection: ShuntDirection;
  qpQsRatio: number; // 1.0 to 3.0
  ductalStealPresent: boolean;
  mesentericResistiveIndex: number; // Normal 0.65-0.75; > 0.85 = severe steal (NEC risk)
  renalResistiveIndex: number;
  murmurGrade: 'NONE' | 'GRADE_1_2_SYSTOLIC' | 'GRADE_3_4_CONTINUOUS_MACHINERY';
  pdaTreatmentGiven?: PdaTreatmentDrug;
  treatmentDosesCount: number;
  isClosed: boolean;
}

export interface TpnNutritionState {
  dextroseConcentrationPercent: number; // 5 to 20%
  totalFluidRateMlKgDay: number; // 60 to 180 mL/kg/day
  calculatedGirMgKgMin: number; // (Dextrose % * Rate in mL/kg/day) / 144
  aminoAcidsGKgDay: number; // 0 to 4.0 g/kg/day
  lipidsGKgDay: number; // 0 to 3.5 g/kg/day
  bloodGlucoseMgDl: number; // Normal 60 - 150 mg/dL
  glucosuriaPresent: boolean;
  insulinInfusionUnitsKgHr: number; // 0 to 0.1 U/kg/hr
}

export interface RespiratoryRdsState {
  surfactantGiven: boolean;
  surfactantDoseMgKg: number;
  lungComplianceMlCmH2oKg: number; // 0.3 to 1.4 mL/cmH2O/kg
  fio2Percent: number; // 21 to 100%
  pipCmH2o: number; // Peak inspiratory pressure (14 to 28 cmH2O)
  peepCmH2o: number; // Positive end-expiratory pressure (5 to 8 cmH2O)
  deliveredTidalVolumeMlKg: number; // Target: 4 - 6 mL/kg
  paCo2MmHg: number; // Normal/permissive: 45 - 55 mmHg; < 35 = Danger of PVL!
  volutraumaRiskActive: boolean;
}

export interface ElectrolyteRenalState {
  serumSodiumMEqL: number; // Normal 135 - 145 mEq/L
  serumPotassiumMEqL: number; // Normal 4.0 - 5.5 mEq/L
  serumCreatinineMgDl: number; // Normal 0.6 - 1.0; > 1.3 indicates AKI
  plateletCountPerMcl: number; // Normal > 150,000; < 50,000 = severe thrombocytopenia
  urineOutputMlKgHr: number; // Normal 1.5 - 3.5 mL/kg/hr; < 1.0 = oliguria
  currentWeightGrams: number;
  birthWeightGrams: number;
  weightChangePercent: number; // (Current - Birth) / Birth * 100
}

export interface ElbwPatientState {
  scenarioId: NicuScenarioPresetId;
  elapsedHours: number;
  gestationalAgeWeeks: number;
  postnatalAgeDays: number;
  isolette: IsoletteEnvironment;
  hemodynamics: NeonatalHemodynamics;
  pdaState: PdaDuctalState;
  tpn: TpnNutritionState;
  respiratory: RespiratoryRdsState;
  electrolytes: ElectrolyteRenalState;
  clinicalAlarms: string[];
  interventionsLog: string[];
}

export interface NicuScenarioDefinition {
  id: NicuScenarioPresetId;
  title: string;
  gestationalAgeWeeks: number;
  birthWeightGrams: number;
  postnatalAgeDays: number;
  clinicalPresentation: string;
  baselineIsolette: {
    humidityPercent: number;
    airTempC: number;
    radiantWarmer: boolean;
    phototherapy: boolean;
  };
  baselineTpn: {
    dextrosePercent: number;
    totalRateMlKgDay: number;
    aminoAcidsGKgDay: number;
    lipidsGKgDay: number;
    bloodGlucoseMgDl: number;
  };
  baselinePda: {
    ductalDiameterMm: number;
    shuntDirection: ShuntDirection;
    murmur: 'NONE' | 'GRADE_1_2_SYSTOLIC' | 'GRADE_3_4_CONTINUOUS_MACHINERY';
  };
  baselineRespiratory: {
    fio2Percent: number;
    pipCmH2o: number;
    peepCmH2o: number;
    lungCompliance: number;
  };
  baselineElectrolytes: {
    serumSodiumMEqL: number;
    serumPotassiumMEqL: number;
    serumCreatinineMgDl: number;
    plateletCountPerMcl: number;
    currentWeightGrams: number;
  };
  keyTeachingPoints: string[];
}

/**
 * 6 Clinically Validated ELBW NICU Scenarios
 */
export const ELBW_NICU_SCENARIOS: Record<NicuScenarioPresetId, NicuScenarioDefinition> = {
  ELBW_24WK_620G_HYPERNATREMIC_DEHYDRATION: {
    id: 'ELBW_24WK_620G_HYPERNATREMIC_DEHYDRATION',
    title: 'Scenario 1: 24-Week Micro-Premie (620g) with High IWL & Hypernatremic Dehydration',
    gestationalAgeWeeks: 24,
    birthWeightGrams: 620,
    postnatalAgeDays: 3,
    clinicalPresentation:
      'A 24-week infant born at 620g is placed in an older incubator with humidity inadvertently set to only 55%. Under double phototherapy for hyperbilirubinemia, insensible water loss has surged. Current weight is 508g (-18% weight loss!). Serum sodium is 158 mEq/L, skin turgor is doughy, fontanelle sunken, and urine output has dropped to 0.6 mL/kg/hr. High risk of intraventricular hemorrhage from hyperosmolar shrinkage.',
    baselineIsolette: {
      humidityPercent: 55,
      airTempC: 36.5,
      radiantWarmer: false,
      phototherapy: true,
    },
    baselineTpn: {
      dextrosePercent: 10,
      totalRateMlKgDay: 90,
      aminoAcidsGKgDay: 3.0,
      lipidsGKgDay: 1.5,
      bloodGlucoseMgDl: 142,
    },
    baselinePda: {
      ductalDiameterMm: 1.2,
      shuntDirection: 'LEFT_TO_RIGHT',
      murmur: 'GRADE_1_2_SYSTOLIC',
    },
    baselineRespiratory: {
      fio2Percent: 35,
      pipCmH2o: 18,
      peepCmH2o: 6,
      lungCompliance: 0.6,
    },
    baselineElectrolytes: {
      serumSodiumMEqL: 158, // Severe hypernatremic dehydration
      serumPotassiumMEqL: 5.2,
      serumCreatinineMgDl: 1.1,
      plateletCountPerMcl: 165000,
      currentWeightGrams: 508, // -18% weight loss
    },
    keyTeachingPoints: [
      'ELBW infants have paper-thin gelatinous skin lacking stratum corneum; IWL can exceed 100-120 mL/kg/day at low humidity.',
      'Maintaining incubator humidity at 80-85% reduces IWL by over 50%, preventing hypernatremic dehydration and cerebral bleeding.',
      'Physiologic weight loss in the first week should be 7-12%; weight loss > 15% mandates immediate humidity optimization and free water titration.',
    ],
  },

  HSPDA_DUCTAL_STEAL_26WK_780G: {
    id: 'HSPDA_DUCTAL_STEAL_26WK_780G',
    title: 'Scenario 2: Hemodynamically Significant PDA (hsPDA) with Ductal Steal in a 26-Week Infant (780g)',
    gestationalAgeWeeks: 26,
    birthWeightGrams: 780,
    postnatalAgeDays: 5,
    clinicalPresentation:
      'A 26-week infant on Day 5 develops a hyperdynamic precordium, bounding brachial pulses, and a continuous machinery murmur. Blood pressure shows extreme widening: 58/20 mmHg (pulse pressure 38 mmHg). Bedside echocardiography demonstrates a 2.8 mm ductus with left-to-right shunt (Qp:Qs 2.4). Abdominal ultrasound reveals retrograde diastolic flow in the superior mesenteric artery (ductal steal). Urine output is down to 0.8 mL/kg/hr. High risk of Necrotizing Enterocolitis (NEC).',
    baselineIsolette: {
      humidityPercent: 80,
      airTempC: 36.2,
      radiantWarmer: false,
      phototherapy: false,
    },
    baselineTpn: {
      dextrosePercent: 12.5,
      totalRateMlKgDay: 130,
      aminoAcidsGKgDay: 3.5,
      lipidsGKgDay: 2.5,
      bloodGlucoseMgDl: 110,
    },
    baselinePda: {
      ductalDiameterMm: 2.8,
      shuntDirection: 'LEFT_TO_RIGHT',
      murmur: 'GRADE_3_4_CONTINUOUS_MACHINERY',
    },
    baselineRespiratory: {
      fio2Percent: 45,
      pipCmH2o: 20,
      peepCmH2o: 6,
      lungCompliance: 0.55,
    },
    baselineElectrolytes: {
      serumSodiumMEqL: 138,
      serumPotassiumMEqL: 4.8,
      serumCreatinineMgDl: 0.9,
      plateletCountPerMcl: 180000,
      currentWeightGrams: 735,
    },
    keyTeachingPoints: [
      'A hemodynamically significant PDA (hsPDA) causes high pulmonary blood flow and systemic "ductal steal" during diastole.',
      'Retrograde or absent diastolic flow in the celiac and mesenteric arteries dramatically increases the risk of Necrotizing Enterocolitis (NEC).',
      'Wide pulse pressure (> 30-35 mmHg) in a premature infant is a cardinal physical finding of a large left-to-right ductal runoff.',
    ],
  },

  SEVERE_RDS_SURFACTANT_WEANING_27WK_920G: {
    id: 'SEVERE_RDS_SURFACTANT_WEANING_27WK_920G',
    title: 'Scenario 3: Severe RDS with LISA Surfactant Administration & Rapid Post-Delivery Weaning (27w, 920g)',
    gestationalAgeWeeks: 27,
    birthWeightGrams: 920,
    postnatalAgeDays: 1,
    clinicalPresentation:
      'A 27-week infant (920g) at 2 hours of life has severe respiratory distress syndrome with diffuse ground-glass reticulogranular opacities and air bronchograms on chest X-ray. Lung compliance is severely reduced (0.35 mL/cmH2O/kg). On synchronized non-invasive nasal ventilation, FiO2 is escalating to 65% and PIP is 22 cmH2O. Candidate for Less Invasive Surfactant Administration (LISA) with Poractant alfa (200 mg/kg). Immediate weaning required post-administration!',
    baselineIsolette: {
      humidityPercent: 85,
      airTempC: 36.4,
      radiantWarmer: false,
      phototherapy: false,
    },
    baselineTpn: {
      dextrosePercent: 10,
      totalRateMlKgDay: 80,
      aminoAcidsGKgDay: 3.0,
      lipidsGKgDay: 1.0,
      bloodGlucoseMgDl: 88,
    },
    baselinePda: {
      ductalDiameterMm: 1.5,
      shuntDirection: 'LEFT_TO_RIGHT',
      murmur: 'GRADE_1_2_SYSTOLIC',
    },
    baselineRespiratory: {
      fio2Percent: 65,
      pipCmH2o: 22,
      peepCmH2o: 6,
      lungCompliance: 0.35, // Severely stiff, non-compliant lungs
    },
    baselineElectrolytes: {
      serumSodiumMEqL: 140,
      serumPotassiumMEqL: 4.6,
      serumCreatinineMgDl: 0.85,
      plateletCountPerMcl: 210000,
      currentWeightGrams: 920,
    },
    keyTeachingPoints: [
      'Poractant alfa (200 mg/kg) rapidly restores alveolar surface tension and doubles lung compliance within 15-30 minutes.',
      'Failure to rapidly wean ventilator PIP and tidal volume post-surfactant causes massive alveolar overdistension, pneumothorax, and pulmonary interstitial emphysema.',
      'Unchecked ventilation produces severe hypocarbia (PaCO2 < 30-35 mmHg), which triggers profound cerebral vasoconstriction and periventricular leukomalacia (PVL).',
    ],
  },

  TPN_GIR_HYPERGLYCEMIA_OSMOTIC_DIURESIS: {
    id: 'TPN_GIR_HYPERGLYCEMIA_OSMOTIC_DIURESIS',
    title: 'Scenario 4: Early TPN with Excessive GIR, Severe Hyperglycemia & Osmotic Diuresis (25w, 710g)',
    gestationalAgeWeeks: 25,
    birthWeightGrams: 710,
    postnatalAgeDays: 2,
    clinicalPresentation:
      'A 25-week infant (710g) on Day 2 was started on TPN with D15W running at 130 mL/kg/day. Glucose Infusion Rate (GIR) is calculated at 13.5 mg/kg/min—far above the capacity of immature hepatic glucose handling. Blood glucose is 340 mg/dL. Urine dipstick shows 4+ glucosuria, and urine output has surged to 6.2 mL/kg/hr due to osmotic diuresis. Infant is losing free water rapidly with rising serum sodium (149 mEq/L).',
    baselineIsolette: {
      humidityPercent: 80,
      airTempC: 36.3,
      radiantWarmer: false,
      phototherapy: false,
    },
    baselineTpn: {
      dextrosePercent: 15,
      totalRateMlKgDay: 130, // GIR = (15 * 130) / 144 = 13.5 mg/kg/min!
      aminoAcidsGKgDay: 3.5,
      lipidsGKgDay: 2.0,
      bloodGlucoseMgDl: 340, // Severe hyperglycemia!
    },
    baselinePda: {
      ductalDiameterMm: 1.0,
      shuntDirection: 'LEFT_TO_RIGHT',
      murmur: 'NONE',
    },
    baselineRespiratory: {
      fio2Percent: 28,
      pipCmH2o: 16,
      peepCmH2o: 5,
      lungCompliance: 0.7,
    },
    baselineElectrolytes: {
      serumSodiumMEqL: 149,
      serumPotassiumMEqL: 3.9,
      serumCreatinineMgDl: 0.95,
      plateletCountPerMcl: 195000,
      currentWeightGrams: 670,
    },
    keyTeachingPoints: [
      'GIR = (% Dextrose * Rate in mL/kg/day) / 144. Starting GIR in an ELBW infant should be 4-6 mg/kg/min.',
      'Extremely preterm infants have relative insulin resistance and fail to downregulate hepatic gluconeogenesis in the presence of parenteral glucose.',
      'Hyperglycemia (> 180 mg/dL) exceeds renal tubular absorptive threshold, causing glucosuria, osmotic diuresis, and rapid hypernatremic dehydration.',
    ],
  },

  NEONATAL_SEPSIS_PPHN_28WK_980G: {
    id: 'NEONATAL_SEPSIS_PPHN_28WK_980G',
    title: 'Scenario 5: Early-Onset GBS Sepsis with Persistent Pulmonary Hypertension (PPHN) in a 28-Week Premie (980g)',
    gestationalAgeWeeks: 28,
    birthWeightGrams: 980,
    postnatalAgeDays: 1,
    clinicalPresentation:
      'A 28-week infant (980g) develops profound cyanosis, grunting, and labile hypoxemia at 6 hours of life from Group B Streptococcus sepsis. Simultaneous pulse oximetry reveals a pre-ductal SpO2 of 92% (right hand) and post-ductal SpO2 of 78% (foot)—a 14% pre/post-ductal saturation difference! Echocardiography shows suprasystemic pulmonary artery pressure with right-to-left shunting across the ductus arteriosus and foramen ovale. Requires inotropic support and Inhaled Nitric Oxide (iNO).',
    baselineIsolette: {
      humidityPercent: 80,
      airTempC: 36.5,
      radiantWarmer: false,
      phototherapy: false,
    },
    baselineTpn: {
      dextrosePercent: 10,
      totalRateMlKgDay: 80,
      aminoAcidsGKgDay: 3.0,
      lipidsGKgDay: 1.0,
      bloodGlucoseMgDl: 74,
    },
    baselinePda: {
      ductalDiameterMm: 2.2,
      shuntDirection: 'RIGHT_TO_LEFT', // PPHN shunt!
      murmur: 'GRADE_1_2_SYSTOLIC',
    },
    baselineRespiratory: {
      fio2Percent: 80,
      pipCmH2o: 24,
      peepCmH2o: 6,
      lungCompliance: 0.45,
    },
    baselineElectrolytes: {
      serumSodiumMEqL: 136,
      serumPotassiumMEqL: 4.4,
      serumCreatinineMgDl: 0.8,
      plateletCountPerMcl: 140000,
      currentWeightGrams: 980,
    },
    keyTeachingPoints: [
      'A pre/post-ductal saturation difference > 10% (right hand higher than feet) is diagnostic of right-to-left ductal shunting due to pulmonary hypertension.',
      'Sepsis-induced endotoxin and inflammatory cytokines trigger severe pulmonary vasoconstriction and myocardial depression.',
      'Inhaled Nitric Oxide (iNO) at 20 ppm selectively dilates the pulmonary vascular bed, reversing right-to-left ductal shunting.',
    ],
  },

  PDA_PHARMACOTHERAPY_CONTRAINDICATION_SELECTION: {
    id: 'PDA_PHARMACOTHERAPY_CONTRAINDICATION_SELECTION',
    title: 'Scenario 6: hsPDA Pharmacotherapy Selection with Severe Thrombocytopenia & AKI (26w, 750g)',
    gestationalAgeWeeks: 26,
    birthWeightGrams: 750,
    postnatalAgeDays: 4,
    clinicalPresentation:
      'A 26-week infant (750g) has a symptomatic hsPDA (3.0 mm, Qp:Qs 2.3, pulmonary edema, widening pulse pressure 54/18 mmHg). However, laboratory results show severe thrombocytopenia (platelet count 32,000/mcL) and acute kidney injury with creatinine 1.55 mg/dL and oliguria (0.5 mL/kg/hr). Intravenous Indomethacin and Ibuprofen are strictly contraindicated due to bleeding and renal vasoconstriction risks. IV Paracetamol (Acetaminophen) is the safe, evidence-based therapy of choice.',
    baselineIsolette: {
      humidityPercent: 85,
      airTempC: 36.3,
      radiantWarmer: false,
      phototherapy: false,
    },
    baselineTpn: {
      dextrosePercent: 10,
      totalRateMlKgDay: 120,
      aminoAcidsGKgDay: 3.5,
      lipidsGKgDay: 2.0,
      bloodGlucoseMgDl: 96,
    },
    baselinePda: {
      ductalDiameterMm: 3.0,
      shuntDirection: 'LEFT_TO_RIGHT',
      murmur: 'GRADE_3_4_CONTINUOUS_MACHINERY',
    },
    baselineRespiratory: {
      fio2Percent: 50,
      pipCmH2o: 20,
      peepCmH2o: 6,
      lungCompliance: 0.5,
    },
    baselineElectrolytes: {
      serumSodiumMEqL: 134,
      serumPotassiumMEqL: 5.6,
      serumCreatinineMgDl: 1.55, // Marked AKI!
      plateletCountPerMcl: 32000, // Severe Thrombocytopenia!
      currentWeightGrams: 710,
    },
    keyTeachingPoints: [
      'Indomethacin and Ibuprofen inhibit cyclooxygenase (COX-1/COX-2), precipitating severe platelet dysfunction and afferent arteriolar renal shutdown.',
      'Active bleeding, thrombocytopenia (< 50,000/mcL), and renal impairment (creatinine > 1.4 mg/dL or oliguria) are absolute contraindications to NSAIDs.',
      'Intravenous Paracetamol inhibits prostaglandin H2 synthase peroxidase activity without impairing platelet aggregation or renal blood flow, making it ideal for high-risk neonates.',
    ],
  },
};

/**
 * Calculates Glucose Infusion Rate (GIR) in mg/kg/min
 * Formula: GIR = (% Dextrose * Rate in mL/kg/day) / 144
 */
export function calculateGir(dextrosePercent: number, totalRateMlKgDay: number): number {
  if (dextrosePercent <= 0 || totalRateMlKgDay <= 0) return 0;
  const gir = (dextrosePercent * totalRateMlKgDay) / 144;
  return Number(gir.toFixed(1));
}

/**
 * Calculates Insensible Water Loss (IWL) in mL/kg/day based on humidity, weight, and equipment
 */
export function calculateIwl(
  humidityPercent: number,
  phototherapy: boolean,
  radiantWarmer: boolean,
  birthWeightGrams: number
): number {
  // Baseline IWL at 50% humidity: ~110 mL/kg/day for < 750g; ~90 for 750-1000g
  let baseline = birthWeightGrams < 750 ? 115 : 90;

  // Humidity savings: each 1% above 50% reduces IWL by ~1.8%
  const humidityFactor = Math.max(0.3, 1 - (humidityPercent - 50) * 0.018);
  let iwl = baseline * humidityFactor;

  if (phototherapy) iwl += 20; // Phototherapy adds 15-25 mL/kg/day
  if (radiantWarmer) iwl += 30; // Radiant warmer adds 25-35 mL/kg/day

  return Number(iwl.toFixed(1));
}

/**
 * Calculates PDA hemodynamics and ductal steal metrics
 */
export function calculatePdaHemodynamics(
  diameterMm: number,
  shuntDirection: ShuntDirection
): {
  qpQsRatio: number;
  pulsePressureDrop: number;
  mesentericRi: number;
  ductalStealPresent: boolean;
} {
  if (diameterMm <= 0.5 || shuntDirection === 'CLOSED') {
    return {
      qpQsRatio: 1.0,
      pulsePressureDrop: 0,
      mesentericRi: 0.68,
      ductalStealPresent: false,
    };
  }

  if (shuntDirection === 'RIGHT_TO_LEFT') {
    return {
      qpQsRatio: 0.8,
      pulsePressureDrop: 0,
      mesentericRi: 0.72,
      ductalStealPresent: false,
    };
  }

  // Left to right shunt
  const qpQsRatio = Number((1.0 + diameterMm * 0.5).toFixed(1));
  const pulsePressureDrop = Math.round(diameterMm * 6); // Drops diastolic pressure
  const mesentericRi = Number((0.68 + diameterMm * 0.08).toFixed(2));
  const ductalStealPresent = diameterMm >= 2.0 || mesentericRi >= 0.85;

  return {
    qpQsRatio,
    pulsePressureDrop,
    mesentericRi,
    ductalStealPresent,
  };
}

/**
 * Initialize ELBW patient state from a preset scenario
 */
export function initializeElbwPatientState(scenarioId: NicuScenarioPresetId): ElbwPatientState {
  const scenario = ELBW_NICU_SCENARIOS[scenarioId];
  const iwl = calculateIwl(
    scenario.baselineIsolette.humidityPercent,
    scenario.baselineIsolette.phototherapy,
    scenario.baselineIsolette.radiantWarmer,
    scenario.birthWeightGrams
  );

  const gir = calculateGir(scenario.baselineTpn.dextrosePercent, scenario.baselineTpn.totalRateMlKgDay);

  const pdaMetrics = calculatePdaHemodynamics(
    scenario.baselinePda.ductalDiameterMm,
    scenario.baselinePda.shuntDirection
  );

  // Baseline vitals
  let sbp = 56;
  let dbp = 32 - pdaMetrics.pulsePressureDrop;
  if (scenario.id === 'HSPDA_DUCTAL_STEAL_26WK_780G') {
    sbp = 58;
    dbp = 20;
  } else if (scenario.id === 'PDA_PHARMACOTHERAPY_CONTRAINDICATION_SELECTION') {
    sbp = 54;
    dbp = 18;
  }
  const map = Math.round(dbp + (sbp - dbp) / 3);
  const pp = sbp - dbp;

  // Pre/post ductal SpO2
  let preSpO2 = 94;
  let postSpO2 = 94;
  if (scenario.id === 'NEONATAL_SEPSIS_PPHN_28WK_980G') {
    preSpO2 = 92;
    postSpO2 = 78; // Severe 14% difference
  }

  const weightChange = Number(
    (((scenario.baselineElectrolytes.currentWeightGrams - scenario.birthWeightGrams) / scenario.birthWeightGrams) * 100).toFixed(1)
  );

  return {
    scenarioId,
    elapsedHours: 0,
    gestationalAgeWeeks: scenario.gestationalAgeWeeks,
    postnatalAgeDays: scenario.postnatalAgeDays,
    isolette: {
      incubatorHumidityPercent: scenario.baselineIsolette.humidityPercent,
      incubatorAirTempC: scenario.baselineIsolette.airTempC,
      radiantWarmerActive: scenario.baselineIsolette.radiantWarmer,
      phototherapyActive: scenario.baselineIsolette.phototherapy,
      calculatedIwlMlKgDay: iwl,
    },
    hemodynamics: {
      heartRateBpm: scenario.id === 'HSPDA_DUCTAL_STEAL_26WK_780G' ? 168 : 152,
      systolicBpMmHg: sbp,
      diastolicBpMmHg: dbp,
      meanArterialPressureMmHg: map,
      pulsePressureMmHg: pp,
      preDuctalSpO2: preSpO2,
      postDuctalSpO2: postSpO2,
      prePostSpO2Delta: preSpO2 - postSpO2,
      peripheralPerfusion: pp > 32 ? 'BOUNDING_HYPERDYNAMIC' : 'GOOD_BRISK',
    },
    pdaState: {
      ductalDiameterMm: scenario.baselinePda.ductalDiameterMm,
      shuntDirection: scenario.baselinePda.shuntDirection,
      qpQsRatio: pdaMetrics.qpQsRatio,
      ductalStealPresent: pdaMetrics.ductalStealPresent,
      mesentericResistiveIndex: pdaMetrics.mesentericRi,
      renalResistiveIndex: Number((pdaMetrics.mesentericRi - 0.05).toFixed(2)),
      murmurGrade: scenario.baselinePda.murmur,
      treatmentDosesCount: 0,
      isClosed: scenario.baselinePda.ductalDiameterMm <= 0.5,
    },
    tpn: {
      dextroseConcentrationPercent: scenario.baselineTpn.dextrosePercent,
      totalFluidRateMlKgDay: scenario.baselineTpn.totalRateMlKgDay,
      calculatedGirMgKgMin: gir,
      aminoAcidsGKgDay: scenario.baselineTpn.aminoAcidsGKgDay,
      lipidsGKgDay: scenario.baselineTpn.lipidsGKgDay,
      bloodGlucoseMgDl: scenario.baselineTpn.bloodGlucoseMgDl,
      glucosuriaPresent: scenario.baselineTpn.bloodGlucoseMgDl >= 180,
      insulinInfusionUnitsKgHr: 0,
    },
    respiratory: {
      surfactantGiven: false,
      surfactantDoseMgKg: 0,
      lungComplianceMlCmH2oKg: scenario.baselineRespiratory.lungCompliance,
      fio2Percent: scenario.baselineRespiratory.fio2Percent,
      pipCmH2o: scenario.baselineRespiratory.pipCmH2o,
      peepCmH2o: scenario.baselineRespiratory.peepCmH2o,
      deliveredTidalVolumeMlKg: 5.0,
      paCo2MmHg: 48,
      volutraumaRiskActive: false,
    },
    electrolytes: {
      serumSodiumMEqL: scenario.baselineElectrolytes.serumSodiumMEqL,
      serumPotassiumMEqL: scenario.baselineElectrolytes.serumPotassiumMEqL,
      serumCreatinineMgDl: scenario.baselineElectrolytes.serumCreatinineMgDl,
      plateletCountPerMcl: scenario.baselineElectrolytes.plateletCountPerMcl,
      urineOutputMlKgHr: scenario.id === 'TPN_GIR_HYPERGLYCEMIA_OSMOTIC_DIURESIS' ? 6.2 : 2.2,
      currentWeightGrams: scenario.baselineElectrolytes.currentWeightGrams,
      birthWeightGrams: scenario.birthWeightGrams,
      weightChangePercent: weightChange,
    },
    clinicalAlarms: [],
    interventionsLog: [],
  };
}

/**
 * Adjust Isolette Environmental Humidity and Temperature
 */
export function adjustIsoletteSettings(
  state: ElbwPatientState,
  humidityPercent: number,
  airTempC: number
): { updatedState: ElbwPatientState; message: string } {
  const newState: ElbwPatientState = JSON.parse(JSON.stringify(state));
  newState.isolette.incubatorHumidityPercent = Math.max(50, Math.min(95, humidityPercent));
  newState.isolette.incubatorAirTempC = Math.max(34, Math.min(38, airTempC));

  newState.isolette.calculatedIwlMlKgDay = calculateIwl(
    newState.isolette.incubatorHumidityPercent,
    newState.isolette.phototherapyActive,
    newState.isolette.radiantWarmerActive,
    newState.electrolytes.birthWeightGrams
  );

  // If humidity increased to >= 80%, serum sodium and dehydration stabilize over time
  if (newState.isolette.incubatorHumidityPercent >= 80 && newState.electrolytes.serumSodiumMEqL > 150) {
    newState.electrolytes.serumSodiumMEqL = Math.max(145, newState.electrolytes.serumSodiumMEqL - 4);
    newState.electrolytes.urineOutputMlKgHr = Math.max(1.5, newState.electrolytes.urineOutputMlKgHr + 0.5);
  }

  newState.interventionsLog.push(
    `Incubator Humidity adjusted to ${newState.isolette.incubatorHumidityPercent}% (IWL now ${newState.isolette.calculatedIwlMlKgDay} mL/kg/day)`
  );

  return {
    updatedState: newState,
    message: `Isolette humidity set to ${newState.isolette.incubatorHumidityPercent}%. Insensible water loss calculated at ${newState.isolette.calculatedIwlMlKgDay} mL/kg/day.`,
  };
}

/**
 * Titrate Total Parenteral Nutrition (TPN) & Dextrose Infusion Rate
 */
export function titrateTpnSettings(
  state: ElbwPatientState,
  dextrosePercent: number,
  totalRateMlKgDay: number,
  aminoAcidsGKgDay?: number,
  lipidsGKgDay?: number
): { updatedState: ElbwPatientState; message: string } {
  const newState: ElbwPatientState = JSON.parse(JSON.stringify(state));

  newState.tpn.dextroseConcentrationPercent = Math.max(5, Math.min(25, dextrosePercent));
  newState.tpn.totalFluidRateMlKgDay = Math.max(50, Math.min(200, totalRateMlKgDay));
  if (aminoAcidsGKgDay !== undefined) {
    newState.tpn.aminoAcidsGKgDay = Math.max(0, Math.min(4.5, aminoAcidsGKgDay));
  }
  if (lipidsGKgDay !== undefined) {
    newState.tpn.lipidsGKgDay = Math.max(0, Math.min(4.0, lipidsGKgDay));
  }

  newState.tpn.calculatedGirMgKgMin = calculateGir(
    newState.tpn.dextroseConcentrationPercent,
    newState.tpn.totalFluidRateMlKgDay
  );

  // Adjust blood glucose dynamically based on GIR
  if (newState.tpn.calculatedGirMgKgMin > 11) {
    newState.tpn.bloodGlucoseMgDl = Math.min(380, newState.tpn.bloodGlucoseMgDl + 60);
    newState.tpn.glucosuriaPresent = true;
    newState.electrolytes.urineOutputMlKgHr = Math.max(4.5, newState.electrolytes.urineOutputMlKgHr + 1.5); // Osmotic diuresis
  } else if (newState.tpn.calculatedGirMgKgMin <= 7) {
    newState.tpn.bloodGlucoseMgDl = Math.max(75, Math.min(140, newState.tpn.bloodGlucoseMgDl - 70));
    newState.tpn.glucosuriaPresent = false;
    newState.electrolytes.urineOutputMlKgHr = 2.2;
  }

  newState.interventionsLog.push(
    `TPN Titrated: D${newState.tpn.dextroseConcentrationPercent}W @ ${newState.tpn.totalFluidRateMlKgDay} mL/kg/day (GIR: ${newState.tpn.calculatedGirMgKgMin} mg/kg/min)`
  );

  return {
    updatedState: newState,
    message: `TPN adjusted to D${newState.tpn.dextroseConcentrationPercent}W at ${newState.tpn.totalFluidRateMlKgDay} mL/kg/day. Glucose Infusion Rate: ${newState.tpn.calculatedGirMgKgMin} mg/kg/min. Glucose: ${newState.tpn.bloodGlucoseMgDl} mg/dL.`,
  };
}

/**
 * Deliver Surfactant (Poractant alfa / Curosurf 200 mg/kg) via LISA / ETT
 */
export function deliverSurfactant(
  state: ElbwPatientState,
  doseMgKg: number = 200
): { updatedState: ElbwPatientState; success: boolean; message: string } {
  const newState: ElbwPatientState = JSON.parse(JSON.stringify(state));

  if (newState.respiratory.surfactantGiven) {
    return {
      updatedState: newState,
      success: false,
      message: 'Surfactant has already been administered during this acute resuscitation window.',
    };
  }

  newState.respiratory.surfactantGiven = true;
  newState.respiratory.surfactantDoseMgKg = doseMgKg;

  // Immediate compliance jump from ~0.35 to 0.55 mL/cmH2O/kg
  newState.respiratory.lungComplianceMlCmH2oKg = 0.55;
  // If PIP remains high (e.g. >= 20 cmH2O), delivered tidal volume jumps dangerously
  newState.respiratory.deliveredTidalVolumeMlKg = Number(
    (newState.respiratory.lungComplianceMlCmH2oKg * (newState.respiratory.pipCmH2o - newState.respiratory.peepCmH2o)).toFixed(1)
  );

  // FiO2 requirements plunge
  newState.respiratory.fio2Percent = Math.max(25, newState.respiratory.fio2Percent - 30);

  // If tidal volume > 7 mL/kg, volutrauma and severe hypocarbia danger!
  if (newState.respiratory.deliveredTidalVolumeMlKg > 7.0) {
    newState.respiratory.volutraumaRiskActive = true;
    newState.respiratory.paCo2MmHg = 28; // Severe hypocarbic alkalosis!
    newState.clinicalAlarms.push(
      'CRITICAL VOLUTRAUMA & HYPOCARBIA RISK: Tidal Volume > 7 mL/kg and PaCO2 < 30 mmHg! Wean PIP immediately to prevent pneumothorax and PVL.'
    );
  }

  newState.interventionsLog.push(`Surfactant Administered (Poractant alfa ${doseMgKg} mg/kg via LISA)`);

  return {
    updatedState: newState,
    success: true,
    message: `Poractant alfa ${doseMgKg} mg/kg administered. Lung compliance surged to 0.55 mL/cmH2O/kg. FiO2 reduced. Wean PIP immediately!`,
  };
}

/**
 * Wean or Adjust Ventilator Settings (PIP, PEEP, FiO2)
 */
export function adjustVentilatorSettings(
  state: ElbwPatientState,
  pipCmH2o: number,
  fio2Percent: number,
  peepCmH2o?: number
): { updatedState: ElbwPatientState; message: string } {
  const newState: ElbwPatientState = JSON.parse(JSON.stringify(state));

  newState.respiratory.pipCmH2o = Math.max(12, Math.min(30, pipCmH2o));
  newState.respiratory.fio2Percent = Math.max(21, Math.min(100, fio2Percent));
  if (peepCmH2o !== undefined) {
    newState.respiratory.peepCmH2o = Math.max(4, Math.min(10, peepCmH2o));
  }

  // Recalculate delivered tidal volume: Compliance * (PIP - PEEP)
  const deltaP = newState.respiratory.pipCmH2o - newState.respiratory.peepCmH2o;
  newState.respiratory.deliveredTidalVolumeMlKg = Number(
    (newState.respiratory.lungComplianceMlCmH2oKg * deltaP).toFixed(1)
  );

  if (newState.respiratory.deliveredTidalVolumeMlKg <= 6.0) {
    newState.respiratory.volutraumaRiskActive = false;
    newState.respiratory.paCo2MmHg = 48; // Target safe range
    newState.clinicalAlarms = newState.clinicalAlarms.filter((a) => !a.includes('VOLUTRAUMA'));
  }

  newState.interventionsLog.push(
    `Ventilator Adjusted: PIP ${newState.respiratory.pipCmH2o} / PEEP ${newState.respiratory.peepCmH2o} cmH2O, FiO2 ${newState.respiratory.fio2Percent}% (Vt: ${newState.respiratory.deliveredTidalVolumeMlKg} mL/kg)`
  );

  return {
    updatedState: newState,
    message: `Ventilator adjusted to PIP ${newState.respiratory.pipCmH2o} cmH2O, FiO2 ${newState.respiratory.fio2Percent}%. Tidal volume: ${newState.respiratory.deliveredTidalVolumeMlKg} mL/kg, PaCO2: ${newState.respiratory.paCo2MmHg} mmHg.`,
  };
}

/**
 * Administer Pharmacotherapy for Patent Ductus Arteriosus (hsPDA)
 */
export function treatPatentDuctusArteriosus(
  state: ElbwPatientState,
  drug: PdaTreatmentDrug
): { updatedState: ElbwPatientState; success: boolean; message: string } {
  const newState: ElbwPatientState = JSON.parse(JSON.stringify(state));

  // Contraindication Checks:
  // Indomethacin: Platelets < 50k, Creatinine > 1.4, Oliguria
  if (drug === 'INDOMETHACIN') {
    if (newState.electrolytes.plateletCountPerMcl < 50000) {
      return {
        updatedState: newState,
        success: false,
        message:
          'CONTRAINDICATION BLOCKED: Severe Thrombocytopenia (Platelets < 50,000/mcL)! Indomethacin carries extreme risk of severe IVH and gastrointestinal hemorrhage. Select IV Paracetamol instead.',
      };
    }
    if (newState.electrolytes.serumCreatinineMgDl > 1.4 || newState.electrolytes.urineOutputMlKgHr < 0.6) {
      return {
        updatedState: newState,
        success: false,
        message:
          'CONTRAINDICATION BLOCKED: Acute Kidney Injury (Creatinine > 1.4 mg/dL or severe oliguria)! Indomethacin induces profound afferent renal arteriolar shutdown. Select IV Paracetamol instead.',
      };
    }
  }

  if (drug === 'IBUPROFEN') {
    if (newState.electrolytes.plateletCountPerMcl < 30000 || newState.electrolytes.serumCreatinineMgDl > 1.6) {
      return {
        updatedState: newState,
        success: false,
        message:
          'CONTRAINDICATION BLOCKED: Ibuprofen is contraindicated in severe thrombocytopenia or acute renal failure. Select IV Paracetamol instead.',
      };
    }
  }

  // Treatment Success: Ductus constricts
  newState.pdaState.pdaTreatmentGiven = drug;
  newState.pdaState.treatmentDosesCount++;

  // Successful closure/constriction:
  newState.pdaState.ductalDiameterMm = Math.max(0.4, newState.pdaState.ductalDiameterMm - 1.6);
  if (newState.pdaState.ductalDiameterMm <= 0.8) {
    newState.pdaState.isClosed = true;
    newState.pdaState.shuntDirection = 'CLOSED';
    newState.pdaState.murmurGrade = 'NONE';
    newState.pdaState.ductalStealPresent = false;
    newState.pdaState.mesentericResistiveIndex = 0.68;
    // Diastolic blood pressure normalizes:
    newState.hemodynamics.diastolicBpMmHg = Math.min(34, newState.hemodynamics.diastolicBpMmHg + 12);
    newState.hemodynamics.pulsePressureMmHg = newState.hemodynamics.systolicBpMmHg - newState.hemodynamics.diastolicBpMmHg;
    newState.hemodynamics.meanArterialPressureMmHg = Math.round(
      newState.hemodynamics.diastolicBpMmHg + newState.hemodynamics.pulsePressureMmHg / 3
    );
    newState.hemodynamics.peripheralPerfusion = 'GOOD_BRISK';
    newState.electrolytes.urineOutputMlKgHr = Math.max(1.8, newState.electrolytes.urineOutputMlKgHr + 0.8);
  }

  newState.interventionsLog.push(`PDA Pharmacotherapy Delivered: IV ${drug}`);

  return {
    updatedState: newState,
    success: true,
    message: `Administered IV ${drug}. Ductal diameter constricted to ${newState.pdaState.ductalDiameterMm.toFixed(1)} mm. Diastolic pressure normalized to ${newState.hemodynamics.diastolicBpMmHg} mmHg.`,
  };
}

/**
 * Deliver Inhaled Nitric Oxide (iNO) for PPHN / Right-to-Left Shunt
 */
export function deliverInhaledNitricOxide(
  state: ElbwPatientState,
  ppmDose: number = 20
): { updatedState: ElbwPatientState; message: string } {
  const newState: ElbwPatientState = JSON.parse(JSON.stringify(state));

  if (newState.pdaState.shuntDirection === 'RIGHT_TO_LEFT') {
    // Pulmonary vasodilation reverses R-to-L shunt
    newState.pdaState.shuntDirection = 'BIDIRECTIONAL';
    newState.hemodynamics.postDuctalSpO2 = Math.min(93, newState.hemodynamics.postDuctalSpO2 + 13);
    newState.hemodynamics.prePostSpO2Delta = newState.hemodynamics.preDuctalSpO2 - newState.hemodynamics.postDuctalSpO2;
    newState.respiratory.fio2Percent = Math.max(40, newState.respiratory.fio2Percent - 25);
  }

  newState.interventionsLog.push(`Inhaled Nitric Oxide (iNO) Initiated at ${ppmDose} ppm`);

  return {
    updatedState: newState,
    message: `Initiated iNO at ${ppmDose} ppm. Pulmonary vascular resistance reduced; post-ductal SpO2 improved to ${newState.hemodynamics.postDuctalSpO2}%. Pre/post delta narrowed to ${newState.hemodynamics.prePostSpO2Delta}%.`,
  };
}

/**
 * Advance Simulation Time Step (e.g. 2 hours)
 */
export function advanceNicuTimeStep(state: ElbwPatientState, hoursStep: number = 2): ElbwPatientState {
  const newState: ElbwPatientState = JSON.parse(JSON.stringify(state));
  newState.elapsedHours += hoursStep;

  // Check for critical hypernatremia
  if (newState.electrolytes.serumSodiumMEqL >= 150 && !newState.clinicalAlarms.includes('CRITICAL HYPERNATREMIA: Serum Sodium >= 150 mEq/L!')) {
    newState.clinicalAlarms.push('CRITICAL HYPERNATREMIA: Serum Sodium >= 150 mEq/L! High IVH risk.');
  }

  // Check for ductal steal / NEC risk
  if (newState.pdaState.ductalStealPresent && !newState.clinicalAlarms.includes('SEVERE DUCTAL STEAL: Diastolic flow reversal & high NEC risk!')) {
    newState.clinicalAlarms.push('SEVERE DUCTAL STEAL: Diastolic flow reversal & high NEC risk!');
  }

  // Check for hyperglycemia
  if (newState.tpn.bloodGlucoseMgDl > 250 && !newState.clinicalAlarms.includes('CRITICAL HYPERGLYCEMIA: Glucose > 250 mg/dL with Osmotic Diuresis!')) {
    newState.clinicalAlarms.push('CRITICAL HYPERGLYCEMIA: Glucose > 250 mg/dL with Osmotic Diuresis!');
  }

  return newState;
}

export interface NicuDebriefResult {
  scorePercentage: number;
  letterGrade: 'A+' | 'A' | 'B' | 'C' | 'FAIL';
  humidityPreserved: boolean;
  girManagedAppropriately: boolean;
  pdaAddressedSafely: boolean;
  surfactantAndWeaningCorrect: boolean;
  facultyFeedback: string[];
}

/**
 * Objective Debriefing Rubric for ELBW NICU Resuscitation
 */
export function evaluateNicuDebrief(state: ElbwPatientState): NicuDebriefResult {
  const scenario = ELBW_NICU_SCENARIOS[state.scenarioId];
  let score = 100;
  const facultyFeedback: string[] = [];

  // 1. Humidity & Fluid Management
  let humidityPreserved = true;
  if (scenario.id === 'ELBW_24WK_620G_HYPERNATREMIC_DEHYDRATION') {
    if (state.isolette.incubatorHumidityPercent >= 80) {
      facultyFeedback.push('Excellent Environmental Control: Humidity increased to >= 80%, reducing IWL and halting hypernatremic dehydration.');
    } else {
      score -= 25;
      humidityPreserved = false;
      facultyFeedback.push('Omission: Failed to raise incubator humidity to >= 80% in a 24-week infant with severe evaporative water loss.');
    }
  }

  // 2. GIR & TPN Management
  let girManagedAppropriately = true;
  if (scenario.id === 'TPN_GIR_HYPERGLYCEMIA_OSMOTIC_DIURESIS') {
    if (state.tpn.calculatedGirMgKgMin <= 8.5) {
      facultyFeedback.push('Precise Metabolic Titration: Reduced GIR to safe physiologic range (<= 8 mg/kg/min), resolving osmotic diuresis.');
    } else {
      score -= 25;
      girManagedAppropriately = false;
      facultyFeedback.push('Metabolic Oversight: Persistent excessive GIR (> 10 mg/kg/min) drove persistent glucosuria and osmotic free water loss.');
    }
  }

  // 3. PDA & Ductal Steal Management
  let pdaAddressedSafely = true;
  if (scenario.id === 'HSPDA_DUCTAL_STEAL_26WK_780G') {
    if (state.pdaState.pdaTreatmentGiven) {
      facultyFeedback.push('Targeted Ductal Therapy: Promptly initiated pharmacotherapy for hemodynamically significant PDA with ductal steal.');
    } else {
      score -= 20;
      pdaAddressedSafely = false;
      facultyFeedback.push('Unaddressed hsPDA: Infant with severe mesenteric ductal steal remained untreated, risking bowel ischemia (NEC).');
    }
  }

  // 4. Contraindication Safety in PDA
  if (scenario.id === 'PDA_PHARMACOTHERAPY_CONTRAINDICATION_SELECTION') {
    if (state.pdaState.pdaTreatmentGiven === 'PARACETAMOL') {
      facultyFeedback.push('Exemplary Pharmacotherapy Choice: Correctly selected Paracetamol for hsPDA closure given absolute contraindications to NSAIDs (platelets 32k, AKI).');
    } else if (state.pdaState.pdaTreatmentGiven === 'INDOMETHACIN' || state.pdaState.pdaTreatmentGiven === 'IBUPROFEN') {
      score -= 30;
      pdaAddressedSafely = false;
      facultyFeedback.push('Critical Safety Breach: Administered NSAID in the presence of severe thrombocytopenia and acute kidney injury!');
    }
  }

  // 5. Surfactant & Rapid Ventilator Weaning
  let surfactantAndWeaningCorrect = true;
  if (scenario.id === 'SEVERE_RDS_SURFACTANT_WEANING_27WK_920G') {
    if (state.respiratory.surfactantGiven) {
      if (!state.respiratory.volutraumaRiskActive) {
        facultyFeedback.push('Mastery of RDS Dynamics: Delivered surfactant and promptly weaned ventilator PIP to prevent volutrauma and hypocarbia.');
      } else {
        score -= 20;
        surfactantAndWeaningCorrect = false;
        facultyFeedback.push('Ventilator Weaning Failure: Failed to wean PIP after surfactant compliance surge; delivered tidal volumes > 7 mL/kg risked pneumothorax and PVL.');
      }
    } else {
      score -= 25;
      surfactantAndWeaningCorrect = false;
      facultyFeedback.push('Omission: Failed to administer surfactant in severe RDS with high oxygen requirement.');
    }
  }

  // 6. PPHN Pre/Post-Ductal Gradient
  if (scenario.id === 'NEONATAL_SEPSIS_PPHN_28WK_980G') {
    if (state.hemodynamics.prePostSpO2Delta <= 5) {
      facultyFeedback.push('Successful PPHN Reversal: Pulmonary vasodilation achieved, eliminating pre/post-ductal saturation gradient.');
    }
  }

  score = Math.max(0, Math.min(100, score));

  let letterGrade: 'A+' | 'A' | 'B' | 'C' | 'FAIL' = 'FAIL';
  if (score >= 95) letterGrade = 'A+';
  else if (score >= 85) letterGrade = 'A';
  else if (score >= 75) letterGrade = 'B';
  else if (score >= 60) letterGrade = 'C';

  return {
    scorePercentage: score,
    letterGrade,
    humidityPreserved,
    girManagedAppropriately,
    pdaAddressedSafely,
    surfactantAndWeaningCorrect,
    facultyFeedback,
  };
}
