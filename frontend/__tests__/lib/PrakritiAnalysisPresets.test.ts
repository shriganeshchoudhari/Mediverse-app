import {
  PRAKRITI_QUESTIONS,
  calculatePrakritiScore,
  PRAKRITI_PROFILES
} from '../../lib/ayush/PrakritiAnalysisPresets';

describe('PrakritiAnalysisPresets', () => {
  it('PRAKRITI_QUESTIONS has at least 20 questions with category, questionText, and options', () => {
    expect(PRAKRITI_QUESTIONS.length).toBeGreaterThanOrEqual(20);
    PRAKRITI_QUESTIONS.forEach(q => {
      expect(q).toHaveProperty('category');
      expect(q).toHaveProperty('questionText');
      expect(q).toHaveProperty('options');
      expect(q.options).toHaveProperty('vata');
      expect(q.options).toHaveProperty('pitta');
      expect(q.options).toHaveProperty('kapha');
    });
  });

  it('calculatePrakritiScore correctly calculates 100% Vata when all answers are vata', () => {
    const answers: Record<string, 'vata' | 'pitta' | 'kapha'> = {};
    PRAKRITI_QUESTIONS.forEach(q => {
      answers[q.id] = 'vata';
    });
    const result = calculatePrakritiScore(answers);
    expect(result.vataPercent).toBe(100);
    expect(result.dominantPrakriti).toContain('Vata');
  });

  it('calculatePrakritiScore identifies Dvandvaja constitution when two doshas are closely tied', () => {
    const answers: Record<string, 'vata' | 'pitta' | 'kapha'> = {};
    PRAKRITI_QUESTIONS.forEach((q, idx) => {
      answers[q.id] = idx % 2 === 0 ? 'vata' : 'pitta';
    });
    const result = calculatePrakritiScore(answers);
    expect(result.constitutionType).toBe('Dvandvaja');
  });

  it('PRAKRITI_PROFILES exists and has entries', () => {
    expect(PRAKRITI_PROFILES).toBeDefined();
    expect(Object.keys(PRAKRITI_PROFILES).length).toBeGreaterThan(0);
  });
});
