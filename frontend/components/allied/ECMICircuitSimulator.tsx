'use client';

import React, { useState, useMemo } from 'react';
import styles from './ECMICircuitSimulator.module.css';

interface CircuitMode {
  id: string;
  name: string;
  type: string;
  indication: string;
  drainage: string;
  reinfusion: string;
  targetFlow: string;
  targetACT: string;
  criticalPearl: string;
}

const CIRCUIT_MODES: CircuitMode[] = [
  {
    id: 'cpb',
    name: 'Cardiopulmonary Bypass (CPB)',
    type: 'Full Cardiac & Respiratory Arrest Support',
    indication: 'Open heart surgery (CABG, Valve Replacement, Aortic Arch Repair)',
    drainage: 'Right Atrium / Venae Cavae (Venous Cannula)',
    reinfusion: 'Ascending Aorta (Arterial Cannula)',
    targetFlow: '2.2 - 2.6 L/min/m² (Cardiac Index)',
    targetACT: '400 - 480 seconds (Full Systemic Heparinization)',
    criticalPearl: 'Maintain Mean Arterial Pressure (MAP) 50-70 mmHg during hypothermic bypass.'
  },
  {
    id: 'va-ecmo',
    name: 'Veno-Arterial (VA) ECMO',
    type: 'Cardiogenic Shock / Biventricular Failure',
    indication: 'Refractory cardiogenic shock, post-cardiotomy failure, acute fulminant myocarditis',
    drainage: 'Femoral Vein (IVC drainage)',
    reinfusion: 'Femoral Artery (Retrograde arterial perfusion)',
    targetFlow: '3.5 - 5.0 L/min (60-80% of native cardiac output)',
    targetACT: '180 - 220 seconds',
    criticalPearl: 'Monitor for Harlequin syndrome (North-South syndrome) via right radial arterial line.'
  },
  {
    id: 'vv-ecmo',
    name: 'Veno-Venous (VV) ECMO',
    type: 'Refractory Respiratory Failure / Severe ARDS',
    indication: 'Severe ARDS failing lung-protective ventilation (P/F ratio < 80 for > 6 hours)',
    drainage: 'Femoral Vein (IVC)',
    reinfusion: 'Right Internal Jugular Vein (towards tricuspid valve) or Dual-Lumen Avalon Cannula',
    targetFlow: '4.0 - 6.0 L/min',
    targetACT: '160 - 200 seconds',
    criticalPearl: 'Native heart provides all cardiac output; ECMO circuit only provides gas exchange.'
  }
];

export default function ECMICircuitSimulator() {
  const [selectedCircuitId, setSelectedCircuitId] = useState<string>('va-ecmo');
  const [pumpFlowLMin, setPumpFlowLMin] = useState<number>(4.2);
  const [sweepGasLMin, setSweepGasLMin] = useState<number>(3.5);
  const [fdO2Pct, setFdO2Pct] = useState<number>(80);
  const [tempC, setTempC] = useState<number>(36.5);
  const [actSec, setActSec] = useState<number>(205);

  const currentCircuit = useMemo(() => {
    return CIRCUIT_MODES.find(c => c.id === selectedCircuitId) || CIRCUIT_MODES[1];
  }, [selectedCircuitId]);

  // Real-time simulated blood gas outputs
  const bloodGas = useMemo(() => {
    // PaO2 depends on FdO2 and pump flow
    const paO2 = Math.round(75 + (fdO2Pct * 3.2) * (pumpFlowLMin / 4.5));
    // PaCO2 inversely proportional to Sweep Gas flow
    const paCO2 = Math.max(25, Math.min(65, Math.round(55 - (sweepGasLMin * 4.2))));
    // pH estimated via Henderson-Hasselbalch proxy
    const pH = Number((7.40 + (40 - paCO2) * 0.008).toFixed(2));

    let status = 'Optimal Gas Exchange';
    let alertColor = 'green';
    if (paCO2 < 32) { status = 'Respiratory Alkalosis (Excessive Sweep Rate)'; alertColor = 'amber'; }
    else if (paCO2 > 48) { status = 'Respiratory Acidosis (Inadequate Sweep Rate)'; alertColor = 'amber'; }
    if (actSec < 180) { status = 'Anticoagulation Subtherapeutic (Thrombus Risk)'; alertColor = 'red'; }

    return { paO2, paCO2, pH, status, alertColor };
  }, [pumpFlowLMin, sweepGasLMin, fdO2Pct, actSec]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>Cardiovascular Perfusion & ECMO/CPB Circuit Simulator</h2>
        <p className={styles.subtitle}>
          Interactive high-tech extracorporeal circuit simulator: Cardiopulmonary Bypass (CPB), VA-ECMO, and VV-ECMO with real-time hemodynamic and blood gas responses.
        </p>
      </header>

      {/* Circuit Mode Selector */}
      <div className={styles.circuitTabs}>
        {CIRCUIT_MODES.map(mode => (
          <button
            key={mode.id}
            className={`${styles.modeBtn} ${selectedCircuitId === mode.id ? styles.activeModeBtn : ''}`}
            onClick={() => setSelectedCircuitId(mode.id)}
          >
            <strong>{mode.name}</strong>
            <small>{mode.type}</small>
          </button>
        ))}
      </div>

      <div className={styles.layout}>
        {/* Left: Circuit Visualizer Diagram */}
        <div className={styles.visualizerCol}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.circuitTitle}>{currentCircuit.name}</span>
              <span className={styles.flowBadge}>Flow: {pumpFlowLMin.toFixed(1)} L/min</span>
            </div>

            <div className={styles.circuitSvgWrapper}>
              <svg viewBox="0 0 380 260" className={styles.circuitSvg}>
                {/* Circuit Tubing Loop */}
                {/* Venous Drainage Line (Blue) */}
                <path d="M 60 70 L 60 200 L 140 200" fill="none" stroke="#3b82f6" strokeWidth="8" strokeLinecap="round" />
                <text x="50" y="55" fill="#60a5fa" fontSize="11" fontWeight="700">Venous Drainage</text>

                {/* Centrifugal Pump Head */}
                <circle cx="170" cy="200" r="24" fill="#0f172a" stroke="#38bdf8" strokeWidth="3" />
                <circle cx="170" cy="200" r="8" fill="#38bdf8" />
                <text x="170" y="240" fill="#38bdf8" fontSize="10" textAnchor="middle" fontWeight="600">Centrifugal Pump</text>

                {/* Line to Oxygenator */}
                <line x1="194" y1="200" x2="250" y2="200" stroke="#8b5cf6" strokeWidth="8" strokeLinecap="round" />

                {/* Membrane Oxygenator & Heat Exchanger */}
                <rect x="250" y="160" width="70" height="80" rx="8" fill="#1e293b" stroke="#f43f5e" strokeWidth="3" />
                <text x="285" y="195" fill="#f43f5e" fontSize="10" textAnchor="middle" fontWeight="700">Membrane</text>
                <text x="285" y="210" fill="#f43f5e" fontSize="10" textAnchor="middle" fontWeight="700">Oxygenator</text>
                <text x="285" y="225" fill="#fbbf24" fontSize="9" textAnchor="middle">{tempC}°C</text>

                {/* Arterial Return Line (Red) */}
                <path d="M 285 160 L 285 70 L 220 70" fill="none" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" />
                <text x="285" y="55" fill="#f87171" fontSize="11" fontWeight="700" textAnchor="middle">Arterial Return</text>

                {/* Patient Box */}
                <rect x="100" y="40" width="120" height="60" rx="10" fill="#0f172a" stroke="#cbd5e1" strokeWidth="2" />
                <text x="160" y="70" fill="#f1f5f9" fontSize="12" textAnchor="middle" fontWeight="700">Patient</text>
                <text x="160" y="85" fill="#94a3b8" fontSize="9" textAnchor="middle">{currentCircuit.drainage.split('(')[0]}</text>
              </svg>
            </div>

            {/* Cannulation Details */}
            <div className={styles.cannulationInfo}>
              <div><span className={styles.drainageTag}>🔵 Drainage:</span> {currentCircuit.drainage}</div>
              <div><span className={styles.returnTag}>🔴 Reinfusion:</span> {currentCircuit.reinfusion}</div>
            </div>
          </div>
        </div>

        {/* Right: Perfusion Controls & Blood Gas Metrics */}
        <div className={styles.controlsCol}>
          {/* Blood Gas & Hemodynamic Monitor */}
          <div className={styles.card}>
            <span className={styles.label}>Simulated Arterial Blood Gas (Post-Oxygenator)</span>
            <div className={styles.abgGrid}>
              <div className={styles.abgBox}>
                <span className={styles.abgVal}>{bloodGas.paO2}</span>
                <span className={styles.abgUnit}>PaO₂ (mmHg)</span>
              </div>
              <div className={styles.abgBox}>
                <span className={styles.abgVal}>{bloodGas.paCO2}</span>
                <span className={styles.abgUnit}>PaCO₂ (mmHg)</span>
              </div>
              <div className={styles.abgBox}>
                <span className={styles.abgVal}>{bloodGas.pH}</span>
                <span className={styles.abgUnit}>Arterial pH</span>
              </div>
            </div>

            <div className={`${styles.statusBanner} ${styles[bloodGas.alertColor]}`}>
              {bloodGas.status}
            </div>
          </div>

          {/* Perfusionist Interactive Controls */}
          <div className={styles.card}>
            <h3 className={styles.cardHeading}>Perfusionist Parameter Controls</h3>
            
            <div className={styles.sliderGroup}>
              <div className={styles.sliderHeader}>
                <span>Pump Flow Rate:</span>
                <strong>{pumpFlowLMin.toFixed(1)} L/min</strong>
              </div>
              <input
                type="range"
                min="1.5"
                max="6.5"
                step="0.1"
                value={pumpFlowLMin}
                onChange={e => setPumpFlowLMin(Number(e.target.value))}
                className={styles.rangeSlider}
              />
            </div>

            <div className={styles.sliderGroup}>
              <div className={styles.sliderHeader}>
                <span>Sweep Gas Flow:</span>
                <strong>{sweepGasLMin.toFixed(1)} L/min</strong>
              </div>
              <input
                type="range"
                min="0.5"
                max="10.0"
                step="0.5"
                value={sweepGasLMin}
                onChange={e => setSweepGasLMin(Number(e.target.value))}
                className={styles.rangeSlider}
              />
            </div>

            <div className={styles.sliderGroup}>
              <div className={styles.sliderHeader}>
                <span>Delivered Oxygen (FdO₂):</span>
                <strong>{fdO2Pct}%</strong>
              </div>
              <input
                type="range"
                min="21"
                max="100"
                step="5"
                value={fdO2Pct}
                onChange={e => setFdO2Pct(Number(e.target.value))}
                className={styles.rangeSlider}
              />
            </div>

            <div className={styles.sliderGroup}>
              <div className={styles.sliderHeader}>
                <span>Activated Clotting Time (ACT):</span>
                <strong>{actSec} sec (Target: {currentCircuit.targetACT})</strong>
              </div>
              <input
                type="range"
                min="120"
                max="550"
                step="10"
                value={actSec}
                onChange={e => setActSec(Number(e.target.value))}
                className={styles.rangeSlider}
              />
            </div>
          </div>

          {/* Clinical Pearl */}
          <div className={styles.pearlCard}>
            💡 <strong>High-Tech Perfusion Pearl:</strong> {currentCircuit.criticalPearl}
          </div>
        </div>
      </div>
    </div>
  );
}
