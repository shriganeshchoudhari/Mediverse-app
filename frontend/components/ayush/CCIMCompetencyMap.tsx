'use client';

import React, { useState } from 'react';
import styles from './CCIMCompetencyMap.module.css';

interface Competency {
  id: string;
  subject: string;
  description: string;
  millerLevel: 'KNOWS' | 'KNOWS_HOW' | 'SHOWS_HOW' | 'PERFORMS';
  integrations: string[];
}

const mockCompetencies: Competency[] = [
  { id: 'C1', subject: 'Kayachikitsa', description: 'Diagnose common fevers', millerLevel: 'SHOWS_HOW', integrations: ['Pathology'] },
  { id: 'C2', subject: 'Shalya Tantra', description: 'Perform minor excisions', millerLevel: 'PERFORMS', integrations: ['Anatomy'] },
  { id: 'C3', subject: 'Dravyaguna', description: 'Identify medicinal plants', millerLevel: 'KNOWS_HOW', integrations: ['Botany'] },
];

export default function CCIMCompetencyMap() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('ALL');

  const filtered = mockCompetencies.filter(c => {
    const matchesSearch = c.description.toLowerCase().includes(searchTerm.toLowerCase()) || c.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === 'ALL' || c.millerLevel === filterLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <input 
          type="text" 
          placeholder="Search competencies..." 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)} className={styles.selectInput}>
          <option value="ALL">All Levels</option>
          <option value="KNOWS">Knows</option>
          <option value="KNOWS_HOW">Knows How</option>
          <option value="SHOWS_HOW">Shows How</option>
          <option value="PERFORMS">Performs</option>
        </select>
      </div>

      <div className={styles.grid}>
        {filtered.map(comp => (
          <div key={comp.id} className={styles.card}>
            <div className={styles.header}>
              <span className={styles.subject}>{comp.subject}</span>
              <span className={`${styles.badge} ${styles[comp.millerLevel]}`}>{comp.millerLevel.replace('_', ' ')}</span>
            </div>
            <p className={styles.description}>{comp.description}</p>
            <div className={styles.integrations}>
              {comp.integrations.map(int => (
                <span key={int} className={styles.integrationBadge}>{int}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
