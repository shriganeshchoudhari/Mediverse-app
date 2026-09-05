'use client';

import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import {
  Zap,
  Activity,
  ShieldAlert,
  AlertTriangle,
  AlertOctagon,
  Sparkles,
  RotateCcw,
  Sliders,
  Heart,
  Radio,
  Layers,
  HelpCircle,
  Eye,
} from 'lucide-react';
import {
  PacingMode,
  PacingDials,
  IntrinsicCardiacState,
  calculateCardiacPacingDynamics,
  generatePacingECGStrip,
  PACING_PRESETS,
} from '@/.gemini/skills/CardiacPacingEngine';

export default function CardiacPacingSimulator() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('complete-heart-block');

  // Generator Dials
  const [mode, setMode] = useState<PacingMode>('VVI');
  const [rateBpm, setRateBpm] = useState<number>(75);
  const [ventricularOutputMa, setVentricularOutputMa] = useState<number>(5.0);
  const [ventricularSensitivityMv, setVentricularSensitivityMv] = useState<number>(2.5);
  const [atrialOutputMa, setAtrialOutputMa] = useState<number>(3.0);
  const [atrialSensitivityMv, setAtrialSensitivityMv] = useState<number>(1.0);
  const [avDelayMs, setAvDelayMs] = useState<number>(180);

  // Patient Intrinsic Electrophysiology
  const [intrinsicAtrialRate, setIntrinsicAtrialRate] = useState<number>(88);
  const [intrinsicVentricularRate, setIntrinsicVentricularRate] = useState<number>(30);
  const [hasAvDissociation, setHasAvDissociation] = useState<boolean>(true);
  const [intrinsicRWaveMv, setIntrinsicRWaveMv] = useState<number>(8.5);
  const [stimulationThresholdMa, setStimulationThresholdMa] = useState<number>(1.0);
  const [leadDisplaced, setLeadDisplaced] = useState<boolean>(false);
  const [ambientNoiseMv, setAmbientNoiseMv] = useState<number>(0.1);

  // Threshold Testing Mode
  const [thresholdTestActive, setThresholdTestActive] = useState<boolean>(false);

  // Compile Dials & Intrinsic State
  const currentDials: PacingDials = useMemo(
    () => ({
      mode,
      rateBpm,
      ventricularOutputMa,
      ventricularSensitivityMv,
      atrialOutputMa,
      atrialSensitivityMv,
      avDelayMs,
    }),
    [mode, rateBpm, ventricularOutputMa, ventricularSensitivityMv, atrialOutputMa, atrialSensitivityMv, avDelayMs]
  );

  const currentIntrinsic: IntrinsicCardiacState = useMemo(
    () => ({
      intrinsicAtrialRateBpm: intrinsicAtrialRate,
      intrinsicVentricularRateBpm: intrinsicVentricularRate,
      hasAvDissociation,
      intrinsicRWaveAmplitudeMv: intrinsicRWaveMv,
      intrinsicPWaveAmplitudeMv: 1.5,
      stimulationThresholdMa,
      atrialStimulationThresholdMa: 1.2,
      baselineQtIntervalMs: 440,
      leadDisplaced,
      ambientElectromagneticNoiseMv: ambientNoiseMv,
    }),
    [intrinsicAtrialRate, intrinsicVentricularRate, hasAvDissociation, intrinsicRWaveMv, stimulationThresholdMa, leadDisplaced, ambientNoiseMv]
  );

  // Simulation Results
  const pacingResult = useMemo(
    () => calculateCardiacPacingDynamics(currentDials, currentIntrinsic),
    [currentDials, currentIntrinsic]
  );

  // Synthesized ECG Data
  const ecgData = useMemo(
    () => generatePacingECGStrip(currentDials, currentIntrinsic, pacingResult),
    [currentDials, currentIntrinsic, pacingResult]
  );

  // Load Preset
  const loadPreset = (presetId: string) => {
    const preset = PACING_PRESETS.find(p => p.id === presetId);
    if (!preset) return;
    setSelectedPresetId(presetId);

    setMode(preset.dials.mode);
    setRateBpm(preset.dials.rateBpm);
    setVentricularOutputMa(preset.dials.ventricularOutputMa);
    setVentricularSensitivityMv(preset.dials.ventricularSensitivityMv);
    setAtrialOutputMa(preset.dials.atrialOutputMa);
    setAtrialSensitivityMv(preset.dials.atrialSensitivityMv);
    setAvDelayMs(preset.dials.avDelayMs);

    setIntrinsicAtrialRate(preset.intrinsicState.intrinsicAtrialRateBpm);
    setIntrinsicVentricularRate(preset.intrinsicState.intrinsicVentricularRateBpm);
    setHasAvDissociation(preset.intrinsicState.hasAvDissociation);
    setIntrinsicRWaveMv(preset.intrinsicState.intrinsicRWaveAmplitudeMv);
    setStimulationThresholdMa(preset.intrinsicState.stimulationThresholdMa);
    setLeadDisplaced(preset.intrinsicState.leadDisplaced);
    setAmbientNoiseMv(preset.intrinsicState.ambientElectromagneticNoiseMv);
  };

  // Step-down threshold test helper
  const performStepDownThresholdTest = () => {
    setThresholdTestActive(true);
    // Find capture threshold by stepping down output from 5.0 to 0.2
    let testMa = 5.0;
    const effectiveThresh = leadDisplaced ? stimulationThresholdMa * 3.5 : stimulationThresholdMa;
    const interval = setInterval(() => {
      testMa -= 0.4;
      if (testMa <= effectiveThresh) {
        setVentricularOutputMa(+(effectiveThresh + 0.1).toFixed(1));
        clearInterval(interval);
        setThresholdTestActive(false);
      } else {
        setVentricularOutputMa(+testMa.toFixed(1));
      }
    }, 150);
  };

  // Consult Socratic AI
  const handleConsultAI = () => {
    const context = `Cardiac Electrophysiology & Temporary Pacemaker Workstation:
Mode: ${mode} | Dial Rate: ${rateBpm} bpm | Output: ${ventricularOutputMa} mA | Sensitivity: ${ventricularSensitivityMv} mV
Capture Status: ${pacingResult.captureStatus} | Sensing Status: ${pacingResult.sensingStatus}
Safety Margin: ${pacingResult.safetyMarginMultiplier}x (Status: ${pacingResult.safetyMarginStatus})
Effective HR: ${pacingResult.effectiveHeartRateBpm} bpm | Cardiac Output: ${pacingResult.cardiacOutputLpm} L/min | MAP: ${pacingResult.meanArterialPressureMmHg} mmHg
Arrhythmia Trigger: ${pacingResult.arrhythmiaTrigger} | R-on-T Risk: ${pacingResult.isROnTRisk}
Pacemaker Syndrome: ${pacingResult.pacemakerSyndromeActive} | Cannon A Waves: ${pacingResult.cannonAWavesPresent}
Active Warnings: ${pacingResult.warnings.join('; ') || 'None'}`;

    window.dispatchEvent(
      new CustomEvent('mediverse:open-ai-with-context', {
        detail: { context },
      })
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-slate-100">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 border border-amber-500/30 rounded-xl text-amber-400">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
                Cardiac Electrophysiology &amp; Temporary Pacemaker Workstation
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-950/70 border border-amber-700/60 text-amber-300 font-medium">
                  Dual-Chamber EPG
                </span>
              </h1>
              <p className="text-sm text-slate-400">
                Transvenous &amp; epicardial pacing mechanics, capture/sensing thresholds, R-on-T prevention, and pacemaker syndrome.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Status Alarm Banner */}
            {pacingResult.arrhythmiaTrigger === 'R_ON_T_VENTRICULAR_FIBRILLATION' ? (
              <div className="px-4 py-2 rounded-xl border flex items-center gap-2 font-semibold text-sm bg-rose-950/80 border-rose-600 text-rose-200 animate-pulse">
                <AlertOctagon className="w-4 h-4 text-rose-400" />
                <span>R-ON-T POLYMORPHIC VF ACTIVE</span>
              </div>
            ) : pacingResult.arrhythmiaTrigger === 'ASYSTOLIC_PAUSE' ? (
              <div className="px-4 py-2 rounded-xl border flex items-center gap-2 font-semibold text-sm bg-rose-950/80 border-rose-600 text-rose-200 animate-pulse">
                <AlertOctagon className="w-4 h-4 text-rose-400" />
                <span>OVERSENSING ASYSTOLE</span>
              </div>
            ) : pacingResult.captureStatus === 'LOSS_OF_CAPTURE' ? (
              <div className="px-4 py-2 rounded-xl border flex items-center gap-2 font-semibold text-sm bg-amber-950/80 border-amber-600 text-amber-200 animate-pulse">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>FAILURE TO CAPTURE</span>
              </div>
            ) : pacingResult.sensingStatus === 'UNDERSENSING' ? (
              <div className="px-4 py-2 rounded-xl border flex items-center gap-2 font-semibold text-sm bg-orange-950/80 border-orange-600 text-orange-200">
                <ShieldAlert className="w-4 h-4 text-orange-400" />
                <span>UNDERSENSING ACTIVE</span>
              </div>
            ) : (
              <div className="px-4 py-2 rounded-xl border flex items-center gap-2 font-semibold text-sm bg-emerald-950/60 border-emerald-600 text-emerald-300">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>PACED CAPTURE OPTIMAL</span>
              </div>
            )}

            <button
              onClick={handleConsultAI}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 border border-amber-400/30 text-white text-sm font-semibold flex items-center gap-2 transition shadow-lg shadow-amber-600/20"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Consult Socratic AI</span>
            </button>
          </div>
        </div>

        {/* Clinical Presets Grid */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-slate-300">
              High-Yield Clinical Presets
            </span>
            <button
              onClick={() => loadPreset('complete-heart-block')}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3 h-3" /> Reset Default
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {PACING_PRESETS.map(p => (
              <button
                key={p.id}
                onClick={() => loadPreset(p.id)}
                className={`text-left p-2.5 rounded-xl border text-xs transition ${
                  selectedPresetId === p.id
                    ? 'bg-amber-950/60 border-amber-500 text-white shadow-md'
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold truncate">{p.title.split('(')[0]}</div>
                <div className="text-[11px] text-amber-400 truncate font-mono">{p.dials.mode} @ {p.dials.rateBpm} bpm</div>
                <div className="mt-1 text-[10px] text-slate-400 truncate">{p.patientProfile.split(';')[0]}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Telemetry HUD Banner */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Effective Heart Rate */}
        <div
          className={`border p-3.5 rounded-xl text-center space-y-1 ${
            pacingResult.effectiveHeartRateBpm < 40 || pacingResult.effectiveHeartRateBpm > 140
              ? 'bg-rose-950/40 border-rose-600'
              : 'bg-slate-900/80 border-slate-800'
          }`}
        >
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Effective Heart Rate</span>
          <div
            className={`text-2xl font-mono font-black ${
              pacingResult.effectiveHeartRateBpm < 40 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'
            }`}
          >
            {pacingResult.effectiveHeartRateBpm} <span className="text-xs font-normal text-slate-400">bpm</span>
          </div>
          <span className="text-[10px] text-slate-500 block">
            {pacingResult.ventricularPacingPcnt > 0 ? `${pacingResult.ventricularPacingPcnt}% Paced` : 'Intrinsic Drive'}
          </span>
        </div>

        {/* Cardiac Output */}
        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl text-center space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Cardiac Output</span>
          <div className="text-2xl font-mono font-black text-sky-400">
            {pacingResult.cardiacOutputLpm} <span className="text-xs font-normal text-slate-400">L/min</span>
          </div>
          <span className="text-[10px] text-slate-500 block">
            SV: {pacingResult.strokeVolumeMl} mL / beat
          </span>
        </div>

        {/* Mean Arterial Pressure */}
        <div
          className={`border p-3.5 rounded-xl text-center space-y-1 ${
            pacingResult.meanArterialPressureMmHg < 65
              ? 'bg-rose-950/40 border-rose-600'
              : 'bg-slate-900/80 border-slate-800'
          }`}
        >
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Mean Arterial (MAP)</span>
          <div
            className={`text-2xl font-mono font-black ${
              pacingResult.meanArterialPressureMmHg < 65 ? 'text-rose-400 animate-pulse' : 'text-amber-400'
            }`}
          >
            {pacingResult.meanArterialPressureMmHg} <span className="text-xs font-normal text-slate-400">mmHg</span>
          </div>
          <span className="text-[10px] text-slate-500 block">Target &ge; 65 mmHg</span>
        </div>

        {/* Safety Margin */}
        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl text-center space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Output Safety Margin</span>
          <div
            className={`text-2xl font-mono font-black ${
              pacingResult.safetyMarginStatus === 'SUBOPTIMAL'
                ? 'text-rose-400'
                : pacingResult.safetyMarginStatus === 'ADEQUATE'
                ? 'text-emerald-400'
                : 'text-amber-400'
            }`}
          >
            {pacingResult.safetyMarginMultiplier}x
          </div>
          <span className="text-[10px] text-slate-500 block">
            {pacingResult.safetyMarginStatus === 'SUBOPTIMAL' ? 'Goal 2.0x - 3.0x' : 'Safe Margin'}
          </span>
        </div>

        {/* Pacemaker Syndrome / Cannon Waves */}
        <div
          className={`border p-3.5 rounded-xl text-center space-y-1 ${
            pacingResult.pacemakerSyndromeActive
              ? 'bg-purple-950/40 border-purple-600'
              : 'bg-slate-900/80 border-slate-800'
          }`}
        >
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">AV Synchrony</span>
          <div
            className={`text-sm font-mono font-bold mt-1.5 ${
              pacingResult.pacemakerSyndromeActive ? 'text-purple-300' : 'text-emerald-400'
            }`}
          >
            {pacingResult.pacemakerSyndromeActive ? 'Cannon A-Waves' : 'Synchronized'}
          </div>
          <span className="text-[10px] text-slate-500 block">
            {pacingResult.pacemakerSyndromeActive ? 'Pacemaker Syndrome' : 'Normal Atrial Kick'}
          </span>
        </div>

        {/* Lead Status */}
        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl text-center space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Lead Position</span>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                leadDisplaced ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'
              }`}
            />
            <span className={`text-xs font-bold ${leadDisplaced ? 'text-rose-400' : 'text-slate-300'}`}>
              {leadDisplaced ? 'Dislodged' : 'Stable Apex'}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 block">
            Thresh: {leadDisplaced ? (stimulationThresholdMa * 3.5).toFixed(1) : stimulationThresholdMa} mA
          </span>
        </div>
      </div>

      {/* Main Console Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: External Pulse Generator (EPG) Console */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              Pulse Generator Dials
            </h2>
            {/* LED Status Indicators */}
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <div className="flex items-center gap-1">
                <span
                  className={`w-2 h-2 rounded-full ${
                    pacingResult.ventricularPacingPcnt > 0 ? 'bg-amber-400 shadow-sm shadow-amber-400' : 'bg-slate-700'
                  }`}
                />
                <span className="text-slate-400">PACE</span>
              </div>
              <div className="flex items-center gap-1">
                <span
                  className={`w-2 h-2 rounded-full ${
                    pacingResult.sensedBeatsPcnt > 0 ? 'bg-sky-400 shadow-sm shadow-sky-400' : 'bg-slate-700'
                  }`}
                />
                <span className="text-slate-400">SENSE</span>
              </div>
            </div>
          </div>

          {/* Mode Selector Tabs */}
          <div className="space-y-1.5">
            <span className="text-xs text-slate-400 font-semibold block">Pacing Mode (NASPE/BPEG)</span>
            <div className="grid grid-cols-4 gap-1.5">
              {(['VVI', 'VOO', 'DDD', 'DOO', 'AAI', 'AOO', 'DDI'] as PacingMode[]).map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition ${
                    mode === m
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Pacing Rate Dial */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Pacing Rate</span>
              <span className="font-mono text-amber-400 font-bold">{rateBpm} ppm (bpm)</span>
            </div>
            <input
              type="range"
              min={30}
              max={150}
              step={5}
              value={rateBpm}
              onChange={e => setRateBpm(+e.target.value)}
              className="w-full accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>30 ppm</span>
              <span>Lower Rate Limit</span>
              <span>150 ppm</span>
            </div>
          </div>

          {/* Ventricular Output Current (mA) */}
          <div className="space-y-1.5 text-xs p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
            <div className="flex justify-between text-slate-300">
              <span className="font-semibold text-amber-300">Ventricular Output</span>
              <span className="font-mono text-amber-400 font-bold">{ventricularOutputMa.toFixed(1)} mA</span>
            </div>
            <input
              type="range"
              min={0.1}
              max={20.0}
              step={0.1}
              value={ventricularOutputMa}
              onChange={e => setVentricularOutputMa(+e.target.value)}
              className="w-full accent-amber-500"
            />
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>Stimulation Threshold: {stimulationThresholdMa} mA</span>
              <button
                onClick={performStepDownThresholdTest}
                disabled={thresholdTestActive}
                className="text-amber-400 hover:underline font-semibold"
              >
                {thresholdTestActive ? 'Testing...' : 'Test Threshold'}
              </button>
            </div>
          </div>

          {/* Ventricular Sensitivity (mV) */}
          <div className="space-y-1.5 text-xs p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
            <div className="flex justify-between text-slate-300">
              <span className="font-semibold text-sky-300">Ventricular Sensitivity</span>
              <span className="font-mono text-sky-400 font-bold">{ventricularSensitivityMv.toFixed(1)} mV</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={20.0}
              step={0.5}
              value={ventricularSensitivityMv}
              onChange={e => setVentricularSensitivityMv(+e.target.value)}
              className="w-full accent-sky-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span className="text-emerald-400">0.5 mV (Most Sensitive)</span>
              <span className="text-rose-400">20 mV (Least Sensitive)</span>
            </div>
            <span className="text-[10px] text-slate-500 block">
              Native R-Wave: {intrinsicRWaveMv} mV. Set dial to 1/2 of R-wave (~{+(intrinsicRWaveMv / 2).toFixed(1)} mV).
            </span>
          </div>

          {/* Dual Chamber Settings (Active in DDD/DOO/DDI) */}
          {(mode.startsWith('D') || mode.startsWith('A')) && (
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3 text-xs">
              <span className="text-[10px] font-bold text-purple-400 uppercase block">Atrial Channel Settings</span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-slate-300 text-[11px] mb-1">
                    <span>Atrial Output</span>
                    <span className="font-mono text-purple-400">{atrialOutputMa.toFixed(1)} mA</span>
                  </div>
                  <input
                    type="range"
                    min={0.1}
                    max={15.0}
                    step={0.1}
                    value={atrialOutputMa}
                    onChange={e => setAtrialOutputMa(+e.target.value)}
                    className="w-full accent-purple-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-slate-300 text-[11px] mb-1">
                    <span>AV Delay</span>
                    <span className="font-mono text-purple-400">{avDelayMs} ms</span>
                  </div>
                  <input
                    type="range"
                    min={60}
                    max={280}
                    step={10}
                    value={avDelayMs}
                    onChange={e => setAvDelayMs(+e.target.value)}
                    className="w-full accent-purple-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Electrophysiological Pitfall Toggles */}
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Patient Electrophysiology &amp; Stress Tests
            </span>
            <div className="space-y-2">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-300">Lead Dislodgement / Micro-Shift</span>
                <input
                  type="checkbox"
                  checked={leadDisplaced}
                  onChange={e => setLeadDisplaced(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-amber-500"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-300">Electrocautery / EMI Noise (0.9 mV)</span>
                <input
                  type="checkbox"
                  checked={ambientNoiseMv > 0.5}
                  onChange={e => setAmbientNoiseMv(e.target.checked ? 0.9 : 0.1)}
                  className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-amber-500"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Columns: Telemetry Waveform Monitor & Diagnostic Curves */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main 6-Second Telemetry Monitor */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Live 6-Second Surface ECG &amp; Pacing Spike Telemetry
                </h3>
                <p className="text-xs text-slate-400">
                  Lead II simulation at 250 Hz displaying pacing spikes, wide LBBB paced complexes, and native beats.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300 font-mono">
                  Sweep: 25 mm/s | 10 mm/mV
                </span>
              </div>
            </div>

            {/* Recharts ECG Rhythm Strip */}
            <div className="h-72 w-full pt-4 bg-slate-950/90 rounded-xl p-2 border border-slate-800">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ecgData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#1e293b" opacity={0.7} />
                  <XAxis
                    dataKey="timeSec"
                    stroke="#64748b"
                    tick={{ fontSize: 11 }}
                    domain={[0, 6.0]}
                    label={{ value: 'Time (Seconds)', position: 'insideBottom', offset: -5, fill: '#64748b' }}
                  />
                  <YAxis stroke="#64748b" domain={[-2.5, 3.0]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                    formatter={(val: any) => [`${val} mV`, 'ECG']}
                  />
                  <ReferenceLine y={0} stroke="#334155" />
                  <Line
                    type="monotone"
                    dataKey="millivolts"
                    name="ECG Lead II"
                    stroke={
                      pacingResult.arrhythmiaTrigger === 'R_ON_T_VENTRICULAR_FIBRILLATION'
                        ? '#f43f5e'
                        : pacingResult.captureStatus === 'LOSS_OF_CAPTURE'
                        ? '#f59e0b'
                        : '#10b981'
                    }
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Rhythm Strip Annotations & Clinical Guide */}
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300 grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
              <div>
                <strong className="text-amber-300 block mb-0.5">Pacing Spikes</strong>
                <span className="text-[11px] text-slate-400">
                  Narrow high-voltage deflections preceding wide LBBB-like QRS complexes (&gt;140 ms).
                </span>
              </div>
              <div>
                <strong className="text-sky-300 block mb-0.5">Sensing Window</strong>
                <span className="text-[11px] text-slate-400">
                  Generator detects intrinsic R-waves exceeding {ventricularSensitivityMv} mV to inhibit ventricular output.
                </span>
              </div>
              <div>
                <strong className="text-rose-300 block mb-0.5">R-on-T Window</strong>
                <span className="text-[11px] text-slate-400">
                  Vulnerable phase of ventricular repolarization (T-wave apex). Spikes here trigger polymorphic VT/VF.
                </span>
              </div>
            </div>
          </div>

          {/* Active Clinical Warning Banner */}
          {pacingResult.warnings.length > 0 && (
            <div className="bg-rose-950/30 border border-rose-800/80 rounded-xl p-4 space-y-2">
              <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-rose-400" />
                Active Clinical Alarms &amp; Troubleshooting Guidance:
              </span>
              <ul className="list-disc list-inside text-xs text-rose-200/90 space-y-1">
                {pacingResult.warnings.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
