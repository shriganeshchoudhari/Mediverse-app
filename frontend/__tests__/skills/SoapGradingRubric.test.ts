import { EVALUATE_SOAP_NOTE_CLIENT_MOCK } from '../../.gemini/skills/SoapGradingRubric';

describe('SoapGradingRubric Suite', () => {
  it('evaluates comprehensive clinical note with Honors or Pass grade', () => {
    const subjective = 'Patient presents with 2-day history of acute severe right lower quadrant pain, nausea, and anorexia.';
    const objective = 'Vitals: BP 120/80, HR 88, Temp 38.2C, SpO2 98%. Exam reveals tenderness at McBurney point with positive Rovsing sign.';
    const assessment = 'Acute appendicitis versus mesenteric adenitis versus acute diverticulitis.';
    const plan = 'NPO, IV normal saline, Ceftriaxone 1g IV daily plus Metronidazole 500mg IV q8h, urgent surgical consultation for appendectomy.';

    const result = EVALUATE_SOAP_NOTE_CLIENT_MOCK(subjective, objective, assessment, plan);
    expect(result.totalScore).toBeGreaterThanOrEqual(70);
    expect(['HONORS', 'PASS']).toContain(result.grade);
    expect(result.criteria).toHaveLength(5);
  });

  it('penalizes incomplete note missing vitals and differential diagnosis', () => {
    const subjective = 'Pain in belly.';
    const objective = 'Looks sick.';
    const assessment = 'Belly pain.';
    const plan = 'Give meds.';

    const result = EVALUATE_SOAP_NOTE_CLIENT_MOCK(subjective, objective, assessment, plan);
    expect(result.totalScore).toBeLessThan(70);
    expect(['CONDITIONAL', 'FAIL']).toContain(result.grade);
    const subjCrit = result.criteria.find(c => c.category === 'SUBJECTIVE');
    expect(subjCrit?.status).toBe('PARTIALLY_MET');
  });

  it('includes patient safety criteria in evaluation', () => {
    const result = EVALUATE_SOAP_NOTE_CLIENT_MOCK('Subj text exceeding thirty characters threshold', 'BP 120/80 HR 80', 'Differential diagnosis', 'IV ceftriaxone daily');
    const safetyCrit = result.criteria.find(c => c.category === 'PATIENT_SAFETY');
    expect(safetyCrit).toBeDefined();
    expect(safetyCrit?.scoreAchieved).toBe(10);
  });
});
