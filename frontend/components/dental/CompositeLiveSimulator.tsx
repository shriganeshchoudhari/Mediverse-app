'use client';
import React, { useState, useMemo } from 'react';
import styles from './CompositeLiveSimulator.module.css';

interface Layer {
  id: number;
  thicknessMm: number;
  polymerized: boolean;
}

export default function CompositeLiveSimulator() {
  const [cavityClass, setCavityClass] = useState<'I' | 'II' | 'III' | 'IV'>('I');
  const [compositeType, setCompositeType] = useState<'conventional' | 'bulk_fill' | 'flowable'>('conventional');
  const [lightType, setLightType] = useState<'halogen' | 'led'>('led');
  const [layers, setLayers] = useState<Layer[]>([]);
  const [showStress, setShowStress] = useState(false);
  
  const currentDepthMm = layers.reduce((acc, l) => acc + l.thicknessMm, 0);

  const calculateCFactor = (cClass: string) => {
    switch (cClass) {
      case 'I': return 5;
      case 'II': return 2.5;
      case 'III': return 1.5;
      case 'IV': return 1;
      default: return 5;
    }
  };

  const cFactor = calculateCFactor(cavityClass);

  const addLayer = () => {
    const maxIncrement = compositeType === 'bulk_fill' ? 4 : 2;
    if (currentDepthMm >= 6) {
      alert('Maximum cavity depth (6mm) reached.');
      return;
    }
    const remaining = 6 - currentDepthMm;
    const thickness = Math.min(maxIncrement, remaining);
    
    setLayers([...layers, { id: Date.now(), thicknessMm: thickness, polymerized: false }]);
  };

  const polymerizeLayer = (id: number) => {
    setLayers(layers.map(l => l.id === id ? { ...l, polymerized: true } : l));
  };

  const resetLayers = () => setLayers([]);

  // Calculate stress score based on polymerized layers and C-factor
  const stressScore = useMemo(() => {
    const polymerizedLayers = layers.filter(l => l.polymerized);
    if (polymerizedLayers.length === 0) return 0;
    
    let baseStress = cFactor * 10;
    if (compositeType === 'flowable') baseStress *= 0.5;
    if (compositeType === 'bulk_fill') baseStress *= 0.8;
    
    // Higher stress if fewer thick increments
    return Math.round(baseStress * (1 + (4 / Math.max(1, polymerizedLayers.length))));
  }, [layers, cFactor, compositeType]);

  return (
    <div className={styles.container}>
      {/* Top Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolGroup}>
          <label>Cavity Class:</label>
          <select value={cavityClass} onChange={e => setCavityClass(e.target.value as any)}>
            <option value="I">Class I</option>
            <option value="II">Class II</option>
            <option value="III">Class III</option>
            <option value="IV">Class IV</option>
          </select>
        </div>
        <div className={styles.toolGroup}>
          <label>Composite:</label>
          <select value={compositeType} onChange={e => setCompositeType(e.target.value as any)}>
            <option value="conventional">Conventional</option>
            <option value="bulk_fill">Bulk Fill</option>
            <option value="flowable">Flowable</option>
          </select>
        </div>
        <div className={styles.toolGroup}>
          <label>Light:</label>
          <select value={lightType} onChange={e => setLightType(e.target.value as any)}>
            <option value="led">LED</option>
            <option value="halogen">Halogen</option>
          </select>
        </div>
        <div className={styles.toolGroup}>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" checked={showStress} onChange={e => setShowStress(e.target.checked)} />
            Show Stress
          </label>
        </div>
      </div>

      <div className={styles.mainContent}>
        {/* Left: SVG Canvas */}
        <div className={styles.canvasPanel}>
          <svg viewBox="0 0 350 400" className={styles.svg}>
            <rect width="350" height="400" fill="#1e293b" />
            
            {/* Tooth/Cavity Outline (Simplified representation) */}
            <path d="M 50 100 L 50 350 C 50 380, 300 380, 300 350 L 300 100 L 250 100 L 250 280 C 250 300, 100 300, 100 280 L 100 100 Z" fill="#d4a574" />
            
            {/* Rendering layers from bottom up */}
            {layers.map((layer, index) => {
              // Calculate starting Y position from bottom
              const pixelsPerMm = 30; // 30px per mm
              const layerHeight = layer.thicknessMm * pixelsPerMm;
              
              // Sum heights of previous layers
              const previousHeight = layers.slice(0, index).reduce((acc, l) => acc + l.thicknessMm * pixelsPerMm, 0);
              
              const yBottom = 290 - previousHeight;
              const yTop = yBottom - layerHeight;
              
              return (
                <g key={layer.id}>
                  <rect 
                    x="105" 
                    y={yTop} 
                    width="140" 
                    height={layerHeight} 
                    fill={layer.polymerized ? "#10b981" : "#6ee7b7"} 
                    stroke="#047857"
                    strokeWidth="1"
                  />
                  {showStress && layer.polymerized && (
                     <path d={`M 175 ${yTop + layerHeight/2} Q 120 ${yTop + layerHeight/2 - 10}, 105 ${yTop + layerHeight/2}`} fill="none" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowhead)" />
                  )}
                  {showStress && layer.polymerized && (
                     <path d={`M 175 ${yTop + layerHeight/2} Q 230 ${yTop + layerHeight/2 - 10}, 245 ${yTop + layerHeight/2}`} fill="none" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowhead)" />
                  )}
                </g>
              );
            })}

            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
              </marker>
            </defs>
          </svg>
        </div>

        {/* Right: Controls */}
        <div className={styles.controlsPanel}>
          <div className={styles.statsCard}>
            <div className={styles.statItem}>
              <span>C-Factor</span>
              <strong>{cFactor}</strong>
            </div>
            <div className={styles.statItem}>
              <span>Total Depth</span>
              <strong>{currentDepthMm.toFixed(1)} mm</strong>
            </div>
          </div>

          <div className={styles.actionButtons}>
            <button onClick={addLayer} disabled={currentDepthMm >= 6} className={styles.primaryBtn}>
              Add Increment ({compositeType === 'bulk_fill' ? '4mm max' : '2mm max'})
            </button>
            <button onClick={resetLayers} className={styles.secondaryBtn}>
              Reset
            </button>
          </div>

          <div className={styles.layerStack}>
            <h4>Increments</h4>
            {layers.length === 0 ? <p className={styles.emptyMsg}>No layers added yet.</p> : (
              layers.map((layer, idx) => (
                <div key={layer.id} className={styles.layerRow}>
                  <span>Layer {idx + 1} ({layer.thicknessMm}mm)</span>
                  {layer.polymerized ? (
                    <span className={styles.statusDone}>Cured</span>
                  ) : (
                    <button onClick={() => polymerizeLayer(layer.id)} className={styles.cureBtn}>Cure</button>
                  )}
                </div>
              ))
            )}
          </div>

          <div className={styles.riskPanel}>
            <h4>Risk Assessment</h4>
            <ul>
              <li>Sensitivity Risk: <strong style={{ color: stressScore > 50 ? '#ef4444' : '#10b981' }}>{stressScore > 50 ? 'High' : stressScore > 25 ? 'Medium' : 'Low'}</strong></li>
              <li>Shrinkage Stress Score: {stressScore}</li>
              {compositeType !== 'bulk_fill' && layers.some(l => l.thicknessMm > 2) && (
                <li className={styles.warning}>Warning: Increment exceeds 2mm for conventional composite.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
