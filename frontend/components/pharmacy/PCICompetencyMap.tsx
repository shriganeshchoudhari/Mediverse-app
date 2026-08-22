'use client';

import React, { useState } from 'react';
import styles from './PCICompetencyMap.module.css';

interface Competency {
  id: string;
  code: string;
  description: string;
  subject: string;
  millerLevel: 'KNOWS' | 'KNOWS_HOW' | 'SHOWS_HOW' | 'PERFORMS';
}

const SAMPLE_COMPETENCIES: Competency[] = [
  { id: '1', code: 'PCI-PH-1.1', description: 'Describe pharmacokinetic models', subject: 'Pharmacokinetics', millerLevel: 'KNOWS' },
  { id: '2', code: 'PCI-PH-2.1', description: 'Calculate loading doses', subject: 'Clinical Pharmacy', millerLevel: 'KNOWS_HOW' },
  { id: '3', code: 'PCI-PH-3.1', description: 'Perform TDM in simulated patient', subject: 'TDM', millerLevel: 'SHOWS_HOW' },
  { id: '4', code: 'PCI-PH-4.1', description: 'Counsel patient on drug interactions', subject: 'Pharmacy Practice', millerLevel: 'PERFORMS' },
];

export function PCICompetencyMap() {
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');

  const filtered = SAMPLE_COMPETENCIES.filter(c => {
    if (levelFilter !== 'ALL' && c.millerLevel !== levelFilter) return false;
    if (search && !c.description.toLowerCase().includes(search.toLowerCase()) && !c.code.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <input type="text" placeholder="Search competencies..." value={search} onChange={e => setSearch(e.target.value)} className={styles.search} />
        <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)} className={styles.select}>
          <option value="ALL">All Levels</option>
          <option value="KNOWS">KNOWS</option>
          <option value="KNOWS_HOW">KNOWS_HOW</option>
          <option value="SHOWS_HOW">SHOWS_HOW</option>
          <option value="PERFORMS">PERFORMS</option>
        </select>
      </div>
      <div className={styles.grid}>
        {filtered.map(c => (
          <div key={c.id} className={styles.card}>
            <div className={styles.badge}>{c.millerLevel}</div>
            <div className={styles.code}>{c.code}</div>
            <div className={styles.desc}>{c.description}</div>
            <div className={styles.subject}>{c.subject}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
