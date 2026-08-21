'use client';

import React, { useState, useMemo } from 'react';
import styles from './EpidemicOutbreakSimulator.module.css';

interface PathogenPreset {
  id: string;
  name: string;
  r0: number;
  incubation: number;
  recovery: number;
  cfr: string;
  mode: string;
}

const PATHOGEN_PRESETS: PathogenPreset[] = [
  { id: 'covid', name: 'COVID-19 (SARS-CoV-2 Omicron)', r0: 8.5, incubation: 3, recovery: 7, cfr: '0.1 - 0.3%', mode: 'Aerosol / Respiratory Droplets' },
  { id: 'measles', name: 'Measles Virus', r0: 16.0, incubation: 10, recovery: 14, cfr: '0.2 - 0.5%', mode: 'Airborne (Highly Contagious)' },
  { id: 'influenza', name: 'Pandemic Influenza A (H1N1)', r0: 1.8, incubation: 2, recovery: 5, cfr: '0.05 - 0.1%', mode: 'Droplet / Fomite Contact' },
  { id: 'nipah', name: 'Nipah Henipavirus', r0: 0.45, incubation: 9, recovery: 14, cfr: '40 - 75%', mode: 'Zoonotic / Close Contact' },
  { id: 'cholera', name: 'Vibrio cholerae (O1/O139)', r0: 2.4, incubation: 2, recovery: 5, cfr: '1 - 3% (Treated)', mode: 'Waterborne / Fecal-Oral' }
];

export default function EpidemicOutbreakSimulator() {
  const [selectedPathogenId, setSelectedPathogenId] = useState<string>('covid');
  const [populationN, setPopulationN] = useState<number>(100000);
  const [maskingActive, setMaskingActive] = useState<boolean>(false);
  const [distancingActive, setDistancingActive] = useState<boolean>(false);
  const [vaccinationPct, setVaccinationPct] = useState<number>(0);

  const currentPathogen = useMemo(() => {
    return PATHOGEN_PRESETS.find(p => p.id === selectedPathogenId) || PATHOGEN_PRESETS[0];
  }, [selectedPathogenId]);

  // Dynamic SEIR model calculations
  const simulation = useMemo(() => {
    let effectiveR0 = currentPathogen.r0;
    
    // NPI modifiers
    if (maskingActive) effectiveR0 *= 0.70; // 30% reduction
    if (distancingActive) effectiveR0 *= 0.60; // 40% reduction
    
    // Vaccination effect on susceptible pool: S_eff = S * (1 - V_eff)
    const effectiveVaccineCoverage = (vaccinationPct / 100) * 0.85; // 85% vaccine efficacy
    const susceptiblePool = populationN * (1 - effectiveVaccineCoverage);
    const effectiveRe = Number((effectiveR0 * (susceptiblePool / populationN)).toFixed(2));

    // Herd Immunity Threshold: HIT = 1 - (1 / R0)
    const hitPct = Math.max(0, Math.round((1 - (1 / currentPathogen.r0)) * 100));

    // Peak active cases estimation
    const peakPct = effectiveRe > 1 ? Math.min(0.40, (1 - (1 / effectiveRe)) * 0.45) : 0.02;
    const peakActiveCases = Math.round(populationN * peakPct);
    const icuDemandPeak = Math.round(peakActiveCases * 0.05); // 5% need ICU
    const icuCapacity = Math.round(populationN * 0.001); // 100 ICU beds per 100k

    const isIcuOverwhelmed = icuDemandPeak > icuCapacity;

    return { effectiveRe, hitPct, peakActiveCases, icuDemandPeak, icuCapacity, isIcuOverwhelmed };
  }, [currentPathogen, populationN, maskingActive, distancingActive, vaccinationPct]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>Epidemiological SIR / SEIR Outbreak & Pandemic Simulator</h2>
        <p className={styles.subtitle}>
          Interactive compartmental mathematical epidemic model: evaluate basic reproduction number (R₀), effective Re, Herd Immunity Threshold (HIT), and Non-Pharmaceutical Interventions (NPIs).
        </p>
      </header>

      {/* Pathogen Selector Tabs */}
      <div className={styles.pathogenTabs}>
        {PATHOGEN_PRESETS.map(p => (
          <button
            key={p.id}
            className={`${styles.pathogenBtn} ${selectedPathogenId === p.id ? styles.activePathogenBtn : ''}`}
            onClick={() => setSelectedPathogenId(p.id)}
          >
            <strong>{p.name.split('(')[0]}</strong>
            <small>R₀: {p.r0} | CFR: {p.cfr}</small>
          </button>
        ))}
      </div>

      <div className={styles.layout}>
        {/* Left: Epidemic Multi-Curve SVG Visualizer */}
        <div className={styles.visualCol}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.curveTitle}>Epidemic Curve Trajectory (SEIR Compartmental Flow)</span>
              <span className={styles.rBadge}>Effective Re: {simulation.effectiveRe}</span>
            </div>

            <div className={styles.curveSvgWrapper}>
              <svg viewBox="0 0 380 220" className={styles.curveSvg}>
                {/* Background Grid */}
                <line x1="40" y1="20" x2="40" y2="180" stroke="#334155" strokeWidth="1" />
                <line x1="40" y1="180" x2="360" y2="180" stroke="#334155" strokeWidth="1" />
                <text x="360" y="195" fill="#94a3b8" fontSize="9" textAnchor="end">Time (Days 0 to 120)</text>
                <text x="35" y="20" fill="#94a3b8" fontSize="9" textAnchor="end">Cases</text>

                {/* ICU Capacity Line (Dashed Amber) */}
                <line x1="40" y1="130" x2="360" y2="130" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 3" />
                <text x="355" y="125" fill="#fbbf24" fontSize="8" textAnchor="end">ICU Surge Bed Capacity</text>

                {/* Susceptible Curve S(t) (Blue) */}
                <path
                  d={`M 40 40 Q 160 50, 240 ${simulation.effectiveRe > 1 ? 160 : 60} T 360 ${simulation.effectiveRe > 1 ? 170 : 80}`}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="3"
                />

                {/* Infectious Peak Curve I(t) (Red) */}
                <path
                  d={`M 40 180 Q 140 ${simulation.effectiveRe > 1 ? (simulation.isIcuOverwhelmed ? 40 : 100) : 170}, 200 ${simulation.effectiveRe > 1 ? (simulation.isIcuOverwhelmed ? 40 : 100) : 170} T 360 180`}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="4"
                />

                {/* Recovered / Immune Curve R(t) (Green) */}
                <path
                  d={`M 40 180 Q 160 170, 240 ${simulation.effectiveRe > 1 ? 60 : 160} T 360 ${simulation.effectiveRe > 1 ? 45 : 150}`}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                />
              </svg>
            </div>

            {/* Curve Legend */}
            <div className={styles.legendRow}>
              <span className={styles.legendS}>🔵 Susceptible (S)</span>
              <span className={styles.legendI}>🔴 Infectious (I)</span>
              <span className={styles.legendR}>🟢 Recovered / Immune (R)</span>
              <span className={styles.legendICU}>🟡 ICU Threshold</span>
            </div>

            <div className={`${styles.icuAlert} ${simulation.isIcuOverwhelmed ? styles.icuRed : styles.icuGreen}`}>
              {simulation.isIcuOverwhelmed
                ? `🚨 Healthcare Collapse Warning: Peak ICU demand (${simulation.icuDemandPeak} beds) exceeds total capacity (${simulation.icuCapacity} beds)! Flatten the curve using NPIs.`
                : `✅ Healthcare System Stable: Peak ICU demand (${simulation.icuDemandPeak} beds) remains safely within hospital surge capacity.`}
            </div>
          </div>
        </div>

        {/* Right: Outbreak Metrics & NPI Policy Toggles */}
        <div className={styles.controlsCol}>
          {/* Key Outbreak Metrics */}
          <div className={styles.card}>
            <span className={styles.label}>Epidemiological Indicators</span>
            <div className={styles.metricsGrid}>
              <div className={styles.metricBox}>
                <span className={styles.metricVal}>{simulation.effectiveRe}</span>
                <span className={styles.metricSub}>Effective Re (R₀: {currentPathogen.r0})</span>
              </div>
              <div className={styles.metricBox}>
                <span className={styles.metricVal}>{simulation.hitPct}%</span>
                <span className={styles.metricSub}>Herd Immunity Threshold (HIT)</span>
              </div>
            </div>
          </div>

          {/* Non-Pharmaceutical Interventions (NPIs) */}
          <div className={styles.card}>
            <h3 className={styles.cardHeading}>Non-Pharmaceutical Interventions (NPIs)</h3>
            
            <label className={`${styles.toggleItem} ${maskingActive ? styles.activeToggle : ''}`}>
              <input
                type="checkbox"
                checked={maskingActive}
                onChange={e => setMaskingActive(e.target.checked)}
                className={styles.checkbox}
              />
              <div>
                <strong>Universal N95 / Surgical Mask Mandate</strong>
                <small>Reduces respiratory droplet transmission rate (β) by 30%</small>
              </div>
            </label>

            <label className={`${styles.toggleItem} ${distancingActive ? styles.activeToggle : ''}`}>
              <input
                type="checkbox"
                checked={distancingActive}
                onChange={e => setDistancingActive(e.target.checked)}
                className={styles.checkbox}
              />
              <div>
                <strong>Social Distancing & High-Risk Venue Closures</strong>
                <small>Decreases effective contact rate per unit time by 40%</small>
              </div>
            </label>

            <div className={styles.sliderGroup}>
              <div className={styles.sliderHeader}>
                <span>Population Vaccination Coverage:</span>
                <strong>{vaccinationPct}%</strong>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={vaccinationPct}
                onChange={e => setVaccinationPct(Number(e.target.value))}
                className={styles.rangeSlider}
              />
              <small className={styles.sliderHint}>Target HIT for this pathogen: ≥ {simulation.hitPct}% coverage</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
