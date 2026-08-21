'use client';

import React, { useState } from 'react';
import styles from './PanchakarmaProcedureViewer.module.css';
import { PANCHAKARMA_THERAPIES, SAMSARJANA_KRAMA_SCHEDULE } from '@/lib/ayush/PanchakarmaPresets';

export default function PanchakarmaProcedureViewer() {
  const [selectedTherapy, setSelectedTherapy] = useState(PANCHAKARMA_THERAPIES[0].id);
  const [activeStage, setActiveStage] = useState<'Purvakarma' | 'Pradhanakarma' | 'Paschatkarma'>('Purvakarma');
  const [gheeDose, setGheeDose] = useState(30);
  const [vegiCount, setVegiCount] = useState(0);

  const currentTherapy = PANCHAKARMA_THERAPIES.find(t => t.id === selectedTherapy);

  const getShuddhiLevel = () => {
    if (vegiCount === 0) return 'None';
    if (vegiCount <= 4) return 'Hina (Mild)';
    if (vegiCount <= 6) return 'Madhyama (Moderate)';
    return 'Pravara (Maximum)';
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Panchakarma Protocol Explorer</h2>
      
      {/* Therapy Selector */}
      <div className={styles.selector}>
        {PANCHAKARMA_THERAPIES.map(therapy => (
          <button 
            key={therapy.id}
            className={`${styles.therapyBtn} ${selectedTherapy === therapy.id ? styles.activeTherapy : ''}`}
            onClick={() => setSelectedTherapy(therapy.id)}
          >
            {therapy.name}
          </button>
        ))}
      </div>

      {currentTherapy && (
        <div className={styles.descriptionCard}>
          <h3>{currentTherapy.name}</h3>
          <p>{currentTherapy.description}</p>
        </div>
      )}

      {/* Stage Navigator */}
      <div className={styles.stageNavigator}>
        <button className={`${styles.stageBtn} ${activeStage === 'Purvakarma' ? styles.activeStage : ''}`} onClick={() => setActiveStage('Purvakarma')}>1. Purvakarma</button>
        <button className={`${styles.stageBtn} ${activeStage === 'Pradhanakarma' ? styles.activeStage : ''}`} onClick={() => setActiveStage('Pradhanakarma')}>2. Pradhanakarma</button>
        <button className={`${styles.stageBtn} ${activeStage === 'Paschatkarma' ? styles.activeStage : ''}`} onClick={() => setActiveStage('Paschatkarma')}>3. Paschatkarma</button>
      </div>

      <div className={styles.stageContent}>
        {activeStage === 'Purvakarma' && (
          <div className={styles.panel}>
            <h3>Snehapana (Oleation) Titration Curve</h3>
            <p>Administer medicated ghee in increasing doses to detach toxins.</p>
            <div className={styles.sliderGroup}>
              <label>Ghee Dosage (Day 1-7): {gheeDose} ml</label>
              <input 
                type="range" 
                min="30" max="150" step="10" 
                value={gheeDose} 
                onChange={(e) => setGheeDose(Number(e.target.value))} 
                className={styles.slider} 
              />
            </div>
            <div className={styles.chartArea}>
              {/* Simple CSS Chart Representation */}
              <div className={styles.barChart}>
                {[1, 2, 3, 4, 5, 6, 7].map(day => {
                  const val = Math.min(150, 30 + (day - 1) * ((gheeDose - 30) / 6 || 10));
                  return (
                    <div key={day} className={styles.barCol}>
                      <div className={styles.barFill} style={{ height: `${(val / 150) * 100}%` }}></div>
                      <span>D{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={styles.alertBox}>
              <strong>Samyak Snigdha Lakshana:</strong> Vatanulomana (downward wind), Dipta Agni (good appetite).
            </div>
          </div>
        )}

        {activeStage === 'Pradhanakarma' && (
          <div className={styles.panel}>
            <h3>Main Procedure: {currentTherapy?.name}</h3>
            <div className={styles.checklist}>
              <label><input type="checkbox" /> Vitals stable (BP, HR checked)</label>
              <label><input type="checkbox" /> Patient positioned correctly</label>
              <label><input type="checkbox" /> Medicine administered</label>
            </div>
            
            <div className={styles.monitorCard}>
              <h4>Evacuation Monitor (Vegi)</h4>
              <div className={styles.counterGroup}>
                <button onClick={() => setVegiCount(Math.max(0, vegiCount - 1))}>-</button>
                <span className={styles.count}>{vegiCount}</span>
                <button onClick={() => setVegiCount(vegiCount + 1)}>+</button>
              </div>
              <p>Shuddhi Level: <strong>{getShuddhiLevel()}</strong></p>
            </div>

            <div className={styles.complications}>
              <h4>Complications (Ayoga & Atiyoga)</h4>
              <p><strong>Ayoga (Deficit):</strong> Bloating, salivation. Manage with hot water, light fasting.</p>
              <p><strong>Atiyoga (Excess):</strong> Fainting, bleeding. Emergency: Stop procedure, give cooling astringents.</p>
            </div>
          </div>
        )}

        {activeStage === 'Paschatkarma' && (
          <div className={styles.panel}>
            <h3>Samsarjana Krama (Dietary Timeline)</h3>
            <p>Gradual restoration of digestive fire post-purification.</p>
            <div className={styles.timeline}>
              {SAMSARJANA_KRAMA_SCHEDULE.map(item => (
                <div key={item.day} className={styles.timelineItem}>
                  <div className={styles.timelineMarker}></div>
                  <div className={styles.timelineContent}>
                    <h4>Day {item.day}: {item.meal}</h4>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
