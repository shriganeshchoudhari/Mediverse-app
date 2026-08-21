'use client';

import React, { useState, useMemo } from 'react';
import styles from './CTSliceWindowViewer.module.css';

interface WindowPreset {
  id: string;
  name: string;
  ww: number;
  wl: number;
  region: string;
  structures: string;
}

const PRESETS: WindowPreset[] = [
  { id: 'brain', name: 'Brain Window', ww: 80, wl: 40, region: 'Head / Brain', structures: 'Gray/white matter differentiation, acute ischemic stroke, early edema.' },
  { id: 'subdural', name: 'Subdural / Blood Window', ww: 200, wl: 80, region: 'Head / Cranium', structures: 'Acute hemorrhage, subdural/epidural hematoma against inner skull.' },
  { id: 'bone', name: 'Bone Window', ww: 2000, wl: 500, region: 'Skeletal', structures: 'Cortical bone detail, trabecular fractures, skull base foramen evaluation.' },
  { id: 'lung', name: 'Lung Window', ww: 1500, wl: -600, region: 'Thorax / Pulmonary', structures: 'Bronchovascular markings, ground-glass opacities, pneumothorax, pulmonary nodules.' },
  { id: 'soft-tissue', name: 'Soft Tissue / Mediastinal', ww: 350, wl: 50, region: 'Thorax / Abdomen', structures: 'Lymph nodes, major vascular structures, mediastinal masses.' },
  { id: 'liver', name: 'Liver / Abdomen Window', ww: 150, wl: 30, region: 'Abdomen / Hepatic', structures: 'Hepatic parenchyma, low-contrast metastases, portal vein contrast.' }
];

export default function CTSliceWindowViewer() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('brain');
  const [windowWidth, setWindowWidth] = useState<number>(80);
  const [windowLevel, setWindowLevel] = useState<number>(40);

  const currentPreset = useMemo(() => {
    return PRESETS.find(p => p.id === selectedPresetId) || PRESETS[0];
  }, [selectedPresetId]);

  const handleSelectPreset = (p: WindowPreset) => {
    setSelectedPresetId(p.id);
    setWindowWidth(p.ww);
    setWindowLevel(p.wl);
  };

  const huRange = useMemo(() => {
    const minHU = Math.round(windowLevel - windowWidth / 2);
    const maxHU = Math.round(windowLevel + windowWidth / 2);
    return { minHU, maxHU };
  }, [windowWidth, windowLevel]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>CT Hounsfield Unit (HU) & 3D Slice Windowing Explorer</h2>
        <p className={styles.subtitle}>
          Interactive computed tomography diagnostic windowing tool with live Window Width (WW) and Window Level (WL) adjustment across all tissue densities.
        </p>
      </header>

      {/* Preset Buttons Row */}
      <div className={styles.presetsRow}>
        {PRESETS.map(preset => (
          <button
            key={preset.id}
            className={`${styles.presetBtn} ${selectedPresetId === preset.id ? styles.activePreset : ''}`}
            onClick={() => handleSelectPreset(preset)}
          >
            <strong>{preset.name}</strong>
            <small>W:{preset.ww} / L:{preset.wl}</small>
          </button>
        ))}
      </div>

      <div className={styles.layout}>
        {/* Left: Slice Simulation Canvas */}
        <div className={styles.sliceCol}>
          <div className={styles.card}>
            <div className={styles.sliceHeader}>
              <span className={styles.sliceTitle}>{currentPreset.name} (Simulated CT Axial Slice)</span>
              <span className={styles.huBadge}>Range: {huRange.minHU} to {huRange.maxHU} HU</span>
            </div>

            <div className={styles.sliceSvgWrapper}>
              <svg viewBox="0 0 320 320" className={styles.sliceSvg}>
                {/* Simulated CT Gantry Aperture */}
                <circle cx="160" cy="160" r="150" fill="#000000" stroke="#334155" strokeWidth="3" />

                {/* Skull Bone Ring (+1000 HU) */}
                <ellipse
                  cx="160"
                  cy="160"
                  rx="120"
                  ry="135"
                  fill="none"
                  stroke={windowLevel > 200 ? '#ffffff' : '#e2e8f0'}
                  strokeWidth={windowLevel > 200 ? '16' : '10'}
                />

                {/* Brain Parenchyma / Soft Tissue (+35 HU) */}
                <ellipse
                  cx="160"
                  cy="160"
                  rx="108"
                  ry="122"
                  fill={windowLevel < 100 && windowWidth < 200 ? '#64748b' : '#334155'}
                />

                {/* Ventricles CSF (0 to +10 HU - Dark) */}
                <path
                  d="M 140 130 C 130 150, 130 170, 140 190 C 145 170, 145 150, 140 130 Z"
                  fill={windowLevel < 60 ? '#0f172a' : '#1e293b'}
                />
                <path
                  d="M 180 130 C 190 150, 190 170, 180 190 C 175 170, 175 150, 180 130 Z"
                  fill={windowLevel < 60 ? '#0f172a' : '#1e293b'}
                />

                {/* Grid Overlay */}
                <line x1="160" y1="20" x2="160" y2="300" stroke="#1e293b" strokeDasharray="4 4" />
                <line x1="20" y1="160" x2="300" y2="160" stroke="#1e293b" strokeDasharray="4 4" />
                <text x="160" y="295" fill="#64748b" fontSize="10" textAnchor="middle">Anterior ↑ Posterior ↓</text>
              </svg>
            </div>

            <div className={styles.structuresBox}>
              <strong>Visualized Anatomy & Pathology:</strong>
              <p>{currentPreset.structures}</p>
            </div>
          </div>
        </div>

        {/* Right: Window Controls & HU Density Scale */}
        <div className={styles.controlsCol}>
          {/* Dual WW / WL Sliders */}
          <div className={styles.card}>
            <h3 className={styles.cardHeading}>CT Window Width & Window Level Controls</h3>
            
            <div className={styles.sliderGroup}>
              <div className={styles.sliderHeader}>
                <span>Window Width (WW — Contrast Range):</span>
                <strong>{windowWidth} HU</strong>
              </div>
              <input
                type="range"
                min="50"
                max="2500"
                step="10"
                value={windowWidth}
                onChange={e => setWindowWidth(Number(e.target.value))}
                className={styles.rangeSlider}
              />
              <small className={styles.hint}>Narrow WW = Higher Contrast | Wide WW = Broad Dynamic Range</small>
            </div>

            <div className={styles.sliderGroup}>
              <div className={styles.sliderHeader}>
                <span>Window Level (WL — Midpoint Brightness):</span>
                <strong>{windowLevel} HU</strong>
              </div>
              <input
                type="range"
                min="-800"
                max="800"
                step="10"
                value={windowLevel}
                onChange={e => setWindowLevel(Number(e.target.value))}
                className={styles.rangeSlider}
              />
              <small className={styles.hint}>Centers the grayscale window at tissue attenuation density</small>
            </div>
          </div>

          {/* Standard Hounsfield Scale Reference */}
          <div className={styles.card}>
            <h3 className={styles.cardHeading}>Standard Hounsfield Unit (HU) Reference Scale</h3>
            <div className={styles.huList}>
              <div className={styles.huItem}><span className={styles.huAir}>-1000 HU</span> <strong>Air / Pneumothorax</strong></div>
              <div className={styles.huItem}><span className={styles.huFat}>-100 to -50 HU</span> <strong>Fat / Adipose Tissue</strong></div>
              <div className={styles.huItem}><span className={styles.huWater}>0 HU</span> <strong>Water (Calibration Reference)</strong></div>
              <div className={styles.huItem}><span className={styles.huCSF}>+15 HU</span> <strong>Cerebrospinal Fluid (CSF)</strong></div>
              <div className={styles.huItem}><span className={styles.huSoft}>+30 to +45 HU</span> <strong>White / Gray Brain Matter</strong></div>
              <div className={styles.huItem}><span className={styles.huBlood}>+60 to +80 HU</span> <strong>Acute Clotted Blood</strong></div>
              <div className={styles.huItem}><span className={styles.huBone}>+400 to +1000 HU</span> <strong>Dense Cortical Bone</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
