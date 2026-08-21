'use client';

import React, { useState, useMemo } from 'react';
import styles from './RuminantPhysiologyViewer.module.css';

interface ChamberInfo {
  id: string;
  name: string;
  sanskritOrLatin: string;
  volumePct: string;
  lining: string;
  function: string;
  motility: string;
}

const CHAMBERS: ChamberInfo[] = [
  {
    id: 'rumen',
    name: '1. Rumen (Paunch)',
    sanskritOrLatin: 'Ventriculus ruminis',
    volumePct: '80% of total forestomach capacity (150-200L in adult cattle)',
    lining: 'Papillated stratified squamous non-glandular epithelium (shag carpet appearance) for VFA absorption',
    function: 'Microbial fermentation of cellulose/hemicellulose by bacteria (Fibrobacter, Ruminococcus), protozoa, and anaerobic fungi into VFAs.',
    motility: 'Primary mixing cycle (A-wave: 1-2 per min); Secondary eructation cycle (B-wave) expelling CO2 and CH4.'
  },
  {
    id: 'reticulum',
    name: '2. Reticulum (Honeycomb)',
    sanskritOrLatin: 'Ventriculus reticuli',
    volumePct: '5% of forestomach volume',
    lining: 'Raised intersecting ridges forming hexagonal cells (honeycomb pattern)',
    function: 'Particle size separation: passes small dense particles to omasum; traps heavy metallic foreign bodies (hardware disease).',
    motility: 'Biphasic contraction initiating each primary reticulo-ruminal mixing cycle.'
  },
  {
    id: 'omasum',
    name: '3. Omasum (Manyplies / Book)',
    sanskritOrLatin: 'Ventriculus omasi',
    volumePct: '7-8% of forestomach volume',
    lining: 'Over 100 longitudinal muscular laminae/leaves (book pages) covered with cornified papillae',
    function: 'Absorbs 60-70% of water and electrolytes (bicarbonate recycling); pumps concentrated particulate digesta to abomasum.',
    motility: 'Slow, forceful squeezing contractions of laminae.'
  },
  {
    id: 'abomasum',
    name: '4. Abomasum (True Acid Stomach)',
    sanskritOrLatin: 'Ventriculus abomasi',
    volumePct: '7-8% of stomach capacity',
    lining: 'True glandular mucosa with gastric pits secreting HCl and pepsin (pH 2.0 - 3.0), unique lysozyme secretion',
    function: 'Acidic chemical digestion of microbial protein and dietary bypass nutrients; lysozyme lyses bacterial cell walls.',
    motility: 'Peristaltic waves delivering acidic chyme to duodenum.'
  }
];

export default function RuminantPhysiologyViewer() {
  const [selectedChamberId, setSelectedChamberId] = useState<string>('rumen');
  const [foragePct, setForagePct] = useState<number>(70); // 70% forage, 30% concentrate
  const [dmiKgDay, setDmiKgDay] = useState<number>(20); // 20 kg DMI/day

  const currentChamber = useMemo(() => {
    return CHAMBERS.find(c => c.id === selectedChamberId) || CHAMBERS[0];
  }, [selectedChamberId]);

  // Rumen kinetics calculations
  const kinetics = useMemo(() => {
    // High forage -> high acetate (fiber); High concentrate -> high propionate (starch)
    const acetatePct = Math.round(50 + (foragePct / 100) * 20); // 50-70%
    const propionatePct = Math.round(40 - (foragePct / 100) * 25); // 15-40%
    const butyratePct = Math.max(10, 100 - acetatePct - propionatePct);

    // Rumen pH: normal 6.2 - 6.8 with forage; drops to < 5.5 in high concentrate
    const rumenPH = Number((5.2 + (foragePct / 100) * 1.5).toFixed(2));
    
    // Methane emissions (g/day)
    const methaneEmissions = Math.round(dmiKgDay * (18 + (foragePct / 100) * 6));

    let status = 'Healthy Ruminal Environment (Optimal Cellulolytic Activity)';
    let statusColor = 'green';
    if (rumenPH < 5.6) {
      status = 'Severe SARA (Subacute Ruminal Acidosis) — High Lactic Acid / Parakeratosis Risk';
      statusColor = 'red';
    } else if (rumenPH < 6.0) {
      status = 'Borderline Low Rumen pH — Depressed Milk Fat Syndrome';
      statusColor = 'amber';
    }

    return { acetatePct, propionatePct, butyratePct, rumenPH, methaneEmissions, status, statusColor };
  }, [foragePct, dmiKgDay]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>Ruminant Forestomach Physiology & Fermentation Simulator</h2>
        <p className={styles.subtitle}>
          Interactive 4-chambered bovine forestomach explorer with dietary forage-to-concentrate ratio sliders, live rumen pH calculation, and VFA stoichiometry.
        </p>
      </header>

      {/* 4 Chambers Selector */}
      <div className={styles.chamberTabs}>
        {CHAMBERS.map(ch => (
          <button
            key={ch.id}
            className={`${styles.chamberBtn} ${selectedChamberId === ch.id ? styles.activeChamberBtn : ''}`}
            onClick={() => setSelectedChamberId(ch.id)}
          >
            <strong>{ch.name}</strong>
            <small>{ch.sanskritOrLatin}</small>
          </button>
        ))}
      </div>

      <div className={styles.layout}>
        {/* Left: Forestomach Anatomical Representation */}
        <div className={styles.visCol}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.chamberTitle}>{currentChamber.name}</span>
              <span className={styles.capacityBadge}>{currentChamber.volumePct.split('(')[0]}</span>
            </div>

            <div className={styles.forestomachSvgWrapper}>
              <svg viewBox="0 0 360 240" className={styles.forestomachSvg}>
                {/* 4-Chamber SVG Visualizer with Selection Highlights */}
                {/* Rumen (Left big sac) */}
                <ellipse
                  cx="140"
                  cy="120"
                  rx="90"
                  ry="75"
                  fill={selectedChamberId === 'rumen' ? '#365314' : '#1e293b'}
                  stroke={selectedChamberId === 'rumen' ? '#84cc16' : '#334155'}
                  strokeWidth="3"
                />
                <text x="140" y="125" fill="#84cc16" fontSize="13" fontWeight="700" textAnchor="middle">RUMEN (80%)</text>
                <text x="140" y="142" fill="#cbd5e1" fontSize="10" textAnchor="middle">pH: {kinetics.rumenPH}</text>

                {/* Reticulum (Cranial Honeycomb) */}
                <circle
                  cx="250"
                  cy="80"
                  r="34"
                  fill={selectedChamberId === 'reticulum' ? '#3f6212' : '#1e293b'}
                  stroke={selectedChamberId === 'reticulum' ? '#a3e635' : '#334155'}
                  strokeWidth="3"
                />
                <text x="250" y="80" fill="#a3e635" fontSize="10" fontWeight="700" textAnchor="middle">RETICULUM</text>
                <text x="250" y="94" fill="#cbd5e1" fontSize="8" textAnchor="middle">Honeycomb</text>

                {/* Omasum (Spherical Book) */}
                <circle
                  cx="260"
                  cy="145"
                  r="26"
                  fill={selectedChamberId === 'omasum' ? '#14532d' : '#1e293b'}
                  stroke={selectedChamberId === 'omasum' ? '#22c55e' : '#334155'}
                  strokeWidth="3"
                />
                <text x="260" y="145" fill="#22c55e" fontSize="9" fontWeight="700" textAnchor="middle">OMASUM</text>
                <text x="260" y="157" fill="#cbd5e1" fontSize="8" textAnchor="middle">Manyplies</text>

                {/* Abomasum (True Acid Glandular Stomach) */}
                <ellipse
                  cx="290"
                  cy="190"
                  rx="32"
                  ry="20"
                  fill={selectedChamberId === 'abomasum' ? '#7f1d1d' : '#1e293b'}
                  stroke={selectedChamberId === 'abomasum' ? '#ef4444' : '#334155'}
                  strokeWidth="3"
                />
                <text x="290" y="193" fill="#f87171" fontSize="9" fontWeight="700" textAnchor="middle">ABOMASUM</text>
                <text x="290" y="204" fill="#fca5a5" fontSize="7" textAnchor="middle">pH 2-3</text>
              </svg>
            </div>

            <div className={styles.chamberDetails}>
              <div className={styles.detailRow}>
                <span className={styles.detailTag}>Mucosal Lining:</span>
                <p>{currentChamber.lining}</p>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailTag}>Primary Function:</span>
                <p>{currentChamber.function}</p>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailTag}>Motility Wave:</span>
                <p>{currentChamber.motility}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Fermentation Kinetics & Dietary Sliders */}
        <div className={styles.controlsCol}>
          {/* Rumen pH & VFA Stoichiometry Monitor */}
          <div className={styles.card}>
            <span className={styles.label}>Rumen Fermentation Stoichiometry</span>
            
            <div className={styles.phBox}>
              <span className={styles.phVal}>{kinetics.rumenPH}</span>
              <span className={styles.phLabel}>Rumen Liquid pH (Target: 6.2 - 6.8)</span>
            </div>

            <div className={`${styles.statusBanner} ${styles[kinetics.statusColor]}`}>
              {kinetics.status}
            </div>

            {/* VFA Ratios */}
            <div className={styles.vfaGrid}>
              <div className={styles.vfaBox}>
                <span className={styles.vfaVal}>{kinetics.acetatePct}%</span>
                <span className={styles.vfaType}>Acetate (C2 — Milk Fat)</span>
              </div>
              <div className={styles.vfaBox}>
                <span className={styles.vfaVal}>{kinetics.propionatePct}%</span>
                <span className={styles.vfaType}>Propionate (C3 — Glucose)</span>
              </div>
              <div className={styles.vfaBox}>
                <span className={styles.vfaVal}>{kinetics.butyratePct}%</span>
                <span className={styles.vfaType}>Butyrate (C4 — Epithelium)</span>
              </div>
            </div>
          </div>

          {/* Dietary Sliders */}
          <div className={styles.card}>
            <h3 className={styles.cardHeading}>Dietary Formulation Input</h3>
            
            <div className={styles.sliderGroup}>
              <div className={styles.sliderHeader}>
                <span>Forage / Roughage Ratio:</span>
                <strong>{foragePct}% Forage / {100 - foragePct}% Grain</strong>
              </div>
              <input
                type="range"
                min="10"
                max="95"
                step="5"
                value={foragePct}
                onChange={e => setForagePct(Number(e.target.value))}
                className={styles.rangeSlider}
              />
              <small className={styles.sliderHint}>Higher grain decreases pH and increases propionate (gluconeogenesis)</small>
            </div>

            <div className={styles.sliderGroup}>
              <div className={styles.sliderHeader}>
                <span>Dry Matter Intake (DMI):</span>
                <strong>{dmiKgDay} kg/day</strong>
              </div>
              <input
                type="range"
                min="8"
                max="32"
                step="1"
                value={dmiKgDay}
                onChange={e => setDmiKgDay(Number(e.target.value))}
                className={styles.rangeSlider}
              />
              <small className={styles.sliderHint}>Estimated Enteric CH₄: {kinetics.methaneEmissions} g/day</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
