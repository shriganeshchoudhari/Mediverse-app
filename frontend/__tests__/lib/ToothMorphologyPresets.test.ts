import {
  TOOTH_PRESETS,
  PERMANENT_TEETH,
  PRIMARY_TEETH,
  getToothById,
  getToothByFDI,
} from '../../lib/dental/ToothMorphologyPresets';

describe('ToothMorphologyPresets', () => {
  it('TOOTH_PRESETS array exists and has >= 20 entries', () => {
    expect(TOOTH_PRESETS).toBeDefined();
    expect(TOOTH_PRESETS.length).toBeGreaterThanOrEqual(20);
  });

  it('Every preset has id, name, fdiNotation, usNotation, type, arch, position', () => {
    TOOTH_PRESETS.forEach(tooth => {
      expect(tooth.id).toBeDefined();
      expect(tooth.name).toBeDefined();
      expect(tooth.fdiNotation).toBeDefined();
      expect(tooth.usNotation).toBeDefined();
      expect(tooth.type).toBeDefined();
      expect(tooth.arch).toBeDefined();
      expect(tooth.position).toBeDefined();
    });
  });

  it('Every permanent tooth has rootCount >= 1 and canalCount >= 1', () => {
    PERMANENT_TEETH.forEach(tooth => {
      expect(tooth.rootCount).toBeGreaterThanOrEqual(1);
      expect(tooth.canalCount).toBeGreaterThanOrEqual(1);
    });
  });

  it('Every preset has crownHeightMm > 0 and rootLengthMm > 0', () => {
    TOOTH_PRESETS.forEach(tooth => {
      expect(tooth.crownHeightMm).toBeGreaterThan(0);
      expect(tooth.rootLengthMm).toBeGreaterThan(0);
    });
  });

  it('Every preset has a non-empty clinicalPearl', () => {
    TOOTH_PRESETS.forEach(tooth => {
      expect(typeof tooth.clinicalPearl).toBe('string');
      expect(tooth.clinicalPearl.length).toBeGreaterThan(0);
    });
  });

  it('getToothById returns correct tooth for a known ID', () => {
    const tooth = getToothById('UR6');
    expect(tooth).toBeDefined();
    expect(tooth?.name).toContain('First Molar');
  });

  it('getToothByFDI returns correct tooth for a known FDI code', () => {
    const tooth = getToothByFDI('16');
    expect(tooth).toBeDefined();
    expect(tooth?.id).toBe('UR6');
  });

  it('PERMANENT_TEETH array contains only type="permanent" entries', () => {
    PERMANENT_TEETH.forEach(tooth => {
      expect(tooth.type).toBe('permanent');
    });
  });

  it('PRIMARY_TEETH array contains only type="primary" entries', () => {
    PRIMARY_TEETH.forEach(tooth => {
      expect(tooth.type).toBe('primary');
    });
  });

  it('No duplicate IDs in TOOTH_PRESETS', () => {
    const ids = TOOTH_PRESETS.map(t => t.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('No duplicate FDI notations among permanent teeth', () => {
    const fdis = PERMANENT_TEETH.map(t => t.fdiNotation);
    const uniqueFdis = new Set(fdis);
    expect(uniqueFdis.size).toBe(fdis.length);
  });

  it('UR6 (upper right first molar) has rootCount = 3 (most important clinical fact)', () => {
    const ur6 = getToothById('UR6');
    expect(ur6?.rootCount).toBe(3);
  });

  it('Mandibular first molar (LR6) has rootCount = 2', () => {
    const lr6 = getToothById('LR6');
    expect(lr6?.rootCount).toBe(2);
  });

  it('Maxillary canine (UR3) has the greatest workingLengthAvgMm among anterior teeth', () => {
    const ur3 = getToothById('UR3');
    const anteriorTeeth = PERMANENT_TEETH.filter(t => 
      t.position === 'central_incisor' || 
      t.position === 'lateral_incisor' || 
      t.position === 'canine'
    );
    const maxWorkingLength = Math.max(...anteriorTeeth.map(t => t.workingLengthAvgMm));
    expect(ur3?.workingLengthAvgMm).toBe(maxWorkingLength);
  });
});
