import {
  calculateBurnResuscitation,
  calculateCoHalfLifeMinutes,
  getLundBrowderFactors,
  BURN_PRESETS,
} from '../../.gemini/skills/BurnsResuscitationEngine';

describe('BurnsResuscitationEngine', () => {
  describe('TBSA & Fluid Resuscitation Formulas', () => {
    it('calculates accurate Parkland formula 4 mL * kg * %TBSA', () => {
      const preset = BURN_PRESETS.find(p => p.id === 'adult-40pct-flame')!;
      const result = calculateBurnResuscitation(preset.profile);

      // Total TBSA in preset = (10+8) + (8+4) + (4+3) + (2+1) = 18 + 12 + 7 + 3 = 40%
      expect(result.totalTbsaPct).toBe(40);
      // Parkland = 4 * 70 * 40 = 11,200 mL
      expect(result.parklandTotal24hMl).toBe(11200);
      // First 8 hours volume = 50% = 5,600 mL
      expect(result.first8hTotalMl).toBe(5600);
    });

    it('adjusts first 8h hourly rate when presentation is delayed', () => {
      const preset = BURN_PRESETS.find(p => p.id === 'delayed-presentation-burn')!;
      const result = calculateBurnResuscitation(preset.profile);

      // Arrived at 4 hours post-injury: remaining hours in first 8 = 4 hours
      expect(result.first8hRemainingHours).toBe(4);
      // Hourly rate for first half should be first8hTotalMl / 4
      expect(result.first8hRateMlh).toBe(Math.round(result.first8hTotalMl / 4));
    });

    it('uses ABA 4 mL/kg/%TBSA multiplier for electrical burns with rhabdomyolysis', () => {
      const preset = BURN_PRESETS.find(p => p.id === 'electrical-myoglobinuria')!;
      const result = calculateBurnResuscitation(preset.profile);

      expect(result.abaConsensusTotal24hMl).toBe(4 * preset.profile.weightKg * result.totalTbsaPct);
      // Target UOP for electrical burns is 1.5 - 2.0 mL/kg/h
      expect(result.hourlyUopTargetRangeMlh[0]).toBe(1.5 * 80);
      expect(result.hourlyUopTargetRangeMlh[1]).toBe(2.0 * 80);
    });
  });

  describe('Fluid Creep & Intra-Abdominal Hypertension', () => {
    it('detects severe fluid creep (Ivy Index > 250 mL/kg) and ACS', () => {
      const preset = BURN_PRESETS.find(p => p.id === 'fluid-creep-acs')!;
      const result = calculateBurnResuscitation(preset.profile);

      expect(result.ivyIndexMlPerKg).toBeGreaterThan(250);
      expect(result.fluidCreepWarning).toBeDefined();
      expect(result.intraAbdominalHypertensionGrade).toBe('ACS_EMERGENCY');
    });
  });

  describe('Carboxyhemoglobin Elimination Kinetics', () => {
    it('returns 320 min on room air, 80 min on 100% FiO2, 23 min on HBO', () => {
      expect(calculateCoHalfLifeMinutes(0.21)).toBe(320);
      expect(calculateCoHalfLifeMinutes(1.0)).toBe(80);
      expect(calculateCoHalfLifeMinutes(2.5)).toBe(23);
    });

    it('calculates time to clear COHb below 5% for smoke inhalation preset', () => {
      const preset = BURN_PRESETS.find(p => p.id === 'inhalation-co-cyanide')!;
      const result = calculateBurnResuscitation(preset.profile);

      expect(result.coHalfLifeMinutes).toBe(80);
      expect(result.timeToSafeCoUnder5PctMinutes).toBeGreaterThan(150);
    });
  });

  describe('Lund-Browder Age Adjustments', () => {
    it('assigns larger head proportion for infant vs adult', () => {
      const infant = getLundBrowderFactors(0.5);
      const adult = getLundBrowderFactors(25);

      expect(infant.headPct).toBe(19);
      expect(adult.headPct).toBe(9);
    });
  });

  describe('Circumferential Burn & Escharotomy', () => {
    it('identifies emergency escharotomy requirement for circumferential full-thickness burns', () => {
      const preset = BURN_PRESETS.find(p => p.id === 'circumferential-escharotomy')!;
      const result = calculateBurnResuscitation(preset.profile);

      expect(result.escharotomyRequired).toBe(true);
      expect(result.escharotomyRegions.length).toBeGreaterThanOrEqual(2);
    });
  });
});
