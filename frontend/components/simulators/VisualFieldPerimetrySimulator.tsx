'use client';

import React, { useState, useMemo } from 'react';
import {
  EyeTested,
  TestStrategy,
  PERIMETRY_PRESETS,
  VisualFieldPoint,
  analyzeVisualField,
  calculateCornealIopCorrection,
  calculateTargetIop,
} from '../../.gemini/skills/VisualFieldPerimetryEngine';
import {
  Eye,
  Activity,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Info,
  Layers,
  Sparkles,
  RefreshCw,
  Crosshair,
  Gauge,
  Sliders,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

export default function VisualFieldPerimetrySimulator() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('early-poag-nasal-step');
  const [eyeTested, setEyeTested] = useState<EyeTested>('OD');
  const [strategy, setStrategy] = useState<TestStrategy>('SITA_STANDARD');
  const [viewMode, setViewMode] = useState<'DECIBELS' | 'GRAYSCALE' | 'TOTAL_DEV' | 'PATTERN_DEV'>('PATTERN_DEV');
  
  // Dynamic controls
  const [measuredIop, setMeasuredIop] = useState<number>(24);
  const [cctUm, setCctUm] = useState<number>(535);
  const [fixationLossesPct, setFixationLossesPct] = useState<number>(7);
  const [falsePositivesPct, setFalsePositivesPct] = useState<number>(4);
  const [falseNegativesPct, setFalseNegativesPct] = useState<number>(6);
  const [selectedPoint, setSelectedPoint] = useState<VisualFieldPoint | null>(null);

  // Active preset
  const activePreset = useMemo(() => {
    return PERIMETRY_PRESETS.find(p => p.id === selectedPresetId) || PERIMETRY_PRESETS[0];
  }, [selectedPresetId]);

  // Points based on eye and preset
  const points = useMemo(() => {
    return activePreset.generatePoints(eyeTested);
  }, [activePreset, eyeTested]);

  // Master analysis
  const analysis = useMemo(() => {
    return analyzeVisualField(
      points,
      eyeTested,
      strategy,
      measuredIop,
      cctUm,
      fixationLossesPct,
      falsePositivesPct,
      falseNegativesPct
    );
  }, [points, eyeTested, strategy, measuredIop, cctUm, fixationLossesPct, falsePositivesPct, falseNegativesPct]);

  // Handle preset selection
  const handlePresetSelect = (id: string) => {
    setSelectedPresetId(id);
    const p = PERIMETRY_PRESETS.find(preset => preset.id === id);
    if (p) {
      setEyeTested(p.eye);
      setMeasuredIop(p.measuredIop);
      setCctUm(p.cct);
      setFixationLossesPct(p.fixationLossesPct);
      setFalsePositivesPct(p.falsePositivesPct);
      setFalseNegativesPct(p.falseNegativesPct);
      setSelectedPoint(null);
    }
  };

  // Helper to get fill color for grayscale visual field points
  const getGrayscaleFill = (measuredDb: number, isBlind: boolean) => {
    if (isBlind) return '#09090b';
    if (measuredDb <= 0) return '#000000';
    if (measuredDb < 6) return '#18181b';
    if (measuredDb < 12) return '#27272a';
    if (measuredDb < 18) return '#52525b';
    if (measuredDb < 24) return '#71717a';
    if (measuredDb < 30) return '#a1a1aa';
    return '#f4f4f5';
  };

  // Helper to get probability symbol representation
  const renderProbabilitySymbol = (prob: string, isBlind: boolean) => {
    if (isBlind) return <span className="text-zinc-600 text-xs font-mono font-bold">BS</span>;
    switch (prob) {
      case '<0.5%':
        return <div className="w-5 h-5 bg-black border border-zinc-700 rounded-sm" title="p < 0.5% (Dense Scotoma)" />;
      case '<1%':
        return (
          <div
            className="w-5 h-5 bg-zinc-800 border border-zinc-600 rounded-sm flex items-center justify-center"
            title="p < 1%"
          >
            <div className="w-3 h-3 bg-zinc-400" />
          </div>
        );
      case '<2%':
        return (
          <div
            className="w-5 h-5 bg-zinc-700 border border-zinc-500 rounded-sm flex items-center justify-center"
            title="p < 2%"
          >
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
        );
      case '<5%':
        return (
          <div
            className="w-5 h-5 border border-zinc-400 rounded-sm flex items-center justify-center bg-zinc-900"
            title="p < 5%"
          >
            <span className="text-[9px] text-zinc-300 font-bold">::</span>
          </div>
        );
      default:
        return <span className="text-zinc-500 text-xs font-mono">·</span>;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-zinc-100 p-2 sm:p-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border border-cyan-700/40 rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-cyan-500/20 border border-cyan-500/40 rounded-xl text-cyan-400">
                <Crosshair className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                  Humphrey Automated Perimetry & Glaucoma Workstation
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono">
                    HFA 24-2 SITA
                  </span>
                </h1>
                <p className="text-sm text-zinc-400 mt-1">
                  Automated visual field simulation, Glaucoma Hemifield Test (GHT), Hodapp-Anderson-Parrish staging, and pachymetry-adjusted target IOP solver.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-slate-900/80 border border-slate-700/80 px-3 py-1.5 rounded-lg text-xs font-mono">
              <span className="text-zinc-400">Eye:</span>{' '}
              <span className="text-cyan-300 font-bold">{eyeTested === 'OD' ? 'OD (Right)' : 'OS (Left)'}</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-700/80 px-3 py-1.5 rounded-lg text-xs font-mono">
              <span className="text-zinc-400">MD:</span>{' '}
              <span className={`font-bold ${analysis.meanDeviationDb < -6 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {analysis.meanDeviationDb} dB
              </span>
            </div>
            <div className="bg-slate-900/80 border border-slate-700/80 px-3 py-1.5 rounded-lg text-xs font-mono">
              <span className="text-zinc-400">VFI:</span>{' '}
              <span className={`font-bold ${analysis.visualFieldIndexPct < 80 ? 'text-amber-400' : 'text-cyan-400'}`}>
                {analysis.visualFieldIndexPct}%
              </span>
            </div>
          </div>
        </div>

        {/* Preset Selector Bar */}
        <div className="mt-5 pt-4 border-t border-cyan-900/40 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5 mr-2">
            <Sparkles className="w-3.5 h-3.5" /> Clinical Presets:
          </span>
          {PERIMETRY_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedPresetId === preset.id
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30 ring-1 ring-cyan-400'
                  : 'bg-slate-800/80 text-zinc-300 hover:bg-slate-750 hover:text-white border border-slate-700/60'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Visual Field Printout (Left) + Analysis & Controls (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Field Display (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Top Control Bar for View Mode & Eye */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400 font-semibold">Test Eye:</span>
              <div className="inline-flex rounded-lg p-0.5 bg-slate-800 border border-slate-700 text-xs">
                <button
                  onClick={() => setEyeTested('OD')}
                  className={`px-3 py-1 rounded-md transition font-semibold ${
                    eyeTested === 'OD' ? 'bg-cyan-600 text-white shadow' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  OD (Right)
                </button>
                <button
                  onClick={() => setEyeTested('OS')}
                  className={`px-3 py-1 rounded-md transition font-semibold ${
                    eyeTested === 'OS' ? 'bg-cyan-600 text-white shadow' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  OS (Left)
                </button>
              </div>

              <div className="inline-flex rounded-lg p-0.5 bg-slate-800 border border-slate-700 text-xs ml-2">
                <button
                  onClick={() => setStrategy('SITA_STANDARD')}
                  className={`px-2.5 py-1 rounded-md transition ${
                    strategy === 'SITA_STANDARD' ? 'bg-slate-700 text-cyan-300 font-semibold' : 'text-zinc-400'
                  }`}
                >
                  SITA-Standard
                </button>
                <button
                  onClick={() => setStrategy('SITA_FAST')}
                  className={`px-2.5 py-1 rounded-md transition ${
                    strategy === 'SITA_FAST' ? 'bg-slate-700 text-cyan-300 font-semibold' : 'text-zinc-400'
                  }`}
                >
                  SITA-Fast
                </button>
              </div>
            </div>

            {/* View Mode Tabs */}
            <div className="inline-flex rounded-lg p-0.5 bg-slate-800 border border-slate-700 text-xs">
              <button
                onClick={() => setViewMode('PATTERN_DEV')}
                className={`px-2.5 py-1 rounded-md transition ${
                  viewMode === 'PATTERN_DEV' ? 'bg-cyan-600 text-white font-semibold' : 'text-zinc-400'
                }`}
              >
                Pattern Dev (p)
              </button>
              <button
                onClick={() => setViewMode('TOTAL_DEV')}
                className={`px-2.5 py-1 rounded-md transition ${
                  viewMode === 'TOTAL_DEV' ? 'bg-cyan-600 text-white font-semibold' : 'text-zinc-400'
                }`}
              >
                Total Dev (dB)
              </button>
              <button
                onClick={() => setViewMode('DECIBELS')}
                className={`px-2.5 py-1 rounded-md transition ${
                  viewMode === 'DECIBELS' ? 'bg-cyan-600 text-white font-semibold' : 'text-zinc-400'
                }`}
              >
                Raw dB
              </button>
              <button
                onClick={() => setViewMode('GRAYSCALE')}
                className={`px-2.5 py-1 rounded-md transition ${
                  viewMode === 'GRAYSCALE' ? 'bg-cyan-600 text-white font-semibold' : 'text-zinc-400'
                }`}
              >
                Grayscale
              </button>
            </div>
          </div>

          {/* Humphrey Field Printout Board */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
            {/* Header info mimicking Humphrey Single Field Printout */}
            <div className="border-b border-slate-800 pb-3 mb-4 flex justify-between items-center text-xs font-mono text-zinc-400">
              <div>
                <span className="text-white font-bold text-sm">HUMPHREY FIELD ANALYZER II-i</span>
                <span className="ml-2 text-cyan-400">CENTRAL 24-2 THRESHOLD TEST</span>
              </div>
              <div className="text-right">
                <span>STIMULUS: III, WHITE</span> | <span>BCVA: 20/20</span>
              </div>
            </div>

            {/* Visual Field Grid Map (54 points spaced at 6 degrees) */}
            <div className="relative w-full aspect-square max-w-[480px] mx-auto bg-slate-950/80 rounded-2xl border border-slate-800/80 p-4 flex items-center justify-center">
              {/* Horizontal & Vertical Axis Crosshairs */}
              <div className="absolute inset-x-4 top-1/2 h-px bg-zinc-800 pointer-events-none" />
              <div className="absolute inset-y-4 left-1/2 w-px bg-zinc-800 pointer-events-none" />

              {/* Degrees markings */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] text-zinc-600 font-mono">
                Superior (+27°)
              </div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-zinc-600 font-mono">
                Inferior (-27°)
              </div>
              <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-zinc-600 font-mono">
                {eyeTested === 'OD' ? 'Nasal (-27°)' : 'Temporal (-27°)'}
              </div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-zinc-600 font-mono">
                {eyeTested === 'OD' ? 'Temporal (+27°)' : 'Nasal (+27°)'}
              </div>

              {/* Points Rendering */}
              <div className="relative w-full h-full">
                {analysis.points.map(pt => {
                  // Coordinate translation: x is -27 to +27, y is -27 to +27
                  // Map to 5% to 95%
                  const leftPct = ((pt.x + 27) / 54) * 90 + 5;
                  const topPct = ((-pt.y + 27) / 54) * 90 + 5;
                  const isSelected = selectedPoint?.id === pt.id;

                  return (
                    <button
                      key={pt.id}
                      onClick={() => setSelectedPoint(pt)}
                      style={{
                        position: 'absolute',
                        left: `${leftPct}%`,
                        top: `${topPct}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      className={`group w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-transform hover:scale-125 z-10 ${
                        isSelected ? 'ring-2 ring-cyan-400 scale-110 z-20' : ''
                      }`}
                      title={`Point (${pt.x}°, ${pt.y}°): ${pt.measuredDb} dB, Dev: ${pt.patternDeviationDb} dB (${pt.patternDevProbability})`}
                    >
                      {viewMode === 'DECIBELS' && (
                        <div
                          className={`w-full h-full rounded flex items-center justify-center text-[10px] font-mono font-bold ${
                            pt.isBlindSpot
                              ? 'bg-zinc-800 text-zinc-500'
                              : pt.measuredDb < 15
                              ? 'bg-rose-950/60 text-rose-300 border border-rose-800/40'
                              : 'bg-slate-800/80 text-zinc-200 border border-slate-700/60'
                          }`}
                        >
                          {pt.isBlindSpot ? '<0' : pt.measuredDb}
                        </div>
                      )}

                      {viewMode === 'GRAYSCALE' && (
                        <div
                          className="w-full h-full rounded-sm border border-zinc-900"
                          style={{
                            backgroundColor: getGrayscaleFill(pt.measuredDb, pt.isBlindSpot),
                          }}
                        />
                      )}

                      {viewMode === 'TOTAL_DEV' && (
                        <div
                          className={`w-full h-full rounded flex items-center justify-center text-[9px] font-mono font-bold ${
                            pt.isBlindSpot
                              ? 'text-zinc-600'
                              : pt.totalDeviationDb <= -8
                              ? 'bg-rose-900/60 text-rose-200'
                              : pt.totalDeviationDb <= -4
                              ? 'bg-amber-900/50 text-amber-200'
                              : 'text-zinc-400'
                          }`}
                        >
                          {pt.isBlindSpot ? 'BS' : pt.totalDeviationDb > 0 ? `+${pt.totalDeviationDb}` : pt.totalDeviationDb}
                        </div>
                      )}

                      {viewMode === 'PATTERN_DEV' && (
                        <div className="flex items-center justify-center">
                          {renderProbabilitySymbol(pt.patternDevProbability, pt.isBlindSpot)}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Probability Symbol Legend */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-zinc-400">
              <span className="font-semibold text-zinc-300">Probability Symbols:</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 bg-black border border-zinc-600 rounded-sm" />
                  <span className="font-mono text-[11px]">&lt;0.5%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 bg-zinc-800 border border-zinc-500 rounded-sm flex items-center justify-center">
                    <div className="w-2 h-2 bg-zinc-400" />
                  </div>
                  <span className="font-mono text-[11px]">&lt;1%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 bg-zinc-700 border border-zinc-500 rounded-sm flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                  <span className="font-mono text-[11px]">&lt;2%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 border border-zinc-400 rounded-sm flex items-center justify-center">
                    <span className="text-[8px] font-bold">::</span>
                  </div>
                  <span className="font-mono text-[11px]">&lt;5%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-zinc-500 font-bold">·</span>
                  <span className="font-mono text-[11px]">NS</span>
                </div>
              </div>
            </div>

            {/* Selected Point Inspector */}
            {selectedPoint && (
              <div className="mt-4 p-3 bg-slate-950/90 border border-cyan-500/40 rounded-xl text-xs flex flex-wrap items-center justify-between gap-2 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <Crosshair className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-white">
                    Coordinates: ({selectedPoint.x}°, {selectedPoint.y}°) - {selectedPoint.quadrant.replace('_', ' ')}
                  </span>
                  {selectedPoint.isBlindSpot && (
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded text-[10px] font-bold">
                      Physiological Blind Spot
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span>Measured: <strong className="text-cyan-300">{selectedPoint.measuredDb} dB</strong></span>
                  <span>Age-Normal: <strong className="text-zinc-300">{selectedPoint.ageNormalDb} dB</strong></span>
                  <span>Total Dev: <strong className={selectedPoint.totalDeviationDb < 0 ? 'text-rose-400' : 'text-emerald-400'}>{selectedPoint.totalDeviationDb} dB</strong></span>
                  <span>Pattern Dev: <strong className={selectedPoint.patternDeviationDb < 0 ? 'text-amber-400' : 'text-zinc-300'}>{selectedPoint.patternDeviationDb} dB ({selectedPoint.patternDevProbability})</strong></span>
                </div>
              </div>
            )}
          </div>

          {/* Reliability Indices Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-cyan-400" /> Reliability Indices
              </h3>
              {analysis.reliability.isReliable ? (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <CheckCircle2 className="w-3.5 h-3.5" /> High Reliability Test
                </span>
              ) : (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  <AlertTriangle className="w-3.5 h-3.5" /> Unreliable Test
                </span>
              )}
            </div>

            {analysis.reliability.reliabilityWarning && (
              <div className="mb-3 p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-200 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{analysis.reliability.reliabilityWarning}</span>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[11px] text-zinc-400">Fixation Losses</div>
                <div className="text-sm font-bold font-mono text-white mt-0.5">
                  {analysis.reliability.fixationLossesPct}% ({analysis.reliability.fixationLossesRatio})
                </div>
                <div className="text-[10px] text-zinc-500">Threshold: &lt;20%</div>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[11px] text-zinc-400">False Positives</div>
                <div className={`text-sm font-bold font-mono mt-0.5 ${analysis.reliability.falsePositivesPct > 15 ? 'text-rose-400' : 'text-white'}`}>
                  {analysis.reliability.falsePositivesPct}%
                </div>
                <div className="text-[10px] text-zinc-500">Threshold: &lt;15%</div>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[11px] text-zinc-400">False Negatives</div>
                <div className={`text-sm font-bold font-mono mt-0.5 ${analysis.reliability.falseNegativesPct > 20 ? 'text-rose-400' : 'text-white'}`}>
                  {analysis.reliability.falseNegativesPct}%
                </div>
                <div className="text-[10px] text-zinc-500">Threshold: &lt;20%</div>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[11px] text-zinc-400">Foveal Threshold</div>
                <div className="text-sm font-bold font-mono text-cyan-300 mt-0.5">
                  {analysis.reliability.fovealThresholdDb} dB
                </div>
                <div className="text-[10px] text-zinc-500">Duration: {analysis.reliability.testDurationSeconds}s</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Global Indices, GHT, HAP Staging, and Pachymetry Target IOP (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Glaucoma Hemifield & Diagnostic Summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-cyan-400" /> Glaucoma Staging & Indices
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono">
                {analysis.strategy.replace('_', ' ')}
              </span>
            </h2>

            {/* GHT Result Banner */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
              <div className="text-xs text-zinc-400">Glaucoma Hemifield Test (GHT):</div>
              <div className="flex items-center gap-2">
                {analysis.glaucomaHemifieldTest === 'OUTSIDE_NORMAL_LIMITS' && (
                  <span className="px-3 py-1 rounded-md text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    OUTSIDE NORMAL LIMITS
                  </span>
                )}
                {analysis.glaucomaHemifieldTest === 'BORDERLINE' && (
                  <span className="px-3 py-1 rounded-md text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    BORDERLINE
                  </span>
                )}
                {analysis.glaucomaHemifieldTest === 'WITHIN_NORMAL_LIMITS' && (
                  <span className="px-3 py-1 rounded-md text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    WITHIN NORMAL LIMITS
                  </span>
                )}
                {analysis.glaucomaHemifieldTest === 'ABNORMALLY_HIGH_SENSITIVITY' && (
                  <span className="px-3 py-1 rounded-md text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    ABNORMALLY HIGH SENSITIVITY
                  </span>
                )}
                {analysis.glaucomaHemifieldTest === 'GENERAL_REDUCTION_OF_SENSITIVITY' && (
                  <span className="px-3 py-1 rounded-md text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                    GENERAL REDUCTION OF SENSITIVITY
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                {analysis.scotomaPatternDescription}
              </p>
            </div>

            {/* Global Indices Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-center">
                <div className="text-[11px] text-zinc-400 font-semibold">Mean Deviation (MD)</div>
                <div className={`text-lg font-bold font-mono mt-1 ${analysis.meanDeviationDb < -6 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {analysis.meanDeviationDb} dB
                </div>
                <div className="text-[10px] text-zinc-500">Normal: &gt; -2 dB</div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-center">
                <div className="text-[11px] text-zinc-400 font-semibold">Pattern SD (PSD)</div>
                <div className={`text-lg font-bold font-mono mt-1 ${analysis.patternStandardDeviationDb > 4 ? 'text-amber-400' : 'text-zinc-200'}`}>
                  {analysis.patternStandardDeviationDb} dB
                </div>
                <div className="text-[10px] text-zinc-500">Normal: &lt; 2.5 dB</div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-center">
                <div className="text-[11px] text-zinc-400 font-semibold">Visual Field Index</div>
                <div className={`text-lg font-bold font-mono mt-1 ${analysis.visualFieldIndexPct < 80 ? 'text-amber-400' : 'text-cyan-400'}`}>
                  {analysis.visualFieldIndexPct}%
                </div>
                <div className="text-[10px] text-zinc-500">Rate of progression</div>
              </div>
            </div>

            {/* Hodapp-Anderson-Parrish (HAP) Glaucoma Stage */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-zinc-400 font-semibold">Hodapp-Anderson-Parrish (HAP) Stage:</span>
                <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {analysis.hapStage.replace('STAGE_', 'Stage ').replace('_', ' ')}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
                <div
                  className={`h-full transition-all duration-500 ${
                    analysis.hapStage.includes('END_STAGE') || analysis.hapStage.includes('SEVERE')
                      ? 'bg-rose-500'
                      : analysis.hapStage.includes('ADVANCED')
                      ? 'bg-amber-500'
                      : analysis.hapStage.includes('MODERATE')
                      ? 'bg-yellow-500'
                      : analysis.hapStage.includes('EARLY')
                      ? 'bg-cyan-400'
                      : 'bg-emerald-500'
                  }`}
                  style={{
                    width:
                      analysis.hapStage === 'STAGE_0_NORMAL'
                        ? '10%'
                        : analysis.hapStage === 'STAGE_1_EARLY'
                        ? '30%'
                        : analysis.hapStage === 'STAGE_2_MODERATE'
                        ? '50%'
                        : analysis.hapStage === 'STAGE_3_ADVANCED'
                        ? '70%'
                        : analysis.hapStage === 'STAGE_4_SEVERE'
                        ? '88%'
                        : '100%',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Corneal Pachymetry & Target IOP Calculator */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-indigo-400" /> Pachymetry & Target IOP Solver
              </span>
              <span className="text-[11px] text-zinc-500 font-mono">Dresdner Formula</span>
            </h2>

            {/* Sliders */}
            <div className="space-y-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-400 font-medium">Measured Applanation IOP:</span>
                  <span className="text-cyan-300 font-mono font-bold">{measuredIop} mmHg</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="45"
                  value={measuredIop}
                  onChange={e => setMeasuredIop(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-400 font-medium">Central Corneal Thickness (CCT):</span>
                  <span className="text-indigo-300 font-mono font-bold">{cctUm} µm</span>
                </div>
                <input
                  type="range"
                  min="420"
                  max="650"
                  value={cctUm}
                  onChange={e => setCctUm(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* Pachymetry Correction Result */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-zinc-400">True Corrected IOP:</span>
                <span className="text-base font-bold font-mono text-rose-400">
                  {analysis.pachymetry.correctedIopMmHg} mmHg
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-snug">
                {analysis.pachymetry.explanation}
              </p>
            </div>

            {/* Target IOP Recommendation Box */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/50 to-slate-950 border border-indigo-900/50 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-indigo-300 font-semibold">Recommended Target IOP:</span>
                <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 font-bold font-mono text-sm">
                  {analysis.targetIop.targetIopRange[0]} – {analysis.targetIop.targetIopRange[1]} mmHg
                </span>
              </div>

              <div className="text-xs text-zinc-400 flex items-center justify-between">
                <span>Reduction Target:</span>
                <span className="font-mono text-amber-300 font-semibold">
                  ~{analysis.targetIop.percentageReductionNeeded}% drop from baseline
                </span>
              </div>

              <div className="pt-2 border-t border-indigo-900/40">
                <div className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">
                  Recommended First-Line Management:
                </div>
                <div className="text-xs text-zinc-200 font-medium mt-0.5">
                  {analysis.targetIop.firstLineTherapy}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum Clinical Pearl Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider">
            <BookOpen className="w-4 h-4" /> 1. The Glaucoma Hemifield Test (GHT)
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            GHT compares mirror-image clusters of test locations across the horizontal raphe in superior vs inferior hemifields. Because glaucomatous ganglion cell axonal damage selectively damages the superior or inferior poles of the optic nerve head, asymmetrical scotoma development is a pathognomonic hallmark.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" /> 2. CCT & The OHTS Landmark Trial
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            The Ocular Hypertension Treatment Study (OHTS) demonstrated that a central corneal thickness &lt;555 µm confers a three-fold increase in the 5-year risk of developing POAG compared to corneas &gt;588 µm. Thin corneas both artificially understate Goldmann applanation readings and reflect thinner lamina cribrosa collagen scaffolding.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
            <Activity className="w-4 h-4" /> 3. Pattern Deviation vs Total Deviation
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Total Deviation measures raw divergence from age-matched healthy normals, capturing both generalized depression (e.g. nuclear cataract, corneal haze, small pupil) and focal scotomas. Pattern Deviation subtracts the generalized height of the hill of vision, unmasking true focal glaucomatous bundle dropout beneath media opacities.
          </p>
        </div>
      </div>
    </div>
  );
}
