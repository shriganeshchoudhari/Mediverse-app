/**
 * VoicePatientPersona.ts
 * Reusable Clinical Persona Definition & State Machine for Voice AI Standardized Patients
 * Part of Mediverse Frontend Skills
 */

export interface PatientVitals {
  heartRate: number;
  bloodPressure: string;
  respiratoryRate: number;
  temperatureCelsius: number;
  oxygenSaturation: number;
}

export interface ClinicalFact {
  category: 'CHIEF_COMPLAINT' | 'HPI' | 'PAST_MEDICAL' | 'MEDICATIONS' | 'ALLERGIES' | 'SOCIAL_HISTORY';
  fact: string;
  revealed: boolean;
  requiredPromptKeywords: string[];
}

export interface StandardizedPatientPersona {
  id: string;
  name: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  occupation: string;
  chiefComplaint: string;
  emotionalState: 'CALM' | 'ANXIOUS' | 'IN_SEVERE_PAIN' | 'DEFENSIVE' | 'CONFUSED';
  painScale: number; // 1 to 10
  vitals: PatientVitals;
  underlyingDiagnosis: string;
  icd10Code: string;
  clinicalFacts: ClinicalFact[];
  voiceSettings: {
    pitch: number;
    rate: number;
    accent: string;
    breathiness: number;
  };
}

export const STANDARDIZED_PATIENTS: Record<string, StandardizedPatientPersona> = {
  'acute-appendicitis-01': {
    id: 'acute-appendicitis-01',
    name: 'John Miller',
    age: 28,
    gender: 'MALE',
    occupation: 'Software Engineer',
    chiefComplaint: 'Severe lower right abdominal pain that started around my belly button yesterday.',
    emotionalState: 'IN_SEVERE_PAIN',
    painScale: 8,
    vitals: {
      heartRate: 104,
      bloodPressure: '132/84',
      respiratoryRate: 20,
      temperatureCelsius: 38.3,
      oxygenSaturation: 99,
    },
    underlyingDiagnosis: 'Acute Appendicitis',
    icd10Code: 'K35.80',
    clinicalFacts: [
      {
        category: 'HPI',
        fact: 'Pain began periumbilically 24 hours ago, then migrated to Right Lower Quadrant (McBurney point).',
        revealed: false,
        requiredPromptKeywords: ['where', 'start', 'move', 'migrate', 'location', 'radiation'],
      },
      {
        category: 'HPI',
        fact: 'Nauseous with 2 episodes of non-bilious emesis this morning. Anorexic (no appetite).',
        revealed: false,
        requiredPromptKeywords: ['nausea', 'vomit', 'eat', 'appetite', 'food'],
      },
      {
        category: 'PAST_MEDICAL',
        fact: 'No prior surgeries. Appendectomy has not been performed.',
        revealed: false,
        requiredPromptKeywords: ['surgery', 'prior', 'medical history', 'past'],
      },
      {
        category: 'ALLERGIES',
        fact: 'Severe anaphylactic allergy to Penicillin.',
        revealed: false,
        requiredPromptKeywords: ['allergy', 'allergic', 'penicillin', 'medications'],
      },
    ],
    voiceSettings: {
      pitch: 0.95,
      rate: 0.9,
      accent: 'en-US',
      breathiness: 0.4,
    },
  },
  'stemi-cardio-02': {
    id: 'stemi-cardio-02',
    name: 'Robert Davis',
    age: 58,
    gender: 'MALE',
    occupation: 'Truck Driver',
    chiefComplaint: 'Crushing retrosternal chest pain radiating to left jaw and shoulder for past 45 minutes.',
    emotionalState: 'ANXIOUS',
    painScale: 9,
    vitals: {
      heartRate: 112,
      bloodPressure: '158/96',
      respiratoryRate: 24,
      temperatureCelsius: 36.9,
      oxygenSaturation: 94,
    },
    underlyingDiagnosis: 'Acute Anterior STEMI (Myocardial Infarction)',
    icd10Code: 'I21.0',
    clinicalFacts: [
      {
        category: 'HPI',
        fact: 'Substernal pressure described as elephant on chest, onset at rest, accompanied by diaphoresis and dyspnea.',
        revealed: false,
        requiredPromptKeywords: ['chest', 'pressure', 'radiat', 'breath', 'sweat', 'diaphoresis'],
      },
      {
        category: 'PAST_MEDICAL',
        fact: 'Hypertension and Type 2 Diabetes for 10 years; 30 pack-year smoking history.',
        revealed: false,
        requiredPromptKeywords: ['smoke', 'smoking', 'tobacco', 'diabetes', 'hypertension', 'blood pressure'],
      },
      {
        category: 'MEDICATIONS',
        fact: 'Takes Metformin 1000mg BID and Lisinopril 20mg daily, but frequently non-compliant.',
        revealed: false,
        requiredPromptKeywords: ['medic', 'prescription', 'drugs', 'metformin', 'lisinopril'],
      },
    ],
    voiceSettings: {
      pitch: 0.85,
      rate: 0.85,
      accent: 'en-US',
      breathiness: 0.6,
    },
  },
};
