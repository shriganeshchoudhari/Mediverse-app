'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Activity,
  Baby,
  AlertTriangle,
  Heart,
  ShieldAlert,
  CheckCircle2,
  Droplet,
  Syringe,
  Sparkles,
  RotateCcw,
  FileText,
  Clock,
  Stethoscope,
  Zap,
  Thermometer,
  Pill,
  Wind,
  HelpCircle,
  X,
} from 'lucide-react';
import {
  PediatricScenarioPresetId,
  PEDIATRIC_SHOCK_SCENARIOS,
  PediatricPatientState,
  VasoactiveDrug,
  PediatricDebriefResult,
  initializePediatricShockState,
  deliverFluidBolus,
  titrateVasoactiveDrug,
  executeBundleAction,
  advancePediatricTimeStep,
  evaluatePediatricShockDebrief,
} from '../../.gemini/skills/PediatricSepticShockEngine';

export default function PediatricSepticShockSimulator() {
  const [selectedScenarioId, setSelectedScenarioId] =
    useState<PediatricScenarioPresetId>('COLD_SHOCK_TODDLER_PNEUMONIA');
  const [patientState, setPatientState] = useState<PediatricPatientState>(() =>
    initializePediatricShockState('COLD_SHOCK_TODDLER_PNEUMONIA')
  );
  const [isAutoAdvancing, setIsAutoAdvancing] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<string>(
    'Patient in acute septic shock. Identify shock phenotype, evaluate perfusion, and execute PALS resuscitation bundle.'
  );
  const [showDebriefModal, setShowDebriefModal] = useState<boolean>(false);
  const [debriefResult, setDebriefResult] = useState<PediatricDebriefResult | null>(null);

  const scenario = useMemo(
    () => PEDIATRIC_SHOCK_SCENARIOS[selectedScenarioId],
    [selectedScenarioId]
  );

  // Auto-advance simulation clock
  useEffect(() => {
    if (!isAutoAdvancing) return;
    const interval = setInterval(() => {
      setPatientState((prev) => advancePediatricTimeStep(prev, 5));
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoAdvancing]);

  // Scenario Switcher
  const handleSelectScenario = useCallback((id: PediatricScenarioPresetId) => {
    setSelectedScenarioId(id);
    const newState = initializePediatricShockState(id);
    setPatientState(newState);
    setShowDebriefModal(false);
    setDebriefResult(null);
    setStatusMessage(`Loaded scenario: ${PEDIATRIC_SHOCK_SCENARIOS[id].title}`);
  }, []);

  const handleReset = useCallback(() => {
    handleSelectScenario(selectedScenarioId);
  }, [handleSelectScenario, selectedScenarioId]);

  // Actions
  const handleDeliverBolus = useCallback(
    (mlKg: number) => {
      const { updatedState, success, message } = deliverFluidBolus(patientState, mlKg);
      setPatientState(updatedState);
      setStatusMessage(message);
    },
    [patientState]
  );

  const handleTitrateDrug = useCallback(
    (drug: VasoactiveDrug, rate: number) => {
      const { updatedState, message } = titrateVasoactiveDrug(patientState, drug, rate);
      setPatientState(updatedState);
      setStatusMessage(message);
    },
    [patientState]
  );

  const handleBundleAction = useCallback(
    (action: 'BLOOD_CULTURES' | 'ANTIBIOTICS' | 'D10W_GLUCOSE' | 'CALCIUM_GLUCONATE' | 'HYDROCORTISONE') => {
      const { updatedState, message } = executeBundleAction(patientState, action);
      setPatientState(updatedState);
      setStatusMessage(message);
    },
    [patientState]
  );

  const handleOpenDebrief = useCallback(() => {
    const result = evaluatePediatricShockDebrief(patientState);
    setDebriefResult(result);
    setShowDebriefModal(true);
  }, [patientState]);

  // Helper styles
  const isHypotensive =
    patientState.hemodynamics.systolicBpMmHg < patientState.hemodynamics.minimumAcceptableSbpMmHg;
  const isColdShock = patientState.hemodynamics.phenotype === 'COLD_SHOCK';
  const isWarmShock = patientState.hemodynamics.phenotype === 'WARM_SHOCK';

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6 text-slate-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-700/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-500/20 border border-indigo-400/40 rounded-xl text-indigo-300">
                <Baby className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-sky-100 to-amber-200">
                  Pediatric Septic Shock & Resuscitation Workstation
                </h1>
                <p className="text-xs md:text-sm text-indigo-300/80">
                  Surviving Sepsis Campaign Pediatric (2020) & Phoenix Sepsis Criteria (2024) | Cold vs Warm Shock Phenotyping, VIS Engine & FEAST Fluid Titration
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Scenario Selector */}
            <div className="flex items-center gap-2">
              <label htmlFor="scenario-select" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Scenario:
              </label>
              <select
                id="scenario-select"
                value={selectedScenarioId}
                onChange={(e) => handleSelectScenario(e.target.value as PediatricScenarioPresetId)}
                className="bg-slate-900/90 border border-indigo-500/40 text-xs md:text-sm rounded-lg px-3 py-2 text-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 max-w-xs truncate"
              >
                {Object.values(PEDIATRIC_SHOCK_SCENARIOS).map((sc) => (
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

            {/* Evaluate Debrief */}
            <button
              onClick={handleOpenDebrief}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-400/50 rounded-lg text-xs md:text-sm font-bold shadow-lg shadow-emerald-950/40 transition"
            >
              <FileText className="w-4 h-4" />
              PALS Debrief
            </button>
          </div>
        </div>

        {/* Case Presentation Snippet */}
        <div className="mt-4 p-3.5 bg-indigo-950/40 border border-indigo-800/40 rounded-xl text-xs md:text-sm text-indigo-200/90 flex items-start gap-2.5">
          <Stethoscope className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-indigo-100">Presentation: </span>
            {scenario.historyAndPresentation}
            <div className="mt-1 text-xs text-indigo-300 font-mono">
              Infection Focus: {scenario.underlyingInfection} | First-line Rec: {scenario.recommendedFirstLineVasoactive}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Status Message Bar */}
      <div className="px-4 py-2.5 bg-slate-900/80 border border-indigo-500/30 rounded-xl text-xs md:text-sm text-sky-200 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="font-semibold text-slate-400">Clinical Feedback:</span>
        <span className="truncate">{statusMessage}</span>
      </div>

      {/* Main Grid Layout: Telemetry, Phenotyping, FEAST, VIS, Bundles */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Pediatric Telemetry & Phenotype (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Pediatric Telemetry Monitor */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
                <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  PALS Telemetry Monitor
                </h2>
              </div>
              <span className="px-2 py-0.5 text-xs font-bold rounded bg-indigo-950 text-indigo-300 border border-indigo-700/50">
                {patientState.patientAgeYears}y | {patientState.weightKg} kg
              </span>
            </div>

            {/* Vital Signs Grid */}
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
                <div className="text-[10px] text-amber-400 font-semibold mt-0.5">
                  {patientState.hemodynamics.heartRateBpm > 150 ? 'Severe Tachycardia' : 'Tachycardic'}
                </div>
              </div>

              {/* Blood Pressure & Min SBP */}
              <div className={`bg-slate-950/70 border rounded-xl p-3 ${isHypotensive ? 'border-rose-600/80 bg-rose-950/20' : 'border-slate-800/80'}`}>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>BP (SBP/DBP)</span>
                  <Activity className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <div className={`text-2xl font-black mt-1 ${isHypotensive ? 'text-rose-400' : 'text-sky-300'}`}>
                  {patientState.hemodynamics.systolicBpMmHg}/{patientState.hemodynamics.diastolicBpMmHg}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  MAP: {patientState.hemodynamics.meanArterialPressureMmHg} | Min: {patientState.hemodynamics.minimumAcceptableSbpMmHg}
                </div>
              </div>

              {/* Respiratory Rate */}
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Resp Rate</span>
                  <Wind className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="text-2xl font-black text-cyan-400 mt-1">
                  {patientState.hemodynamics.respiratoryRateMin}
                  <span className="text-xs font-normal text-slate-500 ml-1">/min</span>
                </div>
                <div className="text-[10px] text-cyan-300 font-semibold mt-0.5">
                  {patientState.fluidState.workOfBreathing === 'SEVERE_GRUNTING_FLARING' ? 'Grunting / Retractions' : 'Tachypneic'}
                </div>
              </div>

              {/* SpO2 */}
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>SpO2</span>
                  <Activity className="w-3.5 h-3.5 text-teal-400" />
                </div>
                <div className="text-2xl font-black text-teal-300 mt-1">
                  {patientState.hemodynamics.spO2Percent}%
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {patientState.fluidState.pulmonaryCracklesPresent ? 'Bibasilar Rales' : 'Clear Lungs'}
                </div>
              </div>
            </div>

            {/* Perfusion Exam: Cap Refill, Pulses, Extremities */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-amber-400" />
                Microvascular Perfusion Exam
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Capillary Refill:</span>
                <span
                  className={`font-bold font-mono px-2 py-0.5 rounded text-xs ${
                    patientState.hemodynamics.capillaryRefillSeconds > 3.0
                      ? 'bg-rose-950 text-rose-300 border border-rose-700/50'
                      : patientState.hemodynamics.capillaryRefillSeconds < 1.0
                      ? 'bg-amber-950 text-amber-300 border border-amber-700/50'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                  }`}
                >
                  {patientState.hemodynamics.capillaryRefillSeconds.toFixed(1)}s (
                  {patientState.hemodynamics.capillaryRefillSeconds > 3.0
                    ? 'Delayed'
                    : patientState.hemodynamics.capillaryRefillSeconds < 1.0
                    ? 'Flash'
                    : 'Brisk'}
                  )
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Peripheral Pulses:</span>
                <span className="font-semibold text-slate-200">
                  {patientState.hemodynamics.peripheralPulseQuality.replace('_', ' ')}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Extremity Temp:</span>
                <span className="font-semibold text-slate-200">
                  {patientState.hemodynamics.extremityTemperature.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Phenotype Card */}
            <div
              className={`p-3.5 rounded-xl border ${
                isColdShock
                  ? 'bg-blue-950/40 border-blue-600/60 text-blue-200'
                  : isWarmShock
                  ? 'bg-amber-950/40 border-amber-600/60 text-amber-200'
                  : 'bg-emerald-950/40 border-emerald-600/60 text-emerald-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-bold">Phenotype</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-slate-900 border border-current">
                  {patientState.hemodynamics.phenotype.replace('_', ' ')}
                </span>
              </div>
              <div className="text-xs mt-2 text-slate-300">
                {isColdShock && (
                  <p>
                    <span className="font-bold text-blue-300">Low CO / High SVR:</span> Cool mottled skin, weak pulses, cap refill &gt; 3s. First-line: <span className="font-bold text-blue-200 underline">Epinephrine</span>.
                  </p>
                )}
                {isWarmShock && (
                  <p>
                    <span className="font-bold text-amber-300">High CO / Low SVR:</span> Warm flushed skin, bounding pulses, flash refill &lt; 1s, wide pulse pressure. First-line: <span className="font-bold text-amber-200 underline">Norepinephrine</span>.
                  </p>
                )}
                {!isColdShock && !isWarmShock && (
                  <p>
                    <span className="font-bold text-emerald-300">Compensated / Euvolemic:</span> Perfusion normalized, hemodynamics stabilized.
                  </p>
                )}
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

        {/* Center & Right Columns: FEAST Fluid Resuscitation, VIS Titration, Bundle & Metabolic (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* FEAST Protocol: Fluid Titration & Hepatomegaly Safety Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Droplet className="w-5 h-5 text-sky-400" />
                <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  FEAST Fluid Resuscitation & Safety Overload Guardrail
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Total Boluses: {patientState.administeredFluidBolusesCount}
              </span>
            </div>

            {/* Overload Alert if stop triggered */}
            {patientState.fluidState.fluidStopTriggered && (
              <div className="p-3 bg-red-950/80 border border-red-600 rounded-xl text-xs md:text-sm text-red-200 flex items-start gap-2.5 font-semibold">
                <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  FLUID STOP SAFETY INTERLOCK ACTIVE: Liver edge &gt;= 3.0 cm and/or pulmonary rales!
                  Further fluid boluses will precipitate fatal pulmonary edema. Initiate vasoactive support now!
                </div>
              </div>
            )}

            {/* Gauges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cumulative Fluid Volume */}
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Cumulative Crystalloid</span>
                  <span className="font-bold text-sky-400">
                    {patientState.fluidState.cumulativeFluidMlKg} mL/kg
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      patientState.fluidState.cumulativeFluidMlKg > 40
                        ? 'bg-rose-500'
                        : patientState.fluidState.cumulativeFluidMlKg > 20
                        ? 'bg-amber-500'
                        : 'bg-sky-500'
                    }`}
                    style={{ width: `${Math.min(100, (patientState.fluidState.cumulativeFluidMlKg / 60) * 100)}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-400 flex justify-between font-mono">
                  <span>Total: {patientState.fluidState.cumulativeFluidMlKg * patientState.weightKg} mL</span>
                  <span>Safety Ref: 40-60 mL/kg max</span>
                </div>
              </div>

              {/* Liver Edge Below Costal Margin (cm) */}
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Liver Edge Depth (Hepatomegaly)</span>
                  <span
                    className={`font-bold font-mono ${
                      patientState.fluidState.liverEdgeBelowCostalMarginCm >= 3.0
                        ? 'text-rose-400 font-black'
                        : patientState.fluidState.liverEdgeBelowCostalMarginCm >= 2.0
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {patientState.fluidState.liverEdgeBelowCostalMarginCm.toFixed(1)} cm
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      patientState.fluidState.liverEdgeBelowCostalMarginCm >= 3.0
                        ? 'bg-rose-500'
                        : patientState.fluidState.liverEdgeBelowCostalMarginCm >= 2.0
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{
                      width: `${Math.min(100, (patientState.fluidState.liverEdgeBelowCostalMarginCm / 5.0) * 100)}%`,
                    }}
                  />
                </div>
                <div className="text-[11px] text-slate-400 flex justify-between font-mono">
                  <span>Normal: &lt; 2 cm</span>
                  <span className="text-rose-400 font-semibold">&gt;= 3 cm: Hard Stop</span>
                </div>
              </div>
            </div>

            {/* Fluid Bolus Delivery Buttons */}
            <div className="flex flex-wrap gap-3 pt-1">
              <button
                onClick={() => handleDeliverBolus(10)}
                disabled={patientState.fluidState.fluidStopTriggered}
                className="flex-1 min-w-[180px] py-2.5 px-4 bg-sky-600/80 hover:bg-sky-500 disabled:bg-slate-800 disabled:text-slate-600 border border-sky-400/40 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition"
              >
                <Droplet className="w-4 h-4 text-sky-200" />
                Bolus 10 mL/kg ({patientState.weightKg * 10} mL)
              </button>

              <button
                onClick={() => handleDeliverBolus(20)}
                disabled={patientState.fluidState.fluidStopTriggered}
                className="flex-1 min-w-[180px] py-2.5 px-4 bg-indigo-600/80 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 border border-indigo-400/40 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition"
              >
                <Droplet className="w-4 h-4 text-indigo-200" />
                Bolus 20 mL/kg ({patientState.weightKg * 20} mL)
              </button>
            </div>
          </div>

          {/* Vasoactive-Inotropic Score (VIS) Console */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  Vasoactive-Inotropic Score (VIS) Titration Engine
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Live VIS:</span>
                <span
                  className={`text-base font-black px-2.5 py-0.5 rounded-lg border font-mono ${
                    patientState.visScore >= 20
                      ? 'bg-rose-950 text-rose-300 border-rose-600/60'
                      : patientState.visScore >= 10
                      ? 'bg-amber-950 text-amber-300 border-amber-600/60'
                      : 'bg-slate-950 text-emerald-300 border-emerald-600/60'
                  }`}
                >
                  {patientState.visScore}
                </span>
                <span className="text-[11px] text-slate-400 font-semibold">
                  {patientState.visScore >= 20
                    ? 'Severe / High Mortality'
                    : patientState.visScore >= 10
                    ? 'Moderate Inotropy'
                    : 'Low Inotropy'}
                </span>
              </div>
            </div>

            {/* Formula Hint */}
            <div className="text-[11px] text-slate-400 font-mono bg-slate-950/60 p-2 rounded-lg border border-slate-800">
              VIS = Dopamine + Dobutamine + 100×Epi + 10×Milrinone + 10000×Vaso + 100×NorEpi
            </div>

            {/* Titration Sliders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Epinephrine (First-line for Cold Shock) */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-blue-300 flex items-center gap-1.5">
                    <Syringe className="w-3.5 h-3.5 text-blue-400" />
                    Epinephrine (Cold Shock 1st-Line)
                  </span>
                  <span className="font-mono text-blue-200 font-bold">
                    {patientState.vasoactiveRates.epinephrineMcgKgMin.toFixed(2)} mcg/kg/min
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1.0"
                  step="0.02"
                  value={patientState.vasoactiveRates.epinephrineMcgKgMin}
                  onChange={(e) => handleTitrateDrug('EPINEPHRINE', parseFloat(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500 flex justify-between">
                  <span>0.00 (Off)</span>
                  <span>0.05-0.30 (Typical)</span>
                  <span>1.00 (Max)</span>
                </div>
              </div>

              {/* Norepinephrine (First-line for Warm Shock) */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Syringe className="w-3.5 h-3.5 text-amber-400" />
                    Norepinephrine (Warm Shock 1st-Line)
                  </span>
                  <span className="font-mono text-amber-200 font-bold">
                    {patientState.vasoactiveRates.norepinephrineMcgKgMin.toFixed(2)} mcg/kg/min
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1.0"
                  step="0.02"
                  value={patientState.vasoactiveRates.norepinephrineMcgKgMin}
                  onChange={(e) => handleTitrateDrug('NOREPINEPHRINE', parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500 flex justify-between">
                  <span>0.00 (Off)</span>
                  <span>0.05-0.30 (Typical)</span>
                  <span>1.00 (Max)</span>
                </div>
              </div>

              {/* Milrinone (Inodilator) */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-purple-300 flex items-center gap-1.5">
                    <Syringe className="w-3.5 h-3.5 text-purple-400" />
                    Milrinone (Inodilator)
                  </span>
                  <span className="font-mono text-purple-200 font-bold">
                    {patientState.vasoactiveRates.milrinoneMcgKgMin.toFixed(2)} mcg/kg/min
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.75"
                  step="0.05"
                  value={patientState.vasoactiveRates.milrinoneMcgKgMin}
                  onChange={(e) => handleTitrateDrug('MILRINONE', parseFloat(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500 flex justify-between">
                  <span>0.00 (Off)</span>
                  <span>0.25-0.50 (Target)</span>
                  <span>0.75 (Max)</span>
                </div>
              </div>

              {/* Vasopressin (Refractory Vasoplegia) */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-teal-300 flex items-center gap-1.5">
                    <Syringe className="w-3.5 h-3.5 text-teal-400" />
                    Vasopressin (Refractory Vasoplegia)
                  </span>
                  <span className="font-mono text-teal-200 font-bold">
                    {patientState.vasoactiveRates.vasopressinUnitsKgMin.toFixed(4)} U/kg/min
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.002"
                  step="0.0002"
                  value={patientState.vasoactiveRates.vasopressinUnitsKgMin}
                  onChange={(e) => handleTitrateDrug('VASOPRESSIN', parseFloat(e.target.value))}
                  className="w-full accent-teal-500 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500 flex justify-between">
                  <span>0.0000 (Off)</span>
                  <span>0.0003-0.0007</span>
                  <span>0.0020 (Max)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sepsis 1-Hour Bundle & Metabolic Rescue */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Pill className="w-5 h-5 text-emerald-400" />
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                PALS 1-Hour Sepsis Bundle & Metabolic Rescue
              </h2>
            </div>

            {/* Metabolic Status Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Glucose */}
              <div
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  patientState.metabolic.bloodGlucoseMgDl < 70
                    ? 'bg-rose-950/40 border-rose-600 text-rose-200'
                    : 'bg-slate-950/70 border-slate-800 text-slate-200'
                }`}
              >
                <div>
                  <div className="text-[11px] text-slate-400">Point-of-Care Glucose</div>
                  <div className="text-lg font-black font-mono mt-0.5">
                    {patientState.metabolic.bloodGlucoseMgDl} mg/dL
                  </div>
                </div>
                {patientState.metabolic.bloodGlucoseMgDl < 70 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-600 text-white">
                    LOW
                  </span>
                )}
              </div>

              {/* Ionized Calcium */}
              <div
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  patientState.metabolic.ionizedCalciumMmolL < 1.1
                    ? 'bg-amber-950/40 border-amber-600 text-amber-200'
                    : 'bg-slate-950/70 border-slate-800 text-slate-200'
                }`}
              >
                <div>
                  <div className="text-[11px] text-slate-400">Ionized Calcium (iCa)</div>
                  <div className="text-lg font-black font-mono mt-0.5">
                    {patientState.metabolic.ionizedCalciumMmolL.toFixed(2)} mmol/L
                  </div>
                </div>
                {patientState.metabolic.ionizedCalciumMmolL < 1.1 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-600 text-white">
                    LOW
                  </span>
                )}
              </div>

              {/* Serum Lactate */}
              <div className="p-3 rounded-xl border bg-slate-950/70 border-slate-800 text-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">Serum Lactate</div>
                  <div className="text-lg font-black font-mono text-purple-300 mt-0.5">
                    {patientState.metabolic.serumLactateMmolL.toFixed(1)} mmol/L
                  </div>
                </div>
                <span className="text-[10px] text-slate-400">Normal &lt; 2.0</span>
              </div>
            </div>

            {/* Bundle Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
              {/* Blood Cultures */}
              <button
                onClick={() => handleBundleAction('BLOOD_CULTURES')}
                disabled={patientState.bloodCulturesObtained}
                className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition ${
                  patientState.bloodCulturesObtained
                    ? 'bg-emerald-950/50 border-emerald-600 text-emerald-300 cursor-default'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>STAT Blood Cultures</span>
                </div>
                {patientState.bloodCulturesObtained && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </button>

              {/* Antibiotics */}
              <button
                onClick={() => handleBundleAction('ANTIBIOTICS')}
                disabled={patientState.antibioticsAdministered}
                className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition ${
                  patientState.antibioticsAdministered
                    ? 'bg-emerald-950/50 border-emerald-600 text-emerald-300 cursor-default'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Pill className="w-4 h-4 text-emerald-400" />
                  <span>IV Antibiotics &lt; 60m</span>
                </div>
                {patientState.antibioticsAdministered && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </button>

              {/* D10W Glucose */}
              <button
                onClick={() => handleBundleAction('D10W_GLUCOSE')}
                className="p-3 rounded-xl border border-rose-500/50 bg-rose-950/40 hover:bg-rose-900/60 text-xs font-bold text-rose-200 flex items-center justify-between transition"
              >
                <div className="flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-rose-400" />
                  <span>D10W 2 mL/kg Bolus</span>
                </div>
                {patientState.glucoseAdministered && <CheckCircle2 className="w-4 h-4 text-rose-300" />}
              </button>

              {/* Calcium Gluconate */}
              <button
                onClick={() => handleBundleAction('CALCIUM_GLUCONATE')}
                className="p-3 rounded-xl border border-amber-500/50 bg-amber-950/40 hover:bg-amber-900/60 text-xs font-bold text-amber-200 flex items-center justify-between transition"
              >
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-amber-400" />
                  <span>10% Calcium Gluconate</span>
                </div>
                {patientState.calciumAdministered && <CheckCircle2 className="w-4 h-4 text-amber-300" />}
              </button>

              {/* Stress-dose Hydrocortisone (CIRCI) */}
              <button
                onClick={() => handleBundleAction('HYDROCORTISONE')}
                className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition ${
                  patientState.hydrocortisoneAdministered
                    ? 'bg-emerald-950/50 border-emerald-600 text-emerald-300 cursor-default'
                    : 'bg-purple-950/50 hover:bg-purple-900/60 border-purple-500 text-purple-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-purple-400" />
                  <span>Hydrocortisone 2 mg/kg (CIRCI)</span>
                </div>
                {patientState.hydrocortisoneAdministered && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Debriefing Modal */}
      {showDebriefModal && debriefResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-indigo-400">
                <FileText className="w-6 h-6" />
                <h3 className="text-lg font-bold text-slate-100">
                  Pediatric Septic Shock Clinical Debrief & Competency Report
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
                <div className="text-xs text-slate-400 uppercase tracking-wider">PALS Grade</div>
                <div className="text-3xl font-black text-indigo-300 mt-0.5 font-mono">
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
                    className={`w-4 h-4 ${debriefResult.correctPhenotypeIdentified ? 'text-emerald-400' : 'text-slate-600'}`}
                  />
                  <span>Phenotype Identified</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
                  <CheckCircle2
                    className={`w-4 h-4 ${debriefResult.firstLineVasoactiveCorrect ? 'text-emerald-400' : 'text-rose-500'}`}
                  />
                  <span>First-line Vasoactive Correct</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
                  <CheckCircle2
                    className={`w-4 h-4 ${debriefResult.fluidOverloadAvoided ? 'text-emerald-400' : 'text-rose-500'}`}
                  />
                  <span>Fluid Overload Guardrail Enacted</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
                  <CheckCircle2
                    className={`w-4 h-4 ${debriefResult.bundleTimeliness ? 'text-emerald-400' : 'text-rose-500'}`}
                  />
                  <span>1-Hour Sepsis Bundle Executed</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
                  <CheckCircle2
                    className={`w-4 h-4 ${debriefResult.metabolicCorrectionsDone ? 'text-emerald-400' : 'text-rose-500'}`}
                  />
                  <span>Metabolic Rescues (D10W / Calcium)</span>
                </div>
              </div>
            </div>

            {/* Faculty Feedback */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Faculty Clinical Insights & Teaching Points
              </h4>
              <div className="space-y-2">
                {debriefResult.facultyFeedback.map((fb, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>{fb}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Close Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowDebriefModal(false)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs md:text-sm font-bold shadow-lg transition"
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
