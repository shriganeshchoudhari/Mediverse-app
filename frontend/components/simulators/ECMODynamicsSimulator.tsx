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
  Legend,
} from 'recharts';
import {
  Activity,
  Wind,
  ShieldAlert,
  AlertTriangle,
  AlertOctagon,
  Sparkles,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Droplets,
  Heart,
  Gauge,
  Layers,
  Thermometer,
} from 'lucide-react';
import {
  ECMOConfiguration,
  ECMOPumpSettings,
  PatientState,
  calculateECMODynamics,
  generateECMOTrends,
  ECMO_PRESETS,
} from '@/.gemini/skills/ECMODynamicsEngine';

export default function ECMODynamicsSimulator() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('vv-severe-ards-optimal');

  // ECMO Pump Settings
  const [configuration, setConfiguration] = useState<ECMOConfiguration>('VV_ECMO');
  const [bloodFlowLpm, setBloodFlowLpm] = useState<number>(4.8);
  const [sweepGasFlowLpm, setSweepGasFlowLpm] = useState<number>(5.5);
  const [oxygenatorFiO2, setOxygenatorFiO2] = useState<number>(1.0);
  const [drainageCannulaFr, setDrainageCannulaFr] = useState<number>(25);
  const [reinfusionCannulaFr, setReinfusionCannulaFr] = useState<number>(21);
  const [cannulaDistanceCm, setCannulaDistanceCm] = useState<number>(18);
  const [membraneThrombosisPcnt, setMembraneThrombosisPcnt] = useState<number>(0);
  const [lvVentActive, setLvVentActive] = useState<boolean>(false);

  // Patient Hemodynamics & Lungs
  const [nativeCO, setNativeCO] = useState<number>(6.2);
  const [pulmonaryShunt, setPulmonaryShunt] = useState<number>(70);
  const [nativePfRatio, setNativePfRatio] = useState<number>(65);
  const [cvpMmHg, setCvpMmHg] = useState<number>(12);
  const [mapMmHg, setMapMmHg] = useState<number>(76);

  // Compile Pump and Patient Objects
  const currentPump: ECMOPumpSettings = useMemo(
    () => ({
      configuration,
      bloodFlowLpm,
      sweepGasFlowLpm,
      oxygenatorFiO2,
      drainageCannulaFr,
      reinfusionCannulaFr,
      cannulaTipDistanceCm: cannulaDistanceCm,
      membraneThrombosisPcnt,
      lvVentActive,
    }),
    [
      configuration,
      bloodFlowLpm,
      sweepGasFlowLpm,
      oxygenatorFiO2,
      drainageCannulaFr,
      reinfusionCannulaFr,
      cannulaDistanceCm,
      membraneThrombosisPcnt,
      lvVentActive,
    ]
  );

  const currentPatient: PatientState = useMemo(
    () => ({
      weightKg: 78,
      nativeCardiacOutputLpm: nativeCO,
      nativePulmonaryShuntPcnt: pulmonaryShunt,
      nativePaO2FiO2Ratio: nativePfRatio,
      metabolicVo2MlMin: 260,
      metabolicVco2MlMin: 210,
      hemoglobinGdl: 10.5,
      centralVenousPressureMmHg: cvpMmHg,
      meanArterialPressureMmHg: mapMmHg,
    }),
    [nativeCO, pulmonaryShunt, nativePfRatio, cvpMmHg, mapMmHg]
  );

  // Calculate Dynamics & Trends
  const ecmoResult = useMemo(
    () => calculateECMODynamics(currentPump, currentPatient),
    [currentPump, currentPatient]
  );

  const trendData = useMemo(
    () => generateECMOTrends(currentPump, currentPatient, ecmoResult),
    [currentPump, currentPatient, ecmoResult]
  );

  // Load Preset
  const loadPreset = (presetId: string) => {
    const preset = ECMO_PRESETS.find(p => p.id === presetId);
    if (!preset) return;
    setSelectedPresetId(presetId);

    setConfiguration(preset.pumpSettings.configuration);
    setBloodFlowLpm(preset.pumpSettings.bloodFlowLpm);
    setSweepGasFlowLpm(preset.pumpSettings.sweepGasFlowLpm);
    setOxygenatorFiO2(preset.pumpSettings.oxygenatorFiO2);
    setDrainageCannulaFr(preset.pumpSettings.drainageCannulaFr);
    setReinfusionCannulaFr(preset.pumpSettings.reinfusionCannulaFr);
    setCannulaDistanceCm(preset.pumpSettings.cannulaTipDistanceCm);
    setMembraneThrombosisPcnt(preset.pumpSettings.membraneThrombosisPcnt);
    setLvVentActive(preset.pumpSettings.lvVentActive);

    setNativeCO(preset.patientState.nativeCardiacOutputLpm);
    setPulmonaryShunt(preset.patientState.nativePulmonaryShuntPcnt);
    setNativePfRatio(preset.patientState.nativePaO2FiO2Ratio);
    setCvpMmHg(preset.patientState.centralVenousPressureMmHg);
    setMapMmHg(preset.patientState.meanArterialPressureMmHg);
  };

  // Socratic AI Context Bridge
  const handleConsultAI = () => {
    const context = `Extracorporeal Membrane Oxygenation (ECMO) Workstation:
Configuration: ${configuration} | Blood Flow: ${bloodFlowLpm} L/min | Sweep Gas: ${sweepGasFlowLpm} L/min | FiO2: ${Math.round(oxygenatorFiO2 * 100)}%
Alarm Status: ${ecmoResult.alarmStatus} | Recirculation: ${ecmoResult.recirculationFractionPcnt}%
Circuit Pressures: P_drainage = ${ecmoResult.drainagePressureMmHg} mmHg | P_pre = ${ecmoResult.preMembranePressureMmHg} mmHg | P_post = ${ecmoResult.postMembranePressureMmHg} mmHg | Delta P = ${ecmoResult.transmembranePressureMmHg} mmHg
Blood Gases: Systemic SaO2 = ${ecmoResult.systemicSaO2Pcnt}% | PaO2 = ${ecmoResult.systemicPaO2MmHg} mmHg | PaCO2 = ${ecmoResult.systemicPaCO2MmHg} mmHg | pH = ${ecmoResult.systemicPh} | Lactate = ${ecmoResult.arterialLactateMmolL} mmol/L
Dual Circulation (Harlequin): Active = ${ecmoResult.isHarlequinActive} (Upper Body PaO2 ${ecmoResult.upperBodyPaO2MmHg} mmHg vs Lower Body PaO2 ${ecmoResult.lowerBodyPaO2MmHg} mmHg)
LV Loading: LVEDP = ${ecmoResult.leftVentricularEndDiastolicPressureMmHg} mmHg | Severe Distention = ${ecmoResult.isLVDistentionSevere} | Venting (ECPELLA) = ${lvVentActive}
Active Warnings: ${ecmoResult.warnings.join('; ') || 'None'}`;

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
            <div className="p-2.5 bg-sky-600/20 border border-sky-500/30 rounded-xl text-sky-400">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
                Extracorporeal Membrane Oxygenation (ECMO) Workstation
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-950/70 border border-sky-700/60 text-sky-300 font-medium">
                  ELSO Guidelines Console
                </span>
              </h1>
              <p className="text-sm text-slate-400">
                VV &amp; VA cannulation mechanics, recirculation fraction, sweep gas CO2 clearance, Harlequin dual-circulation &amp; ECPELLA.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Status Alert Badge */}
            {ecmoResult.alarmStatus === 'CANNULA_CHATTERING_SUCTION' ? (
              <div className="px-4 py-2 rounded-xl border flex items-center gap-2 font-semibold text-sm bg-rose-950/80 border-rose-600 text-rose-200 animate-pulse">
                <AlertOctagon className="w-4 h-4 text-rose-400" />
                <span>CANNULA CHATTERING (SUCTION)</span>
              </div>
            ) : ecmoResult.alarmStatus === 'MEMBRANE_LUNG_THROMBOSIS' ? (
              <div className="px-4 py-2 rounded-xl border flex items-center gap-2 font-semibold text-sm bg-rose-950/80 border-rose-600 text-rose-200 animate-pulse">
                <AlertOctagon className="w-4 h-4 text-rose-400" />
                <span>OXYGENATOR THROMBOSIS (HIGH &Delta;P)</span>
              </div>
            ) : ecmoResult.alarmStatus === 'HARLEQUIN_SYNDROME' ? (
              <div className="px-4 py-2 rounded-xl border flex items-center gap-2 font-semibold text-sm bg-purple-950/80 border-purple-600 text-purple-200 animate-pulse">
                <AlertTriangle className="w-4 h-4 text-purple-400" />
                <span>HARLEQUIN SYNDROME ACTIVE</span>
              </div>
            ) : ecmoResult.alarmStatus === 'LV_DISTENTION_PULMONARY_EDEMA' ? (
              <div className="px-4 py-2 rounded-xl border flex items-center gap-2 font-semibold text-sm bg-rose-950/80 border-rose-600 text-rose-200 animate-pulse">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>SEVERE LV DISTENTION (VENT NEEDED)</span>
              </div>
            ) : ecmoResult.alarmStatus === 'HIGH_RECIRCULATION' ? (
              <div className="px-4 py-2 rounded-xl border flex items-center gap-2 font-semibold text-sm bg-amber-950/80 border-amber-600 text-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>HIGH RECIRCULATION (&gt;35%)</span>
              </div>
            ) : (
              <div className="px-4 py-2 rounded-xl border flex items-center gap-2 font-semibold text-sm bg-emerald-950/60 border-emerald-600 text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>CIRCUIT DYNAMICS OPTIMAL</span>
              </div>
            )}

            <button
              onClick={handleConsultAI}
              className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 border border-sky-400/30 text-white text-sm font-semibold flex items-center gap-2 transition shadow-lg shadow-sky-600/20"
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
              High-Yield Clinical ECMO Presets
            </span>
            <button
              onClick={() => loadPreset('vv-severe-ards-optimal')}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3 h-3" /> Reset Default
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {ECMO_PRESETS.map(p => (
              <button
                key={p.id}
                onClick={() => loadPreset(p.id)}
                className={`text-left p-2.5 rounded-xl border text-xs transition ${
                  selectedPresetId === p.id
                    ? 'bg-sky-950/60 border-sky-500 text-white shadow-md'
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold truncate">{p.title.split('(')[0]}</div>
                <div className="text-[11px] text-sky-400 truncate font-mono">{p.pumpSettings.configuration.replace('_', ' ')}</div>
                <div className="mt-1 text-[10px] text-slate-400 truncate">{p.clinicalScenario.split(';')[0]}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Clinical & Circuit HUD */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Systemic Oxygenation */}
        <div
          className={`border p-3.5 rounded-xl text-center space-y-1 ${
            ecmoResult.systemicSaO2Pcnt < 88 ? 'bg-rose-950/40 border-rose-600' : 'bg-slate-900/80 border-slate-800'
          }`}
        >
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Systemic SaO2</span>
          <div
            className={`text-2xl font-mono font-black ${
              ecmoResult.systemicSaO2Pcnt < 88 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'
            }`}
          >
            {ecmoResult.systemicSaO2Pcnt}%
          </div>
          <span className="text-[10px] text-slate-500 block">
            PaO2: {ecmoResult.systemicPaO2MmHg} mmHg
          </span>
        </div>

        {/* Systemic Ventilation (PaCO2 & pH) */}
        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl text-center space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">PaCO2 &amp; Arterial pH</span>
          <div className="text-2xl font-mono font-black text-sky-400">
            {ecmoResult.systemicPaCO2MmHg} <span className="text-xs font-normal text-slate-400">mmHg</span>
          </div>
          <span className="text-[10px] text-slate-500 block">pH: {ecmoResult.systemicPh}</span>
        </div>

        {/* Circuit Blood Flow */}
        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl text-center space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Circuit Blood Flow</span>
          <div className="text-2xl font-mono font-black text-amber-400">
            {bloodFlowLpm.toFixed(1)} <span className="text-xs font-normal text-slate-400">L/min</span>
          </div>
          <span className="text-[10px] text-slate-500 block">
            Effective: {ecmoResult.effectiveECMOFlowLpm} L/min
          </span>
        </div>

        {/* Drainage Suction Pressure */}
        <div
          className={`border p-3.5 rounded-xl text-center space-y-1 ${
            ecmoResult.drainagePressureMmHg < -200 ? 'bg-rose-950/40 border-rose-600' : 'bg-slate-900/80 border-slate-800'
          }`}
        >
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Drainage Pressure</span>
          <div
            className={`text-2xl font-mono font-black ${
              ecmoResult.drainagePressureMmHg < -200 ? 'text-rose-400 animate-pulse' : 'text-slate-200'
            }`}
          >
            {ecmoResult.drainagePressureMmHg} <span className="text-xs font-normal text-slate-400">mmHg</span>
          </div>
          <span className="text-[10px] text-slate-500 block">Target &gt; -150 mmHg</span>
        </div>

        {/* Transmembrane Pressure (Delta P) */}
        <div
          className={`border p-3.5 rounded-xl text-center space-y-1 ${
            ecmoResult.transmembranePressureMmHg > 60 ? 'bg-rose-950/40 border-rose-600' : 'bg-slate-900/80 border-slate-800'
          }`}
        >
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Transmembrane &Delta;P</span>
          <div
            className={`text-2xl font-mono font-black ${
              ecmoResult.transmembranePressureMmHg > 60 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'
            }`}
          >
            {ecmoResult.transmembranePressureMmHg} <span className="text-xs font-normal text-slate-400">mmHg</span>
          </div>
          <span className="text-[10px] text-slate-500 block">Normal: 15 - 45 mmHg</span>
        </div>

        {/* Recirculation Fraction (Rf) */}
        <div
          className={`border p-3.5 rounded-xl text-center space-y-1 ${
            ecmoResult.recirculationFractionPcnt > 30 ? 'bg-amber-950/40 border-amber-600' : 'bg-slate-900/80 border-slate-800'
          }`}
        >
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Recirculation (Rf)</span>
          <div
            className={`text-2xl font-mono font-black ${
              ecmoResult.recirculationFractionPcnt > 30 ? 'text-amber-400' : 'text-purple-400'
            }`}
          >
            {ecmoResult.recirculationFractionPcnt}%
          </div>
          <span className="text-[10px] text-slate-500 block">
            Distance: {cannulaDistanceCm} cm
          </span>
        </div>
      </div>

      {/* Main Console Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Circuit Controls */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-xl">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-sky-400" />
            Extracorporeal Console Dials
          </h2>

          {/* Cannulation Configuration Tabs */}
          <div className="space-y-1.5">
            <span className="text-xs text-slate-400 font-semibold block">ECMO Cannulation Modality</span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'VV_ECMO', label: 'VV ECMO (Respiratory)' },
                { id: 'VA_FEMORAL', label: 'VA Femoral (Peripheral)' },
                { id: 'VA_CENTRAL', label: 'VA Central (Post-Cardiotomy)' },
                { id: 'V_AV_HYBRID', label: 'V-AV Hybrid (Triple Cannula)' },
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setConfiguration(m.id as any)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold text-left transition ${
                    configuration === m.id
                      ? 'bg-sky-600 text-white shadow-md'
                      : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Blood Flow Pump Dial */}
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-300">
              <span className="font-semibold text-amber-300">Blood Flow (Pump Output)</span>
              <span className="font-mono text-amber-400 font-bold">{bloodFlowLpm.toFixed(1)} L/min</span>
            </div>
            <input
              type="range"
              min={1.0}
              max={7.0}
              step={0.1}
              value={bloodFlowLpm}
              onChange={e => setBloodFlowLpm(+e.target.value)}
              className="w-full accent-amber-500"
            />
            <span className="text-[10px] text-slate-500 block">
              Targets ~50-80 mL/kg/min for complete respiratory support.
            </span>
          </div>

          {/* Sweep Gas Flow Dial */}
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-300">
              <span className="font-semibold text-sky-300">Sweep Gas Flow (CO2 Clearance)</span>
              <span className="font-mono text-sky-400 font-bold">{sweepGasFlowLpm.toFixed(1)} L/min</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={15.0}
              step={0.5}
              value={sweepGasFlowLpm}
              onChange={e => setSweepGasFlowLpm(+e.target.value)}
              className="w-full accent-sky-500"
            />
            <span className="text-[10px] text-slate-500 block">
              Higher sweep washes out CO2, lowering PaCO2 and raising pH.
            </span>
          </div>

          {/* Oxygenator FiO2 */}
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-300">
              <span className="font-semibold text-emerald-300">Oxygenator FiO2</span>
              <span className="font-mono text-emerald-400 font-bold">{Math.round(oxygenatorFiO2 * 100)}%</span>
            </div>
            <input
              type="range"
              min={0.21}
              max={1.0}
              step={0.05}
              value={oxygenatorFiO2}
              onChange={e => setOxygenatorFiO2(+e.target.value)}
              className="w-full accent-emerald-500"
            />
          </div>

          {/* Cannula Sizing & Separation */}
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2.5 text-xs">
            <span className="text-[10px] font-bold text-purple-400 uppercase block">Cannula Sizing &amp; Geometry</span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[11px] text-slate-400 block mb-1">Drainage Cannula</span>
                <select
                  value={drainageCannulaFr}
                  onChange={e => setDrainageCannulaFr(+e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 text-xs"
                >
                  <option value={19}>19 Fr</option>
                  <option value={21}>21 Fr</option>
                  <option value={23}>23 Fr</option>
                  <option value={25}>25 Fr (Standard)</option>
                  <option value={29}>29 Fr (Dual-Lumen)</option>
                </select>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block mb-1">Cannula Distance</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="range"
                    min={5}
                    max={25}
                    step={1}
                    value={cannulaDistanceCm}
                    onChange={e => setCannulaDistanceCm(+e.target.value)}
                    className="w-full accent-purple-500"
                  />
                  <span className="font-mono text-purple-400 text-xs">{cannulaDistanceCm}cm</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stress & Complication Toggles */}
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Complications &amp; Interventions
            </span>
            <div className="space-y-2">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-300">Oxygenator Clotting (Delta P surge)</span>
                <input
                  type="checkbox"
                  checked={membraneThrombosisPcnt > 30}
                  onChange={e => setMembraneThrombosisPcnt(e.target.checked ? 75 : 0)}
                  className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-rose-500"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-300">Impella LV Unloading (ECPELLA)</span>
                <input
                  type="checkbox"
                  checked={lvVentActive}
                  onChange={e => setLvVentActive(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-sky-500"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Columns: Dual Circulation Monitor & 24-Hour Trends */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dual Circulation / Harlequin Syndrome Monitor */}
          {configuration === 'VA_FEMORAL' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Heart className="w-4 h-4 text-purple-400" />
                  Dual Circulation Assessment (Harlequin / North-South Syndrome)
                </h3>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                    ecmoResult.isHarlequinActive
                      ? 'bg-rose-950/60 border-rose-600 text-rose-300 animate-pulse'
                      : 'bg-emerald-950/60 border-emerald-600 text-emerald-300'
                  }`}
                >
                  {ecmoResult.isHarlequinActive ? 'Differential Hypoxemia Active' : 'Symmetric Perfusion'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Upper Body (Right Radial) */}
                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Upper Body (Right Radial Art Line)
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`text-2xl font-mono font-black ${
                        ecmoResult.upperBodySaO2Pcnt < 88 ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {ecmoResult.upperBodySaO2Pcnt}%
                    </span>
                    <span className="text-xs text-slate-400 font-mono">PaO2: {ecmoResult.upperBodyPaO2MmHg} mmHg</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    Perfuses Brain &amp; Coronaries (Native LV Output)
                  </span>
                </div>

                {/* Lower Body (Femoral) */}
                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Lower Body (Femoral Art Line)
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-mono font-black text-emerald-400">
                      {ecmoResult.lowerBodySaO2Pcnt}%
                    </span>
                    <span className="text-xs text-slate-400 font-mono">PaO2: {ecmoResult.lowerBodyPaO2MmHg} mmHg</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    Perfuses Renal/Iliac Organs (Retrograde ECMO)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 24-Hour Trend Graph */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-sky-400" />
                  24-Hour Extracorporeal Recovery &amp; Blood Gas Trends
                </h3>
                <p className="text-xs text-slate-400">
                  Simulated multi-hour kinetics for PaO2, PaCO2, arterial lactate, and circuit &Delta;P.
                </p>
              </div>
            </div>

            <div className="h-72 w-full pt-4 bg-slate-950/90 rounded-xl p-2 border border-slate-800">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#1e293b" opacity={0.7} />
                  <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 11 }} label={{ value: 'Hours on ECMO', position: 'insideBottom', offset: -5, fill: '#64748b' }} />
                  <YAxis stroke="#64748b" domain={[0, 150]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="paO2" name="PaO2 (mmHg)" stroke="#38bdf8" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="paCO2" name="PaCO2 (mmHg)" stroke="#a855f7" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="lactate" name="Lactate (mmol/L)" stroke="#f43f5e" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="deltaP" name="Delta P (mmHg)" stroke="#fbbf24" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Circuit Landmarks Explanation */}
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300 grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
              <div>
                <strong className="text-sky-300 block mb-0.5">Sweep Gas &rarr; CO2</strong>
                <span className="text-[11px] text-slate-400">Diffusion across hollow fiber membrane clears CO2 independent of blood flow.</span>
              </div>
              <div>
                <strong className="text-amber-300 block mb-0.5">Blood Flow &rarr; O2</strong>
                <span className="text-[11px] text-slate-400">Systemic PaO2 depends on ECMO flow to cardiac output ratio.</span>
              </div>
              <div>
                <strong className="text-rose-300 block mb-0.5">&Delta;P &rarr; Clotting</strong>
                <span className="text-[11px] text-slate-400">P_pre - P_post &gt; 50 mmHg confirms membrane lung thrombosis requiring changeout.</span>
              </div>
            </div>
          </div>

          {/* Active Warnings Banner */}
          {ecmoResult.warnings.length > 0 && (
            <div className="bg-rose-950/30 border border-rose-800/80 rounded-xl p-4 space-y-2">
              <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-rose-400" />
                Active Clinical Alarms &amp; Troubleshooting Guidance:
              </span>
              <ul className="list-disc list-inside text-xs text-rose-200/90 space-y-1">
                {ecmoResult.warnings.map((w, idx) => (
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
