'use client';

/**
 * EEGNeurophysiologySimulator.tsx
 *
 * Interactive Clinical Neurophysiology & Quantitative EEG (qEEG) Workstation.
 * Features:
 * - 16-18 Channel synchronized oscillographic EEG display with clinical paper grid.
 * - Standard 10-20 montages: Longitudinal Bipolar ("Double Banana"), Transverse, Average Referential.
 * - 8 High-yield clinical presets (Absence 3Hz, PLEDs, Triphasic Waves, Burst Suppression, etc.).
 * - Real-time qEEG Dashboard: FFT 4-band spectral power, SEF95, Alpha-Delta Ratio, BSR %, aEEG envelope.
 * - Provocative maneuvers: Eye opening (Berger effect), Hyperventilation, Photic stimulation.
 * - Socratic AI context bridge (`mediverse:open-ai-with-context`).
 *
 * Location: frontend/components/simulators/EEGNeurophysiologySimulator.tsx
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Activity,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Zap,
  Eye,
  EyeOff,
  Wind,
  Sun,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  Layers,
  BarChart3,
  Cpu,
  Brain
} from 'lucide-react';
import {
  ElectrodeId,
  MontageType,
  EEGPresetId,
  EEG_PRESETS,
  getMontageChannels,
  synthesizeEEGEpoch,
  computeQEEGMetrics,
  formatUv
} from '@/.gemini/skills/EEGNeurophysiologyEngine';

export default function EEGNeurophysiologySimulator() {
  // Simulator State
  const [selectedPreset, setSelectedPreset] = useState<EEGPresetId>('normal-awake-alpha');
  const [montage, setMontage] = useState<MontageType>('LONGITUDINAL_DOUBLE_BANANA');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const [paperSpeedMmSec, setPaperSpeedMmSec] = useState<15 | 30 | 60>(30);
  const [sensitivityUvMm, setSensitivityUvMm] = useState<5 | 7 | 10 | 15>(7);

  // Provocation States
  const [eyesOpen, setEyesOpen] = useState<boolean>(false);
  const [hyperventilationActive, setHyperventilationActive] = useState<boolean>(false);
  const [hvSeconds, setHvSeconds] = useState<number>(0);
  const [photicHz, setPhoticHz] = useState<number>(0);

  // Active Preset Metadata
  const presetInfo = EEG_PRESETS[selectedPreset];

  // Animation frame loop
  const animationRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number>(0);

  useEffect(() => {
    const handleAnimationFrame = (timestamp: number) => {
      if (lastTimestampRef.current === 0) {
        lastTimestampRef.current = timestamp;
      }
      const deltaSec = (timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      if (isPlaying) {
        setCurrentTimeSec((prev) => (prev + deltaSec) % 60); // Loop 60-second window
        if (hyperventilationActive) {
          setHvSeconds((prev) => prev + deltaSec);
        }
      }

      animationRef.current = requestAnimationFrame(handleAnimationFrame);
    };

    animationRef.current = requestAnimationFrame(handleAnimationFrame);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, hyperventilationActive]);

  // Window duration based on paper speed (30 mm/s standard is ~8-10 seconds per screen)
  const windowDurationSec = useMemo(() => {
    switch (paperSpeedMmSec) {
      case 15: return 12.0;
      case 30: return 6.0;
      case 60: return 3.0;
    }
  }, [paperSpeedMmSec]);

  // Provocation state object
  const provocationState = useMemo(() => ({
    eyesOpen,
    hyperventilationActive,
    hyperventilationSeconds: hvSeconds,
    photicStimulationHz: photicHz
  }), [eyesOpen, hyperventilationActive, hvSeconds, photicHz]);

  // Generate multi-channel waveforms for current window
  const epoch = useMemo(() => {
    return synthesizeEEGEpoch(
      selectedPreset,
      montage,
      currentTimeSec,
      windowDurationSec,
      128, // 128 Hz sampling
      provocationState
    );
  }, [selectedPreset, montage, currentTimeSec, windowDurationSec, provocationState]);

  // Compute real-time Quantitative EEG (qEEG) metrics
  const qeeg = useMemo(() => {
    return computeQEEGMetrics(selectedPreset, provocationState);
  }, [selectedPreset, provocationState]);

  // Reset simulator
  const handleReset = () => {
    setCurrentTimeSec(0);
    setEyesOpen(false);
    setHyperventilationActive(false);
    setHvSeconds(0);
    setPhoticHz(0);
  };

  // Dispatch Socratic AI context
  const handleAskAI = () => {
    const aiContext = `
Clinical Neurophysiology (EEG / qEEG) Case:
- Preset: ${presetInfo.name} (${presetInfo.clinicalCategory})
- Description: ${presetInfo.description}
- Current Montage: ${montage}
- Paper Speed: ${paperSpeedMmSec} mm/s, Sensitivity: ${sensitivityUvMm} µV/mm
- Provocation Maneuvers: Eyes ${eyesOpen ? 'OPEN (Berger effect check)' : 'CLOSED'}, Hyperventilation: ${hyperventilationActive ? `ACTIVE (${Math.round(hvSeconds)}s)` : 'OFF'}, Photic Stimulation: ${photicHz > 0 ? `${photicHz} Hz` : 'OFF'}
- Quantitative EEG (qEEG) Metrics:
  * Delta: ${qeeg.deltaPowerPct}% | Theta: ${qeeg.thetaPowerPct}% | Alpha: ${qeeg.alphaPowerPct}% | Beta: ${qeeg.betaPowerPct}%
  * Spectral Edge Frequency (SEF95): ${qeeg.spectralEdgeFrequency95Hz} Hz
  * Alpha-Delta Ratio (ADR): ${qeeg.alphaDeltaRatio} (Ischemia threshold <0.8)
  * Burst Suppression Ratio (BSR): ${qeeg.burstSuppressionRatioPct}%
  * aEEG Classification: ${qeeg.aEEG.classification} (Upper: ${qeeg.aEEG.upperMarginUv} µV, Lower: ${qeeg.aEEG.lowerMarginUv} µV)
- Diagnostic Criteria: ${presetInfo.diagnosticCriteria.join('; ')}
- Recommended Treatment: ${presetInfo.treatmentGuidance}
`;

    window.dispatchEvent(
      new CustomEvent('mediverse:open-ai-with-context', {
        detail: { context: aiContext }
      })
    );
  };

  return (
    <div className="flex flex-col gap-6 text-slate-100">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-inner">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Clinical Neurophysiology & Quantitative EEG (qEEG) Workstation
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-700/50">
                10-20 System
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Synchronized 16-channel electrophysiological tracing, International 10-20 montages, and FFT spectral analytics.
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              isPlaying
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Pause Sweep' : 'Resume Sweep'}
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Reset Tracing"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleAskAI}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 border border-indigo-400/30 transition"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            Ask Socratic AI
          </button>
        </div>
      </div>

      {/* Preset Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {(Object.keys(EEG_PRESETS) as EEGPresetId[]).map((presetId) => {
          const item = EEG_PRESETS[presetId];
          const isSelected = selectedPreset === presetId;
          return (
            <button
              key={presetId}
              onClick={() => setSelectedPreset(presetId)}
              className={`flex flex-col p-2.5 rounded-lg border text-left transition-all ${
                isSelected
                  ? 'bg-cyan-950/70 border-cyan-500 shadow-md shadow-cyan-500/20 text-white'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                    item.clinicalCategory === 'Epilepsy'
                      ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                      : item.clinicalCategory === 'Critical Care'
                      ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                      : item.clinicalCategory === 'Encephalopathy'
                      ? 'bg-purple-950/80 text-purple-300 border border-purple-800/60'
                      : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                  }`}
                >
                  {item.clinicalCategory}
                </span>
                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />}
              </div>
              <span className="text-xs font-bold leading-tight line-clamp-2">{item.name.split('(')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Controls Bar: Montages, Paper Speed, Sensitivity, Provocations */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-900/70 border border-slate-800">
        {/* Montage Selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            10-20 Montage
          </label>
          <select
            value={montage}
            onChange={(e) => setMontage(e.target.value as MontageType)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="LONGITUDINAL_DOUBLE_BANANA">Longitudinal Bipolar (Double Banana)</option>
            <option value="TRANSVERSE">Transverse Bipolar (Coronal)</option>
            <option value="REFERENTIAL_AVG">Average Referential (Avg)</option>
          </select>
        </div>

        {/* Paper Speed & Sensitivity */}
        <div className="flex items-center gap-3">
          <div className="flex-1 flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              Paper Speed
            </label>
            <div className="grid grid-cols-3 gap-1">
              {[15, 30, 60].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setPaperSpeedMmSec(speed as 15 | 30 | 60)}
                  className={`py-1 text-[11px] font-semibold rounded border transition ${
                    paperSpeedMmSec === speed
                      ? 'bg-cyan-600/30 text-cyan-300 border-cyan-500'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750'
                  }`}
                >
                  {speed} mm/s
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-400">Sensitivity</label>
            <div className="grid grid-cols-4 gap-1">
              {[5, 7, 10, 15].map((sens) => (
                <button
                  key={sens}
                  onClick={() => setSensitivityUvMm(sens as 5 | 7 | 10 | 15)}
                  className={`py-1 text-[10px] font-semibold rounded border transition ${
                    sensitivityUvMm === sens
                      ? 'bg-cyan-600/30 text-cyan-300 border-cyan-500'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750'
                  }`}
                >
                  {sens}µV
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Provocative Maneuvers */}
        <div className="md:col-span-2 flex flex-wrap items-center gap-2">
          {/* Eye Opening Toggle */}
          <button
            onClick={() => setEyesOpen(!eyesOpen)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition ${
              eyesOpen
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
            }`}
          >
            {eyesOpen ? <Eye className="w-4 h-4 text-amber-400" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
            {eyesOpen ? 'Eyes OPEN (Alpha Attenuated)' : 'Eyes CLOSED (Alpha Intact)'}
          </button>

          {/* Hyperventilation Toggle */}
          <button
            onClick={() => setHyperventilationActive(!hyperventilationActive)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition ${
              hyperventilationActive
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 animate-pulse'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
            }`}
          >
            <Wind className="w-4 h-4 text-sky-400" />
            HV: {hyperventilationActive ? `Active (${Math.round(hvSeconds)}s)` : 'Hyperventilate (3m)'}
          </button>

          {/* Photic Stimulation */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">
            <Sun className={`w-4 h-4 ${photicHz > 0 ? 'text-yellow-400 animate-spin' : 'text-slate-500'}`} />
            <span className="text-xs text-slate-400">Photic:</span>
            <input
              type="range"
              min="0"
              max="30"
              step="1"
              value={photicHz}
              onChange={(e) => setPhoticHz(Number(e.target.value))}
              className="w-20 accent-cyan-500 h-1 bg-slate-700 rounded-lg cursor-pointer"
            />
            <span className="text-xs font-mono font-bold text-cyan-300 w-8 text-right">
              {photicHz > 0 ? `${photicHz}Hz` : 'OFF'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Workstation Body: Tracings Viewport & qEEG Side-Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Oscillographic Traces Canvas (Col-span 3) */}
        <div className="xl:col-span-3 flex flex-col rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
          {/* Tracing Top Header */}
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold text-cyan-400">{presetInfo.name}</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">Channels: {epoch.channels.length}</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400 font-mono">Time: {currentTimeSec.toFixed(1)}s</span>
            </div>
            <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
              <span>HPF: 0.5 Hz</span>
              <span>LPF: 70 Hz</span>
              <span>Notch: 60 Hz ON</span>
              <span className="text-cyan-400 font-semibold">{sensitivityUvMm} µV/mm</span>
            </div>
          </div>

          {/* Oscillographic Traces SVG Rendering */}
          <div className="relative w-full h-[620px] bg-[#030712] overflow-hidden select-none">
            {/* Clinical Paper Background Grid Lines (1-second intervals) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
              <defs>
                <pattern id="eeg-grid" width="60" height="34" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 34" fill="none" stroke="#38bdf8" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#eeg-grid)" />
            </svg>

            {/* Tracings Multi-Channel Renderer */}
            <svg
              className="w-full h-full"
              viewBox={`0 0 1000 ${epoch.channels.length * 34 + 20}`}
              preserveAspectRatio="none"
            >
              {epoch.channels.map((channel, chIndex) => {
                const baseY = chIndex * 34 + 26;
                const points = channel.samples;
                const sampleCount = points.length;

                // Scale voltage: sensitivityUvMm defines µV per millimeter (~3-4 px)
                const voltageScale = (10 / sensitivityUvMm) * 0.45;

                // Build polyline points string
                let pathD = '';
                for (let i = 0; i < sampleCount; i++) {
                  const x = (i / (sampleCount - 1)) * 970 + 20;
                  // In EEG, Negative is UPWARD (classic convention)
                  const y = baseY - points[i].voltageUv * voltageScale;
                  pathD += `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)} `;
                }

                // Color coding by anatomical region
                let traceColor = '#22d3ee'; // Default cyan
                if (channel.definition.region === 'LEFT_TEMPORAL') traceColor = '#38bdf8';
                else if (channel.definition.region === 'RIGHT_TEMPORAL') traceColor = '#a855f7';
                else if (channel.definition.region === 'LEFT_PARASAGITTAL') traceColor = '#34d399';
                else if (channel.definition.region === 'RIGHT_PARASAGITTAL') traceColor = '#f59e0b';
                else if (channel.definition.region === 'MIDLINE') traceColor = '#f43f5e';

                return (
                  <g key={channel.definition.id}>
                    {/* Channel Baseline subtle line */}
                    <line
                      x1="20"
                      y1={baseY}
                      x2="990"
                      y2={baseY}
                      stroke="#1e293b"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />

                    {/* Lead Name Label on Left */}
                    <text
                      x="25"
                      y={baseY - 7}
                      fill="#94a3b8"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {channel.definition.label}
                    </text>

                    {/* Dynamic EEG Waveform Polyline */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke={traceColor}
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                );
              })}

              {/* 50 µV Calibration Pulse indicator on bottom right */}
              <g transform="translate(920, 600)">
                <path d="M 0 0 L 0 -15 L 20 -15 L 20 0" fill="none" stroke="#facc15" strokeWidth="1.5" />
                <text x="-5" y="12" fill="#facc15" fontSize="9" fontFamily="monospace">
                  50µV / 0.2s
                </text>
              </g>
            </svg>
          </div>

          {/* Time scrubber bar below display */}
          <div className="flex items-center gap-4 px-4 py-2 bg-slate-900 border-t border-slate-800 text-xs">
            <span className="text-slate-400 font-mono">Epoch Scrub:</span>
            <input
              type="range"
              min="0"
              max="60"
              step="0.1"
              value={currentTimeSec}
              onChange={(e) => setCurrentTimeSec(Number(e.target.value))}
              className="flex-1 accent-cyan-500 h-1 bg-slate-700 rounded-lg cursor-pointer"
            />
            <span className="font-mono text-cyan-300 w-16 text-right">{currentTimeSec.toFixed(1)}s / 60s</span>
          </div>
        </div>

        {/* qEEG Analytics & Clinical Interpretation (Col-span 1) */}
        <div className="flex flex-col gap-6">
          {/* Quantitative EEG (qEEG) Card */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                qEEG Spectral Analytics
              </h3>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                FFT Power
              </span>
            </div>

            {/* 4-Band Spectral Power Distribution */}
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-semibold text-slate-300">Frequency Band Power Distribution</span>

              {/* Delta */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-rose-400">Delta (0.5 - 4 Hz)</span>
                  <span className="text-slate-300 font-bold">{qeeg.deltaPowerPct}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all duration-300"
                    style={{ width: `${qeeg.deltaPowerPct}%` }}
                  />
                </div>
              </div>

              {/* Theta */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-amber-400">Theta (4 - 8 Hz)</span>
                  <span className="text-slate-300 font-bold">{qeeg.thetaPowerPct}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-300"
                    style={{ width: `${qeeg.thetaPowerPct}%` }}
                  />
                </div>
              </div>

              {/* Alpha */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-emerald-400">Alpha (8 - 13 Hz)</span>
                  <span className="text-slate-300 font-bold">{qeeg.alphaPowerPct}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${qeeg.alphaPowerPct}%` }}
                  />
                </div>
              </div>

              {/* Beta */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-sky-400">Beta (13 - 30 Hz)</span>
                  <span className="text-slate-300 font-bold">{qeeg.betaPowerPct}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-500 rounded-full transition-all duration-300"
                    style={{ width: `${qeeg.betaPowerPct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Critical Quantitative Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
              {/* Spectral Edge Frequency 95 */}
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex flex-col">
                <span className="text-[10px] text-slate-400 font-medium">SEF 95%</span>
                <span className="text-sm font-bold font-mono text-cyan-300">
                  {qeeg.spectralEdgeFrequency95Hz.toFixed(1)} Hz
                </span>
                <span className="text-[9px] text-slate-500">Spectral edge</span>
              </div>

              {/* Alpha-Delta Ratio (ADR) */}
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex flex-col">
                <span className="text-[10px] text-slate-400 font-medium">ADR (Ischemia)</span>
                <span
                  className={`text-sm font-bold font-mono ${
                    qeeg.alphaDeltaRatio < 0.8
                      ? 'text-rose-400'
                      : qeeg.alphaDeltaRatio < 1.5
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {qeeg.alphaDeltaRatio.toFixed(2)}
                </span>
                <span className="text-[9px] text-slate-500">{qeeg.alphaDeltaRatio < 0.8 ? 'Ischemia risk' : 'Normal'}</span>
              </div>

              {/* Burst Suppression Ratio (BSR) */}
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex flex-col">
                <span className="text-[10px] text-slate-400 font-medium">BSR %</span>
                <span
                  className={`text-sm font-bold font-mono ${
                    qeeg.burstSuppressionRatioPct > 70 ? 'text-purple-400' : 'text-slate-200'
                  }`}
                >
                  {qeeg.burstSuppressionRatioPct}%
                </span>
                <span className="text-[9px] text-slate-500">Target: 70-85%</span>
              </div>

              {/* Dominant Frequency */}
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex flex-col">
                <span className="text-[10px] text-slate-400 font-medium">Dominant Freq</span>
                <span className="text-sm font-bold font-mono text-slate-200">
                  {qeeg.dominantFrequencyHz.toFixed(1)} Hz
                </span>
                <span className="text-[9px] text-slate-500">{qeeg.meanAmplitudeUv.toFixed(0)} µV amp</span>
              </div>
            </div>

            {/* aEEG Status */}
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">aEEG Envelope</span>
                <span className="text-xs font-bold text-white">{qeeg.aEEG.classification}</span>
              </div>
              <div className="text-right font-mono text-xs">
                <span className="text-cyan-400">{qeeg.aEEG.upperMarginUv} µV</span> /{' '}
                <span className="text-slate-400">{qeeg.aEEG.lowerMarginUv} µV</span>
              </div>
            </div>
          </div>

          {/* Clinical Interpretation & Board Pearls */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col gap-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Brain className="w-4 h-4 text-violet-400" />
              Clinical Interpretation & Plan
            </h3>

            {/* Pathophysiology */}
            <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
              <span className="font-semibold text-slate-200 block mb-1">Pathophysiology:</span>
              {presetInfo.pathophysiology}
            </div>

            {/* Diagnostic Criteria */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Diagnostic Criteria:
              </span>
              {presetInfo.diagnosticCriteria.map((crit, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{crit}</span>
                </div>
              ))}
            </div>

            {/* Treatment Guidance */}
            <div className="p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-200 flex flex-col gap-1">
              <span className="font-bold flex items-center gap-1 text-indigo-300">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Pharmacological & Clinical Protocol:
              </span>
              <p className="leading-relaxed text-[11px]">{presetInfo.treatmentGuidance}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
