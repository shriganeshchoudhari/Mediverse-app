import {
  INPATIENT_CENSUS,
  evaluateDrugAllergyRisk,
  evaluateDrugInteractions,
  evaluateRenalDoseAdjustment,
  calculateFluidBalance,
  verifyFiveRights,
} from '../../.gemini/skills/HospitalEmrEngine';

describe('HospitalEmrEngine Unit Tests', () => {
  it('loads inpatient census with 4 diverse clinical cases', () => {
    expect(INPATIENT_CENSUS).toHaveLength(4);
    const [marcus, sarah, david, eleanor] = INPATIENT_CENSUS;

    expect(marcus.lastName).toBe('Vance');
    expect(marcus.primaryDiagnosis).toContain('Heart Failure');
    expect(sarah.lastName).toBe('Jenkins');
    expect(sarah.primaryDiagnosis).toContain('Sepsis');
    expect(david.lastName).toBe('Chen');
    expect(david.primaryDiagnosis).toContain('Hemicolectomy');
    expect(eleanor.lastName).toBe('Roosevelt-Smith');
    expect(eleanor.primaryDiagnosis).toContain('Stroke');
  });

  describe('Clinical Decision Support: Drug-Allergy Checking', () => {
    it('triggers critical hard stop for ACE inhibitor in angioedema allergy', () => {
      const marcus = INPATIENT_CENSUS[0];
      const result = evaluateDrugAllergyRisk('Lisinopril', marcus.allergies);
      expect(result.hasAlert).toBe(true);
      expect(result.severity).toBe('HARD_STOP_CONTRAINDICATION');
      expect(result.title).toContain('Angioedema');
    });

    it('triggers critical hard stop for Penicillin in anaphylaxis allergy', () => {
      const sarah = INPATIENT_CENSUS[1];
      const result = evaluateDrugAllergyRisk('Amoxicillin-Clavulanate', sarah.allergies);
      expect(result.hasAlert).toBe(true);
      expect(result.severity).toBe('HARD_STOP_CONTRAINDICATION');
      expect(result.title).toContain('Penicillin Anaphylaxis');
    });

    it('triggers soft stop warning for 1st gen cephalosporin in severe penicillin allergy', () => {
      const sarah = INPATIENT_CENSUS[1];
      const result = evaluateDrugAllergyRisk('Cefazolin', sarah.allergies);
      expect(result.hasAlert).toBe(true);
      expect(result.severity).toBe('SOFT_STOP_WARNING');
      expect(result.recommendation).toContain('3rd/4th generation');
    });

    it('permits non-allergenic medication without alert', () => {
      const marcus = INPATIENT_CENSUS[0];
      const result = evaluateDrugAllergyRisk('Metoprolol Tartrate', marcus.allergies);
      expect(result.hasAlert).toBe(false);
      expect(result.severity).toBe('INFO');
    });
  });

  describe('Clinical Decision Support: Drug-Drug Interactions (DDI)', () => {
    it('flags Amiodarone + Digoxin severe interaction', () => {
      const marcus = INPATIENT_CENSUS[0];
      const result = evaluateDrugInteractions('Amiodarone', marcus.medicationOrders);
      expect(result.hasAlert).toBe(true);
      expect(result.title).toContain('Amiodarone + Digoxin');
      expect(result.recommendation).toContain('Reduce Digoxin dose by 50%');
    });

    it('flags Spironolactone + Potassium supplement hyperkalemia risk', () => {
      const marcus = INPATIENT_CENSUS[0];
      const result = evaluateDrugInteractions('Spironolactone', marcus.medicationOrders);
      expect(result.hasAlert).toBe(true);
      expect(result.title).toContain('Potassium');
    });
  });

  describe('Renal Dose Adjustment', () => {
    it('adjusts Cefepime when eGFR < 30 mL/min', () => {
      const result = evaluateRenalDoseAdjustment('Cefepime', 25);
      expect(result.requiresAdjustment).toBe(true);
      expect(result.recommendedDose).toBeDefined();
      expect(result.rationale).toContain('neurotoxicity');
    });

    it('flags Enoxaparin when eGFR < 30 mL/min', () => {
      const result = evaluateRenalDoseAdjustment('Enoxaparin', 22);
      expect(result.requiresAdjustment).toBe(true);
      expect(result.recommendedDose).toContain('30 mg');
    });

    it('does not adjust when eGFR is preserved', () => {
      const result = evaluateRenalDoseAdjustment('Cefepime', 85);
      expect(result.requiresAdjustment).toBe(false);
    });
  });

  describe('Intake and Output (I&O) Fluid Balancing', () => {
    it('calculates net fluid balance correctly', () => {
      const marcus = INPATIENT_CENSUS[0];
      const balance = calculateFluidBalance(marcus.intakeRecords, marcus.outputRecords, marcus.weightKg);

      // Intake: 100 + 150 + 200 = 450 mL
      // Output: 650 + 550 + 400 = 1600 mL
      // Net: 450 - 1600 = -1150 mL (desired negative balance for ADHF)
      expect(balance.totalIntakeMl).toBe(450);
      expect(balance.totalOutputMl).toBe(1600);
      expect(balance.netBalanceMl).toBe(-1150);
      expect(balance.hasOliguriaAlert).toBe(false);
    });

    it('triggers oliguria alert when urine output < 0.5 mL/kg/h', () => {
      const weightKg = 70;
      const lowUrineOutput = [
        { id: 'u1', timestamp: '08:00', source: 'URINE_FOLEY' as const, description: 'scant urine', volumeMl: 100 },
      ];
      // 100 mL / 70 kg / 8 hours = 0.18 mL/kg/h (< 0.5)
      const balance = calculateFluidBalance([], lowUrineOutput, weightKg);
      expect(balance.hasOliguriaAlert).toBe(true);
      expect(balance.urineMlPerKgPerHour).toBeLessThan(0.5);
    });
  });

  describe('5 Rights of Medication Administration Verification', () => {
    it('passes when all 5 rights are checked and dual witness is signed for high-alert drug', () => {
      const check = verifyFiveRights(
        {
          rightPatient: true,
          rightDrug: true,
          rightDose: true,
          rightRoute: true,
          rightTime: true,
          dualNurseVerified: true,
        },
        true // isHighAlert
      );
      expect(check.isValid).toBe(true);
      expect(check.errors).toHaveLength(0);
    });

    it('fails when high-alert drug lacks second nurse co-signature', () => {
      const check = verifyFiveRights(
        {
          rightPatient: true,
          rightDrug: true,
          rightDose: true,
          rightRoute: true,
          rightTime: true,
          dualNurseVerified: false,
        },
        true // isHighAlert
      );
      expect(check.isValid).toBe(false);
      expect(check.errors[0]).toContain('dual-nurse');
    });

    it('fails when patient identity or dose is wrong', () => {
      const check = verifyFiveRights(
        {
          rightPatient: false,
          rightDrug: true,
          rightDose: false,
          rightRoute: true,
          rightTime: true,
        },
        false
      );
      expect(check.isValid).toBe(false);
      expect(check.errors.length).toBeGreaterThanOrEqual(2);
    });
  });
});
