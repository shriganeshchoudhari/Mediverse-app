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
  Activity,
  Heart,
  ShieldAlert,
  AlertTriangle,
  AlertOctagon,
  Sparkles,
  RotateCcw,
  Sliders,
  Droplet,
  Layers,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import {
  IABPAssistRatio,
  IABPTriggerMode,
  IABPPumpSettings,
  PatientHemodynamics,
  calculateIABPDynamics,
  generateIABPArterialWaveform,
  IABP_PRESETS,
} from '@/.gemini/skills/IABPCounterpulsationEngine';

export default function IABPCounterpulsationSimulator() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('optimal-counterpulsation-1-2');

  // Pump Settings
  const [assistRatio, setAssistRatio] = useState<IABPAssistRatio>('1:2');
  const [triggerMode, setTriggerMode] = useState<IABPTriggerMode>('ECG');
  const [balloonVolumeCc, setBalloonVolumeCc] = useState<number>(40);
  const [inflationOffsetMs, setInflationOffsetMs] = useState<number>(0);
  const [deflationOffsetMs, setDeflationOffsetMs] = useState<number>(0);

  // Patient Hemodynamics
  const [heartRate, setHeartRate] = useState<number>(75);
  const [systolicBP, setSystolicBP] = useState<number>(95);
  const [diastolicBP, setDiastolicBP] = useState<number>(55);
  const [strokeVolume, setStrokeVolume] = useState<number>(45);
  const [aorticRegurgitation, setAorticRegurgitation] = useState<'NONE' | 'MILD' | 'MODERATE' | 'SEVERE'>('NONE');

  // Compile Pump and Patient Objects
  const currentPump: IABPPumpSettings = useMemo(
    () => ({
      assistRatio,
      triggerMode,
      balloonVolumeCc,
      inflationTimingOffsetMs: inflationOffsetMs,
      deflationTimingOffsetMs: deflationOffsetMs,
      frequencyHz: 1.0,
    }),
    [assistRatio, triggerMode, balloonVolumeCc, inflationOffsetMs, deflationOffsetMs]
  );

  const currentPatient: PatientHemodynamics = useMemo(
    () => ({
      heartRateBpm: heartRate,
      systolicBloodPressureMmHg: systolicBP,
      diastolicBloodPressureMmHg: diastolicBP,
      systemicVascularResistanceDynes: 1400,
      strokeVolumeMl: strokeVolume,
      coronaryStenosisPercent: 70,
      aorticRegurgitationGrade: aorticRegurgitation,
    }),
    [heartRate, systolicBP, diastolicBP, strokeVolume, aorticRegurgitation]
  );

  // Calculate Dynamics & Waveform
  const iabpResult = useMemo(
    () => calculateIABPDynamics(currentPump, currentPatient),
    [currentPump, currentPatient]
  );

  const waveformData = useMemo(
    () => generateIABPArterialWaveform(currentPump, currentPatient, iabpResult),
    [currentPump, currentPatient, iabpResult]
  );

  // Preset Loader
  const loadPreset = (presetId: string) => {
    const preset = IABP_PRESETS.find(p => p.id === presetId);
    if (!preset) return;
    setSelectedPresetId(presetId);

    setAssistRatio(preset.pumpSettings.assistRatio);
    setTriggerMode(preset.pumpSettings.triggerMode);
    setBalloonVolumeCc(preset.pumpSettings.balloonVolumeCc);
    setInflationOffsetMs(preset.pumpSettings.inflationTimingOffsetMs);
    setDeflationOffsetMs(preset.pumpSettings.deflationTimingOffsetMs);

    setHeartRate(preset.patientHemodynamics.heartRateBpm);
    setSystolicBP(preset.patientHemodynamics.systolicBloodPressureMmHg);
    setDiastolicBP(preset.patientHemodynamics.diastolicBloodPressureMmHg);
    setStrokeVolume(preset.patientHemodynamics.strokeVolumeMl);
    setAorticRegurgitation(preset.patientHemodynamics.aorticRegurgitationGrade);
  };

  // Reset to Optimal Timing
  const autoOptimizeTiming = () => {
    setInflationOffsetMs(0);
    setDeflationOffsetMs(0);
  };

  // Socratic AI Context Bridge
  const handleConsultAI = () => {
    const context = `Intra-Aortic Balloon Pump (IABP) Counterpulsation Workstation:
Assist Ratio: ${assistRatio} | Balloon Volume: ${balloonVolumeCc} cc | Trigger: ${triggerMode}
Timing Classification: ${iabpResult.timingClassification} (Inflation Offset: ${inflationOffsetMs} ms, Deflation Offset: ${deflationOffsetMs} ms)
Pressures: Unassisted Systolic (PSP) = ${iabpResult.unassistedSystolicPressureMmHg} mmHg | Augmented Peak Diastolic (PDP) = ${iabpResult.peakDiastolicAugmentedPressureMmHg} mmHg
Balloon End-Diastolic (BAEDP) = ${iabpResult.balloonAorticEndDiastolicPressureMmHg} mmHg | Patient End-Diastolic (PAEDP) = ${iabpResult.patientAorticEndDiastolicPressureMmHg} mmHg
Assisted Systolic (APSP) = ${iabpResult.assistedSystolicPressureMmHg} mmHg | MAP = ${iabpResult.meanArterialPressureMmHg} mmHg
Coronary Perfusion Enhancement: +${iabpResult.coronaryPerfusionEnhancementPcnt}% | LV Afterload Reduction: ${iabpResult.leftVentricularAfterloadReductionPcnt}%
Cardiac Output: ${iabpResult.cardiacOutputLpm} L/min | MVO2 Balance Ratio: ${iabpResult.myocardialOxygenBalanceRatio}
Aortic Regurgitation: ${aorticRegurgitation} | Contraindications: ${iabpResult.contraindicationsDetected.join('; ') || 'None'}
Active Warnings: ${iabpResult.warnings.join('; ') || 'None'}`;

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
            <div className="p-2.5 bg-rose-600/20 border border-rose-500/30 rounded-xl text-rose-400">
              <Heart className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
                Intra-Aortic Balloon Pump (IABP) Workstation
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-950/70 border border-rose-700/60 text-rose-300 font-medium">
                  Mechanical Circulatory Support
                </span>
              </h1>
              <p className="text-sm text-slate-400">
                Diastolic coronary augmentation, presystolic afterload reduction, dicrotic notch timing errors &amp; assist ratios.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Real-time Status Badge */}
            {iabpResult.contraindicationsDetected.length > 0 ? (
              <div className="px-4 py-2 rounded-xl border flex items-center gap-2 font-semibold text-sm bg-rose-950/80 border-rose-600 text-rose-200 animate-pulse">
                <AlertOctagon className="w-4 h-4 text-rose-400" />
                <span>AORTIC REGURGITATION HAZARD</span>
              </div>
            ) : iabpResult.timingClassification === 'EARLY_INFLATION' ? (
              <div className="px-4 py-2 rounded-xl border flex items-center gap-2 font-semibold text-sm bg-rose-950/80 border-rose-600 text-rose-200 animate-pulse">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>EARLY INFLATION ERROR</span>
              </div>
            ) : iabpResult.timingClassification === 'LATE_DEFLATION' ? (
              <div className="px-4 py-2 rounded-xl border flex items-center gap-2 font-semibold text-sm bg-rose-950/80 border-rose-600 text-rose-200 animate-pulse">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>LATE DEFLATION ERROR</span>
              </div>
            ) : iabpResult.timingClassification === 'LATE_INFLATION' ? (
              <div className="px-4 py-2 rounded-xl border flex items-center gap-2 font-semibold text-sm bg-amber-950/80 border-amber-600 text-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>LATE INFLATION (SUBOPTIMAL PDP)</span>
              </div>
            ) : iabpResult.timingClassification === 'EARLY_DEFLATION' ? (
              <div className="px-4 py-2 rounded-xl border flex items-center gap-2 font-semibold text-sm bg-amber-950/80 border-amber-600 text-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>EARLY DEFLATION (LOSS OF REDUCTION)</span>
              </div>
            ) : (
              <div className="px-4 py-2 rounded-xl border flex items-center gap-2 font-semibold text-sm bg-emerald-950/60 border-emerald-600 text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>OPTIMAL COUNTERPULSATION</span>
              </div>
            )}

            <button
              onClick={handleConsultAI}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 border border-rose-400/30 text-white text-sm font-semibold flex items-center gap-2 transition shadow-lg shadow-rose-600/20"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Consult Socratic AI</span>
            </button>
          </div>
        </div>

        {/* High-Yield Clinical Presets */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-slate-300">
              High-Yield Clinical Presets
            </span>
            <button
              onClick={() => loadPreset('optimal-counterpulsation-1-2')}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3 h-3" /> Reset Default
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {IABP_PRESETS.map(p => (
              <button
                key={p.id}
                onClick={() => loadPreset(p.id)}
                className={`text-left p-2.5 rounded-xl border text-xs transition ${
                  selectedPresetId === p.id
                    ? 'bg-rose-950/60 border-rose-500 text-white shadow-md'
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold truncate">{p.title.split('(')[0]}</div>
                <div className="text-[11px] text-rose-400 truncate font-mono">Ratio {p.pumpSettings.assistRatio} | {p.pumpSettings.balloonVolumeCc}cc</div>
                <div className="mt-1 text-[10px] text-slate-400 truncate">{p.clinicalScenario.split('.')[0]}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hemodynamics & 6-Pressure Landmark HUD */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Unassisted Systolic (PSP) */}
        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl text-center space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Unassisted Systolic (PSP)</span>
          <div className="text-2xl font-mono font-black text-slate-200">
            {iabpResult.unassistedSystolicPressureMmHg} <span className="text-xs font-normal text-slate-400">mmHg</span>
          </div>
          <span className="text-[10px] text-slate-500 block">Patient Native Peak</span>
        </div>

        {/* Augmented Diastolic (PDP) */}
        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl text-center space-y-1">
          <span className="text-[10px] font-semibold text-rose-300 uppercase tracking-wider">Augmented Peak (PDP)</span>
          <div className="text-2xl font-mono font-black text-rose-400">
            {iabpResult.peakDiastolicAugmentedPressureMmHg} <span className="text-xs font-normal text-slate-400">mmHg</span>
          </div>
          <span className="text-[10px] text-slate-500 block">
            {iabpResult.peakDiastolicAugmentedPressureMmHg > iabpResult.unassistedSystolicPressureMmHg
              ? 'PDP > PSP (Optimal)'
              : 'PDP Suboptimal'}
          </span>
        </div>

        {/* Balloon End-Diastolic (BAEDP) */}
        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl text-center space-y-1">
          <span className="text-[10px] font-semibold text-sky-300 uppercase tracking-wider">Balloon End-Diastolic (BAEDP)</span>
          <div className="text-2xl font-mono font-black text-sky-400">
            {iabpResult.balloonAorticEndDiastolicPressureMmHg} <span className="text-xs font-normal text-slate-400">mmHg</span>
          </div>
          <span className="text-[10px] text-slate-500 block">
            PAEDP: {iabpResult.patientAorticEndDiastolicPressureMmHg} mmHg
          </span>
        </div>

        {/* Assisted Systolic (APSP) */}
        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl text-center space-y-1">
          <span className="text-[10px] font-semibold text-emerald-300 uppercase tracking-wider">Assisted Systolic (APSP)</span>
          <div
            className={`text-2xl font-mono font-black ${
              iabpResult.assistedSystolicPressureMmHg > iabpResult.unassistedSystolicPressureMmHg
                ? 'text-rose-400'
                : 'text-emerald-400'
            }`}
          >
            {iabpResult.assistedSystolicPressureMmHg} <span className="text-xs font-normal text-slate-400">mmHg</span>
          </div>
          <span className="text-[10px] text-slate-500 block">
            {iabpResult.assistedSystolicPressureMmHg < iabpResult.unassistedSystolicPressureMmHg
              ? 'Reduced LV Afterload'
              : 'Ejection Impedance Surge'}
          </span>
        </div>

        {/* Coronary Perfusion Enhancement */}
        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl text-center space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Coronary Flow &Delta;</span>
          <div className="text-2xl font-mono font-black text-rose-400 flex items-center justify-center gap-1">
            <TrendingUp className="w-5 h-5 text-rose-400" />
            +{iabpResult.coronaryPerfusionEnhancementPcnt}%
          </div>
          <span className="text-[10px] text-slate-500 block">Diastolic Transfusion</span>
        </div>

        {/* LV Afterload Reduction */}
        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl text-center space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">LV Afterload &Delta;</span>
          <div
            className={`text-2xl font-mono font-black flex items-center justify-center gap-1 ${
              iabpResult.leftVentricularAfterloadReductionPcnt > 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            <TrendingDown className="w-5 h-5" />
            {iabpResult.leftVentricularAfterloadReductionPcnt > 0 ? '-' : '+'}
            {Math.abs(iabpResult.leftVentricularAfterloadReductionPcnt)}%
          </div>
          <span className="text-[10px] text-slate-500 block">
            CO: {iabpResult.cardiacOutputLpm} L/min (MAP {iabpResult.meanArterialPressureMmHg})
          </span>
        </div>
      </div>

      {/* Main Console & Telemetry Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: IABP Pump Console */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-rose-400" />
              Counterpulsation Console
            </h2>
            <button
              onClick={autoOptimizeTiming}
              className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1 transition"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Auto-Align Timing
            </button>
          </div>

          {/* Assist Ratio Selector */}
          <div className="space-y-1.5">
            <span className="text-xs text-slate-400 font-semibold block">Assist Ratio</span>
            <div className="grid grid-cols-3 gap-2">
              {(['1:1', '1:2', '1:3'] as IABPAssistRatio[]).map(r => (
                <button
                  key={r}
                  onClick={() => setAssistRatio(r)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition ${
                    assistRatio === r
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {r === '1:1' ? '1:1 (Full)' : r === '1:2' ? '1:2 (Diag)' : '1:3 (Wean)'}
                </button>
              ))}
            </div>
            <span className="text-[10px] text-slate-500 block">
              1:2 ratio allows direct beat-to-beat comparison between assisted and unassisted waveforms.
            </span>
          </div>

          {/* Balloon Volume (cc) */}
          <div className="space-y-1.5">
            <span className="text-xs text-slate-400 font-semibold block">Balloon Displacement Volume</span>
            <div className="grid grid-cols-3 gap-2">
              {[30, 40, 50].map(v => (
                <button
                  key={v}
                  onClick={() => setBalloonVolumeCc(v)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition ${
                    balloonVolumeCc === v
                      ? 'bg-rose-950 border border-rose-500 text-rose-200'
                      : 'bg-slate-950 border border-slate-800 text-slate-400'
                  }`}
                >
                  {v} cc
                </button>
              ))}
            </div>
          </div>

          {/* Inflation Timing Dial */}
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-300">
              <span className="font-semibold text-rose-300">Inflation Timing (Dicrotic Notch)</span>
              <span className={`font-mono font-bold ${inflationOffsetMs === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {inflationOffsetMs > 0 ? `+${inflationOffsetMs}` : inflationOffsetMs} ms
              </span>
            </div>
            <input
              type="range"
              min={-100}
              max={100}
              step={5}
              value={inflationOffsetMs}
              onChange={e => setInflationOffsetMs(+e.target.value)}
              className="w-full accent-rose-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span className="text-rose-400">Early (&lt; -40ms)</span>
              <span className="text-emerald-400 font-bold">Dicrotic Notch</span>
              <span className="text-amber-400">Late (&gt; +40ms)</span>
            </div>
          </div>

          {/* Deflation Timing Dial */}
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-300">
              <span className="font-semibold text-sky-300">Deflation Timing (Presystolic End-Diastole)</span>
              <span className={`font-mono font-bold ${deflationOffsetMs === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {deflationOffsetMs > 0 ? `+${deflationOffsetMs}` : deflationOffsetMs} ms
              </span>
            </div>
            <input
              type="range"
              min={-100}
              max={100}
              step={5}
              value={deflationOffsetMs}
              onChange={e => setDeflationOffsetMs(+e.target.value)}
              className="w-full accent-sky-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span className="text-amber-400">Early (&lt; -50ms)</span>
              <span className="text-emerald-400 font-bold">End-Diastole</span>
              <span className="text-rose-400">Late (&gt; +40ms)</span>
            </div>
          </div>

          {/* Patient Hemodynamics Adjusters */}
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2.5 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Patient Cardiovascular State
            </span>
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Heart Rate</span>
                <span className="font-mono text-slate-200">{heartRate} bpm</span>
              </div>
              <input
                type="range"
                min={50}
                max={140}
                step={5}
                value={heartRate}
                onChange={e => setHeartRate(+e.target.value)}
                className="w-full accent-slate-500"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Systolic Blood Pressure</span>
                <span className="font-mono text-slate-200">{systolicBP} mmHg</span>
              </div>
              <input
                type="range"
                min={60}
                max={140}
                step={5}
                value={systolicBP}
                onChange={e => setSystolicBP(+e.target.value)}
                className="w-full accent-slate-500"
              />
            </div>
            <div className="space-y-1.5">
              <span className="text-slate-300 block">Aortic Regurgitation (Contraindication Screening)</span>
              <select
                value={aorticRegurgitation}
                onChange={e => setAorticRegurgitation(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 text-xs"
              >
                <option value="NONE">None</option>
                <option value="MILD">Mild (Trace 1+)</option>
                <option value="MODERATE">Moderate (2-3+ Contraindicated)</option>
                <option value="SEVERE">Severe (4+ Lethal)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Columns: Arterial Telemetry Waveform Monitor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main 8-Second Arterial Waveform Monitor */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-rose-400" />
                  Live 8-Second Arterial Line Counterpulsation Waveform
                </h3>
                <p className="text-xs text-slate-400">
                  Continuous tracing showing systolic ejection, dicrotic notch, diastolic balloon augmentation, and afterload drop.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300 font-mono">
                  Scale: 0 - 180 mmHg
                </span>
              </div>
            </div>

            {/* Recharts Arterial Waveform Strip */}
            <div className="h-72 w-full pt-4 bg-slate-950/90 rounded-xl p-2 border border-slate-800">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={waveformData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#1e293b" opacity={0.7} />
                  <XAxis
                    dataKey="timeSec"
                    stroke="#64748b"
                    tick={{ fontSize: 11 }}
                    label={{ value: 'Time (Seconds)', position: 'insideBottom', offset: -5, fill: '#64748b' }}
                  />
                  <YAxis stroke="#64748b" domain={[20, 180]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                    formatter={(val: any) => [`${val} mmHg`, 'Pressure']}
                  />
                  <ReferenceLine
                    y={iabpResult.unassistedSystolicPressureMmHg}
                    stroke="#94a3b8"
                    strokeDasharray="3 3"
                    label={{ value: 'PSP (Native)', fill: '#94a3b8', fontSize: 10, position: 'right' }}
                  />
                  <ReferenceLine
                    y={iabpResult.peakDiastolicAugmentedPressureMmHg}
                    stroke="#f43f5e"
                    strokeDasharray="3 3"
                    label={{ value: 'PDP (Augmented)', fill: '#f43f5e', fontSize: 10, position: 'right' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="pressureMmHg"
                    name="Arterial Pressure"
                    stroke="#f43f5e"
                    strokeWidth={2.5}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Visual Waveform Landmarks Guide */}
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <div>
                <strong className="text-slate-300 block mb-0.5">1. PSP (Native Systole)</strong>
                <span className="text-[11px] text-slate-400">Unassisted peak systolic ejection pressure ({iabpResult.unassistedSystolicPressureMmHg} mmHg).</span>
              </div>
              <div>
                <strong className="text-rose-400 block mb-0.5">2. PDP (Augmentation)</strong>
                <span className="text-[11px] text-slate-400">Peak diastolic pressure from helium inflation ({iabpResult.peakDiastolicAugmentedPressureMmHg} mmHg).</span>
              </div>
              <div>
                <strong className="text-sky-400 block mb-0.5">3. BAEDP (Balloon Trough)</strong>
                <span className="text-[11px] text-slate-400">Vacuum suction trough ({iabpResult.balloonAorticEndDiastolicPressureMmHg} mmHg &lt; PAEDP {iabpResult.patientAorticEndDiastolicPressureMmHg} mmHg).</span>
              </div>
              <div>
                <strong className="text-emerald-400 block mb-0.5">4. APSP (Assisted Peak)</strong>
                <span className="text-[11px] text-slate-400">Assisted systolic peak ({iabpResult.assistedSystolicPressureMmHg} mmHg &lt; PSP reflecting afterload drop).</span>
              </div>
            </div>
          </div>

          {/* Active Warnings & Contraindication Alert Banner */}
          {(iabpResult.warnings.length > 0 || iabpResult.contraindicationsDetected.length > 0) && (
            <div className="bg-rose-950/30 border border-rose-800/80 rounded-xl p-4 space-y-2">
              <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-rose-400" />
                Active Timing Errors &amp; Safety Warnings:
              </span>
              <ul className="list-disc list-inside text-xs text-rose-200/90 space-y-1">
                {iabpResult.contraindicationsDetected.map((c, idx) => (
                  <li key={`c-${idx}`} className="font-bold text-rose-300">{c}</li>
                ))}
                {iabpResult.warnings.map((w, idx) => (
                  <li key={`w-${idx}`}>{w}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
