'use client';

import React, { useState, useMemo } from 'react';
import styles from './PKPDSimulator.module.css';
import {
  PKRoute,
  PKParameters,
  calculateOneCompConcentration,
  calculateMultiDoseProfile,
  calculatePKSteadyState,
  STANDARD_PK_DRUG_PRESETS
} from '@/lib/pharmacy/PKPDPresets';

export default function PKPDSimulator() {
  const [selectedDrug, setSelectedDrug] = useState<string>('Vancomycin');
  const [route, setRoute] = useState<PKRoute>('iv_bolus');
  const [dose, setDose] = useState<number>(1000);
  const [clearance, setClearance] = useState<number>(4.5);
  const [vd, setVd] = useState<number>(50);
  const [ka, setKa] = useState<number>(1.2);
  const [tau, setTau] = useState<number>(12);
  const [dosesCount, setDosesCount] = useState<number>(4);
  const [bioavailability, setBioavailability] = useState<number>(1.0);

  const [mec, setMec] = useState<number>(10);
  const [mtc, setMtc] = useState<number>(20);

  const handleDrugSelect = (drugName: string) => {
    setSelectedDrug(drugName);
    const preset = STANDARD_PK_DRUG_PRESETS.find(p => p.name.toLowerCase() === drugName.toLowerCase());
    if (preset) {
      setDose(preset.standardDoseMg);
      setClearance(preset.clearanceLh);
      setVd(preset.vdLitres);
      setKa(preset.kaHour);
      setBioavailability(preset.fPercent / 100);
      setMec(preset.mecUgMl);
      setMtc(preset.mtcUgMl);
    }
  };

  const pkParams: PKParameters = useMemo(() => {
    const ke = clearance / vd;
    const tHalf = Math.LN2 / ke;
    return {
      dose,
      clearance,
      volumeOfDistribution: vd,
      absorptionRateKa: ka,
      bioavailabilityF: bioavailability,
      infusionRateR0: dose / 1.0, // 1h infusion
      infusionDuration: 1.0,
      eliminationRateKe: ke,
      halfLifeHours: tHalf
    };
  }, [dose, clearance, vd, ka, bioavailability]);

  const profile = useMemo(() => {
    return calculateMultiDoseProfile(pkParams, tau, dosesCount, route);
  }, [pkParams, tau, dosesCount, route]);

  const steadyState = useMemo(() => {
    return calculatePKSteadyState(dose, clearance, vd, tau, bioavailability);
  }, [dose, clearance, vd, tau, bioavailability]);

  // SVG Chart Dimensions
  const svgWidth = 600;
  const svgHeight = 280;
  const padding = { top: 20, right: 30, bottom: 40, left: 50 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  const maxTime = Math.max(48, tau * dosesCount);
  const maxConc = Math.max(mtc * 1.3, ...profile.map(p => p.concentration), steadyState.cMaxSS * 1.1, 10);

  const getX = (t: number) => padding.left + (t / maxTime) * graphWidth;
  const getY = (c: number) => padding.top + graphHeight - (Math.min(c, maxConc) / maxConc) * graphHeight;

  const pointsString = useMemo(() => {
    if (profile.length === 0) return '';
    return profile.map(p => `${getX(p.time).toFixed(1)},${getY(p.concentration).toFixed(1)}`).join(' ');
  }, [profile, maxTime, maxConc]);

  // Safety status badge
  const safetyStatus = useMemo(() => {
    if (steadyState.cMaxSS > mtc) return { label: 'Toxic Risk (Exceeds MTC)', color: 'red' };
    if (steadyState.cMinSS < mec) return { label: 'Subtherapeutic Trough', color: 'amber' };
    return { label: 'Within Therapeutic Window', color: 'green' };
  }, [steadyState, mec, mtc]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>PK/PD Interactive Concentration-Time Simulator</h2>
        <p className={styles.subtitle}>
          One-compartment pharmacokinetics engine for IV bolus, infusion, and oral 1st-order absorption with multi-dose steady-state accumulation.
        </p>
      </header>

      <div className={styles.layout}>
        {/* Controls Panel */}
        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <label className={styles.label}>Clinical Drug Preset</label>
            <div className={styles.presetButtons}>
              {STANDARD_PK_DRUG_PRESETS.map(p => (
                <button
                  key={p.id}
                  className={`${styles.presetBtn} ${selectedDrug.toLowerCase() === p.name.toLowerCase() ? styles.activePreset : ''}`}
                  onClick={() => handleDrugSelect(p.name)}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.controlGroup}>
            <label className={styles.label}>Administration Route</label>
            <div className={styles.routeSelector}>
              {(['iv_bolus', 'iv_infusion', 'oral'] as PKRoute[]).map(r => (
                <button
                  key={r}
                  className={`${styles.routeBtn} ${route === r ? styles.activeRoute : ''}`}
                  onClick={() => setRoute(r)}
                >
                  {r === 'iv_bolus' ? 'IV Bolus' : r === 'iv_infusion' ? 'IV Infusion (1h)' : 'Oral Absorption'}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.sliderGroup}>
            <div className={styles.sliderHeader}>
              <span>Dose (D):</span>
              <span className={styles.val}>{dose} mg</span>
            </div>
            <input type="range" min="10" max="2000" step="10" value={dose} onChange={e => setDose(Number(e.target.value))} className={styles.slider} />
          </div>

          <div className={styles.sliderGroup}>
            <div className={styles.sliderHeader}>
              <span>Clearance (CL):</span>
              <span className={styles.val}>{clearance.toFixed(1)} L/h</span>
            </div>
            <input type="range" min="0.5" max="25" step="0.5" value={clearance} onChange={e => setClearance(Number(e.target.value))} className={styles.slider} />
          </div>

          <div className={styles.sliderGroup}>
            <div className={styles.sliderHeader}>
              <span>Volume of Dist. (Vd):</span>
              <span className={styles.val}>{vd} L</span>
            </div>
            <input type="range" min="5" max="200" step="5" value={vd} onChange={e => setVd(Number(e.target.value))} className={styles.slider} />
          </div>

          {route === 'oral' && (
            <div className={styles.sliderGroup}>
              <div className={styles.sliderHeader}>
                <span>Absorption Rate (Ka):</span>
                <span className={styles.val}>{ka.toFixed(2)} h⁻¹</span>
              </div>
              <input type="range" min="0.1" max="3.0" step="0.1" value={ka} onChange={e => setKa(Number(e.target.value))} className={styles.slider} />
            </div>
          )}

          <div className={styles.sliderGroup}>
            <div className={styles.sliderHeader}>
              <span>Dosing Interval (τ):</span>
              <span className={styles.val}>{tau} hours</span>
            </div>
            <input type="range" min="4" max="24" step="2" value={tau} onChange={e => setTau(Number(e.target.value))} className={styles.slider} />
          </div>

          <div className={styles.sliderGroup}>
            <div className={styles.sliderHeader}>
              <span>Number of Doses:</span>
              <span className={styles.val}>{dosesCount}</span>
            </div>
            <input type="range" min="1" max="8" step="1" value={dosesCount} onChange={e => setDosesCount(Number(e.target.value))} className={styles.slider} />
          </div>
        </div>

        {/* Visualization & Metrics */}
        <div className={styles.displayPanel}>
          <div className={styles.chartContainer}>
            <div className={styles.chartHeader}>
              <span className={styles.chartTitle}>Plasma Concentration Profile C(t)</span>
              <span className={`${styles.statusBadge} ${styles[safetyStatus.color]}`}>
                {safetyStatus.label}
              </span>
            </div>

            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className={styles.svg}>
              {/* Therapeutic Window Green Band */}
              <rect
                x={padding.left}
                y={getY(mtc)}
                width={graphWidth}
                height={Math.max(0, getY(mec) - getY(mtc))}
                fill="rgba(16, 185, 129, 0.12)"
              />

              {/* MTC Red Line */}
              <line
                x1={padding.left}
                y1={getY(mtc)}
                x2={padding.left + graphWidth}
                y2={getY(mtc)}
                stroke="#ef4444"
                strokeDasharray="4 4"
                strokeWidth="1.5"
              />
              <text x={padding.left + 5} y={getY(mtc) - 4} fill="#ef4444" fontSize="10">MTC ({mtc} mg/L)</text>

              {/* MEC Blue Line */}
              <line
                x1={padding.left}
                y1={getY(mec)}
                x2={padding.left + graphWidth}
                y2={getY(mec)}
                stroke="#38bdf8"
                strokeDasharray="4 4"
                strokeWidth="1.5"
              />
              <text x={padding.left + 5} y={getY(mec) - 4} fill="#38bdf8" fontSize="10">MEC ({mec} mg/L)</text>

              {/* Grid Lines & Axis */}
              <line x1={padding.left} y1={padding.top + graphHeight} x2={padding.left + graphWidth} y2={padding.top + graphHeight} stroke="#475569" strokeWidth="1" />
              <line x1={padding.left} y1={padding.top} x2={padding.left} y2={padding.top + graphHeight} stroke="#475569" strokeWidth="1" />

              {/* X Axis Ticks (Time) */}
              {[0, 12, 24, 36, 48].filter(t => t <= maxTime).map(t => (
                <g key={t} transform={`translate(${getX(t)}, ${padding.top + graphHeight})`}>
                  <line y2="5" stroke="#94a3b8" />
                  <text y="18" textAnchor="middle" fill="#94a3b8" fontSize="10">{t}h</text>
                </g>
              ))}

              {/* Concentration Curve */}
              {pointsString && (
                <polyline
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={pointsString}
                />
              )}
            </svg>
          </div>

          {/* PK Metrics Dashboard */}
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Peak Steady-State (Cmax,ss)</span>
              <span className={styles.metricValue}>{steadyState.cMaxSS.toFixed(2)} <small>mg/L</small></span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Trough Steady-State (Cmin,ss)</span>
              <span className={styles.metricValue}>{steadyState.cMinSS.toFixed(2)} <small>mg/L</small></span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Elimination Half-Life (t½)</span>
              <span className={styles.metricValue}>{pkParams.halfLifeHours.toFixed(1)} <small>hours</small></span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>AUC (0-τ)</span>
              <span className={styles.metricValue}>{steadyState.aucTau.toFixed(1)} <small>mg·h/L</small></span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Accumulation Factor (R)</span>
              <span className={styles.metricValue}>{steadyState.accumulationFactor.toFixed(2)}x</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Ke Rate Constant</span>
              <span className={styles.metricValue}>{pkParams.eliminationRateKe.toFixed(3)} <small>h⁻¹</small></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
