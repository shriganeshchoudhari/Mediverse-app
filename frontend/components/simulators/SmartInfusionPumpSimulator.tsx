"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
  Syringe,
  Activity,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Sliders,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Volume2,
  Layers,
  ArrowDown,
  Info,
  BookOpen,
  Table,
  Zap
} from 'lucide-react';
import {
  MASTER_DRUG_LIBRARY,
  DersDrugLimits,
  PumpChannelState,
  GuardrailEvaluation,
  calculateInfusionRate,
  evaluateDersGuardrails,
  evaluateSecondaryHydrostatics,
  computePumpStep
} from '../../.gemini/skills/SmartInfusionPumpEngine';

export default function SmartInfusionPumpSimulator() {
  const drugKeys = Object.keys(MASTER_DRUG_LIBRARY);
  const [selectedDrugKeyA, setSelectedDrugKeyA] = useState<string>('norepinephrine');
  const drugA = MASTER_DRUG_LIBRARY[selectedDrugKeyA];

  const [patientWeightKg, setPatientWeightKg] = useState<number>(70);
  const [activeTab, setActiveTab] = useState<'pump' | 'library' | 'biophysics'>('pump');

  // Channel A State
  const [doseA, setDoseA] = useState<number>(drugA.defaultDose);
  const [vtbiA, setVtbiA] = useState<number>(250);
  const [volInfusedA, setVolInfusedA] = useState<number>(0);
  const [isPumpingA, setIsPumpingA] = useState<boolean>(false);
  const [isTubingKinkedA, setIsTubingKinkedA] = useState<boolean>(false);
  const [hasAirBubbleA, setHasAirBubbleA] = useState<boolean>(false);
  const [occlusionPressureA, setOcclusionPressureA] = useState<number>(3.2);
  const [overrideActiveA, setOverrideActiveA] = useState<boolean>(false);
  const [overrideReasonA, setOverrideReasonA] = useState<string>('');

  // Secondary Piggyback (Channel B) Hydrostatics
  const [secondaryHeightCm, setSecondaryHeightCm] = useState<number>(28); // >= 24 cm rule
  const [isSecondaryRunning, setIsSecondaryRunning] = useState<boolean>(false);

  // Guardrail evaluations
  const guardrailEvalA = useMemo(() => evaluateDersGuardrails(drugA, doseA), [drugA, doseA]);
  const hydrostaticsEval = useMemo(() => evaluateSecondaryHydrostatics(secondaryHeightCm), [secondaryHeightCm]);

  const calculatedRateA = useMemo(
    () => calculateInfusionRate(drugA, doseA, patientWeightKg),
    [drugA, doseA, patientWeightKg]
  );

  // When drug changes
  const handleDrugChangeA = (newKey: string) => {
    setSelectedDrugKeyA(newKey);
    const newDrug = MASTER_DRUG_LIBRARY[newKey];
    setDoseA(newDrug.defaultDose);
    setOverrideActiveA(false);
    setIsPumpingA(false);
  };

  // Stepper loop for pump biophysics
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPumpingA && guardrailEvalA.status !== 'HARD_HIGH' && guardrailEvalA.status !== 'HARD_LOW') {
      interval = setInterval(() => {
        // Increment volume
        setVolInfusedA(prev => parseFloat((prev + calculatedRateA / 3600).toFixed(2)));
        setVtbiA(prev => Math.max(0, parseFloat((prev - calculatedRateA / 3600).toFixed(2))));

        // Occlusion pressure dynamics
        setOcclusionPressureA(prev => {
          if (isTubingKinkedA) {
            return Math.min(16.0, parseFloat((prev + 0.8).toFixed(1)));
          } else {
            return Math.max(3.0, parseFloat((prev - 0.4).toFixed(1)));
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPumpingA, guardrailEvalA, calculatedRateA, isTubingKinkedA]);

  const handleStartPumpA = () => {
    if (guardrailEvalA.status === 'HARD_HIGH' || guardrailEvalA.status === 'HARD_LOW') {
      return; // Locked out
    }
    if ((guardrailEvalA.status === 'SOFT_HIGH' || guardrailEvalA.status === 'SOFT_LOW') && !overrideActiveA) {
      return; // Requires soft override acknowledgment
    }
    setIsPumpingA(true);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Hero Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute -top-12 -right-12 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5">
                <Syringe className="w-3.5 h-3.5" />
                Track C6 &bull; Biomedical Engineering &amp; Patient Safety
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                ISMP High-Alert Standards
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                DERS Guardrails Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Smart Infusion Pump Guardrails &amp; Dose Error Reduction System (DERS) Workstation
            </h1>
            <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
              Biomedical simulation of smart infusion pump safety systems. Experience clinical Dose Error Reduction
              Systems (DERS) with hard and soft dosing guardrails, prevent tenfold decimal programming catastrophes,
              analyze downstream occlusion pressure biophysics, and model secondary piggyback hydrostatic pressure mechanics.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs">
            <div className="text-center px-2">
              <div className="text-slate-400 font-mono text-[10px] uppercase">Drug Library</div>
              <div className="font-bold text-cyan-400 text-sm">v4.8 Clinical ICU</div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center px-2">
              <div className="text-slate-400 font-mono text-[10px] uppercase">DERS Protection</div>
              <div className="font-bold text-emerald-400 text-sm">Active &bull; 100%</div>
            </div>
          </div>
        </div>

        {/* Patient Weight Covariate */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Patient Weight (for weight-based dosing):</span>
            <input
              type="number"
              value={patientWeightKg}
              onChange={e => setPatientWeightKg(Math.max(20, Math.min(250, parseFloat(e.target.value) || 70)))}
              className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-center font-mono font-bold text-white"
            />
            <span className="text-slate-400">kg</span>
          </div>

          <div className="text-[11px] text-slate-400">
            Current Primary Line: <strong className="text-white">{drugA.name}</strong> ({drugA.standardConcentration})
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1">
        <button
          onClick={() => setActiveTab('pump')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition ${
            activeTab === 'pump' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Pump Cockpit &amp; Guardrails Engine
        </button>

        <button
          onClick={() => setActiveTab('library')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition ${
            activeTab === 'library' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Table className="w-4 h-4" />
          Master DERS Drug Library
        </button>

        <button
          onClick={() => setActiveTab('biophysics')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition ${
            activeTab === 'biophysics' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Hydrostatics &amp; Sensor Biophysics
        </button>
      </div>

      {/* Tab 1: Pump Cockpit */}
      {activeTab === 'pump' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Smart Pump Physical Console (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
              {/* Pump Header / Status Bar */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3.5 h-3.5 rounded-full ${
                      guardrailEvalA.status === 'HARD_HIGH' || guardrailEvalA.status === 'HARD_LOW'
                        ? 'bg-rose-500 animate-pulse'
                        : isPumpingA
                        ? 'bg-emerald-500 animate-pulse'
                        : 'bg-amber-500'
                    }`}
                  />
                  <span className="font-bold text-sm text-white font-mono">CHANNEL A &bull; PRIMARY</span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedDrugKeyA}
                    onChange={e => handleDrugChangeA(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-bold text-white focus:border-cyan-500 focus:outline-none"
                  >
                    {drugKeys.map(k => (
                      <option key={k} value={k}>{MASTER_DRUG_LIBRARY[k].name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Backlit LED Display Screen */}
              <div className="my-5 p-5 bg-slate-950 rounded-xl border border-slate-800 shadow-inner font-mono space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400">Programmed Dose</span>
                    <div className="text-3xl font-black text-cyan-400 tracking-tight">
                      {doseA} <span className="text-sm font-normal text-slate-400">{drugA.dosingUnits}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase text-slate-400">Infusion Rate</span>
                    <div className="text-3xl font-black text-white tracking-tight">
                      {calculatedRateA} <span className="text-sm font-normal text-slate-400">mL/hr</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-slate-400 text-[10px]">VTBI</span>
                    <div className="font-bold text-slate-200">{vtbiA.toFixed(1)} mL</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Vol Infused</span>
                    <div className="font-bold text-slate-200">{volInfusedA.toFixed(1)} mL</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Line Pressure</span>
                    <div className={`font-bold ${occlusionPressureA >= 10.0 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
                      {occlusionPressureA} psi {occlusionPressureA >= 10.0 ? '(OCCLUDED)' : ''}
                    </div>
                  </div>
                </div>
              </div>

              {/* DERS Guardrail Feedback Box */}
              <div
                className={`p-4 rounded-xl border text-xs space-y-2 ${
                  guardrailEvalA.status === 'HARD_HIGH' || guardrailEvalA.status === 'HARD_LOW'
                    ? 'bg-rose-950/40 border-rose-500/80 shadow-lg shadow-rose-900/30'
                    : guardrailEvalA.status === 'SOFT_HIGH' || guardrailEvalA.status === 'SOFT_LOW'
                    ? 'bg-amber-950/40 border-amber-500/80 shadow-lg shadow-amber-900/30'
                    : 'bg-emerald-950/30 border-emerald-500/50'
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  {guardrailEvalA.severity === 'danger' ? (
                    <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />
                  ) : guardrailEvalA.severity === 'warning' ? (
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  )}
                  <span className="text-white">DERS Safety Guardrail Status: {guardrailEvalA.status}</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">{guardrailEvalA.message}</p>

                {/* Soft Limit Override Form */}
                {guardrailEvalA.allowsOverride && (
                  <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Enter clinical override rationale (e.g. Refractory Septic Shock)..."
                      value={overrideReasonA}
                      onChange={e => setOverrideReasonA(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                    />
                    <button
                      onClick={() => setOverrideActiveA(true)}
                      disabled={!overrideReasonA}
                      className={`px-3 py-1 text-xs font-bold rounded ${
                        overrideReasonA
                          ? 'bg-amber-600 hover:bg-amber-500 text-white'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {overrideActiveA ? 'Override Confirmed' : 'Confirm Override'}
                    </button>
                  </div>
                )}
              </div>

              {/* Pump Operation Controls */}
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <button
                  onClick={handleStartPumpA}
                  disabled={isPumpingA || guardrailEvalA.status === 'HARD_HIGH' || guardrailEvalA.status === 'HARD_LOW' || ((guardrailEvalA.status === 'SOFT_HIGH' || guardrailEvalA.status === 'SOFT_LOW') && !overrideActiveA)}
                  className={`py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition ${
                    isPumpingA || guardrailEvalA.status === 'HARD_HIGH' || guardrailEvalA.status === 'HARD_LOW' || ((guardrailEvalA.status === 'SOFT_HIGH' || guardrailEvalA.status === 'SOFT_LOW') && !overrideActiveA)
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  START
                </button>

                <button
                  onClick={() => setIsPumpingA(false)}
                  disabled={!isPumpingA}
                  className={`py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition ${
                    !isPumpingA
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md'
                  }`}
                >
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  PAUSE
                </button>

                <button
                  onClick={() => setIsTubingKinkedA(prev => !prev)}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition ${
                    isTubingKinkedA
                      ? 'bg-amber-600 border-amber-500 text-white animate-pulse'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {isTubingKinkedA ? 'Kinked Tubing (Clear)' : 'Simulate Tubing Kink'}
                </button>

                <button
                  onClick={() => {
                    setDoseA(drugA.defaultDose);
                    setOverrideActiveA(false);
                    setOverrideReasonA('');
                  }}
                  className="py-2 px-3 text-xs font-semibold rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300"
                >
                  Reset Dose
                </button>
              </div>

              {/* Interactive Dose Tuning Sliders & Tenfold Error Presets */}
              <div className="mt-6 pt-5 border-t border-slate-800 space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Adjust Target Dose ({drugA.dosingUnits}):</span>
                    <span className="font-mono text-cyan-400 font-bold">{doseA}</span>
                  </div>
                  <input
                    type="range"
                    min={drugA.hardLowerLimit}
                    max={drugA.hardUpperLimit * 1.3}
                    step={drugA.dosingUnits === 'mcg/kg/min' ? 0.01 : 0.5}
                    value={doseA}
                    onChange={e => {
                      setDoseA(parseFloat(e.target.value));
                      setOverrideActiveA(false);
                    }}
                    className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-950 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                    <span>Hard Min: {drugA.hardLowerLimit}</span>
                    <span className="text-emerald-400">Soft: {drugA.softLowerLimit} &ndash; {drugA.softUpperLimit}</span>
                    <span className="text-rose-400">Hard Max: {drugA.hardUpperLimit}</span>
                  </div>
                </div>

                {/* Tenfold Decimal Programming Error Simulation */}
                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
                  <div className="text-[11px] font-bold text-amber-400">Simulate Typical Clinical Programming Errors:</div>
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <button
                      onClick={() => setDoseA(parseFloat((drugA.defaultDose * 10).toFixed(2)))}
                      className="px-2.5 py-1 rounded bg-rose-950/60 border border-rose-500/40 text-rose-300 font-mono text-[11px]"
                    >
                      10x Decimal Error ({parseFloat((drugA.defaultDose * 10).toFixed(2))})
                    </button>
                    <button
                      onClick={() => setDoseA(parseFloat((drugA.defaultDose * 0.1).toFixed(3)))}
                      className="px-2.5 py-1 rounded bg-amber-950/60 border border-amber-500/40 text-amber-300 font-mono text-[11px]"
                    >
                      0.1x Underdose Error ({parseFloat((drugA.defaultDose * 0.1).toFixed(3))})
                    </button>
                    <button
                      onClick={() => setDoseA(drugA.softUpperLimit * 1.1)}
                      className="px-2.5 py-1 rounded bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 font-mono text-[11px]"
                    >
                      Soft-Max Borderline ({parseFloat((drugA.softUpperLimit * 1.1).toFixed(2))})
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Secondary Piggyback Hydrostatic Pressure Physics (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Secondary Piggyback Mechanics Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-bold text-white text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  Secondary Piggyback Hydrostatic Mechanics
                </span>
                <span className="text-[11px] font-mono text-amber-400 font-bold">&Delta;h &ge; 24 cm Rule</span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Secondary Container Height Differential:</span>
                    <span className="font-mono text-amber-400 font-bold">{secondaryHeightCm} cm</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={45}
                    value={secondaryHeightCm}
                    onChange={e => setSecondaryHeightCm(parseInt(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-950 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                    <span className="text-rose-400">0 cm (Same Level)</span>
                    <span className="text-emerald-400 font-bold">24 cm Threshold</span>
                    <span>45 cm (Hanger Extender)</span>
                  </div>
                </div>

                <div
                  className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                    hydrostaticsEval.isPrimarySuppressed
                      ? 'bg-emerald-950/30 border-emerald-500/50'
                      : 'bg-rose-950/40 border-rose-500/70'
                  }`}
                >
                  <div className="font-bold text-white flex items-center gap-1.5">
                    {hydrostaticsEval.isPrimarySuppressed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-400 animate-pulse" />
                    )}
                    Effective Delivery Source: {hydrostaticsEval.effectiveFlowSource}
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{hydrostaticsEval.message}</p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1">
                  <div className="font-bold text-cyan-400">Hydrostatic Pressure Biophysics (&rho;gh):</div>
                  <p className="text-slate-400 leading-relaxed">
                    A secondary infusion set relies strictly on hydrostatic pressure to close the primary one-way check valve.
                    If the secondary bag is not hung at least 9.5 inches (24 cm) higher than the primary fluid level, the primary
                    fluid will continue to infuse, resulting in severe delays in time-critical antibiotics or chemotherapeutics.
                  </p>
                </div>
              </div>
            </div>

            {/* Black Box Warning Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span className="font-bold text-xs text-white">FDA Black Box Safety Advisory: {drugA.name}</span>
              </div>
              <p className="text-xs text-rose-300 leading-relaxed bg-rose-950/30 p-3 rounded-xl border border-rose-500/40">
                {drugA.blackBoxWarning}
              </p>
              <div className="text-[11px] text-slate-400">
                <strong>Mechanism:</strong> {drugA.mechanismSummary}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Master DERS Drug Library */}
      {activeTab === 'library' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center gap-2">
            <Table className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Master Hospital DERS Drug Library &amp; Guardrail Limits</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Medication</th>
                  <th className="py-3 px-4">Concentration</th>
                  <th className="py-3 px-4">Units</th>
                  <th className="py-3 px-4">Hard Min</th>
                  <th className="py-3 px-4">Soft Range</th>
                  <th className="py-3 px-4">Hard Max</th>
                  <th className="py-3 px-4">Clinical Rationale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {drugKeys.map(k => {
                  const d = MASTER_DRUG_LIBRARY[k];
                  return (
                    <tr key={k} className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-4 font-bold text-white">{d.name}</td>
                      <td className="py-2.5 px-4 font-mono text-cyan-400">{d.standardConcentration}</td>
                      <td className="py-2.5 px-4 font-mono text-slate-400">{d.dosingUnits}</td>
                      <td className="py-2.5 px-4 text-rose-400 font-mono">{d.hardLowerLimit}</td>
                      <td className="py-2.5 px-4 text-emerald-400 font-mono">{d.softLowerLimit} &ndash; {d.softUpperLimit}</td>
                      <td className="py-2.5 px-4 text-rose-400 font-mono font-bold">{d.hardUpperLimit}</td>
                      <td className="py-2.5 px-4 text-slate-400 text-[11px]">{d.category} safety profile</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Biophysics */}
      {activeTab === 'biophysics' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Smart Pump Biomedical Engineering &amp; Sensor Biophysics</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Downstream Occlusion Compliance:</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                When an infusion line becomes occluded (e.g. kinked line or positional vein), the positive displacement peristaltic pump continues advancing, stretching the elastomeric IV tubing and creating pressurized compliance volume. Releasing the kink without aspirating delivers a high-pressure bolus into the patient, which in the case of vasoactive drugs can trigger sudden dangerous hypertensive emergencies.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Air-in-Line Ultrasonic Detection:</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ultrasonic sensors utilize high-frequency acoustic transducers positioned across the infusion tubing. Liquid transmits ultrasound with low attenuation, whereas air bubbles present a severe acoustic impedance mismatch, attenuating the beam and triggering an immediate emergency alarm to prevent lethal venous air embolism.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
