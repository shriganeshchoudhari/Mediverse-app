'use client';
import React, { useState, useMemo } from 'react';
import styles from './TMJBiomechanicsViewer.module.css';

interface TMJProps {
  showTMDClassifier?: boolean;
}

export default function TMJBiomechanicsViewer({ showTMDClassifier = true }: TMJProps) {
  const [openingMm, setOpeningMm] = useState(35);
  const [protrusionMm, setProtrusionMm] = useState(0);
  const [lateralExcursionMm, setLateralExcursionMm] = useState(0);
  const [discPosition, setDiscPosition] = useState<'normal' | 'adr' | 'adwr'>('normal');
  const [showClicking, setShowClicking] = useState(false);

  // Compute piper class based on state
  const piperClass = useMemo(() => {
    if (discPosition === 'normal') return 'Class I';
    if (discPosition === 'adr') return 'Class IVa';
    if (discPosition === 'adwr') return 'Class IVb';
    return 'Unknown';
  }, [discPosition]);

  // Derived transforms for visualization
  const condyleX = 250 + (protrusionMm * 2) + (openingMm * 0.5);
  const condyleY = 200 + (openingMm * 1.5);
  const rotation = openingMm * 0.8;

  const discX = condyleX + (discPosition === 'normal' ? 0 : (discPosition === 'adr' ? -15 : -30));
  const discY = condyleY - 20;

  return (
    <div className={styles.container}>
      {/* Left panel: SVG canvas */}
      <div className={styles.canvasPanel}>
        <svg viewBox="0 0 450 500" className={styles.svg}>
          <rect width="450" height="500" fill="#1e293b" />
          
          {/* Static Anatomy: Fossa, Eminence */}
          <path d="M 100 200 C 150 150, 200 150, 250 200 C 300 250, 350 250, 400 220" fill="none" stroke="#e2e8f0" strokeWidth="8" />
          <text x="120" y="160" fill="#94a3b8" fontSize="14">Glenoid Fossa</text>
          <text x="320" y="220" fill="#94a3b8" fontSize="14">Articular Eminence</text>
          
          {/* Path trace */}
          <path d="M 250 200 Q 280 250, 330 260" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />

          {/* Condyle and Ramus Group */}
          <g transform={`translate(${condyleX}, ${condyleY}) rotate(${rotation})`}>
            {/* Ramus */}
            <path d="M -20 0 L -40 200 L 40 200 L 20 0 Z" fill="#cbd5e1" opacity="0.8" />
            {/* Condyle head */}
            <circle cx="0" cy="0" r="25" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
          </g>

          {/* Articular Disc */}
          <ellipse 
            cx={discX} 
            cy={discY} 
            rx="30" 
            ry="10" 
            fill={discPosition === 'normal' ? "#60a5fa" : "#ef4444"} 
            opacity="0.8"
            transform={`rotate(${-10 + rotation*0.3}, ${discX}, ${discY})`}
          />

          {/* Excursion Arrow indicator */}
          {lateralExcursionMm !== 0 && (
             <g transform={`translate(50, 50)`}>
               <text fill="#fbbf24" fontSize="14">Excursion: {lateralExcursionMm}mm</text>
               <path d={lateralExcursionMm > 0 ? "M 150 0 L 170 10 L 150 20 Z" : "M 130 0 L 110 10 L 130 20 Z"} fill="#fbbf24" />
             </g>
          )}

          {/* Clicking visualization */}
          {showClicking && discPosition === 'adr' && openingMm > 20 && openingMm < 30 && (
             <circle cx={discX} cy={discY} r="40" fill="none" stroke="#fbbf24" strokeWidth="4" opacity="0.8" className={styles.pulse} />
          )}
        </svg>
      </div>

      {/* Right panel: Controls */}
      <div className={styles.controlsPanel}>
        <div className={styles.section}>
          <h3>Motion Parameters</h3>
          <div className={styles.controlGroup}>
            <label>Mouth Opening: {openingMm} mm</label>
            <input type="range" min="0" max="55" value={openingMm} onChange={e => setOpeningMm(Number(e.target.value))} className={styles.slider} />
          </div>
          <div className={styles.controlGroup}>
            <label>Protrusion: {protrusionMm} mm</label>
            <input type="range" min="0" max="12" value={protrusionMm} onChange={e => setProtrusionMm(Number(e.target.value))} className={styles.slider} />
          </div>
          <div className={styles.controlGroup}>
            <label>Lateral Excursion: {lateralExcursionMm} mm</label>
            <input type="range" min="-12" max="12" value={lateralExcursionMm} onChange={e => setLateralExcursionMm(Number(e.target.value))} className={styles.slider} />
          </div>
        </div>

        <div className={styles.section}>
          <h3>Disc Position</h3>
          <div className={styles.radioGroup}>
            <label>
              <input type="radio" checked={discPosition === 'normal'} onChange={() => setDiscPosition('normal')} />
              Normal
            </label>
            <label>
              <input type="radio" checked={discPosition === 'adr'} onChange={() => setDiscPosition('adr')} />
              Anterior Displacement w/ Reduction (ADR)
            </label>
            <label>
              <input type="radio" checked={discPosition === 'adwr'} onChange={() => setDiscPosition('adwr')} />
              Anterior Displacement w/o Reduction (ADWR)
            </label>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
            <input type="checkbox" checked={showClicking} onChange={e => setShowClicking(e.target.checked)} />
            Show Clicking Animation
          </label>
        </div>

        {showTMDClassifier && (
          <div className={styles.section}>
            <h3>TMD Classification</h3>
            <div className={styles.badge}>{piperClass}</div>
            
            <div className={styles.findingsBox}>
              <h4>Clinical Findings</h4>
              <ul>
                <li>{discPosition === 'normal' ? 'Smooth translation' : (discPosition === 'adr' ? 'Joint clicking on opening/closing' : 'Crepitus or limited opening')}</li>
                {openingMm < 40 && <li>Restricted opening (Trismus)</li>}
                {lateralExcursionMm !== 0 && <li>Deviation on opening</li>}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
