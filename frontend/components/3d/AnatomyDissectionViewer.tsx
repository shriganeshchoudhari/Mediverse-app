"use client";

import React, { useState, useMemo, useRef } from "react";
import {
  REGIONAL_ANATOMY_PRESETS,
  getRegionalAnatomyPreset,
  AnatomyLandmarkPin,
  RegionalAnatomyPreset,
  DISSECTION_LAYERS,
} from "../../.gemini/skills/3d/AnatomyPresets";
import styles from "./AnatomyDissectionViewer.module.css";
import {
  Layers,
  Scissors,
  Eye,
  Info,
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Maximize2,
  Minimize2,
  RefreshCw,
} from "lucide-react";

interface AnatomyDissectionViewerProps {
  initialRegionId?: string;
  height?: string;
  onLandmarkSelect?: (pin: AnatomyLandmarkPin) => void;
}

export default function AnatomyDissectionViewer({
  initialRegionId = "upper-limb",
  height = "560px",
  onLandmarkSelect,
}: AnatomyDissectionViewerProps) {
  const [selectedRegionId, setSelectedRegionId] = useState<string>(initialRegionId);
  const [currentDepth, setCurrentDepth] = useState<number>(3); // Default to muscular/neural layer
  const [activePlane, setActivePlane] = useState<"none" | "sagittal" | "coronal" | "transverse">("none");
  const [planeOffset, setPlaneOffset] = useState<number>(0.0);
  const [activePinId, setActivePinId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizTargetPinId, setQuizTargetPinId] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const regionPreset: RegionalAnatomyPreset = useMemo(() => {
    return getRegionalAnatomyPreset(selectedRegionId);
  }, [selectedRegionId]);

  // Filter landmarks visible at or below current dissection depth
  const visibleLandmarks = useMemo(() => {
    return regionPreset.landmarks.filter((lm) => lm.layerDepth <= currentDepth);
  }, [regionPreset, currentDepth]);

  const activeLandmark = useMemo(() => {
    return regionPreset.landmarks.find((lm) => lm.id === activePinId) || null;
  }, [regionPreset, activePinId]);

  const handleRegionChange = (regionId: string) => {
    setSelectedRegionId(regionId);
    setActivePinId(null);
    if (isQuizMode) {
      startQuizForRegion(regionId);
    }
  };

  const handlePinClick = (pin: AnatomyLandmarkPin) => {
    if (isQuizMode && quizTargetPinId) {
      if (pin.id === quizTargetPinId) {
        setQuizScore((prev) => ({ correct: prev.correct + 1, total: prev.total + 1 }));
        setQuizFeedback(`Correct! You identified ${pin.name}.`);
        setTimeout(() => nextQuizQuestion(regionPreset), 1500);
      } else {
        setQuizScore((prev) => ({ correct: prev.correct, total: prev.total + 1 }));
        setQuizFeedback(`Incorrect. That is ${pin.name}. Find ${regionPreset.landmarks.find((p) => p.id === quizTargetPinId)?.name}.`);
      }
    } else {
      setActivePinId(pin.id);
      if (onLandmarkSelect) {
        onLandmarkSelect(pin);
      }
    }
  };

  const startQuizForRegion = (regionId: string) => {
    const preset = getRegionalAnatomyPreset(regionId);
    if (preset.landmarks.length === 0) return;
    const randomPin = preset.landmarks[Math.floor(Math.random() * preset.landmarks.length)];
    setIsQuizMode(true);
    setQuizTargetPinId(randomPin.id);
    setQuizFeedback(null);
    setCurrentDepth(5); // Reveal all layers for quiz
  };

  const nextQuizQuestion = (preset: RegionalAnatomyPreset) => {
    const randomPin = preset.landmarks[Math.floor(Math.random() * preset.landmarks.length)];
    setQuizTargetPinId(randomPin.id);
    setQuizFeedback(null);
  };

  const toggleQuizMode = () => {
    if (!isQuizMode) {
      startQuizForRegion(selectedRegionId);
    } else {
      setIsQuizMode(false);
      setQuizTargetPinId(null);
      setQuizFeedback(null);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const quizTargetPin = useMemo(() => {
    return regionPreset.landmarks.find((p) => p.id === quizTargetPinId) || null;
  }, [regionPreset, quizTargetPinId]);

  return (
    <div
      ref={containerRef}
      className={styles.container}
      style={{ height: isFullscreen ? "100vh" : "auto" }}
    >
      {/* Top Header Bar */}
      <div className={styles.headerBar}>
        <div className={styles.titleArea}>
          <span className={styles.regionBadge}>
            <Sparkles size={14} /> {regionPreset.systemCode}
          </span>
          <span className={styles.titleText}>{regionPreset.title}</span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${showSidebar ? styles.btnActive : ""}`}
            onClick={() => setShowSidebar(!showSidebar)}
            title="Toggle Anatomical Layers Panel"
          >
            <Layers size={15} /> Layers ({currentDepth}/5)
          </button>

          <button
            className={`${styles.btn} ${activePlane !== "none" ? styles.btnActive : ""}`}
            onClick={() => {
              const planes: Array<"none" | "sagittal" | "coronal" | "transverse"> = [
                "none",
                "sagittal",
                "coronal",
                "transverse",
              ];
              const nextIndex = (planes.indexOf(activePlane) + 1) % planes.length;
              setActivePlane(planes[nextIndex]);
            }}
            title="Toggle Cross-Section Dissection Plane"
          >
            <Scissors size={15} /> Plane: {activePlane.toUpperCase()}
          </button>

          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
            title="Launch Interactive Landmark Quiz"
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Quiz" : "Pin Quiz Mode"}
          </button>

          <button className={styles.btn} onClick={toggleFullscreen} title="Toggle Fullscreen">
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </div>

      {/* 3D Visualizer Canvas & Overlays */}
      <div className={styles.canvasWrapper} style={{ height }}>
        {/* SVG/CSS 3D Simulated Anatomical Dissection Canvas */}
        <div className="w-full h-full flex items-center justify-center relative overflow-hidden bg-slate-950">
          {/* Depth Layer Visualization Grids */}
          <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
            <div
              className="w-96 h-96 rounded-full border-2 border-indigo-500/40 animate-pulse"
              style={{ transform: `scale(${1 + currentDepth * 0.1})` }}
            />
          </div>

          {/* Rendered 3D Landmark Pin Targets */}
          <div className="relative z-10 w-full max-w-xl h-full flex flex-col justify-center items-center p-8">
            <div className="text-center mb-6">
              <span className="text-xs font-bold text-indigo-400 tracking-wider uppercase">
                Active Dissection Layer: {DISSECTION_LAYERS[currentDepth - 1]?.name}
              </span>
              <h3 className="text-xl font-bold text-slate-100 mt-1">{regionPreset.subtitle}</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">{regionPreset.overview}</p>
            </div>

            {/* Interactive Anatomical Pins Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
              {visibleLandmarks.map((pin) => {
                const isSelected = activePinId === pin.id;
                return (
                  <button
                    key={pin.id}
                    onClick={() => handlePinClick(pin)}
                    className={`p-3 rounded-lg border text-left transition-all duration-200 flex items-center gap-3 ${
                      isSelected
                        ? "bg-indigo-950/80 border-indigo-400 shadow-lg shadow-indigo-500/20 scale-105"
                        : "bg-slate-900/80 border-slate-700/60 hover:border-slate-500 hover:bg-slate-800"
                    }`}
                  >
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0 animate-ping"
                      style={{ backgroundColor: pin.color }}
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-200 truncate">{pin.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{pin.category.toUpperCase()} • Layer {pin.layerDepth}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar: Layers & Landmark Directory */}
        {showSidebar && (
          <div className={styles.sidebarOverlay}>
            <div className={styles.layerControlCard}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  Dissection Peeling Depth
                </span>
                <span className="text-xs font-semibold text-slate-300">Level {currentDepth} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={currentDepth}
                onChange={(e) => setCurrentDepth(parseInt(e.target.value))}
                className={styles.layerSlider}
              />
              <div className={styles.layerLabels}>
                <span>Skin</span>
                <span>Fascia</span>
                <span>Muscle</span>
                <span>Nerve/Art</span>
                <span>Bone</span>
              </div>
            </div>

            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Landmark Directory ({visibleLandmarks.length})
            </div>

            <div className="flex flex-col gap-2 overflow-y-auto pr-1">
              {visibleLandmarks.map((pin) => (
                <div
                  key={pin.id}
                  className={`${styles.landmarkPinItem} ${activePinId === pin.id ? styles.landmarkPinActive : ""}`}
                  onClick={() => handlePinClick(pin)}
                >
                  <div className={styles.pinDot} style={{ backgroundColor: pin.color }} />
                  <div>
                    <div className={styles.pinTitle}>{pin.name}</div>
                    <div className={styles.pinSubtitle}>{pin.actionOrFunction}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Right Detail Drawer: High-Yield Anatomical & Clinical Correlation */}
        {activeLandmark && !isQuizMode && (
          <div className={styles.detailDrawer}>
            <div className={styles.detailHeader}>
              <div>
                <span className={styles.badgeCategory}>{activeLandmark.category}</span>
                <h4 className="text-lg font-bold text-slate-100 mt-1">{activeLandmark.name}</h4>
              </div>
              <button
                onClick={() => setActivePinId(null)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X size={18} />
              </button>
            </div>

            {activeLandmark.nerveSupply && (
              <div className={styles.detailSection}>
                <div className={styles.sectionLabel}>⚡ Innervation / Nerve Supply</div>
                <div className={styles.sectionBody}>{activeLandmark.nerveSupply}</div>
              </div>
            )}

            {activeLandmark.bloodSupply && (
              <div className={styles.detailSection}>
                <div className={styles.sectionLabel}>🩸 Vascular / Blood Supply</div>
                <div className={styles.sectionBody}>{activeLandmark.bloodSupply}</div>
              </div>
            )}

            <div className={styles.detailSection}>
              <div className={styles.sectionLabel}>🎯 Action & Anatomical Function</div>
              <div className={styles.sectionBody}>{activeLandmark.actionOrFunction}</div>
            </div>

            <div className={styles.detailSection}>
              <div className={styles.sectionLabel}>🏥 Clinical Significance & Palsies</div>
              <div className={styles.sectionBody}>{activeLandmark.clinicalSignificance}</div>
            </div>

            <div className={styles.detailSection}>
              <div className={styles.sectionLabel}>💡 USMLE / NMC High-Yield Pearl</div>
              <div className={styles.sectionBody}>{activeLandmark.highYieldFact}</div>
            </div>
          </div>
        )}

        {/* Quiz Mode Bottom Floating Banner */}
        {isQuizMode && quizTargetPin && (
          <div className={styles.quizBanner}>
            <div className="flex items-center gap-3">
              <HelpCircle className="text-pink-500 animate-bounce" size={24} />
              <div>
                <div className="text-xs font-bold text-pink-400 uppercase tracking-wider">
                  Target Landmark • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-base font-bold text-white">Find: {quizTargetPin.name}</div>
                {quizFeedback && (
                  <div className="text-xs text-indigo-300 mt-0.5 font-medium">{quizFeedback}</div>
                )}
              </div>
            </div>
            <button
              onClick={() => nextQuizQuestion(regionPreset)}
              className="text-xs px-3 py-1.5 rounded-md bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
            >
              Skip
            </button>
          </div>
        )}
      </div>

      {/* Regional Selector Tabs */}
      <div className={styles.regionSelectorGrid}>
        {Object.entries(REGIONAL_ANATOMY_PRESETS).map(([key, preset]) => (
          <button
            key={key}
            onClick={() => handleRegionChange(key)}
            className={`${styles.regionTab} ${selectedRegionId === key ? styles.regionTabActive : ""}`}
          >
            {preset.title.split(" ")[0]} {preset.title.split(" ")[1]}
          </button>
        ))}
      </div>
    </div>
  );
}
