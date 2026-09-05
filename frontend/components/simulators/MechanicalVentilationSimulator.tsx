'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  simulateVentilatorMechanics,
  calculatePredictedBodyWeight,
  VENTILATOR_PRESETS,
  VentilationCasePreset,
  VentilationMode,
  VentilatorSettings,
  PatientCharacteristics,
} from '@/.gemini/skills/MechanicalVentilationEngine';
import {
  Activity,
  Wind,
  Sliders,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Info,
  RotateCcw,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  Clock,
  Heart,
  Gauge,
  BookOpen,
} from 'lucide-react';

export default function MechanicalVentilationSimulator() {
  // Preset Selection
  const [selectedPresetId, setSelectedPresetId] = useState<string>('severe-ards');
  const [showCaseVignette, setShowCaseVignette] = useState<boolean>(true);
  const [revealedRationale, setRevealedRationale] = useState<boolean>(false);

  // Ventilator Settings State
  const [settings, setSettings] = useState<VentilatorSettings>({
    mode: 'VCV',
    tidalVolumeMl: 420,
    inspiratoryPressureCmH2O: 18,
    respiratoryRate: 24,
    peepCmH2O: 14,
    fiO2: 0.80,
    ieRatio: { insp: 1, exp: 2 },
    peakFlowLpm: 60,
    flowWaveform: 'SQUARE',
    inspiratoryPausePercent: 10,
    flowTriggerLpm: 2.0,
  });

  // Patient Mechanics State
  const [patient, setPatient] = useState<PatientCharacteristics>({
    heightCm: 175,
    gender: 'MALE',
    complianceMlPerCmH2O: 20,
    resistanceCmH2OPerLps: 4,
  });

  // Active View Tab: 'SCALARS' (P-t, V'-t, V-t) or 'PV_LOOP' (P-V)
  const [viewMode, setViewMode] = useState<'SCALARS' | 'PV_LOOP'>('SCALARS');

  // Diagnostic Maneuver Simulation State
  const [isInspiratoryHoldActive, setIsInspiratoryHoldActive] = useState<boolean>(false);
  const [isExpiratoryHoldActive, setIsExpiratoryHoldActive] = useState<boolean>(false);

  // Load Preset
  const handleSelectPreset = useCallback((preset: VentilationCasePreset) => {
    setSelectedPresetId(preset.id);
    setSettings(preset.settings);
    setPatient(preset.patient);
    setRevealedRationale(false);
    setIsInspiratoryHoldActive(false);
    setIsExpiratoryHoldActive(false);
  }, []);

  // Compute Simulation
  const effectiveSettings = useMemo(() => {
    if (isInspiratoryHoldActive) {
      return { ...settings, inspiratoryPausePercent: 25 };
    }
    return settings;
  }, [settings, isInspiratoryHoldActive]);

  const { waveforms, diagnostics } = useMemo(
    () => simulateVentilatorMechanics(effectiveSettings, patient, 2, 80),
    [effectiveSettings, patient]
  );

  const activePreset = useMemo(
    () => VENTILATOR_PRESETS.find((p) => p.id === selectedPresetId) || VENTILATOR_PRESETS[0],
    [selectedPresetId]
  );

  // Socratic AI Bridge
  const handleConsultAI = useCallback(() => {
    const summary = `Mode: ${settings.mode}, Set VT: ${settings.tidalVolumeMl} mL (${(diagnostics.deliveredTidalVolumeMl / diagnostics.predictedBodyWeightKg).toFixed(1)} mL/kg PBW), Rate: ${settings.respiratoryRate}, PEEP: ${settings.peepCmH2O}, FiO2: ${Math.round(settings.fiO2 * 100)}%. Measured: Ppeak ${diagnostics.peakInspiratoryPressureCmH2O} cmH2O, Pplat ${diagnostics.plateauPressureCmH2O} cmH2O, Driving Pressure ${diagnostics.drivingPressureCmH2O} cmH2O, Cstat ${diagnostics.staticComplianceMlPerCmH2O} mL/cmH2O, Raw ${diagnostics.airwayResistanceCmH2OPerLps} cmH2O/L/s, Auto-PEEP ${diagnostics.autoPeepCmH2O} cmH2O.`;
    const context = `[Mechanical Ventilation Workstation - Scenario: ${activePreset.title}]\nVignette: ${activePreset.clinicalScenario}\nVentilator State: ${summary}\nActive Alarms: ${diagnostics.alarms.join('; ') || 'None'}\nPlease explain the underlying mechanics, whether ARDSNet lung-protective criteria are satisfied, and recommended ventilator adjustments.`;

    window.dispatchEvent(
      new CustomEvent('mediverse:open-ai-with-context', {
        detail: { context },
      })
    );
  }, [settings, diagnostics, activePreset]);

  // Reset to default normal settings
  const handleReset = useCallback(() => {
    setSettings({
      mode: 'VCV',
      tidalVolumeMl: 450,
      inspiratoryPressureCmH2O: 15,
      respiratoryRate: 15,
      peepCmH2O: 5,
      fiO2: 0.35,
      ieRatio: { insp: 1, exp: 2 },
      peakFlowLpm: 60,
      flowWaveform: 'SQUARE',
      inspiratoryPausePercent: 10,
      flowTriggerLpm: 2.0,
    });
    setPatient({
      heightCm: 175,
      gender: 'MALE',
      complianceMlPerCmH2O: 60,
      resistanceCmH2OPerLps: 4,
    });
    setIsInspiratoryHoldActive(false);
    setIsExpiratoryHoldActive(false);
  }, []);

  // SVG Scalers
  const maxTime = waveforms.length > 0 ? waveforms[waveforms.length - 1].timeSec : 8;
  const pressurePoints = useMemo(() => {
    if (waveforms.length === 0) return '';
    // SVG width 500, height 120 (0 to 60 cmH2O)
    return waveforms
      .map((w) => {
        const x = (w.timeSec / maxTime) * 500;
        const y = 120 - Math.min(120, Math.max(0, (w.pressureCmH2O / 50) * 120));
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }, [waveforms, maxTime]);

  const flowPoints = useMemo(() => {
    if (waveforms.length === 0) return '';
    // SVG width 500, height 120 (-2.0 to +2.0 L/s, zero at y=60)
    return waveforms
      .map((w) => {
        const x = (w.timeSec / maxTime) * 500;
        const y = 60 - Math.min(60, Math.max(-60, (w.flowLps / 1.5) * 60));
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }, [waveforms, maxTime]);

  const volumePoints = useMemo(() => {
    if (waveforms.length === 0) return '';
    // SVG width 500, height 120 (0 to 800 mL)
    return waveforms
      .map((w) => {
        const x = (w.timeSec / maxTime) * 500;
        const y = 120 - Math.min(120, Math.max(0, (w.volumeMl / 700) * 120));
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }, [waveforms, maxTime]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-slate-100">
      {/* ----------------- Top Header & Navigation ----------------- */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400">
                <Wind className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                  Mechanical Ventilation &amp; Respiratory Mechanics Workstation
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono">
                    ICU Console
                  </span>
                </h1>
                <p className="text-sm text-slate-400">
                  Equation of motion solver, real-time waveform graphics, inspiratory hold mechanics, and ARDSNet lung-protective titration.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleConsultAI}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold rounded-xl shadow-lg transition"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              Consult Socratic AI
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium rounded-xl transition"
              title="Reset ventilator to standard normal parameters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6 pt-5 border-t border-slate-800">
          {(['VCV', 'PCV', 'PSV', 'SIMV'] as VentilationMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setSettings({ ...settings, mode })}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                settings.mode === mode
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20'
                  : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/50'
              }`}
            >
              <Gauge className="w-3.5 h-3.5" />
              {mode === 'VCV' && 'Volume Control (VCV)'}
              {mode === 'PCV' && 'Pressure Control (PCV)'}
              {mode === 'PSV' && 'Pressure Support (PSV)'}
              {mode === 'SIMV' && 'SIMV Mode'}
            </button>
          ))}
        </div>
      </div>

      {/* ----------------- Presets Drawer ----------------- */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Critical Care Scenarios &amp; Pathology Presets
            </span>
          </div>
          <button
            onClick={() => setShowCaseVignette(!showCaseVignette)}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
          >
            {showCaseVignette ? 'Hide Case Details' : 'Show Case Details'}
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
          {VENTILATOR_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition border ${
                selectedPresetId === preset.id
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-semibold'
                  : 'bg-slate-800/70 hover:bg-slate-800 border-slate-700/60 text-slate-400'
              }`}
            >
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950/80 mr-1.5 font-mono text-slate-400">
                {preset.settings.mode}
              </span>
              {preset.title}
            </button>
          ))}
        </div>

        {/* Selected Preset Vignette Box */}
        {showCaseVignette && activePreset && (
          <div className="mt-3.5 p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                Case: {activePreset.title}
              </h3>
              <button
                onClick={() => setRevealedRationale(!revealedRationale)}
                className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 rounded-lg transition self-start sm:self-auto"
              >
                {revealedRationale ? 'Hide Clinical Teaching' : 'Reveal Respiratory Teaching'}
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{activePreset.clinicalScenario}</p>

            {revealedRationale && (
              <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/30 space-y-2 text-xs">
                <p className="font-semibold text-cyan-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Clinical &amp; Physiological Pearls:
                </p>
                <ul className="space-y-1.5 pl-4 list-disc text-slate-300">
                  {activePreset.teachingPoints.map((pt, idx) => (
                    <li key={idx}>{pt}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ----------------- Main Ventilator Grid ----------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Ventilator Controls & Patient Sliders (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Ventilator Parameters &amp; Patient Lungs
            </h2>
            <span className="text-[11px] text-cyan-400 font-mono font-bold">
              {settings.mode} Active
            </span>
          </div>

          {/* Mode Specific Controls */}
          {settings.mode === 'VCV' ? (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-200">Set Tidal Volume (VT)</span>
                <span className="font-mono font-bold text-cyan-400">{settings.tidalVolumeMl} mL</span>
              </div>
              <input
                type="range"
                min="200"
                max="800"
                step="10"
                value={settings.tidalVolumeMl}
                onChange={(e) => setSettings({ ...settings, tidalVolumeMl: parseInt(e.target.value) })}
                className="w-full accent-cyan-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>4 mL/kg: {diagnostics.targetTidalVolumeRangeMl.min4} mL</span>
                <span className="text-cyan-300 font-semibold">6 mL/kg PBW: {diagnostics.targetTidalVolumeRangeMl.target6} mL</span>
                <span>8 mL/kg: {diagnostics.targetTidalVolumeRangeMl.max8} mL</span>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-200">Inspiratory Pressure (Pinsp / ΔP)</span>
                <span className="font-mono font-bold text-cyan-400">+{settings.inspiratoryPressureCmH2O} cmH2O</span>
              </div>
              <input
                type="range"
                min="4"
                max="35"
                step="1"
                value={settings.inspiratoryPressureCmH2O}
                onChange={(e) => setSettings({ ...settings, inspiratoryPressureCmH2O: parseInt(e.target.value) })}
                className="w-full accent-cyan-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Low (&lt;10)</span>
                <span>Normal 12 - 20</span>
                <span>High (&gt;25)</span>
              </div>
            </div>
          )}

          {/* Rate & PEEP */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Rate (f, bpm)</span>
                <span className="font-mono text-cyan-400">{settings.respiratoryRate}</span>
              </div>
              <input
                type="range"
                min="6"
                max="40"
                step="1"
                value={settings.respiratoryRate}
                onChange={(e) => setSettings({ ...settings, respiratoryRate: parseInt(e.target.value) })}
                className="w-full accent-cyan-500"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">PEEP (cmH2O)</span>
                <span className="font-mono text-cyan-400">{settings.peepCmH2O}</span>
              </div>
              <input
                type="range"
                min="0"
                max="24"
                step="1"
                value={settings.peepCmH2O}
                onChange={(e) => setSettings({ ...settings, peepCmH2O: parseInt(e.target.value) })}
                className="w-full accent-cyan-500"
              />
            </div>
          </div>

          {/* FiO2 & Peak Flow */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">FiO2</span>
                <span className="font-mono text-cyan-400">{Math.round(settings.fiO2 * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.21"
                max="1.00"
                step="0.01"
                value={settings.fiO2}
                onChange={(e) => setSettings({ ...settings, fiO2: parseFloat(e.target.value) })}
                className="w-full accent-cyan-500"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Peak Flow (L/min)</span>
                <span className="font-mono text-cyan-400">{settings.peakFlowLpm}</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                step="5"
                value={settings.peakFlowLpm}
                onChange={(e) => setSettings({ ...settings, peakFlowLpm: parseInt(e.target.value) })}
                className="w-full accent-cyan-500"
              />
            </div>
          </div>

          {/* I:E Ratio Selector */}
          <div className="space-y-1">
            <span className="text-xs text-slate-300">I:E Ratio</span>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: '1:1', insp: 1, exp: 1 },
                { label: '1:2', insp: 1, exp: 2 },
                { label: '1:3', insp: 1, exp: 3 },
                { label: '1:4', insp: 1, exp: 4 },
              ].map((ie) => (
                <button
                  key={ie.label}
                  onClick={() => setSettings({ ...settings, ieRatio: { insp: ie.insp, exp: ie.exp } })}
                  className={`py-1.5 rounded-lg text-xs font-semibold transition ${
                    settings.ieRatio.exp === ie.exp
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {ie.label}
                </button>
              ))}
            </div>
          </div>

          {/* Diagnostic Maneuvers Bar */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Diagnostic Maneuvers
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setIsInspiratoryHoldActive(!isInspiratoryHoldActive)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition border flex items-center justify-center gap-1.5 ${
                  isInspiratoryHoldActive
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold animate-pulse'
                    : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                {isInspiratoryHoldActive ? 'Inspiratory Hold: ON' : 'Inspiratory Hold'}
              </button>
              <button
                onClick={() => setIsExpiratoryHoldActive(!isExpiratoryHoldActive)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition border flex items-center justify-center gap-1.5 ${
                  isExpiratoryHoldActive
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold animate-pulse'
                    : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                {isExpiratoryHoldActive ? 'Expiratory Hold: ON' : 'Expiratory Hold'}
              </button>
            </div>
          </div>

          {/* Patient Lungs Mechanics Sliders */}
          <div className="pt-3 border-t border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              Patient Respiratory Mechanics
            </h3>

            {/* Compliance */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Static Compliance (Cstat)</span>
                <span className="font-mono font-bold text-cyan-400">{patient.complianceMlPerCmH2O} mL/cmH2O</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                step="2"
                value={patient.complianceMlPerCmH2O}
                onChange={(e) => setPatient({ ...patient, complianceMlPerCmH2O: parseInt(e.target.value) })}
                className="w-full accent-cyan-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Severe ARDS (10-20)</span>
                <span>Normal 50-80</span>
                <span>Emphysema (80+)</span>
              </div>
            </div>

            {/* Airway Resistance */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Airway Resistance (Raw)</span>
                <span className="font-mono font-bold text-cyan-400">{patient.resistanceCmH2OPerLps} cmH2O/L/s</span>
              </div>
              <input
                type="range"
                min="2"
                max="35"
                step="1"
                value={patient.resistanceCmH2OPerLps}
                onChange={(e) => setPatient({ ...patient, resistanceCmH2OPerLps: parseInt(e.target.value) })}
                className="w-full accent-cyan-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Normal (2-5)</span>
                <span>Moderate (10-15)</span>
                <span>Severe Asthma (20+)</span>
              </div>
            </div>

            {/* Height & Gender */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[11px] text-slate-400">Height (cm)</label>
                <input
                  type="number"
                  value={patient.heightCm}
                  onChange={(e) => setPatient({ ...patient, heightCm: parseInt(e.target.value) || 170 })}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400">Gender</label>
                <select
                  value={patient.gender}
                  onChange={(e) => setPatient({ ...patient, gender: e.target.value as 'MALE' | 'FEMALE' })}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white"
                >
                  <option value="MALE">Male (PBW {calculatePredictedBodyWeight(patient.heightCm, 'MALE')} kg)</option>
                  <option value="FEMALE">Female (PBW {calculatePredictedBodyWeight(patient.heightCm, 'FEMALE')} kg)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Waveform Traces & Diagnostic Metrics HUD (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Waveforms Screen Container */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                  Live Respiratory Waveform Traces
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('SCALARS')}
                  className={`text-[11px] px-2.5 py-1 rounded-md font-semibold transition ${
                    viewMode === 'SCALARS' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Scalars (P-t, V'-t, V-t)
                </button>
              </div>
            </div>

            {/* 1. Pressure-Time Waveform */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  ● Airway Pressure [Paw, cmH2O]
                </span>
                <span className="text-slate-400">
                  Ppeak: <strong className="text-emerald-300">{diagnostics.peakInspiratoryPressureCmH2O}</strong> | Pplat:{' '}
                  <strong className="text-amber-300">{diagnostics.plateauPressureCmH2O}</strong>
                </span>
              </div>
              <div className="w-full h-24 bg-slate-900/90 rounded-lg p-1.5 border border-slate-800/80 relative overflow-hidden">
                <svg viewBox="0 0 500 120" className="w-full h-full preserve-3d" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="24" x2="500" y2="24" stroke="#1e293b" strokeDasharray="4 4" strokeWidth="1" />
                  <line x1="0" y1="48" x2="500" y2="48" stroke="#1e293b" strokeDasharray="4 4" strokeWidth="1" />
                  <line x1="0" y1="72" x2="500" y2="72" stroke="#1e293b" strokeDasharray="4 4" strokeWidth="1" />
                  <line x1="0" y1="96" x2="500" y2="96" stroke="#1e293b" strokeDasharray="4 4" strokeWidth="1" />

                  {/* Pplat guideline */}
                  {diagnostics.plateauPressureCmH2O > 0 && (
                    <line
                      x1="0"
                      y1={120 - (diagnostics.plateauPressureCmH2O / 50) * 120}
                      x2="500"
                      y2={120 - (diagnostics.plateauPressureCmH2O / 50) * 120}
                      stroke="#f59e0b"
                      strokeDasharray="2 4"
                      strokeWidth="1.5"
                    />
                  )}

                  {/* Polyline */}
                  <polyline fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" points={pressurePoints} />
                </svg>
              </div>
            </div>

            {/* 2. Flow-Time Waveform */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-cyan-400 font-bold flex items-center gap-1">
                  ● Flow [V', L/s]
                </span>
                <span className="text-slate-400">
                  Insp &gt; 0 | Exp &lt; 0 | Auto-PEEP:{' '}
                  <strong className={diagnostics.autoPeepCmH2O > 2 ? 'text-rose-400' : 'text-slate-300'}>
                    {diagnostics.autoPeepCmH2O} cmH2O
                  </strong>
                </span>
              </div>
              <div className="w-full h-24 bg-slate-900/90 rounded-lg p-1.5 border border-slate-800/80 relative overflow-hidden">
                <svg viewBox="0 0 500 120" className="w-full h-full" preserveAspectRatio="none">
                  <line x1="0" y1="60" x2="500" y2="60" stroke="#334155" strokeWidth="1.5" />
                  <polyline fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" points={flowPoints} />
                </svg>
              </div>
            </div>

            {/* 3. Volume-Time Waveform */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  ● Delivered Volume [V, mL]
                </span>
                <span className="text-slate-400">
                  Delivered VT: <strong className="text-amber-300">{diagnostics.deliveredTidalVolumeMl} mL</strong> (
                  {(diagnostics.deliveredTidalVolumeMl / diagnostics.predictedBodyWeightKg).toFixed(1)} mL/kg PBW)
                </span>
              </div>
              <div className="w-full h-20 bg-slate-900/90 rounded-lg p-1.5 border border-slate-800/80 relative overflow-hidden">
                <svg viewBox="0 0 500 120" className="w-full h-full" preserveAspectRatio="none">
                  <line x1="0" y1="110" x2="500" y2="110" stroke="#334155" strokeWidth="1" />
                  <polyline fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" points={volumePoints} />
                </svg>
              </div>
            </div>
          </div>

          {/* Real-time Physiological Metrics Grid */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Calculated Respiratory Mechanics HUD
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Driving Pressure */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Driving Pressure (ΔP)</span>
                <p className="text-base font-bold text-cyan-400 mt-0.5">
                  {diagnostics.drivingPressureCmH2O}
                  <span className="text-[10px] font-normal text-slate-400 ml-1">cmH2O</span>
                </p>
                <span className={`text-[10px] ${diagnostics.drivingPressureCmH2O <= 14 ? 'text-emerald-400' : 'text-rose-400 font-bold'}`}>
                  {diagnostics.drivingPressureCmH2O <= 14 ? '✓ Safe (<14)' : '⚠️ High Risk (>14)'}
                </span>
              </div>

              {/* Static Compliance */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Static Compliance</span>
                <p className="text-base font-bold text-cyan-400 mt-0.5">
                  {diagnostics.staticComplianceMlPerCmH2O}
                  <span className="text-[10px] font-normal text-slate-400 ml-1">mL/cmH2O</span>
                </p>
                <span className="text-[10px] text-slate-400">Normal: 50 - 80</span>
              </div>

              {/* Airway Resistance */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Airway Resistance</span>
                <p className="text-base font-bold text-cyan-400 mt-0.5">
                  {diagnostics.airwayResistanceCmH2OPerLps}
                  <span className="text-[10px] font-normal text-slate-400 ml-1">cmH2O/L/s</span>
                </p>
                <span className="text-[10px] text-slate-400">Normal: 2 - 5</span>
              </div>

              {/* Total PEEP */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Total PEEP (Set + Auto)</span>
                <p className="text-base font-bold text-cyan-400 mt-0.5">
                  {diagnostics.totalPeepCmH2O}
                  <span className="text-[10px] font-normal text-slate-400 ml-1">cmH2O</span>
                </p>
                <span className="text-[10px] text-slate-400">Auto-PEEP: {diagnostics.autoPeepCmH2O}</span>
              </div>
            </div>

            {/* Safety Compliance & Alarms */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">ARDSNet Lung-Protective Criteria:</span>
                <div className="flex gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                    diagnostics.lungProtectiveCompliance.isTidalVolumeProtective
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}>
                    VT ≤ 8 mL/kg: {diagnostics.lungProtectiveCompliance.isTidalVolumeProtective ? 'PASS' : 'FAIL'}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                    diagnostics.lungProtectiveCompliance.isPlateauPressureSafe
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}>
                    Pplat ≤ 30: {diagnostics.lungProtectiveCompliance.isPlateauPressureSafe ? 'PASS' : 'FAIL'}
                  </span>
                </div>
              </div>

              {/* Active Alarms */}
              {diagnostics.alarms.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  {diagnostics.alarms.map((alarm, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/40 text-xs text-rose-200 flex items-start gap-2"
                    >
                      <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                      <span>{alarm}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
