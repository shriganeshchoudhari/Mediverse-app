/**
 * ToxicAlcoholsOsmolalGapEngine.ts
 * Clinical Toxicology, Osmolal Gap, High Anion Gap Metabolic Acidosis (HAGMA),
 * Methanol, Ethylene Glycol, Isopropanol Differential Solver & Fomepizole / Dialysis Protocol Engine.
 * Location: frontend/.gemini/skills/ToxicAlcoholsOsmolalGapEngine.ts
 */

export type IngestedSubstance =
  | 'ETHYLENE_GLYCOL'
  | 'METHANOL'
  | 'ISOPROPANOL'
  | 'PROPYLENE_GLYCOL'
  | 'ALCOHOLIC_KETOACIDOSIS'
  | 'DIABETIC_KETOACIDOSIS'
  | 'SALICYLATE'
  | 'NORMAL';

export interface ToxicAlcoholPatientInput {
  substance: IngestedSubstance;
  hoursPostIngestion: number; // 0 to 48 hours
  ingestedVolumeMl: number; // e.g. 50 to 500 mL
  bodyWeightKg: number; // default ~70 kg
  measuredOsmolalityMOsmKg: number;
  sodiumMEqL: number;
  chlorideMEqL: number;
  bicarbonateMEqL: number;
  glucoseMgDl: number;
  bunMgDl: number;
  ethanolMgDl: number; // Co-ingested ethanol
  fomepizoleAdministered: boolean;
  folicAcidOrThiamineB6Given: boolean;
  hemodialysisActive: boolean;
}

export interface ToxicKineticsMetrics {
  calculatedOsmolalityMOsmKg: number;
  osmolalGapMOsmKg: number;
  anionGapMEqL: number;
  deltaGapMEqL: number;
  deltaRatio: number;
  estimatedParentConcentrationMgDl: number;
  estimatedToxicMetaboliteConcentrationMEqL: number;
  arterialPh: number;
  calciumOxalateCrystalsPresent: boolean;
  woodsLampUrineFluorescence: boolean;
  visualImpairmentGrade: 'NONE' | 'BLURRED_VISION' | 'SNOWSTORM_BLINDNESS';
  acuteKidneyInjuryStage: 'NONE' | 'STAGE_1' | 'STAGE_2' | 'STAGE_3_ANURIA';
  hemodialysisIndicated: boolean;
  fomepizoleLoadingDoseMg: number;
  fomepizoleMaintenanceDoseMg: number;
  adjunctiveCofactors: string[];
  diagnosticConfidence: 'DEFINITIVE' | 'HIGH_SUSPICION' | 'LOW_SUSPICION';
  clinicalSummary: string;
  urgentActionChecklist: string[];
}

export const TOXIC_ALCOHOL_PRESETS: {
  id: string;
  name: string;
  badge: string;
  description: string;
  input: ToxicAlcoholPatientInput;
}[] = [
  {
    id: 'early-methanol-high-osmolal',
    name: 'Early Methanol Ingestion (2h Post-Ingestion)',
    badge: 'High Osmolal Gap / Minimal Acidosis',
    description: 'Windshield wiper fluid ingestion 2 hours ago. Marked Osmolal Gap (64 mOsm/kg) with near-normal Anion Gap before ADH oxidation to formic acid.',
    input: {
      substance: 'METHANOL',
      hoursPostIngestion: 2,
      ingestedVolumeMl: 150,
      bodyWeightKg: 70,
      measuredOsmolalityMOsmKg: 355,
      sodiumMEqL: 140,
      chlorideMEqL: 104,
      bicarbonateMEqL: 22,
      glucoseMgDl: 100,
      bunMgDl: 14,
      ethanolMgDl: 0,
      fomepizoleAdministered: false,
      folicAcidOrThiamineB6Given: false,
      hemodialysisActive: false,
    },
  },
  {
    id: 'late-methanol-formic-acid',
    name: 'Late Methanol Toxicity (18h Post-Ingestion)',
    badge: 'Severe HAGMA & Blindness',
    description: '18 hours post-ingestion. Formic acid accumulation causes severe HAGMA (pH 7.08, AG 28), optic disc hyperemia, snowstorm vision, and closed osmolal gap.',
    input: {
      substance: 'METHANOL',
      hoursPostIngestion: 18,
      ingestedVolumeMl: 200,
      bodyWeightKg: 70,
      measuredOsmolalityMOsmKg: 308,
      sodiumMEqL: 138,
      chlorideMEqL: 100,
      bicarbonateMEqL: 8,
      glucoseMgDl: 110,
      bunMgDl: 18,
      ethanolMgDl: 0,
      fomepizoleAdministered: false,
      folicAcidOrThiamineB6Given: false,
      hemodialysisActive: false,
    },
  },
  {
    id: 'ethylene-glycol-aki',
    name: 'Ethylene Glycol Antifreeze Poisoning (10h)',
    badge: 'Oxalate Crystals & Acute Renal Failure',
    description: 'Antifreeze ingestion 10 hours ago. High anion gap metabolic acidosis, envelope calcium oxalate crystals in urine, Wood\'s lamp fluorescence, and acute tubular necrosis.',
    input: {
      substance: 'ETHYLENE_GLYCOL',
      hoursPostIngestion: 10,
      ingestedVolumeMl: 250,
      bodyWeightKg: 75,
      measuredOsmolalityMOsmKg: 330,
      sodiumMEqL: 142,
      chlorideMEqL: 102,
      bicarbonateMEqL: 10,
      glucoseMgDl: 120,
      bunMgDl: 34,
      ethanolMgDl: 0,
      fomepizoleAdministered: false,
      folicAcidOrThiamineB6Given: false,
      hemodialysisActive: false,
    },
  },
  {
    id: 'isopropanol-ketosis-no-acidosis',
    name: 'Isopropanol (Rubbing Alcohol) Ingestion',
    badge: 'Ketosis Without Acidosis',
    description: 'Rubbing alcohol ingestion. Large Osmolal Gap and positive urine/serum ketones (acetone), but completely NORMAL Anion Gap and pH (acetone is a non-acid ketone).',
    input: {
      substance: 'ISOPROPANOL',
      hoursPostIngestion: 4,
      ingestedVolumeMl: 200,
      bodyWeightKg: 70,
      measuredOsmolalityMOsmKg: 348,
      sodiumMEqL: 140,
      chlorideMEqL: 104,
      bicarbonateMEqL: 24,
      glucoseMgDl: 95,
      bunMgDl: 12,
      ethanolMgDl: 0,
      fomepizoleAdministered: false,
      folicAcidOrThiamineB6Given: false,
      hemodialysisActive: false,
    },
  },
  {
    id: 'coingested-ethanol-blockade',
    name: 'Ethylene Glycol + Ethanol Protective Co-Ingestion',
    badge: 'Competitive ADH Substrate Inhibition',
    description: 'Patient co-ingested ethylene glycol and whiskey. Serum ethanol (180 mg/dL) competitively saturates ADH (affinity 10-20x higher), halting toxic acid generation.',
    input: {
      substance: 'ETHYLENE_GLYCOL',
      hoursPostIngestion: 6,
      ingestedVolumeMl: 200,
      bodyWeightKg: 70,
      measuredOsmolalityMOsmKg: 375,
      sodiumMEqL: 139,
      chlorideMEqL: 103,
      bicarbonateMEqL: 23,
      glucoseMgDl: 105,
      bunMgDl: 14,
      ethanolMgDl: 180,
      fomepizoleAdministered: false,
      folicAcidOrThiamineB6Given: false,
      hemodialysisActive: false,
    },
  },
  {
    id: 'alcoholic-ketoacidosis-differential',
    name: 'Alcoholic Ketoacidosis (AKA) Diagnostic Control',
    badge: 'HAGMA with Mild Osmolal Gap',
    description: 'Chronic malnourished alcoholic after binge and 48h starvation. Elevated beta-hydroxybutyrate creates HAGMA with mildly elevated osmolal gap (< 20 mOsm/kg).',
    input: {
      substance: 'ALCOHOLIC_KETOACIDOSIS',
      hoursPostIngestion: 24,
      ingestedVolumeMl: 0,
      bodyWeightKg: 65,
      measuredOsmolalityMOsmKg: 305,
      sodiumMEqL: 136,
      chlorideMEqL: 96,
      bicarbonateMEqL: 12,
      glucoseMgDl: 75,
      bunMgDl: 16,
      ethanolMgDl: 0,
      fomepizoleAdministered: false,
      folicAcidOrThiamineB6Given: false,
      hemodialysisActive: false,
    },
  },
];

/**
 * Computes calculated serum osmolality
 * Standard formula: 2*[Na] + Glucose/18 + BUN/2.8 + Ethanol/4.6
 */
export function computeCalculatedOsmolality(
  na: number,
  glucose: number,
  bun: number,
  ethanol: number
): number {
  const calc = 2 * na + glucose / 18 + bun / 2.8 + ethanol / 4.6;
  return Math.round(calc * 10) / 10;
}

/**
 * Evaluates patient toxicology, osmolal gap dynamics, metabolic acidosis, and treatment algorithms
 */
export function evaluateToxicAlcoholKinetics(
  input: ToxicAlcoholPatientInput
): ToxicKineticsMetrics {
  const {
    substance,
    hoursPostIngestion,
    ingestedVolumeMl,
    bodyWeightKg,
    measuredOsmolalityMOsmKg,
    sodiumMEqL,
    chlorideMEqL,
    bicarbonateMEqL,
    glucoseMgDl,
    bunMgDl,
    ethanolMgDl,
    fomepizoleAdministered,
    folicAcidOrThiamineB6Given,
    hemodialysisActive,
  } = input;

  // 1. Osmolal Calculations
  const calculatedOsm = computeCalculatedOsmolality(
    sodiumMEqL,
    glucoseMgDl,
    bunMgDl,
    ethanolMgDl
  );
  const osmolalGap = Math.round((measuredOsmolalityMOsmKg - calculatedOsm) * 10) / 10;

  // 2. Anion Gap & Delta Calculations
  const anionGap = Math.round((sodiumMEqL - (chlorideMEqL + bicarbonateMEqL)) * 10) / 10;
  const deltaAG = Math.max(0, anionGap - 12);
  const deltaBicarb = Math.max(1, 24 - bicarbonateMEqL);
  const deltaRatio = Math.round((deltaAG / deltaBicarb) * 100) / 100;

  // 3. Toxic Metabolite and Arterial pH Modeling
  let visualDefect: ToxicKineticsMetrics['visualImpairmentGrade'] = 'NONE';
  let akiStage: ToxicKineticsMetrics['acuteKidneyInjuryStage'] = 'NONE';
  let crystalsPresent = false;
  let woodsLampPositive = false;

  // Approximate arterial pH based on bicarbonate (Henderson-Hasselbalch estimation)
  // Assuming compensatory hyperventilation (Winter's formula: PaCO2 = 1.5*HCO3 + 8)
  const expectedPCO2 = Math.min(45, Math.max(12, 1.5 * bicarbonateMEqL + 8));
  // pH = 6.1 + log(HCO3 / (0.03 * PaCO2))
  const rawPh = 6.1 + Math.log10(Math.max(2, bicarbonateMEqL) / (0.03 * expectedPCO2));
  const arterialPh = Math.round(Math.min(7.55, Math.max(6.85, rawPh)) * 100) / 100;

  // 4. Substance-Specific Findings
  switch (substance) {
    case 'METHANOL': {
      if (hoursPostIngestion >= 6 && (anionGap > 18 || bicarbonateMEqL < 16)) {
        if (hoursPostIngestion >= 14 || bicarbonateMEqL < 10) {
          visualDefect = 'SNOWSTORM_BLINDNESS';
        } else {
          visualDefect = 'BLURRED_VISION';
        }
      }
      break;
    }

    case 'ETHYLENE_GLYCOL': {
      if (hoursPostIngestion >= 4) {
        crystalsPresent = true;
        if (hoursPostIngestion <= 12) {
          woodsLampPositive = true;
        }
      }
      if (hoursPostIngestion >= 8) {
        if (bunMgDl > 30 || bicarbonateMEqL < 12) {
          akiStage = hoursPostIngestion > 18 ? 'STAGE_3_ANURIA' : 'STAGE_2';
        } else {
          akiStage = 'STAGE_1';
        }
      }
      break;
    }

    case 'ISOPROPANOL': {
      // Isopropanol does NOT produce an organic acid! Acetone does not cause HAGMA or retinal/renal toxicity.
      visualDefect = 'NONE';
      akiStage = 'NONE';
      break;
    }

    default:
      break;
  }

  // 5. Parent & Metabolite Estimates
  // Factor in competitive ethanol inhibition or fomepizole
  const adkBlocked = fomepizoleAdministered || ethanolMgDl >= 100;
  const metabolismRate = adkBlocked ? 0.1 : 0.85; // Fraction metabolized per 12h
  const fractionMetabolized = Math.min(
    0.95,
    (hoursPostIngestion / 24) * metabolismRate
  );

  // Conversion of Osmolal Gap to parent mg/dL (Osm Gap * MW / 10)
  // Methanol MW = 32; Ethylene Glycol MW = 62; Isopropanol MW = 60
  let mw = 32;
  if (substance === 'ETHYLENE_GLYCOL') mw = 62;
  if (substance === 'ISOPROPANOL') mw = 60;
  if (substance === 'PROPYLENE_GLYCOL') mw = 76;

  const estimatedParent = Math.max(0, Math.round(osmolalGap * (mw / 10)));
  const estimatedToxicMetabolite = Math.max(0, Math.round(deltaAG));

  // 6. Hemodialysis Indications (Extracorporeal Elimination Criteria)
  // Criteria: pH < 7.25-7.30, visual defects, renal failure, or very high parent level / gap
  const severeAcidemia = arterialPh < 7.25;
  const severeOrganTox =
    visualDefect === 'SNOWSTORM_BLINDNESS' ||
    akiStage === 'STAGE_3_ANURIA' ||
    akiStage === 'STAGE_2';
  const extremeGap = osmolalGap >= 25 && (substance === 'METHANOL' || substance === 'ETHYLENE_GLYCOL');
  const hemodialysisIndicated =
    (substance === 'METHANOL' || substance === 'ETHYLENE_GLYCOL') &&
    (severeAcidemia || severeOrganTox || extremeGap);

  // 7. Fomepizole Dosing
  // Loading dose: 15 mg/kg IV over 30 min
  // Maintenance: 10 mg/kg IV q12h x 4 doses, then 15 mg/kg q12h
  // If on hemodialysis: dose q4h during dialysis or continuous infusion
  const fomepizoleLoading = Math.round(15 * bodyWeightKg);
  const fomepizoleMaint = hemodialysisActive
    ? Math.round(15 * bodyWeightKg) // Dose given q4h or post-HD
    : Math.round(10 * bodyWeightKg);

  // 8. Adjunctive Cofactors
  const cofactors: string[] = [];
  if (substance === 'METHANOL') {
    cofactors.push('Folic Acid (or Leucovorin) 50 mg IV q4h (enhances formate oxidation to CO2)');
  } else if (substance === 'ETHYLENE_GLYCOL') {
    cofactors.push('Thiamine (Vitamin B1) 100 mg IV q6h (shunts glyoxylate to alpha-hydroxy-beta-ketoadipate)');
    cofactors.push('Pyridoxine (Vitamin B6) 50 mg IV q6h (shunts glyoxylate to glycine, non-toxic)');
    cofactors.push('Magnesium & Calcium monitoring (prevent symptomatic tetany / QT prolongation)');
  } else if (substance === 'ISOPROPANOL') {
    cofactors.push('Supportive care only: IV hydration, gastric mucosal protection for hemorrhagic gastritis');
    cofactors.push('Fomepizole is NOT recommended (acetone is not a severe toxin; no systemic acidosis)');
  }

  // 9. Diagnostic Confidence & Summary
  let confidence: ToxicKineticsMetrics['diagnosticConfidence'] = 'LOW_SUSPICION';
  if (osmolalGap > 20 || (anionGap > 18 && (crystalsPresent || visualDefect !== 'NONE'))) {
    confidence = 'DEFINITIVE';
  } else if (osmolalGap > 12 || anionGap > 14) {
    confidence = 'HIGH_SUSPICION';
  }

  let clinicalSummary = '';
  if (substance === 'METHANOL') {
    clinicalSummary = `Methanol Ingestion with Osmolal Gap of ${osmolalGap} mOsm/kg and Anion Gap of ${anionGap} mEq/L. Formic acid inhibits mitochondrial respiration, causing retinal ganglion damage and putaminal necrosis.`;
  } else if (substance === 'ETHYLENE_GLYCOL') {
    clinicalSummary = `Ethylene Glycol Ingestion with Osmolal Gap of ${osmolalGap} mOsm/kg and Anion Gap of ${anionGap} mEq/L. Glycolic and oxalic acids precipitate calcium oxalate in renal tubules, driving acute tubular necrosis.`;
  } else if (substance === 'ISOPROPANOL') {
    clinicalSummary = `Isopropanol Ingestion with Osmolal Gap of ${osmolalGap} mOsm/kg, KETONEMIA, but NORMAL Anion Gap (${anionGap} mEq/L) and normal pH. Acetone does not cause metabolic acidosis.`;
  } else {
    clinicalSummary = `Diagnostic evaluation: Osmolal Gap ${osmolalGap} mOsm/kg, Anion Gap ${anionGap} mEq/L, arterial pH ${arterialPh}.`;
  }

  // 10. Urgent Action Checklist
  const actions: string[] = [];
  if (substance === 'METHANOL' || substance === 'ETHYLENE_GLYCOL') {
    if (!fomepizoleAdministered) {
      actions.push(`STAT: Administer Fomepizole (Antizol) ${fomepizoleLoading} mg IV loading dose over 30 min`);
    } else {
      actions.push(`Fomepizole active: continue maintenance ${fomepizoleMaint} mg IV q12h (or q4h if on HD)`);
    }

    if (hemodialysisIndicated && !hemodialysisActive) {
      actions.push('EMERGENCY: Consult Nephrology for Urgent Intermittent Hemodialysis (IHD)');
    }

    if (!folicAcidOrThiamineB6Given) {
      if (substance === 'METHANOL') {
        actions.push('Administer IV Leucovorin / Folic Acid 50 mg IV immediately');
      } else {
        actions.push('Administer IV Thiamine 100 mg + Pyridoxine 50 mg immediately');
      }
    }

    if (arterialPh < 7.20) {
      actions.push('Consider Sodium Bicarbonate infusion (target urine alkalinization pH >= 7.5 to promote formate excretion)');
    }
  } else if (substance === 'ISOPROPANOL') {
    actions.push('Supportive treatment: airway protection, IV crystalloid resuscitation');
    actions.push('Monitor for hemorrhagic gastritis and severe CNS/respiratory depression');
    actions.push('Avoid Fomepizole (ineffective and unnecessary for isolated isopropanol)');
  }

  return {
    calculatedOsmolalityMOsmKg: calculatedOsm,
    osmolalGapMOsmKg: osmolalGap,
    anionGapMEqL: anionGap,
    deltaGapMEqL: deltaAG,
    deltaRatio,
    estimatedParentConcentrationMgDl: estimatedParent,
    estimatedToxicMetaboliteConcentrationMEqL: estimatedToxicMetabolite,
    arterialPh,
    calciumOxalateCrystalsPresent: crystalsPresent,
    woodsLampUrineFluorescence: woodsLampPositive,
    visualImpairmentGrade: visualDefect,
    acuteKidneyInjuryStage: akiStage,
    hemodialysisIndicated,
    fomepizoleLoadingDoseMg: fomepizoleLoading,
    fomepizoleMaintenanceDoseMg: fomepizoleMaint,
    adjunctiveCofactors: cofactors,
    diagnosticConfidence: confidence,
    clinicalSummary,
    urgentActionChecklist: actions,
  };
}
