import {
  calculateMap,
  getTargetGoals,
  evaluateAutoregulation,
  calculateDrugEffect,
  assessToxicologyRisks,
  evaluateHypertensiveCrisis,
  CLINICAL_PRESETS,
  PatientVitals,
  DrugDosing
} from '../../.gemini/skills/HypertensiveCrisisTitrationEngine';

describe('HypertensiveCrisisTitrationEngine', () => {
  describe('calculateMap', () => {
    it('accurately computes mean arterial pressure', () => {
      // 120/80 -> 80 + 40/3 = 93.3
      expect(calculateMap(120, 80)).toBe(93.3);
      // 210/120 -> 120 + 90/3 = 150
      expect(calculateMap(210, 120)).toBe(150);
    });
  });

  describe('getTargetGoals', () => {
    it('defines correct goals for Hypertensive Urgency (no acute TOD)', () => {
      const goals = getTargetGoals('none', 190, 115);
      expect(goals.classification).toBe('Hypertensive Urgency');
      expect(goals.maxFirstHourMapDropPercent).toBe(15);
      expect(goals.contraindicatedDrugs.some(d => d.drug === 'nitroprusside')).toBe(true);
    });

    it('defines rapid aggressive shear-reduction targets for Aortic Dissection', () => {
      const goals = getTargetGoals('aortic_dissection', 210, 125);
      expect(goals.classification).toBe('Hypertensive Emergency');
      expect(goals.sbpTargetMax).toBe(120);
      expect(goals.hrTargetMax).toBe(60);
      expect(goals.preferredDrugs).toContain('esmolol');
      expect(goals.contraindicatedDrugs.some(d => d.drug === 'hydralazine')).toBe(true);
    });

    it('defines afterload reduction goals for Flash Pulmonary Edema (SCAPE)', () => {
      const goals = getTargetGoals('flash_pulmonary_edema', 230, 130);
      expect(goals.preferredDrugs).toContain('nitroglycerin');
      expect(goals.preferredDrugs).toContain('nicardipine');
      expect(goals.contraindicatedDrugs.some(d => d.drug === 'esmolol')).toBe(true);
    });

    it('enforces permissive hypertension targets for Ischemic Stroke without tPA', () => {
      const goals = getTargetGoals('ischemic_stroke_no_tpa', 205, 115);
      expect(goals.sbpTargetMax).toBe(215);
      expect(goals.maxFirstHourMapDropPercent).toBe(15);
    });

    it('enforces tight SBP 130-140 mmHg for Acute Intracerebral Hemorrhage', () => {
      const goals = getTargetGoals('intracranial_hemorrhage', 180, 100);
      expect(goals.sbpTargetMin).toBe(130);
      expect(goals.sbpTargetMax).toBe(140);
    });
  });

  describe('evaluateAutoregulation', () => {
    it('detects normal autoregulation in chronic HTN when MAP is within shifted plateau', () => {
      // Chronic HTN plateau: 105 to 175 mmHg
      const auto = evaluateAutoregulation(220, 130, 170, 100, true, 'hypertensive_encephalopathy');
      // MAP: 100 + 70/3 = 123.3 mmHg (between 105 and 175)
      expect(auto.isBelowLowerLimit).toBe(false);
      expect(auto.isAboveUpperLimit).toBe(false);
    });

    it('triggers watershed ischemic danger when MAP drops below rightward threshold in chronic HTN', () => {
      // Starting 220/130 (MAP 160). Dropped to 110/70 (MAP 83.3). Lower threshold is 105 mmHg!
      const auto = evaluateAutoregulation(220, 130, 110, 70, true, 'hypertensive_encephalopathy');
      expect(auto.isBelowLowerLimit).toBe(true);
      expect(auto.clinicalState).toBe('watershed_ischemic_danger');
      expect(auto.explanation).toContain('BELOW the rightward-shifted lower autoregulatory threshold');
    });

    it('detects hyperperfusion risk when MAP exceeds upper limit', () => {
      // Starting 240/150 (MAP 180). Current MAP 180 > 175.
      const auto = evaluateAutoregulation(240, 150, 240, 150, true, 'hypertensive_encephalopathy');
      expect(auto.isAboveUpperLimit).toBe(true);
      expect(auto.clinicalState).toBe('hyperperfusion_risk');
    });
  });

  describe('calculateDrugEffect', () => {
    const dummyPatient: PatientVitals = {
      sbp: 210,
      dbp: 120,
      heartRate: 100,
      weightKg: 70,
      chronicHypertension: true,
      targetOrganDamage: 'aortic_dissection'
    };

    it('evaluates Nicardipine dose-response correctly', () => {
      const sub = calculateDrugEffect({ drug: 'nicardipine', infusionRate: 2.5 }, dummyPatient);
      expect(sub.status).toBe('subtherapeutic');

      const therapeutic = calculateDrugEffect({ drug: 'nicardipine', infusionRate: 10 }, dummyPatient);
      expect(therapeutic.status).toBe('therapeutic');
      expect(therapeutic.sbpReduction).toBeGreaterThan(30);

      const maxDose = calculateDrugEffect({ drug: 'nicardipine', infusionRate: 15 }, dummyPatient);
      expect(maxDose.status).toBe('maximum');
      expect(maxDose.sbpReduction).toBe(55);
    });

    it('evaluates Esmolol potent bradycardic effect', () => {
      const esmolol = calculateDrugEffect({ drug: 'esmolol', infusionRate: 200 }, dummyPatient);
      expect(esmolol.status).toBe('maximum');
      expect(esmolol.hrChange).toBeLessThan(-30);
    });

    it('flags asthma bronchospasm warning for Labetalol', () => {
      const asthmaticPatient: PatientVitals = {
        ...dummyPatient,
        historyOfAsthmaCopd: true
      };
      const labetalol = calculateDrugEffect({ drug: 'labetalol', ivBolusDoseMg: 20, infusionRate: 1 }, asthmaticPatient);
      expect(labetalol.specialWarnings.some(w => w.includes('bronchospasm'))).toBe(true);
    });

    it('flags Nitroprusside high-dose warnings', () => {
      const snp = calculateDrugEffect({ drug: 'nitroprusside', infusionRate: 6, durationHours: 36 }, dummyPatient);
      expect(snp.specialWarnings.some(w => w.includes('cyanide'))).toBe(true);
    });
  });

  describe('assessToxicologyRisks', () => {
    it('detects lethal reflex tachycardia hazard in Aortic Dissection when vasodilator given alone', () => {
      const dissectionPatient: PatientVitals = {
        sbp: 210,
        dbp: 125,
        heartRate: 105,
        weightKg: 80,
        chronicHypertension: true,
        targetOrganDamage: 'aortic_dissection'
      };
      const vasodilatorsOnly: DrugDosing[] = [
        { drug: 'nicardipine', infusionRate: 10 }
      ];
      const risk = assessToxicologyRisks(vasodilatorsOnly, dissectionPatient, 15);
      expect(risk.reflexTachycardiaShearHazard).toBe(true);
      expect(risk.alerts.some(a => a.includes('LETHAL DISSECTION PITFALL'))).toBe(true);
    });

    it('clears reflex tachycardia hazard when beta-blocker is co-administered', () => {
      const dissectionPatient: PatientVitals = {
        sbp: 210,
        dbp: 125,
        heartRate: 105,
        weightKg: 80,
        chronicHypertension: true,
        targetOrganDamage: 'aortic_dissection'
      };
      const betaBlockerPlusVasodilator: DrugDosing[] = [
        { drug: 'esmolol', infusionRate: 150 },
        { drug: 'nicardipine', infusionRate: 10 }
      ];
      const risk = assessToxicologyRisks(betaBlockerPlusVasodilator, dissectionPatient, 15);
      expect(risk.reflexTachycardiaShearHazard).toBe(false);
    });

    it('detects cyanide toxicity risk with prolonged nitroprusside', () => {
      const patient: PatientVitals = {
        sbp: 220,
        dbp: 130,
        heartRate: 88,
        weightKg: 75,
        chronicHypertension: true,
        targetOrganDamage: 'hypertensive_encephalopathy'
      };
      const snpHigh: DrugDosing[] = [
        { drug: 'nitroprusside', infusionRate: 5, durationHours: 30 }
      ];
      const risk = assessToxicologyRisks(snpHigh, patient, 20);
      expect(risk.cyanideToxicityRisk).toBe('high');
      expect(risk.alerts.some(a => a.includes('CYANIDE'))).toBe(true);
    });

    it('detects negative inotropy hazard when beta blocker used in acute pulmonary edema', () => {
      const scapePatient: PatientVitals = {
        sbp: 230,
        dbp: 130,
        heartRate: 110,
        weightKg: 80,
        chronicHypertension: true,
        targetOrganDamage: 'flash_pulmonary_edema',
        heartFailureWithReducedEf: true
      };
      const risk = assessToxicologyRisks([{ drug: 'labetalol', ivBolusDoseMg: 40, infusionRate: 0 }], scapePatient, 10);
      expect(risk.negativeInotropyHazard).toBe(true);
      expect(risk.alerts.some(a => a.includes('Negative Inotropic Pitfall'))).toBe(true);
    });
  });

  describe('evaluateHypertensiveCrisis', () => {
    it('successfully solves Stanford Type A Aortic Dissection with Esmolol + Nicardipine', () => {
      const preset = CLINICAL_PRESETS.find(p => p.id === 'aortic-dissection-type-a')!;
      const drugs: DrugDosing[] = [
        { drug: 'esmolol', infusionRate: 200, ivBolusDoseMg: 50 },
        { drug: 'nicardipine', infusionRate: 15 }
      ];
      const evaluation = evaluateHypertensiveCrisis(preset.patient, drugs);

      expect(evaluation.vitals.sbp).toBeLessThanOrEqual(120);
      expect(evaluation.vitals.heartRate).toBeLessThanOrEqual(60);
      expect(evaluation.goalsAchieved.hrInTarget).toBe(true);
      expect(evaluation.goalsAchieved.sbpInTarget).toBe(true);
      expect(evaluation.goalsAchieved.overallSuccess).toBe(true);
    });

    it('fails overall success in Aortic Dissection if only vasodilator is given (reflex tachycardia)', () => {
      const preset = CLINICAL_PRESETS.find(p => p.id === 'aortic-dissection-type-a')!;
      const drugs: DrugDosing[] = [
        { drug: 'nicardipine', infusionRate: 15 }
      ];
      const evaluation = evaluateHypertensiveCrisis(preset.patient, drugs);
      expect(evaluation.toxicology.reflexTachycardiaShearHazard).toBe(true);
      expect(evaluation.goalsAchieved.overallSuccess).toBe(false);
    });
  });
});
