export interface NEWS2Parameters {
  respirationRate: number;
  spo2Scale1: number;
  spo2Scale2?: number;
  usesOxygen: boolean;
  systolicBp: number;
  heartRate: number;
  consciousness: 'Alert' | 'CVPU';
  temperature: number;
}

export function calculateNEWS2Score(params: NEWS2Parameters, isHypercapnicTarget: boolean): { totalScore: number; riskTier: 'Low' | 'Low-Medium' | 'Medium' | 'High'; clinicalResponse: string; sbarScript: { situation: string; background: string; assessment: string; recommendation: string } } {
  let score = 0;

  // RR
  if (params.respirationRate <= 8) score += 3;
  else if (params.respirationRate >= 9 && params.respirationRate <= 11) score += 1;
  else if (params.respirationRate >= 21 && params.respirationRate <= 24) score += 2;
  else if (params.respirationRate >= 25) score += 3;

  // SpO2
  if (params.spo2Scale1 <= 91) score += 3;
  else if (params.spo2Scale1 >= 92 && params.spo2Scale1 <= 93) score += 2;
  else if (params.spo2Scale1 >= 94 && params.spo2Scale1 <= 95) score += 1;

  // Air/O2
  if (params.usesOxygen) score += 2;

  // Systolic BP
  if (params.systolicBp <= 90) score += 3;
  else if (params.systolicBp >= 91 && params.systolicBp <= 100) score += 2;
  else if (params.systolicBp >= 101 && params.systolicBp <= 110) score += 1;
  else if (params.systolicBp >= 220) score += 3;

  // Pulse
  if (params.heartRate <= 40) score += 3;
  else if (params.heartRate >= 41 && params.heartRate <= 50) score += 1;
  else if (params.heartRate >= 91 && params.heartRate <= 110) score += 1;
  else if (params.heartRate >= 111 && params.heartRate <= 130) score += 2;
  else if (params.heartRate >= 131) score += 3;

  // Consciousness
  if (params.consciousness === 'CVPU') score += 3;

  // Temperature
  if (params.temperature <= 35.0) score += 3;
  else if (params.temperature >= 35.1 && params.temperature <= 36.0) score += 1;
  else if (params.temperature >= 38.1 && params.temperature <= 39.0) score += 1;
  else if (params.temperature >= 39.1) score += 2;

  let riskTier: 'Low' | 'Low-Medium' | 'Medium' | 'High' = 'Low';
  let clinicalResponse = '';

  if (score === 0 || score <= 4) {
    riskTier = score === 0 ? 'Low' : 'Low-Medium';
    clinicalResponse = 'Ward-based response. Assess at least 12 hourly / 4-6 hourly.';
  } else if (score >= 5 && score <= 6) {
    riskTier = 'Medium';
    clinicalResponse = 'Urgent ward-based response. RN review and escalate to medical team. Hourly obs.';
  } else if (score >= 7) {
    riskTier = 'High';
    clinicalResponse = 'Emergency response. Call rapid response team / MET. Continuous monitoring.';
  }

  return {
    totalScore: score,
    riskTier,
    clinicalResponse,
    sbarScript: {
      situation: `Patient has a NEWS2 score of ${score}.`,
      background: 'Admitted with relevant history, currently showing deterioration.',
      assessment: `Vital signs triggered the score. RR: ${params.respirationRate}, SpO2: ${params.spo2Scale1}%, HR: ${params.heartRate}, BP: ${params.systolicBp}.`,
      recommendation: `Requesting immediate review as per ${riskTier} risk pathway.`
    }
  };
}

export const SAMPLE_NEWS2_SCENARIOS: Array<{ id: string; name: string; patientName: string; age: number; ward: string; params: NEWS2Parameters; isHypercapnic: boolean; diagnosis: string }> = [
  { id: 'scen1', name: 'Sepsis Deterioration', patientName: 'John Doe', age: 65, ward: 'Med-Surg', params: { respirationRate: 26, spo2Scale1: 90, usesOxygen: true, systolicBp: 85, heartRate: 120, consciousness: 'CVPU', temperature: 39.2 }, isHypercapnic: false, diagnosis: 'Pneumonia with presumed sepsis' },
  { id: 'scen2', name: 'Acute Asthma Attack', patientName: 'Jane Smith', age: 28, ward: 'Respiratory', params: { respirationRate: 22, spo2Scale1: 94, usesOxygen: true, systolicBp: 115, heartRate: 110, consciousness: 'Alert', temperature: 37.1 }, isHypercapnic: false, diagnosis: 'Severe asthma exacerbation' },
  { id: 'scen3', name: 'Post-Op Bleeding / Hypovolemia', patientName: 'Robert Brown', age: 45, ward: 'Surgical', params: { respirationRate: 20, spo2Scale1: 96, usesOxygen: false, systolicBp: 95, heartRate: 115, consciousness: 'Alert', temperature: 36.5 }, isHypercapnic: false, diagnosis: 'Post-op Day 1 abdominal surgery' },
  { id: 'scen4', name: 'Stable Post-Op', patientName: 'Emily Clark', age: 52, ward: 'Surgical', params: { respirationRate: 14, spo2Scale1: 98, usesOxygen: false, systolicBp: 120, heartRate: 75, consciousness: 'Alert', temperature: 36.8 }, isHypercapnic: false, diagnosis: 'Post-op elective cholecystectomy' }
];
