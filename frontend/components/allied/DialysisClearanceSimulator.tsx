'use client';

import React, { useState, useMemo } from 'react';
import styles from './DialysisClearanceSimulator.module.css';

export default function DialysisClearanceSimulator() {
  const [bloodFlowQb, setBloodFlowQb] = useState<number>(350); // mL/min
  const [dialysateFlowQd, setDialysateFlowQd] = useState<number>(600); // mL/min
  const [durationHours, setDurationHours] = useState<number>(4.0);
  const [preBUN, setPreBUN] = useState<number>(75); // mg/dL
  const [postBUN, setPostBUN] = useState<number>(22); // mg/dL
  const [ultrafiltrationL, setUltrafiltrationL] = useState<number>(2.5); // Liters
  const [postWeightKg, setPostWeightKg] = useState<number>(68); // kg

  // Daugirdas single-pool Kt/V formula:
  // Kt/V = -ln(R - 0.008 * t) + (4 - 3.5 * R) * (UF / W)
  // where R = postBUN / preBUN, t = duration in hours, UF = ultrafiltration (L), W = post-dialysis weight (kg)
  const results = useMemo(() => {
    const R = postBUN / preBUN;
    const term1 = -Math.log(Math.max(0.01, R - 0.008 * durationHours));
    const term2 = (4 - 3.5 * R) * (ultrafiltrationL / postWeightKg);
    const ktV = Number((term1 + term2).toFixed(2));
    
    // Urea Reduction Ratio: URR = (1 - R) * 100
    const urr = Number(((1 - R) * 100).toFixed(1));

    const isAdequate = ktV >= 1.2 && urr >= 65;
    const status = isAdequate ? 'Adequate Dialysis Dose (Target Met)' : 'Subtherapeutic Clearance (Underdialyzed)';
    const statusColor = isAdequate ? 'green' : 'amber';

    return { ktV, urr, isAdequate, status, statusColor };
  }, [preBUN, postBUN, durationHours, ultrafiltrationL, postWeightKg]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>Renal Hemodialysis & Dialyzer Clearance (Kt/V) Calculator</h2>
        <p className={styles.subtitle}>
          Interactive countercurrent hemodialysis circuit simulator with Daugirdas single-pool Kt/V and Urea Reduction Ratio (URR) adequacy analysis.
        </p>
      </header>

      <div className={styles.layout}>
        {/* Left: Circuit Visualizer Diagram */}
        <div className={styles.visualizerCol}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Hollow-Fiber Dialyzer (Countercurrent Flow)</span>
              <span className={styles.flowRateBadge}>Qb: {bloodFlowQb} mL/min | Qd: {dialysateFlowQd} mL/min</span>
            </div>

            <div className={styles.dialyzerSvgWrapper}>
              <svg viewBox="0 0 360 240" className={styles.dialyzerSvg}>
                {/* Dialyzer Outer Shell */}
                <rect x="80" y="40" width="200" height="160" rx="14" fill="#0f172a" stroke="#0284c7" strokeWidth="3" />

                {/* Blood Flow: Left to Right (Red) */}
                <path d="M 20 80 L 80 80" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" />
                <text x="30" y="65" fill="#f87171" fontSize="10" fontWeight="700">Blood In (Pre-BUN: {preBUN})</text>

                {/* Hollow Fibers inside dialyzer */}
                <line x1="80" y1="80" x2="280" y2="80" stroke="#ef4444" strokeWidth="4" strokeDasharray="6 3" />
                <line x1="80" y1="120" x2="280" y2="120" stroke="#f43f5e" strokeWidth="4" strokeDasharray="6 3" />
                <line x1="80" y1="160" x2="280" y2="160" stroke="#ef4444" strokeWidth="4" strokeDasharray="6 3" />

                <path d="M 280 80 L 340 80" stroke="#3b82f6" strokeWidth="8" strokeLinecap="round" />
                <text x="330" y="65" fill="#60a5fa" fontSize="10" fontWeight="700" textAnchor="end">Clean Blood Out (Post: {postBUN})</text>

                {/* Dialysate Flow: Right to Left (Countercurrent - Green/Cyan) */}
                <path d="M 280 180 L 340 180" stroke="#10b981" strokeWidth="6" strokeLinecap="round" />
                <text x="330" y="200" fill="#34d399" fontSize="10" textAnchor="end">Fresh Dialysate In</text>

                <path d="M 20 180 L 80 180" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
                <text x="30" y="200" fill="#fbbf24" fontSize="10">Spent Dialysate + Urea</text>

                {/* Semi-permeable Membrane Label */}
                <text x="180" y="145" fill="#38bdf8" fontSize="11" textAnchor="middle" fontWeight="600">Synthetic High-Flux Membrane</text>
              </svg>
            </div>

            <div className={styles.formulaBanner}>
              <strong>Daugirdas Formula:</strong> $Kt/V = -\ln(R - 0.008 \times t) + (4 - 3.5 \times R) \times (UF / W)$
            </div>
          </div>
        </div>

        {/* Right: Prescription Controls & Adequacy Results */}
        <div className={styles.controlsCol}>
          {/* Adequacy Gauge Results */}
          <div className={styles.card}>
            <span className={styles.label}>Dialysis Adequacy Assessment</span>
            <div className={styles.metricsGrid}>
              <div className={styles.metricBox}>
                <span className={styles.metricVal}>{results.ktV}</span>
                <span className={styles.metricUnit}>Single-Pool Kt/V (Target ≥ 1.2)</span>
              </div>
              <div className={styles.metricBox}>
                <span className={styles.metricVal}>{results.urr}%</span>
                <span className={styles.metricUnit}>Urea Reduction Ratio (Target ≥ 65%)</span>
              </div>
            </div>

            <div className={`${styles.statusBadge} ${styles[results.statusColor]}`}>
              {results.status}
            </div>
          </div>

          {/* Prescription Sliders */}
          <div className={styles.card}>
            <h3 className={styles.cardHeading}>Dialysis Prescription Parameters</h3>
            
            <div className={styles.sliderGroup}>
              <div className={styles.sliderHeader}>
                <span>Blood Flow Rate (Qb):</span>
                <strong>{bloodFlowQb} mL/min</strong>
              </div>
              <input
                type="range"
                min="200"
                max="500"
                step="25"
                value={bloodFlowQb}
                onChange={e => setBloodFlowQb(Number(e.target.value))}
                className={styles.rangeSlider}
              />
            </div>

            <div className={styles.sliderGroup}>
              <div className={styles.sliderHeader}>
                <span>Dialysate Flow Rate (Qd):</span>
                <strong>{dialysateFlowQd} mL/min</strong>
              </div>
              <input
                type="range"
                min="400"
                max="800"
                step="50"
                value={dialysateFlowQd}
                onChange={e => setDialysateFlowQd(Number(e.target.value))}
                className={styles.rangeSlider}
              />
            </div>

            <div className={styles.sliderGroup}>
              <div className={styles.sliderHeader}>
                <span>Treatment Duration:</span>
                <strong>{durationHours} hours</strong>
              </div>
              <input
                type="range"
                min="2.5"
                max="5.5"
                step="0.5"
                value={durationHours}
                onChange={e => setDurationHours(Number(e.target.value))}
                className={styles.rangeSlider}
              />
            </div>

            <div className={styles.sliderGroup}>
              <div className={styles.sliderHeader}>
                <span>Ultrafiltration (UF Goal):</span>
                <strong>{ultrafiltrationL} Liters</strong>
              </div>
              <input
                type="range"
                min="0.5"
                max="4.5"
                step="0.1"
                value={ultrafiltrationL}
                onChange={e => setUltrafiltrationL(Number(e.target.value))}
                className={styles.rangeSlider}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
