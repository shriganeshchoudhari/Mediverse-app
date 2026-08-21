import React, { useState } from 'react';
import styles from './PublicHealthCompetencyMap.module.css';

type MillerLevel = 'KNOWS' | 'KNOWS_HOW' | 'SHOWS_HOW' | 'PERFORMS';

export const PublicHealthCompetencyMap: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [programFilter, setProgramFilter] = useState<'ALL' | 'MPH' | 'MHA'>('ALL');
  const [millerLevelFilter, setMillerLevelFilter] = useState<'ALL' | MillerLevel>('ALL');

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <input 
          type="text" 
          placeholder="Search competencies..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className={styles.search}
        />
        <select value={programFilter} onChange={(e) => setProgramFilter(e.target.value as any)} className={styles.select}>
          <option value="ALL">All Programs</option>
          <option value="MPH">MPH</option>
          <option value="MHA">MHA</option>
        </select>
        <select value={millerLevelFilter} onChange={(e) => setMillerLevelFilter(e.target.value as any)} className={styles.select}>
          <option value="ALL">All Miller Levels</option>
          <option value="KNOWS">KNOWS</option>
          <option value="KNOWS_HOW">KNOWS HOW</option>
          <option value="SHOWS_HOW">SHOWS HOW</option>
          <option value="PERFORMS">PERFORMS</option>
        </select>
      </div>
      <div className={styles.matrix}>
        {/* Placeholder for competency matrix */}
        <p>Interactive competency matrix content goes here. (Filters applied: {searchTerm}, {programFilter}, {millerLevelFilter})</p>
      </div>
    </div>
  );
};
