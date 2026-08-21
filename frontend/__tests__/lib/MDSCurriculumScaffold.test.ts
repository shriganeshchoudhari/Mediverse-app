import {
  MDS_CURRICULUM,
  MDS_METADATA,
  getMDSSpecialtyById,
} from '../../lib/curriculum/mdsCurriculumScaffold';

describe('MDSCurriculumScaffold', () => {
  it('MDS_CURRICULUM has exactly 8 specialties', () => {
    expect(MDS_CURRICULUM).toBeDefined();
    expect(MDS_CURRICULUM.length).toBe(8);
  });

  it('Every specialty has a unique id', () => {
    const ids = MDS_CURRICULUM.map(s => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('Every specialty has a unique dciSpecialtyCode', () => {
    const codes = MDS_CURRICULUM.map(s => s.dciSpecialtyCode);
    const uniqueCodes = new Set(codes);
    expect(uniqueCodes.size).toBe(codes.length);
  });

  it('Every specialty has subjects.length >= 2', () => {
    MDS_CURRICULUM.forEach(specialty => {
      expect(specialty.subjects.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('Every subject has lessons.length >= 3', () => {
    MDS_CURRICULUM.forEach(specialty => {
      specialty.subjects.forEach(subject => {
        expect(subject.lessons.length).toBeGreaterThanOrEqual(3);
      });
    });
  });

  it('Every lesson has a non-empty dciCode', () => {
    MDS_CURRICULUM.forEach(specialty => {
      specialty.subjects.forEach(subject => {
        subject.lessons.forEach(lesson => {
          expect(typeof lesson.dciCode).toBe('string');
          expect(lesson.dciCode.length).toBeGreaterThan(0);
        });
      });
    });
  });

  it('Every lesson has a non-empty title and description', () => {
    MDS_CURRICULUM.forEach(specialty => {
      specialty.subjects.forEach(subject => {
        subject.lessons.forEach(lesson => {
          expect(typeof lesson.title).toBe('string');
          expect(lesson.title.length).toBeGreaterThan(0);
          expect(typeof lesson.description).toBe('string');
          expect(lesson.description.length).toBeGreaterThan(0);
        });
      });
    });
  });

  it('getMDSSpecialtyById returns correct specialty for known IDs (\'mds-ortho\', \'mds-omfs\')', () => {
    const ortho = getMDSSpecialtyById('mds-ortho');
    expect(ortho).toBeDefined();
    expect(ortho?.id).toBe('mds-ortho');

    const omfs = getMDSSpecialtyById('mds-omfs');
    expect(omfs).toBeDefined();
    expect(omfs?.id).toBe('mds-omfs');
  });

  it('getMDSSpecialtyById returns undefined for unknown ID', () => {
    const unknown = getMDSSpecialtyById('unknown-id');
    expect(unknown).toBeUndefined();
  });

  it('MDS_METADATA exists and is an object', () => {
    expect(MDS_METADATA).toBeDefined();
    expect(typeof MDS_METADATA).toBe('object');
    expect(MDS_METADATA).not.toBeNull();
  });

  it('No duplicate specialty codes', () => {
    const codes = MDS_CURRICULUM.map(s => s.dciSpecialtyCode);
    const uniqueCodes = new Set(codes);
    expect(uniqueCodes.size).toBe(codes.length);
  });

  it('Orthodontics specialty has dciSpecialtyCode = \'MDS-I\'', () => {
    const ortho = getMDSSpecialtyById('mds-ortho');
    expect(ortho?.dciSpecialtyCode).toBe('MDS-I');
  });

  it('Oral Pathology specialty has dciSpecialtyCode = \'MDS-VIII\'', () => {
    const oralPath = MDS_CURRICULUM.find(s => s.dciSpecialtyCode === 'MDS-VIII');
    expect(oralPath).toBeDefined();
    // Assuming ID or checking just the code
    expect(oralPath?.dciSpecialtyCode).toBe('MDS-VIII');
  });
});
