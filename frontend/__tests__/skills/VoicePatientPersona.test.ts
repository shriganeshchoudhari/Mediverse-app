import { STANDARDIZED_PATIENTS } from '../../.gemini/skills/VoicePatientPersona';

describe('VoicePatientPersona Suite', () => {
  it('contains standardized patient personas registry', () => {
    expect(STANDARDIZED_PATIENTS).toBeDefined();
    const keys = Object.keys(STANDARDIZED_PATIENTS);
    expect(keys.length).toBeGreaterThan(0);
  });

  it('each persona contains valid clinical vitals, chief complaint, and facts', () => {
    for (const key of Object.keys(STANDARDIZED_PATIENTS)) {
      const persona = STANDARDIZED_PATIENTS[key];
      expect(persona.id).toBe(key);
      expect(persona.name).toBeTruthy();
      expect(persona.age).toBeGreaterThan(0);
      expect(persona.chiefComplaint).toBeTruthy();
      expect(persona.vitals).toBeDefined();
      expect(persona.vitals.heartRate).toBeGreaterThan(30);
      expect(persona.vitals.respiratoryRate).toBeGreaterThan(5);
      expect(persona.vitals.temperatureCelsius).toBeGreaterThan(30);
      expect(persona.clinicalFacts).toBeDefined();
      expect(Array.isArray(persona.clinicalFacts)).toBe(true);
      expect(persona.voiceSettings).toBeDefined();
    }
  });

  it('has verified clinical facts with required keywords for voice interaction', () => {
    const firstPersona = Object.values(STANDARDIZED_PATIENTS)[0];
    for (const fact of firstPersona.clinicalFacts) {
      expect(fact.fact).toBeTruthy();
      expect(fact.category).toBeTruthy();
      expect(Array.isArray(fact.requiredPromptKeywords)).toBe(true);
    }
  });
});
