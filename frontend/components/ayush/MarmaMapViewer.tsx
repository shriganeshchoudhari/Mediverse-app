'use client';

/**
 * MarmaMapViewer.tsx — Interactive 3D/2.5D 107 Ayurvedic Marma Points Explorer
 * 
 * Features:
 *   - Anatomical body projection (Front, Back, Head views)
 *   - Category filtering by Prognosis (Sadya Pranahara, Kalantara, Vaikalyakara, etc.)
 *   - Region filtering (Head/Neck, Trunk, Limbs, Back)
 *   - Modern neurovascular anatomical correlate inspector
 *   - Interactive Marma Identification Quiz mode
 */

import React, { useState, useMemo } from 'react';
import {
  MARMA_POINTS_REGISTRY,
  MARMA_PROGNOSIS_META,
  TOTAL_MARMA_COUNT,
  type MarmaPoint,
  type MarmaPrognosis,
  type MarmaRegion,
} from '@/lib/ayush/MarmaPresets';
import styles from './MarmaMapViewer.module.css';

interface MarmaMapViewerProps {
  initialMarmaId?: string;
  onMarmaSelect?: (point: MarmaPoint) => void;
}

export default function MarmaMapViewer({
  initialMarmaId = 'sthapani',
  onMarmaSelect,
}: MarmaMapViewerProps) {
  const [selectedPrognosis, setSelectedPrognosis] = useState<MarmaPrognosis | 'all'>('all');
  const [selectedRegion, setSelectedRegion] = useState<MarmaRegion | 'all'>('all');
  const [activeView, setActiveView] = useState<'front' | 'back' | 'head'>('front');
  const [selectedPointId, setSelectedPointId] = useState<string>(initialMarmaId);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTarget, setQuizTarget] = useState<MarmaPoint | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  // Filtered Marma list
  const filteredPoints = useMemo(() => {
    return MARMA_POINTS_REGISTRY.filter((point) => {
      const matchesPrognosis = selectedPrognosis === 'all' || point.prognosis === selectedPrognosis;
      const matchesRegion = selectedRegion === 'all' || point.region === selectedRegion;
      const matchesSearch =
        searchQuery.trim() === '' ||
        point.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        point.sanskritName.includes(searchQuery) ||
        point.modernAnatomyCorrelate.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesPrognosis && matchesRegion && matchesSearch;
    });
  }, [selectedPrognosis, selectedRegion, searchQuery]);

  const activePoint = useMemo(() => {
    return MARMA_POINTS_REGISTRY.find((p) => p.id === selectedPointId) || MARMA_POINTS_REGISTRY[0];
  }, [selectedPointId]);

  const handlePointClick = (point: MarmaPoint) => {
    if (isQuizMode && quizTarget) {
      if (point.id === quizTarget.id) {
        setQuizScore((prev) => ({ correct: prev.correct + 1, total: prev.total + 1 }));
        setQuizFeedback(`✅ Correct! You identified ${quizTarget.name} (${quizTarget.sanskritName})`);
        startNewQuizRound();
      } else {
        setQuizScore((prev) => ({ correct: prev.correct, total: prev.total + 1 }));
        setQuizFeedback(`❌ Incorrect. That was ${point.name}. Look for ${quizTarget.name}!`);
      }
      return;
    }

    setSelectedPointId(point.id);
    if (point.viewAngle !== activeView) {
      setActiveView(point.viewAngle);
    }
    if (onMarmaSelect) {
      onMarmaSelect(point);
    }
  };

  const startNewQuizRound = () => {
    const randomIndex = Math.floor(Math.random() * MARMA_POINTS_REGISTRY.length);
    const target = MARMA_POINTS_REGISTRY[randomIndex];
    setQuizTarget(target);
    setActiveView(target.viewAngle);
  };

  const toggleQuizMode = () => {
    if (!isQuizMode) {
      setIsQuizMode(true);
      setQuizScore({ correct: 0, total: 0 });
      setQuizFeedback(null);
      startNewQuizRound();
    } else {
      setIsQuizMode(false);
      setQuizTarget(null);
      setQuizFeedback(null);
    }
  };

  return (
    <div className={styles.container}>
      {/* Top Header Bar */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.headerIcon}>📍</span>
          <div>
            <h2 className={styles.title}>107 Marma Points 3D Body Explorer</h2>
            <p className={styles.subtitle}>
              Classical Sushruta Samhita Classification &middot; Modern Neurovascular Cross-References
            </p>
          </div>
        </div>

        <div className={styles.headerRight}>
          <button
            onClick={toggleQuizMode}
            className={`${styles.quizButton} ${isQuizMode ? styles.quizButtonActive : ''}`}
          >
            {isQuizMode ? 'Exit Quiz' : '🎯 Start Marma Quiz'}
          </button>
        </div>
      </header>

      {/* Quiz Banner if active */}
      {isQuizMode && quizTarget && (
        <div className={styles.quizBanner}>
          <div>
            <strong>Quiz Objective:</strong> Locate &amp; click on <u>{quizTarget.name}</u> ({quizTarget.sanskritName}) — {quizTarget.locationDescription}
          </div>
          <div className={styles.quizScore}>
            Score: {quizScore.correct} / {quizScore.total}
          </div>
          {quizFeedback && <div className={styles.quizFeedback}>{quizFeedback}</div>}
        </div>
      )}

      {/* Controls & Filter Bar */}
      <div className={styles.controlsBar}>
        {/* Prognosis Filters */}
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Prognosis:</span>
          <button
            className={`${styles.pill} ${selectedPrognosis === 'all' ? styles.pillActive : ''}`}
            onClick={() => setSelectedPrognosis('all')}
          >
            All (107)
          </button>
          {(['sadya_pranahara', 'kalantara_pranahara', 'vishalyaghna', 'vaikalyakara', 'rujakara'] as MarmaPrognosis[]).map(
            (prog) => (
              <button
                key={prog}
                className={`${styles.pill} ${selectedPrognosis === prog ? styles.pillActive : ''}`}
                style={{ '--pill-accent': MARMA_PROGNOSIS_META[prog].color } as React.CSSProperties}
                onClick={() => setSelectedPrognosis(prog)}
              >
                {MARMA_PROGNOSIS_META[prog].name}
              </button>
            )
          )}
        </div>

        {/* View Angle Selector & Search */}
        <div className={styles.viewAndSearch}>
          <div className={styles.viewTabs}>
            <button
              className={`${styles.viewTab} ${activeView === 'front' ? styles.viewTabActive : ''}`}
              onClick={() => setActiveView('front')}
            >
              Anterior (Front)
            </button>
            <button
              className={`${styles.viewTab} ${activeView === 'back' ? styles.viewTabActive : ''}`}
              onClick={() => setActiveView('back')}
            >
              Posterior (Back)
            </button>
            <button
              className={`${styles.viewTab} ${activeView === 'head' ? styles.viewTabActive : ''}`}
              onClick={() => setActiveView('head')}
            >
              Cranial (Head)
            </button>
          </div>

          <input
            type="text"
            placeholder="Search Marma by name, Sanskrit, or nerve..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Main Visualizer Area */}
      <div className={styles.visualizerLayout}>
        {/* Anatomical Canvas / Body Projection */}
        <div className={styles.canvasWrapper}>
          <div className={styles.bodySilhouette}>
            {/* SVG Anatomical Silhouette Representation */}
            <svg
              viewBox="-1.2 -1.2 2.4 2.4"
              className={styles.bodySvg}
              aria-label="3D Anatomical Marma Body Map"
            >
              {/* Reference Grid Circles */}
              <circle cx="0" cy="0" r="1.1" fill="none" stroke="#334155" strokeWidth="0.005" strokeDasharray="0.02,0.02" />
              <line x1="0" y1="-1.1" x2="0" y2="1.1" stroke="#334155" strokeWidth="0.005" />
              <line x1="-1.1" y1="0" x2="1.1" y2="0" stroke="#334155" strokeWidth="0.005" />

              {/* Body Silhouette Contours */}
              {activeView === 'head' ? (
                <g stroke="#475569" fill="#1e293b" strokeWidth="0.015">
                  <ellipse cx="0" cy="0" rx="0.5" ry="0.6" />
                  <ellipse cx="0" cy="0.45" rx="0.08" ry="0.06" fill="#334155" /> {/* Nose tip */}
                  <ellipse cx="-0.5" cy="0" rx="0.06" ry="0.12" fill="#334155" /> {/* Left ear */}
                  <ellipse cx="0.5" cy="0" rx="0.06" ry="0.12" fill="#334155" /> {/* Right ear */}
                </g>
              ) : (
                <g stroke="#475569" fill="#0f172a" strokeWidth="0.012">
                  {/* Head */}
                  <ellipse cx="0" cy="0.85" rx="0.18" ry="0.22" />
                  {/* Neck */}
                  <rect x="-0.08" y="0.63" width="0.16" height="0.1" rx="0.02" />
                  {/* Torso */}
                  <path d="M -0.32 0.63 L 0.32 0.63 L 0.24 0.05 L -0.24 0.05 Z" />
                  {/* Pelvis */}
                  <path d="M -0.24 0.05 L 0.24 0.05 L 0.2 -0.15 L -0.2 -0.15 Z" />
                  {/* Left Arm */}
                  <path d="M -0.32 0.63 L -0.5 0.3 L -0.65 0.15 L -0.6 0.1" fill="none" strokeWidth="0.06" strokeLinecap="round" />
                  {/* Right Arm */}
                  <path d="M 0.32 0.63 L 0.5 0.3 L 0.65 0.15 L 0.6 0.1" fill="none" strokeWidth="0.06" strokeLinecap="round" />
                  {/* Left Leg */}
                  <path d="M -0.15 -0.15 L -0.16 -0.55 L -0.15 -0.95" fill="none" strokeWidth="0.08" strokeLinecap="round" />
                  {/* Right Leg */}
                  <path d="M 0.15 -0.15 L 0.16 -0.55 L 0.15 -0.95" fill="none" strokeWidth="0.08" strokeLinecap="round" />
                </g>
              )}

              {/* Render Visible Marma Beacons */}
              {filteredPoints
                .filter((p) => activeView === 'head' ? p.viewAngle === 'head' : p.viewAngle === activeView || activeView === 'front')
                .map((point) => {
                  const isSelected = point.id === selectedPointId;
                  const meta = MARMA_PROGNOSIS_META[point.prognosis];
                  // Invert Y coordinate for SVG standard coordinate space
                  const svgX = point.coordinates3D.x;
                  const svgY = -point.coordinates3D.y;

                  return (
                    <g
                      key={point.id}
                      className={styles.beaconGroup}
                      onClick={() => handlePointClick(point)}
                      style={{ cursor: 'pointer' }}
                    >
                      {/* Pulse Ring */}
                      <circle
                        cx={svgX}
                        cy={svgY}
                        r={isSelected ? 0.06 : 0.035}
                        fill={meta.color}
                        opacity={isSelected ? 0.4 : 0.2}
                        className={styles.beaconPulse}
                      />
                      {/* Center Beacon Pin */}
                      <circle
                        cx={svgX}
                        cy={svgY}
                        r={isSelected ? 0.03 : 0.02}
                        fill={meta.color}
                        stroke="#ffffff"
                        strokeWidth={0.005}
                      />
                      {/* Label Text */}
                      <text
                        x={svgX + 0.04}
                        y={svgY + 0.015}
                        fill="#f8fafc"
                        fontSize="0.04"
                        fontWeight={isSelected ? 'bold' : 'normal'}
                        className={styles.beaconText}
                      >
                        {point.name}
                      </text>
                    </g>
                  );
                })}
            </svg>
          </div>

          <div className={styles.canvasLegend}>
            <span>View: <strong>{activeView.toUpperCase()}</strong></span>
            <span>Visible: <strong>{filteredPoints.length}</strong> / {TOTAL_MARMA_COUNT} Points</span>
          </div>
        </div>

        {/* Clinical Inspector Panel */}
        <aside className={styles.inspectorPanel}>
          <div className={styles.inspectorHeader}>
            <span className={styles.sanskritNameBadge}>{activePoint.sanskritName}</span>
            <span
              className={styles.prognosisTag}
              style={{ background: MARMA_PROGNOSIS_META[activePoint.prognosis].color }}
            >
              {MARMA_PROGNOSIS_META[activePoint.prognosis].name}
            </span>
          </div>

          <h3 className={styles.inspectorTitle}>{activePoint.name} Marma</h3>
          <p className={styles.inspectorMeta}>
            <strong>Region:</strong> {activePoint.region.replace('_', ' ').toUpperCase()} &middot;{' '}
            <strong>Structure:</strong> {activePoint.tissueType.toUpperCase()} &middot;{' '}
            <strong>Dimension:</strong> {activePoint.dimensionAnguli}
          </p>

          <div className={styles.sectionBlock}>
            <h4>Classical Anatomical Location</h4>
            <p>{activePoint.locationDescription}</p>
          </div>

          <div className={styles.sectionBlock}>
            <h4>Modern Neurovascular Correlates</h4>
            <p className={styles.highlightText}>{activePoint.modernAnatomyCorrelate}</p>
          </div>

          <div className={styles.sectionBlock}>
            <h4>Pathophysiology &amp; Trauma Consequences</h4>
            <p className={styles.injuryText}>{activePoint.injuryConsequences}</p>
          </div>

          <div className={styles.sectionBlock}>
            <h4>Ayurvedic Clinical &amp; Panchakarma Therapy</h4>
            <p className={styles.therapyText}>{activePoint.therapeuticApplication}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
