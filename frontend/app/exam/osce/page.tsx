"use client";
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import OSCEStation from '@/components/exam/OSCEStation';

interface Station {
  id: string;
  title: string;
  domain: string;
  description: string;
  scenario_json: any;
  checklist_json: any;
  time_limit_minutes: number;
  passing_score_pct: number;
  difficulty: string;
}

const DOMAINS = ['ALLOPATHIC', 'NURSING', 'PHYSIOTHERAPY', 'DENTAL'];

export default function OSCEPage() {
  const [domain, setDomain] = useState('ALLOPATHIC');
  const [stations, setStations] = useState<Station[]>([]);
  const [activeStation, setActiveStation] = useState<Station | null>(null);

  // Mocking fetch behavior for now
  useEffect(() => {
    // In real app, fetch from `/api/v1/exam/osce/stations?domain=${domain}`
    const mockStations: Station[] = [
      {
        id: '1',
        title: 'Basic CPR',
        domain: 'ALLOPATHIC',
        description: 'Perform basic CPR on an adult mannequin.',
        scenario_json: { instructions: 'You are in the ER. A 50yo male collapses.' },
        checklist_json: [
          { id: 'c1', text: 'Check for responsiveness', marks: 2 },
          { id: 'c2', text: 'Call for help / activate EMS', marks: 2 },
          { id: 'c3', text: 'Check pulse for <10 seconds', marks: 2 },
          { id: 'c4', text: 'Start high-quality chest compressions', marks: 4 }
        ],
        time_limit_minutes: 5,
        passing_score_pct: 80,
        difficulty: 'Beginner'
      }
    ].filter(s => s.domain === domain);
    
    setStations(mockStations);
  }, [domain]);

  if (activeStation) {
    return (
      <div className={styles.pageContainer}>
        <button className={styles.backBtn} onClick={() => setActiveStation(null)}>
          ← Back to Stations
        </button>
        <OSCEStation station={activeStation} />
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>OSCE Simulator</h1>
        <p className={styles.subtitle}>Objective Structured Clinical Examination</p>
      </header>

      <div className={styles.controls}>
        <label htmlFor="domain-select" className={styles.label}>Domain:</label>
        <select
          id="domain-select"
          className={styles.select}
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        >
          {DOMAINS.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div className={styles.grid}>
        {stations.map(station => (
          <div key={station.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.badgeDomain}>{station.domain}</span>
              <span className={styles.badgeDifficulty}>{station.difficulty}</span>
            </div>
            <h2 className={styles.cardTitle}>{station.title}</h2>
            <p className={styles.cardDesc}>{station.description}</p>
            <div className={styles.cardMeta}>
              <span>⏱️ {station.time_limit_minutes} min</span>
              <span>🎯 Pass: {station.passing_score_pct}%</span>
            </div>
            <button
              className={styles.startBtn}
              onClick={() => setActiveStation(station)}
            >
              Start Station
            </button>
          </div>
        ))}
        {stations.length === 0 && (
          <p className={styles.empty}>No stations available for this domain.</p>
        )}
      </div>
    </div>
  );
}
