'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  PPH_SCENARIOS,
  PphScenarioPresetId,
  PphPatientState,
  PphStage,
  UterotonicDrug,
  FourTEtiology,
  initializePphState,
  administerUterotonic,
  titrateBakriBalloon,
  transfuseBloodProducts,
  advancePphTimeStep,
  evaluatePphPerformance,
  PphDebriefResult,
} from '../../.gemini/skills/PostpartumHemorrhageEngine';
import {
  Baby,
  Heart,
  Droplets,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Activity,
  Syringe,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Award,
  Layers,
  Sparkles,
  Stethoscope,
  Scissors,
} from 'lucide-react';

export const PostpartumHemorrhageSimulator: React.FC = () => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<PphScenarioPresetId>(
    'CLASSIC_ATONY_PROLONGED_LABOR'
  );
  const [state, setState] = useState<PphPatientState>(() =>
    initializePphState('CLASSIC_ATONY_PROLONGED_LABOR')
  );
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [showDebriefModal, setShowDebriefModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'uterotonics' | 'bakri' | 'resuscitation' | '4t_bench'>('uterotonics');
  const [bakriVolumeInput, setBakriVolumeInput] = useState<number>(350);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const scenario = useMemo(() => PPH_SCENARIOS[selectedScenarioId], [selectedScenarioId]);

  // Simulation clock ticker (advances every 3 seconds = 15 sim seconds)
  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setState((prev) => advancePphTimeStep(prev, 15));
    }, 3000);
    return () => clearInterval(timer);
  }, [isRunning]);

  const handleScenarioChange = (id: PphScenarioPresetId) => {
    setSelectedScenarioId(id);
    setState(initializePphState(id));
    setIsRunning(true);
    setShowDebriefModal(false);
    setActionMessage(null);
  };

  const handleReset = () => {
    setState(initializePphState(selectedScenarioId));
    setIsRunning(true);
    setShowDebriefModal(false);
    setActionMessage(null);
  };

  const handleAdministerDrug = (drug: UterotonicDrug, route: string, dose: string) => {
    const result = administerUterotonic(state, drug, route, dose);
    setState(result.updatedState);
    setActionMessage(result.message);
  };

  const handleInflateBakri = () => {
    const result = titrateBakriBalloon(state, bakriVolumeInput);
    setState(result.updatedState);
    setActionMessage(result.message);
  };

  const handleTransfuse = (product: 'PRBC' | 'FFP' | 'PLATELETS' | 'CRYOPRECIPITATE', units: number) => {
    const result = transfuseBloodProducts(state, product, units);
    setState(result.updatedState);
    setActionMessage(result.message);
  };

  const handleBimanualCompressionToggle = () => {
    setState((prev) => {
      const active = !prev.bimanualCompressionActive;
      const rate = active ? Math.max(20, prev.activeBleedingRateMlMin * 0.5) : prev.activeBleedingRateMlMin * 1.5;
      return {
        ...prev,
        bimanualCompressionActive: active,
        activeBleedingRateMlMin: Math.round(rate),
        interventionsPerformed: active
          ? [...prev.interventionsPerformed, 'Bimanual Uterine Compression Initiated']
          : prev.interventionsPerformed,
      };
    });
    setActionMessage(
      !state.bimanualCompressionActive
        ? 'Bimanual Uterine Compression engaged: manual pressure applied to anterior and posterior walls.'
        : 'Bimanual Uterine Compression released.'
    );
  };

  const debrief = useMemo<PphDebriefResult>(() => evaluatePphPerformance(state), [state]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 lg:p-8 font-sans">
      {/* Header Banner */}
      <header className="mb-6 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-600/20 border border-rose-500/40 rounded-xl text-rose-400">
              <Baby className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  Obstetric Postpartum Hemorrhage (PPH) Workstation
                </h1>
                <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full">
                  CMQCC / ACOG 4-Stage Protocol
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Quantitative Blood Loss (QBL), Maternal Shock Index, Sequential Uterotonics with Safety Interlocks &amp; Bakri Tamponade
              </p>
            </div>
          </div>

          {/* Scenario & Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedScenarioId}
              onChange={(e) => handleScenarioChange(e.target.value as PphScenarioPresetId)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 font-medium focus:ring-2 focus:ring-rose-500 focus:outline-none"
            >
              {Object.values(PPH_SCENARIOS).map((sc) => (
                <option key={sc.id} value={sc.id}>
                  {sc.title}
                </option>
              ))}
            </select>

            <button
              onClick={() => setIsRunning(!isRunning)}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition"
              title={isRunning ? 'Pause Simulation' : 'Resume Simulation'}
            >
              {isRunning ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              onClick={handleReset}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition"
              title="Reset Scenario"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowDebriefModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/30 rounded-lg text-xs font-semibold transition"
            >
              <Award className="w-4 h-4" />
              Debrief Report
            </button>
          </div>
        </div>

        {/* Patient Clinical Profile */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
            <span className="text-slate-400 block font-semibold">Patient &amp; Parity</span>
            <span className="text-slate-200 font-medium">
              {scenario.patientAge} yo • {scenario.gravidaPara} • {scenario.gestationalWeeks} wks ({scenario.deliveryMode})
            </span>
          </div>
          <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800 md:col-span-2">
            <span className="text-slate-400 block font-semibold">Clinical Presentation</span>
            <span className="text-slate-300 font-medium line-clamp-1">{scenario.deliverySummary}</span>
          </div>
          <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
            <span className="text-slate-400 block font-semibold">High-Risk Factors</span>
            <span className="text-slate-200 font-medium">
              {scenario.medicalHistory.preeclampsiaSevere && <span className="text-amber-400 font-bold mr-2">Preeclampsia</span>}
              {scenario.medicalHistory.asthmaReactiveAirway && <span className="text-cyan-400 font-bold mr-2">Severe Asthma</span>}
              {scenario.medicalHistory.priorCesareanSections > 0 && (
                <span className="text-rose-400 font-bold">{scenario.medicalHistory.priorCesareanSections} Prior C-Sec</span>
              )}
              {!scenario.medicalHistory.preeclampsiaSevere &&
                !scenario.medicalHistory.asthmaReactiveAirway &&
                scenario.medicalHistory.priorCesareanSections === 0 && <span className="text-slate-400">None reported</span>}
            </span>
          </div>
        </div>
      </header>

      {/* Action Notification Banner */}
      {actionMessage && (
        <div className="mb-4 p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs flex items-center justify-between animate-in fade-in">
          <span className="text-slate-200">{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="text-slate-400 hover:text-white font-bold ml-2">
            ✕
          </button>
        </div>
      )}

      {/* Active Clinical Alarms */}
      {state.clinicalAlarms.length > 0 && (
        <div className="mb-4 space-y-2">
          {state.clinicalAlarms.map((alarm, idx) => (
            <div
              key={idx}
              className="p-3 bg-rose-950/40 border border-rose-500/60 rounded-xl text-xs text-rose-200 flex items-center gap-2.5 shadow-lg shadow-rose-950/40 animate-pulse"
            >
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <strong>{alarm}</strong>
            </div>
          ))}
        </div>
      )}

      {/* CMQCC Staging Header Bar */}
      <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-xs font-semibold">
        <div
          className={`p-3 rounded-xl border transition ${
            state.currentStage === 'STAGE_0_NORMAL'
              ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-950/30 ring-2 ring-emerald-500/20'
              : 'bg-slate-900/60 border-slate-800 text-slate-500'
          }`}
        >
          <span className="block text-[10px] uppercase font-bold">Stage 0 (Normal)</span>
          <span>&lt; 500 mL Vaginal</span>
        </div>
        <div
          className={`p-3 rounded-xl border transition ${
            state.currentStage === 'STAGE_1_ALERT'
              ? 'bg-amber-950/40 border-amber-500 text-amber-300 shadow-lg shadow-amber-950/30 ring-2 ring-amber-500/20'
              : 'bg-slate-900/60 border-slate-800 text-slate-500'
          }`}
        >
          <span className="block text-[10px] uppercase font-bold">Stage 1 (Alert)</span>
          <span>500 - 999 mL / SI ≥ 0.9</span>
        </div>
        <div
          className={`p-3 rounded-xl border transition ${
            state.currentStage === 'STAGE_2_PERSISTENT'
              ? 'bg-orange-950/40 border-orange-500 text-orange-300 shadow-lg shadow-orange-950/30 ring-2 ring-orange-500/20'
              : 'bg-slate-900/60 border-slate-800 text-slate-500'
          }`}
        >
          <span className="block text-[10px] uppercase font-bold">Stage 2 (Persistent)</span>
          <span>1000 - 1499 mL</span>
        </div>
        <div
          className={`p-3 rounded-xl border transition ${
            state.currentStage === 'STAGE_3_CRITICAL_MTP'
              ? 'bg-rose-950/50 border-rose-500 text-rose-300 shadow-lg shadow-rose-950/30 ring-2 ring-rose-500/20 animate-pulse'
              : 'bg-slate-900/60 border-slate-800 text-slate-500'
          }`}
        >
          <span className="block text-[10px] uppercase font-bold">Stage 3 (Critical MTP)</span>
          <span>≥ 1500 mL / SI ≥ 1.3 / DIC</span>
        </div>
      </div>

      {/* Maternal Telemetry & QBL Gauge Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Hemodynamic Telemetry */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 lg:col-span-2 shadow-xl">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Maternal Hemodynamic Telemetry
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Elapsed: {state.elapsedSeconds}s</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Heart Rate</span>
              <span
                className={`text-2xl font-bold font-mono ${
                  state.hemodynamics.heartRateBpm > 120
                    ? 'text-rose-400'
                    : state.hemodynamics.heartRateBpm > 100
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {state.hemodynamics.heartRateBpm}
              </span>
              <span className="text-[10px] text-slate-500 block">bpm</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Blood Pressure</span>
              <span
                className={`text-2xl font-bold font-mono ${
                  state.hemodynamics.systolicBpMmHg < 90
                    ? 'text-rose-400'
                    : state.hemodynamics.systolicBpMmHg > 140
                    ? 'text-amber-400'
                    : 'text-slate-100'
                }`}
              >
                {state.hemodynamics.systolicBpMmHg}/{state.hemodynamics.diastolicBpMmHg}
              </span>
              <span className="text-[10px] text-slate-500 block">MAP {state.hemodynamics.meanArterialPressureMmHg} mmHg</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Maternal Shock Index</span>
              <span
                className={`text-2xl font-black font-mono ${
                  state.hemodynamics.shockIndex >= 1.0
                    ? 'text-rose-400 animate-pulse'
                    : state.hemodynamics.shockIndex >= 0.9
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {state.hemodynamics.shockIndex}
              </span>
              <span className="text-[10px] text-slate-500 block">HR / SBP (target &lt; 0.9)</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Pulse Oximetry</span>
              <span
                className={`text-2xl font-bold font-mono ${
                  state.hemodynamics.spO2Percent < 92 ? 'text-rose-400' : 'text-cyan-400'
                }`}
              >
                {state.hemodynamics.spO2Percent}%
              </span>
              <span className="text-[10px] text-slate-500 block">RR {state.hemodynamics.respiratoryRateMin}/min</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Uterine Tone</span>
              <span
                className={`text-xs font-bold block mt-1 ${
                  state.uterineTone === 'WELL_CONTRACTED_FIRM'
                    ? 'text-emerald-400'
                    : state.uterineTone === 'PARTIALLY_FIRM'
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                {state.uterineTone.replace('_', ' ')}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">
                {state.bimanualCompressionActive ? 'Bimanual Active' : 'Palpable'}
              </span>
            </div>
          </div>
        </div>

        {/* Quantitative Blood Loss (QBL) Gauge */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-rose-500" />
              Quantitative Blood Loss (QBL)
            </h3>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded ${
                state.cumulativeQblMl >= 1500
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : state.cumulativeQblMl >= 1000
                  ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}
            >
              Rate: {state.activeBleedingRateMlMin} mL/min
            </span>
          </div>

          <div className="my-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Cumulative Loss</span>
              <span className="text-3xl font-black text-rose-400 font-mono">{state.cumulativeQblMl} mL</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Estimated Total Blood Vol</span>
              <span className="text-sm font-semibold text-slate-300 font-mono">
                {state.hemodynamics.estimatedBloodVolumeMl} mL
              </span>
              <span className="text-[10px] text-rose-400 block font-bold">
                {((state.cumulativeQblMl / state.hemodynamics.estimatedBloodVolumeMl) * 100).toFixed(1)}% EBL Deficit
              </span>
            </div>
          </div>

          {/* Progress Bar of Loss */}
          <div className="w-full bg-slate-950 rounded-full h-3 border border-slate-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                state.cumulativeQblMl >= 1500
                  ? 'bg-rose-600'
                  : state.cumulativeQblMl >= 1000
                  ? 'bg-orange-500'
                  : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(100, (state.cumulativeQblMl / 2500) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 mb-4 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('uterotonics')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
            activeTab === 'uterotonics'
              ? 'border-rose-500 text-rose-400 bg-slate-900/50'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Syringe className="w-4 h-4" />
          Sequential Uterotonics
        </button>
        <button
          onClick={() => setActiveTab('bakri')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
            activeTab === 'bakri'
              ? 'border-rose-500 text-rose-400 bg-slate-900/50'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          Bakri Balloon Tamponade
        </button>
        <button
          onClick={() => setActiveTab('resuscitation')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
            activeTab === 'resuscitation'
              ? 'border-rose-500 text-rose-400 bg-slate-900/50'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Droplets className="w-4 h-4" />
          MTP &amp; Coagulation Resuscitation
        </button>
        <button
          onClick={() => setActiveTab('4t_bench')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
            activeTab === '4t_bench'
              ? 'border-rose-500 text-rose-400 bg-slate-900/50'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          4 T's Diagnostic Bench
        </button>
      </div>

      {/* Tab 1: Sequential Uterotonics */}
      {activeTab === 'uterotonics' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Oxytocin */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-slate-100">1. Oxytocin (Pitocin)</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-semibold">
                    1st Line
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Gq-protein receptor agonist inducing rhythmic myometrial contractions.
                </p>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => handleAdministerDrug('OXYTOCIN', 'IV_INFUSION', '30 Units in 500 mL LR')}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition"
                >
                  Infuse 30 U in 500 mL LR (Standard)
                </button>
                <button
                  onClick={() => handleAdministerDrug('OXYTOCIN', 'IV_PUSH_RAPID', '10 Units IV Push')}
                  className="w-full py-1.5 bg-rose-950/30 hover:bg-rose-900/40 text-rose-300 text-[11px] font-semibold rounded-lg border border-rose-800/40 transition"
                  title="Rapid IV Push (Dangerous practice)"
                >
                  ⚠️ Rapid IV Push 10 U (Contraindicated)
                </button>
              </div>
            </div>

            {/* Methergine */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-slate-100">2. Methylergonovine (Methergine)</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-semibold">
                    0.2 mg IM
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Ergot alkaloid causing sustained tetanic uterine contraction.
                </p>
                {scenario.medicalHistory.preeclampsiaSevere && (
                  <div className="p-2 bg-rose-950/40 border border-rose-500/50 rounded text-[11px] text-rose-300 mb-2">
                    ⛔ CONTRAINDICATED in Severe Preeclampsia / HTN!
                  </div>
                )}
              </div>
              <button
                onClick={() => handleAdministerDrug('METHERGINE', 'IM', '0.2 mg IM')}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition"
              >
                Administer Methergine 0.2 mg IM
              </button>
            </div>

            {/* Hemabate */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-slate-100">3. Carboprost (Hemabate / PGF2α)</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-semibold">
                    250 mcg IM
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Prostaglandin F2α analogue promoting intense myometrial spasm.
                </p>
                {scenario.medicalHistory.asthmaReactiveAirway && (
                  <div className="p-2 bg-rose-950/40 border border-rose-500/50 rounded text-[11px] text-rose-300 mb-2">
                    ⛔ CONTRAINDICATED in Severe Asthma / Bronchospasm!
                  </div>
                )}
              </div>
              <button
                onClick={() => handleAdministerDrug('HEMABATE', 'IM', '250 mcg IM')}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition"
              >
                Administer Hemabate 250 mcg IM
              </button>
            </div>

            {/* Misoprostol */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-slate-100">4. Misoprostol (Cytotec / PGE1)</span>
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-semibold">
                    800 mcg PR
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  PGE1 analogue; safe in hypertension and asthma. Rapid rectal/sublingual absorption.
                </p>
              </div>
              <button
                onClick={() => handleAdministerDrug('MISOPROSTOL', 'RECTAL', '800 mcg PR')}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition"
              >
                Administer Misoprostol 800 mcg PR
              </button>
            </div>

            {/* Tranexamic Acid (TXA) */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-slate-100">5. Tranexamic Acid (WOMAN Trial)</span>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-semibold">
                    1.0 g IV
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Antifibrinolytic competitive plasminogen blocker; reduces bleeding death by 31% when given &lt; 3h.
                </p>
              </div>
              <button
                onClick={() => handleAdministerDrug('TRANEXAMIC_ACID', 'IV_INFUSION', '1.0 g IV over 10 min')}
                className="w-full py-2 bg-purple-900/40 hover:bg-purple-800/50 text-purple-200 text-xs font-bold rounded-lg border border-purple-700/50 transition"
              >
                Infuse TXA 1.0 g IV over 10 min
              </button>
            </div>

            {/* Bimanual Compression */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-slate-100">Mechanical: Bimanual Compression</span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-semibold">
                    Bedside Maneuver
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Immediate mechanical compression of anterior and posterior uterine walls between abdominal hand and vaginal fist.
                </p>
              </div>
              <button
                onClick={handleBimanualCompressionToggle}
                className={`w-full py-2 text-xs font-bold rounded-lg border transition ${
                  state.bimanualCompressionActive
                    ? 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-900/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                {state.bimanualCompressionActive ? 'Release Bimanual Compression' : 'Engage Bimanual Compression'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Bakri Balloon Tamponade */}
      {activeTab === 'bakri' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-rose-400" />
              Bakri Intrauterine Tamponade Balloon Console
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Titrate sterile isotonic saline into the 24 Fr silicone intrauterine balloon. Tamponade test evaluates whether inward hydrostatic pressure overcomes spiral arterial perfusion pressure.
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">Target Inflation Saline Volume:</span>
                <span className="font-bold text-rose-400 font-mono text-base">{bakriVolumeInput} mL</span>
              </div>
              <input
                type="range"
                min="0"
                max="500"
                step="50"
                value={bakriVolumeInput}
                onChange={(e) => setBakriVolumeInput(parseInt(e.target.value))}
                className="w-full accent-rose-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0 mL (Deflated)</span>
                <span>300 mL (Tamponade Threshold)</span>
                <span>500 mL (Max Volume)</span>
              </div>
            </div>

            <button
              onClick={handleInflateBakri}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-rose-900/30 transition flex items-center justify-center gap-2"
            >
              <Layers className="w-4 h-4" />
              Inflate Bakri Balloon to {bakriVolumeInput} mL Saline
            </button>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Tamponade Hydrodynamics &amp; Port Output
            </h3>

            <div className="grid grid-cols-2 gap-3 text-center text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Intrauterine Pressure</span>
                <span className="text-xl font-bold text-cyan-400 font-mono">
                  {state.bakriBalloon.intrauterinePressureMmHg} mmHg
                </span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Drainage Port Flow</span>
                <span
                  className={`text-xl font-bold font-mono ${
                    state.bakriBalloon.drainageLumenFlowMlMin > 50 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {state.bakriBalloon.drainageLumenFlowMlMin} mL/min
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <span className="font-semibold text-slate-300 block mb-1">Tamponade Test Status:</span>
              <span
                className={`font-bold flex items-center gap-1.5 ${
                  state.bakriBalloon.isTamponadeEffective ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {state.bakriBalloon.isTamponadeEffective ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    POSITIVE TAMPONADE TEST: Hemorrhage controlled by balloon counter-pressure.
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    NEGATIVE / UNMET: Balloon underinflated or pathology refractory (Accreta/Laceration).
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: MTP & Coagulation Resuscitation */}
      {activeTab === 'resuscitation' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-rose-500" />
              Obstetric Massive Transfusion Protocol (MTP 1:1:1)
            </h3>
            <p className="text-xs text-slate-400">
              Triggered when QBL &ge; 1500 mL or Maternal Shock Index &ge; 1.0. Balanced blood component resuscitation prevents dilutional coagulopathy.
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleTransfuse('PRBC', 2)}
                className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 font-bold transition flex flex-col items-center"
              >
                <span>Transfuse PRBCs</span>
                <span className="text-[10px] text-rose-400 font-normal mt-0.5">+2 Units PRBC</span>
              </button>
              <button
                onClick={() => handleTransfuse('FFP', 2)}
                className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 font-bold transition flex flex-col items-center"
              >
                <span>Transfuse FFP</span>
                <span className="text-[10px] text-amber-400 font-normal mt-0.5">+2 Units FFP</span>
              </button>
              <button
                onClick={() => handleTransfuse('PLATELETS', 1)}
                className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 font-bold transition flex flex-col items-center"
              >
                <span>Transfuse Platelets</span>
                <span className="text-[10px] text-cyan-400 font-normal mt-0.5">+1 Apheresis Pack</span>
              </button>
              <button
                onClick={() => handleTransfuse('CRYOPRECIPITATE', 1)}
                className="p-3 bg-purple-950/40 hover:bg-purple-900/50 text-purple-200 rounded-lg border border-purple-700/50 font-bold transition flex flex-col items-center"
              >
                <span>Cryoprecipitate STAT</span>
                <span className="text-[10px] text-purple-300 font-normal mt-0.5">+1 Pool (10 Units)</span>
              </button>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400">
              <strong className="text-slate-200 block mb-1">Transfused Totals:</strong>
              PRBC: <strong className="text-rose-400">{state.bloodProductsTransfused.prbcUnits}</strong> • FFP:{' '}
              <strong className="text-amber-400">{state.bloodProductsTransfused.ffpUnits}</strong> • Plt:{' '}
              <strong className="text-cyan-400">{state.bloodProductsTransfused.plateletUnits}</strong> • Cryo:{' '}
              <strong className="text-purple-400">{state.bloodProductsTransfused.cryoUnits} pools</strong>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              STAT Coagulation Profile &amp; Fibrinogen Threshold
            </h3>

            <div className="grid grid-cols-2 gap-3 text-center text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Fibrinogen</span>
                <span
                  className={`text-2xl font-black font-mono ${
                    state.coagulation.fibrinogenMgDl < 200 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'
                  }`}
                >
                  {state.coagulation.fibrinogenMgDl} mg/dL
                </span>
                <span className="text-[10px] text-slate-500 block">Critical: &lt; 200 mg/dL</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Platelet Count</span>
                <span
                  className={`text-2xl font-bold font-mono ${
                    state.coagulation.plateletsKUl < 100 ? 'text-rose-400' : 'text-slate-200'
                  }`}
                >
                  {state.coagulation.plateletsKUl} k/µL
                </span>
                <span className="text-[10px] text-slate-500 block">Target &gt; 50 k/µL</span>
              </div>
            </div>

            {state.coagulation.fibrinogenMgDl < 200 && (
              <div className="p-3 bg-rose-950/30 border border-rose-500/50 rounded-xl text-xs text-rose-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">CRITICAL OBSTETRIC COAGULOPATHY ALARM:</strong>
                  Fibrinogen is under 200 mg/dL. In pregnancy, this signals catastrophic microvascular consumption DIC!
                  Transfuse 10 Units Cryoprecipitate immediately.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: 4 T's Diagnostic Bench */}
      {activeTab === '4t_bench' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 block">
              1. Tone (70-80%)
            </span>
            <p className="text-xs text-slate-400 leading-relaxed">
              Uterine atony from overdistension, multiparity, or oxytocin receptor fatigue.
            </p>
            <div className="p-2 bg-slate-950 rounded border border-slate-800 text-[11px]">
              Fundus: <strong className="text-slate-200">{state.uterineTone.replace('_', ' ')}</strong>
            </div>
          </div>

          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
              2. Trauma (10-20%)
            </span>
            <p className="text-xs text-slate-400 leading-relaxed">
              Lacerations of cervix, vagina, perineum, hematomas, or uterine rupture.
            </p>
            <div className="p-2 bg-slate-950 rounded border border-slate-800 text-[11px]">
              Speculum Exam: <strong className="text-slate-200">Inspect with Ring Forceps</strong>
            </div>
          </div>

          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block">
              3. Tissue (5-10%)
            </span>
            <p className="text-xs text-slate-400 leading-relaxed">
              Retained cotyledon, succenturiate lobe, or morbidly adherent placenta accreta.
            </p>
            <div className="p-2 bg-slate-950 rounded border border-slate-800 text-[11px]">
              Cavity Exploration: <strong className="text-slate-200">Manual / Bedside Ultrasound</strong>
            </div>
          </div>

          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 block">
              4. Thrombin (1-2%)
            </span>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pre-existing coagulopathies or acquired consumption DIC from abruption or sepsis.
            </p>
            <div className="p-2 bg-slate-950 rounded border border-slate-800 text-[11px]">
              Fibrinogen: <strong className="text-slate-200">{state.coagulation.fibrinogenMgDl} mg/dL</strong>
            </div>
          </div>
        </div>
      )}

      {/* Debrief Report Modal */}
      {showDebriefModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-rose-400" />
                <h3 className="text-lg font-bold text-white">ACOG / CMQCC Obstetric Hemorrhage Debrief</h3>
              </div>
              <button onClick={() => setShowDebriefModal(false)} className="text-slate-400 hover:text-white text-lg font-bold">
                ✕
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
              <div>
                <span className="text-xs text-slate-400 block font-semibold">Resuscitation Competency</span>
                <span className="text-2xl font-bold text-white">{debrief.scorePercentage}%</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block font-semibold">Grade</span>
                <span
                  className={`text-2xl font-black ${
                    debrief.letterGrade === 'A+' || debrief.letterGrade === 'A'
                      ? 'text-emerald-400'
                      : debrief.letterGrade === 'B'
                      ? 'text-blue-400'
                      : debrief.letterGrade === 'C'
                      ? 'text-amber-400'
                      : 'text-rose-500'
                  }`}
                >
                  {debrief.letterGrade}
                </span>
              </div>
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Itemized Clinical Feedback:</h4>
              {debrief.facultyFeedback.map((fb, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg text-xs border ${
                    fb.startsWith('Fatal') || fb.startsWith('Critical')
                      ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                      : fb.startsWith('Excellent') || fb.startsWith('Appropriate')
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  {fb}
                </div>
              ))}
            </div>

            <div className="border-t border-slate-800 pt-4 flex justify-end">
              <button
                onClick={() => setShowDebriefModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
