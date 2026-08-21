'use client';

import React, { useState, useMemo } from 'react';
import styles from './DCICompetencyMap.module.css';

interface Competency {
  code: string;
  subjectCode: string;
  domain: string;
  title: string;
  competencyLevel: 'KNOWS' | 'KNOWS_HOW' | 'SHOWS_HOW' | 'PERFORMS';
  verticalIntegration: string[];
  horizontalIntegration: string[];
}

const STATIC_COMPETENCIES: Competency[] = [
  { code: 'GA1.1', subjectCode: 'BDS-GA', domain: 'Head & Neck Osteology', title: 'Identify and describe skull bones, sutures, foramina, and cranial nerve exits on 3D model', competencyLevel: 'SHOWS_HOW', verticalIntegration: ['BDS-OS', 'BDS-OM'], horizontalIntegration: ['BDS-GP'] },
  { code: 'GA1.8', subjectCode: 'BDS-GA', domain: 'Trigeminal Nerve', title: 'Map branches of trigeminal nerve and identify target points for dental anesthesia', competencyLevel: 'SHOWS_HOW', verticalIntegration: ['BDS-OS'], horizontalIntegration: ['BDS-GP'] },
  { code: 'OS1.1', subjectCode: 'BDS-OS', domain: 'Local Anaesthesia', title: 'Administer IAN block, buccal infiltration, and lingual infiltration using correct landmarks', competencyLevel: 'PERFORMS', verticalIntegration: [], horizontalIntegration: ['BDS-GA', 'BDS-GP'] },
  { code: 'PE2.4', subjectCode: 'BDS-PE', domain: 'Periodontal Therapy', title: 'Perform supragingival and subgingival scaling using hand and ultrasonic instruments', competencyLevel: 'PERFORMS', verticalIntegration: [], horizontalIntegration: ['BDS-OP'] },
  { code: 'CD3.2', subjectCode: 'BDS-CD', domain: 'Endodontics', title: 'Demonstrate access cavity preparation and biomechanical preparation on anterior teeth', competencyLevel: 'SHOWS_HOW', verticalIntegration: [], horizontalIntegration: ['BDS-OM'] },
  { code: 'OM4.1', subjectCode: 'BDS-OM', domain: 'Radiology', title: 'Interpret intraoral periapical radiographs for caries and periodontal bone loss', competencyLevel: 'SHOWS_HOW', verticalIntegration: ['BDS-CD', 'BDS-PE'], horizontalIntegration: ['BDS-OP'] }
];

interface Props {
  subjectFilter?: string;
}

export default function DCICompetencyMap({ subjectFilter = '' }: Props) {
  const [filterSubject, setFilterSubject] = useState(subjectFilter);
  const [filterLevel, setFilterLevel] = useState<'' | 'KNOWS' | 'KNOWS_HOW' | 'SHOWS_HOW' | 'PERFORMS'>('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCompetencies = useMemo(() => {
    return STATIC_COMPETENCIES.filter(c => {
      const matchSubject = filterSubject ? c.subjectCode === filterSubject : true;
      const matchLevel = filterLevel ? c.competencyLevel === filterLevel : true;
      const matchQuery = searchQuery ? 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.code.toLowerCase().includes(searchQuery.toLowerCase()) : true;
      
      return matchSubject && matchLevel && matchQuery;
    });
  }, [filterSubject, filterLevel, searchQuery]);

  return (
    <div className={styles.container}>
      <div className={styles.filterBar}>
        <select 
          className={styles.select} 
          value={filterSubject} 
          onChange={(e) => setFilterSubject(e.target.value)}
        >
          <option value="">All Subjects</option>
          <option value="BDS-GA">BDS-GA (General Anatomy)</option>
          <option value="BDS-GP">BDS-GP (Physiology & Biochem)</option>
          <option value="BDS-OS">BDS-OS (Oral Surgery)</option>
          <option value="BDS-PE">BDS-PE (Periodontology)</option>
          <option value="BDS-CD">BDS-CD (Endodontics)</option>
          <option value="BDS-OM">BDS-OM (Oral Medicine)</option>
        </select>

        <input 
          type="text" 
          className={styles.input} 
          placeholder="Search competencies..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className={styles.levelPills}>
          <button className={`${styles.pill} ${styles.all} ${filterLevel === '' ? styles.active : ''}`} onClick={() => setFilterLevel('')}>All Levels</button>
          <button className={`${styles.pill} ${styles.KNOWS} ${filterLevel === 'KNOWS' ? styles.active : ''}`} onClick={() => setFilterLevel('KNOWS')}>KNOWS</button>
          <button className={`${styles.pill} ${styles.KNOWS_HOW} ${filterLevel === 'KNOWS_HOW' ? styles.active : ''}`} onClick={() => setFilterLevel('KNOWS_HOW')}>KNOWS_HOW</button>
          <button className={`${styles.pill} ${styles.SHOWS_HOW} ${filterLevel === 'SHOWS_HOW' ? styles.active : ''}`} onClick={() => setFilterLevel('SHOWS_HOW')}>SHOWS_HOW</button>
          <button className={`${styles.pill} ${styles.PERFORMS} ${filterLevel === 'PERFORMS' ? styles.active : ''}`} onClick={() => setFilterLevel('PERFORMS')}>PERFORMS</button>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>DCI Code</th>
              <th className={styles.th}>Subject</th>
              <th className={styles.th}>Domain</th>
              <th className={styles.th}>Competency Title</th>
              <th className={styles.th}>Miller Level</th>
              <th className={styles.th}>Integration</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompetencies.map(c => (
              <tr key={c.code}>
                <td className={styles.td}><strong>{c.code}</strong></td>
                <td className={styles.td}>{c.subjectCode}</td>
                <td className={styles.td}>{c.domain}</td>
                <td className={styles.td}>{c.title}</td>
                <td className={styles.td}>
                  <span className={`${styles.badge} ${styles[c.competencyLevel]}`}>
                    {c.competencyLevel.replace('_', ' ')}
                  </span>
                </td>
                <td className={styles.td}>
                  <div className={styles.integrationChips}>
                    {c.verticalIntegration.map(v => <span key={v} className={styles.chip} title="Vertical Integration">V: {v}</span>)}
                    {c.horizontalIntegration.map(h => <span key={h} className={styles.chip} title="Horizontal Integration">H: {h}</span>)}
                  </div>
                </td>
              </tr>
            ))}
            {filteredCompetencies.length === 0 && (
              <tr>
                <td colSpan={6} className={styles.td} style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                  No competencies found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.stats}>
        Showing {filteredCompetencies.length} of {STATIC_COMPETENCIES.length} competencies
      </div>
    </div>
  );
}
