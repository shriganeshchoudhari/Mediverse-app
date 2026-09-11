'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Droplets,
  ShieldAlert,
  Sparkles,
  Zap,
  Flame,
  Brain,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import {
  DkaHhsPatientInput,
  computeDkaHhsState,
  DKA_HHS_PRESETS,
} from '../../.gemini/skills/DkaHhsEngine';

export default function DkaHhsSimulator() {
  const [glucose, setGlucose] = useState<number>(540);
  const [sodium, setSodium] = useState<number>(130);
  const [potassium, setPotassium] = useState<number>(4.1);
  const [chloride, setChloride] = useState<number>(98);
  const [bicarbonate, setBicarbonate] = useState<number>(6);
  const [ph, setPh] = useState<number>(7.02);
  const [bun, setBun] = useState<number>(34);
  const [betaOHB, setBetaOHB] = useState<number>(8.4);
  const [weightKg, setWeightKg] = useState<number>(45);
  const [ageYears, setAgeYears] = useState<number>(14);
  const [dropRate, setDropRate] = useState<number>(60);
  const [bag1Rate, setBag1Rate] = useState<number>(200);
  const [bag2Rate, setBag2Rate] = useState<number>(0);
  const [insulinRate, setInsulinRate] = useState<number>(0.08);
  const [gcs, setGcs] = useState<number>(13);

  const currentInput: DkaHhsPatientInput = useMemo(
    () => ({
      measuredGlucoseMgDl: glucose,
      measuredSodiumMeqL: sodium,
      measuredPotassiumMeqL: potassium,
      serumChlorideMeqL: chloride,
      serumBicarbonateMeqL: bicarbonate,
      arterialVenousPh: ph,
      serumBunMgDl: bun,
      betaHydroxybutyrateMmolL: betaOHB,
      patientWeightKg: weightKg,
      patientAgeYears: ageYears,
      hourlyGlucoseDropRateMgDlH: dropRate,
      bag1RateMlH: bag1Rate,
      bag2RateMlH: bag2Rate,
      activeInsulinInfusionUnitsPerKgH: insulinRate,
      gcsScore: gcs,
    }),
    [
      glucose,
      sodium,
      potassium,
      chloride,
      bicarbonate,
      ph,
      bun,
      betaOHB,
      weightKg,
      ageYears,
      dropRate,
      bag1Rate,
      bag2Rate,
      insulinRate,
      gcs,
    ]
  );

  const metrics = useMemo(() => computeDkaHhsState(currentInput), [currentInput]);

  const applyPreset = (presetId: string) => {
    const p = DKA_HHS_PRESETS.find((item) => item.id === presetId);
    if (!p) return;
    setGlucose(p.input.measuredGlucoseMgDl);
    setSodium(p.input.measuredSodiumMeqL);
    setPotassium(p.input.measuredPotassiumMeqL);
    setChloride(p.input.serumChlorideMeqL);
    setBicarbonate(p.input.serumBicarbonateMeqL);
    setPh(p.input.arterialVenousPh);
    setBun(p.input.serumBunMgDl);
    setBetaOHB(p.input.betaHydroxybutyrateMmolL);
    setWeightKg(p.input.patientWeightKg);
    setAgeYears(p.input.patientAgeYears);
    setDropRate(p.input.hourlyGlucoseDropRateMgDlH);
    setBag1Rate(p.input.bag1RateMlH);
    setBag2Rate(p.input.bag2RateMlH);
    setInsulinRate(p.input.activeInsulinInfusionUnitsPerKgH);
    setGcs(p.input.gcsScore);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
              <Link href="/simulators" className="hover:underline">
                Simulators
              </Link>
              <span>/</span>
              <span>Endocrinology & Critical Care</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <Flame className="w-8 h-8 text-rose-500 animate-pulse" />
              DKA, HHS & Two-Bag Fluid Titration Workstation
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Precision fluid-electrolyte resuscitator, potassium safety interlock, dynamic two-bag dextrose titration, and osmotic cerebral edema prevention engine.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-rose-950/80 border border-rose-500/40 text-rose-300 rounded-full text-xs font-semibold">
              ADA / ISPAD Protocols
            </span>
            <span className="px-3 py-1 bg-amber-950/80 border border-amber-500/40 text-amber-300 rounded-full text-xs font-semibold">
              Track A52
            </span>
          </div>
        </div>

        {/* Clinical Presets */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Standard Clinical Cases & Crisis Scenarios
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {DKA_HHS_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => applyPreset(p.id)}
                className="text-left p-3 rounded-lg border border-slate-800 bg-slate-950/60 hover:border-emerald-500/50 hover:bg-slate-800/60 transition group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-400">
                    {p.name}
                  </span>
                </div>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 mb-1 border border-slate-700">
                  {p.badge}
                </span>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {p.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid: Controls & Real-Time Engine Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Laboratory Inputs Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Laboratory & Metabolic Inputs
              </h2>

              {/* Blood Glucose */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                  <span>Blood Glucose:</span>
                  <span className="font-mono text-emerald-400 font-bold">{glucose} mg/dL</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="1400"
                  step="10"
                  value={glucose}
                  onChange={(e) => setGlucose(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              {/* Serum Sodium & Potassium */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>Sodium (Na+):</span>
                    <span className="font-mono text-cyan-400 font-bold">{sodium} mEq/L</span>
                  </div>
                  <input
                    type="range"
                    min="115"
                    max="160"
                    step="1"
                    value={sodium}
                    onChange={(e) => setSodium(Number(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>Potassium (K+):</span>
                    <span className={`font-mono font-bold ${potassium < 3.3 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`}>
                      {potassium.toFixed(1)} mEq/L
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2.0"
                    max="6.5"
                    step="0.1"
                    value={potassium}
                    onChange={(e) => setPotassium(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>

              {/* Chloride & Bicarbonate */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>Chloride (Cl-):</span>
                    <span className="font-mono text-slate-300 font-bold">{chloride} mEq/L</span>
                  </div>
                  <input
                    type="range"
                    min="85"
                    max="125"
                    step="1"
                    value={chloride}
                    onChange={(e) => setChloride(Number(e.target.value))}
                    className="w-full accent-slate-400"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>Bicarbonate (HCO3-):</span>
                    <span className="font-mono text-purple-400 font-bold">{bicarbonate} mEq/L</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="32"
                    step="1"
                    value={bicarbonate}
                    onChange={(e) => setBicarbonate(Number(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                </div>
              </div>

              {/* Blood pH & Beta-Hydroxybutyrate */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>Venous/Art pH:</span>
                    <span className="font-mono text-rose-400 font-bold">{ph.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="6.85"
                    max="7.48"
                    step="0.01"
                    value={ph}
                    onChange={(e) => setPh(Number(e.target.value))}
                    className="w-full accent-rose-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>β-Hydroxybutyrate:</span>
                    <span className="font-mono text-orange-400 font-bold">{betaOHB.toFixed(1)} mmol/L</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="15.0"
                    step="0.1"
                    value={betaOHB}
                    onChange={(e) => setBetaOHB(Number(e.target.value))}
                    className="w-full accent-orange-500"
                  />
                </div>
              </div>

              {/* BUN & GCS */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>BUN:</span>
                    <span className="font-mono text-slate-300 font-bold">{bun} mg/dL</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="120"
                    step="2"
                    value={bun}
                    onChange={(e) => setBun(Number(e.target.value))}
                    className="w-full accent-slate-400"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>Glasgow Coma Scale:</span>
                    <span className="font-mono text-blue-400 font-bold">{gcs} / 15</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="15"
                    step="1"
                    value={gcs}
                    onChange={(e) => setGcs(Number(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>
              </div>

              {/* Patient Age & Weight */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>Age:</span>
                    <span className="font-mono text-slate-300">{ageYears} yrs</span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="90"
                    step="1"
                    value={ageYears}
                    onChange={(e) => setAgeYears(Number(e.target.value))}
                    className="w-full accent-slate-400"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>Weight:</span>
                    <span className="font-mono text-slate-300">{weightKg} kg</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="130"
                    step="1"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full accent-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Two-Bag System & Infusion Control Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                <Droplets className="w-4 h-4 text-cyan-400" />
                Two-Bag System & Insulin Infusion
              </h2>

              {/* Hourly Glucose Drop Rate */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                  <span>Hourly Glucose Decline Rate:</span>
                  <span className={`font-mono font-bold ${dropRate > 90 ? 'text-rose-400' : dropRate >= 50 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {dropRate} mg/dL/h (Safe target: 50-75)
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="160"
                  step="5"
                  value={dropRate}
                  onChange={(e) => setDropRate(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              {/* Bag 1 (0% Dextrose) Rate */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block"></span>
                    Bag 1 (0% Dextrose + Electrolytes):
                  </span>
                  <span className="font-mono text-cyan-400 font-bold">{bag1Rate} mL/h</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="10"
                  value={bag1Rate}
                  onChange={(e) => setBag1Rate(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              {/* Bag 2 (10% Dextrose) Rate */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
                    Bag 2 (10% Dextrose + Electrolytes):
                  </span>
                  <span className="font-mono text-amber-400 font-bold">{bag2Rate} mL/h</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="10"
                  value={bag2Rate}
                  onChange={(e) => setBag2Rate(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              {/* Insulin Infusion Rate */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                  <span>Regular Insulin Infusion:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {insulinRate.toFixed(2)} U/kg/h ({(insulinRate * weightKg).toFixed(1)} U/h)
                  </span>
                </div>
                <input
                  type="range"
                  min="0.00"
                  max="0.20"
                  step="0.01"
                  value={insulinRate}
                  onChange={(e) => setInsulinRate(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Clinical Output & Protocol Engine (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Corrected Sodium */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Corrected Na+</div>
                <div className="text-xl font-bold font-mono text-cyan-400 mt-1">
                  {metrics.correctedSodiumMeqL} <span className="text-xs font-normal">mEq/L</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Measured: {sodium} | +{((metrics.correctedSodiumMeqL - sodium)).toFixed(1)}
                </div>
              </div>

              {/* Effective Osmolality */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Effective Osm</div>
                <div className={`text-xl font-bold font-mono mt-1 ${metrics.effectiveOsmolalityMOsmKg >= 320 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {metrics.effectiveOsmolalityMOsmKg} <span className="text-xs font-normal">mOsm</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Threshold: 320 mOsm/kg
                </div>
              </div>

              {/* Anion Gap */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Anion Gap</div>
                <div className={`text-xl font-bold font-mono mt-1 ${metrics.anionGapMeqL > 12 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {metrics.anionGapMeqL} <span className="text-xs font-normal">mEq/L</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Target: ≤ 12 mEq/L
                </div>
              </div>

              {/* Free Water Deficit */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Water Deficit</div>
                <div className="text-xl font-bold font-mono text-blue-400 mt-1">
                  ~{metrics.waterDeficitLiters} <span className="text-xs font-normal">L</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  TBW: {(0.6 * weightKg).toFixed(0)} L
                </div>
              </div>
            </div>

            {/* Diagnostic Classification Banner */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Glycemic Crisis Classification
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-extrabold text-white">
                    {metrics.diagnosis.replace(/_/g, ' ')}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    metrics.diagnosis.includes('SEVERE')
                      ? 'bg-rose-950 text-rose-400 border border-rose-800'
                      : metrics.diagnosis.includes('MODERATE')
                      ? 'bg-amber-950 text-amber-400 border border-amber-800'
                      : metrics.diagnosis === 'HHS'
                      ? 'bg-purple-950 text-purple-400 border border-purple-800'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}>
                    {metrics.diagnosis}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Total Osmolality</span>
                <span className="font-mono text-sm text-slate-200 font-bold">{metrics.totalOsmolalityMOsmKg} mOsm/kg</span>
              </div>
            </div>

            {/* CRITICAL SAFETY INTERLOCK: Potassium Gate */}
            <div className={`border rounded-xl p-5 ${
              metrics.potassiumGateStatus === 'HOLD_INSULIN_CRITICAL'
                ? 'bg-rose-950/40 border-rose-500'
                : metrics.potassiumGateStatus === 'PERMIT_INSULIN_REPLETE_K'
                ? 'bg-emerald-950/30 border-emerald-500/40'
                : 'bg-amber-950/30 border-amber-500/40'
            }`}>
              <div className="flex items-start gap-3">
                {metrics.potassiumGateStatus === 'HOLD_INSULIN_CRITICAL' ? (
                  <ShieldAlert className="w-6 h-6 text-rose-400 flex-shrink-0 mt-0.5 animate-bounce" />
                ) : (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                      Potassium Safety Interlock Status:
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      metrics.potassiumGateStatus === 'HOLD_INSULIN_CRITICAL'
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-emerald-600/60 text-emerald-100'
                    }`}>
                      {metrics.potassiumGateStatus === 'HOLD_INSULIN_CRITICAL'
                        ? 'HOLD INSULIN (CRITICAL RISK)'
                        : 'INSULIN PERMITTED'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {metrics.potassiumGateAction}
                  </p>
                </div>
              </div>
            </div>

            {/* Two-Bag Fluid Delivery & Titration Console */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                    Two-Bag Infusion Dynamic Solver
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-slate-300">
                  Total Rate: {metrics.totalInfusionRateMlH} mL/h
                </span>
              </div>

              {/* Split Bar */}
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Bag 1 (0% Dextrose): {bag1Rate} mL/h</span>
                  <span>Bag 2 (10% Dextrose): {bag2Rate} mL/h</span>
                </div>
                <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${metrics.totalInfusionRateMlH > 0 ? (bag1Rate / metrics.totalInfusionRateMlH) * 100 : 50}%` }}
                    className="bg-cyan-500 transition-all duration-300"
                    title="Bag 1 (0% Dextrose)"
                  />
                  <div
                    style={{ width: `${metrics.totalInfusionRateMlH > 0 ? (bag2Rate / metrics.totalInfusionRateMlH) * 100 : 50}%` }}
                    className="bg-amber-500 transition-all duration-300"
                    title="Bag 2 (10% Dextrose)"
                  />
                </div>
              </div>

              {/* Delivered Dextrose Metrics */}
              <div className="grid grid-cols-2 gap-3 bg-slate-950/70 border border-slate-800/80 rounded-lg p-3">
                <div>
                  <span className="text-[11px] text-slate-400 block">Delivered Dextrose Concentration:</span>
                  <span className="text-lg font-mono font-extrabold text-amber-400">
                    {metrics.deliveredDextrosePercent}% <span className="text-xs font-normal text-slate-400">Dextrose</span>
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Carbohydrate Delivery Rate:</span>
                  <span className="text-lg font-mono font-extrabold text-emerald-400">
                    {metrics.dextroseDeliveryRateGH} <span className="text-xs font-normal text-slate-400">g/hour</span>
                  </span>
                </div>
              </div>

              {/* Titration Recommendation */}
              <div className="text-xs text-slate-300 bg-slate-800/60 rounded-lg p-3 border border-slate-700 leading-relaxed">
                <span className="font-bold text-amber-400 block mb-1">Two-Bag Titration Directive:</span>
                {metrics.twoBagRecommendation}
              </div>
            </div>

            {/* Cerebral Edema & Osmotic Shift Monitor */}
            <div className={`border rounded-xl p-5 space-y-3 ${
              metrics.cerebralEdemaRiskLevel === 'IMMINENT_HERNIATION'
                ? 'bg-rose-950/50 border-rose-500'
                : metrics.cerebralEdemaRiskLevel === 'HIGH'
                ? 'bg-rose-950/30 border-rose-600/50'
                : metrics.cerebralEdemaRiskLevel === 'MODERATE'
                ? 'bg-amber-950/30 border-amber-600/50'
                : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                    Cerebral Edema Risk & Neuromonitoring
                  </h3>
                </div>
                <span className={`px-2.5 py-0.5 rounded text-xs font-extrabold ${
                  metrics.cerebralEdemaRiskLevel === 'IMMINENT_HERNIATION'
                    ? 'bg-rose-600 text-white animate-pulse'
                    : metrics.cerebralEdemaRiskLevel === 'HIGH'
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : metrics.cerebralEdemaRiskLevel === 'MODERATE'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  {metrics.cerebralEdemaRiskLevel.replace(/_/g, ' ')}
                </span>
              </div>

              {metrics.cerebralEdemaWarning && (
                <div className="text-xs text-rose-200 bg-rose-950/60 border border-rose-800/80 rounded-lg p-3">
                  <span className="font-bold block mb-0.5">Neurological Alert:</span>
                  {metrics.cerebralEdemaWarning}
                </div>
              )}

              {metrics.cerebralEdemaRescueTreatment && (
                <div className="text-xs text-amber-100 bg-amber-950/60 border border-amber-800/80 rounded-lg p-3 space-y-1">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400" />
                    Hyperosmolar Emergent Rescue:
                  </span>
                  <p>{metrics.cerebralEdemaRescueTreatment}</p>
                </div>
              )}

              {!metrics.cerebralEdemaWarning && (
                <p className="text-xs text-slate-400">
                  Current glucose drop rate ({dropRate} mg/dL/h) and neurological status (GCS {gcs}) are within safe boundaries. Continue hourly neurological assessments.
                </p>
              )}
            </div>

            {/* Resolution Criteria & Subcutaneous Transition */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                    DKA Resolution & Subcutaneous Bridging
                  </h3>
                </div>
                <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                  metrics.isDkaResolved
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {metrics.isDkaResolved ? 'RESOLVED' : 'IN PROGRESS'}
                </span>
              </div>

              {/* Checklist */}
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-slate-400 uppercase">Resolution Criteria Checklist:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className={`p-2 rounded border flex items-center gap-2 ${
                    glucose < 200 ? 'bg-emerald-950/40 border-emerald-700 text-emerald-200' : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}>
                    {glucose < 200 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-slate-600" />}
                    <span>Glucose &lt; 200 mg/dL ({glucose})</span>
                  </div>
                  <div className={`p-2 rounded border flex items-center gap-2 ${
                    bicarbonate >= 15 ? 'bg-emerald-950/40 border-emerald-700 text-emerald-200' : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}>
                    {bicarbonate >= 15 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-slate-600" />}
                    <span>HCO3- &ge; 15 mEq/L ({bicarbonate})</span>
                  </div>
                  <div className={`p-2 rounded border flex items-center gap-2 ${
                    ph > 7.30 ? 'bg-emerald-950/40 border-emerald-700 text-emerald-200' : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}>
                    {ph > 7.30 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-slate-600" />}
                    <span>Venous pH &gt; 7.30 ({ph.toFixed(2)})</span>
                  </div>
                  <div className={`p-2 rounded border flex items-center gap-2 ${
                    metrics.anionGapMeqL <= 12 ? 'bg-emerald-950/40 border-emerald-700 text-emerald-200' : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}>
                    {metrics.anionGapMeqL <= 12 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-slate-600" />}
                    <span>Anion Gap &le; 12 mEq/L ({metrics.anionGapMeqL})</span>
                  </div>
                </div>
              </div>

              {/* Subcutaneous Transition Guidance */}
              <div className="text-xs text-slate-300 bg-slate-950/80 rounded-lg p-3 border border-slate-800 leading-relaxed">
                <span className="font-bold text-cyan-400 block mb-1">Subcutaneous Transition Protocol:</span>
                {metrics.subcutaneousBridgeRecommendation}
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Physiology & Teaching Pearls */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Endocrinology & Critical Care Clinical Pearls
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-400 leading-relaxed">
            <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80">
              <h4 className="font-bold text-slate-200 mb-1">1. The Two-Bag Fluid Rationale</h4>
              <p>
                In DKA resuscitation, when glucose falls below 200-250 mg/dL, insulin cannot simply be turned down or stopped because ketoacidosis has not yet resolved. Two-bag systems permit rapid bedside adjustment of dextrose concentration (0% to 10%) without altering total fluid volume or potassium infusion rates.
              </p>
            </div>
            <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80">
              <h4 className="font-bold text-slate-200 mb-1">2. Fatal Hypokalemic Interlock</h4>
              <p>
                Insulin activates Na+/K+-ATPase, forcefully shifting potassium from extracellular to intracellular compartments. Administering insulin when serum K+ is below 3.3 mEq/L can cause sudden drop in cardiac resting membrane potential, provoking refractory ventricular fibrillation or cardiac arrest.
              </p>
            </div>
            <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80">
              <h4 className="font-bold text-slate-200 mb-1">3. Cerebral Edema & Idiogenic Osmoles</h4>
              <p>
                Hyperglycemia stimulates brain cells to generate intracellular idiogenic osmoles (myo-inositol, taurine) to maintain cellular volume. If plasma osmolality falls precipitously (&gt; 3 mOsm/kg/h), free water rushes into astrocytes down an osmotic gradient, triggering devastating herniation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
