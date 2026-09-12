import {
  STANDARDIZED_PERSONAS,
  generatePatientResponse,
  executePhysicalExamManeuver,
  executeDiagnosticTestOrder,
  gradeStudentSoapNote,
  StudentSoapNote
} from '../../.gemini/skills/StandardizedPatientEngine';

describe('StandardizedPatientEngine - Voice AI & Clinical Case Engine', () => {
  describe('Persona Initialization', () => {
    it('initializes multi-specialty clinical personas with correct vitals and diagnoses', () => {
      const appendicitis = STANDARDIZED_PERSONAS['acute-appendicitis-01'];
      expect(appendicitis).toBeDefined();
      expect(appendicitis.underlyingDiagnosis).toBe('Acute Appendicitis');
      expect(appendicitis.vitals.heartRate).toBe(104);
      expect(appendicitis.clinicalFacts.length).toBeGreaterThanOrEqual(4);

      const stemi = STANDARDIZED_PERSONAS['stemi-cardio-02'];
      expect(stemi).toBeDefined();
      expect(stemi.underlyingDiagnosis).toContain('STEMI');
      expect(stemi.vitals.oxygenSaturation).toBe(93);

      const meningitis = STANDARDIZED_PERSONAS['bacterial-meningitis-03'];
      expect(meningitis).toBeDefined();
      expect(meningitis.vitals.temperatureCelsius).toBe(39.4);
    });
  });

  describe('Conversational Intent & Fact Unlocking', () => {
    it('unlocks clinical facts when doctor asks relevant questions', () => {
      const persona = STANDARDIZED_PERSONAS['acute-appendicitis-01'];
      const facts = persona.clinicalFacts.map(f => ({ ...f }));

      const res1 = generatePatientResponse(persona, 'When did the pain start and where is it located?', facts);
      expect(res1.replyText).toContain('belly button');
      expect(res1.newlyUnlockedFact).toBeDefined();
      expect(res1.newlyUnlockedFact?.id).toBe('app_fact_1');

      // Asking about allergies
      const res2 = generatePatientResponse(persona, 'Do you have any drug allergies, especially to penicillin?', res1.updatedFacts);
      expect(res2.replyText).toContain('Penicillin');
      expect(res2.newlyUnlockedFact?.id).toBe('app_fact_4');
    });

    it('falls back to in-character default response when input is irrelevant', () => {
      const persona = STANDARDIZED_PERSONAS['acute-appendicitis-01'];
      const facts = persona.clinicalFacts.map(f => ({ ...f }));

      const res = generatePatientResponse(persona, 'What is your favorite quantum physics book?', facts);
      expect(res.replyText).toBe(persona.defaultResponse);
      expect(res.newlyUnlockedFact).toBeUndefined();
    });
  });

  describe('Physical Examination Simulation', () => {
    it('returns positive pathognomonic findings for relevant maneuvers', () => {
      const appendicitis = STANDARDIZED_PERSONAS['acute-appendicitis-01'];
      const mcburney = executePhysicalExamManeuver(appendicitis, 'MCBURNEY_SIGN');
      expect(mcburney.isAbnormal).toBe(true);
      expect(mcburney.findingDescription).toContain('ASIS to umbilicus');

      const rovsing = executePhysicalExamManeuver(appendicitis, 'ROVSING_SIGN');
      expect(rovsing.isAbnormal).toBe(true);
      expect(rovsing.findingDescription).toContain('Left Lower Quadrant');

      const murphy = executePhysicalExamManeuver(appendicitis, 'MURPHY_SIGN');
      expect(murphy.isAbnormal).toBe(false);
    });

    it('identifies meningeal signs in bacterial meningitis', () => {
      const meningitis = STANDARDIZED_PERSONAS['bacterial-meningitis-03'];
      const meningeal = executePhysicalExamManeuver(meningitis, 'MENINGEAL_SIGNS');
      expect(meningeal.isAbnormal).toBe(true);
      expect(meningeal.findingDescription).toContain('Brudzinski');
    });
  });

  describe('Diagnostic Testing Simulation', () => {
    it('simulates 12-lead ECG findings for STEMI', () => {
      const stemi = STANDARDIZED_PERSONAS['stemi-cardio-02'];
      const ecg = executeDiagnosticTestOrder(stemi, 'ECG_12_LEAD');
      expect(ecg.isIndicated).toBe(true);
      expect(ecg.formalReport).toContain('Anterior Wall STEMI');
      expect(ecg.results.some(r => r.isCritical)).toBe(true);
    });

    it('simulates CSF lumbar puncture findings for Meningitis', () => {
      const meningitis = STANDARDIZED_PERSONAS['bacterial-meningitis-03'];
      const lp = executeDiagnosticTestOrder(meningitis, 'LUMBAR_PUNCTURE');
      expect(lp.isIndicated).toBe(true);
      expect(lp.formalReport).toContain('Neisseria meningitidis');
      expect(lp.results.find(r => r.parameter === 'CSF Glucose')?.value).toContain('18 mg/dL');
    });
  });

  describe('Automated SOAP & OSCE Evaluation Rubric', () => {
    it('awards high grade for accurate diagnostic workup and SOAP note', () => {
      const appendicitis = STANDARDIZED_PERSONAS['acute-appendicitis-01'];
      const unlockedFacts = appendicitis.clinicalFacts.map(f => ({ ...f, revealed: true }));

      const studentNote: StudentSoapNote = {
        subjective: '28M presenting with migrating abdominal pain and nausea.',
        objective: 'Vitals: HR 104, Temp 38.3. Abdomen: RLQ tenderness, positive McBurney.',
        assessment: 'Acute appendicitis',
        plan: 'Keep NPO, IV fluid resuscitation, emergent surgical consult for laparoscopic appendectomy, IV Cefoxitin or Ciprofloxacin+Metronidazole (avoid penicillin).',
        primaryDiagnosis: 'Acute Appendicitis',
        differentialDiagnoses: ['Mesenteric adenitis', 'Cecal diverticulitis'],
        performedManeuvers: ['GENERAL_APPEARANCE', 'VITAL_SIGNS_CHECK', 'ABDOMINAL_PALPATION', 'MCBURNEY_SIGN', 'ROVSING_SIGN', 'MURPHY_SIGN'],
        orderedInvestigations: ['CBC', 'BMP', 'URINALYSIS', 'CT_ABDOMEN_PELVIS'],
        safetyPrecautionsTaken: ['NPO status', 'Penicillin allergy alert']
      };

      const result = gradeStudentSoapNote(appendicitis, studentNote, unlockedFacts);
      expect(result.overallScorePercentage).toBeGreaterThanOrEqual(80);
      expect(['A', 'A+', 'B']).toContain(result.letterGrade);
      expect(result.criticalSafetyViolation).toBe(false);
      expect(result.sectionScores.differentialAccuracy.primaryMatch).toBe(true);
    });

    it('penalizes critical patient safety violations (e.g. Penicillin allergy)', () => {
      const appendicitis = STANDARDIZED_PERSONAS['acute-appendicitis-01'];
      const unlockedFacts = appendicitis.clinicalFacts.map(f => ({ ...f, revealed: false }));

      const carelessNote: StudentSoapNote = {
        subjective: 'Belly pain.',
        objective: 'Tender.',
        assessment: 'Appendicitis',
        plan: 'Start IV Ampicillin-Sulbactam (Unasyn) right away.',
        primaryDiagnosis: 'Appendicitis',
        differentialDiagnoses: [],
        performedManeuvers: [],
        orderedInvestigations: [],
        safetyPrecautionsTaken: []
      };

      const result = gradeStudentSoapNote(appendicitis, carelessNote, unlockedFacts);
      expect(result.criticalSafetyViolation).toBe(true);
      expect(result.safetyViolationDetails).toContain('CRITICAL ALLERGY VIOLATION');
      expect(result.sectionScores.patientSafetyAndPlan.score).toBe(0);
    });
  });
});