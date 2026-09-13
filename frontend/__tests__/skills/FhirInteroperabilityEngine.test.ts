import {
  getClinicalPresets,
  parseHl7v2ToFhir,
  simulateSmartOnFhirAuth,
  executeFhirQuery,
  generateResourceGraph
} from '../../.gemini/skills/FhirInteroperabilityEngine';

describe('Track C1: FhirInteroperabilityEngine', () => {
  it('1. returns 3 clinical presets with valid FHIR bundles and raw HL7 v2 messages', () => {
    const presets = getClinicalPresets();
    expect(presets).toHaveLength(3);
    presets.forEach(p => {
      expect(p.bundle.resourceType).toBe('Bundle');
      expect(p.bundle.entry.length).toBeGreaterThan(3);
      expect(p.rawHl7v2).toContain('MSH|');
      expect(p.rawHl7v2).toContain('PID|');
      expect(p.rawHl7v2).toContain('PV1|');
    });
  });

  it('2. verifies septic shock preset contains LOINC lactate and SNOMED sepsis condition', () => {
    const presets = getClinicalPresets();
    const sepsis = presets.find(p => p.id === 'septic-shock-icu')!;
    expect(sepsis).toBeDefined();

    const condition = sepsis.bundle.entry.find(e => e.resource.resourceType === 'Condition');
    expect(condition).toBeDefined();
    expect((condition?.resource as any).code.coding[0].code).toBe('91302008');

    const lactateObs = sepsis.bundle.entry.find(
      e => e.resource.resourceType === 'Observation' && (e.resource as any).code.coding[0].code === '2524-7'
    );
    expect(lactateObs).toBeDefined();
    expect((lactateObs?.resource as any).valueQuantity.value).toBe(4.8);
  });

  it('3. verifies diabetes preset contains HbA1c and CKD Stage 3b conditions', () => {
    const presets = getClinicalPresets();
    const dm = presets.find(p => p.id === 'diabetes-ckd-outpatient')!;
    expect(dm).toBeDefined();

    const hba1c = dm.bundle.entry.find(
      e => e.resource.resourceType === 'Observation' && (e.resource as any).code.coding[0].code === '4548-4'
    );
    expect(hba1c).toBeDefined();
    expect((hba1c?.resource as any).valueQuantity.value).toBe(8.9);

    const ckd = dm.bundle.entry.find(
      e => e.resource.resourceType === 'Condition' && (e.resource as any).code.coding[0].code === '431856006'
    );
    expect(ckd).toBeDefined();
  });

  it('4. parses standard HL7 v2 ADT_A01 message correctly into Patient and Encounter', () => {
    const rawHl7 = `MSH|^~\\&|TEST_EHR|TEST_HOSP|MEDIVERSE|ICU|20260913120000||ADT^A01|MSG-001|P|2.5
PID|1||MRN-998877^^^TEST^MR||Doe^John^A||19850615|M|||100 Main St^^Boston^MA^02118^USA||5551234567
PV1|1|E|ED^BAY-02||||11223^Doc|||||||||||ENC-0099
DG1|1||22298006^Myocardial infarction^SCT||20260913110000|A
OBX|1|NM|8867-4^Heart Rate^LN||98|{beats}/min|60-100|N|||F`;

    const { bundle, parsedSegments, errors } = parseHl7v2ToFhir(rawHl7);
    expect(errors).toHaveLength(0);
    expect(parsedSegments.map(s => s.segment)).toEqual(['MSH', 'PID', 'PV1', 'DG1', 'OBX']);

    const patient = bundle.entry.find(e => e.resource.resourceType === 'Patient')?.resource as any;
    expect(patient).toBeDefined();
    expect(patient.name[0].family).toBe('Doe');
    expect(patient.name[0].given).toEqual(['John']);
    expect(patient.gender).toBe('male');
    expect(patient.birthDate).toBe('1985-06-15');

    const encounter = bundle.entry.find(e => e.resource.resourceType === 'Encounter')?.resource as any;
    expect(encounter).toBeDefined();
    expect(encounter.class.code).toBe('EMER');
  });

  it('5. creates Observation with LOINC code and abnormal flag from OBX segment', () => {
    const rawHl7 = `MSH|^~\\&|EHR|HOSP|MED|LAB|20260913||ORU^R01|M1|P|2.5
PID|1||MRN-111||Smith^Alice||19900101|F
PV1|1|I|ICU^01
OBX|1|NM|2524-7^Lactate^LN||3.6|mmol/L|0.5-2.0|H|||F`;

    const { bundle } = parseHl7v2ToFhir(rawHl7);
    const obs = bundle.entry.find(e => e.resource.resourceType === 'Observation')?.resource as any;
    expect(obs).toBeDefined();
    expect(obs.code.coding[0].code).toBe('2524-7');
    expect(obs.valueQuantity.value).toBe(3.6);
    expect(obs.valueQuantity.unit).toBe('mmol/L');
    expect(obs.interpretation[0].coding[0].code).toBe('H');
  });

  it('6. handles empty or incomplete lines gracefully without crashing', () => {
    const raw = `
    
    MSH|^~\\&|EHR|HOSP|||2026||||P|2.5
    
    PID|1||MRN-333
    
    `;
    const { bundle, errors } = parseHl7v2ToFhir(raw);
    expect(errors).toHaveLength(0);
    expect(bundle.resourceType).toBe('Bundle');
    expect(bundle.entry.length).toBeGreaterThanOrEqual(2);
  });

  it('7. simulates SMART on FHIR OAuth 2.0 handshake and issues valid token structure', () => {
    const scopes = ['launch/patient', 'patient/Patient.read', 'patient/Observation.read', 'openid'];
    const session = simulateSmartOnFhirAuth('mediverse-app-client', scopes, 'pat-sepsis-001');

    expect(session.clientId).toBe('mediverse-app-client');
    expect(session.patientId).toBe('pat-sepsis-001');
    expect(session.tokenType).toBe('Bearer');
    expect(session.expiresIn).toBe(3600);
    expect(session.accessToken.split('.')).toHaveLength(3);
    expect(session.decodedClaims.patient).toBe('pat-sepsis-001');
    expect(session.decodedClaims.scope).toContain('patient/Observation.read');
  });

  it('8. executes FHIR REST query filtering by resourceType', () => {
    const presets = getClinicalPresets();
    const bundle = presets[0].bundle;

    const resultObs = executeFhirQuery(bundle, 'Observation');
    expect(resultObs.status).toBe(200);
    expect(resultObs.resources.every(r => r.resourceType === 'Observation')).toBe(true);
    expect(resultObs.totalMatches).toBeGreaterThan(0);

    const resultCond = executeFhirQuery(bundle, 'Condition');
    expect(resultCond.resources.every(r => r.resourceType === 'Condition')).toBe(true);
  });

  it('9. executes FHIR REST query filtering by observation category and code', () => {
    const presets = getClinicalPresets();
    const bundle = presets[0].bundle;

    const vitalsResult = executeFhirQuery(bundle, 'Observation?category=vital-signs');
    expect(vitalsResult.status).toBe(200);
    expect(vitalsResult.totalMatches).toBeGreaterThan(0);

    const lactateResult = executeFhirQuery(bundle, 'Observation?code=2524-7');
    expect(lactateResult.status).toBe(200);
    expect(lactateResult.totalMatches).toBe(1);
    expect(lactateResult.resources[0].valueQuantity.value).toBe(4.8);
  });

  it('10. generates visual resource graph with nodes and directed reference edges', () => {
    const presets = getClinicalPresets();
    const bundle = presets[0].bundle;

    const graph = generateResourceGraph(bundle);
    expect(graph.nodes.length).toBe(bundle.entry.length);
    expect(graph.edges.length).toBeGreaterThan(0);

    const patientNode = graph.nodes.find(n => n.resourceType === 'Patient');
    expect(patientNode).toBeDefined();

    const subjectEdge = graph.edges.find(e => e.label === 'subject');
    expect(subjectEdge).toBeDefined();
    expect(subjectEdge?.from).toBe('pat-sepsis-001');
  });
});
