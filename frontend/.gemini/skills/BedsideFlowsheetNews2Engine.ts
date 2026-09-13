/**
 * BedsideFlowsheetNews2Engine.ts
 * Inpatient Nursing, Intensive Care & Hospital Medicine: Advanced Bedside Flowsheet, Fluid Balance & Early Warning Deterioration (NEWS2 / MEWS) Engine
 *
 * Implements:
 * - Official Royal College of Physicians (RCP) NEWS2 Scoring Algorithm
 * - Scale 1 (standard) vs Scale 2 (hypercapnic respiratory failure / COPD target 88-92%) SpO2 scoring
 * - Clinical risk stratification (Low 0-4, Low-Med 3 in single, Medium 5-6, High >= 7) and RRT escalation tiers
 * - 24-Hour hourly intensive care flowsheet grid (00:00 to 23:00)
 * - Quantitative fluid intake vs output balance sheet with insensible loss modeling
 * - Percentage Fluid Overload (%FO = Net Balance / Admission Weight * 100%)
 *
 * Location: frontend/.gemini/skills/BedsideFlowsheetNews2Engine.ts
 */

export interface News2Vitals {
  respiratoryRate: number;
  spo2Scale: 1 | 2; // Scale 1 normal, Scale 2 hypercapnic failure (COPD)
  spo2Percent: number;
  onSupplementalOxygen: boolean;
  systolicBp: number;
  heartRate: number;
  consciousness: 'A' | 'C' | 'V' | 'P' | 'U'; // Alert, Confusion, Voice, Pain, Unresponsive
  temperatureCelsius: number;
}

export interface News2ScoreBreakdown {
  respiratoryRateScore: number;
  spo2Score: number;
  supplementalOxygenScore: number;
  systolicBpScore: number;
  heartRateScore: number;
  consciousnessScore: number;
  temperatureScore: number;
  totalScore: number;
  hasSingleParameterScoreThree: boolean;
  riskLevel: 'LOW' | 'LOW_MEDIUM' | 'MEDIUM' | 'HIGH';
  clinicalAction: string;
  monitoringFrequencyHours: number;
  recommendedEscalation: string;
}

export interface HourlyFlowsheetRow {
  hourString: string; // "00:00", "01:00", etc.
  vitals: News2Vitals;
  news2Score: number;
  intakeCrystalloidMl: number;
  intakeColloidBloodMl: number;
  intakeEnteralOralMl: number;
  intakeMedicationFlushMl: number;
  totalIntakeMl: number;
  outputUrineMl: number;
  outputDrainTubeMl: number;
  outputStoolEmesisMl: number;
  outputInsensibleMl: number;
  totalOutputMl: number;
  hourlyNetBalanceMl: number;
  cumulativeNetBalanceMl: number;
}

export interface PatientFlowsheetProfile {
  id: string;
  name: string;
  medicalRecordNumber: string;
  admissionWeightKg: number;
  currentWeightKg: number;
  diagnosis: string;
  isHypercapnicCopd: boolean; // Uses Scale 2 if true
  wardLocation: string;
  historySummary: string;
  hourlyData: HourlyFlowsheetRow[];
}

// ----------------------------------------------------------------------
// 1. NEWS2 Scoring Algorithm
// ----------------------------------------------------------------------

export function calculateNews2Score(vitals: News2Vitals): News2ScoreBreakdown {
  // 1. Respiratory Rate
  let rrScore = 0;
  if (vitals.respiratoryRate <= 8) rrScore = 3;
  else if (vitals.respiratoryRate >= 9 && vitals.respiratoryRate <= 11) rrScore = 1;
  else if (vitals.respiratoryRate >= 12 && vitals.respiratoryRate <= 20) rrScore = 0;
  else if (vitals.respiratoryRate >= 21 && vitals.respiratoryRate <= 24) rrScore = 2;
  else if (vitals.respiratoryRate >= 25) rrScore = 3;

  // 2. Oxygen Saturation (Scale 1 vs Scale 2)
  let spo2Score = 0;
  if (vitals.spo2Scale === 1) {
    if (vitals.spo2Percent <= 91) spo2Score = 3;
    else if (vitals.spo2Percent >= 92 && vitals.spo2Percent <= 93) spo2Score = 2;
    else if (vitals.spo2Percent >= 94 && vitals.spo2Percent <= 95) spo2Score = 1;
    else spo2Score = 0; // >= 96%
  } else {
    // Scale 2 (Target 88-92% for confirmed hypercapnic respiratory failure)
    if (vitals.onSupplementalOxygen) {
      if (vitals.spo2Percent <= 83) spo2Score = 3;
      else if (vitals.spo2Percent >= 84 && vitals.spo2Percent <= 85) spo2Score = 2;
      else if (vitals.spo2Percent >= 86 && vitals.spo2Percent <= 87) spo2Score = 1;
      else if (vitals.spo2Percent >= 88 && vitals.spo2Percent <= 92) spo2Score = 0;
      else if (vitals.spo2Percent >= 93 && vitals.spo2Percent <= 94) spo2Score = 1;
      else if (vitals.spo2Percent >= 95 && vitals.spo2Percent <= 96) spo2Score = 2;
      else spo2Score = 3; // >= 97% on supplemental O2 (risk of hypercapnic arrest)
    } else {
      if (vitals.spo2Percent <= 83) spo2Score = 3;
      else if (vitals.spo2Percent >= 84 && vitals.spo2Percent <= 85) spo2Score = 2;
      else if (vitals.spo2Percent >= 86 && vitals.spo2Percent <= 87) spo2Score = 1;
      else spo2Score = 0; // >= 88% on room air
    }
  }

  // 3. Supplemental Oxygen
  const o2Score = vitals.onSupplementalOxygen ? 2 : 0;

  // 4. Systolic Blood Pressure
  let sbpScore = 0;
  if (vitals.systolicBp <= 90) sbpScore = 3;
  else if (vitals.systolicBp >= 91 && vitals.systolicBp <= 100) sbpScore = 2;
  else if (vitals.systolicBp >= 101 && vitals.systolicBp <= 110) sbpScore = 1;
  else if (vitals.systolicBp >= 111 && vitals.systolicBp <= 219) sbpScore = 0;
  else sbpScore = 3; // >= 220 mmHg

  // 5. Heart Rate
  let hrScore = 0;
  if (vitals.heartRate <= 40) hrScore = 3;
  else if (vitals.heartRate >= 41 && vitals.heartRate <= 50) hrScore = 1;
  else if (vitals.heartRate >= 51 && vitals.heartRate <= 90) hrScore = 0;
  else if (vitals.heartRate >= 91 && vitals.heartRate <= 110) hrScore = 1;
  else if (vitals.heartRate >= 111 && vitals.heartRate <= 130) hrScore = 2;
  else hrScore = 3; // >= 131 bpm

  // 6. Consciousness (ACVPU: Alert=0, Confusion/Voice/Pain/Unresponsive=3)
  const consciousnessScore = vitals.consciousness === 'A' ? 0 : 3;

  // 7. Temperature
  let tempScore = 0;
  if (vitals.temperatureCelsius <= 35.0) tempScore = 3;
  else if (vitals.temperatureCelsius >= 35.1 && vitals.temperatureCelsius <= 36.0) tempScore = 1;
  else if (vitals.temperatureCelsius >= 36.1 && vitals.temperatureCelsius <= 38.0) tempScore = 0;
  else if (vitals.temperatureCelsius >= 38.1 && vitals.temperatureCelsius <= 39.0) tempScore = 1;
  else tempScore = 2; // >= 39.1°C

  const totalScore =
    rrScore +
    spo2Score +
    o2Score +
    sbpScore +
    hrScore +
    consciousnessScore +
    tempScore;

  const hasSingleParameterScoreThree =
    rrScore === 3 ||
    spo2Score === 3 ||
    sbpScore === 3 ||
    hrScore === 3 ||
    consciousnessScore === 3 ||
    tempScore === 3;

  let riskLevel: 'LOW' | 'LOW_MEDIUM' | 'MEDIUM' | 'HIGH' = 'LOW';
  let clinicalAction = 'Ward-based standard monitoring';
  let monitoringFrequencyHours = 12;
  let recommendedEscalation = 'Continue routine ward nursing observations.';

  if (totalScore >= 7) {
    riskLevel = 'HIGH';
    clinicalAction = 'EMERGENCY ESCALATION: Immediate assessment by critical care outreach team (CCOT/MET).';
    monitoringFrequencyHours = 0.5; // Continuous or q30min
    recommendedEscalation = 'STAT MET Call. Transfer to High Dependency Unit (HDU) or Intensive Care Unit (ICU). Continuous monitoring.';
  } else if (totalScore >= 5 && totalScore <= 6) {
    riskLevel = 'MEDIUM';
    clinicalAction = 'URGENT REVIEW: Ward doctor review within 30 minutes; alert medical emergency team.';
    monitoringFrequencyHours = 1;
    recommendedEscalation = 'Urgent medical review. Optimize oxygen therapy, IV access, septic screen, repeat vitals hourly.';
  } else if (hasSingleParameterScoreThree) {
    riskLevel = 'LOW_MEDIUM';
    clinicalAction = 'SINGLE PARAMETER RED ALERT: Urgent registered nurse assessment and medical consultation.';
    monitoringFrequencyHours = 1;
    recommendedEscalation = 'Assess underlying cause of extreme single parameter. Increase vital sign frequency to 1-hourly.';
  } else if (totalScore >= 1 && totalScore <= 4) {
    riskLevel = 'LOW';
    clinicalAction = 'Low risk: Registered nurse assessment. Minimum 4-6 hourly monitoring.';
    monitoringFrequencyHours = 4;
    recommendedEscalation = 'Nurse evaluates clinical context and determines if increased monitoring frequency is warranted.';
  }

  return {
    respiratoryRateScore: rrScore,
    spo2Score,
    supplementalOxygenScore: o2Score,
    systolicBpScore: sbpScore,
    heartRateScore: hrScore,
    consciousnessScore,
    temperatureScore: tempScore,
    totalScore,
    hasSingleParameterScoreThree,
    riskLevel,
    clinicalAction,
    monitoringFrequencyHours,
    recommendedEscalation
  };
}

// ----------------------------------------------------------------------
// 2. Fluid Balance & Overload Calculations
// ----------------------------------------------------------------------

export function calculateFluidBalanceSummary(
  rows: HourlyFlowsheetRow[],
  admissionWeightKg: number
): {
  total24hIntakeMl: number;
  total24hOutputMl: number;
  net24hBalanceMl: number;
  averageUrineOutputMlPerKgPerHour: number;
  percentFluidOverload: number;
  fluidOverloadRisk: 'NORMAL' | 'MILD' | 'MODERATE' | 'SEVERE';
} {
  const totalIntake = rows.reduce((acc, r) => acc + r.totalIntakeMl, 0);
  const totalOutput = rows.reduce((acc, r) => acc + r.totalOutputMl, 0);
  const netBalance = totalIntake - totalOutput;

  const totalUrine = rows.reduce((acc, r) => acc + r.outputUrineMl, 0);
  const hoursCount = Math.max(1, rows.length);
  const uoPerKgHr = totalUrine / (admissionWeightKg * hoursCount);

  // Percent fluid overload: (Cumulative Net Gain in L / Admission Weight in kg) * 100%
  // 1000 mL = 1 kg water weight
  const percentFo = (netBalance / (admissionWeightKg * 1000)) * 100;

  let foRisk: 'NORMAL' | 'MILD' | 'MODERATE' | 'SEVERE' = 'NORMAL';
  if (percentFo >= 10.0) foRisk = 'SEVERE'; // >= 10% associated with ARDS/AKI mortality
  else if (percentFo >= 7.0) foRisk = 'MODERATE';
  else if (percentFo >= 4.0) foRisk = 'MILD';

  return {
    total24hIntakeMl: Math.round(totalIntake),
    total24hOutputMl: Math.round(totalOutput),
    net24hBalanceMl: Math.round(netBalance),
    averageUrineOutputMlPerKgPerHour: parseFloat(uoPerKgHr.toFixed(2)),
    percentFluidOverload: parseFloat(percentFo.toFixed(1)),
    fluidOverloadRisk: foRisk
  };
}

// ----------------------------------------------------------------------
// 3. Clinical Cases Generator
// ----------------------------------------------------------------------

export function generateSepsisProgressionCase(): PatientFlowsheetProfile {
  const hours = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  let cumulative = 0;
  const rows: HourlyFlowsheetRow[] = hours.map((hr, idx) => {
    // Sepsis progression over 12 hours: RR climbs, BP falls, HR climbs
    const rr = 16 + idx; // 16 to 27
    const sbp = Math.max(82, 128 - idx * 4); // 128 down to 84
    const hrVal = 78 + idx * 5; // 78 up to 133
    const temp = 37.0 + idx * 0.18; // 37.0 up to 39.0
    const onO2 = idx >= 4;
    const spo2 = onO2 ? 94 : Math.max(90, 97 - idx);

    const vitals: News2Vitals = {
      respiratoryRate: rr,
      spo2Scale: 1,
      spo2Percent: spo2,
      onSupplementalOxygen: onO2,
      systolicBp: sbp,
      heartRate: hrVal,
      consciousness: idx >= 8 ? 'C' : 'A',
      temperatureCelsius: parseFloat(temp.toFixed(1))
    };

    const score = calculateNews2Score(vitals).totalScore;
    const intake = idx < 6 ? 125 : 350; // Resuscitation fluids added later
    const output = Math.max(15, 60 - idx * 4); // Oliguria develops
    const net = intake - (output + 35);
    cumulative += net;

    return {
      hourString: hr,
      vitals,
      news2Score: score,
      intakeCrystalloidMl: intake,
      intakeColloidBloodMl: 0,
      intakeEnteralOralMl: 0,
      intakeMedicationFlushMl: 20,
      totalIntakeMl: intake + 20,
      outputUrineMl: output,
      outputDrainTubeMl: 10,
      outputStoolEmesisMl: 0,
      outputInsensibleMl: 35,
      totalOutputMl: output + 45,
      hourlyNetBalanceMl: (intake + 20) - (output + 45),
      cumulativeNetBalanceMl: cumulative
    };
  });

  return {
    id: 'case-ward-sepsis',
    name: 'Arthur P. - Post-Op Anastomotic Leak & Septic Shock',
    medicalRecordNumber: 'MRN-789042',
    admissionWeightKg: 78,
    currentWeightKg: 81.2,
    diagnosis: 'Post-Op Low Anterior Resection & Peritonitis',
    isHypercapnicCopd: false,
    wardLocation: 'Surgical Stepdown Unit Bed 4',
    historySummary: 'Post-op Day 3 bowel resection. Developing progressive tachypnea, tachycardia, hypotension, and fever. Urgent MET call indicated.',
    hourlyData: rows
  };
}
