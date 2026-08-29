'use client';

import React, { useState, useEffect } from 'react';
import styles from './DentalSpotterStation.module.css';

interface Landmark {
  id: string;
  name: string;
  code: string;
  x: number; // percentage coordinates 0-100
  y: number;
  definition: string;
  clinicalSignificance: string;
}

const CEPH_LANDMARKS: Landmark[] = [
  { id: 's', code: 'S', name: 'Sella', x: 42, y: 28, definition: 'Midpoint of the hypophyseal fossa (sella turcica) in sphenoid bone.', clinicalSignificance: 'Cranial base reference point for SNA and SNB angular analysis.' },
  { id: 'n', code: 'N', name: 'Nasion', x: 28, y: 26, definition: 'Most anterior point of the frontonasal suture in the midsagittal plane.', clinicalSignificance: 'Anterior limit of the anterior cranial base plane (S-N line).' },
  { id: 'a', code: 'A', name: 'Subspinale (Point A)', x: 27, y: 52, definition: 'Deepest midline concavity on the anterior border of the maxilla below ANS.', clinicalSignificance: 'Indicates the anteroposterior position of the apical base of the maxilla.' },
  { id: 'b', code: 'B', name: 'Supramentale (Point B)', x: 30, y: 70, definition: 'Deepest midline concavity on the anterior border of the mandibular symphysis.', clinicalSignificance: 'Indicates the anteroposterior position of the apical base of the mandible.' },
  { id: 'pog', code: 'Pog', name: 'Pogonion', x: 27, y: 80, definition: 'Most anterior midpoint of the bony chin profile.', clinicalSignificance: 'Used in facial plane and Holdaway soft tissue analysis.' },
  { id: 'gn', code: 'Gn', name: 'Gnathion', x: 29, y: 86, definition: 'Point located halfway between Pogonion and Menton on the contour of the chin.', clinicalSignificance: 'Intersection of the facial plane and mandibular plane.' },
  { id: 'go', code: 'Go', name: 'Gonion', x: 68, y: 72, definition: 'Midpoint at the junction of the posterior border of the ramus and lower border of the mandible.', clinicalSignificance: 'Posterior landmark of the mandibular plane (Go-Gn or Go-Me).' },
  { id: 'ans', code: 'ANS', name: 'Anterior Nasal Spine', x: 23, y: 48, definition: 'Tip of the sharp bony projection at the anterior margin of the nasal floor.', clinicalSignificance: 'Anterior landmark of the palatal plane (ANS-PNS).' },
  { id: 'pns', code: 'PNS', name: 'Posterior Nasal Spine', x: 55, y: 46, definition: 'Most posterior point at the sagittal midline of the hard palate.', clinicalSignificance: 'Posterior landmark of the palatal plane.' },
];

export default function DentalSpotterStation() {
  const [activeMode, setActiveMode] = useState<'study' | 'spotter'>('study');
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark>(CEPH_LANDMARKS[0]);
  
  // Spotter mode state
  const [spotterTarget, setSpotterTarget] = useState<Landmark | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [score, setScore] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);
  const [isSpotterActive, setIsSpotterActive] = useState<boolean>(false);

  useEffect(() => {
    let timer: any;
    if (isSpotterActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && isSpotterActive) {
      setIsSpotterActive(false);
    }
    return () => clearInterval(timer);
  }, [isSpotterActive, timeLeft]);

  const startSpotterTest = () => {
    setScore(0);
    setAttempts(0);
    setTimeLeft(60);
    setIsSpotterActive(true);
    pickRandomTarget();
  };

  const pickRandomTarget = () => {
    const random = CEPH_LANDMARKS[Math.floor(Math.random() * CEPH_LANDMARKS.length)];
    setSpotterTarget(random);
  };

  const handleLandmarkClick = (landmark: Landmark) => {
    if (activeMode === 'study') {
      setSelectedLandmark(landmark);
    } else if (isSpotterActive && spotterTarget) {
      setAttempts(a => a + 1);
      if (landmark.id === spotterTarget.id) {
        setScore(s => s + 1);
        pickRandomTarget();
      }
    }
  };

  return (
    <div className={styles.stationContainer}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <span style={{ fontSize: '1.75rem' }}>🦷</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Cephalometric & OPG Spotter Exam Station</h3>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>DCI CBME Orthodontics & Maxillofacial Diagnostics</p>
          </div>
          <span className={styles.badge}>Interactive PACS</span>
        </div>

        <div className={styles.modeToggleGroup}>
          <button
            type="button"
            className={`${styles.modeBtn} ${activeMode === 'study' ? styles.modeBtnActive : ''}`}
            onClick={() => { setActiveMode('study'); setIsSpotterActive(false); }}
          >
            📖 Study Atlas
          </button>
          <button
            type="button"
            className={`${styles.modeBtn} ${activeMode === 'spotter' ? styles.modeBtnActive : ''}`}
            onClick={() => { setActiveMode('spotter'); startSpotterTest(); }}
          >
            ⏱️ 60s Spotter Exam
          </button>
        </div>
      </div>

      <div className={styles.viewerGrid}>
        {/* SVG Interactive Canvas */}
        <div className={styles.canvasWrapper}>
          <svg viewBox="0 0 500 450" style={{ width: '100%', height: '100%', maxHeight: '420px' }}>
            {/* Dark Cephalometric Silhouette */}
            <path
              d="M 120,80 Q 200,30 280,60 T 360,140 Q 380,240 340,320 Q 320,360 260,380 L 160,390 Q 130,390 120,360 Q 110,320 130,280 Q 100,240 100,180 Z"
              fill="rgba(30, 41, 59, 0.4)"
              stroke="rgba(56, 189, 248, 0.3)"
              strokeWidth="1.5"
            />
            {/* Maxilla & Mandible profile lines */}
            <path
              d="M 140,110 L 140,210 Q 110,230 140,260 L 155,320 Q 130,360 160,370 L 260,350"
              fill="none"
              stroke="rgba(148, 163, 184, 0.5)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            {/* Cranial reference planes (S-N, Palatal, Mandibular) */}
            <line x1="210" y1="126" x2="140" y2="117" stroke="rgba(234, 179, 8, 0.5)" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="115" y1="216" x2="275" y2="207" stroke="rgba(16, 185, 129, 0.5)" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="340" y1="324" x2="145" y2="387" stroke="rgba(244, 63, 94, 0.5)" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* Interactive Landmarks */}
            {CEPH_LANDMARKS.map(lm => {
              const cx = (lm.x / 100) * 500;
              const cy = (lm.y / 100) * 450;
              const isSelected = selectedLandmark?.id === lm.id;

              return (
                <g key={lm.id} className={styles.landmarkTag} onClick={() => handleLandmarkClick(lm)}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 8 : 6}
                    fill={isSelected ? '#38bdf8' : 'rgba(14, 165, 233, 0.8)'}
                    stroke="#0f172a"
                    strokeWidth="2"
                  />
                  <text
                    x={cx + 10}
                    y={cy + 4}
                    fill={isSelected ? '#ffffff' : '#94a3b8'}
                    fontSize="11"
                    fontWeight="800"
                  >
                    {lm.code}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Details / Spotter Controller Panel */}
        <div className={styles.detailsPanel}>
          {activeMode === 'study' ? (
            <>
              <div className={styles.sectionHeader}>Landmark Anatomy & Metrics</div>
              <div className={styles.landmarkCard}>
                <div className={styles.landmarkName}>
                  {selectedLandmark.name} ({selectedLandmark.code})
                </div>
                <p className={styles.landmarkDefinition}>
                  <strong>Anatomical Definition:</strong> {selectedLandmark.definition}
                </p>
                <p className={styles.landmarkDefinition}>
                  <strong>Clinical Significance:</strong> {selectedLandmark.clinicalSignificance}
                </p>
              </div>

              <div style={{ background: 'rgba(15,23,42,0.6)', padding: '0.875rem', borderRadius: '8px', border: '1px solid rgba(51,65,85,0.4)', fontSize: '0.75rem', color: '#94a3b8' }}>
                <strong style={{ color: '#e2e8f0', display: 'block', marginBottom: '0.25rem' }}>Key Cephalometric Norms (Steiner):</strong>
                <div>• SNA: 82° ± 2° (Maxillary skeletal position)</div>
                <div>• SNB: 80° ± 2° (Mandibular skeletal position)</div>
                <div>• ANB: 2° ± 1° (Skeletal Class I relationship)</div>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={styles.sectionHeader}>Spotter Exam Mode</span>
                <span className={styles.timerPill}>⏱️ {timeLeft}s remaining</span>
              </div>

              {isSpotterActive && spotterTarget ? (
                <div className={styles.landmarkCard} style={{ borderColor: '#38bdf8' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>Identify and Click:</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8', margin: '0.5rem 0' }}>
                    {spotterTarget.name} ({spotterTarget.code})
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{spotterTarget.definition}</div>
                </div>
              ) : (
                <div className={styles.scoreBanner}>
                  🎯 Test Completed! Final Score: {score} / {attempts}
                  <button
                    type="button"
                    onClick={startSpotterTest}
                    style={{ display: 'block', margin: '0.75rem auto 0', padding: '0.4rem 1rem', background: '#0284c7', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Retake 60s Spotter
                  </button>
                </div>
              )}

              <div style={{ background: 'rgba(15,23,42,0.6)', padding: '0.75rem', borderRadius: '8px', textAlign: 'center', fontSize: '0.85rem' }}>
                Score: <strong style={{ color: '#38bdf8' }}>{score}</strong> correct out of <strong>{attempts}</strong> attempts
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
