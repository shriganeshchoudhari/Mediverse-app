/**
 * HdfnRhogamKleihauerEngine.ts
 * Hemolytic Disease of the Fetus and Newborn (HDFN), RhD Alloimmunization,
 * Kleihauer-Betke (KB) Acid-Elution FMH Quantification, Fetal MCA Doppler PSV,
 * and AABB Precision RhIg (RhoGAM) Dosing Solver.
 * Location: frontend/.gemini/skills/HdfnRhogamKleihauerEngine.ts
 */

export interface HdfnPatientInput {
  maternalRhType: 'RH_NEGATIVE' | 'RH_POSITIVE';
  fetalRhType: 'RH_POSITIVE' | 'RH_NEGATIVE' | 'UNKNOWN';
  gestationalWeeks: number; // 12 to 40
  maternalAntiDTiter: number; // e.g., 0, 2, 4, 8, 16, 32, 64, 128
  rosetteScreenPositive: boolean;
  kbFetalCellsCounted: number; // in 2000 total cells (or direct count)
  kbTotalCellsCounted: number; // standard 2000 cells
  fetalMcaPsvCmSec: number; // Middle Cerebral Artery Peak Systolic Velocity
  fetalAscitesOrEffusion: boolean; // Hydrops fetalis sign
  hoursPostDeliveryOrEvent: number; // 0 to 96 hours
}

export interface HdfnClinicalMetrics {
  isCandidateForRhIg: boolean;
  rhAlloimmunized: boolean; // Titer >= 16 indicates critical alloimmunization
  fetalCellsPercentage: number;
  fetomaternalHemorrhageVolumeMl: number; // Whole blood in mL
  fetalRbcVolumeMl: number; // Packed RBCs in mL
  calculatedRhIgVialsRaw: number;
  recommendedRhIgVials: number; // AABB rounding + 1 safety vial
  recommendedRhIgMicrograms: number; // 300 ug per vial
  recommendedRhIgIu: number; // 1500 IU per vial
  fetalMcaMedianCmSec: number; // Expected median for gestational age
  fetalMcaMom: number; // Multiples of the Median
  fetalAnemiaSeverity: 'NONE' | 'MILD' | 'MODERATE' | 'SEVERE_HYDROPS_RISK';
  intrauterineTransfusionIndicated: boolean;
  urgencyStatus: 'ROUTINE_PROPHYLAXIS' | 'POSTPARTUM_URGENT' | 'FETAL_EMERGENCY_IUT' | 'NOT_INDICATED';
  diagnosticSummary: string;
  clinicalActionChecklist: string[];
}

export const HDFN_PRESETS: {
  id: string;
  name: string;
  badge: string;
  description: string;
  input: HdfnPatientInput;
}[] = [
  {
    id: 'routine-antenatal-28w',
    name: 'Routine 28-Week Antenatal Prophylaxis',
    badge: 'Standard Preventive Care',
    description: 'Non-sensitized Rh-negative mother at 28 weeks gestation with Rh+ father. Antibody screen negative (titer 0). Standard single 300 µg RhIg dose indicated.',
    input: {
      maternalRhType: 'RH_NEGATIVE',
      fetalRhType: 'UNKNOWN',
      gestationalWeeks: 28,
      maternalAntiDTiter: 0,
      rosetteScreenPositive: false,
      kbFetalCellsCounted: 0,
      kbTotalCellsCounted: 2000,
      fetalMcaPsvCmSec: 32,
      fetalAscitesOrEffusion: false,
      hoursPostDeliveryOrEvent: 0,
    },
  },
  {
    id: 'standard-delivery-low-bleed',
    name: 'Uncomplicated Term Delivery (Normal FMH <= 30 mL)',
    badge: 'Standard Postpartum RhIg',
    description: 'Postpartum delivery of Rh+ infant to unsensitized Rh- mother. KB stain shows 0.3% fetal cells (15 mL FMH). Standard 1 vial + 1 safety vial calculation covers bleed.',
    input: {
      maternalRhType: 'RH_NEGATIVE',
      fetalRhType: 'RH_POSITIVE',
      gestationalWeeks: 39,
      maternalAntiDTiter: 0,
      rosetteScreenPositive: false,
      kbFetalCellsCounted: 6,
      kbTotalCellsCounted: 2000,
      fetalMcaPsvCmSec: 52,
      fetalAscitesOrEffusion: false,
      hoursPostDeliveryOrEvent: 12,
    },
  },
  {
    id: 'massive-fmh-abruption',
    name: 'Massive Fetomaternal Hemorrhage (Placental Abruption)',
    badge: 'High-Dose RhIg Required',
    description: 'Motor vehicle accident with partial abruption. Positive rosette screen followed by KB test revealing 1.8% fetal cells (90 mL FMH). Mandates 4 vials of RhIg.',
    input: {
      maternalRhType: 'RH_NEGATIVE',
      fetalRhType: 'RH_POSITIVE',
      gestationalWeeks: 34,
      maternalAntiDTiter: 0,
      rosetteScreenPositive: true,
      kbFetalCellsCounted: 36,
      kbTotalCellsCounted: 2000,
      fetalMcaPsvCmSec: 58,
      fetalAscitesOrEffusion: false,
      hoursPostDeliveryOrEvent: 6,
    },
  },
  {
    id: 'sensitized-severe-mca-anemia',
    name: 'Severe Rh Alloimmunization & Fetal Anemia (MCA > 1.5 MoM)',
    badge: 'Intrauterine Transfusion Alert',
    description: 'Rh- mother with Anti-D titer 1:64. Fetal MCA Doppler PSV is 76 cm/s (1.65 MoM) with early pericardial effusion. RhIg is ineffective once sensitized; emergent IUT indicated.',
    input: {
      maternalRhType: 'RH_NEGATIVE',
      fetalRhType: 'RH_POSITIVE',
      gestationalWeeks: 32,
      maternalAntiDTiter: 64,
      rosetteScreenPositive: false,
      kbFetalCellsCounted: 0,
      kbTotalCellsCounted: 2000,
      fetalMcaPsvCmSec: 76,
      fetalAscitesOrEffusion: true,
      hoursPostDeliveryOrEvent: 0,
    },
  },
  {
    id: 'rh-positive-mother-control',
    name: 'Rh-Positive Mother (Negative Control)',
    badge: 'No Anti-D Prophylaxis Needed',
    description: 'Rh-positive mother delivering Rh-positive infant. RhD alloimmunization impossible; RhIg is contraindicated/not indicated.',
    input: {
      maternalRhType: 'RH_POSITIVE',
      fetalRhType: 'RH_POSITIVE',
      gestationalWeeks: 38,
      maternalAntiDTiter: 0,
      rosetteScreenPositive: false,
      kbFetalCellsCounted: 0,
      kbTotalCellsCounted: 2000,
      fetalMcaPsvCmSec: 50,
      fetalAscitesOrEffusion: false,
      hoursPostDeliveryOrEvent: 24,
    },
  },
];

/**
 * Expected median MCA PSV based on Mari et al. equation for gestational age
 */
export function computeMedianMcaPsv(gestationalWeeks: number): number {
  // Mari equation approximation: Median PSV increases ~1.3-1.5 cm/s per week between 20-38w
  // At 20w ~ 24 cm/s; at 28w ~ 35 cm/s; at 32w ~ 46 cm/s; at 36w ~ 58 cm/s
  const baseWeek = Math.max(18, Math.min(40, gestationalWeeks));
  const median = Math.round(Math.exp(2.31 + 0.046 * baseWeek) * 10) / 10;
  return median;
}

/**
 * Solves HDFN, Kleihauer-Betke FMH, AABB RhIg vial dosing, and MCA Doppler MoM
 */
export function evaluateHdfnCase(input: HdfnPatientInput): HdfnClinicalMetrics {
  const {
    maternalRhType,
    fetalRhType,
    gestationalWeeks,
    maternalAntiDTiter,
    rosetteScreenPositive,
    kbFetalCellsCounted,
    kbTotalCellsCounted,
    fetalMcaPsvCmSec,
    fetalAscitesOrEffusion,
    hoursPostDeliveryOrEvent,
  } = input;

  // 1. Candidate Eligibility for RhIg
  // RhIg is ONLY for Rh-negative mothers who are NOT already sensitized (titer < 1:16 or titer 0)
  const isRhNeg = maternalRhType === 'RH_NEGATIVE';
  const isFetusRhPosOrUnknown = fetalRhType === 'RH_POSITIVE' || fetalRhType === 'UNKNOWN';
  const isAlloimmunized = maternalAntiDTiter >= 16;
  const isCandidate = isRhNeg && isFetusRhPosOrUnknown && !isAlloimmunized;

  // 2. Kleihauer-Betke Acid Elution FMH Calculations
  // Percentage of fetal cells = (fetal cells counted / total cells counted) * 100
  const safeTotal = Math.max(500, kbTotalCellsCounted);
  const fetalCellsPct = Math.round((kbFetalCellsCounted / safeTotal) * 10000) / 100; // e.g. 1.20%

  // FMH Volume (mL of fetal whole blood) = % fetal cells * 50
  // (Based on maternal blood volume of ~5000 mL: % / 100 * 5000 = % * 50)
  let fmhVolumeMl = Math.round(fetalCellsPct * 50 * 10) / 10;
  if (fmhVolumeMl === 0 && rosetteScreenPositive) {
    fmhVolumeMl = 10; // Minimum bleed detected by rosette screening
  }
  const fetalRbcMl = Math.round(fmhVolumeMl * 0.5 * 10) / 10; // Fetal Hct ~50%

  // 3. AABB Precision RhIg Dosing Formula
  // 1 vial (300 ug) protects up to 30 mL fetal whole blood (or 15 mL packed RBCs)
  // Raw vials = FMH / 30
  // AABB Rounding Rule:
  // If digit right of decimal < 5, round down, then ADD 1.
  // If digit right of decimal >= 5, round up, then ADD 1.
  const rawVials = fmhVolumeMl / 30;
  let recVials = 0;

  if (isCandidate) {
    if (fmhVolumeMl <= 0) {
      // Standard routine dose (28 weeks or uncomplicated delivery without excess FMH)
      recVials = 1;
    } else {
      const decimalPart = rawVials - Math.floor(rawVials);
      if (decimalPart < 0.5) {
        recVials = Math.floor(rawVials) + 1;
      } else {
        recVials = Math.ceil(rawVials) + 1;
      }
    }
  }

  const recUg = recVials * 300;
  const recIu = recVials * 1500;

  // 4. Fetal MCA Doppler PSV & MoM Anemia Assessment
  const medianPsv = computeMedianMcaPsv(gestationalWeeks);
  const mcaMom = Math.round((fetalMcaPsvCmSec / medianPsv) * 100) / 100;

  let anemiaGrade: HdfnClinicalMetrics['fetalAnemiaSeverity'] = 'NONE';
  let iutIndicated = false;

  if (fetalAscitesOrEffusion) {
    anemiaGrade = 'SEVERE_HYDROPS_RISK';
    iutIndicated = true;
  } else if (mcaMom >= 1.50) {
    anemiaGrade = 'SEVERE_HYDROPS_RISK';
    iutIndicated = isAlloimmunized;
  } else if (mcaMom >= 1.29) {
    anemiaGrade = 'MODERATE';
  } else if (mcaMom >= 1.15) {
    anemiaGrade = 'MILD';
  }

  // 5. Urgency and Clinical Action Checklist
  let urgency: HdfnClinicalMetrics['urgencyStatus'] = 'ROUTINE_PROPHYLAXIS';
  const actions: string[] = [];

  if (!isRhNeg) {
    urgency = 'NOT_INDICATED';
    actions.push('Mother is RhD-positive: No RhIg (RhoGAM) indicated.');
  } else if (isAlloimmunized) {
    urgency = iutIndicated ? 'FETAL_EMERGENCY_IUT' : 'ROUTINE_PROPHYLAXIS';
    actions.push(`CRITICAL: Maternal anti-D titer is ${maternalAntiDTiter} (>= 1:16). Patient is already sensitized.`);
    actions.push('RhIg is INEFFECTIVE once alloimmunization has occurred.');
    actions.push('Perform serial Fetal MCA Doppler PSV every 1-2 weeks to screen for fetal anemia.');
    if (iutIndicated) {
      actions.push('EMERGENCY: MCA PSV >= 1.50 MoM or hydrops noted. Prepare for urgent ultrasound-guided Cordocentesis & Intrauterine Transfusion (IUT).');
      actions.push('Blood bank preparation: Type O, RhD-negative, CMV-seronegative, irradiated, leukoreduced, washed packed RBCs crossmatched against maternal serum.');
    }
  } else {
    // Unsensitized Rh-negative candidate
    if (hoursPostDeliveryOrEvent > 0 && hoursPostDeliveryOrEvent <= 72) {
      urgency = 'POSTPARTUM_URGENT';
      actions.push(`Administer ${recVials} vial(s) (${recUg} µg / ${recIu} IU) of RhIg intramuscularly within 72 hours of delivery/bleed.`);
    } else if (hoursPostDeliveryOrEvent > 72) {
      urgency = 'POSTPARTUM_URGENT';
      actions.push(`DELAYED PRESENTATION (> 72h): Administer ${recVials} vial(s) immediately (protection still partial up to 14-28 days).`);
    } else {
      urgency = 'ROUTINE_PROPHYLAXIS';
      actions.push(`Administer standard 1 vial (300 µg) RhIg prophylaxis at 28 weeks gestation.`);
    }

    if (fmhVolumeMl > 30) {
      actions.push(`Excess Fetomaternal Hemorrhage detected (${fmhVolumeMl} mL). High-dose RhIg (${recVials} vials) prevents alloimmunization.`);
    }
  }

  let summary = '';
  if (!isRhNeg) {
    summary = 'RhD-positive mother. No risk of RhD alloimmunization.';
  } else if (isAlloimmunized) {
    summary = `RhD-alloimmunized mother (titer 1:${maternalAntiDTiter}). Fetal MCA Doppler PSV is ${mcaMom} MoM (${anemiaGrade.replace(/_/g, ' ')}).`;
  } else {
    summary = `RhD-negative candidate. Kleihauer-Betke FMH is ${fmhVolumeMl} mL whole blood. AABB precision dosing: ${recVials} vial(s) (${recUg} µg).`;
  }

  return {
    isCandidateForRhIg: isCandidate,
    rhAlloimmunized: isAlloimmunized,
    fetalCellsPercentage: fetalCellsPct,
    fetomaternalHemorrhageVolumeMl: fmhVolumeMl,
    fetalRbcVolumeMl: fetalRbcMl,
    calculatedRhIgVialsRaw: Math.round(rawVials * 100) / 100,
    recommendedRhIgVials: recVials,
    recommendedRhIgMicrograms: recUg,
    recommendedRhIgIu: recIu,
    fetalMcaMedianCmSec: medianPsv,
    fetalMcaMom: mcaMom,
    fetalAnemiaSeverity: anemiaGrade,
    intrauterineTransfusionIndicated: iutIndicated,
    urgencyStatus: urgency,
    diagnosticSummary: summary,
    clinicalActionChecklist: actions,
  };
}
