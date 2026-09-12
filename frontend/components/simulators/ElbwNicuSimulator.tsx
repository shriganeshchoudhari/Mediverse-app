'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Baby,
  Activity,
  Heart,
  Droplets,
  Thermometer,
  Wind,
  Zap,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  RotateCcw,
  FileText,
  Sparkles,
  Clock,
  Stethoscope,
  Pill,
  X,
  Gauge,
  Compass,
} from 'lucide-react';
import {
  NicuScenarioPresetId,
  ELBW_NICU_SCENARIOS,
  ElbwPatientState,
  PdaTreatmentDrug,
  NicuDebriefResult,
  initializeElbwPatientState,
  adjustIsoletteSettings,
  titrateTpnSettings,
  deliverSurfactant,
  adjustVentilatorSettings,
  treatPatentDuctusArteriosus,
  deliverInhaledNitricOxide,
  advanceNicuTimeStep,
  evaluateNicuDebrief,
} from '../../.gemini/skills/ElbwNicuResuscitationEngine';

export default function ElbwNicuSimulator() {
  const [selectedScenarioId, setSelectedScenarioId] =
    useState<NicuScenarioPresetId>('ELBW_24WK_620G_HYPERNATREMIC_DEHYDRATION');
  const [patientState, setPatientState] = useState<ElbwPatientState>(() =>
    initializeElbwPatientState('ELBW_24WK_620G_HYPERNATREMIC_DEHYDRATION')
  );
  const [statusMessage, setStatusMessage] = useState<string>(
    '24-week ELBW micro-premie admitted. Optimize incubator humidity, calculate GIR, evaluate ductal shunt, and support respiratory mechanics.'
  );
  const [showDebriefModal, setShowDebriefModal] = useState<boolean>(false);
  const [debriefResult, setDebriefResult] = useState<NicuDebriefResult | null>(null);

  const scenario = useMemo(
    () => ELBW_NICU_SCENARIOS[selectedScenarioId],
    [selectedScenarioId]
  );

  // Auto-advance simulation time step
  useEffect(() => {
    const interval = setInterval(() => {
      setPatientState((prev) => advanceNicuTimeStep(prev, 1));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectScenario = useCallback((id: NicuScenarioPresetId) => {
    setSelectedScenarioId(id);
    const newState = initializeElbwPatientState(id);
    setPatientState(newState);
    setShowDebriefModal(false);
    setDebriefResult(null);
    setStatusMessage(`Loaded Scenario: ${ELBW_NICU_SCENARIOS[id].title}`);
  }, []);

  const handleReset = useCallback(() => {
    handleSelectScenario(selectedScenarioId);
  }, [handleSelectScenario, selectedScenarioId]);

  // Actions
  const handleAdjustHumidity = useCallback(
    (humidity: number) => {
      const { updatedState, message } = adjustIsoletteSettings(
        patientState,
        humidity,
        patientState.isolette.incubatorAirTempC
      );
      setPatientState(updatedState);
      setStatusMessage(message);
    },
    [patientState]
  );

  const handleTitrateTpn = useCallback(
    (dextrose: number, rate: number) => {
      const { updatedState, message } = titrateTpnSettings(
        patientState,
        dextrose,
        rate
      );
      setPatientState(updatedState);
      setStatusMessage(message);
    },
    [patientState]
  );

  const handleDeliverSurfactant = useCallback(() => {
    const { updatedState, success, message } = deliverSurfactant(patientState, 200);
    setPatientState(updatedState);
    setStatusMessage(message);
  }, [patientState]);

  const handleWeanVentilator = useCallback(
    (pip: number, fio2: number) => {
      const { updatedState, message } = adjustVentilatorSettings(
        patientState,
        pip,
        fio2
      );
      setPatientState(updatedState);
      setStatusMessage(message);
    },
    [patientState]
  );

  const handleTreatPda = useCallback(
    (drug: PdaTreatmentDrug) => {
      const { updatedState, success, message } = treatPatentDuctusArteriosus(patientState, drug);
      setPatientState(updatedState);
      setStatusMessage(message);
    },
    [patientState]
  );

  const handleDeliverIno = useCallback(() => {
    const { updatedState, message } = deliverInhaledNitricOxide(patientState, 20);
    setPatientState(updatedState);
    setStatusMessage(message);
  }, [patientState]);

  const handleOpenDebrief = useCallback(() => {
    const result = evaluateNicuDebrief(patientState);
    setDebriefResult(result);
    setShowDebriefModal(true);
  }, [patientState]);

  const isWidePulsePressure = patientState.hemodynamics.pulsePressureMmHg >= 32;
  const isPphnShunt = patientState.hemodynamics.prePostSpO2Delta >= 10;
  const isHighIwl = patientState.isolette.calculatedIwlMlKgDay >= 70;
  const isExcessiveGir = patientState.tpn.calculatedGirMgKgMin > 10;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6 text-slate-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 border border-sky-700/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-sky-500/20 border border-sky-400/40 rounded-xl text-sky-300">
                <Baby className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-200 via-teal-100 to-amber-200">
                  ELBW NICU Resuscitation Workstation
                </h1>
                <p className="text-xs md:text-sm text-sky-300/80">
                  Micropremie (&lt; 1000g) Fluid & Electrolyte Thermodynamics, TPN / GIR Engine, hsPDA Ductal Steal & Surfactant Titration
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Scenario Selector */}
            <div className="flex items-center gap-2">
              <label htmlFor="nicu-scenario-select" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Scenario:
              </label>
              <select
                id="nicu-scenario-select"
                value={selectedScenarioId}
                onChange={(e) => handleSelectScenario(e.target.value as NicuScenarioPresetId)}
                className="bg-slate-900/90 border border-sky-500/40 text-xs md:text-sm rounded-lg px-3 py-2 text-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-400 max-w-xs truncate"
              >
                {Object.values(ELBW_NICU_SCENARIOS).map((sc) => (
                  <option key={sc.id} value={sc.id}>
                    {sc.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600/60 rounded-lg text-xs font-semibold transition"
              title="Reset Scenario"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-300" />
              Reset
            </button>

            {/* Debrief Button */}
            <button
              onClick={handleOpenDebrief}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-400/50 rounded-lg text-xs md:text-sm font-bold shadow-lg shadow-emerald-950/40 transition"
            >
              <FileText className="w-4 h-4" />
              NICU Debrief
            </button>
          </div>
        </div>

        {/* Infant Profile Chip */}
        <div className="mt-4 p-3 bg-sky-950/40 border border-sky-800/40 rounded-xl text-xs md:text-sm text-sky-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">{scenario.gestationalAgeWeeks}w GA</span>
            <span className="text-slate-400">|</span>
            <span>Birth Wt: <strong className="text-sky-300">{scenario.birthWeightGrams}g</strong></span>
            <span className="text-slate-400">|</span>
            <span>Current Wt: <strong className="text-sky-300">{patientState.electrolytes.currentWeightGrams}g</strong></span>
            <span className="text-slate-400">|</span>
            <span className={`font-semibold ${patientState.electrolytes.weightChangePercent < -15 ? 'text-rose-400 font-black' : 'text-amber-300'}`}>
              Weight Change: {patientState.electrolytes.weightChangePercent}%
            </span>
          </div>
          <div className="text-[11px] text-slate-300">
            Day {patientState.postnatalAgeDays} of Life | Elapsed: {patientState.elapsedHours}h
          </div>
        </div>

        {/* Clinical Presentation */}
        <div className="mt-3 p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl text-xs text-slate-300 flex items-start gap-2">
          <Stethoscope className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <div>{scenario.clinicalPresentation}</div>
        </div>
      </div>

      {/* Real-time Status Message */}
      <div className="px-4 py-2.5 bg-slate-900/80 border border-sky-500/30 rounded-xl text-xs md:text-sm text-sky-200 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="font-semibold text-slate-400">NICU Bedside Feedback:</span>
        <span className="truncate">{statusMessage}</span>
      </div>

      {/* Main Grid: Telemetry, Isolette, TPN, PDA, Surfactant */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Telemetry & Alarms (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Micro-Premie Telemetry */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
                <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  Micro-Premie Telemetry
                </h2>
              </div>
              <span className="px-2 py-0.5 text-xs font-bold rounded bg-sky-950 text-sky-300 border border-sky-700/50">
                {scenario.gestationalAgeWeeks}w {scenario.birthWeightGrams}g
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Heart Rate */}
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Heart Rate</span>
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
                </div>
                <div className="text-2xl font-black text-rose-400 mt-1">
                  {patientState.hemodynamics.heartRateBpm}
                  <span className="text-xs font-normal text-slate-500 ml-1">bpm</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Target: 120-160</div>
              </div>

              {/* BP & Pulse Pressure */}
              <div className={`bg-slate-950/70 border rounded-xl p-3 ${isWidePulsePressure ? 'border-amber-500/60 bg-amber-950/20' : 'border-slate-800/80'}`}>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>BP (SBP/DBP)</span>
                  <Activity className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <div className="text-2xl font-black text-sky-300 mt-1">
                  {patientState.hemodynamics.systolicBpMmHg}/{patientState.hemodynamics.diastolicBpMmHg}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  MAP: {patientState.hemodynamics.meanArterialPressureMmHg} | PP: {patientState.hemodynamics.pulsePressureMmHg}
                  {isWidePulsePressure && <span className="text-amber-400 font-bold ml-1">(Wide)</span>}
                </div>
              </div>

              {/* Pre-ductal SpO2 */}
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Pre-Ductal (Rt Hand)</span>
                  <Activity className="w-3.5 h-3.5 text-teal-400" />
                </div>
                <div className="text-2xl font-black text-teal-300 mt-1">
                  {patientState.hemodynamics.preDuctalSpO2}%
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Target: 90-95%</div>
              </div>

              {/* Post-ductal SpO2 */}
              <div className={`bg-slate-950/70 border rounded-xl p-3 ${isPphnShunt ? 'border-rose-600/80 bg-rose-950/20' : 'border-slate-800/80'}`}>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Post-Ductal (Foot)</span>
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className={`text-2xl font-black mt-1 ${isPphnShunt ? 'text-rose-400' : 'text-cyan-300'}`}>
                  {patientState.hemodynamics.postDuctalSpO2}%
                </div>
                <div className="text-[10px] font-mono mt-0.5">
                  Delta: {patientState.hemodynamics.prePostSpO2Delta}%
                  {isPphnShunt && <span className="text-rose-400 font-bold ml-1">(PPHN)</span>}
                </div>
              </div>
            </div>

            {/* Perfusion Exam */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Peripheral Perfusion:</span>
                <span className="font-bold text-sky-200">
                  {patientState.hemodynamics.peripheralPerfusion.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Serum Sodium:</span>
                <span className={`font-mono font-bold ${patientState.electrolytes.serumSodiumMEqL > 148 ? 'text-rose-400' : 'text-emerald-300'}`}>
                  {patientState.electrolytes.serumSodiumMEqL} mEq/L
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Urine Output:</span>
                <span className="font-mono text-slate-200">
                  {patientState.electrolytes.urineOutputMlKgHr.toFixed(1)} mL/kg/hr
                </span>
              </div>
            </div>
          </div>

          {/* Clinical Alarms */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-5 h-5 animate-bounce" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Active Alarms</h3>
            </div>
            {patientState.clinicalAlarms.length === 0 ? (
              <div className="text-xs text-slate-500 italic">No acute alarms active.</div>
            ) : (
              <div className="space-y-2">
                {patientState.clinicalAlarms.map((alarm, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-rose-950/50 border border-rose-700/60 text-xs text-rose-200 font-medium flex items-start gap-2"
                  >
                    <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{alarm}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Isolette, TPN/GIR, PDA & Surfactant (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Isolette & Environmental Humidity Console */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-amber-400" />
                <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  Isolette Environment & Insensible Water Loss (IWL)
                </h2>
              </div>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded border ${isHighIwl ? 'bg-rose-950 text-rose-300 border-rose-600' : 'bg-emerald-950 text-emerald-300 border-emerald-600'}`}>
                IWL: {patientState.isolette.calculatedIwlMlKgDay} mL/kg/day
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Humidity Slider */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-sky-300">Incubator Humidity</span>
                  <span className="font-mono text-sky-200 font-bold">
                    {patientState.isolette.incubatorHumidityPercent}%
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="95"
                  step="5"
                  value={patientState.isolette.incubatorHumidityPercent}
                  onChange={(e) => handleAdjustHumidity(parseInt(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500 flex justify-between">
                  <span>50% (High Loss)</span>
                  <span>Target: 80-85%</span>
                  <span>95% (Max)</span>
                </div>
              </div>

              {/* Status Chips */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Phototherapy:</span>
                  <span className={patientState.isolette.phototherapyActive ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                    {patientState.isolette.phototherapyActive ? 'Active (+20 mL/kg/d)' : 'Off'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Radiant Warmer:</span>
                  <span className={patientState.isolette.radiantWarmerActive ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                    {patientState.isolette.radiantWarmerActive ? 'Active (+30 mL/kg/d)' : 'Off (Enclosed)'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Target Weight Loss:</span>
                  <span className="text-slate-300 font-mono">7-12% over Week 1</span>
                </div>
              </div>
            </div>
          </div>

          {/* TPN & Glucose Infusion Rate (GIR) Precision Engine */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-teal-400" />
                <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  TPN & Glucose Infusion Rate (GIR) Precision Calculator
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Live GIR:</span>
                <span
                  className={`text-base font-black px-2.5 py-0.5 rounded-lg border font-mono ${
                    isExcessiveGir
                      ? 'bg-rose-950 text-rose-300 border-rose-600'
                      : 'bg-emerald-950 text-emerald-300 border-emerald-600'
                  }`}
                >
                  {patientState.tpn.calculatedGirMgKgMin} mg/kg/min
                </span>
                <span className="text-[11px] text-slate-400">Target: 4-8</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Dextrose Slider */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-teal-300">Dextrose Concentration</span>
                  <span className="font-mono text-teal-200 font-bold">
                    D{patientState.tpn.dextroseConcentrationPercent}W
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="20"
                  step="0.5"
                  value={patientState.tpn.dextroseConcentrationPercent}
                  onChange={(e) =>
                    handleTitrateTpn(parseFloat(e.target.value), patientState.tpn.totalFluidRateMlKgDay)
                  }
                  className="w-full accent-teal-500 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500 flex justify-between">
                  <span>D5W</span>
                  <span>D10W (Standard Starter)</span>
                  <span>D20W (Central Only)</span>
                </div>
              </div>

              {/* Total Fluid Rate Slider */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-teal-300">Total Fluid Rate</span>
                  <span className="font-mono text-teal-200 font-bold">
                    {patientState.tpn.totalFluidRateMlKgDay} mL/kg/day
                  </span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="180"
                  step="5"
                  value={patientState.tpn.totalFluidRateMlKgDay}
                  onChange={(e) =>
                    handleTitrateTpn(patientState.tpn.dextroseConcentrationPercent, parseFloat(e.target.value))
                  }
                  className="w-full accent-teal-500 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500 flex justify-between">
                  <span>60 (Day 1)</span>
                  <span>80-120 (Advance)</span>
                  <span>180 (Max)</span>
                </div>
              </div>
            </div>

            {/* Blood Glucose & Glucosuria Bar */}
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="text-slate-400">Blood Glucose:</span>
                <span className={`text-lg font-black font-mono ${patientState.tpn.bloodGlucoseMgDl > 200 ? 'text-rose-400' : 'text-emerald-300'}`}>
                  {patientState.tpn.bloodGlucoseMgDl} mg/dL
                </span>
              </div>
              {patientState.tpn.glucosuriaPresent && (
                <span className="px-2.5 py-1 rounded bg-rose-600 text-white font-bold text-[11px] animate-pulse">
                  4+ Glucosuria / Osmotic Diuresis
                </span>
              )}
            </div>
          </div>

          {/* Patent Ductus Arteriosus (hsPDA) & Ductal Steal Console */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-400" />
                <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  Patent Ductus Arteriosus (hsPDA) & Ductal Steal
                </h2>
              </div>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded border ${patientState.pdaState.isClosed ? 'bg-emerald-950 text-emerald-300 border-emerald-600' : 'bg-rose-950 text-rose-300 border-rose-600'}`}>
                {patientState.pdaState.isClosed ? 'Ductus Constricted/Closed' : `PDA ${patientState.pdaState.ductalDiameterMm.toFixed(1)} mm (${patientState.pdaState.shuntDirection})`}
              </span>
            </div>

            {/* Ductal Steal Alert */}
            {patientState.pdaState.ductalStealPresent && (
              <div className="p-3 bg-rose-950/80 border border-rose-600 rounded-xl text-xs md:text-sm text-rose-200 flex items-start gap-2.5 font-semibold">
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  MESENTERIC DUCTAL STEAL DETECTED: Retrograde diastolic flow in SMA (Resistive Index: {patientState.pdaState.mesentericResistiveIndex})!
                  Severe bowel hypoperfusion & Necrotizing Enterocolitis (NEC) risk.
                </div>
              </div>
            )}

            {/* Ductal Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                <div className="text-slate-400">Qp:Qs Shunt Ratio</div>
                <div className="text-lg font-black text-sky-300 mt-0.5 font-mono">
                  {patientState.pdaState.qpQsRatio}:1
                </div>
                <div className="text-[10px] text-slate-500">&gt; 1.5 indicates hsPDA</div>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                <div className="text-slate-400">Murmur Grade</div>
                <div className="text-sm font-bold text-amber-300 mt-1">
                  {patientState.pdaState.murmurGrade.replace(/_/g, ' ')}
                </div>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                <div className="text-slate-400">Platelets / Creatinine</div>
                <div className="text-xs font-mono font-semibold text-slate-200 mt-1">
                  {patientState.electrolytes.plateletCountPerMcl.toLocaleString()}/mcL | {patientState.electrolytes.serumCreatinineMgDl} mg/dL
                </div>
              </div>
            </div>

            {/* PDA Pharmacotherapy Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* Indomethacin */}
              <button
                onClick={() => handleTreatPda('INDOMETHACIN')}
                disabled={patientState.pdaState.isClosed}
                className="p-3 rounded-xl border border-indigo-500/50 bg-indigo-950/40 hover:bg-indigo-900/60 disabled:bg-slate-800 disabled:text-slate-600 text-xs font-bold text-indigo-200 flex items-center justify-between transition shadow-md"
              >
                <div className="flex items-center gap-1.5">
                  <Pill className="w-4 h-4 text-indigo-400" />
                  <span>IV Indomethacin</span>
                </div>
              </button>

              {/* Ibuprofen */}
              <button
                onClick={() => handleTreatPda('IBUPROFEN')}
                disabled={patientState.pdaState.isClosed}
                className="p-3 rounded-xl border border-sky-500/50 bg-sky-950/40 hover:bg-sky-900/60 disabled:bg-slate-800 disabled:text-slate-600 text-xs font-bold text-sky-200 flex items-center justify-between transition shadow-md"
              >
                <div className="flex items-center gap-1.5">
                  <Pill className="w-4 h-4 text-sky-400" />
                  <span>IV Ibuprofen</span>
                </div>
              </button>

              {/* Paracetamol */}
              <button
                onClick={() => handleTreatPda('PARACETAMOL')}
                disabled={patientState.pdaState.isClosed}
                className="p-3 rounded-xl border border-emerald-500/50 bg-emerald-950/40 hover:bg-emerald-900/60 disabled:bg-slate-800 disabled:text-slate-600 text-xs font-bold text-emerald-200 flex items-center justify-between transition shadow-md"
              >
                <div className="flex items-center gap-1.5">
                  <Pill className="w-4 h-4 text-emerald-400" />
                  <span>IV Paracetamol</span>
                </div>
              </button>
            </div>
          </div>

          {/* RDS Surfactant & Ventilator Weaning Console */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Wind className="w-5 h-5 text-cyan-400" />
                <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  RDS Surfactant & Ventilator Weaning Console
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Compliance: {patientState.respiratory.lungComplianceMlCmH2oKg.toFixed(2)} mL/cmH2O/kg
              </span>
            </div>

            {/* Volutrauma Alert */}
            {patientState.respiratory.volutraumaRiskActive && (
              <div className="p-3 bg-red-950/80 border border-red-600 rounded-xl text-xs md:text-sm text-red-200 flex items-start gap-2.5 font-semibold animate-pulse">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  CRITICAL POST-SURFACTANT VOLUTRAUMA: Delivered Tidal Volume = {patientState.respiratory.deliveredTidalVolumeMlKg} mL/kg (&gt; 6.0 max)!
                  PaCO2 has plunged to {patientState.respiratory.paCo2MmHg} mmHg (danger of cerebral vasoconstriction & PVL). Wean PIP immediately!
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* PIP Slider */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-cyan-300">Peak Inspiratory Pressure (PIP)</span>
                  <span className="font-mono text-cyan-200 font-bold">
                    {patientState.respiratory.pipCmH2o} cmH2O
                  </span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="28"
                  step="1"
                  value={patientState.respiratory.pipCmH2o}
                  onChange={(e) =>
                    handleWeanVentilator(parseInt(e.target.value), patientState.respiratory.fio2Percent)
                  }
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500 flex justify-between">
                  <span>12 (Gentle)</span>
                  <span>Target Vt: 4-6 mL/kg</span>
                  <span>28 (Barotrauma Risk)</span>
                </div>
              </div>

              {/* FiO2 Slider */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-cyan-300">Fraction of Inspired O2 (FiO2)</span>
                  <span className="font-mono text-cyan-200 font-bold">
                    {patientState.respiratory.fio2Percent}%
                  </span>
                </div>
                <input
                  type="range"
                  min="21"
                  max="100"
                  step="1"
                  value={patientState.respiratory.fio2Percent}
                  onChange={(e) =>
                    handleWeanVentilator(patientState.respiratory.pipCmH2o, parseInt(e.target.value))
                  }
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500 flex justify-between">
                  <span>21% (Room Air)</span>
                  <span>Target SpO2: 90-95%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            {/* Action Buttons: Surfactant & iNO */}
            <div className="flex flex-wrap gap-3 pt-1">
              <button
                onClick={handleDeliverSurfactant}
                disabled={patientState.respiratory.surfactantGiven}
                className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl border text-xs md:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition ${
                  patientState.respiratory.surfactantGiven
                    ? 'bg-emerald-950/40 border-emerald-600 text-emerald-300 cursor-default'
                    : 'bg-cyan-600/80 hover:bg-cyan-500 border-cyan-400/40 text-white'
                }`}
              >
                <Wind className="w-4 h-4 text-cyan-200" />
                {patientState.respiratory.surfactantGiven ? 'Surfactant Administered' : 'Administer Poractant alfa 200 mg/kg (LISA)'}
              </button>

              <button
                onClick={handleDeliverIno}
                className="flex-1 min-w-[200px] py-2.5 px-4 bg-teal-600/80 hover:bg-teal-500 border border-teal-400/40 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition text-white"
              >
                <Zap className="w-4 h-4 text-teal-200" />
                Initiate Inhaled Nitric Oxide (iNO 20 ppm)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* NICU Debrief Modal */}
      {showDebriefModal && debriefResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-sky-400">
                <FileText className="w-6 h-6" />
                <h3 className="text-lg font-bold text-slate-100">
                  ELBW NICU Resuscitation Clinical Debrief & Competency Report
                </h3>
              </div>
              <button
                onClick={() => setShowDebriefModal(false)}
                className="text-slate-400 hover:text-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score & Letter Grade */}
            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Overall Competency Score</div>
                <div className="text-3xl font-black text-emerald-400 mt-0.5">
                  {debriefResult.scorePercentage}%
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400 uppercase tracking-wider">Neonatal Fellowship Grade</div>
                <div className="text-3xl font-black text-sky-300 mt-0.5 font-mono">
                  {debriefResult.letterGrade}
                </div>
              </div>
            </div>

            {/* Rubric Checklist */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Clinical Resuscitation Checkpoints
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
                  <CheckCircle2
                    className={`w-4 h-4 ${debriefResult.humidityPreserved ? 'text-emerald-400' : 'text-rose-500'}`}
                  />
                  <span>Humidity & IWL Preserved</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
                  <CheckCircle2
                    className={`w-4 h-4 ${debriefResult.girManagedAppropriately ? 'text-emerald-400' : 'text-rose-500'}`}
                  />
                  <span>GIR Managed (4-8 mg/kg/min)</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
                  <CheckCircle2
                    className={`w-4 h-4 ${debriefResult.pdaAddressedSafely ? 'text-emerald-400' : 'text-rose-500'}`}
                  />
                  <span>hsPDA Managed & Safe Drugs</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
                  <CheckCircle2
                    className={`w-4 h-4 ${debriefResult.surfactantAndWeaningCorrect ? 'text-emerald-400' : 'text-rose-500'}`}
                  />
                  <span>Surfactant & Post-Delivery Weaning</span>
                </div>
              </div>
            </div>

            {/* Faculty Feedback */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Attending Neonatologist Insights
              </h4>
              <div className="space-y-2">
                {debriefResult.facultyFeedback.map((fb, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5"
                  >
                    <Sparkles className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <span>{fb}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowDebriefModal(false)}
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs md:text-sm font-bold shadow-lg transition"
              >
                Close Debrief
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
