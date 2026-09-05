import {
  computeGIEndoscopyState,
  getEndoscopicZone,
  calculateRockall,
  GI_ENDOSCOPY_PRESETS,
  GIEndoscopyInputParams,
} from '@/.gemini/skills/GIEndoscopyEngine';

const DEFAULT_PARAMS: GIEndoscopyInputParams = {
  presetId: 'BLEEDING_DUODENAL_ULCER_FORREST_IA',
  scopeInsertionDepthCm: 60,
  cameraRetroflexion: false,
  activeTool: 'NONE',
  epinephrineInjected: false,
  clipsDeployedCount: 0,
  bandsDeployedCount: 0,
  octreotideInfusionActive: false,
  ivPpiBolusGiven: true,
  ercpWireEngagement: 'NOT_ENGAGED',
  sphincterotomyApplied: false,
  rectalIndomethacinGiven: false,
  prophylacticPancreaticStent: false,
  balloonTrawlDone: false,
  biliaryStentDeployed: false,
  patientAge: 64,
  sbpMmHg: 92,
  hrBpm: 124,
  hemoglobinGdL: 7.4,
  bloodInStomachMl: 600,
};

describe('GIEndoscopyEngine', () => {
  describe('Endoscopic Zone Mapping', () => {
    test('identifies anatomical zones based on insertion depth and retroflexion', () => {
      expect(getEndoscopicZone(25, false)).toBe('ESOPHAGUS');
      expect(getEndoscopicZone(39, false)).toBe('GASTROESOPHAGEAL_JUNCTION');
      expect(getEndoscopicZone(48, false)).toBe('GASTRIC_BODY');
      expect(getEndoscopicZone(52, true)).toBe('GASTRIC_FUNDUS');
      expect(getEndoscopicZone(56, false)).toBe('GASTRIC_ANTRUM');
      expect(getEndoscopicZone(62, false)).toBe('DUODENAL_BULB_D1');
      expect(getEndoscopicZone(70, false)).toBe('AMPULLA_OF_VATER_D2');
    });
  });

  describe('Rockall Score Calculation', () => {
    test('computes clinical and endoscopic Rockall score accurately', () => {
      // Age 64 (+1), SBP 92 (+2), comorbidity (+1), ulcer diagnosis (+1), Forrest Ia stigmata (+2) = 7
      const rockall = calculateRockall(64, 92, 124, 'IA_SPURTING_HEMORRHAGE');
      expect(rockall.totalScore).toBe(7);
      expect(rockall.shockScore).toBe(2);
      expect(rockall.stigmataScore).toBe(2);
    });

    test('low risk score for young patient with clean ulcer base', () => {
      const rockall = calculateRockall(35, 120, 75, 'III_CLEAN_BASED_ULCER');
      expect(rockall.ageScore).toBe(0);
      expect(rockall.shockScore).toBe(0);
      expect(rockall.stigmataScore).toBe(0);
      expect(rockall.totalScore).toBe(2);
    });
  });

  describe('Biophysical Hemostasis Solving', () => {
    test('Forrest Ia spurter has active hemorrhage and high rebleeding risk initially', () => {
      const state = computeGIEndoscopyState({
        ...DEFAULT_PARAMS,
        presetId: 'BLEEDING_DUODENAL_ULCER_FORREST_IA',
        clipsDeployedCount: 0,
        epinephrineInjected: false,
      });
      expect(state.activeHemorrhage).toBe(true);
      expect(state.forrestGrade).toBe('IA_SPURTING_HEMORRHAGE');
      expect(state.rebleedingRiskPct).toBeGreaterThan(80);
      expect(state.activeAlarms).toContain('ACTIVE_ARTERIAL_SPURTING');
    });

    test('Dual therapy (Epi + Clips) achieves hemostasis and reduces rebleeding rate', () => {
      const state = computeGIEndoscopyState({
        ...DEFAULT_PARAMS,
        presetId: 'BLEEDING_DUODENAL_ULCER_FORREST_IA',
        epinephrineInjected: true,
        clipsDeployedCount: 2,
      });
      expect(state.hemostasisAchieved).toBe(true);
      expect(state.activeHemorrhage).toBe(false);
      expect(state.dualTherapyAchieved).toBe(true);
      expect(state.rebleedingRiskPct).toBeLessThan(20);
    });

    test('Variceal banding stops active variceal hemorrhage', () => {
      const state = computeGIEndoscopyState({
        ...DEFAULT_PARAMS,
        presetId: 'ESOPHAGEAL_VARICEAL_HEMORRHAGE',
        bandsDeployedCount: 3,
      });
      expect(state.hemostasisAchieved).toBe(true);
      expect(state.activeHemorrhage).toBe(false);
    });
  });

  describe('ERCP Mechanics & PEP Prevention', () => {
    test('repeated pancreatic duct engagement increases PEP risk', () => {
      const state = computeGIEndoscopyState({
        ...DEFAULT_PARAMS,
        presetId: 'CHOLEDOCHOLITHIASIS_ERCP_SPHINCTEROTOMY',
        ercpWireEngagement: 'PANCREATIC_DUCT',
        rectalIndomethacinGiven: false,
      });
      expect(state.ercp.pepRiskPct).toBeGreaterThanOrEqual(20);
      expect(state.activeAlarms).toContain('POST_ERCP_PANCREATITIS_RISK');
    });

    test('rectal indomethacin reduces PEP risk', () => {
      const unprotected = computeGIEndoscopyState({
        ...DEFAULT_PARAMS,
        presetId: 'CHOLEDOCHOLITHIASIS_ERCP_SPHINCTEROTOMY',
        ercpWireEngagement: 'PANCREATIC_DUCT',
        rectalIndomethacinGiven: false,
      });
      const protectedState = computeGIEndoscopyState({
        ...DEFAULT_PARAMS,
        presetId: 'CHOLEDOCHOLITHIASIS_ERCP_SPHINCTEROTOMY',
        ercpWireEngagement: 'PANCREATIC_DUCT',
        rectalIndomethacinGiven: true,
      });
      expect(protectedState.ercp.pepRiskPct).toBeLessThan(unprotected.ercp.pepRiskPct);
    });

    test('choledocholithiasis stones are marked cleared after sphincterotomy and balloon trawl', () => {
      const state = computeGIEndoscopyState({
        ...DEFAULT_PARAMS,
        presetId: 'CHOLEDOCHOLITHIASIS_ERCP_SPHINCTEROTOMY',
        ercpWireEngagement: 'COMMON_BILE_DUCT',
        sphincterotomyApplied: true,
        balloonTrawlDone: true,
      });
      expect(state.ercp.stonesCleared).toBe(true);
      expect(state.activeAlarms).not.toContain('BILIARY_OBSTRUCTION_CHOLANGITIS');
    });
  });

  describe('Preset Catalog Integrity', () => {
    test('all 6 presets have required clinical metadata', () => {
      expect(Object.keys(GI_ENDOSCOPY_PRESETS)).toHaveLength(6);
      Object.values(GI_ENDOSCOPY_PRESETS).forEach(p => {
        expect(p.title).toBeTruthy();
        expect(p.indication).toBeTruthy();
        expect(p.guidelineAction).toBeTruthy();
        expect(p.targetDepthCm).toBeGreaterThan(0);
      });
    });
  });
});
