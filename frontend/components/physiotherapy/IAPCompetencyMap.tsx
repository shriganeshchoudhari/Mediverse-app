'use client';

import React, { useState } from 'react';
import styles from './IAPCompetencyMap.module.css';

interface CompetencyProps {
  // ... any needed props
}

export default function IAPCompetencyMap(props: CompetencyProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('ALL');

  return (
    <div className={styles.container}>
      <h2>IAP Competency Map</h2>
      <div className={styles.filters}>
        <input 
          type="text" 
          placeholder="Search competencies..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className={styles.search}
        />
        <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} className={styles.select}>
          <option value="ALL">All Levels</option>
          <option value="KNOWS">KNOWS</option>
          <option value="KNOWS_HOW">KNOWS HOW</option>
          <option value="SHOWS_HOW">SHOWS HOW</option>
          <option value="PERFORMS">PERFORMS</option>
        </select>
      </div>
      <div className={styles.matrix}>
        {/* Placeholder for competency items */}
        <div className={styles.competencyItem}>
          <span className={styles.badge}>KNOWS</span>
          <p>Understands basic biomechanical principles.</p>
        </div>
      </div>
    </div>
  );
}
