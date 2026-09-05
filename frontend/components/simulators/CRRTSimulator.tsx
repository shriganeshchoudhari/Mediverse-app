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
  Droplets,
  Gauge,
  ShieldAlert,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  Sliders,
  TrendingDown,
  Layers,
  HeartPulse,
  Info,
  Beaker,
} from 'lucide-react';
import {
  CRRTModality,
  DilutionMode,
  AnticoagulationStrategy,
  CRRTPumpSettings,
  CRRTPatientParameters,
  calculateCRRTPressures,
  calculateKDIGODose,
  calculateRCAMetrics,
  calculateSoluteClearance,
  simulateCRRT24HourKinetics,
  CRRT_PRESETS,
} from '@/.gemini/skills/CRRTEngine';

export default function CRRTSimulator() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('septic-aki-cvvhdf');

  // CRRT Pump Settings State
  const [modality, setModality] = useState<CRRTModality>('CVVHDF');
  const [bloodFlowQb, setBloodFlowQb] = useState<number>(200);
  const [dialysateFlowQd, setDialysateFlowQd] = useState<number>(1000);
  const [replacementFlowQrep, setReplacementFlowQrep] = useState<number>(1000);
  const [dilutionMode, setDilutionMode] = useState<DilutionMode>('POST_DILUTION');
  const [netUfRate, setNetUfRate] = useState<number>(150);
  const [anticoagulation, setAnticoagulation] = useState<AnticoagulationStrategy>('REGIONAL_CITRATE');
  const [citrateDose, setCitrateDose] = useState<number>(3.0);
  const [calciumInfusion, setCalciumInfusion] = useState<number>(2.2);

  // Simulation & Patient State
  const [patientWeight, setPatientWeight] = useState<number>(82);
  const [hematocrit, setHematocrit] = useState<number>(29);
  const [filterClottingProgress, setFilterClottingProgress] = useState<number>(0.05); // 0.0 to 1.0
  const [impairedHepaticCitrate, setImpairedHepaticCitrate] = useState<boolean>(false);

  // Active chart view
  const [chartView, setChartView] = useState<'solutes' | 'hydraulics'>('solutes');

  // Load Preset
  const loadPreset = (presetId: string) => {
    const preset = CRRT_PRESETS.find(p => p.id === presetId);
    if (!preset) return;
    setSelectedPresetId(presetId);

    setModality(preset.modality);
    setDilutionMode(preset.dilutionMode);
    setAnticoagulation(preset.anticoagulation);

    if (preset.recommendedSettings.bloodFlowQbMlMin !== undefined) setBloodFlowQb(preset.recommendedSettings.bloodFlowQbMlMin);
    if (preset.recommendedSettings.dialysateFlowQdMlHr !== undefined) setDialysateFlowQd(preset.recommendedSettings.dialysateFlowQdMlHr);
    if (preset.recommendedSettings.replacementFlowQrepMlHr !== undefined) setReplacementFlowQrep(preset.recommendedSettings.replacementFlowQrepMlHr);
    if (preset.recommendedSettings.netUltrafiltrationRateMlHr !== undefined) setNetUfRate(preset.recommendedSettings.netUltrafiltrationRateMlHr);
    if (preset.recommendedSettings.citrateDoseMmolPerLBlood !== undefined) setCitrateDose(preset.recommendedSettings.citrateDoseMmolPerLBlood);
    if (preset.recommendedSettings.calciumInfusionRateMmolHr !== undefined) setCalciumInfusion(preset.recommendedSettings.calciumInfusionRateMmolHr);

    setPatientWeight(preset.patientParams.weightKg);
    setHematocrit(preset.patientParams.hematocritPct);

    if (presetId === 'filter-clotting-tmp') {
      setFilterClottingProgress(0.88);
      setImpairedHepaticCitrate(false);
    } else if (presetId === 'citrate-toxicity-lock') {
      setFilterClottingProgress(0.15);
      setImpairedHepaticCitrate(true);
    } else {
      setFilterClottingProgress(0.08);
      setImpairedHepaticCitrate(false);
    }
  };

  // Current Pump Settings Object
  const currentSettings: CRRTPumpSettings = useMemo(() => ({
    modality,
    bloodFlowQbMlMin: bloodFlowQb,
    dialysateFlowQdMlHr: modality === 'SCUF' || modality === 'CVVH' ? 0 : dialysateFlowQd,
    replacementFlowQrepMlHr: modality === 'SCUF' || modality === 'CVVHD' ? 0 : replacementFlowQrep,
    dilutionMode,
    netUltrafiltrationRateMlHr: netUfRate,
    anticoagulation,
    citrateDoseMmolPerLBlood: citrateDose,
    calciumInfusionRateMmolHr: calciumInfusion,
  }), [modality, bloodFlowQb, dialysateFlowQd, replacementFlowQrep, dilutionMode, netUfRate, anticoagulation, citrateDose, calciumInfusion]);

  // Active Patient Object
  const currentPatient: CRRTPatientParameters = useMemo(() => {
    const activePreset = CRRT_PRESETS.find(p => p.id === selectedPresetId);
    return {
      weightKg: patientWeight,
      hematocritPct: hematocrit,
      baselineBUNMgDl: activePreset?.patientParams.baselineBUNMgDl || 90,
      baselineCreatinineMgDl: activePreset?.patientParams.baselineCreatinineMgDl || 4.5,
      baselinePotassiumMeqL: activePreset?.patientParams.baselinePotassiumMeqL || 5.5,
      baselineBicarbonateMeqL: activePreset?.patientParams.baselineBicarbonateMeqL || 16,
      totalCalciumMmolL: activePreset?.patientParams.totalCalciumMmolL || 2.25,
      systemicIonizedCalciumMmolL: activePreset?.patientParams.systemicIonizedCalciumMmolL || 1.15,
      fluidOverloadLiters: activePreset?.patientParams.fluidOverloadLiters || 4.0,
    };
  }, [selectedPresetId, patientWeight, hematocrit]);

  // Hydraulic Pressures
  const pressures = useMemo(() => {
    return calculateCRRTPressures(currentSettings, filterClottingProgress);
  }, [currentSettings, filterClottingProgress]);

  // KDIGO Effluent Dosing
  const kdigoDose = useMemo(() => {
    return calculateKDIGODose(currentSettings, patientWeight, hematocrit);
  }, [currentSettings, patientWeight, hematocrit]);

  // Regional Citrate Anticoagulation (RCA) Metrics
  const rcaMetrics = useMemo(() => {
    return calculateRCAMetrics(
      currentSettings,
      currentPatient.systemicIonizedCalciumMmolL,
      currentPatient.totalCalciumMmolL,
      impairedHepaticCitrate
    );
  }, [currentSettings, currentPatient, impairedHepaticCitrate]);

  // Solute Clearance Rates
  const clearance = useMemo(() => {
    return calculateSoluteClearance(currentSettings, hematocrit);
  }, [currentSettings, hematocrit]);

  // 24-Hour Kinetics Curve
  const kineticCurve = useMemo(() => {
    return simulateCRRT24HourKinetics(currentSettings, currentPatient, 0.015);
  }, [currentSettings, currentPatient]);

  // Socratic AI Tutor Bridge
  const handleAskAI = () => {
    const activePreset = CRRT_PRESETS.find(p => p.id === selectedPresetId);
    const context = `Continuous Renal Replacement Therapy (CRRT) Consultation:
Patient Profile: ${activePreset?.patientProfile || 'ICU AKI Patient'} (${patientWeight} kg, Hct ${hematocrit}%)
Diagnosis: ${activePreset?.diagnosis || 'Severe AKI Stage 3'}
Current Modality: ${modality} (${dilutionMode})
Pump Settings:
- Blood Flow (Qb): ${bloodFlowQb} mL/min
- Dialysate Flow (Qd): ${currentSettings.dialysateFlowQdMlHr} mL/hr
- Replacement Flow (Qrep): ${currentSettings.replacementFlowQrepMlHr} mL/hr
- Net Ultrafiltration Rate: ${netUfRate} mL/hr
- Anticoagulation: ${anticoagulation} (Citrate: ${citrateDose} mmol/L, Calcium Infusion: ${calciumInfusion} mmol/h)
Hydraulic Pressures:
- Access Pressure: ${pressures.accessPressureMmHg} mmHg
- Filter Pressure Drop (ΔP): ${pressures.filterPressureDropMmHg} mmHg
- Transmembrane Pressure (TMP): ${pressures.transmembranePressureMmHg} mmHg (High TMP Alarm: ${pressures.isHighTMPAlarm ? 'YES' : 'NO'}, Filter Clotted: ${pressures.isFilterClotted ? 'YES' : 'NO'})
KDIGO Effluent Dosing:
- Total Effluent Flow: ${kdigoDose.totalEffluentFlowMlHr} mL/hr
- Prescribed Dose: ${kdigoDose.prescribedDoseMlKgHr} mL/kg/h
- Delivered Dose: ${kdigoDose.deliveredDoseMlKgHr} mL/kg/h (${kdigoDose.doseCategory})
- Filtration Fraction: ${kdigoDose.filtrationFractionPct}% (High Clotting Risk: ${kdigoDose.isFiltrationFractionHigh ? 'YES' : 'NO'})
Regional Citrate Anticoagulation:
- Circuit iCa: ${rcaMetrics.circuitIonizedCalciumMmolL} mmol/L
- Systemic iCa: ${rcaMetrics.systemicIonizedCalciumMmolL} mmol/L
- Total Ca / iCa Ratio: ${rcaMetrics.totalCalciumToIonizedCalciumRatio} (Citrate Lock: ${rcaMetrics.isCitrateAccumulationWarning ? 'CRITICAL ALERT' : 'Normal'})
Please explain the membrane transport physics, troubleshooting for these pressures, and KDIGO guideline dosing adjustments for this patient.`;

    window.dispatchEvent(new CustomEvent('mediverse:open-ai-with-context', { detail: { context } }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-slate-100">
      {/* Top Station Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-600/20 border border-sky-500/30 rounded-xl text-sky-400">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
                Continuous Renal Replacement Therapy (CRRT) Workstation
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-950/70 border border-sky-700/60 text-sky-300 font-medium">
                  KDIGO / ADQI Guidelines
                </span>
              </h1>
              <p className="text-sm text-slate-400">
                Extracorporeal blood purification, TMP hydraulics, KDIGO effluent dosing & regional citrate anticoagulation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`px-4 py-2 rounded-xl border flex items-center gap-2 font-semibold text-sm ${
                pressures.isFilterClotted || rcaMetrics.isCitrateAccumulationWarning
                  ? 'bg-rose-950/60 border-rose-600 text-rose-300 animate-pulse'
                  : pressures.isHighTMPAlarm || kdigoDose.isFiltrationFractionHigh
                  ? 'bg-amber-950/60 border-amber-600 text-amber-300'
                  : 'bg-emerald-950/60 border-emerald-600 text-emerald-300'
              }`}
            >
              {pressures.isFilterClotted ? (
                <>
                  <AlertOctagon className="w-4 h-4" />
                  <span>FILTER CLOTTED / REPLACE</span>
                </>
              ) : rcaMetrics.isCitrateAccumulationWarning ? (
                <>
                  <AlertOctagon className="w-4 h-4" />
                  <span>CITRATE LOCK (RATIO &ge; 2.5)</span>
                </>
              ) : pressures.isHighTMPAlarm ? (
                <>
                  <AlertTriangle className="w-4 h-4" />
                  <span>HIGH TMP WARNING (&gt;250)</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>CIRCUIT OPERATIONAL</span>
                </>
              )}
            </div>

            <button
              onClick={handleAskAI}
              className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 border border-sky-400/30 text-white text-sm font-semibold flex items-center gap-2 transition shadow-lg shadow-sky-600/20"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Consult Socratic AI</span>
            </button>
          </div>
        </div>

        {/* Clinical Presets Grid */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              High-Yield Critical Care AKI Presets
            </span>
            <button
              onClick={() => loadPreset('septic-aki-cvvhdf')}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {CRRT_PRESETS.map(p => (
              <button
                key={p.id}
                onClick={() => loadPreset(p.id)}
                className={`text-left p-2.5 rounded-xl border text-xs transition ${
                  selectedPresetId === p.id
                    ? 'bg-sky-950/60 border-sky-500 text-white shadow-md'
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold truncate">{p.title.split('with')[0]}</div>
                <div className="text-[11px] text-slate-400 truncate">{p.modality}</div>
                <div className="mt-1 text-[10px] text-sky-400 font-mono truncate">{p.patientProfile.split('(')[0]}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hydraulic Pressures & Safety Alarms HUD Banner */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Access Pressure */}
        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl text-center space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Access (Pacc)</span>
          <div className="text-xl font-mono font-bold text-sky-400">
            {pressures.accessPressureMmHg} <span className="text-xs font-normal text-slate-400">mmHg</span>
          </div>
          <span className="text-[10px] text-slate-500 block">Target: &gt; -200 mmHg</span>
        </div>

        {/* Filter Inlet */}
        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl text-center space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Filter Inlet (Pin)</span>
          <div className="text-xl font-mono font-bold text-white">
            {pressures.filterInletPressureMmHg} <span className="text-xs font-normal text-slate-400">mmHg</span>
          </div>
          <span className="text-[10px] text-slate-500 block">Pre-Filter Blood</span>
        </div>

        {/* Filter Return */}
        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl text-center space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Return (Pret)</span>
          <div className="text-xl font-mono font-bold text-white">
            {pressures.filterReturnPressureMmHg} <span className="text-xs font-normal text-slate-400">mmHg</span>
          </div>
          <span className="text-[10px] text-slate-500 block">Venous Return</span>
        </div>

        {/* Filter Pressure Drop */}
        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl text-center space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Filter Drop (&Delta;P)</span>
          <div
            className={`text-xl font-mono font-bold ${
              pressures.filterPressureDropMmHg > 140 ? 'text-rose-400' : 'text-emerald-400'
            }`}
          >
            {pressures.filterPressureDropMmHg} <span className="text-xs font-normal text-slate-400">mmHg</span>
          </div>
          <span className="text-[10px] text-slate-500 block">Normal: 20 - 70</span>
        </div>

        {/* Effluent Pressure */}
        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl text-center space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Effluent (Peff)</span>
          <div className="text-xl font-mono font-bold text-amber-400">
            {pressures.effluentPressureMmHg} <span className="text-xs font-normal text-slate-400">mmHg</span>
          </div>
          <span className="text-[10px] text-slate-500 block">Suction Pump</span>
        </div>

        {/* Transmembrane Pressure (TMP) */}
        <div
          className={`border p-3.5 rounded-xl text-center space-y-1 ${
            pressures.isHighTMPAlarm
              ? 'bg-rose-950/40 border-rose-600'
              : 'bg-slate-900/80 border-slate-800'
          }`}
        >
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">TMP (Transmembrane)</span>
          <div
            className={`text-xl font-mono font-bold ${
              pressures.transmembranePressureMmHg > 250 ? 'text-rose-400' : 'text-emerald-400'
            }`}
          >
            {pressures.transmembranePressureMmHg} <span className="text-xs font-normal text-slate-400">mmHg</span>
          </div>
          <span className="text-[10px] text-slate-500 block">Alarm if &gt; 250</span>
        </div>
      </div>

      {/* Main Console Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Pump Controls & Prescription */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-sky-400" />
              CRRT Modality &amp; Pump Flow Rates
            </h2>
          </div>

          {/* Modality Selector Pills */}
          <div>
            <label className="text-xs text-slate-400 block mb-1.5">Therapy Modality</label>
            <div className="grid grid-cols-4 gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              {(['CVVHDF', 'CVVHD', 'CVVH', 'SCUF'] as CRRTModality[]).map(m => (
                <button
                  key={m}
                  onClick={() => setModality(m)}
                  className={`py-1.5 rounded-lg text-xs font-bold transition ${
                    modality === m
                      ? 'bg-sky-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Blood Flow Qb */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Blood Pump Flow (Qb)</span>
              <span className="font-mono text-sky-400 font-bold">{bloodFlowQb} mL/min</span>
            </div>
            <input
              type="range"
              min={100}
              max={300}
              step={10}
              value={bloodFlowQb}
              onChange={e => setBloodFlowQb(+e.target.value)}
              className="w-full accent-sky-500"
            />
          </div>

          {/* Dialysate Flow Qd */}
          <div className={`space-y-1.5 text-xs ${modality === 'SCUF' || modality === 'CVVH' ? 'opacity-40 pointer-events-none' : ''}`}>
            <div className="flex justify-between text-slate-300">
              <span>Dialysate Flow (Qd - Diffusion)</span>
              <span className="font-mono text-emerald-400 font-bold">
                {modality === 'SCUF' || modality === 'CVVH' ? 0 : dialysateFlowQd} mL/hr
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={3000}
              step={100}
              value={dialysateFlowQd}
              onChange={e => setDialysateFlowQd(+e.target.value)}
              className="w-full accent-emerald-500"
            />
          </div>

          {/* Replacement Flow Qrep */}
          <div className={`space-y-1.5 text-xs ${modality === 'SCUF' || modality === 'CVVHD' ? 'opacity-40 pointer-events-none' : ''}`}>
            <div className="flex justify-between text-slate-300">
              <span>Replacement Fluid (Qrep - Convection)</span>
              <span className="font-mono text-violet-400 font-bold">
                {modality === 'SCUF' || modality === 'CVVHD' ? 0 : replacementFlowQrep} mL/hr
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={3000}
              step={100}
              value={replacementFlowQrep}
              onChange={e => setReplacementFlowQrep(+e.target.value)}
              className="w-full accent-violet-500"
            />
            {/* Pre vs Post Dilution Toggle */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] text-slate-400">Dilution Site:</span>
              <button
                onClick={() => setDilutionMode('PRE_DILUTION')}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                  dilutionMode === 'PRE_DILUTION'
                    ? 'bg-violet-950 border-violet-500 text-violet-200'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                Pre-Dilution (Filter Life)
              </button>
              <button
                onClick={() => setDilutionMode('POST_DILUTION')}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                  dilutionMode === 'POST_DILUTION'
                    ? 'bg-violet-950 border-violet-500 text-violet-200'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                Post-Dilution (Max Clearance)
              </button>
            </div>
          </div>

          {/* Net Ultrafiltration Rate */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Patient Net Fluid Removal (Net UF)</span>
              <span className="font-mono text-amber-400 font-bold">{netUfRate} mL/hr</span>
            </div>
            <input
              type="range"
              min={0}
              max={500}
              step={25}
              value={netUfRate}
              onChange={e => setNetUfRate(+e.target.value)}
              className="w-full accent-amber-500"
            />
            <div className="text-[10px] text-slate-400 flex justify-between">
              <span>24-Hour Projected Volume:</span>
              <span className="font-mono text-white">{(netUfRate * 24) / 1000} L / day</span>
            </div>
          </div>

          {/* Simulated Membrane Fouling Slider */}
          <div className="pt-3 border-t border-slate-800 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Filter Wear / Clotting Simulation</span>
              <span className="font-mono text-rose-400 font-bold">{Math.round(filterClottingProgress * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={filterClottingProgress}
              onChange={e => setFilterClottingProgress(+e.target.value)}
              className="w-full accent-rose-500"
            />
          </div>
        </div>

        {/* Center & Right Columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* KDIGO Effluent Dosing & RCA Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* KDIGO Clearance Dosing Box */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  KDIGO Effluent Clearance
                </span>
                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                    kdigoDose.doseCategory === 'KDIGO_TARGET'
                      ? 'bg-emerald-950 border border-emerald-600 text-emerald-300'
                      : kdigoDose.doseCategory === 'SUBTHERAPEUTIC'
                      ? 'bg-rose-950 border border-rose-600 text-rose-300'
                      : 'bg-amber-950 border border-amber-600 text-amber-300'
                  }`}
                >
                  {kdigoDose.doseCategory.replace('_', ' ')}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center py-1">
                <div className="bg-slate-950/70 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Total Effluent</span>
                  <span className="text-base font-bold font-mono text-white">{kdigoDose.totalEffluentFlowMlHr}</span>
                  <span className="text-[9px] text-slate-500 block">mL/hr</span>
                </div>
                <div className="bg-slate-950/70 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Prescribed</span>
                  <span className="text-base font-bold font-mono text-sky-400">{kdigoDose.prescribedDoseMlKgHr}</span>
                  <span className="text-[9px] text-slate-500 block">mL/kg/h</span>
                </div>
                <div className="bg-slate-950/70 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Delivered (88%)</span>
                  <span className="text-base font-bold font-mono text-emerald-400">{kdigoDose.deliveredDoseMlKgHr}</span>
                  <span className="text-[9px] text-slate-500 block">mL/kg/h</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300">
                <p className="leading-relaxed">{kdigoDose.doseGuidance}</p>
                <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span>Filtration Fraction (FF):</span>
                  <span
                    className={`font-mono font-bold ${
                      kdigoDose.isFiltrationFractionHigh ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {kdigoDose.filtrationFractionPct}% {kdigoDose.isFiltrationFractionHigh && '(High Clot Risk)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Regional Citrate Anticoagulation (RCA) Protocol */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Beaker className="w-4 h-4 text-violet-400" />
                  Citrate Anticoagulation (RCA)
                </span>
                <select
                  value={anticoagulation}
                  onChange={e => setAnticoagulation(e.target.value as any)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-0.5 text-xs text-slate-200"
                >
                  <option value="REGIONAL_CITRATE">Regional Citrate (RCA)</option>
                  <option value="HEPARIN">Systemic Heparin</option>
                  <option value="NONE">None (Bleed Risk)</option>
                </select>
              </div>

              {anticoagulation === 'REGIONAL_CITRATE' ? (
                <>
                  <div className="grid grid-cols-3 gap-2 text-center py-1">
                    <div className="bg-slate-950/70 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-400 block">Circuit iCa</span>
                      <span
                        className={`text-base font-bold font-mono ${
                          rcaMetrics.circuitIonizedCalciumMmolL <= 0.35 ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {rcaMetrics.circuitIonizedCalciumMmolL}
                      </span>
                      <span className="text-[9px] text-slate-500 block">Target &le; 0.35</span>
                    </div>
                    <div className="bg-slate-950/70 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-400 block">Systemic iCa</span>
                      <span className="text-base font-bold font-mono text-sky-400">{rcaMetrics.systemicIonizedCalciumMmolL}</span>
                      <span className="text-[9px] text-slate-500 block">1.10 - 1.30</span>
                    </div>
                    <div className="bg-slate-950/70 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-400 block">Total Ca / iCa</span>
                      <span
                        className={`text-base font-bold font-mono ${
                          rcaMetrics.isCitrateAccumulationWarning ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        {rcaMetrics.totalCalciumToIonizedCalciumRatio}
                      </span>
                      <span className="text-[9px] text-slate-500 block">Lock if &ge; 2.5</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs space-y-2">
                    <p
                      className={`leading-relaxed text-[11px] ${
                        rcaMetrics.isCitrateAccumulationWarning ? 'text-rose-300 font-semibold' : 'text-slate-300'
                      }`}
                    >
                      {rcaMetrics.clinicalStatus}
                    </p>

                    <label className="flex items-center gap-2 cursor-pointer pt-1 border-t border-slate-800/60">
                      <input
                        type="checkbox"
                        checked={impairedHepaticCitrate}
                        onChange={e => setImpairedHepaticCitrate(e.target.checked)}
                        className="w-3.5 h-3.5 rounded bg-slate-800 border-slate-700 text-sky-600"
                      />
                      <span className="text-[11px] text-slate-300">
                        Simulate Hepatic Failure / Citrate Lock (Ratio &ge; 2.5)
                      </span>
                    </label>
                  </div>
                </>
              ) : (
                <div className="p-6 bg-slate-950/40 border border-slate-800 rounded-xl text-center text-xs text-slate-400">
                  {anticoagulation === 'HEPARIN' ? (
                    <span>Systemic Heparin active: Monitor circuit activated clotting time (ACT 180-220s) or anti-Xa levels.</span>
                  ) : (
                    <span>No anticoagulation: High circuit clotting risk. Maintain high blood flow and consider pre-dilution.</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 24-Hour Solute & Hydraulic Trends (Recharts) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-sky-400" />
                  24-Hour Dynamic Kinetic Simulation
                </h3>
                <p className="text-xs text-slate-400">
                  Urea clearance: {clearance.ureaClearanceMlMin} mL/min | Potassium clearance: {clearance.potassiumClearanceMlMin} mL/min | Bicarbonate flux: {clearance.bicarbonateDeliveryMmolHr} mmol/h
                </p>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setChartView('solutes')}
                  className={`px-3 py-1 rounded-lg font-semibold transition ${
                    chartView === 'solutes' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  BUN, K+, HCO3-
                </button>
                <button
                  onClick={() => setChartView('hydraulics')}
                  className={`px-3 py-1 rounded-lg font-semibold transition ${
                    chartView === 'hydraulics' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Fluid Balance &amp; TMP
                </button>
              </div>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                {chartView === 'solutes' ? (
                  <LineChart data={kineticCurve} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="hour" stroke="#94a3b8" tick={{ fontSize: 12 }} label={{ value: 'Hours of CRRT', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} label={{ value: 'Concentration', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                      formatter={(val: any, name: any) => [val, name]}
                      labelFormatter={(h) => `Hour ${h}`}
                    />
                    <ReferenceLine y={4.0} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'Target K+ (4.0 mEq/L)', fill: '#10b981', fontSize: 10, position: 'right' }} />
                    <ReferenceLine y={24} stroke="#38bdf8" strokeDasharray="3 3" label={{ value: 'Target HCO3- (24 mEq/L)', fill: '#38bdf8', fontSize: 10, position: 'right' }} />
                    <Line type="monotone" dataKey="bunMgDl" name="BUN (mg/dL)" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 2 }} />
                    <Line type="monotone" dataKey="potassiumMeqL" name="Potassium (mEq/L)" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 2 }} />
                    <Line type="monotone" dataKey="bicarbonateMeqL" name="Bicarbonate (mEq/L)" stroke="#38bdf8" strokeWidth={2.5} dot={{ r: 2 }} />
                  </LineChart>
                ) : (
                  <LineChart data={kineticCurve} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="hour" stroke="#94a3b8" tick={{ fontSize: 12 }} label={{ value: 'Hours of CRRT', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} />
                    <YAxis yAxisId="left" stroke="#94a3b8" tick={{ fontSize: 12 }} label={{ value: 'Net Fluid Removed (mL)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                    <YAxis yAxisId="right" orientation="right" stroke="#f43f5e" tick={{ fontSize: 12 }} label={{ value: 'TMP (mmHg)', angle: 90, position: 'insideRight', fill: '#f43f5e' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                      labelFormatter={(h) => `Hour ${h}`}
                    />
                    <ReferenceLine yAxisId="right" y={250} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'High TMP (250 mmHg)', fill: '#ef4444', fontSize: 10, position: 'left' }} />
                    <Line yAxisId="left" type="monotone" dataKey="cumulativeNetFluidRemovedMl" name="Net Fluid Removed (mL)" stroke="#38bdf8" strokeWidth={3} dot={{ r: 2 }} />
                    <Line yAxisId="right" type="monotone" dataKey="transmembranePressureMmHg" name="TMP (mmHg)" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 2 }} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
