'use client';

/**
 * RoboticSurgerySimulator.tsx
 *
 * Interactive Minimally Invasive Surgery & Robotic-Assisted Laparoscopy Workstation.
 * Features:
 * - Surgical monitor viewport with EndoWrist 7-DOF instrument arms and dynamic tissue interaction.
 * - Pneumoperitoneum CO2 insufflator hydraulics (IAP 0 - 25 mmHg, flow rate, volume).
 * - Patient table tilt gantry (-30° steep Trendelenburg to +25° reverse Trendelenburg).
 * - Electrosurgical energy generator with thermal spread biophysics (Monopolar, Bipolar, Ultrasonic).
 * - Critical View of Safety (CVS) verification and Calot's triangle dissection.
 * - Warm ischemia time (WIT) stopwatch with bulldog vascular clamping.
 * - Acute complication alarms (CO2 gas embolism, tension pneumoperitoneum, capacitive coupling).
 * - Durant's maneuver and emergent desufflation rescue protocols.
 * - Socratic AI context bridge (`mediverse:open-ai-with-context`).
 *
 * Location: frontend/components/simulators/RoboticSurgerySimulator.tsx
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Sparkles,
  Zap,
  Play,
  Pause,
  RotateCcw,
  Wind,
  ShieldAlert,
  Gauge,
  HelpCircle,
  TrendingUp,
  Cpu,
  Clock,
  Scissors,
  Crosshair,
  RefreshCw,
  Flame
} from 'lucide-react';
import {
  SurgicalProcedureType,
  PatientPosition,
  EnergyModality,
  RoboticInstrumentType,
  SurgicalAlarm,
  RoboticPresetId,
  ROBOTIC_SURGERY_PRESETS,
  computePneumoperitoneumHemodynamics,
  computeThermalSpreadMm
} from '@/.gemini/skills/RoboticSurgeryEngine';

export default function RoboticSurgerySimulator() {
  // Preset Selection
  const [selectedPresetId, setSelectedPresetId] = useState<RoboticPresetId>(
    'robotic-radical-prostatectomy-steep-trendelenburg'
  );
  const activePreset = ROBOTIC_SURGERY_PRESETS[selectedPresetId];

  // Insufflator & Positioning State
  const [iapMmHg, setIapMmHg] = useState<number>(activePreset.initialState.iapMmHg);
  const [tableTiltDeg, setTableTiltDeg] = useState<number>(activePreset.initialState.tableTiltDeg);
  const [co2FlowLMin, setCo2FlowLMin] = useState<number>(activePreset.initialState.co2FlowLMin);

  // Energy & Tool State
  const [activeEnergy, setActiveEnergy] = useState<EnergyModality>(activePreset.initialState.activeEnergy);
  const [energyWatts, setEnergyWatts] = useState<number>(activePreset.initialState.energyPowerWatts);
  const [instrumentArm1, setInstrumentArm1] = useState<RoboticInstrumentType>(
    activePreset.initialState.activeInstrumentArm1
  );
  const [instrumentArm2, setInstrumentArm2] = useState<RoboticInstrumentType>(
    activePreset.initialState.activeInstrumentArm2
  );
  const [motionScaling, setMotionScaling] = useState<'1:1' | '2:1' | '3:1'>(
    activePreset.initialState.motionScaling
  );

  // Clinical Crisis & Procedure Specific State
  const [isGasEmbolism, setIsGasEmbolism] = useState<boolean>(
    activePreset.id === 'acute-co2-gas-embolism-emergency'
  );
  const [isDurantManeuver, setIsDurantManeuver] = useState<boolean>(false);
  const [cvsConfirmed, setCvsConfirmed] = useState<boolean>(
    activePreset.initialState.criticalViewOfSafetyConfirmed
  );
  const [clampApplied, setClampApplied] = useState<boolean>(
    activePreset.initialState.clampApplied
  );
  const [warmIschemiaSec, setWarmIschemiaSec] = useState<number>(
    activePreset.initialState.warmIschemiaSeconds
  );

  // Runtime animation tick
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [animTick, setAnimTick] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronize on preset change
  const handlePresetSelect = (presetId: RoboticPresetId) => {
    const p = ROBOTIC_SURGERY_PRESETS[presetId];
    setSelectedPresetId(presetId);
    setIapMmHg(p.initialState.iapMmHg);
    setTableTiltDeg(p.initialState.tableTiltDeg);
    setCo2FlowLMin(p.initialState.co2FlowLMin);
    setActiveEnergy(p.initialState.activeEnergy);
    setEnergyWatts(p.initialState.energyPowerWatts);
    setInstrumentArm1(p.initialState.activeInstrumentArm1);
    setInstrumentArm2(p.initialState.activeInstrumentArm2);
    setMotionScaling(p.initialState.motionScaling);
    setIsGasEmbolism(presetId === 'acute-co2-gas-embolism-emergency');
    setIsDurantManeuver(false);
    setCvsConfirmed(p.initialState.criticalViewOfSafetyConfirmed);
    setClampApplied(p.initialState.clampApplied);
    setWarmIschemiaSec(p.initialState.warmIschemiaSeconds);
  };

  // Warm Ischemia Clock & Animation Loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setAnimTick(prev => (prev + 1) % 60);
      if (clampApplied) {
        setWarmIschemiaSec(prev => prev + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, clampApplied]);

  // Biophysical solver output
  const liveHemodynamics = useMemo(() => {
    const res = computePneumoperitoneumHemodynamics(
      iapMmHg,
      tableTiltDeg,
      isGasEmbolism,
      isDurantManeuver
    );

    const activeAlarms = [...res.alarms];
    if (clampApplied && warmIschemiaSec > 1500) {
      activeAlarms.push('WARM_ISCHEMIA_EXCEEDED');
    }
    if (activeEnergy === 'MONOPOLAR_COAG' && energyWatts >= 40 && selectedPresetId === 'stray-current-capacitive-coupling-bowel') {
      activeAlarms.push('CAPACITIVE_COUPLING_RISK');
    }

    const nonOptimal = activeAlarms.filter(a => a !== 'OPTIMAL');
    const finalAlarms = nonOptimal.length > 0 ? Array.from(new Set(nonOptimal)) : (['OPTIMAL'] as SurgicalAlarm[]);

    return {
      ...res,
      thermalSpreadMm: computeThermalSpreadMm(activeEnergy, energyWatts),
      activeAlarms: finalAlarms
    };
  }, [
    iapMmHg,
    tableTiltDeg,
    isGasEmbolism,
    isDurantManeuver,
    clampApplied,
    warmIschemiaSec,
    activeEnergy,
    energyWatts,
    selectedPresetId
  ]);

  // Quick Action Rescue Handlers
  const handleExecuteDurant = () => {
    setIsDurantManeuver(true);
    setTableTiltDeg(-30);
    showToast("Durant's Maneuver executed: Steep Left Lateral Decubitus + Trendelenburg. Gas lock diverted from RVOT.");
  };

  const handleDesufflate = () => {
    setIapMmHg(12);
    setIsGasEmbolism(false);
    showToast('Pneumoperitoneum desufflated to safe baseline (12 mmHg). Venous return restored.');
  };

  const handleConfirmCVS = () => {
    setCvsConfirmed(true);
    showToast("Critical View of Safety (CVS) confirmed: 2 structures entering gallbladder, cystic plate dissected.");
  };

  const handleToggleClamp = () => {
    setClampApplied(!clampApplied);
    showToast(clampApplied ? 'Renal bulldog clamps released. Reperfusion established.' : 'Renal bulldog clamps applied. Warm ischemia timer started.');
  };

  const handleSwitchBipolar = () => {
    setActiveEnergy('BIPOLAR');
    setEnergyWatts(30);
    showToast('Switched to Bipolar energy. Capacitive coupling and stray current risks eliminated.');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Socratic AI Context Dispatch
  const handleConsultAI = () => {
    const promptContext = `
[MINIMALLY INVASIVE SURGERY & ROBOTIC LAPAROSCOPY WORKSTATION CONSULT]
- Procedure: ${activePreset.procedure} (${activePreset.title})
- Category: ${activePreset.category}
- Table Tilt: ${tableTiltDeg}° (${tableTiltDeg < 0 ? 'Trendelenburg' : tableTiltDeg > 0 ? 'Reverse Trendelenburg' : 'Neutral'})
- Intra-Abdominal Pressure (IAP): ${iapMmHg} mmHg | CO2 Flow: ${co2FlowLMin} L/min
- Ventilatory Dynamics: Peak Airway Pressure: ${liveHemodynamics.peakAirwayPressureCmH2O} cmH2O | Lung Compliance: ${liveHemodynamics.lungComplianceMlCmH2O} mL/cmH2O
- Hemodynamics: EtCO2: ${liveHemodynamics.etCo2MmHg} mmHg | MAP: ${liveHemodynamics.mapMmHg} mmHg | Cardiac Output: ${liveHemodynamics.cardiacOutputLMin} L/min | CVP: ${liveHemodynamics.cvpMmHg} mmHg
- Electrosurgical Modality: ${activeEnergy} at ${energyWatts}W | Thermal Spread: ${liveHemodynamics.thermalSpreadMm} mm
- Warm Ischemia Time: ${Math.floor(warmIschemiaSec / 60)}m ${warmIschemiaSec % 60}s | Clamp: ${clampApplied ? 'APPLIED' : 'RELEASED'}
- Critical View of Safety (CVS): ${cvsConfirmed ? 'CONFIRMED' : 'UNCONFIRMED'}
- Active Alarms: ${liveHemodynamics.activeAlarms.join(', ')}
- Pathophysiology: ${activePreset.pathophysiology}
Please explain the surgical anatomy, physiological trade-offs of pneumoperitoneum/positioning, and emergency troubleshooting protocols for this case.
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

      {/* Preset Selection Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                da Vinci Surgical Console &amp; Laparoscopic Workstation
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
              Surgical Scenarios &amp; Laparoscopic Crisis Simulation
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                isPlaying
                  ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300 hover:bg-emerald-900/80'
                  : 'bg-amber-950/60 border-amber-700 text-amber-300 hover:bg-amber-900/80'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isPlaying ? 'Pause Sim' : 'Resume Sim'}
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

        {/* Preset Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {(Object.keys(ROBOTIC_SURGERY_PRESETS) as RoboticPresetId[]).map(id => {
            const p = ROBOTIC_SURGERY_PRESETS[id];
            const isSelected = selectedPresetId === id;
            return (
              <button
                key={id}
                onClick={() => handlePresetSelect(id)}
                className={`text-left p-3 rounded-xl border transition flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-950/70 border-emerald-500 text-white ring-1 ring-emerald-500/50 shadow-md'
                    : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900/80 text-emerald-400 border border-emerald-800/40">
                    {p.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {p.defaultPosition.replace('_', ' ')}
                  </span>
                </div>
                <div className="font-semibold text-xs text-white line-clamp-1">{p.title}</div>
                <div className="text-[11px] text-slate-400 line-clamp-2 mt-1">{p.description}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Critical Surgical Alarm Banner */}
      {liveHemodynamics.activeAlarms.some(a => a !== 'OPTIMAL') && (
        <div className="bg-rose-950/80 border-2 border-rose-500/80 rounded-2xl p-4 backdrop-blur-md shadow-2xl animate-pulse">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0" />
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-rose-300">
                  SURGICAL COMPLICATION DETECTED
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

            {/* Context-Sensitive Rescue Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {liveHemodynamics.activeAlarms.includes('CO2_GAS_EMBOLISM') && !isDurantManeuver && (
                <button
                  onClick={handleExecuteDurant}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow transition flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Execute Durant&#39;s Maneuver
                </button>
              )}
              {liveHemodynamics.activeAlarms.includes('TENSION_PNEUMOPERITONEUM') && (
                <button
                  onClick={handleDesufflate}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow transition flex items-center gap-1.5"
                >
                  <Wind className="w-3.5 h-3.5" />
                  Vent to 12 mmHg
                </button>
              )}
              {liveHemodynamics.activeAlarms.includes('CAPACITIVE_COUPLING_RISK') && (
                <button
                  onClick={handleSwitchBipolar}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow transition flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Switch to Bipolar Energy
                </button>
              )}
              {liveHemodynamics.activeAlarms.includes('WARM_ISCHEMIA_EXCEEDED') && (
                <button
                  onClick={handleToggleClamp}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow transition flex items-center gap-1.5"
                >
                  <Clock className="w-3.5 h-3.5" />
                  Release Renal Clamps
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Insufflation, Positioning, and Energy Controls (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Insufflator Panel */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  CO2 Insufflation Hydraulics
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-700/60 font-semibold">
                INSUFFLATOR ACTIVE
              </span>
            </div>

            {/* IAP Slider */}
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                <span>Intra-Abdominal Pressure (IAP)</span>
                <span
                  className={`font-mono font-bold ${
                    iapMmHg > 15 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {iapMmHg} mmHg
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="1"
                value={iapMmHg}
                onChange={e => setIapMmHg(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer h-1.5"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span>0 (Open)</span>
                <span className="text-emerald-400 font-semibold">Target 12-15</span>
                <span className="text-rose-400 font-semibold">&gt;18: ACS / IVC Collapse</span>
              </div>
            </div>

            {/* Flow Rate & Gas Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">CO2 Gas Flow</div>
                <div className="text-xl font-bold font-mono text-slate-200">
                  {co2FlowLMin} <span className="text-xs font-normal text-slate-500">L/min</span>
                </div>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Insufflated</div>
                <div className="text-xl font-bold font-mono text-cyan-400">
                  {activePreset.initialState.totalCo2InsufflatedL} <span className="text-xs font-normal text-slate-500">L</span>
                </div>
              </div>
            </div>
          </div>

          {/* Table Tilt Gantry Panel */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Patient Table Gantry &amp; Tilt
                </span>
              </div>
              <span className="text-[10px] font-mono text-cyan-300 font-bold">
                {tableTiltDeg < 0
                  ? `${Math.abs(tableTiltDeg)}° Trendelenburg`
                  : tableTiltDeg > 0
                  ? `${tableTiltDeg}° Reverse Trendelenburg`
                  : 'Neutral 0°'}
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                <span>Table Angle (Tilt)</span>
                <span className="font-mono text-cyan-400 font-bold">{tableTiltDeg}°</span>
              </div>
              <input
                type="range"
                min="-30"
                max="25"
                step="5"
                value={tableTiltDeg}
                onChange={e => setTableTiltDeg(Number(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-800 rounded-lg cursor-pointer h-1.5"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span className="text-indigo-400 font-medium">-30° Steep Trendelenburg</span>
                <span>0°</span>
                <span className="text-amber-400 font-medium">+25° Reverse</span>
              </div>
            </div>

            {/* Quick Table Angle Presets */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                onClick={() => setTableTiltDeg(-30)}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition ${
                  tableTiltDeg === -30
                    ? 'bg-indigo-600 text-white border-indigo-400'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                Steep (-30°)
              </button>
              <button
                onClick={() => setTableTiltDeg(0)}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition ${
                  tableTiltDeg === 0
                    ? 'bg-cyan-600 text-white border-cyan-400'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                Level (0°)
              </button>
              <button
                onClick={() => setTableTiltDeg(20)}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition ${
                  tableTiltDeg === 20
                    ? 'bg-amber-600 text-white border-amber-400'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                Reverse (+20°)
              </button>
            </div>
          </div>

          {/* Electrosurgical Energy & Generator Panel */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Electrosurgery &amp; Energy Biophysics
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">ESU Generator</span>
            </div>

            {/* Energy Modality Radio Grid */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'MONOPOLAR_CUT', label: 'Mono Cut (Sine)' },
                { id: 'MONOPOLAR_COAG', label: 'Mono Coag (Spark)' },
                { id: 'BIPOLAR', label: 'Bipolar (Localized)' },
                { id: 'ULTRASONIC_HARMONIC', label: 'Ultrasonic (55kHz)' }
              ].map(em => (
                <button
                  key={em.id}
                  onClick={() => setActiveEnergy(em.id as EnergyModality)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition text-center ${
                    activeEnergy === em.id
                      ? 'bg-amber-600 text-white border-amber-400 shadow-md'
                      : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  {em.label}
                </button>
              ))}
            </div>

            {/* Power Setting & Thermal Spread Readout */}
            <div className="space-y-3 pt-1">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                  <span>Generator Power Output</span>
                  <span className="font-mono text-amber-400 font-bold">{energyWatts} Watts</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="5"
                  value={energyWatts}
                  onChange={e => setEnergyWatts(Number(e.target.value))}
                  className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer h-1.5"
                />
              </div>

              {/* Thermal Spread Badge */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    Lateral Thermal Spread
                  </div>
                  <div
                    className={`text-xl font-bold font-mono ${
                      liveHemodynamics.thermalSpreadMm > 3.0 ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {liveHemodynamics.thermalSpreadMm} <span className="text-xs font-normal text-slate-500">mm</span>
                  </div>
                </div>
                <div className="text-right text-[11px] text-slate-400 max-w-[150px]">
                  {activeEnergy === 'MONOPOLAR_COAG'
                    ? 'High voltage burst: High risk of capacitive coupling & bowel burns.'
                    : activeEnergy === 'ULTRASONIC_HARMONIC'
                    ? 'Minimal lateral spread (<1.5mm), protein denaturing.'
                    : 'Safe localized current path between tines.'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Surgical Viewport, Organ Anatomy, and Telemetry (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Vitals & Respiratory Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3">
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Peak Airway Pressure (Ppeak)
              </div>
              <div
                className={`text-2xl font-black font-mono mt-0.5 ${
                  liveHemodynamics.peakAirwayPressureCmH2O >= 35 ? 'text-rose-400 animate-pulse' : 'text-cyan-300'
                }`}
              >
                {liveHemodynamics.peakAirwayPressureCmH2O}{' '}
                <span className="text-xs font-normal text-slate-500">cmH2O</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Normal &lt;25 | Alarm &ge;35</div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3">
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                End-Tidal CO2 (EtCO2)
              </div>
              <div
                className={`text-2xl font-black font-mono mt-0.5 ${
                  liveHemodynamics.etCo2MmHg < 20
                    ? 'text-rose-400 animate-pulse'
                    : liveHemodynamics.etCo2MmHg > 45
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {liveHemodynamics.etCo2MmHg} <span className="text-xs font-normal text-slate-500">mmHg</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">&lt;20: Gas Embolism Shock!</div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3">
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Mean Arterial Pressure (MAP)
              </div>
              <div
                className={`text-2xl font-black font-mono mt-0.5 ${
                  liveHemodynamics.mapMmHg < 65 ? 'text-rose-400 animate-pulse' : 'text-slate-200'
                }`}
              >
                {liveHemodynamics.mapMmHg} <span className="text-xs font-normal text-slate-500">mmHg</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">IVC compression target &gt;65</div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3">
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Cardiac Output (CO)
              </div>
              <div
                className={`text-2xl font-black font-mono mt-0.5 ${
                  liveHemodynamics.cardiacOutputLMin < 3.0 ? 'text-rose-400' : 'text-indigo-300'
                }`}
              >
                {liveHemodynamics.cardiacOutputLMin}{' '}
                <span className="text-xs font-normal text-slate-500">L/min</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Compliance: {liveHemodynamics.lungComplianceMlCmH2O} mL/cmH2O</div>
            </div>
          </div>

          {/* Main Laparoscopic Screen / Viewport SVG */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  3D HD Laparoscopic Surgical Viewport (da Vinci Xi Optic)
                </span>
              </div>
              <div className="flex items-center gap-3">
                {activePreset.procedure === 'ROBOTIC_PARTIAL_NEPHRECTOMY' && (
                  <div className="flex items-center gap-1.5 font-mono text-xs px-2.5 py-1 rounded bg-slate-950 border border-slate-700">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>WIT: </span>
                    <span
                      className={`font-bold ${
                        warmIschemiaSec > 1500 ? 'text-rose-400 animate-pulse' : 'text-amber-300'
                      }`}
                    >
                      {Math.floor(warmIschemiaSec / 60)}m {warmIschemiaSec % 60}s
                    </span>
                  </div>
                )}
                <span className="text-[10px] font-mono text-slate-400">Scale {motionScaling}</span>
              </div>
            </div>

            {/* Laparoscopic Field SVG */}
            <div className="relative w-full h-80 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center shadow-inner">
              <svg viewBox="0 0 640 320" className="w-full h-full">
                <defs>
                  <radialGradient id="lapLightGrad" cx="50%" cy="50%" r="65%">
                    <stop offset="0%" stopColor="#334155" stopOpacity="0.4" />
                    <stop offset="70%" stopColor="#0f172a" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#020617" stopOpacity="0.98" />
                  </radialGradient>
                  <linearGradient id="liverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#78350f" />
                    <stop offset="100%" stopColor="#451a03" />
                  </linearGradient>
                  <linearGradient id="gallbladderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#15803d" />
                    <stop offset="100%" stopColor="#14532d" />
                  </linearGradient>
                  <linearGradient id="prostateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#be123c" />
                    <stop offset="100%" stopColor="#881337" />
                  </linearGradient>
                  <linearGradient id="kidneyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#9a3412" />
                    <stop offset="100%" stopColor="#7c2d12" />
                  </linearGradient>
                  <linearGradient id="robotArmGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#94a3b8" />
                    <stop offset="50%" stopColor="#e2e8f0" />
                    <stop offset="100%" stopColor="#64748b" />
                  </linearGradient>
                </defs>

                {/* Ambient Peritoneal Cavity Illumination */}
                <rect width="640" height="320" fill="url(#lapLightGrad)" />

                {/* Scenario 1: Lap Cholecystectomy with Calot's Triangle */}
                {activePreset.procedure === 'LAP_CHOLECYSTECTOMY' && (
                  <g>
                    {/* Liver Undersurface */}
                    <path
                      d="M 50 40 Q 320 20, 590 80 Q 520 180, 280 160 Q 120 170, 50 40 Z"
                      fill="url(#liverGrad)"
                      stroke="#9a3412"
                      strokeWidth="2"
                    />
                    {/* Gallbladder */}
                    <path
                      d="M 330 110 C 370 70, 430 80, 450 120 C 470 160, 410 200, 360 170 Z"
                      fill="url(#gallbladderGrad)"
                      stroke="#22c55e"
                      strokeWidth="2"
                    />
                    {/* Calot's Triangle Dissection Window */}
                    <polygon
                      points="310,180 360,170 330,230"
                      fill="rgba(251, 191, 36, 0.15)"
                      stroke="#fbbf24"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                    />
                    {/* Cystic Duct */}
                    <path d="M 330 230 Q 345 200, 360 170" fill="none" stroke="#22c55e" strokeWidth="5" />
                    {/* Cystic Artery */}
                    <path d="M 315 200 Q 330 185, 345 170" fill="none" stroke="#ef4444" strokeWidth="3" />
                    {/* Common Hepatic Duct */}
                    <path d="M 300 170 L 330 230 L 340 280" fill="none" stroke="#eab308" strokeWidth="6" />

                    {cvsConfirmed && (
                      <g>
                        <text x="370" y="220" fill="#22c55e" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                          ✓ CVS Verified (2 Structures Only)
                        </text>
                        <circle cx="360" cy="170" r="4" fill="#22c55e" />
                        <circle cx="345" cy="170" r="4" fill="#ef4444" />
                      </g>
                    )}
                  </g>
                )}

                {/* Scenario 2: Robotic Prostatectomy in Steep Trendelenburg */}
                {activePreset.procedure === 'ROBOTIC_PROSTATECTOMY' && (
                  <g>
                    {/* Bladder Base */}
                    <path
                      d="M 180 60 C 260 40, 380 40, 460 60 C 470 120, 440 180, 320 180 C 200 180, 170 120, 180 60 Z"
                      fill="rgba(244, 63, 94, 0.25)"
                      stroke="#f43f5e"
                      strokeWidth="2"
                    />
                    {/* Prostate Body */}
                    <path
                      d="M 260 180 Q 320 160, 380 180 Q 400 240, 320 260 Q 240 240, 260 180 Z"
                      fill="url(#prostateGrad)"
                      stroke="#fda4af"
                      strokeWidth="2"
                    />
                    {/* Urethral Stump */}
                    <path d="M 320 260 L 320 300" stroke="#fbbf24" strokeWidth="8" strokeLinecap="round" />
                    {/* Neurovascular Bundle Left & Right */}
                    <path d="M 255 190 Q 245 230, 270 255" fill="none" stroke="#38bdf8" strokeWidth="3" />
                    <path d="M 385 190 Q 395 230, 370 255" fill="none" stroke="#38bdf8" strokeWidth="3" />

                    <text x="320" y="225" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                      Prostate (Apical Dissection)
                    </text>
                  </g>
                )}

                {/* Scenario 3: Robotic Partial Nephrectomy with Tumor & Clamp */}
                {activePreset.procedure === 'ROBOTIC_PARTIAL_NEPHRECTOMY' && (
                  <g>
                    {/* Kidney Bean Shape */}
                    <path
                      d="M 220 70 C 350 40, 420 100, 410 180 C 400 260, 320 290, 230 250 C 180 220, 190 120, 220 70 Z"
                      fill="url(#kidneyGrad)"
                      stroke="#ea580c"
                      strokeWidth="2.5"
                    />
                    {/* Exophytic Mass */}
                    <circle cx="390" cy="140" r="30" fill="#dc2626" opacity="0.85" stroke="#fca5a5" strokeWidth="2" />
                    <text x="390" y="144" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                      cT1a (3.4cm)
                    </text>

                    {/* Renal Artery & Vein with Bulldog Clamps */}
                    <path d="M 140 160 L 220 160" stroke="#ef4444" strokeWidth="8" />
                    <path d="M 140 180 L 220 180" stroke="#3b82f6" strokeWidth="10" />

                    {clampApplied && (
                      <g>
                        {/* Robotic Bulldog Clamp on Artery */}
                        <rect x="165" y="148" width="16" height="24" rx="3" fill="#64748b" stroke="#f8fafc" strokeWidth="1.5" />
                        <text x="173" y="142" fill="#fbbf24" fontSize="9" fontWeight="bold" textAnchor="middle">
                          Bulldog
                        </text>
                      </g>
                    )}
                  </g>
                )}

                {/* Scenario 4: Pelvic Lymph Dissection / Gas Embolism */}
                {activePreset.procedure === 'PELVIC_LYMPH_DISSECTION' && (
                  <g>
                    {/* External Iliac Artery & Vein */}
                    <path d="M 180 40 L 460 280" stroke="#ef4444" strokeWidth="14" />
                    <path d="M 205 40 L 485 280" stroke="#3b82f6" strokeWidth="18" />

                    {/* Obturator Nerve */}
                    <path d="M 150 70 L 410 300" stroke="#fef08a" strokeWidth="4" />

                    {isGasEmbolism && (
                      <g>
                        {/* Venous Laceration Bubble Entrainment */}
                        <circle cx="345" cy="160" r="14" fill="rgba(56, 189, 248, 0.4)" stroke="#38bdf8" strokeWidth="2" />
                        <circle cx="335" cy="150" r="6" fill="#ffffff" opacity="0.8" />
                        <circle cx="355" cy="170" r="5" fill="#ffffff" opacity="0.8" />
                        <text x="375" y="165" fill="#38bdf8" fontSize="11" fontWeight="bold">
                          CO2 Venous Ingress (Gas Embolism)
                        </text>
                      </g>
                    )}
                  </g>
                )}

                {/* Robotic EndoWrist Instrument Arms */}
                {/* Left Arm (Instrument 1) */}
                <g transform="translate(140, 240) rotate(-35)">
                  <rect x="0" y="-8" width="180" height="16" rx="4" fill="url(#robotArmGrad)" stroke="#475569" strokeWidth="1" />
                  {/* Articulating Wrist Joint */}
                  <circle cx="180" cy="0" r="10" fill="#334155" stroke="#cbd5e1" strokeWidth="1.5" />
                  {/* Instrument Tines */}
                  <path d="M 180 -5 L 210 -12" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" />
                  <path d="M 180 5 L 210 12" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" />
                </g>

                {/* Right Arm (Instrument 2 - Active Energy Spark) */}
                <g transform="translate(500, 240) rotate(-145)">
                  <rect x="0" y="-8" width="180" height="16" rx="4" fill="url(#robotArmGrad)" stroke="#475569" strokeWidth="1" />
                  {/* Articulating Wrist Joint */}
                  <circle cx="180" cy="0" r="10" fill="#334155" stroke="#cbd5e1" strokeWidth="1.5" />
                  {/* Hot Shears Scissors */}
                  <path d="M 180 -4 L 215 -8" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" />
                  <path d="M 180 4 L 215 8" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" />

                  {/* Energy Spark Activation */}
                  {animTick % 2 === 0 && (
                    <circle cx="218" cy="0" r={liveHemodynamics.thermalSpreadMm * 3} fill="rgba(251, 191, 36, 0.45)" stroke="#f59e0b" strokeWidth="1.5" />
                  )}
                </g>

                {/* HUD Targeting Reticle & Instrument Labels */}
                <circle cx="320" cy="160" r="28" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
                <text x="30" y="300" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                  L: {instrumentArm1.replace(/_/g, ' ')}
                </text>
                <text x="610" y="300" fill="#f59e0b" fontSize="10" fontFamily="monospace" textAnchor="end">
                  R: {instrumentArm2.replace(/_/g, ' ')} ({activeEnergy.replace(/_/g, ' ')} {energyWatts}W)
                </text>
              </svg>
            </div>

            {/* Quick Action Tools Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2">
                {activePreset.procedure === 'LAP_CHOLECYSTECTOMY' && (
                  <button
                    onClick={handleConfirmCVS}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center gap-1.5 ${
                      cvsConfirmed
                        ? 'bg-emerald-900/60 border-emerald-500 text-emerald-300'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    {cvsConfirmed ? 'Critical View Confirmed' : 'Verify Critical View of Safety'}
                  </button>
                )}

                {activePreset.procedure === 'ROBOTIC_PARTIAL_NEPHRECTOMY' && (
                  <button
                    onClick={handleToggleClamp}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center gap-1.5 ${
                      clampApplied
                        ? 'bg-rose-900/60 border-rose-500 text-rose-300'
                        : 'bg-emerald-900/60 border-emerald-500 text-emerald-300'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    {clampApplied ? 'Release Renal Clamps' : 'Apply Bulldog Clamps (Start WIT)'}
                  </button>
                )}
              </div>

              {/* Motion Scaling Pills */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                <span className="text-[10px] text-slate-500 px-1 font-semibold uppercase">Motion Scale:</span>
                {(['1:1', '2:1', '3:1'] as ('1:1' | '2:1' | '3:1')[]).map(scale => (
                  <button
                    key={scale}
                    onClick={() => setMotionScaling(scale)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition ${
                      motionScaling === scale
                        ? 'bg-cyan-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {scale}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Surgical Steps & Board Review Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Action Steps */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Operative Sequence &amp; Dissection Steps
                </span>
              </div>
              <ul className="space-y-2">
                {activePreset.surgicalSteps.map((step, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="font-mono text-emerald-400 font-bold shrink-0">{idx + 1}.</span>
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
                  Surgical Board Pearls &amp; Complications
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
