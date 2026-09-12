'use client';

import React, { useState, useMemo } from 'react';
import {
  Droplets,
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Heart,
  Play,
  RotateCcw,
  Sparkles,
  Stethoscope,
  Wind,
  Layers,
  FileCheck,
  ShieldAlert,
  Flame,
  Zap,
  ChevronRight,
  Info,
  Beaker,
  Syringe,
  Gauge,
  Sliders,
} from 'lucide-react';
import {
  calculatePlasmaVolume,
  calculateSoluteRemovalPercent,
  initializeTpeSession,
  stepTpeProcedure,
  evaluateCoagulationAndElectrolytes,
  getAsfaIndication,
  ASFA_INDICATIONS,
  PatientDemographics,
  TpeProcedureSettings,
  TpeLiveState,
  ReplacementFluidType,
} from '../../.gemini/skills/TherapeuticPlasmaExchangeEngine';

export default function TherapeuticPlasmaExchangeSimulator() {
  // Clinical Scenario Selection
  const [selectedScenario, setSelectedScenario] = useState<'ttp' | 'myasthenia_gravis' | 'gbs' | 'anti_gbm'>('ttp');

  // Patient Demographics
  const [patient, setPatient] = useState<PatientDemographics>({
    weightKg: 70,
    hematocritFraction: 0.36,
    baselinePathogenConc: 100,
    baselineFibrinogenMgDl: 320,
    baselinePlatelets: 18000, // TTP presentation
    baselineIonizedCaMmolL: 1.22,
  });

  // Procedure Settings
  const [settings, setSettings] = useState<TpeProcedureSettings>({
    targetPvMultiplier: 1.2,
    replacementFluidType: 'ffp', // TTP requires FFP
    splitFfpFraction: 0.25,
    acdaRatio: 12,
    bloodFlowRateMlMin: 100,
    calciumGluconateInfusionMgHr: 1000,
    hasLiverImpairment: false,
  });

  // Live Simulation State
  const [liveState, setLiveState] = useState<TpeLiveState>(() =>
    initializeTpeSession(
      {
        weightKg: 70,
        hematocritFraction: 0.36,
        baselinePathogenConc: 100,
        baselineFibrinogenMgDl: 320,
        baselinePlatelets: 18000,
        baselineIonizedCaMmolL: 1.22,
      },
      {
        targetPvMultiplier: 1.2,
        replacementFluidType: 'ffp',
        splitFfpFraction: 0.25,
        acdaRatio: 12,
        bloodFlowRateMlMin: 100,
        calciumGluconateInfusionMgHr: 1000,
        hasLiverImpairment: false,
      }
    )
  );

  // Derived Evaluations
  const pvCalculated = useMemo(
    () => calculatePlasmaVolume(patient.weightKg, patient.hematocritFraction),
    [patient.weightKg, patient.hematocritFraction]
  );

  const safetyAudit = useMemo(
    () => evaluateCoagulationAndElectrolytes(liveState, settings),
    [liveState, settings]
  );

  const currentIndication = useMemo(
    () => getAsfaIndication(selectedScenario),
    [selectedScenario]
  );

  // Handle Scenario Switching
  const handleLoadScenario = (scenarioKey: 'ttp' | 'myasthenia_gravis' | 'gbs' | 'anti_gbm') => {
    setSelectedScenario(scenarioKey);
    if (scenarioKey === 'ttp') {
      const p: PatientDemographics = {
        weightKg: 68,
        hematocritFraction: 0.32,
        baselinePathogenConc: 100,
        baselineFibrinogenMgDl: 340,
        baselinePlatelets: 16000,
        baselineIonizedCaMmolL: 1.24,
      };
      const s: TpeProcedureSettings = {
        targetPvMultiplier: 1.5,
        replacementFluidType: 'ffp',
        splitFfpFraction: 0.25,
        acdaRatio: 12,
        bloodFlowRateMlMin: 100,
        calciumGluconateInfusionMgHr: 1200,
        hasLiverImpairment: false,
      };
      setPatient(p);
      setSettings(s);
      setLiveState(initializeTpeSession(p, s));
    } else if (scenarioKey === 'myasthenia_gravis') {
      const p: PatientDemographics = {
        weightKg: 62,
        hematocritFraction: 0.38,
        baselinePathogenConc: 100,
        baselineFibrinogenMgDl: 280,
        baselinePlatelets: 240000,
        baselineIonizedCaMmolL: 1.25,
      };
      const s: TpeProcedureSettings = {
        targetPvMultiplier: 1.0,
        replacementFluidType: 'albumin_5',
        splitFfpFraction: 0.25,
        acdaRatio: 12,
        bloodFlowRateMlMin: 90,
        calciumGluconateInfusionMgHr: 1000,
        hasLiverImpairment: false,
      };
      setPatient(p);
      setSettings(s);
      setLiveState(initializeTpeSession(p, s));
    } else if (scenarioKey === 'gbs') {
      const p: PatientDemographics = {
        weightKg: 82,
        hematocritFraction: 0.42,
        baselinePathogenConc: 100,
        baselineFibrinogenMgDl: 310,
        baselinePlatelets: 210000,
        baselineIonizedCaMmolL: 1.20,
      };
      const s: TpeProcedureSettings = {
        targetPvMultiplier: 1.2,
        replacementFluidType: 'albumin_5',
        splitFfpFraction: 0.25,
        acdaRatio: 10, // higher citrate load
        bloodFlowRateMlMin: 110,
        calciumGluconateInfusionMgHr: 0, // No calcium replacement -> demonstrate paresthesias!
        hasLiverImpairment: false,
      };
      setPatient(p);
      setSettings(s);
      setLiveState(initializeTpeSession(p, s));
    } else if (scenarioKey === 'anti_gbm') {
      const p: PatientDemographics = {
        weightKg: 74,
        hematocritFraction: 0.29,
        baselinePathogenConc: 100,
        baselineFibrinogenMgDl: 360,
        baselinePlatelets: 190000,
        baselineIonizedCaMmolL: 1.23,
      };
      const s: TpeProcedureSettings = {
        targetPvMultiplier: 1.5,
        replacementFluidType: 'split_albumin_ffp',
        splitFfpFraction: 0.30,
        acdaRatio: 12,
        bloodFlowRateMlMin: 100,
        calciumGluconateInfusionMgHr: 1000,
        hasLiverImpairment: false,
      };
      setPatient(p);
      setSettings(s);
      setLiveState(initializeTpeSession(p, s));
    }
  };

  // Step Simulation
  const handleStepProcedure = (deltaMin: number) => {
    setLiveState((prev) => stepTpeProcedure(prev, patient, settings, deltaMin));
  };

  const handleReset = () => {
    setLiveState(initializeTpeSession(patient, settings));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Indication Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20">
                <Droplets className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                  Therapeutic Plasma Exchange (TPE) Workstation
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    ASFA 2023 Guidelines
                  </span>
                </h1>
                <p className="text-xs text-slate-400">
                  Extracorporeal Plasmapheresis, First-Order Solute Removal, Replacement Fluid Dynamics (5% Albumin vs FFP), ACD-A Citrate &amp; Calcium Titration
                </p>
              </div>
            </div>
          </div>

          {/* Scenario Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Clinical Indication:</span>
            <button
              onClick={() => handleLoadScenario('ttp')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                selectedScenario === 'ttp'
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              1. TTP (Category I - FFP)
            </button>
            <button
              onClick={() => handleLoadScenario('myasthenia_gravis')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                selectedScenario === 'myasthenia_gravis'
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              2. Myasthenia Crisis (Albumin)
            </button>
            <button
              onClick={() => handleLoadScenario('gbs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                selectedScenario === 'gbs'
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              3. GBS (Citrate Toxicity)
            </button>
            <button
              onClick={() => handleLoadScenario('anti_gbm')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                selectedScenario === 'anti_gbm'
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              4. Anti-GBM (Split Alb/FFP)
            </button>
          </div>
        </div>

        {/* Indication Summary Badge Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">{currentIndication.name}</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              ASFA Category {currentIndication.asfaCategory}
            </span>
          </div>
          <div className="text-slate-400 text-[11px] max-w-xl truncate">
            <strong>Target:</strong> {currentIndication.primaryTargetSubstance}
          </div>
        </div>
      </div>

      {/* Main Grid: Apheresis Controls & Live Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Circuit Schematic & Kinetics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Apheresis Live Telemetry Dashboard */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-400" />
                Apheresis Live Exchange Status
              </h3>
              <span
                className={`px-3 py-1 text-xs font-bold rounded-full ${
                  liveState.procedureCompleted
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                }`}
              >
                {liveState.procedureCompleted
                  ? 'SESSION COMPLETED'
                  : `IN PROGRESS (${liveState.procedureMinutes} MIN)`}
              </span>
            </div>

            {/* Live Metrics Quad */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* 1. Volume Exchanged */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Plasma Exchanged
                </span>
                <div className="text-xl font-black text-indigo-300 flex items-baseline gap-1">
                  {liveState.exchangedVolumeMl.toFixed(0)}
                  <span className="text-xs text-slate-400 font-normal">mL</span>
                </div>
                <div className="text-[10px] text-slate-500">
                  {liveState.fractionPvExchanged.toFixed(2)} PV / {(settings.targetPvMultiplier * liveState.plasmaVolumeMl).toFixed(0)} mL
                </div>
              </div>

              {/* 2. Solute Removal */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Pathogen Cleared
                </span>
                <div className="text-xl font-black text-emerald-400 flex items-baseline gap-1">
                  {liveState.pathogenRemovalPercent.toFixed(1)}%
                </div>
                <div className="text-[10px] text-slate-500">
                  Residual Titer: {liveState.currentPathogenConc.toFixed(1)}%
                </div>
              </div>

              {/* 3. Fibrinogen */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Fibrinogen
                </span>
                <div
                  className={`text-xl font-black flex items-baseline gap-1 ${
                    liveState.currentFibrinogenMgDl < 70
                      ? 'text-rose-400'
                      : liveState.currentFibrinogenMgDl < 100
                      ? 'text-amber-300'
                      : 'text-indigo-200'
                  }`}
                >
                  {liveState.currentFibrinogenMgDl}
                  <span className="text-xs text-slate-400 font-normal">mg/dL</span>
                </div>
                <div className="text-[10px] text-slate-500">
                  {liveState.currentFibrinogenMgDl < 100 ? 'Bleeding Risk Alert!' : 'Goal >= 100 mg/dL'}
                </div>
              </div>

              {/* 4. Ionized Calcium */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Ionized Ca2+
                </span>
                <div
                  className={`text-xl font-black flex items-baseline gap-1 ${
                    liveState.systemicIonizedCaMmolL < 0.90
                      ? 'text-rose-400'
                      : liveState.systemicIonizedCaMmolL < 1.05
                      ? 'text-amber-300'
                      : 'text-emerald-400'
                  }`}
                >
                  {liveState.systemicIonizedCaMmolL.toFixed(2)}
                  <span className="text-xs text-slate-400 font-normal">mmol/L</span>
                </div>
                <div className="text-[10px] text-slate-500">
                  Ratio: {liveState.totalCaToIonizedCaRatio.toFixed(1)} {liveState.totalCaToIonizedCaRatio > 2.5 && '(Citrate Lock!)'}
                </div>
              </div>
            </div>

            {/* Visual First-Order Exponential Clearance Bar */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>First-Order Exponential Washout: C(Ve)/C0 = e^(-Ve/PV)</span>
                <span className="text-indigo-400 font-mono">
                  {liveState.fractionPvExchanged.toFixed(2)} PV Exchanged
                </span>
              </div>
              <div className="w-full bg-slate-800 h-3.5 rounded-full overflow-hidden flex">
                <div
                  className="bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 h-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (liveState.fractionPvExchanged / settings.targetPvMultiplier) * 100)}%`,
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                <span>0.0 PV (0%)</span>
                <span>1.0 PV (63.2%)</span>
                <span>1.5 PV (77.7%)</span>
                <span>2.0 PV (86.5%)</span>
              </div>
            </div>

            {/* Controls to Advance Procedure Time */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                disabled={liveState.procedureCompleted}
                onClick={() => handleStepProcedure(15)}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow"
              >
                <Play className="w-3.5 h-3.5" />
                Advance Exchange +15 min
              </button>
              <button
                disabled={liveState.procedureCompleted}
                onClick={() => handleStepProcedure(45)}
                className="px-4 py-2.5 bg-indigo-700 hover:bg-indigo-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow"
              >
                <Clock className="w-3.5 h-3.5" />
                Advance Exchange +45 min
              </button>
              <button
                onClick={handleReset}
                className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ml-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Session
              </button>
            </div>

            {/* Audit Log */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-1.5 max-h-36 overflow-y-auto font-mono text-xs">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Apheresis Instrument Execution Log:
              </div>
              {liveState.log.map((entry, idx) => (
                <div key={idx} className="text-slate-300 text-[11px] leading-relaxed">
                  &bull; {entry}
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Circuit & Prescriptions */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              Prescription &amp; Extracorporeal Parameters
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Target PV Slider */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">
                    Target Exchange Volume (PV Multiplier)
                  </span>
                  <span className="text-xs font-bold text-indigo-400">
                    {settings.targetPvMultiplier.toFixed(1)} PV (
                    {(settings.targetPvMultiplier * pvCalculated).toFixed(0)} mL)
                  </span>
                </div>
                <input
                  type="range"
                  min={0.8}
                  max={2.0}
                  step={0.1}
                  value={settings.targetPvMultiplier}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      targetPvMultiplier: parseFloat(e.target.value),
                    })
                  }
                  className="w-full accent-indigo-500"
                />
                <div className="text-[11px] text-slate-400">
                  Standard exchange is 1.0 - 1.5 PV. Higher volumes hit diminishing returns.
                </div>
              </div>

              {/* Replacement Fluid Selector */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-200 block">
                  Replacement Fluid Solution:
                </span>
                <select
                  value={settings.replacementFluidType}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      replacementFluidType: e.target.value as ReplacementFluidType,
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                >
                  <option value="albumin_5">
                    100% 5% Human Albumin (Standard for Neuro/Renal)
                  </option>
                  <option value="ffp">
                    100% Fresh Frozen Plasma (Mandatory for TTP)
                  </option>
                  <option value="split_albumin_ffp">
                    Split: 75% Albumin + 25% FFP Finish (Coagulation Guard)
                  </option>
                </select>
                <div className="text-[11px] text-slate-400">
                  {settings.replacementFluidType === 'albumin_5'
                    ? 'Causes dilutional hypofibrinogenemia; no viral/allergic risks.'
                    : settings.replacementFluidType === 'ffp'
                    ? 'Delivers ADAMTS13; carries risk of TRALI/TACO and allergic reactions.'
                    : 'Restores clotting factors in final phase while minimizing donor exposure.'}
                </div>
              </div>

              {/* ACD-A Ratio */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">
                    Blood : ACD-A Anticoagulation Ratio
                  </span>
                  <span className="text-xs font-bold text-indigo-400">
                    {settings.acdaRatio} : 1
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={16}
                  step={1}
                  value={settings.acdaRatio}
                  onChange={(e) =>
                    setSettings({ ...settings, acdaRatio: parseInt(e.target.value) })
                  }
                  className="w-full accent-indigo-500"
                />
                <div className="text-[11px] text-slate-400">
                  Lower ratio (e.g. 10:1) increases circuit anticoagulation but delivers higher citrate load.
                </div>
              </div>

              {/* IV Calcium Gluconate Infusion */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">
                    IV Calcium Gluconate Continuous Infusion
                  </span>
                  <span className="text-xs font-bold text-emerald-400">
                    {settings.calciumGluconateInfusionMgHr} mg/hr
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={2000}
                  step={100}
                  value={settings.calciumGluconateInfusionMgHr}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      calciumGluconateInfusionMgHr: parseInt(e.target.value),
                    })
                  }
                  className="w-full accent-emerald-500"
                />
                <div className="text-[11px] text-slate-400">
                  Typical dose 1000 mg/hr prevents perioral tingling and severe tetany.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Safety Audit & Clinical Pearls */}
        <div className="space-y-4">
          {/* Patient Plasma Volume Calculator Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-indigo-400" />
              Patient Plasma Volume (PV)
            </h3>
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Body Weight:</span>
                <span className="text-xs font-bold text-slate-200">{patient.weightKg} kg</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Hematocrit:</span>
                <span className="text-xs font-bold text-slate-200">
                  {(patient.hematocritFraction * 100).toFixed(0)}%
                </span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between font-bold">
                <span className="text-xs text-indigo-300">Estimated PV:</span>
                <span className="text-base text-indigo-400">{pvCalculated} mL</span>
              </div>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              PV = Weight &times; 70 mL/kg &times; (1 - Hct)
            </div>
          </div>

          {/* Safety & Coagulation Audit */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Safety &amp; Coagulation Audit
            </h3>

            <div
              className={`p-3.5 rounded-xl border space-y-2 ${
                safetyAudit.isSafe
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
              }`}
            >
              <div className="flex items-center justify-between font-bold text-xs">
                <span>Bleeding Risk: {safetyAudit.bleedingRisk}</span>
                {safetyAudit.isSafe ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                )}
              </div>

              {/* Patient Symptom Alert */}
              {liveState.citrateToxicityLevel !== 'none' && (
                <div className="p-2 rounded bg-amber-500/20 border border-amber-500/30 text-amber-200 text-xs font-semibold">
                  Symptom: {liveState.citrateToxicityLevel.replace(/_/g, ' ')}
                </div>
              )}

              {safetyAudit.warnings.length > 0 && (
                <ul className="space-y-1.5 text-xs text-slate-300 pt-1">
                  {safetyAudit.warnings.map((w, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {safetyAudit.recommendations.length > 0 && (
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5 text-xs text-slate-300">
                <div className="font-bold text-indigo-300">Clinical Action Plan:</div>
                <ul className="space-y-1 text-[11px] text-slate-400 list-disc pl-4">
                  {safetyAudit.recommendations.map((r, idx) => (
                    <li key={idx}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* ASFA High-Yield Teaching Pearls */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              ASFA 2023 Guidelines Pearl
            </h4>
            <div className="space-y-2 text-xs text-slate-400 leading-relaxed">
              <p className="font-semibold text-slate-200">
                {currentIndication.replacementRationale}
              </p>
              <ul className="space-y-1.5 list-disc pl-4 text-[11px]">
                {currentIndication.clinicalPearls.map((pearl, idx) => (
                  <li key={idx}>{pearl}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
