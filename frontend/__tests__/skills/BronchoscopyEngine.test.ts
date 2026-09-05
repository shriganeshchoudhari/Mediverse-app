import {
  AIRWAY_LANDMARKS,
  EBUS_STATIONS,
  evaluateBronchoscopePosition,
  BRONCHOSCOPY_PRESETS,
  BronchoscopeState
} from '../../.gemini/skills/BronchoscopyEngine';

describe('BronchoscopyEngine', () => {
  describe('AIRWAY_LANDMARKS & EBUS_STATIONS Catalog', () => {
    it('defines primary tracheobronchial landmarks from vocal cords to basal segments', () => {
      expect(AIRWAY_LANDMARKS.VOCAL_CORDS).toBeDefined();
      expect(AIRWAY_LANDMARKS.SUBGLOTTIS).toBeDefined();
      expect(AIRWAY_LANDMARKS.MAIN_CARINA).toBeDefined();
      expect(AIRWAY_LANDMARKS.RUL_ORIFICE).toBeDefined();
      expect(AIRWAY_LANDMARKS.BRONCHUS_INTERMEDIUS).toBeDefined();
      expect(AIRWAY_LANDMARKS.RML_ORIFICE).toBeDefined();
      expect(AIRWAY_LANDMARKS.L_MAINSTEM).toBeDefined();
      expect(AIRWAY_LANDMARKS.LINGULA_ORIFICE).toBeDefined();
      expect(Object.keys(AIRWAY_LANDMARKS).length).toBeGreaterThanOrEqual(20);
    });

    it('contains all essential IASLC mediastinal EBUS stations with vascular safety rules', () => {
      expect(EBUS_STATIONS.STATION_4R).toBeDefined();
      expect(EBUS_STATIONS.STATION_4L).toBeDefined();
      expect(EBUS_STATIONS.STATION_7).toBeDefined();
      expect(EBUS_STATIONS.STATION_7.nStageClassification).toBe('N2');
      expect(EBUS_STATIONS.STATION_7.adjacentVascularStructures).toContain('Right Pulmonary Artery anteriorly');
      expect(EBUS_STATIONS.STATION_4R.adjacentVascularStructures).toContain('Azygos Vein Arch');
    });
  });

  describe('evaluateBronchoscopePosition Kinematics', () => {
    it('accurately identifies and centers Main Carina at 25cm depth with neutral tip', () => {
      const scope: BronchoscopeState = {
        depthCm: 25,
        tipDeflectionDeg: 0,
        shaftRotationDeg: 0,
        activeTool: 'NONE',
        suctionActive: false,
        lightIntensityPct: 80,
        ebusModeActive: false,
        ebusBalloonSalineMl: 0,
        colorDopplerActive: false
      };

      const result = evaluateBronchoscopePosition(scope);
      expect(result.currentLandmarkId).toBe('MAIN_CARINA');
      expect(result.isViewCentered).toBe(true);
      expect(result.alignmentScorePct).toBeGreaterThanOrEqual(85);
      expect(result.ebusTargetStation?.id).toBe('STATION_7');
    });

    it('locks RUL orifice when scope is advanced to 28cm with steep upward flexion and CW rotation', () => {
      const scope: BronchoscopeState = {
        depthCm: 28,
        tipDeflectionDeg: 90,
        shaftRotationDeg: 60,
        activeTool: 'NONE',
        suctionActive: false,
        lightIntensityPct: 80,
        ebusModeActive: false,
        ebusBalloonSalineMl: 0,
        colorDopplerActive: false
      };

      const result = evaluateBronchoscopePosition(scope);
      expect(result.currentLandmarkId).toBe('RUL_ORIFICE');
      expect(result.isViewCentered).toBe(true);
    });

    it('generates coaching tips when scope is misaligned from target', () => {
      const scope: BronchoscopeState = {
        depthCm: 20, // too shallow for carina
        tipDeflectionDeg: 40,
        shaftRotationDeg: 0,
        activeTool: 'NONE',
        suctionActive: false,
        lightIntensityPct: 80,
        ebusModeActive: false,
        ebusBalloonSalineMl: 0,
        colorDopplerActive: false
      };

      const result = evaluateBronchoscopePosition(scope);
      expect(result.coachingGuidance.length).toBeGreaterThan(0);
    });
  });

  describe('Clinical Presets', () => {
    it('models EBUS Subcarinal NSCLC staging with active ultrasound and needle tool', () => {
      const ebusPreset = BRONCHOSCOPY_PRESETS.find(p => p.id === 'ebus-subcarinal-nsclc-staging')!;
      expect(ebusPreset.initialScope.ebusModeActive).toBe(true);
      expect(ebusPreset.initialScope.activeTool).toBe('EBUS_TBNA_NEEDLE_22G');
      expect(ebusPreset.initialScope.colorDopplerActive).toBe(true);
    });

    it('models massive hemoptysis with balloon occlusion catheter', () => {
      const hemoPreset = BRONCHOSCOPY_PRESETS.find(p => p.id === 'massive-hemoptysis-rml')!;
      expect(hemoPreset.hemoptysisState?.bleedingSeverity).toBe('MASSIVE_EXSANGUINATING');
      expect(hemoPreset.initialScope.activeTool).toBe('BALLOON_OCCLUSION_CATHETER');
      expect(hemoPreset.initialScope.suctionActive).toBe(true);
    });

    it('models diagnostic BAL with marked lymphocytosis in Hypersensitivity Pneumonitis', () => {
      const balPreset = BRONCHOSCOPY_PRESETS.find(p => p.id === 'hypersensitivity-pneumonitis-bal')!;
      expect(balPreset.balState?.lymphocytePct).toBeGreaterThan(40);
      expect(balPreset.balState?.cd4ToCd8Ratio).toBeLessThan(1.0);
      expect(balPreset.balState?.recoveredSalineMl).toBeGreaterThanOrEqual(40);
    });
  });
});
