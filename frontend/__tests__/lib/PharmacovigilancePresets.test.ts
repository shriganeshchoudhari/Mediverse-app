import {
  NARANJO_QUESTIONS,
  calculateNaranjoScore,
  ADR_CASE_STUDIES
} from '../../lib/pharmacy/PharmacovigilancePresets';

describe('PharmacovigilancePresets', () => {
  it('NARANJO_QUESTIONS has exactly 10 questions with yes, no, and unknown scores', () => {
    expect(NARANJO_QUESTIONS.length).toBe(10);
    NARANJO_QUESTIONS.forEach(q => {
      expect(q).toHaveProperty('id');
      expect(q).toHaveProperty('question');
      expect(q).toHaveProperty('yesScore');
      expect(q).toHaveProperty('noScore');
      expect(q).toHaveProperty('doNotKnowScore');
    });
  });

  it('calculateNaranjoScore returns Definite for score >= 9', () => {
    const answers: Record<number, 'yes'|'no'|'unknown'> = {
      1: 'yes', 2: 'yes', 3: 'yes', 4: 'yes', 5: 'no', 6: 'no', 7: 'yes', 8: 'yes', 9: 'yes', 10: 'yes'
    };
    const result = calculateNaranjoScore(answers);
    expect(result.totalScore).toBeGreaterThanOrEqual(9);
    expect(result.probabilityCategory).toBe('Definite');
  });

  it('calculateNaranjoScore returns Probable for score 5-8', () => {
    const answers: Record<number, 'yes'|'no'|'unknown'> = {
      1: 'yes', 2: 'yes', 3: 'yes', 4: 'no', 5: 'no', 6: 'unknown', 7: 'unknown', 8: 'unknown', 9: 'unknown', 10: 'yes'
    };
    const result = calculateNaranjoScore(answers);
    expect(result.probabilityCategory).toBe('Probable');
  });

  it('ADR_CASE_STUDIES has at least 4 classic clinical cases', () => {
    expect(ADR_CASE_STUDIES.length).toBeGreaterThanOrEqual(4);
  });
});
