import {
  saveSubjectToOffline,
  getOfflineSubject,
  saveLessonToOffline,
  getOfflineLesson,
  CachedSubjectTree,
  CachedLesson
} from '../../lib/offline/offlineCurriculumStore';

describe('offlineCurriculumStore', () => {
  it('exports core offline caching functions', () => {
    expect(typeof saveSubjectToOffline).toBe('function');
    expect(typeof getOfflineSubject).toBe('function');
    expect(typeof saveLessonToOffline).toBe('function');
    expect(typeof getOfflineLesson).toBe('function');
  });

  it('gracefully handles missing IndexedDB environment in Node/Jest without crashing', async () => {
    const mockSubject: CachedSubjectTree = {
      subjectId: 'sub-101',
      code: 'PHYS-101',
      title: 'Human Physiology',
      domain: 'ALLOPATHIC',
      treeData: { units: [] },
      cachedAt: Date.now()
    };

    // In jsdom without fake-indexeddb, should catch gracefully and return null or void
    await expect(saveSubjectToOffline(mockSubject)).resolves.not.toThrow();
    const result = await getOfflineSubject('PHYS-101');
    expect(result).toBeNull();
  });
});
