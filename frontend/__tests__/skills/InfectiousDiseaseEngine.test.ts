import {
  computeInfectiousDiseaseState,
  calculateCrCl,
  calculateQSOFA,
  generatePathogenProfile,
  getInstitutionalAntibiogram,
  ID_PRESETS,
  InfectiousDiseaseInputParams,
} from '@/.gemini/skills/InfectiousDiseaseEngine';

const DEFAULT_PARAMS: InfectiousDiseaseInputParams = {
  presetId: 'MRSA_BACTEREMIA_ENDOCARDITIS',
  patientAge: 62,
  serumCreatinineMgDl: 1.2,
  weightKg: 75,
  infectionSite: 'BLOODSTREAM_SEPSIS',
  selectedAntibiotics: ['VANCOMYCIN'],
  bundleCulturesDrawn: true,
  bundleAntibioticsGiven: true,
  bundleFluidsGiven: true,
  bundleVasopressorsGiven: false,
  sbpMmHg: 96,
  rrPerMin: 24,
  gcsScore: 14,
  baselineLactateMmolL: 2.8,
};

describe('InfectiousDiseaseEngine', () => {
  describe('Cockcroft-Gault Equation', () => {
    test('computes CrCl accurately for male patient', () => {
      // ((140 - 60) * 72) / (72 * 1.0) = 80 mL/min
      const crcl = calculateCrCl(60, 72, 1.0, false);
      expect(crcl).toBe(80);
    });

    test('applies 0.85 sex multiplier for female patient', () => {
      const crcl = calculateCrCl(60, 72, 1.0, true);
      expect(crcl).toBe(68);
    });
  });

  describe('qSOFA Scoring', () => {
    test('calculates qSOFA accurately across all 3 criteria', () => {
      // rr >= 22 (+1), gcs < 15 (+1), sbp <= 100 (+1) = 3
      const scoreFull = calculateQSOFA(24, 13, 90);
      expect(scoreFull.totalScore).toBe(3);

      const scoreZero = calculateQSOFA(16, 15, 120);
      expect(scoreZero.totalScore).toBe(0);
    });
  });

  describe('Pathogen Profiles & Breakpoints', () => {
    test('generates MRSA profile with mecA beta-lactam resistance and vancomycin susceptibility', () => {
      const p = generatePathogenProfile('MRSA_BACTEREMIA_ENDOCARDITIS');
      expect(p.species).toBe('STAPHYLOCOCCUS_AUREUS');
      expect(p.resistanceMechanism).toBe('MECA_PBP2A');

      const oxa = p.antibiogram.find(e => e.antibiotic === 'OXACILLIN');
      expect(oxa?.category).toBe('RESISTANT');

      const vanc = p.antibiogram.find(e => e.antibiotic === 'VANCOMYCIN');
      expect(vanc?.category).toBe('SUSCEPTIBLE');
      expect(vanc?.pkPdMetric).toBe('AUC_MIC');
    });

    test('generates CRE profile with NDM-1 metallo-beta-lactamase resistance', () => {
      const p = generatePathogenProfile('CRE_NDM_PNEUMONIA_ICU');
      expect(p.resistanceMechanism).toBe('METALLO_BETA_LACTAMASE_NDM');

      const mero = p.antibiogram.find(e => e.antibiotic === 'MEROPENEM');
      expect(mero?.category).toBe('RESISTANT');

      const colistin = p.antibiogram.find(e => e.antibiotic === 'COLISTIN');
      expect(colistin?.category).toBe('SUSCEPTIBLE');
    });
  });

  describe('Biophysical State Computation', () => {
    test('detects effective antimicrobial coverage when susceptible drug is prescribed', () => {
      const state = computeInfectiousDiseaseState({
        ...DEFAULT_PARAMS,
        presetId: 'MRSA_BACTEREMIA_ENDOCARDITIS',
        selectedAntibiotics: ['VANCOMYCIN'],
      });
      expect(state.effectiveCoverage).toBe(true);
      expect(state.activeAlarms).not.toContain('INAPPROPRIATE_EMPIRIC_SPECTRUM');
    });

    test('flags inappropriate spectrum gap when resistant drug is prescribed', () => {
      const state = computeInfectiousDiseaseState({
        ...DEFAULT_PARAMS,
        presetId: 'MRSA_BACTEREMIA_ENDOCARDITIS',
        selectedAntibiotics: ['CEFAZOLIN'], // Resistant in MRSA
      });
      expect(state.effectiveCoverage).toBe(false);
      expect(state.activeAlarms).toContain('INAPPROPRIATE_EMPIRIC_SPECTRUM');
    });

    test('flags CRE carbapenemase alert for NDM-1 preset', () => {
      const state = computeInfectiousDiseaseState({
        ...DEFAULT_PARAMS,
        presetId: 'CRE_NDM_PNEUMONIA_ICU',
        selectedAntibiotics: ['COLISTIN'],
      });
      expect(state.activeAlarms).toContain('CRE_CARBAPENEMASE_ALERT');
    });
  });

  describe('Institutional Antibiogram Matrix', () => {
    test('provides susceptibility percentages for ICU and floor', () => {
      const matrix = getInstitutionalAntibiogram();
      expect(matrix.VANCOMYCIN.icuSusceptibilityPct).toBeGreaterThan(90);
      expect(matrix.MEROPENEM.floorSusceptibilityPct).toBeGreaterThan(90);
    });
  });

  describe('Preset Catalog Integrity', () => {
    test('all 6 presets have metadata and valid targets', () => {
      expect(Object.keys(ID_PRESETS)).toHaveLength(6);
      Object.values(ID_PRESETS).forEach(p => {
        expect(p.title).toBeTruthy();
        expect(p.pathogen).toBeTruthy();
        expect(p.resistanceMechanism).toBeTruthy();
        expect(p.antibiogramHighlight).toBeTruthy();
      });
    });
  });
});
