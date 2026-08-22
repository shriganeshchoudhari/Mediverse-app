'use client';

import React, { useState, useMemo } from 'react';
import styles from './ToothMorphologyViewer.module.css';

interface ToothMetrics {
  rootCount: number;
  canalCount: number;
  crownHeight: number;
  rootLength: number;
  workingLengthAvg: number;
}

interface ToothData {
  id: string;
  name: string;
  type: 'permanent' | 'primary';
  metrics: ToothMetrics;
  vertucciType: string;
  pearl: string;
  anomaly: string;
  extractionTip: string;
}

const mockToothData: Record<string, ToothData> = {
  'UR1': {
    id: 'UR1',
    name: 'Maxillary Central Incisor',
    type: 'permanent',
    metrics: { rootCount: 1, canalCount: 1, crownHeight: 10.5, rootLength: 13, workingLengthAvg: 23.5 },
    vertucciType: 'Type I (100%)',
    pearl: 'Pulp chamber is widest mesiodistally.',
    anomaly: 'Dens invaginatus can occur, though more common in laterals.',
    extractionTip: 'Conical root allows for rotational movements during extraction.'
  },
  // Add fallback for others
};

function getToothData(id: string): ToothData {
  return mockToothData[id] || {
    id,
    name: 'Selected Tooth',
    type: 'permanent',
    metrics: { rootCount: 1, canalCount: 1, crownHeight: 10, rootLength: 15, workingLengthAvg: 25 },
    vertucciType: 'Type I (80%)',
    pearl: 'Standard clinical pearl.',
    anomaly: 'Standard anomaly.',
    extractionTip: 'Standard extraction tip.'
  };
}

const teethMaxillary = ['UR8', 'UR7', 'UR6', 'UR5', 'UR4', 'UR3', 'UR2', 'UR1', 'UL1', 'UL2', 'UL3', 'UL4', 'UL5', 'UL6', 'UL7', 'UL8'];
const teethMandibular = ['LR8', 'LR7', 'LR6', 'LR5', 'LR4', 'LR3', 'LR2', 'LR1', 'LL1', 'LL2', 'LL3', 'LL4', 'LL5', 'LL6', 'LL7', 'LL8'];

export default function ToothMorphologyViewer({ initialToothId = 'UR1' }: { initialToothId?: string }) {
  const [selectedToothId, setSelectedToothId] = useState(initialToothId);
  const [viewMode, setViewMode] = useState<'labial' | 'lingual' | 'mesial' | 'occlusal'>('labial');
  const [showLayers, setShowLayers] = useState({
    enamel: true,
    dentine: true,
    pulp: true,
    cementum: true,
    pdl: true
  });
  const [highlightCanal, setHighlightCanal] = useState(false);

  const toothData = useMemo(() => getToothData(selectedToothId), [selectedToothId]);

  return (
    <div className={styles.container}>
      {/* Left panel */}
      <div className={styles.leftPanel}>
        <h3 className={styles.panelTitle}>Tooth Selector</h3>
        <div className={styles.arch}>
          <div className={styles.archTitle}>Maxillary</div>
          <div className={styles.toothGrid}>
            {teethMaxillary.map(id => (
              <button
                key={id}
                className={`${styles.toothBtn} ${selectedToothId === id ? styles.selected : ''}`}
                onClick={() => setSelectedToothId(id)}
              >
                {id}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.arch}>
          <div className={styles.archTitle}>Mandibular</div>
          <div className={styles.toothGrid}>
            {teethMandibular.map(id => (
              <button
                key={id}
                className={`${styles.toothBtn} ${selectedToothId === id ? styles.selected : ''}`}
                onClick={() => setSelectedToothId(id)}
              >
                {id}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Center canvas */}
      <div className={styles.centerPanel}>
        <div className={styles.controlsTop}>
          {['labial', 'lingual', 'mesial', 'occlusal'].map(mode => (
            <button
              key={mode}
              className={`${styles.tabBtn} ${viewMode === mode ? styles.activeTab : ''}`}
              onClick={() => setViewMode(mode as any)}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
        
        <div className={styles.svgContainer}>
          <svg viewBox="0 0 400 600" className={styles.svg}>
            {/* Background/Base */}
            <rect width="400" height="600" fill="#1e293b" rx="8" />
            
            {showLayers.pdl && (
              <path d="M 160 300 C 160 500, 240 500, 240 300 Z" fill="#90ee90" />
            )}
            {showLayers.cementum && (
              <path d="M 165 290 C 165 490, 235 490, 235 290 Z" fill="#8b7355" />
            )}
            {showLayers.dentine && (
              <path d="M 150 150 C 150 50, 250 50, 250 150 C 250 250, 230 480, 200 480 C 170 480, 150 250, 150 150 Z" fill="#d4a574" />
            )}
            {showLayers.enamel && (
              <path d="M 140 150 C 140 20, 260 20, 260 150 C 260 170, 245 280, 200 280 C 155 280, 140 170, 140 150 Z" fill="#c8e6f0" opacity="0.9" />
            )}
            {showLayers.pulp && (
              <path d="M 175 160 C 175 100, 225 100, 225 160 C 225 200, 210 450, 200 450 C 190 450, 175 200, 175 160 Z" fill={highlightCanal ? "#facc15" : "#ef4444"} />
            )}
          </svg>
        </div>

        <div className={styles.layerToggles}>
          {Object.keys(showLayers).map(layer => (
            <label key={layer} className={styles.toggleLabel}>
              <input
                type="checkbox"
                checked={showLayers[layer as keyof typeof showLayers]}
                onChange={() => setShowLayers(prev => ({ ...prev, [layer]: !prev[layer as keyof typeof prev] }))}
              />
              {layer.charAt(0).toUpperCase() + layer.slice(1)}
            </label>
          ))}
          <label className={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={highlightCanal}
              onChange={() => setHighlightCanal(!highlightCanal)}
            />
            Highlight Canal
          </label>
        </div>
      </div>

      {/* Right inspector */}
      <div className={styles.rightPanel}>
        <div className={styles.headerBox}>
          <h2>{toothData.name}</h2>
          <div className={styles.chips}>
            <span className={styles.chip}>FDI: {toothData.id}</span>
          </div>
        </div>

        <div className={styles.metricsGrid}>
          <div className={styles.metricItem}>
            <div className={styles.metricLabel}>Roots</div>
            <div className={styles.metricValue}>{toothData.metrics.rootCount}</div>
          </div>
          <div className={styles.metricItem}>
            <div className={styles.metricLabel}>Canals</div>
            <div className={styles.metricValue}>{toothData.metrics.canalCount}</div>
          </div>
          <div className={styles.metricItem}>
            <div className={styles.metricLabel}>Crown Height</div>
            <div className={styles.metricValue}>{toothData.metrics.crownHeight}mm</div>
          </div>
          <div className={styles.metricItem}>
            <div className={styles.metricLabel}>Root Length</div>
            <div className={styles.metricValue}>{toothData.metrics.rootLength}mm</div>
          </div>
          <div className={styles.metricItem}>
            <div className={styles.metricLabel}>Working Length</div>
            <div className={styles.metricValue}>{toothData.metrics.workingLengthAvg}mm</div>
          </div>
        </div>

        <div className={styles.badge}>
          Vertucci Type: {toothData.vertucciType}
        </div>

        <div className={`${styles.infoBox} ${styles.pearlBox}`}>
          <h4>Clinical Pearl</h4>
          <p>{toothData.pearl}</p>
        </div>
        
        <div className={`${styles.infoBox} ${styles.anomalyBox}`}>
          <h4>Common Anomaly</h4>
          <p>{toothData.anomaly}</p>
        </div>

        <div className={`${styles.infoBox} ${styles.extractionBox}`}>
          <h4>Extraction Tip</h4>
          <p>{toothData.extractionTip}</p>
        </div>
      </div>
    </div>
  );
}
