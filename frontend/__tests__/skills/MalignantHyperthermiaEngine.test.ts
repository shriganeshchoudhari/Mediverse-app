/**
 * MalignantHyperthermiaEngine.test.ts
 * Rigorous Unit Tests for Malignant Hyperthermia, NMS, Serotonin Syndrome & Dantrolene Engine.
 */

import {
  MalignantHyperthermiaEngine,
  NeuromuscularExam,
  PatientVitals,
  LaboratoryProfile,
  CrisisInterventions
} from '../../.gemini/skills/MalignantHyperthermiaEngine';

describe('MalignantHyperthermiaEngine', () => {
  describe('Dantrolene Formulations & Stoichiometry Bench', () => {
    it('calculates Ryanodex reconstitution for an 80 kg adult at 2.5 mg/kg', () => {
      // 80 kg * 2.5 mg/kg = 200 mg total dose
      const result = MalignantHyperthermiaEngine.calculateDantroleneNeeds('RYANODEX', 80, 2.5);

      expect(result.totalDoseMg).toBe(200);
      expect(result.vialsRequired).toBe(1); // 1 vial of 250 mg
      expect(result.sterileWaterVolumeMl).toBe(5); // 5 mL sterile water
      expect(result.reconstitutionTimeSeconds).toBeLessThanOrEqual(30);
      expect(result.clinicalBurdenLabel).toContain('Ultra-rapid');
    });

    it('calculates Traditional Dantrium reconstitution burden for an 80 kg adult at 2.5 mg/kg', () => {
      // 80 kg * 2.5 mg/kg = 200 mg -> 10 vials of 20 mg
      const result = MalignantHyperthermiaEngine.calculateDantroleneNeeds('TRADITIONAL_DANTRIUM', 80, 2.5);

      expect(result.totalDoseMg).toBe(200);
      expect(result.vialsRequired).toBe(10); // 10 vials
      expect(result.sterileWaterVolumeMl).toBe(600); // 600 mL sterile water!
      expect(result.clinicalBurdenLabel).toContain('Heavy reconstitution burden');
    });

    it('calculates maximum cumulative dose (10 mg/kg) requiring 40 traditional vials', () => {
      const result = MalignantHyperthermiaEngine.calculateDantroleneNeeds('TRADITIONAL_DANTRIUM', 80, 10.0);

      expect(result.totalDoseMg).toBe(800);
      expect(result.vialsRequired).toBe(40);
      expect(result.sterileWaterVolumeMl).toBe(2400); // 2.4 Liters of sterile water!
    });
  });

  describe('Tri-Disorder Differential Diagnosis Classifier', () => {
    it('identifies Malignant Hyperthermia in the presence of volatile anesthetic and masseter spasm / EtCO2 surge', () => {
      const exam: NeuromuscularExam = {
        rigidityType: 'MASSETER_SPASM',
        reflexes: 'NORMAL',
        pupilState: 'NORMAL',
        diaphoresis: 'PROFUSE',
        bowelSounds: 'NORMAL',
        mentalStatus: 'STUPOROUS_CATATONIC'
      };

      const triggers = {
        volatileAnesthetics: true,
        succinylcholine: true,
        dopamineAntagonists: false,
        serotonergicAgents: false
      };

      const result = MalignantHyperthermiaEngine.classifyDisorder(exam, triggers, 78, 0.5);

      expect(result.disorder).toBe('MALIGNANT_HYPERTHERMIA');
      expect(result.confidence).toBeGreaterThanOrEqual(90);
      expect(result.evidence.some(e => e.includes('EtCO2 surge'))).toBe(true);
      expect(result.evidence.some(e => e.includes('Masseter'))).toBe(true);
    });

    it('identifies Serotonin Syndrome via Hunter Criteria with spontaneous clonus and hyperreflexia', () => {
      const exam: NeuromuscularExam = {
        rigidityType: 'TREMOR_AND_CLONUS',
        reflexes: 'CLONUS_SPONTANEOUS_4_PLUS',
        pupilState: 'MYDRIASIS',
        diaphoresis: 'PROFUSE',
        bowelSounds: 'HYPERACTIVE_DIARRHEA',
        mentalStatus: 'CONFUSED_AGITATED'
      };

      const triggers = {
        volatileAnesthetics: false,
        succinylcholine: false,
        dopamineAntagonists: false,
        serotonergicAgents: true
      };

      const result = MalignantHyperthermiaEngine.classifyDisorder(exam, triggers, 38, 6);

      expect(result.disorder).toBe('SEROTONIN_SYNDROME');
      expect(result.confidence).toBeGreaterThanOrEqual(90);
      expect(result.evidence.some(e => e.includes('clonus'))).toBe(true);
      expect(result.evidence.some(e => e.includes('hypermotility'))).toBe(true);
    });

    it('identifies Neuroleptic Malignant Syndrome with lead-pipe rigidity and diminished reflexes', () => {
      const exam: NeuromuscularExam = {
        rigidityType: 'LEAD_PIPE',
        reflexes: 'DIMINISHED',
        pupilState: 'NORMAL',
        diaphoresis: 'PROFUSE',
        bowelSounds: 'ABSENT',
        mentalStatus: 'STUPOROUS_CATATONIC'
      };

      const triggers = {
        volatileAnesthetics: false,
        succinylcholine: false,
        dopamineAntagonists: true,
        serotonergicAgents: false
      };

      const result = MalignantHyperthermiaEngine.classifyDisorder(exam, triggers, 40, 72);

      expect(result.disorder).toBe('NEUROLEPTIC_MALIGNANT_SYNDROME');
      expect(result.confidence).toBeGreaterThanOrEqual(85);
      expect(result.evidence.some(e => e.includes('lead-pipe'))).toBe(true);
    });
  });

  describe('MHAUS Clinical Grading Scale', () => {
    it('calculates score > 50 (Almost Certain MH) for full hyperacute tetrad', () => {
      const result = MalignantHyperthermiaEngine.calculateMhausScore(
        'MASSETER_SPASM', // 15
        75,               // >55 -> 15
        41.5,             // >=41 -> 15
        140,              // >120 -> 3
        35000,            // >20000 -> 15
        6.5,              // >6.0 -> 3
        7.15              // <7.25 -> 10
      );

      expect(result.score).toBeGreaterThan(50);
      expect(result.probabilityTier).toContain('Almost Certain');
    });

    it('calculates low score for isolated mild tachycardia without rigidity or hypermetabolism', () => {
      const result = MalignantHyperthermiaEngine.calculateMhausScore(
        'NONE',
        38,
        37.0,
        125,
        150,
        4.0,
        7.40
      );

      expect(result.score).toBeLessThan(10);
      expect(result.probabilityTier).toContain('Almost Never');
    });
  });

  describe('Dynamic Crisis Simulation & Lethal Pitfalls', () => {
    const baseVitals: PatientVitals = {
      heartRateBpm: 140,
      coreTemperatureC: 40.0,
      endTidalCo2Mmhg: 80,
      systolicBpMmhg: 150,
      diastolicBpMmhg: 90,
      respiratoryRateBpm: 24,
      minuteVentilationLpm: 12.0
    };

    const baseLabs: LaboratoryProfile = {
      arterialPh: 7.10,
      paco2Mmhg: 65,
      serumBicarbonateMeqL: 18,
      serumPotassiumMeqL: 6.9,
      creatineKinaseUPerL: 45000,
      myoglobinuriaPresent: true,
      urineOutputMlPerHr: 20,
      baseExcessMeqL: -12,
      lactateMmolL: 6.5
    };

    it('triggers LETHAL warning when Calcium Channel Blocker is given with Dantrolene', () => {
      const lethalInterventions: CrisisInterventions = {
        triggeringAnestheticsDiscontinued: true,
        charcoalFiltersApplied: true,
        fiO2Percent: 100,
        minuteVentilationMultiplier: 2.5,
        activeExternalCooling: true,
        coldIvSalineInfused: true,
        dantroleneAdministeredMgPerKg: 2.5,
        calciumChlorideGiven: false,
        insulinDextroseGiven: false,
        sodiumBicarbonateGiven: false,
        calciumChannelBlockerGiven: true, // FATAL CONTRAINDICATION
        bromocriptineGiven: false,
        cyproheptadineGiven: false
      };

      const result = MalignantHyperthermiaEngine.simulateCrisis(baseVitals, baseLabs, lethalInterventions, 80);

      expect(result.fatalPitfalls.some(p => p.includes('Calcium Channel Blocker'))).toBe(true);
      expect(result.status).toBe('IMMINENT_CARDIAC_ARREST');
    });

    it('shows resolution and CONTROLLED status when proper Dantrolene and cooling are delivered', () => {
      const successfulInterventions: CrisisInterventions = {
        triggeringAnestheticsDiscontinued: true,
        charcoalFiltersApplied: true,
        fiO2Percent: 100,
        minuteVentilationMultiplier: 3.0,
        activeExternalCooling: true,
        coldIvSalineInfused: true,
        dantroleneAdministeredMgPerKg: 2.5,
        calciumChlorideGiven: true,
        insulinDextroseGiven: true,
        sodiumBicarbonateGiven: true,
        calciumChannelBlockerGiven: false,
        bromocriptineGiven: false,
        cyproheptadineGiven: false
      };

      const result = MalignantHyperthermiaEngine.simulateCrisis(baseVitals, baseLabs, successfulInterventions, 80);

      expect(result.fatalPitfalls).toHaveLength(0);
      expect(result.currentVitals.endTidalCo2Mmhg).toBeLessThan(50);
      expect(result.currentVitals.coreTemperatureC).toBeLessThan(39.0);
      expect(result.currentLabs.serumPotassiumMeqL).toBeLessThan(6.0);
      expect(result.status).toBe('CONTROLLED');
      expect(result.checklist.every(c => !c.critical || c.done)).toBe(true);
    });
  });

  describe('Clinical Presets Integrity', () => {
    const presets = MalignantHyperthermiaEngine.getClinicalPresets();

    it('contains all 4 archetypal scenarios', () => {
      expect(presets.hyperacute_mh).toBeDefined();
      expect(presets.nms_haloperidol).toBeDefined();
      expect(presets.serotonin_syndrome_hunter).toBeDefined();
      expect(presets.refractory_mh_hyperkalemia).toBeDefined();
    });

    it('validates Hyperacute MH preset triggers Malignant Hyperthermia classification', () => {
      const p = presets.hyperacute_mh;
      const res = MalignantHyperthermiaEngine.classifyDisorder(p.exam, p.triggers, p.vitals.endTidalCo2Mmhg, p.onsetHours);

      expect(res.disorder).toBe('MALIGNANT_HYPERTHERMIA');
    });
  });
});
