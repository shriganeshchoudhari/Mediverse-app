import React, { useState } from 'react';
import styles from './VCICompetencyMap.module.css';
import { BVSC_CURRICULUM } from '../../lib/curriculum/bvscCurriculumScaffold';

type MillerLevel = 'KNOWS' | 'KNOWS_HOW' | 'SHOWS_HOW' | 'PERFORMS';

interface Competency {
  id: string;
  code: string;
  description: string;
  subject: string;
  level: MillerLevel;
  integrated: boolean;
}

// Sample competencies
const MOCK_COMPETENCIES: Competency[] = [
  { id: '1', code: 'VAN-101.1', description: 'Describe the osteology of the forelimb.', subject: 'VET-VAN', level: 'KNOWS', integrated: false },
  { id: '2', code: 'VPY-101.2', description: 'Demonstrate rumen fluid examination.', subject: 'VET-VPY', level: 'SHOWS_HOW', integrated: true },
  { id: '3', code: 'VSR-401.1', description: 'Perform endotracheal intubation in dogs.', subject: 'VET-VSR', level: 'PERFORMS', integrated: true },
  { id: '4', code: 'VCM-401.3', description: 'Interpret blood gas analysis in metabolic disorders.', subject: 'VET-VCM', level: 'KNOWS_HOW', integrated: false },
];

export function VCICompetencyMap() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<MillerLevel | ''>('');

  const filteredCompetencies = MOCK_COMPETENCIES.filter(comp => {
    const matchesSearch = comp.description.toLowerCase().includes(searchTerm.toLowerCase()) || comp.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject ? comp.subject === selectedSubject : true;
    const matchesLevel = selectedLevel ? comp.level === selectedLevel : true;
    return matchesSearch && matchesSubject && matchesLevel;
  });

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>VCI Competency Map</h2>
      <div className={styles.filters}>
        <input 
          type="text" 
          placeholder="Search competencies..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.input}
        />
        <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className={styles.select}>
          <option value="">All Subjects</option>
          {BVSC_CURRICULUM.flatMap(year => year.subjects).map(sub => (
            <option key={sub.id} value={sub.id}>{sub.name}</option>
          ))}
        </select>
        <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value as MillerLevel | '')} className={styles.select}>
          <option value="">All Miller Levels</option>
          <option value="KNOWS">KNOWS (Knowledge)</option>
          <option value="KNOWS_HOW">KNOWS HOW (Application)</option>
          <option value="SHOWS_HOW">SHOWS HOW (Demonstration)</option>
          <option value="PERFORMS">PERFORMS (Action)</option>
        </select>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>VCI Code</th>
              <th>Competency Description</th>
              <th>Miller Level</th>
              <th>Integration</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompetencies.map(comp => (
              <tr key={comp.id}>
                <td className={styles.codeCell}>{comp.code}</td>
                <td>{comp.description}</td>
                <td>
                  <span className={`${styles.badge} ${styles[comp.level.toLowerCase()]}`}>
                    {comp.level.replace('_', ' ')}
                  </span>
                </td>
                <td>
                  {comp.integrated ? (
                    <span className={styles.integrationBadge}>Integrated</span>
                  ) : (
                    <span className={styles.noneBadge}>None</span>
                  )}
                </td>
              </tr>
            ))}
            {filteredCompetencies.length === 0 && (
              <tr>
                <td colSpan={4} className={styles.noResults}>No competencies found matching your criteria.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
