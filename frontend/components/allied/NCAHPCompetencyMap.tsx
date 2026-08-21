import React, { useState } from 'react';
import styles from './NCAHPCompetencyMap.module.css';
import { ALLIED_HEALTH_MAJORS } from '../../lib/curriculum/alliedHealthCurriculumScaffold';

type MillerLevel = 'KNOWS' | 'KNOWS_HOW' | 'SHOWS_HOW' | 'PERFORMS';

export const NCAHPCompetencyMap: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedMajor, setSelectedMajor] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<MillerLevel | 'all'>('all');

  const filteredMajors = ALLIED_HEALTH_MAJORS.filter(major => 
    selectedMajor === 'all' || major.code === selectedMajor
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>NCAHP Competency Map</h2>
        <div className={styles.filters}>
          <input 
            type="text" 
            placeholder="Search competencies..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
          <select 
            value={selectedMajor} 
            onChange={(e) => setSelectedMajor(e.target.value)}
            className={styles.selectFilter}
          >
            <option value="all">All Majors</option>
            {ALLIED_HEALTH_MAJORS.map(m => (
              <option key={m.code} value={m.code}>{m.name}</option>
            ))}
          </select>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value as any)}
            className={styles.selectFilter}
          >
            <option value="all">All Miller Levels</option>
            <option value="KNOWS">Knows</option>
            <option value="KNOWS_HOW">Knows How</option>
            <option value="SHOWS_HOW">Shows How</option>
            <option value="PERFORMS">Performs</option>
          </select>
        </div>
      </div>
      <div className={styles.grid}>
        {filteredMajors.map(major => (
          <div key={major.id} className={styles.majorSection}>
            <h3>{major.name}</h3>
            {major.subjects.map(sub => (
              <div key={sub.id} className={styles.subjectCard}>
                <h4>{sub.name}</h4>
                <ul className={styles.lessonList}>
                  {sub.lessons.filter(l => l.title.toLowerCase().includes(search.toLowerCase())).map(lesson => (
                    <li key={lesson.id} className={styles.lessonItem}>
                      <span className={styles.codeBadge}>{lesson.ncahpCode}</span>
                      <span className={styles.lessonTitle}>{lesson.title}</span>
                      {lesson.hasSimulation && <span className={styles.simBadge}>SIM</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
