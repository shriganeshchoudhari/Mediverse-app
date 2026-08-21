'use client';

import React, { useState, useMemo } from 'react';
import styles from './IVDripRateSimulator.module.css';

type DropFactor = 10 | 15 | 20 | 60;

interface VasoactiveDrugItem {
  id: string;
  name: string;
  defaultConcMg: number;
  defaultVolMl: number;
  doseUnit: string;
  defaultDose: number;
  minDose: number;
  maxDose: number;
}

const VASOACTIVE_LIST: VasoactiveDrugItem[] = [
  { id: 'norepi', name: 'Norepinephrine (Levophed)', defaultConcMg: 4, defaultVolMl: 250, doseUnit: 'mcg/min', defaultDose: 8, minDose: 1, maxDose: 30 },
  { id: 'epi', name: 'Epinephrine', defaultConcMg: 4, defaultVolMl: 250, doseUnit: 'mcg/min', defaultDose: 5, minDose: 1, maxDose: 20 },
  { id: 'dopamine', name: 'Dopamine', defaultConcMg: 400, defaultVolMl: 250, doseUnit: 'mcg/kg/min', defaultDose: 5, minDose: 2, maxDose: 20 },
  { id: 'dobutamine', name: 'Dobutamine', defaultConcMg: 250, defaultVolMl: 250, doseUnit: 'mcg/kg/min', defaultDose: 5, minDose: 2.5, maxDose: 20 },
  { id: 'ntg', name: 'Nitroglycerin', defaultConcMg: 50, defaultVolMl: 250, doseUnit: 'mcg/min', defaultDose: 20, minDose: 5, maxDose: 100 },
];

export default function IVDripRateSimulator() {
  // Tab: 'gravity' | 'vasoactive'
  const [activeTab, setActiveTab] = useState<'gravity' | 'vasoactive'>('gravity');

  // Gravity Drip State
  const [volumeMl, setVolumeMl] = useState<number>(1000);
  const [durationHours, setDurationHours] = useState<number>(8);
  const [dropFactor, setDropFactor] = useState<DropFactor>(15);

  // Vasoactive Infusion State
  const [selectedDrugId, setSelectedDrugId] = useState<string>('norepi');
  const [patientWeightKg, setPatientWeightKg] = useState<number>(70);
  const [targetDose, setTargetDose] = useState<number>(8);
  const [bagConcMg, setBagConcMg] = useState<number>(4);
  const [bagVolMl, setBagVolMl] = useState<number>(250);

  const selectedDrug = useMemo(() => {
    return VASOACTIVE_LIST.find(d => d.id === selectedDrugId) || VASOACTIVE_LIST[0];
  }, [selectedDrugId]);

  // Calculations for Gravity Drip
  const gravityCalculations = useMemo(() => {
    const timeMinutes = durationHours * 60;
    const gttPerMin = (volumeMl * dropFactor) / (timeMinutes || 1);
    const mlPerHour = volumeMl / (durationHours || 1);
    const secondsPerDrop = 60 / (gttPerMin || 1);
    return {
      gttPerMin: Math.round(gttPerMin),
      mlPerHour: Math.round(mlPerHour * 10) / 10,
      secondsPerDrop: Math.round(secondsPerDrop * 10) / 10
    };
  }, [volumeMl, durationHours, dropFactor]);

  // Calculations for Vasoactive
  const vasoactiveCalculations = useMemo(() => {
    // conc in mcg/mL
    const concMcgPerMl = (bagConcMg * 1000) / (bagVolMl || 1);
    let totalDoseMcgPerMin = targetDose;
    if (selectedDrug.doseUnit === 'mcg/kg/min') {
      totalDoseMcgPerMin = targetDose * patientWeightKg;
    }
    const mlPerMin = totalDoseMcgPerMin / (concMcgPerMl || 1);
    const mlPerHour = mlPerMin * 60;

    return {
      concMcgPerMl: Math.round(concMcgPerMl),
      mlPerHour: Math.round(mlPerHour * 10) / 10
    };
  }, [selectedDrug, targetDose, patientWeightKg, bagConcMg, bagVolMl]);

  const handleApplyFluidPreset = (vol: number, hrs: number, df: DropFactor) => {
    setVolumeMl(vol);
    setDurationHours(hrs);
    setDropFactor(df);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>IV Drip Rate & Vasoactive Infusion Calculator Simulator</h2>
        <p className={styles.subtitle}>
          Standardized gravity flow rate calculator with animated drip chamber and weight-based critical care infusion pump rate solver.
        </p>
      </header>

      {/* Tabs */}
      <div className={styles.tabNav}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'gravity' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('gravity')}
        >
          💧 Gravity IV Drip Rate Calculator
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'vasoactive' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('vasoactive')}
        >
          ⚡ Vasoactive Infusion Pump Solver
        </button>
      </div>

      {activeTab === 'gravity' ? (
        <div className={styles.tabContent}>
          {/* Quick Presets */}
          <div className={styles.presetsRow}>
            <span className={styles.presetLabel}>Standard Fluid Orders:</span>
            <button className={styles.presetChip} onClick={() => handleApplyFluidPreset(1000, 8, 15)}>
              NS 1000mL / 8h (15 gtt/mL)
            </button>
            <button className={styles.presetChip} onClick={() => handleApplyFluidPreset(1000, 6, 20)}>
              RL 1000mL / 6h (20 gtt/mL)
            </button>
            <button className={styles.presetChip} onClick={() => handleApplyFluidPreset(500, 4, 15)}>
              D5W 500mL / 4h (15 gtt/mL)
            </button>
            <button className={styles.presetChip} onClick={() => handleApplyFluidPreset(500, 24, 60)}>
              Pediatric Microdrip 500mL / 24h (60 gtt/mL)
            </button>
          </div>

          <div className={styles.layout}>
            {/* Input Controls */}
            <div className={styles.panel}>
              <h3 className={styles.panelTitle}>1. Infusion Parameters</h3>
              
              <div className={styles.formGroup}>
                <div className={styles.labelRow}>
                  <label>Total Volume to Infuse</label>
                  <span className={styles.valBadge}>{volumeMl} mL</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="2000"
                  step="50"
                  value={volumeMl}
                  onChange={e => setVolumeMl(Number(e.target.value))}
                  className={styles.slider}
                />
              </div>

              <div className={styles.formGroup}>
                <div className={styles.labelRow}>
                  <label>Infusion Duration</label>
                  <span className={styles.valBadge}>{durationHours} hours</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="24"
                  step="0.5"
                  value={durationHours}
                  onChange={e => setDurationHours(Number(e.target.value))}
                  className={styles.slider}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Drop Factor (Tubing Calibration)</label>
                <div className={styles.dropFactorGrid}>
                  {([10, 15, 20, 60] as DropFactor[]).map(df => (
                    <button
                      key={df}
                      className={`${styles.dfBtn} ${dropFactor === df ? styles.activeDf : ''}`}
                      onClick={() => setDropFactor(df)}
                    >
                      <strong>{df}</strong> gtt/mL
                      <small>{df === 60 ? 'Microdrip' : 'Macrodrip'}</small>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Visual Drip Chamber & Calculated Output */}
            <div className={styles.outputPanel}>
              <div className={styles.dripChamberCard}>
                <h3 className={styles.panelTitle}>2. Live Drip Chamber Visualizer</h3>
                
                <div className={styles.dripVisRow}>
                  <svg viewBox="0 0 120 180" className={styles.dripSvg}>
                    {/* IV Bag Top */}
                    <path d="M 40 10 L 80 10 L 85 40 L 35 40 Z" fill="#38bdf8" opacity="0.8" />
                    {/* Spike & Tube */}
                    <rect x="58" y="40" width="4" height="20" fill="#94a3b8" />
                    {/* Clear Drip Chamber */}
                    <rect x="42" y="60" width="36" height="80" rx="10" fill="none" stroke="#64748b" strokeWidth="2" />
                    {/* Fluid Level in Chamber */}
                    <rect x="44" y="110" width="32" height="28" rx="4" fill="#38bdf8" opacity="0.4" />
                    {/* Dripping Nozzle */}
                    <rect x="57" y="60" width="6" height="12" fill="#94a3b8" />
                    {/* Animated Droplet */}
                    <circle cx="60" cy="85" r="4" fill="#38bdf8">
                      <animate
                        attributeName="cy"
                        from="72"
                        to="110"
                        dur={`${Math.max(0.3, gravityCalculations.secondsPerDrop)}s`}
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        from="1"
                        to="0"
                        dur={`${Math.max(0.3, gravityCalculations.secondsPerDrop)}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  </svg>

                  <div className={styles.rateMetrics}>
                    <div className={styles.metricBig}>
                      <span className={styles.metricLabel}>Calculated Drip Rate</span>
                      <span className={styles.metricNumber}>{gravityCalculations.gttPerMin}</span>
                      <span className={styles.metricUnit}>drops / minute (gtt/min)</span>
                    </div>

                    <div className={styles.subMetrics}>
                      <div className={styles.subMetricItem}>
                        <span>Volumetric Rate:</span>
                        <strong>{gravityCalculations.mlPerHour} mL/h</strong>
                      </div>
                      <div className={styles.subMetricItem}>
                        <span>Drop Frequency:</span>
                        <strong>1 drop every {gravityCalculations.secondsPerDrop}s</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.formulaBanner}>
                  <strong>Nursing Formula:</strong> Drip Rate (gtt/min) = [Volume ({volumeMl} mL) × Drop Factor ({dropFactor} gtt/mL)] ÷ Time ({durationHours * 60} mins)
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.tabContent}>
          {/* Vasoactive Solver */}
          <div className={styles.layout}>
            <div className={styles.panel}>
              <h3 className={styles.panelTitle}>1. Select Vasoactive Medication</h3>
              <div className={styles.drugSelectorGrid}>
                {VASOACTIVE_LIST.map(drug => (
                  <button
                    key={drug.id}
                    className={`${styles.drugSelectBtn} ${selectedDrug.id === drug.id ? styles.activeDrug : ''}`}
                    onClick={() => {
                      setSelectedDrugId(drug.id);
                      setBagConcMg(drug.defaultConcMg);
                      setBagVolMl(drug.defaultVolMl);
                      setTargetDose(drug.defaultDose);
                    }}
                  >
                    <span className={styles.vasoName}>{drug.name}</span>
                    <span className={styles.vasoUnit}>{drug.doseUnit}</span>
                  </button>
                ))}
              </div>

              <div className={styles.formGroup}>
                <div className={styles.labelRow}>
                  <label>Patient Weight</label>
                  <span className={styles.valBadge}>{patientWeightKg} kg</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="150"
                  value={patientWeightKg}
                  onChange={e => setPatientWeightKg(Number(e.target.value))}
                  className={styles.slider}
                />
              </div>

              <div className={styles.formGroup}>
                <div className={styles.labelRow}>
                  <label>Target Dose ({selectedDrug.doseUnit})</label>
                  <span className={styles.valBadge}>{targetDose} {selectedDrug.doseUnit}</span>
                </div>
                <input
                  type="range"
                  min={selectedDrug.minDose}
                  max={selectedDrug.maxDose}
                  step={selectedDrug.maxDose > 20 ? 1 : 0.5}
                  value={targetDose}
                  onChange={e => setTargetDose(Number(e.target.value))}
                  className={styles.slider}
                />
              </div>
            </div>

            <div className={styles.outputPanel}>
              <div className={styles.card}>
                <h3 className={styles.panelTitle}>2. Infusion Pump Setting</h3>
                
                <div className={styles.pumpDisplay}>
                  <div className={styles.pumpScreen}>
                    <span className={styles.pumpDrugName}>{selectedDrug.name}</span>
                    <div className={styles.pumpRateVal}>
                      {vasoactiveCalculations.mlPerHour} <small>mL/hr</small>
                    </div>
                    <span className={styles.pumpDoseSub}>
                      Delivering: {targetDose} {selectedDrug.doseUnit}
                    </span>
                  </div>
                </div>

                <div className={styles.concentrationInfo}>
                  <div><strong>Bag Preparation:</strong> {bagConcMg} mg in {bagVolMl} mL D5W/NS</div>
                  <div><strong>Concentration:</strong> {vasoactiveCalculations.concMcgPerMl} mcg/mL</div>
                </div>

                <div className={styles.warningNote}>
                  ⚠️ <strong>ICU Safety Protocol:</strong> Always administer vasoactive inotropes/vasopressors via a Central Venous Line with continuous arterial line BP monitoring. Titrate every 5-15 mins to maintain MAP &ge; 65 mmHg.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
