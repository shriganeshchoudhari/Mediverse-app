'use client';

import React, { useState, useMemo } from 'react';
import styles from './NEWS2Simulator.module.css';

export default function NEWS2Simulator() {
  const [rr, setRr] = useState<number>(16);
  const [spo2, setSpo2] = useState<number>(98);
  const [isHypercapnic, setIsHypercapnic] = useState<boolean>(false);
  const [onOxygen, setOnOxygen] = useState<boolean>(false);
  const [sbp, setSbp] = useState<number>(120);
  const [hr, setHr] = useState<number>(75);
  const [consciousness, setConsciousness] = useState<'Alert' | 'CVPU'>('Alert');
  const [temp, setTemp] = useState<number>(37.0);

  // NEWS2 scoring calculation
  const { totalScore, subscores, riskTier, escalationProtocol, sbar } = useMemo(() => {
    let rrScore = 0;
    if (rr <= 8) rrScore = 3;
    else if (rr <= 11) rrScore = 1;
    else if (rr <= 20) rrScore = 0;
    else if (rr <= 24) rrScore = 2;
    else rrScore = 3;

    let spo2Score = 0;
    if (!isHypercapnic) {
      if (spo2 <= 91) spo2Score = 3;
      else if (spo2 <= 93) spo2Score = 2;
      else if (spo2 <= 95) spo2Score = 1;
      else spo2Score = 0;
    } else {
      if (spo2 <= 83) spo2Score = 3;
      else if (spo2 <= 85) spo2Score = 2;
      else if (spo2 <= 87) spo2Score = 1;
      else if (spo2 <= 92) spo2Score = 0;
      else if (spo2 <= 94) spo2Score = 1;
      else if (spo2 <= 96) spo2Score = 2;
      else spo2Score = 3;
    }

    const o2Score = onOxygen ? 2 : 0;

    let sbpScore = 0;
    if (sbp <= 90) sbpScore = 3;
    else if (sbp <= 100) sbpScore = 2;
    else if (sbp <= 110) sbpScore = 1;
    else if (sbp <= 219) sbpScore = 0;
    else sbpScore = 3;

    let hrScore = 0;
    if (hr <= 40) hrScore = 3;
    else if (hr <= 50) hrScore = 1;
    else if (hr <= 90) hrScore = 0;
    else if (hr <= 110) hrScore = 1;
    else if (hr <= 130) hrScore = 2;
    else hrScore = 3;

    const cvpuScore = consciousness === 'CVPU' ? 3 : 0;

    let tempScore = 0;
    if (temp <= 35.0) tempScore = 3;
    else if (temp <= 36.0) tempScore = 1;
    else if (temp <= 38.0) tempScore = 0;
    else if (temp <= 39.0) tempScore = 1;
    else tempScore = 2;

    const total = rrScore + spo2Score + o2Score + sbpScore + hrScore + cvpuScore + tempScore;

    let tier: 'Low' | 'Low-Medium' | 'Medium' | 'High' = 'Low';
    let protocol = 'Ward-based monitoring. Minimum 12-hourly vital checks.';
    if (total >= 7) {
      tier = 'High';
      protocol = 'EMERGENCY: Immediate review by Medical Emergency Team (MET / Rapid Response Team) and ICU consultant. Continuous monitoring.';
    } else if (total >= 5) {
      tier = 'Medium';
      protocol = 'URGENT: Urgent review by attending physician within 30 minutes. Hourly vital checks.';
    } else if (rrScore === 3 || spo2Score === 3 || sbpScore === 3 || hrScore === 3 || cvpuScore === 3 || tempScore === 3) {
      tier = 'Low-Medium';
      protocol = 'ALERT: Single red parameter (+3). Prompt review by registered nurse and attending doctor within 1 hour. 4-6 hourly monitoring.';
    }

    const sbarText = {
      situation: `This is Staff Nurse reporting on Patient in Ward 4B whose NEWS2 score has risen to ${total} (${tier} Risk).`,
      background: `Patient admitted with suspected infection / post-op monitoring, currently receiving ${onOxygen ? 'supplemental oxygen' : 'room air'}.`,
      assessment: `Current vitals: RR ${rr}/min, SpO2 ${spo2}%, SBP ${sbp} mmHg, HR ${hr} bpm, Consciousness ${consciousness}, Temp ${temp}°C.`,
      recommendation: `I request an immediate bedside assessment, evaluation for MET/ICU escalation, and arterial blood gas / blood culture review.`
    };

    return {
      totalScore: total,
      subscores: { rrScore, spo2Score, o2Score, sbpScore, hrScore, cvpuScore, tempScore },
      riskTier: tier,
      escalationProtocol: protocol,
      sbar: sbarText
    };
  }, [rr, spo2, isHypercapnic, onOxygen, sbp, hr, consciousness, temp]);

  const handleApplyPreset = (type: 'sepsis' | 'asthma' | 'stable') => {
    if (type === 'sepsis') {
      setRr(28); setSpo2(91); setOnOxygen(true); setSbp(86); setHr(125); setConsciousness('CVPU'); setTemp(39.4);
    } else if (type === 'asthma') {
      setRr(26); setSpo2(92); setOnOxygen(true); setSbp(135); setHr(115); setConsciousness('Alert'); setTemp(37.2);
    } else {
      setRr(16); setSpo2(98); setOnOxygen(false); setSbp(120); setHr(72); setConsciousness('Alert'); setTemp(36.8);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>NEWS2 Clinical Deterioration & SBAR Escalation Simulator</h2>
        <p className={styles.subtitle}>
          National Early Warning Score 2 algorithm for early detection of clinical decline with automated SBAR structured escalation reporting.
        </p>
      </header>

      {/* Preset Row */}
      <div className={styles.presetRow}>
        <span className={styles.presetLabel}>Simulated Clinical Case Scenarios:</span>
        <button className={styles.presetBtn} onClick={() => handleApplyPreset('sepsis')}>
          Severe Sepsis Shock (High Risk Red Alert ≥ 7)
        </button>
        <button className={styles.presetBtn} onClick={() => handleApplyPreset('asthma')}>
          Acute Severe Asthma Exacerbation (Medium Risk 5-6)
        </button>
        <button className={styles.presetBtn} onClick={() => handleApplyPreset('stable')}>
          Stable Post-Operative Patient (Low Risk 0)
        </button>
      </div>

      <div className={styles.layout}>
        {/* Sliders Panel */}
        <div className={styles.slidersPanel}>
          <h3 className={styles.panelTitle}>1. Physiological Vital Parameters</h3>

          <div className={styles.formGroup}>
            <div className={styles.labelRow}>
              <label>Respiration Rate</label>
              <span className={styles.valBadge}>{rr} /min <small>({subscores.rrScore} pts)</small></span>
            </div>
            <input type="range" min="6" max="40" value={rr} onChange={e => setRr(Number(e.target.value))} className={styles.slider} />
          </div>

          <div className={styles.formGroup}>
            <div className={styles.labelRow}>
              <label>Oxygen Saturation (SpO2)</label>
              <span className={styles.valBadge}>{spo2} % <small>({subscores.spo2Score} pts)</small></span>
            </div>
            <input type="range" min="70" max="100" value={spo2} onChange={e => setSpo2(Number(e.target.value))} className={styles.slider} />
            <div className={styles.subCheck}>
              <label>
                <input type="checkbox" checked={isHypercapnic} onChange={e => setIsHypercapnic(e.target.checked)} />
                Target Scale 2 (Hypercapnic Respiratory Failure / COPD)
              </label>
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.labelRow}>
              <label>Supplemental Oxygen</label>
              <span className={styles.valBadge}>{onOxygen ? 'Yes (+2 pts)' : 'Room Air (0 pt)'}</span>
            </div>
            <div className={styles.btnToggleRow}>
              <button className={`${styles.toggleBtn} ${!onOxygen ? styles.activeToggle : ''}`} onClick={() => setOnOxygen(false)}>Room Air</button>
              <button className={`${styles.toggleBtn} ${onOxygen ? styles.activeToggle : ''}`} onClick={() => setOnOxygen(true)}>Oxygen Therapy</button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.labelRow}>
              <label>Systolic Blood Pressure</label>
              <span className={styles.valBadge}>{sbp} mmHg <small>({subscores.sbpScore} pts)</small></span>
            </div>
            <input type="range" min="60" max="240" step="2" value={sbp} onChange={e => setSbp(Number(e.target.value))} className={styles.slider} />
          </div>

          <div className={styles.formGroup}>
            <div className={styles.labelRow}>
              <label>Heart Rate</label>
              <span className={styles.valBadge}>{hr} bpm <small>({subscores.hrScore} pts)</small></span>
            </div>
            <input type="range" min="30" max="180" value={hr} onChange={e => setHr(Number(e.target.value))} className={styles.slider} />
          </div>

          <div className={styles.formGroup}>
            <div className={styles.labelRow}>
              <label>Level of Consciousness (ACVPU)</label>
              <span className={styles.valBadge}>{consciousness} <small>({subscores.cvpuScore} pts)</small></span>
            </div>
            <div className={styles.btnToggleRow}>
              <button className={`${styles.toggleBtn} ${consciousness === 'Alert' ? styles.activeToggle : ''}`} onClick={() => setConsciousness('Alert')}>Alert (A)</button>
              <button className={`${styles.toggleBtn} ${consciousness === 'CVPU' ? styles.activeToggle : ''}`} onClick={() => setConsciousness('CVPU')}>Confusion / Voice / Pain / Unresponsive (CVPU)</button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.labelRow}>
              <label>Body Temperature</label>
              <span className={styles.valBadge}>{temp} °C <small>({subscores.tempScore} pts)</small></span>
            </div>
            <input type="range" min="34.0" max="41.0" step="0.1" value={temp} onChange={e => setTemp(Number(e.target.value))} className={styles.slider} />
          </div>
        </div>

        {/* Results & SBAR Panel */}
        <div className={styles.resultsPanel}>
          <div className={styles.card}>
            <span className={styles.label}>NEWS2 Aggregate Score</span>
            <div className={styles.scoreVal}>{totalScore} <small>/ 20</small></div>
            <div className={`${styles.tierBadge} ${styles[riskTier.toLowerCase().replace('-', '')]}`}>
              {riskTier.toUpperCase()} CLINICAL RISK
            </div>

            <div className={styles.protocolBox}>
              <strong>Escalation Clinical Protocol:</strong>
              <p>{escalationProtocol}</p>
            </div>
          </div>

          {/* SBAR Structured Report */}
          <div className={styles.card}>
            <h3 className={styles.panelTitle}>SBAR Clinical Handover Tool</h3>
            <div className={styles.sbarContainer}>
              <div className={styles.sbarItem}>
                <span className={styles.sbarTag}>S (Situation)</span>
                <p>{sbar.situation}</p>
              </div>
              <div className={styles.sbarItem}>
                <span className={styles.sbarTag}>B (Background)</span>
                <p>{sbar.background}</p>
              </div>
              <div className={styles.sbarItem}>
                <span className={styles.sbarTag}>A (Assessment)</span>
                <p>{sbar.assessment}</p>
              </div>
              <div className={styles.sbarItem}>
                <span className={styles.sbarTag}>R (Recommendation)</span>
                <p>{sbar.recommendation}</p>
              </div>

              <div style={{ marginTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={async () => {
                    const { recordSimulationRun } = await import('@/lib/simulations/simulationPersistence');
                    const success = await recordSimulationRun(
                      'NEWS2_CLINICAL_ESCALATION',
                      { rr, spo2, isHypercapnic, onOxygen, sbp, hr, consciousness, temp },
                      { totalScore, riskTier, escalationProtocol, sbar }
                    );
                    if (success) {
                      alert('NEWS2 Vital Signs & SBAR Handover logged to Clinical Portfolio!');
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '0.625rem 1rem',
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  Log SBAR & NEWS2 to Clinical Portfolio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
