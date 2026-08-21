import {
  MARMA_POINTS_REGISTRY,
  MARMA_PROGNOSIS_META,
  TOTAL_MARMA_COUNT,
  getMarmaById,
  getMarmasByPrognosis,
  getMarmasByRegion,
} from '../../lib/ayush/MarmaPresets';

describe('MarmaPresets Registry', () => {
  it('should define total count metadata as 107', () => {
    expect(TOTAL_MARMA_COUNT).toBe(107);
    expect(MARMA_POINTS_REGISTRY.length).toBeGreaterThan(15);
  });

  it('should define all 5 classical prognosis classes', () => {
    expect(MARMA_PROGNOSIS_META.sadya_pranahara).toBeDefined();
    expect(MARMA_PROGNOSIS_META.kalantara_pranahara).toBeDefined();
    expect(MARMA_PROGNOSIS_META.vishalyaghna).toBeDefined();
    expect(MARMA_PROGNOSIS_META.vaikalyakara).toBeDefined();
    expect(MARMA_PROGNOSIS_META.rujakara).toBeDefined();
  });

  it('should retrieve vital points with modern neurovascular correlates', () => {
    const sthapani = getMarmaById('sthapani');
    expect(sthapani).toBeDefined();
    expect(sthapani?.sanskritName).toBe('स्थपनी');
    expect(sthapani?.prognosis).toBe('vishalyaghna');
    expect(sthapani?.modernAnatomyCorrelate).toContain('Nasion');

    const hridaya = getMarmaById('hridaya');
    expect(hridaya).toBeDefined();
    expect(hridaya?.prognosis).toBe('sadya_pranahara');
    expect(hridaya?.modernAnatomyCorrelate).toContain('Pericardium');
  });

  it('should filter points by prognosis and region', () => {
    const sadyaPoints = getMarmasByPrognosis('sadya_pranahara');
    expect(sadyaPoints.length).toBeGreaterThan(0);
    expect(sadyaPoints.every((p) => p.prognosis === 'sadya_pranahara')).toBe(true);

    const headPoints = getMarmasByRegion('head_neck');
    expect(headPoints.length).toBeGreaterThan(0);
    expect(headPoints.every((p) => p.region === 'head_neck')).toBe(true);
  });

  it('should return undefined for invalid id', () => {
    expect(getMarmaById('unknown-point')).toBeUndefined();
  });
});
