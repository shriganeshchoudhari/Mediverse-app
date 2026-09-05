'use client';

/**
 * VentricularAssistSimulator.tsx
 *
 * Interactive Mechanical Circulatory Support (MCS) & Percutaneous Ventricular Assist Workstation.
 * Models microaxial blood pumps (Impella CP, 5.5, RP), extracorporeal devices (TandemHeart),
 * and ECPELLA synergy with real-time PV loop leftward unloading dynamics, P-level rotational kinetics,
 * purge system fluidics, suction detection, and hemolysis monitoring.
 *
 * Location: frontend/components/simulators/VentricularAssistSimulator.tsx
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  CheckCircle2,
  Sparkles,
  Play,
  Pause,
  Droplets,
  Heart,
  ShieldAlert,
  Gauge,
  HelpCircle,
  RefreshCw,
  TrendingUp,
  Cpu
} from 'lucide-react';
import {
  MCSType,
  PLevel,
  CannulaPosition,
  PurgeFluidType,
  MCSAlarm,
  VCSPresetId,
  VCS_PRESETS,
  getPumpSpeedAndFlow,
  evaluateLVUnloading,
  generatePVLoopCoordinates
} from '@/.gemini/skills/VentricularAssistEngine';

export default function VentricularAssistSimulator() {
  // Active Preset & Device Selection
  const [selectedPresetId, setSelectedPresetId] = useState<VCSPresetId>('cardiogenic-shock-scaife-impella-cp');
  const activePreset = VCS_PRESETS[selectedPresetId];

  // Device & Patient Hemodynamic Controls
  const [deviceType, setDeviceType] = useState<MCSType>(activePreset.deviceType);
  const [pLevel, setPLevel] = useState<PLevel>(activePreset.defaultPLevel);
  const [cannulaPos, setCannulaPos] = useState<CannulaPosition>(activePreset.initialState.cannulaPosition);
  const [cvpMmHg, setCvpMmHg] = useState<number>(activePreset.initialState.cvpMmHg);
  const [purgeFluid, setPurgeFluid] = useState<PurgeFluidType>(activePreset.initialState.purgeFluid);
  const [purgePressureOverride, setPurgePressureOverride] = useState<number | null>(
    activePreset.initialState.purgePressureMmHg > 1100 ? activePreset.initialState.purgePressureMmHg : null
  );
  const [ecmoFlowLMin, setEcmoFlowLMin] = useState<number>(activePreset.initialState.ecmoFlowLMin ?? 3.5);

  // Simulation play state
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [cycleTick, setCycleTick] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // When preset changes, load initial conditions
  const handlePresetSelect = (presetId: VCSPresetId) => {
    const p = VCS_PRESETS[presetId];
    setSelectedPresetId(presetId);
    setDeviceType(p.deviceType);
    setPLevel(p.defaultPLevel);
    setCannulaPos(p.initialState.cannulaPosition);
    setCvpMmHg(p.initialState.cvpMmHg);
    setPurgeFluid(p.initialState.purgeFluid);
    setPurgePressureOverride(p.initialState.purgePressureMmHg > 1100 ? p.initialState.purgePressureMmHg : null);
    if (p.initialState.ecmoFlowLMin) {
      setEcmoFlowLMin(p.initialState.ecmoFlowLMin);
    }
  };

  // Real-time loop ticker
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCycleTick(prev => (prev + 1) % 100);
    }, 150);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Compute live hemodynamics using biophysical engine
  const liveHemodynamics = useMemo(() => {
    const baseLvedp = activePreset.id === 'ecpella-synergy-severe-distension' ? 32 : 28;
    const baseMap = activePreset.id === 'ecpella-synergy-severe-distension' ? 58 : 55;

    const res = evaluateLVUnloading(deviceType, pLevel, cannulaPos, cvpMmHg, baseLvedp, baseMap);

    // Calculate purge pressure and flow
    let purgePressure = purgePressureOverride ?? (450 + pLevel * 30);
    let purgeFlow = 15 - (purgePressure > 1000 ? 12.8 : 0);

    // Hemolysis estimation
    let pfHb = 12 + pLevel * 2.2;
    if (cannulaPos === 'SUCTION_SEPTUM' || cannulaPos === 'MIGRATED_DEEP_LV') {
      pfHb += 25;
    }
    if (pLevel >= 8) {
      pfHb += 8;
    }

    const activeAlarms: MCSAlarm[] = [...res.alarms];
    if (purgePressure > 1100) {
      activeAlarms.push('PURGE_PRESSURE_HIGH');
    }
    if (pfHb > 40) {
      activeAlarms.push('HEMOLYSIS_ALERT');
    }

    const nonOptimal = activeAlarms.filter(a => a !== 'OPTIMAL');
    const finalAlarms = nonOptimal.length > 0 ? Array.from(new Set(nonOptimal)) : (['OPTIMAL'] as MCSAlarm[]);

    // Rotational speed
    const { rpm } = getPumpSpeedAndFlow(deviceType, pLevel);

    return {
      ...res,
      rpm,
      purgePressure,
      purgeFlow: Math.max(1.8, Number(purgeFlow.toFixed(1))),
      pfHb: Math.min(80, Number(pfHb.toFixed(1))),
      ldh: Math.round(220 + pfHb * 8.5),
      activeAlarms: finalAlarms
    };
  }, [deviceType, pLevel, cannulaPos, cvpMmHg, purgePressureOverride, activePreset.id]);

  // Generate PV Loop Coordinates
  const pvLoopPoints = useMemo(() => {
    return generatePVLoopCoordinates(liveHemodynamics.lvedpMmHg, liveHemodynamics.mapMmHg, pLevel);
  }, [liveHemodynamics.lvedpMmHg, liveHemodynamics.mapMmHg, pLevel]);

  // Format PV Loop points for SVG polygon
  const svgPvPoints = useMemo(() => {
    const scaleX = (vol: number) => 40 + ((vol - 40) / 110) * 280;
    const scaleY = (press: number) => 220 - (press / 140) * 190;
    return pvLoopPoints.map(p => `${scaleX(p.volumeMl)},${scaleY(p.pressureMmHg)}`).join(' ');
  }, [pvLoopPoints]);

  // Corrective Actions
  const handleRepositionCannula = () => {
    setCannulaPos('CORRECT_TRANSVALVULAR');
    showToast('Cannula successfully repositioned across aortic valve. LV inflow confirmed 4cm below AoV.');
  };

  const handleVolumeBolus = () => {
    setCvpMmHg(prev => Math.min(22, prev + 6));
    showToast('Administered 500 mL Isotonic Saline Bolus. CVP elevated, resolving suction collapse.');
  };

  const handleSwitchToBicarb = () => {
    setPurgeFluid('D5W_SODIUM_BICARBONATE');
    setPurgePressureOverride(520);
    showToast('Purge fluid converted to D5W + Sodium Bicarbonate (25 mEq/L). Micro-gap clot dissolved.');
  };

  const handlePurgeFlush = () => {
    setPurgePressureOverride(480);
    showToast('Automated AIC Purge Flush completed. Motor bearing cleared.');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Socratic AI Context Dispatch
  const handleConsultAI = () => {
    const promptContext = `
[MECHANICAL CIRCULATORY SUPPORT WORKSTATION CONSULT]
- Patient Preset: ${activePreset.title} (${activePreset.category})
- Device: ${deviceType} at P-Level: P-${pLevel} (${liveHemodynamics.rpm.toLocaleString()} RPM)
- Pump Flow: ${liveHemodynamics.pumpFlowLMin.toFixed(1)} L/min | Total CO: ${(1.2 + liveHemodynamics.pumpFlowLMin).toFixed(1)} L/min
- Hemodynamics: MAP ${liveHemodynamics.mapMmHg} mmHg | LVEDP ${liveHemodynamics.lvedpMmHg} mmHg | CVP ${cvpMmHg} mmHg
- Cardiac Power Output (CPO): ${liveHemodynamics.cpoWatts} Watts (Target: >0.60 W)
- Cannula Position: ${cannulaPos}
- Purge System: ${purgeFluid} | Pressure: ${liveHemodynamics.purgePressure} mmHg | Flow: ${liveHemodynamics.purgeFlow} mL/hr
- Hemolysis Markers: Plasma Free Hb: ${liveHemodynamics.pfHb} mg/dL | LDH: ${liveHemodynamics.ldh} U/L
- Active Alarms: ${liveHemodynamics.activeAlarms.join(', ')}
- Pathophysiology: ${activePreset.pathophysiology}
Please guide me through the clinical troubleshooting steps, hemodynamic goals, and weaning principles for this patient.
    `.trim();

    window.dispatchEvent(
      new CustomEvent('mediverse:open-ai-with-context', {
        detail: { context: promptContext }
      })
    );
  };

  return (
    <div className="flex flex-col gap-6 text-slate-100">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-emerald-900/90 border border-emerald-500/80 text-emerald-100 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md animate-fade-in text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Clinical Preset Selector Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Automated Impella Controller (AIC) & MCS Workstation
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
              Clinical Scenario & Preset Selection
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                isPlaying
                  ? 'bg-cyan-950/60 border-cyan-700 text-cyan-300 hover:bg-cyan-900/80'
                  : 'bg-amber-950/60 border-amber-700 text-amber-300 hover:bg-amber-900/80'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isPlaying ? 'Pause Waveforms' : 'Resume Waveforms'}
            </button>
            <button
              onClick={handleConsultAI}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Ask Socratic AI
            </button>
          </div>
        </div>

        {/* Preset Pill Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {(Object.keys(VCS_PRESETS) as VCSPresetId[]).map(id => {
            const p = VCS_PRESETS[id];
            const isSelected = selectedPresetId === id;
            return (
              <button
                key={id}
                onClick={() => handlePresetSelect(id)}
                className={`text-left p-3 rounded-xl border transition flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-950/70 border-cyan-500 text-white ring-1 ring-cyan-500/50 shadow-md'
                    : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900/80 text-cyan-400 border border-cyan-800/40">
                    {p.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{p.deviceType}</span>
                </div>
                <div className="font-semibold text-xs text-white line-clamp-1">{p.title}</div>
                <div className="text-[11px] text-slate-400 line-clamp-2 mt-1">{p.description}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Alarm Alert Bar */}
      {liveHemodynamics.activeAlarms.some(a => a !== 'OPTIMAL') && (
        <div className="bg-rose-950/80 border-2 border-rose-500/80 rounded-2xl p-4 backdrop-blur-md shadow-2xl animate-pulse">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0" />
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-rose-300">
                  CRITICAL CONTROLLER ALARM DETECTED
                </div>
                <div className="text-sm font-semibold text-white mt-0.5 flex flex-wrap items-center gap-2">
                  {liveHemodynamics.activeAlarms.map(alarm => (
                    <span
                      key={alarm}
                      className="px-2 py-0.5 rounded bg-rose-900/90 text-rose-200 border border-rose-600/60 font-mono text-xs"
                    >
                      {alarm}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Context-Sensitive Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {liveHemodynamics.activeAlarms.includes('SUCTION') && (
                <button
                  onClick={handleVolumeBolus}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow transition flex items-center gap-1.5"
                >
                  <Droplets className="w-3.5 h-3.5" />
                  Give 500 mL Saline Bolus
                </button>
              )}
              {liveHemodynamics.activeAlarms.includes('CANNULA_MALPOSITION') && (
                <button
                  onClick={handleRepositionCannula}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow transition flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reposition Cannula to LV
                </button>
              )}
              {liveHemodynamics.activeAlarms.includes('PURGE_PRESSURE_HIGH') && (
                <>
                  <button
                    onClick={handleSwitchToBicarb}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow transition flex items-center gap-1.5"
                  >
                    <Droplets className="w-3.5 h-3.5" />
                    Switch to Sodium Bicarbonate
                  </button>
                  <button
                    onClick={handlePurgeFlush}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow transition flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Purge Flush
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Simulation Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: AIC Controller Console & P-Level Dial (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* AIC Hardware Panel */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Impella Control Module
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-700/60 font-semibold">
                SYSTEM RUNNING
              </span>
            </div>

            {/* Device Type Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-2">
                Mechanical Support Device
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['IMPELLA_CP', 'IMPELLA_5_5', 'IMPELLA_RP', 'ECPELLA'] as MCSType[]).map(d => (
                  <button
                    key={d}
                    onClick={() => setDeviceType(d)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition text-center ${
                      deviceType === d
                        ? 'bg-cyan-600 text-white border-cyan-400 shadow-md'
                        : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    {d.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* P-Level Step Dial */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-400">
                  Rotational Speed Level (P-Level)
                </label>
                <span className="text-xs font-mono font-bold text-cyan-400">
                  {liveHemodynamics.rpm.toLocaleString()} RPM
                </span>
              </div>

              {/* P1-P9 Dial Grid */}
              <div className="grid grid-cols-9 gap-1 mb-3">
                {([1, 2, 3, 4, 5, 6, 7, 8, 9] as PLevel[]).map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => setPLevel(lvl)}
                    className={`py-2 rounded-lg text-xs font-bold font-mono transition ${
                      pLevel === lvl
                        ? 'bg-cyan-500 text-slate-950 font-black shadow-lg scale-105 ring-2 ring-cyan-300'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                    }`}
                  >
                    P{lvl}
                  </button>
                ))}
              </div>

              {/* Flow and Speed Readout Box */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Active Pump Flow</div>
                  <div className="text-2xl font-black font-mono text-cyan-300">
                    {liveHemodynamics.pumpFlowLMin.toFixed(1)}{' '}
                    <span className="text-xs font-normal text-slate-400">L/min</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Cardiac Output</div>
                  <div className="text-2xl font-black font-mono text-emerald-400">
                    {(1.2 + liveHemodynamics.pumpFlowLMin).toFixed(1)}{' '}
                    <span className="text-xs font-normal text-slate-400">L/min</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cannula Position Manipulator */}
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-2">
                Catheter / Cannula Alignment
              </label>
              <div className="flex flex-col gap-2">
                {[
                  { id: 'CORRECT_TRANSVALVULAR', label: 'Transvalvular (4cm into LV)' },
                  { id: 'MIGRATED_AORTA', label: 'Migrated to Aorta (Ao-Ao, Lost Unloading)' },
                  { id: 'SUCTION_SEPTUM', label: 'Abutting Septum / Apex (Suction Risk)' }
                ].map(pos => (
                  <button
                    key={pos.id}
                    onClick={() => setCannulaPos(pos.id as CannulaPosition)}
                    className={`text-left px-3 py-2 rounded-xl text-xs font-medium border transition ${
                      cannulaPos === pos.id
                        ? 'bg-amber-950/80 border-amber-500 text-amber-200 ring-1 ring-amber-500/40'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Preload & Volume Sliders */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                  <span>Central Venous Pressure (CVP Preload)</span>
                  <span className="font-mono text-cyan-400 font-bold">{cvpMmHg} mmHg</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  step="1"
                  value={cvpMmHg}
                  onChange={e => setCvpMmHg(Number(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-800 rounded-lg cursor-pointer h-1.5"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                  <span className="text-rose-400">&lt;5 mmHg: Suction Risk</span>
                  <span>Normal 8-12</span>
                  <span className="text-amber-400">&gt;16: RV Failure</span>
                </div>
              </div>

              {deviceType === 'ECPELLA' && (
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>V-A ECMO Circuit Flow</span>
                    <span className="font-mono text-rose-400 font-bold">{ecmoFlowLMin.toFixed(1)} L/min</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="5.0"
                    step="0.1"
                    value={ecmoFlowLMin}
                    onChange={e => setEcmoFlowLMin(Number(e.target.value))}
                    className="w-full accent-rose-500 bg-slate-800 rounded-lg cursor-pointer h-1.5"
                  />
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    High retro-aortic ECMO afterload requires simultaneous Impella LV venting.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Purge System & Fluidics Cassette */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Purge Fluidics & Motor Bearing
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Cassette Rev 4.2</span>
            </div>

            {/* Fluid Type Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                Purge Infusate Solution
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPurgeFluid('D5W_HEPARIN')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition ${
                    purgeFluid === 'D5W_HEPARIN'
                      ? 'bg-indigo-600 text-white border-indigo-400'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  D5W + Heparin
                </button>
                <button
                  onClick={() => setPurgeFluid('D5W_SODIUM_BICARBONATE')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition ${
                    purgeFluid === 'D5W_SODIUM_BICARBONATE'
                      ? 'bg-indigo-600 text-white border-indigo-400'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  D5W + NaHCO3 (HIT)
                </button>
              </div>
            </div>

            {/* Purge Pressure & Flow Gauge */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Purge Pressure</div>
                <div
                  className={`text-xl font-bold font-mono ${
                    liveHemodynamics.purgePressure > 1100 ? 'text-rose-400 animate-pulse' : 'text-slate-200'
                  }`}
                >
                  {liveHemodynamics.purgePressure}{' '}
                  <span className="text-xs font-normal text-slate-500">mmHg</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Normal 300 - 1100</div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Purge Flow Rate</div>
                <div className="text-xl font-bold font-mono text-slate-200">
                  {liveHemodynamics.purgeFlow}{' '}
                  <span className="text-xs font-normal text-slate-500">mL/hr</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Normal 2 - 30</div>
              </div>
            </div>

            {/* Hemolysis Biomarkers */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex justify-between items-center">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Plasma Free Hb</div>
                <div
                  className={`text-lg font-bold font-mono ${
                    liveHemodynamics.pfHb > 40 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {liveHemodynamics.pfHb} <span className="text-xs font-normal text-slate-500">mg/dL</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Serum LDH</div>
                <div className="text-lg font-bold font-mono text-slate-300">
                  {liveHemodynamics.ldh} <span className="text-xs font-normal text-slate-500">U/L</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center & Right Columns: Interactive Transvalvular Anatomy + PV Loop (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Top Panel: Cardiac Power Output & Key Hemodynamic Vitals Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3">
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Cardiac Power Output (CPO)
              </div>
              <div
                className={`text-2xl font-black font-mono mt-0.5 ${
                  liveHemodynamics.cpoWatts >= 0.6 ? 'text-emerald-400' : 'text-rose-400 animate-pulse'
                }`}
              >
                {liveHemodynamics.cpoWatts} <span className="text-xs font-normal text-slate-500">W</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Target &gt;0.60 W (SCAI Shock)</div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3">
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Mean Arterial Pressure (MAP)
              </div>
              <div className="text-2xl font-black font-mono text-cyan-300 mt-0.5">
                {liveHemodynamics.mapMmHg} <span className="text-xs font-normal text-slate-500">mmHg</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Coronary perfusion target &gt;65</div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3">
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                LV End-Diastolic (LVEDP)
              </div>
              <div
                className={`text-2xl font-black font-mono mt-0.5 ${
                  liveHemodynamics.lvedpMmHg <= 15 ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {liveHemodynamics.lvedpMmHg} <span className="text-xs font-normal text-slate-500">mmHg</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Unloaded from 28 mmHg baseline</div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3">
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Total Cardiac Flow
              </div>
              <div className="text-2xl font-black font-mono text-indigo-300 mt-0.5">
                {(1.2 + liveHemodynamics.pumpFlowLMin).toFixed(1)}{' '}
                <span className="text-xs font-normal text-slate-500">L/min</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Pump {liveHemodynamics.pumpFlowLMin.toFixed(1)} + Native 1.2
              </div>
            </div>
          </div>

          {/* Center Visual 1: Transvalvular Anatomical Cross-Section SVG */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Transvalvular Catheter Position & Microaxial Streamline Flow
                </span>
              </div>
              <span className="text-[10px] font-mono text-cyan-400">
                Placement Signal: {cannulaPos === 'MIGRATED_AORTA' ? 'AORTIC (MALPOSITION)' : 'VENTRICULAR (CORRECT)'}
              </span>
            </div>

            {/* SVG Anatomical Heart & Microaxial Pump */}
            <div className="relative w-full h-56 bg-slate-950/90 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
              <svg viewBox="0 0 600 240" className="w-full h-full">
                <defs>
                  <linearGradient id="aortaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#dc2626" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#991b1b" stopOpacity="0.2" />
                  </linearGradient>
                  <linearGradient id="lvCavityGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#b91c1c" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0.1" />
                  </linearGradient>
                  <linearGradient id="pumpGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#94a3b8" />
                    <stop offset="50%" stopColor="#cbd5e1" />
                    <stop offset="100%" stopColor="#64748b" />
                  </linearGradient>
                </defs>

                {/* Heart Chambers Outline */}
                {/* Ascending Aorta */}
                <path
                  d="M 220 20 C 220 70, 240 100, 260 110 L 320 110 C 330 95, 335 60, 335 20 Z"
                  fill="url(#aortaGrad)"
                  stroke="#ef4444"
                  strokeWidth="2"
                />
                {/* Aortic Valve Leaflets */}
                <line x1="260" y1="110" x2="280" y2="115" stroke="#fbbf24" strokeWidth="3" />
                <line x1="320" y1="110" x2="300" y2="115" stroke="#fbbf24" strokeWidth="3" />

                {/* Left Ventricular Cavity */}
                <path
                  d="M 260 110 C 220 130, 200 170, 250 220 C 280 240, 310 240, 340 220 C 370 180, 360 130, 320 110 Z"
                  fill="url(#lvCavityGrad)"
                  stroke="#f43f5e"
                  strokeWidth="2.5"
                />

                {/* Interventricular Septum (Left Border) */}
                <path
                  d="M 200 120 C 185 160, 210 215, 250 230"
                  fill="none"
                  stroke="#64748b"
                  strokeWidth="8"
                  strokeLinecap="round"
                  opacity="0.6"
                />

                {/* Impella 9F Catheter Shaft */}
                {cannulaPos === 'CORRECT_TRANSVALVULAR' && (
                  <g>
                    {/* Catheter Body crossing aortic valve into LV */}
                    <path
                      d="M 290 20 L 290 105 L 290 180"
                      fill="none"
                      stroke="url(#pumpGrad)"
                      strokeWidth="9"
                      strokeLinecap="round"
                    />
                    {/* Pigtail Catheter Tip resting in apex */}
                    <path
                      d="M 290 180 C 290 195, 275 205, 270 195 C 265 185, 280 180, 285 188"
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="4"
                    />
                    {/* Inflow Cage (inside LV) */}
                    <rect x="284" y="150" width="12" height="25" rx="3" fill="#38bdf8" opacity="0.9" />
                    {/* Outflow Area (in ascending Aorta) */}
                    <rect x="284" y="65" width="12" height="20" rx="3" fill="#f43f5e" opacity="0.9" />
                    {/* Optical Sensor */}
                    <circle cx="290" cy="130" r="3" fill="#22c55e" />

                    {/* Dynamic Blood Streamlines */}
                    <circle
                      cx="290"
                      cy={150 - (cycleTick % 85)}
                      r="2.5"
                      fill="#38bdf8"
                      opacity="0.8"
                    />
                    <circle
                      cx="290"
                      cy={150 - ((cycleTick + 40) % 85)}
                      r="2.5"
                      fill="#38bdf8"
                      opacity="0.8"
                    />
                  </g>
                )}

                {cannulaPos === 'MIGRATED_AORTA' && (
                  <g>
                    {/* Catheter retracted high into Aorta */}
                    <path
                      d="M 290 20 L 290 95"
                      fill="none"
                      stroke="url(#pumpGrad)"
                      strokeWidth="9"
                      strokeLinecap="round"
                    />
                    {/* Pigtail hanging above valve */}
                    <path
                      d="M 290 95 C 290 105, 275 112, 270 105"
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="4"
                    />
                    {/* Inflow retracted into Aorta */}
                    <rect x="284" y="70" width="12" height="20" rx="3" fill="#f59e0b" opacity="0.9" />
                    {/* Outflow also in Aorta */}
                    <rect x="284" y="35" width="12" height="18" rx="3" fill="#f43f5e" opacity="0.9" />
                    <text x="310" y="85" fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      Ao-Ao Position (No LV Unloading)
                    </text>
                  </g>
                )}

                {cannulaPos === 'SUCTION_SEPTUM' && (
                  <g>
                    {/* Catheter kinked against septum */}
                    <path
                      d="M 290 20 L 285 105 L 240 180"
                      fill="none"
                      stroke="url(#pumpGrad)"
                      strokeWidth="9"
                      strokeLinecap="round"
                    />
                    {/* Inflow touching septum border */}
                    <circle cx="240" cy="180" r="10" fill="#ef4444" opacity="0.8" />
                    <text x="140" y="195" fill="#ef4444" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      Septal Abutment (Suction)
                    </text>
                  </g>
                )}

                {/* Labels on SVG */}
                <text x="350" y="55" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">
                  Ascending Aorta (Outflow)
                </text>
                <text x="360" y="175" fill="#f43f5e" fontSize="11" fontFamily="sans-serif">
                  LV Cavity (Inflow 4cm below AoV)
                </text>
                <text x="150" y="90" fill="#64748b" fontSize="10" fontFamily="sans-serif">
                  Interventricular Septum
                </text>
              </svg>
            </div>
          </div>

          {/* Center Visual 2: Live Pressure-Volume (PV) Loop Canvas */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Left Ventricular Pressure-Volume (PV) Loop Unloading Dynamics
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">
                Area = Stroke Work ({pLevel >= 7 ? 'Markedly Reduced / Unloaded' : 'Normal / Elevated'})
              </span>
            </div>

            {/* SVG Pressure-Volume Loop Plot */}
            <div className="relative w-full h-64 bg-slate-950/90 rounded-xl border border-slate-800 p-3 flex items-center justify-center">
              <svg viewBox="0 0 360 250" className="w-full h-full">
                {/* Axes and Grid Lines */}
                <line x1="40" y1="220" x2="330" y2="220" stroke="#334155" strokeWidth="1.5" />
                <line x1="40" y1="30" x2="40" y2="220" stroke="#334155" strokeWidth="1.5" />

                {/* Grid Horizontals */}
                <line x1="40" y1="160" x2="330" y2="160" stroke="#1e293b" strokeDasharray="3 3" />
                <line x1="40" y1="100" x2="330" y2="100" stroke="#1e293b" strokeDasharray="3 3" />
                <line x1="40" y1="40" x2="330" y2="40" stroke="#1e293b" strokeDasharray="3 3" />

                {/* Y-Axis Labels (Pressure mmHg) */}
                <text x="32" y="224" fill="#64748b" fontSize="9" textAnchor="end">0</text>
                <text x="32" y="164" fill="#64748b" fontSize="9" textAnchor="end">40</text>
                <text x="32" y="104" fill="#64748b" fontSize="9" textAnchor="end">80</text>
                <text x="32" y="44" fill="#64748b" fontSize="9" textAnchor="end">130</text>
                <text x="25" y="15" fill="#94a3b8" fontSize="10" fontWeight="bold">LV Pressure (mmHg)</text>

                {/* X-Axis Labels (Volume mL) */}
                <text x="40" y="235" fill="#64748b" fontSize="9" textAnchor="middle">40</text>
                <text x="135" y="235" fill="#64748b" fontSize="9" textAnchor="middle">80</text>
                <text x="230" y="235" fill="#64748b" fontSize="9" textAnchor="middle">120</text>
                <text x="320" y="235" fill="#64748b" fontSize="9" textAnchor="middle">150</text>
                <text x="185" y="247" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
                  LV Volume (mL)
                </text>

                {/* Baseline Failing LV Loop (Faded Shadow) */}
                <polygon
                  points="295,182 285,60 215,40 145,55 145,210 220,195 295,182"
                  fill="none"
                  stroke="#475569"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
                <text x="250" y="70" fill="#64748b" fontSize="9" fontStyle="italic">
                  Baseline Failing LV (LVEDP 28)
                </text>

                {/* Active Dynamic Unloaded PV Loop */}
                <polygon
                  points={svgPvPoints}
                  fill={cannulaPos === 'MIGRATED_AORTA' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(56, 189, 248, 0.18)'}
                  stroke={cannulaPos === 'MIGRATED_AORTA' ? '#ef4444' : '#38bdf8'}
                  strokeWidth="2.5"
                />

                {/* Key Points Annotations */}
                <circle cx={svgPvPoints.split(' ')[0].split(',')[0]} cy={svgPvPoints.split(' ')[0].split(',')[1]} r="4" fill="#38bdf8" />
                <text
                  x={Number(svgPvPoints.split(' ')[0].split(',')[0]) + 8}
                  y={Number(svgPvPoints.split(' ')[0].split(',')[1]) + 4}
                  fill="#38bdf8"
                  fontSize="9"
                  fontWeight="bold"
                >
                  LVEDP {liveHemodynamics.lvedpMmHg} mmHg
                </text>
              </svg>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                Active Support Loop (Unloaded Leftward Shift)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-slate-500"></span>
                Baseline Cardiogenic Shock Loop
              </span>
            </div>
          </div>

          {/* Clinical Decision Ladder & Board Review Pearls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Management Ladder */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Clinical Action Ladder
                </span>
              </div>
              <ul className="space-y-2">
                {activePreset.managementLadder.map((step, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="font-mono text-cyan-400 font-bold shrink-0">{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Board Review Pearls */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center gap-2 mb-3">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  SCAI / HFSA Board Review Pearls
                </span>
              </div>
              <ul className="space-y-2">
                {activePreset.boardReviewPearls.map((pearl, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-amber-400 shrink-0">✦</span>
                    <span>{pearl}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
