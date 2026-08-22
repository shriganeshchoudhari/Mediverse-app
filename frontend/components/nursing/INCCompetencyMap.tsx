'use client';

import React, { useState } from 'react';
import styles from './INCCompetencyMap.module.css';

interface Props {
  className?: string;
}

export function INCCompetencyMap({ className }: Props) {
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('ALL');
  const [millerFilter, setMillerFilter] = useState('ALL');

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.header}>
        <h3>INC Competency Map</h3>
        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Search competencies..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)}>
            <option value="ALL">All Subjects</option>
            <option value="MSN">Medical-Surgical</option>
            <option value="FND">Foundations</option>
          </select>
          <select value={millerFilter} onChange={e => setMillerFilter(e.target.value)}>
            <option value="ALL">All Levels</option>
            <option value="KNOWS">KNOWS</option>
            <option value="KNOWS_HOW">KNOWS HOW</option>
            <option value="SHOWS_HOW">SHOWS HOW</option>
            <option value="PERFORMS">PERFORMS</option>
          </select>
        </div>
      </div>
      <div className={styles.grid}>
        <div className={styles.competencyCard}>
          <span className={styles.badge}>PERFORMS</span>
          <h4>INC-MSN-01: Wound Care</h4>
          <p>Demonstrates aseptic technique in wound dressing.</p>
        </div>
        <div className={styles.competencyCard}>
          <span className={styles.badge}>SHOWS_HOW</span>
          <h4>INC-FND-02: Vital Signs</h4>
          <p>Accurately measures and records vital signs.</p>
        </div>
      </div>
    </div>
  );
}
