/**
 * FhirInteroperabilityEngine.ts
 * HL7 FHIR R4 (v4.0.1) & Clinical Health Informatics Interoperability Engine
 * Track C1 - Mediverse Clinical Platform Architecture
 */

export type FHIRResourceType =
  | 'Patient'
  | 'Encounter'
  | 'Condition'
  | 'Observation'
  | 'MedicationRequest'
  | 'DiagnosticReport'
  | 'Bundle';

export interface FHIRCoding {
  system: string;
  code: string;
  display: string;
}

export interface FHIRCodeableConcept {
  coding: FHIRCoding[];
  text?: string;
}

export interface FHIRQuantity {
  value: number;
  unit: string;
  system: string;
  code: string;
}

export interface FHIRReference {
  reference: string;
  display?: string;
}

export interface FHIRPatient {
  resourceType: 'Patient';
  id: string;
  identifier: { system: string; value: string }[];
  active: boolean;
  name: { use: string; family: string; given: string[] }[];
  gender: 'male' | 'female' | 'other' | 'unknown';
  birthDate: string;
  telecom: { system: string; value: string; use: string }[];
  address: { line: string[]; city: string; state: string; postalCode: string; country: string }[];
}

export interface FHIREncounter {
  resourceType: 'Encounter';
  id: string;
  status: 'planned' | 'in-progress' | 'finished';
  class: { system: string; code: 'AMB' | 'IMP' | 'EMER'; display: string };
  subject: FHIRReference;
  period: { start: string; end?: string };
  reasonCode: FHIRCodeableConcept[];
}

export interface FHIRCondition {
  resourceType: 'Condition';
  id: string;
  clinicalStatus: { coding: FHIRCoding[] };
  verificationStatus: { coding: FHIRCoding[] };
  category?: FHIRCodeableConcept[];
  severity?: FHIRCodeableConcept;
  code: FHIRCodeableConcept;
  subject: FHIRReference;
  encounter?: FHIRReference;
  onsetDateTime: string;
}

export interface FHIRObservation {
  resourceType: 'Observation';
  id: string;
  status: 'final' | 'preliminary';
  category: FHIRCodeableConcept[];
  code: FHIRCodeableConcept;
  subject: FHIRReference;
  encounter?: FHIRReference;
  effectiveDateTime: string;
  valueQuantity?: FHIRQuantity;
  valueString?: string;
  referenceRange?: { low?: FHIRQuantity; high?: FHIRQuantity; text?: string }[];
  interpretation?: FHIRCodeableConcept[];
}

export interface FHIRMedicationRequest {
  resourceType: 'MedicationRequest';
  id: string;
  status: 'active' | 'completed' | 'cancelled';
  intent: 'order';
  medicationCodeableConcept: FHIRCodeableConcept;
  subject: FHIRReference;
  encounter?: FHIRReference;
  authoredOn: string;
  dosageInstruction: {
    text: string;
    route?: FHIRCodeableConcept;
    doseAndRate?: { doseQuantity: FHIRQuantity }[];
  }[];
}

export interface FHIRDiagnosticReport {
  resourceType: 'DiagnosticReport';
  id: string;
  status: 'final' | 'preliminary';
  category: FHIRCodeableConcept[];
  code: FHIRCodeableConcept;
  subject: FHIRReference;
  encounter?: FHIRReference;
  effectiveDateTime: string;
  result: FHIRReference[];
  conclusion?: string;
}

export interface FHIRBundleEntry {
  fullUrl: string;
  resource:
    | FHIRPatient
    | FHIREncounter
    | FHIRCondition
    | FHIRObservation
    | FHIRMedicationRequest
    | FHIRDiagnosticReport;
}

export interface FHIRBundle {
  resourceType: 'Bundle';
  id: string;
  type: 'transaction' | 'collection' | 'searchset';
  total: number;
  timestamp: string;
  entry: FHIRBundleEntry[];
}

export interface SmartAuthSession {
  clientId: string;
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  scope: string;
  patientId: string;
  issuedAt: string;
  decodedClaims: {
    iss: string;
    sub: string;
    aud: string;
    exp: number;
    iat: number;
    patient: string;
    scope: string;
    fhirUser: string;
  };
}

export interface GraphNode {
  id: string;
  label: string;
  resourceType: FHIRResourceType;
  summary: string;
  category: string;
}

export interface GraphEdge {
  from: string;
  to: string;
  label: string;
}

export interface ResourceGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface FhirQueryResult {
  query: string;
  status: number;
  statusText: string;
  responseTimeMs: number;
  totalMatches: number;
  resources: any[];
}

export interface ClinicalPreset {
  id: string;
  name: string;
  subtitle: string;
  domain: string;
  patientName: string;
  age: number;
  gender: 'male' | 'female';
  encounterType: 'IMP' | 'EMER' | 'AMB';
  keyFinding: string;
  bundle: FHIRBundle;
  rawHl7v2: string;
}

/**
 * Standard Presets Factory
 */
export function getClinicalPresets(): ClinicalPreset[] {
  const now = new Date().toISOString();

  // Preset 1: Septic Shock ICU Inpatient
  const sepsisPatient: FHIRPatient = {
    resourceType: 'Patient',
    id: 'pat-sepsis-001',
    identifier: [{ system: 'http://hospital.mediverse.org/mrn', value: 'MRN-782194' }],
    active: true,
    name: [{ use: 'official', family: 'Vance', given: ['Marcus', 'Alexander'] }],
    gender: 'male',
    birthDate: '1962-04-12',
    telecom: [{ system: 'phone', value: '+1-555-893-1120', use: 'home' }],
    address: [{ line: ['742 Evergreen Terr'], city: 'Boston', state: 'MA', postalCode: '02115', country: 'USA' }]
  };

  const sepsisEncounter: FHIREncounter = {
    resourceType: 'Encounter',
    id: 'enc-sepsis-001',
    status: 'in-progress',
    class: { system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode', code: 'IMP', display: 'Inpatient ICU' },
    subject: { reference: 'Patient/pat-sepsis-001', display: 'Marcus Vance' },
    period: { start: '2026-09-12T04:30:00Z' },
    reasonCode: [{
      coding: [{ system: 'http://snomed.info/sct', code: '91302008', display: 'Sepsis' }],
      text: 'Severe Sepsis secondary to Gram-negative bacteremia'
    }]
  };

  const sepsisConditions: FHIRCondition[] = [
    {
      resourceType: 'Condition',
      id: 'cond-sepsis-01',
      clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active', display: 'Active' }] },
      verificationStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-ver-status', code: 'confirmed', display: 'Confirmed' }] },
      code: {
        coding: [{ system: 'http://snomed.info/sct', code: '91302008', display: 'Sepsis' }],
        text: 'Septic Shock with hyperlactatemia'
      },
      severity: {
        coding: [{ system: 'http://snomed.info/sct', code: '24484000', display: 'Severe' }],
        text: 'Severe'
      },
      subject: { reference: 'Patient/pat-sepsis-001' },
      encounter: { reference: 'Encounter/enc-sepsis-001' },
      onsetDateTime: '2026-09-12T02:00:00Z'
    },
    {
      resourceType: 'Condition',
      id: 'cond-sepsis-02',
      clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active', display: 'Active' }] },
      verificationStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-ver-status', code: 'confirmed', display: 'Confirmed' }] },
      code: {
        coding: [{ system: 'http://snomed.info/sct', code: '19829001', display: 'Gram-negative bacteremia' }],
        text: 'E. coli bacteremia'
      },
      subject: { reference: 'Patient/pat-sepsis-001' },
      encounter: { reference: 'Encounter/enc-sepsis-001' },
      onsetDateTime: '2026-09-12T03:30:00Z'
    }
  ];

  const sepsisObservations: FHIRObservation[] = [
    {
      resourceType: 'Observation',
      id: 'obs-sepsis-lactate',
      status: 'final',
      category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'laboratory', display: 'Laboratory' }], text: 'Laboratory' }],
      code: { coding: [{ system: 'http://loinc.org', code: '2524-7', display: 'Lactate [Moles/volume] in Blood' }], text: 'Blood Lactate' },
      subject: { reference: 'Patient/pat-sepsis-001' },
      encounter: { reference: 'Encounter/enc-sepsis-001' },
      effectiveDateTime: '2026-09-12T06:00:00Z',
      valueQuantity: { value: 4.8, unit: 'mmol/L', system: 'http://unitsofmeasure.org', code: 'mmol/L' },
      referenceRange: [{ high: { value: 2.0, unit: 'mmol/L', system: 'http://unitsofmeasure.org', code: 'mmol/L' }, text: '< 2.0 mmol/L' }],
      interpretation: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation', code: 'H', display: 'Critical High' }], text: 'Critical High' }]
    },
    {
      resourceType: 'Observation',
      id: 'obs-sepsis-map',
      status: 'final',
      category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'vital-signs', display: 'Vital Signs' }], text: 'Vital Signs' }],
      code: { coding: [{ system: 'http://loinc.org', code: '8478-0', display: 'Mean blood pressure' }], text: 'Mean Arterial Pressure (MAP)' },
      subject: { reference: 'Patient/pat-sepsis-001' },
      encounter: { reference: 'Encounter/enc-sepsis-001' },
      effectiveDateTime: '2026-09-12T06:15:00Z',
      valueQuantity: { value: 54, unit: 'mm[Hg]', system: 'http://unitsofmeasure.org', code: 'mm[Hg]' },
      referenceRange: [{ low: { value: 65, unit: 'mm[Hg]', system: 'http://unitsofmeasure.org', code: 'mm[Hg]' }, text: '>= 65 mmHg' }],
      interpretation: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation', code: 'L', display: 'Low' }], text: 'Low' }]
    },
    {
      resourceType: 'Observation',
      id: 'obs-sepsis-hr',
      status: 'final',
      category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'vital-signs', display: 'Vital Signs' }], text: 'Vital Signs' }],
      code: { coding: [{ system: 'http://loinc.org', code: '8867-4', display: 'Heart rate' }], text: 'Heart Rate' },
      subject: { reference: 'Patient/pat-sepsis-001' },
      encounter: { reference: 'Encounter/enc-sepsis-001' },
      effectiveDateTime: '2026-09-12T06:15:00Z',
      valueQuantity: { value: 126, unit: '{beats}/min', system: 'http://unitsofmeasure.org', code: '{beats}/min' },
      referenceRange: [{ high: { value: 100, unit: '{beats}/min', system: 'http://unitsofmeasure.org', code: '{beats}/min' } }]
    },
    {
      resourceType: 'Observation',
      id: 'obs-sepsis-wbc',
      status: 'final',
      category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'laboratory', display: 'Laboratory' }], text: 'Laboratory' }],
      code: { coding: [{ system: 'http://loinc.org', code: '6690-2', display: 'Leukocytes [#/volume] in Blood' }], text: 'White Blood Cell Count' },
      subject: { reference: 'Patient/pat-sepsis-001' },
      encounter: { reference: 'Encounter/enc-sepsis-001' },
      effectiveDateTime: '2026-09-12T05:45:00Z',
      valueQuantity: { value: 24.2, unit: '10*3/uL', system: 'http://unitsofmeasure.org', code: '10*3/uL' }
    }
  ];

  const sepsisMeds: FHIRMedicationRequest[] = [
    {
      resourceType: 'MedicationRequest',
      id: 'med-sepsis-norepi',
      status: 'active',
      intent: 'order',
      medicationCodeableConcept: {
        coding: [{ system: 'http://www.nlm.nih.gov/research/umls/rxnorm', code: '7512', display: 'Norepinephrine' }],
        text: 'Norepinephrine IV Infusion (0.15 mcg/kg/min)'
      },
      subject: { reference: 'Patient/pat-sepsis-001' },
      encounter: { reference: 'Encounter/enc-sepsis-001' },
      authoredOn: '2026-09-12T05:00:00Z',
      dosageInstruction: [{
        text: '0.15 mcg/kg/min IV continuous infusion titrated to MAP >= 65 mmHg',
        doseAndRate: [{ doseQuantity: { value: 0.15, unit: 'ug/kg/min', system: 'http://unitsofmeasure.org', code: 'ug/kg/min' } }]
      }]
    },
    {
      resourceType: 'MedicationRequest',
      id: 'med-sepsis-vanc',
      status: 'active',
      intent: 'order',
      medicationCodeableConcept: {
        coding: [{ system: 'http://www.nlm.nih.gov/research/umls/rxnorm', code: '11124', display: 'Vancomycin' }],
        text: 'Vancomycin 1.5g IV in 500 mL D5W q12h'
      },
      subject: { reference: 'Patient/pat-sepsis-001' },
      encounter: { reference: 'Encounter/enc-sepsis-001' },
      authoredOn: '2026-09-12T04:45:00Z',
      dosageInstruction: [{
        text: '1.5 g IV every 12 hours infused over 90 minutes',
        doseAndRate: [{ doseQuantity: { value: 1500, unit: 'mg', system: 'http://unitsofmeasure.org', code: 'mg' } }]
      }]
    }
  ];

  const sepsisEntries: FHIRBundleEntry[] = [
    { fullUrl: 'urn:uuid:pat-sepsis-001', resource: sepsisPatient },
    { fullUrl: 'urn:uuid:enc-sepsis-001', resource: sepsisEncounter },
    ...sepsisConditions.map(c => ({ fullUrl: `urn:uuid:${c.id}`, resource: c })),
    ...sepsisObservations.map(o => ({ fullUrl: `urn:uuid:${o.id}`, resource: o })),
    ...sepsisMeds.map(m => ({ fullUrl: `urn:uuid:${m.id}`, resource: m }))
  ];

  const sepsisBundle: FHIRBundle = {
    resourceType: 'Bundle',
    id: 'bundle-septic-shock-icu',
    type: 'collection',
    total: sepsisEntries.length,
    timestamp: now,
    entry: sepsisEntries
  };

  const sepsisHl7 = `MSH|^~\\&|EPIC_EHR|MGH_ED|MEDIVERSE_CDS|ICU|20260912061500||ADT^A01|MSG-948102|P|2.5
PID|1||MRN-782194^^^MGH^MR||Vance^Marcus^Alexander||19620412|M|||742 Evergreen Terr^^Boston^MA^02115^USA||5558931120
PV1|1|I|ICU^BED-04^01||||12849^Attending^Physician|||||||||||ENC-SEPSIS-001
DG1|1||91302008^Sepsis^SCT||20260912020000|A
DG1|2||19829001^Gram-negative bacteremia^SCT||20260912033000|A
OBX|1|NM|2524-7^Lactate^LN||4.8|mmol/L|0.5-2.0|H|||F|||20260912060000
OBX|2|NM|8478-0^Mean Arterial Pressure^LN||54|mm[Hg]|65-100|L|||F|||20260912061500
OBX|3|NM|8867-4^Heart Rate^LN||126|{beats}/min|60-100|H|||F|||20260912061500
OBX|4|NM|6690-2^WBC^LN||24.2|10*3/uL|4.5-11.0|H|||F|||20260912054500`;

  // Preset 2: Type 2 Diabetes & CKD Outpatient
  const dmPatient: FHIRPatient = {
    resourceType: 'Patient',
    id: 'pat-dm-002',
    identifier: [{ system: 'http://hospital.mediverse.org/mrn', value: 'MRN-334109' }],
    active: true,
    name: [{ use: 'official', family: 'Chen', given: ['Eleanor', 'Mei'] }],
    gender: 'female',
    birthDate: '1958-09-24',
    telecom: [{ system: 'phone', value: '+1-555-412-8877', use: 'home' }],
    address: [{ line: ['128 Beacon St'], city: 'Cambridge', state: 'MA', postalCode: '02138', country: 'USA' }]
  };

  const dmEncounter: FHIREncounter = {
    resourceType: 'Encounter',
    id: 'enc-dm-002',
    status: 'finished',
    class: { system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode', code: 'AMB', display: 'Ambulatory Outpatient' },
    subject: { reference: 'Patient/pat-dm-002', display: 'Eleanor Chen' },
    period: { start: '2026-09-10T14:00:00Z', end: '2026-09-10T14:45:00Z' },
    reasonCode: [{
      coding: [{ system: 'http://snomed.info/sct', code: '44054006', display: 'Type 2 Diabetes Mellitus' }],
      text: 'Routine Diabetes & Renal Chronic Care'
    }]
  };

  const dmConditions: FHIRCondition[] = [
    {
      resourceType: 'Condition',
      id: 'cond-dm-01',
      clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active', display: 'Active' }] },
      verificationStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-ver-status', code: 'confirmed', display: 'Confirmed' }] },
      code: {
        coding: [{ system: 'http://snomed.info/sct', code: '44054006', display: 'Type 2 Diabetes Mellitus' }],
        text: 'Type 2 Diabetes Mellitus with microvascular complications'
      },
      subject: { reference: 'Patient/pat-dm-002' },
      encounter: { reference: 'Encounter/enc-dm-002' },
      onsetDateTime: '2016-03-15T00:00:00Z'
    },
    {
      resourceType: 'Condition',
      id: 'cond-dm-02',
      clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active', display: 'Active' }] },
      verificationStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-ver-status', code: 'confirmed', display: 'Confirmed' }] },
      code: {
        coding: [{ system: 'http://snomed.info/sct', code: '431856006', display: 'Chronic kidney disease stage 3b' }],
        text: 'CKD Stage 3b (eGFR 34 mL/min/1.73m2)'
      },
      subject: { reference: 'Patient/pat-dm-002' },
      encounter: { reference: 'Encounter/enc-dm-002' },
      onsetDateTime: '2022-11-01T00:00:00Z'
    }
  ];

  const dmObservations: FHIRObservation[] = [
    {
      resourceType: 'Observation',
      id: 'obs-dm-hba1c',
      status: 'final',
      category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'laboratory', display: 'Laboratory' }], text: 'Laboratory' }],
      code: { coding: [{ system: 'http://loinc.org', code: '4548-4', display: 'Hemoglobin A1c/Hemoglobin.total in Blood' }], text: 'HbA1c' },
      subject: { reference: 'Patient/pat-dm-002' },
      encounter: { reference: 'Encounter/enc-dm-002' },
      effectiveDateTime: '2026-09-10T13:30:00Z',
      valueQuantity: { value: 8.9, unit: '%', system: 'http://unitsofmeasure.org', code: '%' },
      referenceRange: [{ high: { value: 5.7, unit: '%', system: 'http://unitsofmeasure.org', code: '%' } }],
      interpretation: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation', code: 'H', display: 'High' }], text: 'Elevated Glycemic Control' }]
    },
    {
      resourceType: 'Observation',
      id: 'obs-dm-creat',
      status: 'final',
      category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'laboratory', display: 'Laboratory' }], text: 'Laboratory' }],
      code: { coding: [{ system: 'http://loinc.org', code: '2160-0', display: 'Creatinine [Mass/volume] in Serum or Plasma' }], text: 'Serum Creatinine' },
      subject: { reference: 'Patient/pat-dm-002' },
      encounter: { reference: 'Encounter/enc-dm-002' },
      effectiveDateTime: '2026-09-10T13:30:00Z',
      valueQuantity: { value: 2.1, unit: 'mg/dL', system: 'http://unitsofmeasure.org', code: 'mg/dL' },
      referenceRange: [{ low: { value: 0.6, unit: 'mg/dL', system: 'http://unitsofmeasure.org', code: 'mg/dL' }, high: { value: 1.1, unit: 'mg/dL', system: 'http://unitsofmeasure.org', code: 'mg/dL' } }],
      interpretation: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation', code: 'H', display: 'High' }], text: 'Renal Impairment' }]
    },
    {
      resourceType: 'Observation',
      id: 'obs-dm-egfr',
      status: 'final',
      category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'laboratory', display: 'Laboratory' }], text: 'Laboratory' }],
      code: { coding: [{ system: 'http://loinc.org', code: '33914-3', display: 'Glomerular filtration rate/1.73 sq M.predicted' }], text: 'eGFR CKD-EPI' },
      subject: { reference: 'Patient/pat-dm-002' },
      encounter: { reference: 'Encounter/enc-dm-002' },
      effectiveDateTime: '2026-09-10T13:30:00Z',
      valueQuantity: { value: 34, unit: 'mL/min/1.73m2', system: 'http://unitsofmeasure.org', code: 'mL/min/1.73m2' },
      referenceRange: [{ low: { value: 60, unit: 'mL/min/1.73m2', system: 'http://unitsofmeasure.org', code: 'mL/min/1.73m2' } }],
      interpretation: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation', code: 'L', display: 'Low' }], text: 'Stage 3b CKD' }]
    }
  ];

  const dmMeds: FHIRMedicationRequest[] = [
    {
      resourceType: 'MedicationRequest',
      id: 'med-dm-empa',
      status: 'active',
      intent: 'order',
      medicationCodeableConcept: {
        coding: [{ system: 'http://www.nlm.nih.gov/research/umls/rxnorm', code: '1545653', display: 'Empagliflozin 10 MG Oral Tablet' }],
        text: 'Empagliflozin 10 mg PO once daily'
      },
      subject: { reference: 'Patient/pat-dm-002' },
      encounter: { reference: 'Encounter/enc-dm-002' },
      authoredOn: '2026-09-10T14:15:00Z',
      dosageInstruction: [{
        text: 'Take 1 tablet (10 mg) orally once daily in morning for nephroprotection',
        doseAndRate: [{ doseQuantity: { value: 10, unit: 'mg', system: 'http://unitsofmeasure.org', code: 'mg' } }]
      }]
    },
    {
      resourceType: 'MedicationRequest',
      id: 'med-dm-losartan',
      status: 'active',
      intent: 'order',
      medicationCodeableConcept: {
        coding: [{ system: 'http://www.nlm.nih.gov/research/umls/rxnorm', code: '316049', display: 'Losartan Potassium 50 MG Oral Tablet' }],
        text: 'Losartan Potassium 50 mg PO once daily'
      },
      subject: { reference: 'Patient/pat-dm-002' },
      encounter: { reference: 'Encounter/enc-dm-002' },
      authoredOn: '2026-09-10T14:15:00Z',
      dosageInstruction: [{
        text: 'Take 1 tablet (50 mg) orally daily for proteinuria reduction',
        doseAndRate: [{ doseQuantity: { value: 50, unit: 'mg', system: 'http://unitsofmeasure.org', code: 'mg' } }]
      }]
    }
  ];

  const dmEntries: FHIRBundleEntry[] = [
    { fullUrl: 'urn:uuid:pat-dm-002', resource: dmPatient },
    { fullUrl: 'urn:uuid:enc-dm-002', resource: dmEncounter },
    ...dmConditions.map(c => ({ fullUrl: `urn:uuid:${c.id}`, resource: c })),
    ...dmObservations.map(o => ({ fullUrl: `urn:uuid:${o.id}`, resource: o })),
    ...dmMeds.map(m => ({ fullUrl: `urn:uuid:${m.id}`, resource: m }))
  ];

  const dmBundle: FHIRBundle = {
    resourceType: 'Bundle',
    id: 'bundle-dm-ckd-outpatient',
    type: 'collection',
    total: dmEntries.length,
    timestamp: now,
    entry: dmEntries
  };

  const dmHl7 = `MSH|^~\\&|CERNER|CAMBRIDGE_CLINIC|MEDIVERSE_CDS|AMB|20260910144500||ORU^R01|MSG-772911|P|2.5
PID|1||MRN-334109^^^BWH^MR||Chen^Eleanor^Mei||19580924|F|||128 Beacon St^^Cambridge^MA^02138^USA||5554128877
PV1|1|O|CLINIC^ROOM-02||||99214^Nephrologist|||||||||||ENC-DM-002
DG1|1||44054006^Type 2 Diabetes Mellitus^SCT||20160315000000|A
DG1|2||431856006^Chronic kidney disease stage 3b^SCT||20221101000000|A
OBX|1|NM|4548-4^HbA1c^LN||8.9|%|4.0-5.7|H|||F|||20260910133000
OBX|2|NM|2160-0^Creatinine^LN||2.1|mg/dL|0.6-1.1|H|||F|||20260910133000
OBX|3|NM|33914-3^eGFR^LN||34|mL/min/1.73m2|>60|L|||F|||20260910133000`;

  // Preset 3: Acute STEMI Emergency Admission
  const stemiPatient: FHIRPatient = {
    resourceType: 'Patient',
    id: 'pat-stemi-003',
    identifier: [{ system: 'http://hospital.mediverse.org/mrn', value: 'MRN-559281' }],
    active: true,
    name: [{ use: 'official', family: 'Rodriguez', given: ['James', 'Carlos'] }],
    gender: 'male',
    birthDate: '1972-11-18',
    telecom: [{ system: 'phone', value: '+1-555-667-9921', use: 'mobile' }],
    address: [{ line: ['402 Mission Blvd'], city: 'San Francisco', state: 'CA', postalCode: '94110', country: 'USA' }]
  };

  const stemiEncounter: FHIREncounter = {
    resourceType: 'Encounter',
    id: 'enc-stemi-003',
    status: 'in-progress',
    class: { system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode', code: 'EMER', display: 'Emergency Department' },
    subject: { reference: 'Patient/pat-stemi-003', display: 'James Rodriguez' },
    period: { start: '2026-09-13T01:15:00Z' },
    reasonCode: [{
      coding: [{ system: 'http://snomed.info/sct', code: '22298006', display: 'Myocardial infarction' }],
      text: 'Acute Anterolateral STEMI with ongoing substernal chest pain'
    }]
  };

  const stemiConditions: FHIRCondition[] = [
    {
      resourceType: 'Condition',
      id: 'cond-stemi-01',
      clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active', display: 'Active' }] },
      verificationStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-ver-status', code: 'confirmed', display: 'Confirmed' }] },
      code: {
        coding: [{ system: 'http://snomed.info/sct', code: '22298006', display: 'Myocardial infarction' }],
        text: 'Acute ST-Elevation Myocardial Infarction (STEMI)'
      },
      severity: { coding: [{ system: 'http://snomed.info/sct', code: '24484000', display: 'Severe' }], text: 'Severe' },
      subject: { reference: 'Patient/pat-stemi-003' },
      encounter: { reference: 'Encounter/enc-stemi-003' },
      onsetDateTime: '2026-09-13T00:30:00Z'
    }
  ];

  const stemiObservations: FHIRObservation[] = [
    {
      resourceType: 'Observation',
      id: 'obs-stemi-trop',
      status: 'final',
      category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'laboratory', display: 'Laboratory' }], text: 'Laboratory' }],
      code: { coding: [{ system: 'http://loinc.org', code: '10839-9', display: 'Troponin I.cardiac [Mass/volume] in Serum or Plasma' }], text: 'Cardiac Troponin I' },
      subject: { reference: 'Patient/pat-stemi-003' },
      encounter: { reference: 'Encounter/enc-stemi-003' },
      effectiveDateTime: '2026-09-13T01:30:00Z',
      valueQuantity: { value: 14.8, unit: 'ng/mL', system: 'http://unitsofmeasure.org', code: 'ng/mL' },
      referenceRange: [{ high: { value: 0.04, unit: 'ng/mL', system: 'http://unitsofmeasure.org', code: 'ng/mL' } }],
      interpretation: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation', code: 'H', display: 'Critical High' }], text: 'Acute Myocardial Necrosis' }]
    },
    {
      resourceType: 'Observation',
      id: 'obs-stemi-bp',
      status: 'final',
      category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'vital-signs', display: 'Vital Signs' }], text: 'Vital Signs' }],
      code: { coding: [{ system: 'http://loinc.org', code: '8480-6', display: 'Systolic blood pressure' }], text: 'Systolic Blood Pressure' },
      subject: { reference: 'Patient/pat-stemi-003' },
      encounter: { reference: 'Encounter/enc-stemi-003' },
      effectiveDateTime: '2026-09-13T01:20:00Z',
      valueQuantity: { value: 94, unit: 'mm[Hg]', system: 'http://unitsofmeasure.org', code: 'mm[Hg]' }
    }
  ];

  const stemiMeds: FHIRMedicationRequest[] = [
    {
      resourceType: 'MedicationRequest',
      id: 'med-stemi-asa',
      status: 'active',
      intent: 'order',
      medicationCodeableConcept: {
        coding: [{ system: 'http://www.nlm.nih.gov/research/umls/rxnorm', code: '1191', display: 'Aspirin 81 MG Chewable Tablet' }],
        text: 'Aspirin 324 mg chewable PO STAT'
      },
      subject: { reference: 'Patient/pat-stemi-003' },
      encounter: { reference: 'Encounter/enc-stemi-003' },
      authoredOn: '2026-09-13T01:25:00Z',
      dosageInstruction: [{ text: 'Chew and swallow four 81 mg tablets (324 mg total) immediately' }]
    },
    {
      resourceType: 'MedicationRequest',
      id: 'med-stemi-ticagrelor',
      status: 'active',
      intent: 'order',
      medicationCodeableConcept: {
        coding: [{ system: 'http://www.nlm.nih.gov/research/umls/rxnorm', code: '1116632', display: 'Ticagrelor 90 MG Oral Tablet' }],
        text: 'Ticagrelor 180 mg PO loading dose'
      },
      subject: { reference: 'Patient/pat-stemi-003' },
      encounter: { reference: 'Encounter/enc-stemi-003' },
      authoredOn: '2026-09-13T01:25:00Z',
      dosageInstruction: [{ text: 'Take two 90 mg tablets (180 mg) orally STAT before catheterization' }]
    }
  ];

  const stemiEntries: FHIRBundleEntry[] = [
    { fullUrl: 'urn:uuid:pat-stemi-003', resource: stemiPatient },
    { fullUrl: 'urn:uuid:enc-stemi-003', resource: stemiEncounter },
    ...stemiConditions.map(c => ({ fullUrl: `urn:uuid:${c.id}`, resource: c })),
    ...stemiObservations.map(o => ({ fullUrl: `urn:uuid:${o.id}`, resource: o })),
    ...stemiMeds.map(m => ({ fullUrl: `urn:uuid:${m.id}`, resource: m }))
  ];

  const stemiBundle: FHIRBundle = {
    resourceType: 'Bundle',
    id: 'bundle-stemi-emergency',
    type: 'collection',
    total: stemiEntries.length,
    timestamp: now,
    entry: stemiEntries
  };

  const stemiHl7 = `MSH|^~\\&|ALLSCRIPTS|SF_GENERAL_ED|MEDIVERSE_CDS|CATH_LAB|20260913013000||ADT^A01|MSG-552819|P|2.5
PID|1||MRN-559281^^^SFGH^MR||Rodriguez^James^Carlos||19721118|M|||402 Mission Blvd^^San Francisco^CA^94110^USA||5556679921
PV1|1|E|ED^BAY-01||||88412^Interventionalist|||||||||||ENC-STEMI-003
DG1|1||22298006^Myocardial infarction^SCT||20260913003000|A
OBX|1|NM|10839-9^Cardiac Troponin I^LN||14.8|ng/mL|<0.04|H|||F|||20260913013000
OBX|2|NM|8480-6^Systolic Blood Pressure^LN||94|mm[Hg]|90-140||||F|||20260913012000`;

  return [
    {
      id: 'septic-shock-icu',
      name: 'Severe Sepsis & Septic Shock ICU Inpatient',
      subtitle: 'Critical Inpatient Admission (IMP) with Inotropes, Blood Lactate & Arterial Line',
      domain: 'Critical Care & Infectious Diseases',
      patientName: 'Marcus Vance',
      age: 64,
      gender: 'male',
      encounterType: 'IMP',
      keyFinding: 'Blood Lactate 4.8 mmol/L, MAP 54 mmHg on Norepinephrine 0.15 mcg/kg/min',
      bundle: sepsisBundle,
      rawHl7v2: sepsisHl7
    },
    {
      id: 'diabetes-ckd-outpatient',
      name: 'Type 2 Diabetes with CKD Stage 3b',
      subtitle: 'Ambulatory Outpatient (AMB) Chronic Disease Management & SGLT2i Titration',
      domain: 'Endocrinology & Nephrology',
      patientName: 'Eleanor Chen',
      age: 67,
      gender: 'female',
      encounterType: 'AMB',
      keyFinding: 'HbA1c 8.9%, Serum Creatinine 2.1 mg/dL, eGFR 34 mL/min/1.73m2',
      bundle: dmBundle,
      rawHl7v2: dmHl7
    },
    {
      id: 'stemi-emergency',
      name: 'Acute ST-Elevation Myocardial Infarction (STEMI)',
      subtitle: 'Emergency Department (EMER) Code STEMI Door-to-Balloon Catheterization',
      domain: 'Emergency Medicine & Cardiology',
      patientName: 'James Rodriguez',
      age: 53,
      gender: 'male',
      encounterType: 'EMER',
      keyFinding: 'Troponin I 14.8 ng/mL, SBP 94 mmHg, Dual Antiplatelet STAT Loading',
      bundle: stemiBundle,
      rawHl7v2: stemiHl7
    }
  ];
}

/**
 * Legacy HL7 v2.x to FHIR R4 Bundle Converter
 */
export function parseHl7v2ToFhir(rawHl7: string): {
  bundle: FHIRBundle;
  parsedSegments: { segment: string; fields: string[] }[];
  errors: string[];
} {
  const lines = rawHl7.split(/\r?\n/).filter(line => line.trim().length > 0);
  const parsedSegments: { segment: string; fields: string[] }[] = [];
  const errors: string[] = [];
  const entries: FHIRBundleEntry[] = [];

  let patientId = 'pat-imported-01';
  let patientNameFamily = 'Unknown';
  let patientNameGiven = 'Patient';
  let birthDate = '1980-01-01';
  let gender: 'male' | 'female' | 'other' | 'unknown' = 'unknown';
  let mrn = 'MRN-IMPORT';
  let phone = '';
  let addressLine = '';
  let city = '';
  let state = '';
  let zip = '';
  let encounterId = 'enc-imported-01';
  let encounterClass: 'AMB' | 'IMP' | 'EMER' = 'AMB';
  let observationIndex = 1;
  let conditionIndex = 1;

  for (const line of lines) {
    const fields = line.split('|');
    const segName = fields[0]?.toUpperCase().trim();
    if (!segName) continue;
    parsedSegments.push({ segment: segName, fields });

    try {
      if (segName === 'PID') {
        // PID-3 Patient Identifier List
        if (fields[3]) {
          const idParts = fields[3].split('^');
          mrn = idParts[0] || mrn;
          patientId = `pat-${mrn.toLowerCase().replace(/[^a-z0-9]/g, '') || '001'}`;
        }
        // PID-5 Patient Name (Family^Given^Middle)
        if (fields[5]) {
          const nameParts = fields[5].split('^');
          patientNameFamily = nameParts[0] || patientNameFamily;
          patientNameGiven = nameParts[1] || patientNameGiven;
        }
        // PID-7 Date of Birth (YYYYMMDD)
        if (fields[7] && fields[7].length >= 8) {
          const rawDob = fields[7];
          birthDate = `${rawDob.substring(0, 4)}-${rawDob.substring(4, 6)}-${rawDob.substring(6, 8)}`;
        }
        // PID-8 Administrative Sex
        if (fields[8]) {
          const sex = fields[8].toUpperCase();
          gender = sex === 'M' ? 'male' : sex === 'F' ? 'female' : 'other';
        }
        // PID-11 Address (Street^^City^State^Zip)
        if (fields[11]) {
          const addrParts = fields[11].split('^');
          addressLine = addrParts[0] || '';
          city = addrParts[2] || '';
          state = addrParts[3] || '';
          zip = addrParts[4] || '';
        }
        // PID-13 Phone
        if (fields[13]) {
          phone = fields[13];
        }
      } else if (segName === 'PV1') {
        // PV1-2 Patient Class (E=Emergency, I=Inpatient, O=Outpatient)
        if (fields[2]) {
          const pClass = fields[2].toUpperCase();
          if (pClass === 'E') encounterClass = 'EMER';
          else if (pClass === 'I') encounterClass = 'IMP';
          else encounterClass = 'AMB';
        }
        // PV1-19 Visit Number
        if (fields[19]) {
          encounterId = `enc-${fields[19].toLowerCase().replace(/[^a-z0-9]/g, '')}`;
        }
      } else if (segName === 'DG1') {
        // DG1-3 Diagnosis Code (Code^Description^CodingSystem)
        const diagParts = (fields[3] || '').split('^');
        const code = diagParts[0] || `DIAG-${conditionIndex}`;
        const display = diagParts[1] || 'Clinical Diagnosis';
        const system = diagParts[2]?.toUpperCase() === 'SCT' ? 'http://snomed.info/sct' : 'http://hl7.org/fhir/sid/icd-10';

        const cond: FHIRCondition = {
          resourceType: 'Condition',
          id: `cond-hl7-${conditionIndex++}`,
          clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active', display: 'Active' }] },
          verificationStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-ver-status', code: 'confirmed', display: 'Confirmed' }] },
          code: {
            coding: [{ system, code, display }],
            text: display
          },
          subject: { reference: `Patient/${patientId}` },
          encounter: { reference: `Encounter/${encounterId}` },
          onsetDateTime: new Date().toISOString()
        };
        entries.push({ fullUrl: `urn:uuid:${cond.id}`, resource: cond });
      } else if (segName === 'OBX') {
        // OBX-3 Observation Identifier (Code^Text^System)
        const obsParts = (fields[3] || '').split('^');
        const code = obsParts[0] || `OBS-${observationIndex}`;
        const display = obsParts[1] || 'Laboratory Observation';
        const system = obsParts[2]?.toUpperCase() === 'LN' ? 'http://loinc.org' : 'http://hospital.mediverse.org/codes';
        
        // OBX-5 Observation Value
        const valNum = parseFloat(fields[5] || '0');
        // OBX-6 Units
        const units = fields[6] || '';
        // OBX-7 Reference Range
        const refRange = fields[7] || '';
        // OBX-8 Abnormal Flags (H, L, A, N)
        const flag = fields[8] || 'N';

        const obs: FHIRObservation = {
          resourceType: 'Observation',
          id: `obs-hl7-${observationIndex++}`,
          status: 'final',
          category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'laboratory', display: 'Laboratory' }], text: 'Laboratory' }],
          code: {
            coding: [{ system, code, display }],
            text: display
          },
          subject: { reference: `Patient/${patientId}` },
          encounter: { reference: `Encounter/${encounterId}` },
          effectiveDateTime: new Date().toISOString(),
          valueQuantity: isNaN(valNum) ? undefined : { value: valNum, unit: units, system: 'http://unitsofmeasure.org', code: units },
          valueString: isNaN(valNum) ? fields[5] : undefined,
          referenceRange: refRange ? [{ text: refRange }] : undefined,
          interpretation: flag !== 'N' ? [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation', code: flag, display: flag === 'H' ? 'High' : flag === 'L' ? 'Low' : 'Abnormal' }], text: flag === 'H' ? 'High' : flag === 'L' ? 'Low' : 'Abnormal' }] : undefined
        };
        entries.push({ fullUrl: `urn:uuid:${obs.id}`, resource: obs });
      }
    } catch (e: any) {
      errors.push(`Error parsing segment ${segName}: ${e.message || String(e)}`);
    }
  }

  // Construct Patient & Encounter
  const patientResource: FHIRPatient = {
    resourceType: 'Patient',
    id: patientId,
    identifier: [{ system: 'http://hospital.mediverse.org/mrn', value: mrn }],
    active: true,
    name: [{ use: 'official', family: patientNameFamily, given: [patientNameGiven] }],
    gender,
    birthDate,
    telecom: phone ? [{ system: 'phone', value: phone, use: 'mobile' }] : [],
    address: addressLine ? [{ line: [addressLine], city, state, postalCode: zip, country: 'USA' }] : []
  };

  const encounterResource: FHIREncounter = {
    resourceType: 'Encounter',
    id: encounterId,
    status: 'in-progress',
    class: {
      system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
      code: encounterClass,
      display: encounterClass === 'IMP' ? 'Inpatient' : encounterClass === 'EMER' ? 'Emergency' : 'Ambulatory'
    },
    subject: { reference: `Patient/${patientId}`, display: `${patientNameGiven} ${patientNameFamily}` },
    period: { start: new Date().toISOString() },
    reasonCode: []
  };

  const allEntries: FHIRBundleEntry[] = [
    { fullUrl: `urn:uuid:${patientResource.id}`, resource: patientResource },
    { fullUrl: `urn:uuid:${encounterResource.id}`, resource: encounterResource },
    ...entries
  ];

  const bundle: FHIRBundle = {
    resourceType: 'Bundle',
    id: `bundle-hl7v2-import-${Date.now()}`,
    type: 'collection',
    total: allEntries.length,
    timestamp: new Date().toISOString(),
    entry: allEntries
  };

  return { bundle, parsedSegments, errors };
}

/**
 * SMART on FHIR OAuth 2.0 Auth Simulation
 */
export function simulateSmartOnFhirAuth(
  clientId: string,
  requestedScopes: string[],
  patientId: string
): SmartAuthSession {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 3600; // 1 hour token
  const scopeStr = requestedScopes.join(' ');

  const header = { alg: 'RS256', typ: 'JWT', kid: 'mediverse-smart-key-1' };
  const claims = {
    iss: 'https://auth.mediverse.org/oauth2',
    sub: `usr-${clientId}`,
    aud: 'https://api.mediverse.org/fhir/r4',
    exp,
    iat,
    patient: patientId,
    scope: scopeStr,
    fhirUser: `https://api.mediverse.org/fhir/r4/Practitioner/dr-curio-901`
  };

  // Base64Url simulated JWT
  const b64Url = (obj: any) =>
    Buffer.from(JSON.stringify(obj))
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

  const encodedHeader = b64Url(header);
  const encodedClaims = b64Url(claims);
  const simulatedSignature = 'dGVzdFNpZ25hdHVyZUZoaXJSM0F1dGg';
  const accessToken = `${encodedHeader}.${encodedClaims}.${simulatedSignature}`;

  return {
    clientId,
    accessToken,
    tokenType: 'Bearer',
    expiresIn: 3600,
    scope: scopeStr,
    patientId,
    issuedAt: new Date(iat * 1000).toISOString(),
    decodedClaims: claims
  };
}

/**
 * Execute Simulated FHIR REST Query
 */
export function executeFhirQuery(bundle: FHIRBundle, query: string): FhirQueryResult {
  const start = Date.now();
  const trimmed = query.trim().replace(/^\//, '');
  const [resourcePart, queryParams] = trimmed.split('?');
  const targetType = resourcePart?.toLowerCase();

  const params: Record<string, string> = {};
  if (queryParams) {
    for (const pair of queryParams.split('&')) {
      const [k, v] = pair.split('=');
      if (k) params[k.toLowerCase()] = decodeURIComponent(v || '').toLowerCase();
    }
  }

  const matches: any[] = [];

  for (const entry of bundle.entry) {
    const res = entry.resource;
    const resType = res.resourceType.toLowerCase();

    // Type filter
    if (targetType && targetType !== 'bundle' && targetType !== resType) {
      continue;
    }

    // Param filters
    let pass = true;
    if (params['category']) {
      const catMatches = (res as any).category?.some((c: any) =>
        c.coding?.some((cod: any) => cod.code?.toLowerCase() === params['category'])
      );
      if (!catMatches) pass = false;
    }

    if (params['code']) {
      const codeMatches = (res as any).code?.coding?.some(
        (cod: any) => cod.code?.toLowerCase() === params['code']
      );
      if (!codeMatches) pass = false;
    }

    if (params['clinical-status'] || params['clinicalstatus']) {
      const targetStatus = params['clinical-status'] || params['clinicalstatus'];
      const statusMatches = (res as any).clinicalStatus?.coding?.some(
        (cod: any) => cod.code?.toLowerCase() === targetStatus
      );
      if (!statusMatches) pass = false;
    }

    if (params['status']) {
      if ((res as any).status?.toLowerCase() !== params['status']) {
        pass = false;
      }
    }

    if (params['patient'] || params['subject']) {
      const targetPat = params['patient'] || params['subject'];
      const subRef = (res as any).subject?.reference?.toLowerCase() || '';
      if (!subRef.includes(targetPat)) {
        pass = false;
      }
    }

    if (pass) {
      matches.push(res);
    }
  }

  const responseTimeMs = Math.floor(Math.random() * 25) + 12;

  return {
    query,
    status: 200,
    statusText: 'OK',
    responseTimeMs,
    totalMatches: matches.length,
    resources: matches
  };
}

/**
 * Generate Visual Resource Graph Nodes and Edges
 */
export function generateResourceGraph(bundle: FHIRBundle): ResourceGraph {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  let patientId = '';
  let encounterId = '';

  for (const entry of bundle.entry) {
    const res = entry.resource;
    let summary = '';
    let category = 'Clinical';

    if (res.resourceType === 'Patient') {
      patientId = res.id;
      summary = `${res.name[0]?.given?.join(' ') || ''} ${res.name[0]?.family || ''} (${res.gender}, DOB: ${res.birthDate})`;
      category = 'Demographics';
    } else if (res.resourceType === 'Encounter') {
      encounterId = res.id;
      summary = `Encounter: ${res.class?.display || res.class?.code} (${res.status})`;
      category = 'Context';
    } else if (res.resourceType === 'Condition') {
      summary = `${res.code?.text || res.code?.coding[0]?.display || 'Condition'} [${res.code?.coding[0]?.code}]`;
      category = 'Diagnosis';
    } else if (res.resourceType === 'Observation') {
      const val = res.valueQuantity ? `${res.valueQuantity.value} ${res.valueQuantity.unit}` : res.valueString || '';
      summary = `${res.code?.text || res.code?.coding[0]?.display}: ${val}`;
      category = res.category?.[0]?.coding?.[0]?.code === 'vital-signs' ? 'Vital Signs' : 'Laboratory';
    } else if (res.resourceType === 'MedicationRequest') {
      summary = `${res.medicationCodeableConcept?.text || res.medicationCodeableConcept?.coding[0]?.display}`;
      category = 'Medication';
    } else if (res.resourceType === 'DiagnosticReport') {
      summary = `${res.code?.text || 'Report'}: ${res.conclusion || 'Final'}`;
      category = 'Diagnostics';
    }

    nodes.push({
      id: res.id,
      label: res.resourceType,
      resourceType: res.resourceType,
      summary,
      category
    });

    // Generate relationships
    if (res.resourceType !== 'Patient' && (res as any).subject?.reference) {
      const ref = (res as any).subject.reference.replace(/^Patient\//, '');
      edges.push({
        from: ref,
        to: res.id,
        label: 'subject'
      });
    }

    if ((res as any).encounter?.reference) {
      const encRef = (res as any).encounter.reference.replace(/^Encounter\//, '');
      edges.push({
        from: encRef,
        to: res.id,
        label: 'context'
      });
    }
  }

  return { nodes, edges };
}
