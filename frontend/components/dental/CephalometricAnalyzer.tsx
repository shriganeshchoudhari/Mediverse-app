'use client';
import React, { useState, useMemo } from 'react';
import styles from './CephalometricAnalyzer.module.css';

export default function CephalometricAnalyzer() {
  const [analysisType, setAnalysisType] = useState<'steiner' | 'tweed' | 'ricketts'>('steiner');
  const [sna, setSna] = useState(82);
  const [snb, setSnb] = useState(80);
  const [snGogn, setSnGogn] = useState(32);
  const [u1NaAngle, setU1NaAngle] = useState(22);
  const [u1NaDist, setU1NaDist] = useState(4);
  const [l1NbAngle, setL1NbAngle] = useState(25);
  const [l1NbDist, setL1NbDist] = useState(4);
  const [fma, setFma] = useState(25);
  const [impa, setImpa] = useState(87);

  const anb = useMemo(() => sna - snb, [sna, snb]);

  const skeletalClass = useMemo(() => {
    if (anb > 4) return 'Class II';
    if (anb < 0) return 'Class III';
    return 'Class I';
  }, [anb]);

  const skeletalPattern = useMemo(() => {
    const val = analysisType === 'tweed' ? fma : snGogn;
    const low = analysisType === 'tweed' ? 20 : 27;
    const high = analysisType === 'tweed' ? 30 : 37;
    if (val < low) return 'Hypodivergent';
    if (val > high) return 'Hyperdivergent';
    return 'Normodivergent';
  }, [analysisType, fma, snGogn]);

  const getStatus = (val: number, normal: number, range: number) => {
    const diff = Math.abs(val - normal);
    if (diff <= range) return 'normal';
    if (diff <= range * 2) return 'borderline';
    return 'severe';
  };

  const renderSlider = (label: string, value: number, setter: (v: number) => void, min: number, max: number, normalVal: number, range: number, unit: string = '°') => {
    const status = getStatus(value, normalVal, range);
    return (
      <div className={styles.sliderRow}>
        <div className={styles.sliderHeader}>
          <span className={styles.sliderLabel}>{label}</span>
          <span className={`${styles.badge} ${styles[status]}`}>{status}</span>
        </div>
        <div className={styles.sliderControl}>
          <input type="range" min={min} max={max} value={value} onChange={e => setter(Number(e.target.value))} className={styles.slider} />
          <span className={styles.sliderValue}>{value}{unit}</span>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* Top: Tabs */}
      <div className={styles.topTabs}>
        {['steiner', 'tweed', 'ricketts'].map(type => (
          <button 
            key={type} 
            className={`${styles.tabBtn} ${analysisType === type ? styles.activeTab : ''}`}
            onClick={() => setAnalysisType(type as any)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)} Analysis
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {/* Left: SVG Canvas */}
        <div className={styles.canvasPanel}>
          <svg viewBox="0 0 480 500" className={styles.svg}>
            <rect width="480" height="500" fill="#1e293b" />
            
            {/* Skull/Profile Outline */}
            <path d="M 200 50 C 150 50, 100 100, 100 180 C 100 250, 120 300, 150 350 L 250 450 L 300 420 L 280 350 C 350 350, 400 300, 400 250 C 400 150, 300 50, 200 50 Z" fill="none" stroke="#334155" strokeWidth="2" />
            
            {/* Landmarks (Approximate static positioning for visual) */}
            <g fill="#3b82f6">
              <circle cx="220" cy="180" r="4" /> <text x="225" y="175" fill="#94a3b8" fontSize="12">S</text>
              <circle cx="360" cy="180" r="4" /> <text x="365" y="175" fill="#94a3b8" fontSize="12">N</text>
              <circle cx="370" cy="280" r="4" /> <text x="375" y="275" fill="#94a3b8" fontSize="12">A</text>
              <circle cx="360" cy="350" r="4" /> <text x="365" y="345" fill="#94a3b8" fontSize="12">B</text>
              <circle cx="370" cy="400" r="4" /> <text x="375" y="395" fill="#94a3b8" fontSize="12">Pg</text>
              <circle cx="350" cy="420" r="4" /> <text x="355" y="435" fill="#94a3b8" fontSize="12">Me</text>
              <circle cx="200" cy="380" r="4" /> <text x="180" y="385" fill="#94a3b8" fontSize="12">Go</text>
              <circle cx="340" cy="410" r="4" /> <text x="325" y="425" fill="#94a3b8" fontSize="12">Gn</text>
            </g>

            {/* Lines */}
            <g stroke="#ef4444" strokeWidth="1" opacity="0.6">
              {/* S-N */}
              <line x1="220" y1="180" x2="360" y2="180" />
              {/* N-A */}
              <line x1="360" y1="180" x2="370" y2="280" />
              {/* N-B */}
              <line x1="360" y1="180" x2="360" y2="350" />
              {/* Go-Gn */}
              <line x1="200" y1="380" x2="340" y2="410" />
            </g>
          </svg>
        </div>

        {/* Right: Results Panel */}
        <div className={styles.resultsPanel}>
          <div className={styles.slidersList}>
            {analysisType === 'steiner' && (
              <>
                {renderSlider('SNA Angle', sna, setSna, 70, 100, 82, 2)}
                {renderSlider('SNB Angle', snb, setSnb, 68, 98, 80, 2)}
                {renderSlider('SN-GoGn Angle', snGogn, setSnGogn, 15, 55, 32, 3)}
                {renderSlider('U1 to NA Angle', u1NaAngle, setU1NaAngle, 5, 50, 22, 2)}
                {renderSlider('U1 to NA Distance', u1NaDist, setU1NaDist, -5, 15, 4, 1, 'mm')}
                {renderSlider('L1 to NB Angle', l1NbAngle, setL1NbAngle, 5, 55, 25, 2)}
                {renderSlider('L1 to NB Distance', l1NbDist, setL1NbDist, -5, 15, 4, 1, 'mm')}
              </>
            )}
            {analysisType === 'tweed' && (
              <>
                {renderSlider('FMA', fma, setFma, 10, 45, 25, 3)}
                {renderSlider('IMPA', impa, setImpa, 65, 110, 87, 4)}
              </>
            )}
            {/* Simple fallback for ricketts for now */}
            {analysisType === 'ricketts' && (
              <div className={styles.placeholder}>Ricketts analysis parameters here...</div>
            )}
          </div>

          <div className={styles.summaryBox}>
            <h3>Diagnostic Summary</h3>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>ANB Angle:</span>
                <span className={styles.summaryValue}>{anb}°</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Skeletal Class:</span>
                <span className={styles.summaryValue}>{skeletalClass}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Skeletal Pattern:</span>
                <span className={styles.summaryValue}>{skeletalPattern}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Treatment Plan:</span>
                <span className={styles.summaryValue}>{anb > 6 || anb < -3 ? 'Orthognathic' : 'Orthodontic'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
