/**
 * AcuteStrokeThrombolysisEngine.ts
 *
 * Biophysical engine for Acute Ischemic Stroke (AIS) Emergency Triage:
 * - NIH Stroke Scale (NIHSS, 0 to 42 points) itemized assessment
 * - Alberta Stroke Program Early CT Score (ASPECTS, 0 to 10 points)
 * - AHA/ASA Intravenous Thrombolysis Eligibility Solver (Alteplase rtPA vs Tenecteplase TNK-tPA)
 * - Large Vessel Occlusion (LVO) & Endovascular Thrombectomy (EVT) criteria (DAWN / DEFUSE-3)
 * - Blood Pressure management protocols pre- and post-thrombolysis
 * - 8 Comprehensive Clinical Presets
 *
 * Location: frontend/.gemini/skills/AcuteStrokeThrombolysisEngine.ts
 */

export type ThrombolyticAgent = 'ALTEPLASE' | 'TENECTEPLASE';

export interface NihssParameters {
  loc1a: number; // 0=Alert, 1=Drowsy, 2=Obtunded, 3=Coma
  locQuestions1b: number; // 0=Both correct, 1=One correct, 2=Neither
  locCommands1c: number; // 0=Both correct, 1=One correct, 2=Neither
  bestGaze2: number; // 0=Normal, 1=Partial gaze palsy, 2=Forced deviation
  visualFields3: number; // 0=No visual loss, 1=Partial hemianopia, 2=Complete hemianopia, 3=Bilateral
  facialPalsy4: number; // 0=Normal, 1=Minor, 2=Partial, 3=Complete
  motorArmLeft5a: number; // 0=No drift, 1=Drift, 2=Some effort vs gravity, 3=No effort, 4=No movement
  motorArmRight5b: number; // 0 to 4
  motorLegLeft6a: number; // 0 to 4
  motorLegRight6b: number; // 0 to 4
  limbAtaxia7: number; // 0=Absent, 1=One limb, 2=Two limbs
  sensory8: number; // 0=Normal, 1=Mild-to-moderate, 2=Severe/total
  bestLanguage9: number; // 0=No aphasia, 1=Mild/mod, 2=Severe, 3=Mute/global
  dysarthria10: number; // 0=Normal, 1=Mild/mod, 2=Severe/anarthric
  extinction11: number; // 0=No neglect, 1=Visual/tactile/auditory inattention, 2=Profound hemi-inattention
}

export interface AspectsRegions {
  caudate: boolean; // true = intact (normal), false = ischemic hypodensity
  lentiform: boolean;
  internalCapsule: boolean;
  insularRibbon: boolean;
  m1AnteriorCortex: boolean;
  m2TemporalCortex: boolean;
  m3PosteriorCortex: boolean;
  m4AnteriorSupraganglionic: boolean;
  m5TemporalSupraganglionic: boolean;
  m6PosteriorSupraganglionic: boolean;
}

export interface StrokePatientProfile {
  ageYears: number;
  weightKg: number;
  hoursFromLastKnownWell: number; // LKW time
  systolicBpMmHg: number;
  diastolicBpMmHg: number;
  bloodGlucoseMgDl: number;
  plateletsPerUl: number;
  inr: number;
  apttSeconds: number;
  recentDoacWithin48h: boolean;
  intracranialHemorrhageOnCt: boolean;
  recentHeadTraumaOrStroke3Mo: boolean;
  activeInternalBleed: boolean;
  nihss: NihssParameters;
  aspects: AspectsRegions;
  largeVesselOcclusionPresent: boolean;
  lvoSite?: 'ICA_TERMINUS' | 'MCA_M1' | 'MCA_M2' | 'BASILAR';
  coreVolumeMl?: number; // CT Perfusion core
  penumbraVolumeMl?: number; // CT Perfusion penumbra
}

export interface ThrombolysisEligibilityResult {
  isEligibleForIvLysis: boolean;
  isEligibleForEvt: boolean;
  contraindications: string[];
  warnings: string[];
  recommendedThrombolytic: ThrombolyticAgent;
  alteplaseDoseMg: {
    totalMg: number;
    bolusMg: number; // 10%
    infusionMg: number; // 90%
  };
  tenecteplaseDoseMg: number; // single bolus 0.25 mg/kg (max 25 mg)
  bpManagementRequired: boolean;
  bpTargetPreLysis: string;
  bpTargetPostLysis: string;
  nihssTotalScore: number;
  nihssSeverity: 'NO_STROKE' | 'MINOR' | 'MODERATE' | 'MODERATE_TO_SEVERE' | 'SEVERE';
  aspectsScore: number;
  clinicalActionSummary: string;
}

export interface StrokePreset {
  id: string;
  name: string;
  description: string;
  profile: StrokePatientProfile;
}

/**
 * Computes Total NIH Stroke Scale score
 */
export function calculateNihssScore(params: NihssParameters): { score: number; severity: ThrombolysisEligibilityResult['nihssSeverity'] } {
  const score =
    params.loc1a +
    params.locQuestions1b +
    params.locCommands1c +
    params.bestGaze2 +
    params.visualFields3 +
    params.facialPalsy4 +
    params.motorArmLeft5a +
    params.motorArmRight5b +
    params.motorLegLeft6a +
    params.motorLegRight6b +
    params.limbAtaxia7 +
    params.sensory8 +
    params.bestLanguage9 +
    params.dysarthria10 +
    params.extinction11;

  let severity: ThrombolysisEligibilityResult['nihssSeverity'] = 'NO_STROKE';
  if (score >= 21) severity = 'SEVERE';
  else if (score >= 16) severity = 'MODERATE_TO_SEVERE';
  else if (score >= 5) severity = 'MODERATE';
  else if (score >= 1) severity = 'MINOR';

  return { score, severity };
}

/**
 * Computes ASPECTS score (10 points total; 1 point deducted for each ischemic region)
 */
export function calculateAspectsScore(regions: AspectsRegions): number {
  let score = 0;
  if (regions.caudate) score++;
  if (regions.lentiform) score++;
  if (regions.internalCapsule) score++;
  if (regions.insularRibbon) score++;
  if (regions.m1AnteriorCortex) score++;
  if (regions.m2TemporalCortex) score++;
  if (regions.m3PosteriorCortex) score++;
  if (regions.m4AnteriorSupraganglionic) score++;
  if (regions.m5TemporalSupraganglionic) score++;
  if (regions.m6PosteriorSupraganglionic) score++;
  return score;
}

/**
 * Evaluates Acute Ischemic Stroke thrombolysis & thrombectomy eligibility
 */
export function evaluateStrokeIntervention(profile: StrokePatientProfile): ThrombolysisEligibilityResult {
  const { score: nihssTotalScore, severity: nihssSeverity } = calculateNihssScore(profile.nihss);
  const aspectsScore = calculateAspectsScore(profile.aspects);

  const contraindications: string[] = [];
  const warnings: string[] = [];

  // Absolute contraindications for IV thrombolysis
  if (profile.intracranialHemorrhageOnCt) {
    contraindications.push('Intracranial Hemorrhage (ICH) confirmed on non-contrast CT. Thrombolysis strictly contraindicated.');
  }

  if (profile.hoursFromLastKnownWell > 4.5) {
    contraindications.push(
      `Last Known Well (${profile.hoursFromLastKnownWell}h) exceeds the 4.5-hour intravenous thrombolysis window. Evaluate for extended-window mechanical thrombectomy.`
    );
  }

  if (profile.systolicBpMmHg > 185 || profile.diastolicBpMmHg > 110) {
    contraindications.push(
      `Severe hypertension (${profile.systolicBpMmHg}/${profile.diastolicBpMmHg} mmHg > 185/110 threshold). Blood pressure must be lowered with IV labetalol/nicardipine before initiating thrombolysis.`
    );
  }

  if (profile.bloodGlucoseMgDl < 50) {
    contraindications.push(
      `Hypoglycemia (${profile.bloodGlucoseMgDl} mg/dL < 50 mg/dL). Treat stroke mimic immediately with IV 50% dextrose and reassess neurological deficits.`
    );
  }

  if (profile.plateletsPerUl < 100000) {
    contraindications.push(`Severe thrombocytopenia (${profile.plateletsPerUl.toLocaleString()} /µL < 100,000 /µL threshold). High risk of fatal hemorrhagic transformation.`);
  }

  if (profile.inr > 1.7) {
    contraindications.push(`Elevated INR (${profile.inr} > 1.7 threshold, e.g. warfarin coagulopathy). Thrombolysis contraindicated.`);
  }

  if (profile.apttSeconds > 40) {
    contraindications.push(`Elevated aPTT (${profile.apttSeconds}s > 40s threshold). Active heparin anticoagulation present.`);
  }

  if (profile.recentDoacWithin48h) {
    contraindications.push('Direct Oral Anticoagulant (DOAC: apixaban/rivaroxaban/dabigatran) ingested within 48 hours without specific reversal agent.');
  }

  if (profile.recentHeadTraumaOrStroke3Mo) {
    contraindications.push('Severe head trauma or ischemic stroke within the preceding 3 months.');
  }

  if (profile.activeInternalBleed) {
    contraindications.push('Active internal bleeding (e.g. gastrointestinal hemorrhage).');
  }

  // Relative warnings
  if (aspectsScore <= 5) {
    warnings.push(
      `Low ASPECTS score (${aspectsScore}/10). Extensive early ischemic changes (>1/3 MCA territory) indicate elevated risk of reperfusion hemorrhage.`
    );
  }

  if (profile.hoursFromLastKnownWell > 3.0 && profile.hoursFromLastKnownWell <= 4.5) {
    if (profile.ageYears > 80) {
      warnings.push('Age > 80 years in the 3.0 to 4.5-hour extended window (ECASS III relative exclusion criterion). Benefit remains established in current guidelines with shared decision-making.');
    }
    if (nihssTotalScore > 25) {
      warnings.push('Severe baseline deficit (NIHSS > 25) in 3.0-4.5h window.');
    }
  }

  const isEligibleForIvLysis = contraindications.length === 0;

  // Mechanical Thrombectomy (EVT) Evaluation (DAWN / DEFUSE-3 criteria)
  let isEligibleForEvt = false;
  if (profile.largeVesselOcclusionPresent && !profile.intracranialHemorrhageOnCt) {
    // 0-6h window standard with ASPECTS >= 6
    if (profile.hoursFromLastKnownWell <= 6.0 && aspectsScore >= 6) {
      isEligibleForEvt = true;
    } else if (profile.hoursFromLastKnownWell <= 24.0) {
      // Extended window 6-24h using CTP criteria (core < 70 mL, penumbra mismatch >= 1.8)
      const core = profile.coreVolumeMl ?? 20;
      const penumbra = profile.penumbraVolumeMl ?? 100;
      const mismatchRatio = penumbra / Math.max(1, core);
      if (core < 70 && mismatchRatio >= 1.8) {
        isEligibleForEvt = true;
      }
    }
  }

  // Dosing calculations
  // Alteplase (rtPA): 0.9 mg/kg (max 90 mg) - 10% bolus, 90% 1h infusion
  const rawAlteplase = profile.weightKg * 0.9;
  const totalAlteplaseMg = Math.min(90, Math.round(rawAlteplase * 10) / 10);
  const bolusAlteplaseMg = Math.round(totalAlteplaseMg * 0.1 * 10) / 10;
  const infusionAlteplaseMg = Math.round((totalAlteplaseMg - bolusAlteplaseMg) * 10) / 10;

  // Tenecteplase (TNK): 0.25 mg/kg (max 25 mg) single IV push over 5 seconds
  const rawTnk = profile.weightKg * 0.25;
  const tenecteplaseDoseMg = Math.min(25, Math.round(rawTnk * 10) / 10);

  const bpManagementRequired = profile.systolicBpMmHg > 185 || profile.diastolicBpMmHg > 110;

  // Clinical Summary
  let clinicalActionSummary = '';
  if (isEligibleForIvLysis && isEligibleForEvt) {
    clinicalActionSummary = `PATIENT ELIGIBLE FOR DUAL THERAPY: Administer IV ${profile.largeVesselOcclusionPresent ? 'Tenecteplase (TNK) 0.25 mg/kg' : 'Alteplase (0.9 mg/kg)'} immediately, and simultaneously activate interventional neuro-radiology for emergency Endovascular Thrombectomy (EVT). Do not delay groin puncture to observe lysis response!`;
  } else if (isEligibleForIvLysis) {
    clinicalActionSummary = `PATIENT ELIGIBLE FOR IV THROMBOLYSIS: Initiate Alteplase 0.9 mg/kg (10% bolus over 1 min, 90% over 60 min) or Tenecteplase 0.25 mg/kg IV push. Maintain strict BP < 180/105 mmHg for 24 hours.`;
  } else if (isEligibleForEvt) {
    clinicalActionSummary = `DIRECT TRANSFER TO ANGIOGRAPHY SUITE: Intravenous thrombolysis is contraindicated (${contraindications[0]}), but patient meets criteria for Endovascular Mechanical Thrombectomy. Proceed immediately with stent-retriever/aspiration catheterization.`;
  } else {
    clinicalActionSummary = `CONSERVATIVE STROKE MANAGEMENT: Patient not eligible for acute reperfusion therapy due to contraindications (${contraindications[0] || 'Unfavorable core/timing'}). Admit to Neuro-ICU/Stroke Unit, initiate antiplatelet therapy after 24h, maintain permissive hypertension (SBP < 220 mmHg), and support airway/hydration.`;
  }

  return {
    isEligibleForIvLysis,
    isEligibleForEvt,
    contraindications,
    warnings,
    recommendedThrombolytic: profile.largeVesselOcclusionPresent ? 'TENECTEPLASE' : 'ALTEPLASE',
    alteplaseDoseMg: {
      totalMg: totalAlteplaseMg,
      bolusMg: bolusAlteplaseMg,
      infusionMg: infusionAlteplaseMg,
    },
    tenecteplaseDoseMg,
    bpManagementRequired,
    bpTargetPreLysis: 'SBP ≤ 185 mmHg and DBP ≤ 110 mmHg',
    bpTargetPostLysis: 'SBP ≤ 180 mmHg and DBP ≤ 105 mmHg for first 24 hours',
    nihssTotalScore,
    nihssSeverity,
    aspectsScore,
    clinicalActionSummary,
  };
}

/**
 * 8 Clinical Presets
 */
export const STROKE_PRESETS: StrokePreset[] = [
  {
    id: 'hyperacute-m1-lvo',
    name: 'Hyperacute Left MCA M1 Occlusion within Window',
    description: '64-year-old male with sudden right hemiplegia and global aphasia. LKW 1.5 hours, NIHSS 18, ASPECTS 9, SBP 168/94. Ideal candidate for dual IV Tenecteplase + EVT.',
    profile: {
      ageYears: 64,
      weightKg: 78,
      hoursFromLastKnownWell: 1.5,
      systolicBpMmHg: 168,
      diastolicBpMmHg: 94,
      bloodGlucoseMgDl: 124,
      plateletsPerUl: 240000,
      inr: 1.0,
      apttSeconds: 28,
      recentDoacWithin48h: false,
      intracranialHemorrhageOnCt: false,
      recentHeadTraumaOrStroke3Mo: false,
      activeInternalBleed: false,
      nihss: {
        loc1a: 0,
        locQuestions1b: 2,
        locCommands1c: 1,
        bestGaze2: 1,
        visualFields3: 2,
        facialPalsy4: 2,
        motorArmLeft5a: 0,
        motorArmRight5b: 4,
        motorLegLeft6a: 0,
        motorLegRight6b: 3,
        limbAtaxia7: 0,
        sensory8: 1,
        bestLanguage9: 2,
        dysarthria10: 0,
        extinction11: 0,
      },
      aspects: {
        caudate: true,
        lentiform: false, // lentiform hypodensity
        internalCapsule: true,
        insularRibbon: true,
        m1AnteriorCortex: true,
        m2TemporalCortex: true,
        m3PosteriorCortex: true,
        m4AnteriorSupraganglionic: true,
        m5TemporalSupraganglionic: true,
        m6PosteriorSupraganglionic: true,
      },
      largeVesselOcclusionPresent: true,
      lvoSite: 'MCA_M1',
      coreVolumeMl: 14,
      penumbraVolumeMl: 96,
    },
  },
  {
    id: 'wake-up-extended-window',
    name: 'Wake-Up Stroke Extended Window (DAWN/DEFUSE-3)',
    description: '72-year-old female went to sleep normal at 22:00, woke up with dense left hemiparesis at 07:00 (LKW 9.0h). CT perfusion shows core 18 mL, penumbra 115 mL. Candidate for EVT.',
    profile: {
      ageYears: 72,
      weightKg: 68,
      hoursFromLastKnownWell: 9.0,
      systolicBpMmHg: 174,
      diastolicBpMmHg: 98,
      bloodGlucoseMgDl: 145,
      plateletsPerUl: 195000,
      inr: 1.1,
      apttSeconds: 30,
      recentDoacWithin48h: false,
      intracranialHemorrhageOnCt: false,
      recentHeadTraumaOrStroke3Mo: false,
      activeInternalBleed: false,
      nihss: {
        loc1a: 0,
        locQuestions1b: 0,
        locCommands1c: 0,
        bestGaze2: 1,
        visualFields3: 1,
        facialPalsy4: 2,
        motorArmLeft5a: 4,
        motorArmRight5b: 0,
        motorLegLeft6a: 3,
        motorLegRight6b: 0,
        limbAtaxia7: 0,
        sensory8: 2,
        bestLanguage9: 0,
        dysarthria10: 1,
        extinction11: 2,
      },
      aspects: {
        caudate: true,
        lentiform: true,
        internalCapsule: true,
        insularRibbon: false,
        m1AnteriorCortex: true,
        m2TemporalCortex: true,
        m3PosteriorCortex: true,
        m4AnteriorSupraganglionic: true,
        m5TemporalSupraganglionic: true,
        m6PosteriorSupraganglionic: true,
      },
      largeVesselOcclusionPresent: true,
      lvoSite: 'ICA_TERMINUS',
      coreVolumeMl: 18,
      penumbraVolumeMl: 115,
    },
  },
  {
    id: 'minor-stroke-dapt',
    name: 'Minor Non-Disabling Ischemic Stroke (NIHSS 2)',
    description: '58-year-old male with isolated right hand clumsiness and mild facial droop. LKW 1.0h, NIHSS 2. Dual antiplatelet therapy (Aspirin + Clopidogrel) indicated; IV lysis withheld.',
    profile: {
      ageYears: 58,
      weightKg: 82,
      hoursFromLastKnownWell: 1.0,
      systolicBpMmHg: 142,
      diastolicBpMmHg: 86,
      bloodGlucoseMgDl: 108,
      plateletsPerUl: 220000,
      inr: 1.0,
      apttSeconds: 27,
      recentDoacWithin48h: false,
      intracranialHemorrhageOnCt: false,
      recentHeadTraumaOrStroke3Mo: false,
      activeInternalBleed: false,
      nihss: {
        loc1a: 0,
        locQuestions1b: 0,
        locCommands1c: 0,
        bestGaze2: 0,
        visualFields3: 0,
        facialPalsy4: 1,
        motorArmLeft5a: 0,
        motorArmRight5b: 1,
        motorLegLeft6a: 0,
        motorLegRight6b: 0,
        limbAtaxia7: 0,
        sensory8: 0,
        bestLanguage9: 0,
        dysarthria10: 0,
        extinction11: 0,
      },
      aspects: {
        caudate: true,
        lentiform: true,
        internalCapsule: true,
        insularRibbon: true,
        m1AnteriorCortex: true,
        m2TemporalCortex: true,
        m3PosteriorCortex: true,
        m4AnteriorSupraganglionic: true,
        m5TemporalSupraganglionic: true,
        m6PosteriorSupraganglionic: true,
      },
      largeVesselOcclusionPresent: false,
    },
  },
  {
    id: 'severe-hypertension-pretpa',
    name: 'Severe Hypertension Pre-tPA (BP 210/118 mmHg)',
    description: '61-year-old female eligible by time (2.0h) and NIHSS (14), but presenting BP is 210/118 mmHg. Requires aggressive IV labetalol / nicardipine to SBP < 185 prior to bolus.',
    profile: {
      ageYears: 61,
      weightKg: 70,
      hoursFromLastKnownWell: 2.0,
      systolicBpMmHg: 210,
      diastolicBpMmHg: 118,
      bloodGlucoseMgDl: 132,
      plateletsPerUl: 210000,
      inr: 1.0,
      apttSeconds: 29,
      recentDoacWithin48h: false,
      intracranialHemorrhageOnCt: false,
      recentHeadTraumaOrStroke3Mo: false,
      activeInternalBleed: false,
      nihss: {
        loc1a: 0,
        locQuestions1b: 1,
        locCommands1c: 0,
        bestGaze2: 1,
        visualFields3: 1,
        facialPalsy4: 2,
        motorArmLeft5a: 3,
        motorArmRight5b: 0,
        motorLegLeft6a: 3,
        motorLegRight6b: 0,
        limbAtaxia7: 0,
        sensory8: 1,
        bestLanguage9: 1,
        dysarthria10: 1,
        extinction11: 1,
      },
      aspects: {
        caudate: true,
        lentiform: true,
        internalCapsule: true,
        insularRibbon: true,
        m1AnteriorCortex: true,
        m2TemporalCortex: true,
        m3PosteriorCortex: true,
        m4AnteriorSupraganglionic: true,
        m5TemporalSupraganglionic: true,
        m6PosteriorSupraganglionic: true,
      },
      largeVesselOcclusionPresent: true,
      lvoSite: 'MCA_M1',
    },
  },
  {
    id: 'large-core-low-aspects',
    name: 'Large Established Core Infarct (ASPECTS 4/10)',
    description: '79-year-old male with extensive early hypodensity involving caudate, lentiform, insula, and M1-M3 (>1/3 MCA). High risk of fatal hemorrhagic conversion with thrombolysis.',
    profile: {
      ageYears: 79,
      weightKg: 85,
      hoursFromLastKnownWell: 3.5,
      systolicBpMmHg: 165,
      diastolicBpMmHg: 92,
      bloodGlucoseMgDl: 160,
      plateletsPerUl: 180000,
      inr: 1.2,
      apttSeconds: 31,
      recentDoacWithin48h: false,
      intracranialHemorrhageOnCt: false,
      recentHeadTraumaOrStroke3Mo: false,
      activeInternalBleed: false,
      nihss: {
        loc1a: 1,
        locQuestions1b: 2,
        locCommands1c: 2,
        bestGaze2: 2,
        visualFields3: 2,
        facialPalsy4: 3,
        motorArmLeft5a: 0,
        motorArmRight5b: 4,
        motorLegLeft6a: 0,
        motorLegRight6b: 4,
        limbAtaxia7: 0,
        sensory8: 2,
        bestLanguage9: 3,
        dysarthria10: 2,
        extinction11: 2,
      },
      aspects: {
        caudate: false,
        lentiform: false,
        internalCapsule: true,
        insularRibbon: false,
        m1AnteriorCortex: false,
        m2TemporalCortex: false,
        m3PosteriorCortex: false,
        m4AnteriorSupraganglionic: true,
        m5TemporalSupraganglionic: true,
        m6PosteriorSupraganglionic: true,
      },
      largeVesselOcclusionPresent: true,
      lvoSite: 'MCA_M1',
      coreVolumeMl: 85,
      penumbraVolumeMl: 40,
    },
  },
  {
    id: 'doac-anticoagulated-evt-direct',
    name: 'DOAC Anticoagulated Patient (Direct to EVT)',
    description: '67-year-old male on Apixaban for AF took dose 6 hours ago. IV tPA is contraindicated due to active DOAC, but MCA M1 occlusion makes him an immediate candidate for EVT.',
    profile: {
      ageYears: 67,
      weightKg: 75,
      hoursFromLastKnownWell: 2.2,
      systolicBpMmHg: 158,
      diastolicBpMmHg: 90,
      bloodGlucoseMgDl: 115,
      plateletsPerUl: 230000,
      inr: 1.3,
      apttSeconds: 32,
      recentDoacWithin48h: true,
      intracranialHemorrhageOnCt: false,
      recentHeadTraumaOrStroke3Mo: false,
      activeInternalBleed: false,
      nihss: {
        loc1a: 0,
        locQuestions1b: 1,
        locCommands1c: 1,
        bestGaze2: 1,
        visualFields3: 1,
        facialPalsy4: 2,
        motorArmLeft5a: 0,
        motorArmRight5b: 4,
        motorLegLeft6a: 0,
        motorLegRight6b: 3,
        limbAtaxia7: 0,
        sensory8: 1,
        bestLanguage9: 2,
        dysarthria10: 1,
        extinction11: 1,
      },
      aspects: {
        caudate: true,
        lentiform: true,
        internalCapsule: true,
        insularRibbon: true,
        m1AnteriorCortex: true,
        m2TemporalCortex: true,
        m3PosteriorCortex: true,
        m4AnteriorSupraganglionic: true,
        m5TemporalSupraganglionic: true,
        m6PosteriorSupraganglionic: true,
      },
      largeVesselOcclusionPresent: true,
      lvoSite: 'MCA_M1',
      coreVolumeMl: 12,
      penumbraVolumeMl: 105,
    },
  },
  {
    id: 'hypoglycemia-stroke-mimic',
    name: 'Hypoglycemic Stroke Mimic (Blood Glucose 34 mg/dL)',
    description: '52-year-old diabetic found with acute right hemiparesis and aphasia. Blood glucose 34 mg/dL. IV thrombolysis withheld; 50 mL D50W resolves deficits completely.',
    profile: {
      ageYears: 52,
      weightKg: 80,
      hoursFromLastKnownWell: 1.0,
      systolicBpMmHg: 148,
      diastolicBpMmHg: 88,
      bloodGlucoseMgDl: 34,
      plateletsPerUl: 260000,
      inr: 1.0,
      apttSeconds: 26,
      recentDoacWithin48h: false,
      intracranialHemorrhageOnCt: false,
      recentHeadTraumaOrStroke3Mo: false,
      activeInternalBleed: false,
      nihss: {
        loc1a: 1,
        locQuestions1b: 2,
        locCommands1c: 1,
        bestGaze2: 1,
        visualFields3: 0,
        facialPalsy4: 2,
        motorArmLeft5a: 0,
        motorArmRight5b: 3,
        motorLegLeft6a: 0,
        motorLegRight6b: 2,
        limbAtaxia7: 0,
        sensory8: 0,
        bestLanguage9: 2,
        dysarthria10: 1,
        extinction11: 0,
      },
      aspects: {
        caudate: true,
        lentiform: true,
        internalCapsule: true,
        insularRibbon: true,
        m1AnteriorCortex: true,
        m2TemporalCortex: true,
        m3PosteriorCortex: true,
        m4AnteriorSupraganglionic: true,
        m5TemporalSupraganglionic: true,
        m6PosteriorSupraganglionic: true,
      },
      largeVesselOcclusionPresent: false,
    },
  },
  {
    id: 'post-thrombectomy-recanalized',
    name: 'Successful Post-Thrombectomy mTICI 3 Reperfusion',
    description: '69-year-old male status-post successful stent-retriever thrombectomy of right M1. Neurological recovery underway (NIHSS improving from 19 to 4). Target SBP < 140 mmHg.',
    profile: {
      ageYears: 69,
      weightKg: 76,
      hoursFromLastKnownWell: 4.0,
      systolicBpMmHg: 135,
      diastolicBpMmHg: 80,
      bloodGlucoseMgDl: 118,
      plateletsPerUl: 215000,
      inr: 1.0,
      apttSeconds: 28,
      recentDoacWithin48h: false,
      intracranialHemorrhageOnCt: false,
      recentHeadTraumaOrStroke3Mo: false,
      activeInternalBleed: false,
      nihss: {
        loc1a: 0,
        locQuestions1b: 0,
        locCommands1c: 0,
        bestGaze2: 0,
        visualFields3: 0,
        facialPalsy4: 1,
        motorArmLeft5a: 1,
        motorArmRight5b: 0,
        motorLegLeft6a: 1,
        motorLegRight6b: 0,
        limbAtaxia7: 0,
        sensory8: 1,
        bestLanguage9: 0,
        dysarthria10: 0,
        extinction11: 0,
      },
      aspects: {
        caudate: true,
        lentiform: false,
        internalCapsule: true,
        insularRibbon: true,
        m1AnteriorCortex: true,
        m2TemporalCortex: true,
        m3PosteriorCortex: true,
        m4AnteriorSupraganglionic: true,
        m5TemporalSupraganglionic: true,
        m6PosteriorSupraganglionic: true,
      },
      largeVesselOcclusionPresent: false,
      coreVolumeMl: 12,
      penumbraVolumeMl: 15,
    },
  },
];
