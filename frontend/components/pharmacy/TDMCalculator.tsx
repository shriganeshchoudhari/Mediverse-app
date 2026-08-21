'use client';

import React, { useState, useMemo } from 'react';
import styles from './TDMCalculator.module.css';
import {
  NTI_DRUGS,
  calculateCockcroftGaultCrCl,
  calculateAdjustedDose,
  getNTIDrugById,
  NTIDrug
} from '@/lib/pharmacy/TDMPresets';

export default function TDMCalculator() {
  const [selectedDrugId, setSelectedDrugId] = useState<string>(NTI_DRUGS[0]?.id || 'vanco');
  const [age, setAge] = useState<number>(65);
  const [isFemale, setIsFemale] = useState<boolean>(false);
  const [weightKg, setWeightKg] = useState<number>(70);
  const [serumCreatinine, setSerumCreatinine] = useState<number>(1.2);
  const [measuredSerumLevel, setMeasuredSerumLevel] = useState<string>('14.5');

  const selectedDrug = useMemo(() => {
    return getNTIDrugById(selectedDrugId) || NTI_DRUGS[0];
  }, [selectedDrugId]);

  const crCl = useMemo(() => {
    return calculateCockcroftGaultCrCl(age, weightKg, serumCreatinine, isFemale);
  }, [age, weightKg, serumCreatinine, isFemale]);

  const crClStage = useMemo(() => {
    if (crCl >= 90) return { stage: 'Normal Renal Function', color: 'green' };
    if (crCl >= 60) return { stage: 'Mild Impairment (CKD G2)', color: 'blue' };
    if (crCl >= 30) return { stage: 'Moderate Impairment (CKD G3)', color: 'amber' };
    if (crCl >= 15) return { stage: 'Severe Impairment (CKD G4)', color: 'orange' };
    return { stage: 'End-Stage Renal Disease (CKD G5)', color: 'red' };
  }, [crCl]);

  const doseAdjustment = useMemo(() => {
    return calculateAdjustedDose(selectedDrug.id, crCl, weightKg);
  }, [selectedDrug, crCl, weightKg]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>Therapeutic Drug Monitoring (TDM) Dosing Calculator</h2>
        <p className={styles.subtitle}>
          Cockcroft-Gault creatinine clearance estimator and therapeutic window protocol advisor for Narrow Therapeutic Index (NTI) medications.
        </p>
      </header>

      <div className={styles.layout}>
        {/* Left Column: Drug & Patient Inputs */}
        <div className={styles.inputSection}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>1. Select Target NTI Medication</h3>
            <div className={styles.drugGrid}>
              {NTI_DRUGS.map(d => (
                <button
                  key={d.id}
                  className={`${styles.drugBtn} ${selectedDrug.id === d.id ? styles.activeDrug : ''}`}
                  onClick={() => setSelectedDrugId(d.id)}
                >
                  <span className={styles.drugName}>{d.name}</span>
                  <span className={styles.drugClass}>{d.drugClass}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>2. Patient Clinical Parameters</h3>
            <div className={styles.fieldsGrid}>
              <div className={styles.field}>
                <label>Age (years)</label>
                <input
                  type="number"
                  min="18"
                  max="100"
                  value={age}
                  onChange={e => setAge(Number(e.target.value))}
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label>Biological Sex</label>
                <div className={styles.sexToggle}>
                  <button
                    className={`${styles.toggleBtn} ${!isFemale ? styles.activeToggle : ''}`}
                    onClick={() => setIsFemale(false)}
                  >
                    Male
                  </button>
                  <button
                    className={`${styles.toggleBtn} ${isFemale ? styles.activeToggle : ''}`}
                    onClick={() => setIsFemale(true)}
                  >
                    Female (0.85x)
                  </button>
                </div>
              </div>

              <div className={styles.field}>
                <label>Total Body Weight (kg)</label>
                <input
                  type="number"
                  min="30"
                  max="200"
                  value={weightKg}
                  onChange={e => setWeightKg(Number(e.target.value))}
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label>Serum Creatinine (mg/dL)</label>
                <input
                  type="number"
                  min="0.2"
                  max="10.0"
                  step="0.1"
                  value={serumCreatinine}
                  onChange={e => setSerumCreatinine(Number(e.target.value))}
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label>Measured Serum Level</label>
                <input
                  type="text"
                  value={measuredSerumLevel}
                  onChange={e => setMeasuredSerumLevel(e.target.value)}
                  className={styles.input}
                  placeholder="e.g. 14.5 µg/mL"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Computed Outputs & Clinical Recommendations */}
        <div className={styles.outputSection}>
          {/* Renal Clearance Card */}
          <div className={styles.card}>
            <div className={styles.crClHeader}>
              <div>
                <span className={styles.label}>Estimated Creatinine Clearance (Cockcroft-Gault)</span>
                <div className={styles.crClValue}>
                  {crCl.toFixed(1)} <small>mL/min</small>
                </div>
              </div>
              <span className={`${styles.stageBadge} ${styles[crClStage.color]}`}>
                {crClStage.stage}
              </span>
            </div>
            <div className={styles.formulaNote}>
              Formula: [((140 - Age) × Weight) / (72 × SCr)] {isFemale ? '× 0.85' : '× 1.0'}
            </div>
          </div>

          {/* Dosing Recommendation Card */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>TDM Clinical Recommendation: {selectedDrug.name}</h3>

            <div className={styles.recommendationGrid}>
              <div className={styles.recItem}>
                <span className={styles.recLabel}>Target Therapeutic Range</span>
                <span className={styles.recValueHighlight}>{selectedDrug.targetTherapeuticRange}</span>
              </div>
              <div className={styles.recItem}>
                <span className={styles.recLabel}>Target Trough Window</span>
                <span className={styles.recValue}>{selectedDrug.targetTrough}</span>
              </div>
              <div className={styles.recItem}>
                <span className={styles.recLabel}>Toxic Threshold</span>
                <span className={styles.recValueDanger}>{selectedDrug.toxicThreshold}</span>
              </div>
              <div className={styles.recItem}>
                <span className={styles.recLabel}>Recommended Adjusted Dose</span>
                <span className={styles.recValue}>{doseAdjustment.recommendedDoseMg} mg</span>
              </div>
              <div className={styles.recItem}>
                <span className={styles.recLabel}>Recommended Dosing Interval</span>
                <span className={styles.recValue}>Every {doseAdjustment.recommendedIntervalHours} hours</span>
              </div>
              <div className={styles.recItem}>
                <span className={styles.recLabel}>Expected Steady-State Trough</span>
                <span className={styles.recValue}>{doseAdjustment.expectedTroughUgMl} µg/mL</span>
              </div>
            </div>

            <div className={styles.clinicalNoteBox}>
              <strong>Clinical Assessment:</strong> {doseAdjustment.clinicalNote}
            </div>

            <div className={styles.adviceBox}>
              <strong>Sampling Protocol:</strong> {selectedDrug.samplingTimeAdvice}
            </div>

            <div className={styles.toxicityBox}>
              <strong>Potential Toxicity Signs:</strong> {selectedDrug.toxicitySigns.join(', ')}
            </div>

            <div className={styles.pearlBox}>
              <strong>💡 Pharmacist Pearl:</strong> {selectedDrug.clinicalPearl}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
