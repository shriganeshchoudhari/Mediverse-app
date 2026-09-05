import {
  getPersonaForCase,
  parseCandidateQuery,
  computeHistoryCoverage,
  HISTORY_DIMENSIONS,
  HistoryDimension
} from '../../.gemini/skills/SimulatedPatientPersonaEngine';

describe('SimulatedPatientPersonaEngine', () => {
  const rameshPersona = getPersonaForCase('case-mbbs-01');

  describe('getPersonaForCase', () => {
    it('retrieves detailed persona for registered case-mbbs-01', () => {
      expect(rameshPersona.name).toBe('Ramesh Sundaram');
      expect(rameshPersona.age).toBe(58);
      expect(rameshPersona.affect).toBe('ANXIOUS_PAIN');
      expect(rameshPersona.suggestedQuestions.length).toBeGreaterThan(0);
    });

    it('generates cooperative fallback persona for unregistered case', () => {
      const fallback = getPersonaForCase('case-unregistered-999');
      expect(fallback.name).toBe('Patient Bedside Simulator');
      expect(fallback.affect).toBe('COOPERATIVE');
      expect(fallback.intents.ONSET_TIMING.length).toBeGreaterThan(0);
    });
  });

  describe('parseCandidateQuery', () => {
    it('handles empty query gracefully', () => {
      const turn = parseCandidateQuery('', rameshPersona);
      expect(turn.response).toContain('waiting for your question');
      expect(turn.isEmpathy).toBe(false);
    });

    it('identifies ONSET_TIMING intent correctly', () => {
      const turn = parseCandidateQuery('When did your chest pain start?', rameshPersona);
      expect(turn.matchedDimension).toBe('ONSET_TIMING');
      expect(turn.response.length).toBeGreaterThan(10);
    });

    it('identifies LOCATION_RADIATION intent correctly', () => {
      const turn = parseCandidateQuery('Does the pain radiate down your left arm or into your jaw?', rameshPersona);
      expect(turn.matchedDimension).toBe('LOCATION_RADIATION');
      expect(turn.detectedEmotion).toBe('pain');
    });

    it('identifies CHARACTER_SEVERITY intent correctly', () => {
      const turn = parseCandidateQuery('How severe is the pain on a scale of 1 to 10? Does it feel crushing?', rameshPersona);
      expect(turn.matchedDimension).toBe('CHARACTER_SEVERITY');
      expect(turn.detectedEmotion).toBe('pain');
    });

    it('identifies AGGRAVATING_RELIEVING intent correctly', () => {
      const turn = parseCandidateQuery('Does resting make the discomfort better, or does walking make it worse?', rameshPersona);
      expect(turn.matchedDimension).toBe('AGGRAVATING_RELIEVING');
    });

    it('identifies ASSOCIATED_SYMPTOMS intent correctly', () => {
      const turn = parseCandidateQuery('Are you feeling short of breath, sweaty, or nauseous?', rameshPersona);
      expect(turn.matchedDimension).toBe('ASSOCIATED_SYMPTOMS');
    });

    it('identifies PAST_HISTORY intent correctly', () => {
      const turn = parseCandidateQuery('Have you ever had high blood pressure, diabetes, or a heart attack before?', rameshPersona);
      expect(turn.matchedDimension).toBe('PAST_HISTORY');
    });

    it('identifies MEDS_ALLERGIES intent correctly', () => {
      const turn = parseCandidateQuery('What medications do you take at home, and do you have any penicillin allergies?', rameshPersona);
      expect(turn.matchedDimension).toBe('MEDS_ALLERGIES');
    });

    it('identifies SOCIAL_FAMILY intent correctly', () => {
      const turn = parseCandidateQuery('Do you smoke tobacco or drink alcohol? Does heart disease run in your family?', rameshPersona);
      expect(turn.matchedDimension).toBe('SOCIAL_FAMILY');
    });

    it('detects EMPATHY_RAPPORT and returns reassuring patient response', () => {
      const turn = parseCandidateQuery('I am so sorry you are in so much pain, we are going to take good care of you.', rameshPersona);
      expect(turn.isEmpathy).toBe(true);
      expect(turn.matchedDimension).toBe('EMPATHY_RAPPORT');
      expect(turn.detectedEmotion).toBe('reassured');
    });

    it('warns candidate when medical jargon is used directly on the patient', () => {
      const turn = parseCandidateQuery('Do you have an acute myocardial infarction?', rameshPersona);
      expect(turn.isJargonWarning).toBe(true);
      expect(turn.detectedEmotion).toBe('confused');
    });
  });

  describe('computeHistoryCoverage', () => {
    it('calculates score based on explored core dimensions', () => {
      const emptySet = new Set<HistoryDimension>();
      const emptyRep = computeHistoryCoverage(emptySet);
      expect(emptyRep.scorePercentage).toBe(0);
      expect(emptyRep.missingDimensions.length).toBe(8);

      const partialSet = new Set<HistoryDimension>([
        'ONSET_TIMING',
        'LOCATION_RADIATION',
        'CHARACTER_SEVERITY',
        'MEDS_ALLERGIES'
      ]);
      const partialRep = computeHistoryCoverage(partialSet);
      expect(partialRep.scorePercentage).toBe(50);
      expect(partialRep.missingDimensions).toContain('PAST_HISTORY');
      expect(partialRep.missingDimensions).toContain('SOCIAL_FAMILY');
    });

    it('awards 100% and commendation when all 8 core dimensions are explored', () => {
      const allCore = new Set<HistoryDimension>([
        'ONSET_TIMING',
        'LOCATION_RADIATION',
        'CHARACTER_SEVERITY',
        'AGGRAVATING_RELIEVING',
        'ASSOCIATED_SYMPTOMS',
        'PAST_HISTORY',
        'MEDS_ALLERGIES',
        'SOCIAL_FAMILY'
      ]);
      const rep = computeHistoryCoverage(allCore);
      expect(rep.scorePercentage).toBe(100);
      expect(rep.missingDimensions).toHaveLength(0);
      expect(rep.feedback[0]).toContain('Outstanding history-taking');
    });

    it('awards empathy bonus', () => {
      const withEmpathy = new Set<HistoryDimension>([
        'ONSET_TIMING',
        'LOCATION_RADIATION',
        'EMPATHY_RAPPORT'
      ]);
      const rep = computeHistoryCoverage(withEmpathy);
      // 2/8 = 25% + 5% bonus = 30%
      expect(rep.scorePercentage).toBe(30);
    });
  });

  describe('HISTORY_DIMENSIONS Registry', () => {
    it('contains all 9 defined clinical dimensions', () => {
      expect(HISTORY_DIMENSIONS.length).toBe(9);
    });
  });
});
