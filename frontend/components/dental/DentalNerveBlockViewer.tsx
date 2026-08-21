'use client';

/**
 * DentalNerveBlockViewer.tsx — Interactive Dental Nerve Block & Local Anesthesia Simulator
 * 
 * Provides interactive needle trajectory calibration (depth & angle), real-time
 * aspiration feedback, tissue boundary collision detection, and clinical complications warnings.
 */

import React, { useState, useMemo } from 'react';
import {
  DENTAL_NERVE_BLOCKS,
  getDentalNerveBlockById,
  type NerveBlockTechnique,
} from '@/lib/dental/NerveBlockPresets';
import styles from './DentalNerveBlockViewer.module.css';

interface DentalNerveBlockViewerProps {
  initialTechniqueId?: string;
  onTechniqueSelect?: (tech: NerveBlockTechnique) => void;
}

export default function DentalNerveBlockViewer({
  initialTechniqueId = 'ianb',
  onTechniqueSelect,
}: DentalNerveBlockViewerProps) {
  const [selectedTechId, setSelectedTechId] = useState<string>(initialTechniqueId);
  const [needleDepthMm, setNeedleDepthMm] = useState<number>(20);
  const [needleAngleDeg, setNeedleAngleDeg] = useState<number>(45);
  const [aspirated, setAspirated] = useState<boolean>(false);
  const [aspirationResult, setAspirationResult] = useState<'none' | 'negative' | 'positive'>('none');
  const [injected, setInjected] = useState<boolean>(false);

  const currentTech = useMemo(() => {
    return getDentalNerveBlockById(selectedTechId) || DENTAL_NERVE_BLOCKS[0];
  }, [selectedTechId]);

  // Real-time evaluation of needle placement
  const evaluation = useMemo(() => {
    const depthDiff = Math.abs(needleDepthMm - currentTech.idealDepthMm);
    const angleDiff = Math.abs(needleAngleDeg - currentTech.idealAngleDeg);

    const isDepthOk = depthDiff <= currentTech.depthToleranceMm;
    const isAngleOk = angleDiff <= currentTech.angleToleranceDeg;

    let status: 'success' | 'warning' | 'danger' = 'success';
    let message = '';
    let complications: string[] = [];

    if (currentTech.id === 'ianb') {
      if (needleDepthMm > 30) {
        status = 'danger';
        message = '🚨 CRITICAL DANGER: Needle penetrated posterior border into Parotid Capsule! Risk of transient Facial Nerve (CN VII) palsy and ptosis.';
        complications.push('Transient Facial Nerve Paralysis', 'Parotid Gland Capsule Puncture');
      } else if (needleAngleDeg < 30) {
        status = 'warning';
        message = '⚠️ Premature bone contact with anterior coronoid notch / internal oblique ridge. Withdraw slightly and redirect toward premolars.';
        complications.push('Incomplete Anesthesia', 'Periosteal Tearing');
      } else if (needleDepthMm < 15) {
        status = 'warning';
        message = '⚠️ Too shallow! Needle has only infiltrated lingual nerve space; pulpal anesthesia of mandibular molars will fail.';
        complications.push('Partial Lingual Block only', 'Failed Pulpal Anesthesia');
      } else if (isDepthOk && isAngleOk) {
        status = 'success';
        message = '🎯 EXCELLENT PLACEMENT: Needle tip rests precisely above mandibular foramen and lingula within pterygomandibular space.';
      } else {
        status = 'warning';
        message = `⚠️ Sub-optimal angulation (${needleAngleDeg}° vs ${currentTech.idealAngleDeg}°) or depth (${needleDepthMm}mm vs ${currentTech.idealDepthMm}mm).`;
      }
    } else if (currentTech.id === 'gow_gates') {
      if (needleDepthMm > 30) {
        status = 'danger';
        message = '🚨 CRITICAL: Needle inserted too deeply into infratemporal fossa with risk of internal maxillary artery puncture.';
        complications.push('Internal Maxillary Artery Puncture', 'Extensive Hematoma');
      } else if (isDepthOk && isAngleOk) {
        status = 'success';
        message = '🎯 OPTIMAL: Needle tip contacts neck of mandibular condyle immediately below lateral pterygoid insertion.';
      } else {
        status = 'warning';
        message = '⚠️ Needle off target. Ensure trajectory aligns with intertragic notch of ear.';
      }
    } else {
      if (isDepthOk && isAngleOk) {
        status = 'success';
        message = `🎯 OPTIMAL: Needle accurately positioned at target landmark for ${currentTech.shortName}.`;
      } else {
        status = 'warning';
        message = `⚠️ Moderate deviation from ideal parameters (Depth: ${needleDepthMm}mm vs ${currentTech.idealDepthMm}mm, Angle: ${needleAngleDeg}° vs ${currentTech.idealAngleDeg}°).`;
      }
    }

    return { isDepthOk, isAngleOk, status, message, complications };
  }, [needleDepthMm, needleAngleDeg, currentTech]);

  const handleTechniqueChange = (techId: string) => {
    setSelectedTechId(techId);
    const tech = getDentalNerveBlockById(techId) || DENTAL_NERVE_BLOCKS[0];
    setNeedleDepthMm(tech.idealDepthMm);
    setNeedleAngleDeg(tech.idealAngleDeg);
    setAspirated(false);
    setAspirationResult('none');
    setInjected(false);
    if (onTechniqueSelect) {
      onTechniqueSelect(tech);
    }
  };

  const handleAspirationTest = () => {
    setAspirated(true);
    // Simulating positive aspiration probability based on anatomical risk
    const isPositive = Math.random() * 100 < currentTech.aspirationPositiveRatePercent;
    setAspirationResult(isPositive ? 'positive' : 'negative');
  };

  const handleInjectAnesthetic = () => {
    if (!aspirated) {
      alert('⚠️ Best Clinical Practice: Always perform an aspiration test before injecting local anesthetic!');
    }
    setInjected(true);
  };

  const handleReset = () => {
    setNeedleDepthMm(currentTech.idealDepthMm);
    setNeedleAngleDeg(currentTech.idealAngleDeg);
    setAspirated(false);
    setAspirationResult('none');
    setInjected(false);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.headerIcon}>🦷</span>
          <div>
            <h2 className={styles.title}>3D Dental Nerve Block Simulator</h2>
            <p className={styles.subtitle}>
              Maxillofacial Landmark Navigation &middot; Injection Angles &middot; Aspiration Safety
            </p>
          </div>
        </div>

        <button onClick={handleReset} className={styles.resetButton}>
          🔄 Reset Calibration
        </button>
      </header>

      {/* Technique Selector Tabs */}
      <div className={styles.techniqueTabs}>
        {DENTAL_NERVE_BLOCKS.map((tech) => (
          <button
            key={tech.id}
            onClick={() => handleTechniqueChange(tech.id)}
            className={`${styles.techniqueTab} ${selectedTechId === tech.id ? styles.techniqueTabActive : ''}`}
          >
            {tech.shortName}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className={styles.mainGrid}>
        {/* Left: Anatomical & Needle Trajectory Visualizer */}
        <div className={styles.visualizerCard}>
          <div className={styles.canvasContainer}>
            <svg
              viewBox="-200 -200 400 400"
              className={styles.mandibleSvg}
              aria-label="Dental Injection Trajectory Canvas"
            >
              {/* Maxillofacial Silhouette: Mandibular Ramus and Condyle */}
              <defs>
                <radialGradient id="targetGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Mandibular Bone Contours */}
              <path
                d="M -120 40 C -120 120, -60 160, 60 160 C 130 160, 160 110, 160 30 L 160 -100 C 160 -140, 130 -160, 110 -150 L 100 -80 L 70 -50 L 50 40 Z"
                fill="#1e293b"
                stroke="#475569"
                strokeWidth="4"
              />

              {/* Coronoid Notch Landmark */}
              <circle cx="70" cy="-50" r="8" fill="#f59e0b" opacity="0.8" />
              <text x="82" y="-46" fill="#fbbf24" fontSize="11" fontWeight="bold">
                Coronoid Notch
              </text>

              {/* Mandibular Foramen Target (Ideal target coords scaled) */}
              <circle
                cx={currentTech.targetCoords3D.x * 200}
                cy={-currentTech.targetCoords3D.y * 200}
                r="18"
                fill="url(#targetGlow)"
              />
              <circle
                cx={currentTech.targetCoords3D.x * 200}
                cy={-currentTech.targetCoords3D.y * 200}
                r="5"
                fill="#10b981"
                stroke="#ffffff"
                strokeWidth="2"
              />
              <text
                x={currentTech.targetCoords3D.x * 200 + 12}
                y={-currentTech.targetCoords3D.y * 200 + 4}
                fill="#34d399"
                fontSize="12"
                fontWeight="bold"
              >
                Target: {currentTech.targetNerve.split('&')[0]}
              </text>

              {/* Parotid Danger Zone (Posterior to ramus) */}
              <path
                d="M 160 -80 C 180 -60, 190 0, 170 60 L 150 50 Z"
                fill="#ef4444"
                opacity="0.25"
                stroke="#ef4444"
                strokeDasharray="4,4"
              />
              <text x="135" y="-10" fill="#f87171" fontSize="10">
                Parotid Zone (CN VII)
              </text>

              {/* Syringe & Needle Trajectory Vector */}
              {(() => {
                const startX = -140;
                const startY = 120;
                const angleRad = (needleAngleDeg * Math.PI) / 180;
                const length = needleDepthMm * 7;
                const endX = startX + Math.cos(angleRad) * length;
                const endY = startY - Math.sin(angleRad) * length;

                return (
                  <g className={styles.syringeVector}>
                    {/* Syringe Barrel */}
                    <line
                      x1={startX - 40}
                      y1={startY + 20}
                      x2={startX}
                      y2={startY}
                      stroke="#94a3b8"
                      strokeWidth="10"
                      strokeLinecap="round"
                    />
                    {/* Needle Shaft */}
                    <line
                      x1={startX}
                      y1={startY}
                      x2={endX}
                      y2={endY}
                      stroke={evaluation.status === 'danger' ? '#ef4444' : evaluation.status === 'warning' ? '#f59e0b' : '#38bdf8'}
                      strokeWidth="3.5"
                    />
                    {/* Needle Tip Indicator */}
                    <circle
                      cx={endX}
                      cy={endY}
                      r="6"
                      fill={evaluation.status === 'danger' ? '#ef4444' : evaluation.status === 'warning' ? '#f59e0b' : '#38bdf8'}
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                  </g>
                );
              })()}
            </svg>
          </div>

          {/* Interactive Trajectory Sliders */}
          <div className={styles.sliderControls}>
            <div className={styles.sliderGroup}>
              <div className={styles.sliderLabelRow}>
                <span>Insertion Depth:</span>
                <strong>{needleDepthMm} mm</strong> (Ideal: {currentTech.idealDepthMm} mm)
              </div>
              <input
                type="range"
                min="0"
                max="35"
                step="1"
                value={needleDepthMm}
                onChange={(e) => setNeedleDepthMm(Number(e.target.value))}
                className={styles.rangeSlider}
              />
            </div>

            <div className={styles.sliderGroup}>
              <div className={styles.sliderLabelRow}>
                <span>Approach Angle:</span>
                <strong>{needleAngleDeg}°</strong> (Ideal: {currentTech.idealAngleDeg}°)
              </div>
              <input
                type="range"
                min="10"
                max="90"
                step="1"
                value={needleAngleDeg}
                onChange={(e) => setNeedleAngleDeg(Number(e.target.value))}
                className={styles.rangeSlider}
              />
            </div>

            {/* Action Buttons: Aspiration & Injection */}
            <div className={styles.actionButtonRow}>
              <button
                onClick={handleAspirationTest}
                className={`${styles.actionBtn} ${aspirated ? (aspirationResult === 'positive' ? styles.btnPositive : styles.btnNegative) : ''}`}
              >
                🩺 Perform Aspiration Test
              </button>

              <button
                onClick={handleInjectAnesthetic}
                disabled={injected}
                className={`${styles.actionBtn} ${styles.btnInject}`}
              >
                {injected ? '✅ Anesthetic Deposited (1.8 mL)' : '💉 Deposit Local Anesthetic'}
              </button>
            </div>

            {/* Aspiration Result Badge */}
            {aspirated && (
              <div
                className={`${styles.aspirationBadge} ${
                  aspirationResult === 'positive' ? styles.aspPositive : styles.aspNegative
                }`}
              >
                {aspirationResult === 'positive' ? (
                  <>🩸 POSITIVE ASPIRATION: Blood drawn into cartridge! Reposition needle before injection.</>
                ) : (
                  <>✅ NEGATIVE ASPIRATION: No blood in cartridge. Safe to deposit local anesthetic.</>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Real-time Evaluation & Clinical Details */}
        <aside className={styles.detailsCard}>
          {/* Status Feedback Banner */}
          <div
            className={`${styles.statusBanner} ${
              evaluation.status === 'danger'
                ? styles.statusDanger
                : evaluation.status === 'warning'
                ? styles.statusWarning
                : styles.statusSuccess
            }`}
          >
            {evaluation.message}
          </div>

          <div className={styles.techniqueHeader}>
            <h3 className={styles.techTitle}>{currentTech.name}</h3>
            <span className={styles.targetNerveTag}>{currentTech.targetNerve}</span>
          </div>

          <div className={styles.infoSection}>
            <h4>Anatomical Landmarks &amp; Syringe Alignment</h4>
            <p>{currentTech.anatomicLandmark}</p>
            <p className={styles.syringeHint}>{currentTech.syringePosition}</p>
          </div>

          <div className={styles.infoSection}>
            <h4>Anesthetized Field</h4>
            <ul className={styles.fieldList}>
              {currentTech.anesthetizedAreas.map((area) => (
                <li key={area}>✓ {area}</li>
              ))}
            </ul>
          </div>

          <div className={styles.infoSection}>
            <h4>Clinical Pearl</h4>
            <p className={styles.pearlText}>💡 {currentTech.clinicalPearl}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
