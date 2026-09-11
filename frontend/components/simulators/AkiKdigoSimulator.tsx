'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Pill,
  ShieldAlert,
  Sparkles,
  Zap,
  Flame,
  Droplets,
  Stethoscope,
  Info,
  Clock,
  TrendingUp,
  RefreshCw,
  Sliders,
  Layers,
  HeartCrack,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';
import {
  KdigoStage,
  AkiEtiology,
  DiureticExposureStatus,
  RenalAnginaRiskTier,
  KdigoInput,
  FractionalExcretionInput,
  RenalAnginaInput,
  FurosemideStressTestInput,
  FluidOverloadInput,
  performComprehensiveAkiEvaluation,
  AKI_PRESETS,
} from '../../.gemini/skills/AkiKdigoFstEngine';

export default function AkiKdigoSimulator() {
  // KDIGO Inputs
  const [baselineCr, setBaselineCr] = useState<number>(0.9);
  const [currentCr, setCurrentCr] = useState<number>(1.9);
  const [crTimeHours, setCrTimeHours] = useState<number>(48);
  const [urineOutputRate, setUrineOutputRate] = useState<number>(0.4);
  const [oliguriaHours, setOliguriaHours] = useState<number>(8);
  const [rrtActive, setRrtActive] = useState<boolean>(false);

  // Fractional Excretion Inputs
  const [serumNa, setSerumNa] = useState<number>(138);
  const [urineNa, setUrineNa] = useState<number>(12);
  const [urineCr, setUrineCr] = useState<number>(140);
  const [bun, setBun] = useState<number>(62);
  const [urineUrea, setUrineUrea] = useState<number>(650);
  const [urineOsmolality, setUrineOsmolality] = useState<number>(680);
  const [urineSg, setUrineSg] = useState<number>(1.026);
  const [loopDiureticUse, setLoopDiureticUse] = useState<boolean>(false);

  // Renal Angina Inputs
  const [riskTier, setRiskTier] = useState<RenalAnginaRiskTier>('GENERAL_ICU');

  // FST Inputs
  const [weightKg, setWeightKg] = useState<number>(75);
  const [diureticExposure, setDiureticExposure] = useState<DiureticExposureStatus>('DIURETIC_NAIVE');
  const [isEuvolemic, setIsEuvolemic] = useState<boolean>(true);
  const [twoHourUrineMl, setTwoHourUrineMl] = useState<number>(450);

  // Fluid Overload Inputs
  const [fluidInLiters, setFluidInLiters] = useState<number>(2.5);
  const [fluidOutLiters, setFluidOutLiters] = useState<number>(1.8);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'EVALUATION' | 'KDIGO' | 'FENA_FEUREA' | 'RENAL_ANGINA' | 'FST' | 'FLUID_OVERLOAD'>('EVALUATION');

  // Calculate Comprehensive Evaluation
  const evaluation = useMemo(() => {
    const kdigoInput: KdigoInput = {
      baselineCreatinineMgDl: baselineCr,
      currentCreatinineMgDl: currentCr,
      hoursOverWhichCreatinineRose: crTimeHours,
      urineOutputMlKgH: urineOutputRate,
      oliguriaDurationHours: oliguriaHours,
      rrtInitiated: rrtActive,
    };

    const fractionalExcretionInput: FractionalExcretionInput = {
      serumSodiumMeqL: serumNa,
      urineSodiumMeqL: urineNa,
      serumCreatinineMgDl: currentCr,
      urineCreatinineMgDl: urineCr,
      bloodUreaNitrogenMgDl: bun,
      urineUreaNitrogenMgDl: urineUrea,
      urineOsmolalityMosmKg: urineOsmolality,
      urineSpecificGravity: urineSg,
      recentLoopDiureticUse: loopDiureticUse,
    };

    const fluidOverloadInput: FluidOverloadInput = {
      totalFluidIntakeLiters: fluidInLiters,
      totalFluidOutputLiters: fluidOutLiters,
      hospitalAdmissionWeightKg: weightKg,
    };

    // Calculate fluid overload % for Renal Angina
    const netLiters = fluidInLiters - fluidOutLiters;
    const foPercent = (netLiters / Math.max(1, weightKg)) * 100;

    const renalAnginaInput: RenalAnginaInput = {
      patientRiskTier: riskTier,
      baselineCreatinineMgDl: baselineCr,
      currentCreatinineMgDl: currentCr,
      cumulativeFluidOverloadPercent: foPercent,
    };

    const fstInput: FurosemideStressTestInput = {
      patientWeightKg: weightKg,
      diureticExposure,
      isPatientEuvolemicResuscitated: isEuvolemic,
      cumulativeTwoHourUrineMl: twoHourUrineMl,
    };

    return performComprehensiveAkiEvaluation({
      kdigoInput,
      fractionalExcretionInput,
      renalAnginaInput,
      fstInput,
      fluidOverloadInput,
    });
  }, [
    baselineCr,
    currentCr,
    crTimeHours,
    urineOutputRate,
    oliguriaHours,
    rrtActive,
    serumNa,
    urineNa,
    urineCr,
    bun,
    urineUrea,
    urineOsmolality,
    urineSg,
    loopDiureticUse,
    riskTier,
    weightKg,
    diureticExposure,
    isEuvolemic,
    twoHourUrineMl,
    fluidInLiters,
    fluidOutLiters,
  ]);

  // Apply Preset
  const applyPreset = (presetId: string) => {
    const preset = AKI_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    setBaselineCr(preset.inputs.kdigo.baselineCreatinineMgDl);
    setCurrentCr(preset.inputs.kdigo.currentCreatinineMgDl);
    setCrTimeHours(preset.inputs.kdigo.hoursOverWhichCreatinineRose);
    setUrineOutputRate(preset.inputs.kdigo.urineOutputMlKgH);
    setOliguriaHours(preset.inputs.kdigo.oliguriaDurationHours);
    setRrtActive(preset.inputs.kdigo.rrtInitiated);

    setSerumNa(preset.inputs.fractionalExcretion.serumSodiumMeqL);
    setUrineNa(preset.inputs.fractionalExcretion.urineSodiumMeqL);
    setUrineCr(preset.inputs.fractionalExcretion.urineCreatinineMgDl);
    setBun(preset.inputs.fractionalExcretion.bloodUreaNitrogenMgDl);
    setUrineUrea(preset.inputs.fractionalExcretion.urineUreaNitrogenMgDl);
    setUrineOsmolality(preset.inputs.fractionalExcretion.urineOsmolalityMosmKg);
    setUrineSg(preset.inputs.fractionalExcretion.urineSpecificGravity);
    setLoopDiureticUse(preset.inputs.fractionalExcretion.recentLoopDiureticUse);

    setRiskTier(preset.inputs.renalAngina.patientRiskTier);

    setWeightKg(preset.inputs.fst.patientWeightKg);
    setDiureticExposure(preset.inputs.fst.diureticExposure);
    setIsEuvolemic(preset.inputs.fst.isPatientEuvolemicResuscitated);
    setTwoHourUrineMl(preset.inputs.fst.cumulativeTwoHourUrineMl);

    setFluidInLiters(preset.inputs.fluidOverload.totalFluidIntakeLiters);
    setFluidOutLiters(preset.inputs.fluidOverload.totalFluidOutputLiters);
  };

  // Recharts Data for Fractional Excretion vs Cutoffs
  const feChartData = useMemo(() => {
    return [
      {
        name: 'FeNa (%)',
        value: evaluation.differentiation.feNaPercent,
        cutoff: 1.0,
        type: 'Sodium',
      },
      {
        name: 'FeUrea (%)',
        value: evaluation.differentiation.feUreaPercent,
        cutoff: 35.0,
        type: 'Urea',
      },
    ];
  }, [evaluation]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-cyan-500/20 border border-cyan-500/40 rounded-xl text-cyan-400">
                <Droplets className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                  Acute Kidney Injury (AKI) &amp; FST Precision Workstation
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
                    KDIGO • FeNa • FeUrea • FST • RAI
                  </span>
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  KDIGO 2024 Dynamic Staging, Diuretic-Corrected Tubular Differentiation, Furosemide Stress Test &amp; Fluid Overload Kinetics
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/simulators"
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium rounded-lg transition"
            >
              All Simulators
            </Link>
          </div>
        </div>

        {/* Clinical Case Presets Bar */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Standard Nephrology &amp; ICU Case Vignettes
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {AKI_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset.id)}
                className="text-left p-3 rounded-lg bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800/80 hover:border-cyan-500/40 transition group"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-semibold text-xs text-slate-200 group-hover:text-cyan-300 transition">
                    {preset.name}
                  </span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono inline-block mb-1">
                  {preset.badge}
                </span>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {preset.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Executive Stratification Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* KDIGO Stage Card */}
          <div
            className={`p-4 rounded-xl border ${
              evaluation.kdigo.overallStage === 'STAGE_3'
                ? 'bg-rose-950/30 border-rose-500/40'
                : evaluation.kdigo.overallStage === 'STAGE_2'
                ? 'bg-amber-950/30 border-amber-500/40'
                : evaluation.kdigo.overallStage === 'STAGE_1'
                ? 'bg-cyan-950/30 border-cyan-500/40'
                : 'bg-emerald-950/30 border-emerald-500/40'
            }`}
          >
            <div className="text-xs font-medium text-slate-400 flex items-center justify-between mb-1">
              <span>KDIGO AKI Stage</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-200">
                {evaluation.kdigo.overallStage.replace('_', ' ')}
              </span>
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {evaluation.kdigo.overallStage === 'STAGE_0_NO_AKI' ? 'No AKI' : evaluation.kdigo.overallStage.replace('STAGE_', 'Stage ')}
            </div>
            <div className="text-xs text-slate-300 mt-2">
              Cr Fold: <span className="font-bold text-white">{evaluation.kdigo.creatinineFoldIncrease}x</span> (+{evaluation.kdigo.absoluteCreatinineDelta} mg/dL)
            </div>
          </div>

          {/* Etiology Differentiation Card */}
          <div
            className={`p-4 rounded-xl border ${
              evaluation.differentiation.etiologyClassification === 'PRERENAL_AZOTEMIA'
                ? 'bg-emerald-950/30 border-emerald-500/40'
                : evaluation.differentiation.etiologyClassification === 'INTRINSIC_ATN'
                ? 'bg-rose-950/30 border-rose-500/40'
                : 'bg-amber-950/30 border-amber-500/40'
            }`}
          >
            <div className="text-xs font-medium text-slate-400 flex items-center justify-between mb-1">
              <span>Etiology Diagnostic</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-200">
                {evaluation.differentiation.primaryDiagnosticBiomarker}
              </span>
            </div>
            <div className="text-xl font-bold text-white mt-1">
              {evaluation.differentiation.etiologyClassification === 'PRERENAL_AZOTEMIA'
                ? 'Prerenal Azotemia'
                : evaluation.differentiation.etiologyClassification === 'INTRINSIC_ATN'
                ? 'Intrinsic ATN'
                : 'Indeterminate / Mixed'}
            </div>
            <div className="text-xs text-slate-300 mt-2">
              {evaluation.differentiation.isFeNaConfoundedByDiuretics ? (
                <span>FeUrea: <strong className="text-white">{evaluation.differentiation.feUreaPercent}%</strong> (Loop Active)</span>
              ) : (
                <span>FeNa: <strong className="text-white">{evaluation.differentiation.feNaPercent}%</strong> | BUN:Cr <strong className="text-white">{evaluation.differentiation.bunToCreatinineRatio}:1</strong></span>
              )}
            </div>
          </div>

          {/* FST Outcome Card */}
          <div
            className={`p-4 rounded-xl border ${
              evaluation.fst.fstResponsiveness === 'RESPONSIVE'
                ? 'bg-emerald-950/30 border-emerald-500/40'
                : evaluation.fst.fstResponsiveness === 'NON_RESPONSIVE'
                ? 'bg-rose-950/30 border-rose-500/40'
                : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="text-xs font-medium text-slate-400 flex items-center justify-between mb-1">
              <span>FST Response</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-200">
                2h Urine
              </span>
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {evaluation.fst.fstResponsiveness === 'RESPONSIVE'
                ? 'Responsive'
                : evaluation.fst.fstResponsiveness === 'NON_RESPONSIVE'
                ? 'Non-Responsive'
                : 'Blocked'}
            </div>
            <div className="text-xs text-slate-300 mt-2">
              Output: <span className="font-bold text-white">{twoHourUrineMl} mL</span> ({evaluation.fst.twoHourUrineOutputRateMlH} mL/h)
            </div>
          </div>

          {/* Renal Angina Index Card */}
          <div
            className={`p-4 rounded-xl border ${
              evaluation.renalAngina.isRenalAnginaPositive
                ? 'bg-rose-950/30 border-rose-500/40'
                : 'bg-emerald-950/30 border-emerald-500/40'
            }`}
          >
            <div className="text-xs font-medium text-slate-400 flex items-center justify-between mb-1">
              <span>Renal Angina (RAI)</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-200">
                Score &ge; 8
              </span>
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {evaluation.renalAngina.totalScore} <span className="text-sm font-normal text-slate-400">/ 40</span>
            </div>
            <div className="text-xs text-slate-300 mt-2">
              Status: <span className="font-bold text-white">{evaluation.renalAngina.isRenalAnginaPositive ? 'POSITIVE (High Risk)' : 'NEGATIVE (Low Risk)'}</span>
            </div>
          </div>

          {/* Cumulative Fluid Overload Card */}
          <div
            className={`p-4 rounded-xl border ${
              evaluation.fluidOverload.overloadCategory === 'CRITICAL_SEVERE'
                ? 'bg-rose-950/30 border-rose-500/40'
                : evaluation.fluidOverload.overloadCategory === 'SIGNIFICANT'
                ? 'bg-amber-950/30 border-amber-500/40'
                : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="text-xs font-medium text-slate-400 flex items-center justify-between mb-1">
              <span>Fluid Overload %</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-200">
                Net / Weight
              </span>
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {evaluation.fluidOverload.fluidOverloadPercent}%
            </div>
            <div className="text-xs text-slate-300 mt-2">
              Net Balance: <span className="font-bold text-white">+{evaluation.fluidOverload.cumulativeNetFluidBalanceLiters} L</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('EVALUATION')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'EVALUATION'
                ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Unified Clinical Synthesis
          </button>
          <button
            onClick={() => setActiveTab('KDIGO')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'KDIGO'
                ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            KDIGO 2024 Staging
          </button>
          <button
            onClick={() => setActiveTab('FENA_FEUREA')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'FENA_FEUREA'
                ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            FeNa vs FeUrea Diagnostic Bench
          </button>
          <button
            onClick={() => setActiveTab('FST')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'FST'
                ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Furosemide Stress Test (FST)
          </button>
          <button
            onClick={() => setActiveTab('RENAL_ANGINA')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'RENAL_ANGINA'
                ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Renal Angina Index (RAI)
          </button>
          <button
            onClick={() => setActiveTab('FLUID_OVERLOAD')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'FLUID_OVERLOAD'
                ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Cumulative Fluid Overload %
          </button>
        </div>

        {/* Tab 1: Unified Clinical Synthesis */}
        {activeTab === 'EVALUATION' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
                <Activity className="w-5 h-5 text-cyan-400" />
                Integrated Management Synthesis &amp; Nephrology Escalation Plan
              </h2>
              <div
                className={`p-4 rounded-xl border leading-relaxed text-sm ${
                  evaluation.kdigo.overallStage === 'STAGE_3' || evaluation.fst.fstResponsiveness === 'NON_RESPONSIVE'
                    ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                    : evaluation.differentiation.etiologyClassification === 'PRERENAL_AZOTEMIA'
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                    : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                }`}
              >
                {evaluation.unifiedExecutiveSummary}
              </div>

              {/* FST Safety Interlock Warning if triggered */}
              {!evaluation.fst.isSafetyInterlockPassed && evaluation.fst.safetyInterlockWarning && (
                <div className="mt-4 p-4 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-200 flex items-start gap-3 text-xs leading-relaxed">
                  <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold uppercase tracking-wider block text-rose-300 mb-0.5">
                      FST Safety Interlock Violation
                    </span>
                    {evaluation.fst.safetyInterlockWarning}
                  </div>
                </div>
              )}

              {/* Diuretic Pitfall Alert if on Loop Diuretic */}
              {evaluation.differentiation.isFeNaConfoundedByDiuretics && (
                <div className="mt-4 p-4 rounded-xl bg-amber-950/40 border border-amber-500/50 text-amber-200 flex items-start gap-3 text-xs leading-relaxed">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold uppercase tracking-wider block text-amber-300 mb-0.5">
                      Diuretic-Induced FeNa Invalidation Solved
                    </span>
                    Patient has recent loop diuretic exposure. FeNa ({evaluation.differentiation.feNaPercent}%) is artificially elevated by loop-induced natriuresis. Diagnosis is guided by <strong>FeUrea ({evaluation.differentiation.feUreaPercent}%)</strong>, which accurately distinguishes prerenal hypoperfusion from intrinsic ATN.
                  </div>
                </div>
              )}

              {/* Action Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    KDIGO Monitoring Protocol
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mt-1">
                    {evaluation.kdigo.recommendedMonitoring}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-cyan-400" />
                    FST Fluid Titration
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mt-1">
                    {evaluation.fst.therapeuticFluidReplacementGuidance}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                    <Stethoscope className="w-4 h-4 text-cyan-400" />
                    Dialysis (RRT) Preparedness
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mt-1">
                    {evaluation.fst.nephrologyEscalationGuidance}
                  </p>
                </div>
              </div>
            </div>

            {/* FeNa vs FeUrea Visual Chart */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                Fractional Excretion Values vs Diagnostic Thresholds (%)
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={feChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }} />
                    <Legend />
                    <Bar dataKey="value" name="Patient Excretion %" fill="#06b6d4" radius={[4, 4, 0, 0]}>
                      {feChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.name === 'FeNa (%)'
                              ? entry.value < 1.0 ? '#10b981' : entry.value > 2.0 ? '#ef4444' : '#f59e0b'
                              : entry.value < 35.0 ? '#10b981' : entry.value > 50.0 ? '#ef4444' : '#f59e0b'
                          }
                        />
                      ))}
                    </Bar>
                    <Bar dataKey="cutoff" name="Prerenal Upper Limit (FeNa 1% / FeUrea 35%)" fill="#10b981" fillOpacity={0.25} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-slate-400 text-center mt-2">
                Green bars represent intact tubular reabsorption (prerenal); Red bars represent tubular transport failure (ATN).
              </p>
            </div>

            {/* Clinical Pearls */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-3">
                <Info className="w-4 h-4 text-cyan-400" />
                Nephrology &amp; Critical Care Tubular Pearls
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {evaluation.clinicalPearls.map((pearl, idx) => (
                  <div key={idx} className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                    {pearl}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: KDIGO 2024 Staging */}
        {activeTab === 'KDIGO' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                KDIGO 2024 Dual-Parameter Staging Matrix
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Acute Kidney Injury staging integrating concurrent Serum Creatinine kinetics and weight-adjusted hourly Urine Output.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Creatinine Domain */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  Serum Creatinine Parameters
                </h3>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">Baseline Serum Creatinine</span>
                    <span className="font-mono font-bold text-white">{baselineCr} mg/dL</span>
                  </div>
                  <input
                    type="range"
                    min={0.4}
                    max={3.0}
                    step={0.1}
                    value={baselineCr}
                    onChange={(e) => setBaselineCr(parseFloat(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">Current Serum Creatinine</span>
                    <span className="font-mono font-bold text-cyan-400">{currentCr} mg/dL</span>
                  </div>
                  <input
                    type="range"
                    min={0.4}
                    max={8.0}
                    step={0.1}
                    value={currentCr}
                    onChange={(e) => setCurrentCr(parseFloat(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">Time Window of Creatinine Rise</span>
                    <span className="font-mono font-bold text-white">{crTimeHours} hours</span>
                  </div>
                  <input
                    type="range"
                    min={6}
                    max={168}
                    step={6}
                    value={crTimeHours}
                    onChange={(e) => setCrTimeHours(parseInt(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    (&le;48h for +0.3 mg/dL criterion, &le;168h / 7 days for 1.5x fold criterion)
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={() => setRrtActive(!rrtActive)}
                    className={`w-full p-2.5 rounded-lg border text-xs font-semibold transition flex items-center justify-between ${
                      rrtActive
                        ? 'bg-rose-500/20 border-rose-500 text-rose-200'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span>Renal Replacement Therapy (RRT) Initiated</span>
                    <span className="font-mono font-bold">{rrtActive ? 'YES (Stage 3)' : 'NO'}</span>
                  </button>
                </div>
              </div>

              {/* Urine Output Domain */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-cyan-400" />
                  Urine Output Parameters
                </h3>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">Urine Flow Rate</span>
                    <span className="font-mono font-bold text-cyan-400">{urineOutputRate} mL/kg/h</span>
                  </div>
                  <input
                    type="range"
                    min={0.0}
                    max={2.0}
                    step={0.05}
                    value={urineOutputRate}
                    onChange={(e) => setUrineOutputRate(parseFloat(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">Duration of Oliguria / Anuria</span>
                    <span className="font-mono font-bold text-white">{oliguriaHours} hours</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={36}
                    step={1}
                    value={oliguriaHours}
                    onChange={(e) => setOliguriaHours(parseInt(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    (&lt;0.5 for 6-12h = Stage 1; &ge;12h = Stage 2; &lt;0.3 for &ge;24h or anuria &ge;12h = Stage 3)
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1 mt-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Creatinine Stage:</span>
                    <span className="font-bold text-white">{evaluation.kdigo.creatinineStage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Urine Output Stage:</span>
                    <span className="font-bold text-white">{evaluation.kdigo.urineOutputStage}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800 pt-1">
                    <span className="text-slate-400">Overall Assigned Stage:</span>
                    <span className="font-black text-cyan-400">{evaluation.kdigo.overallStage}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: FeNa vs FeUrea Diagnostic Bench */}
        {activeTab === 'FENA_FEUREA' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-cyan-400" />
                Fractional Excretion: FeNa vs FeUrea Diagnostic Bench
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Biochemical differentiation between prerenal hypoperfusion and acute tubular necrosis with diuretic correction.
              </p>
            </div>

            {/* Loop Diuretic Toggle Banner */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-white block">Recent Loop Diuretic Administration (Within 24-48 Hours)</span>
                <span className="text-[11px] text-slate-400">
                  Inhibits NKCC2 in the thick ascending limb, forcing natriuresis and invalidating FeNa.
                </span>
              </div>
              <button
                onClick={() => setLoopDiureticUse(!loopDiureticUse)}
                className={`px-4 py-2 rounded-lg text-xs font-bold border transition ${
                  loopDiureticUse
                    ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {loopDiureticUse ? 'LOOP DIURETIC ACTIVE (Use FeUrea)' : 'NO RECENT DIURETICS (Use FeNa)'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              {/* Serum Na */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <label className="text-slate-400 block mb-1">Serum Sodium (mEq/L)</label>
                <input
                  type="number"
                  value={serumNa}
                  onChange={(e) => setSerumNa(parseFloat(e.target.value) || 140)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-sm font-mono text-white"
                />
              </div>

              {/* Urine Na */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <label className="text-slate-400 block mb-1">Urine Sodium (mEq/L)</label>
                <input
                  type="number"
                  value={urineNa}
                  onChange={(e) => setUrineNa(parseFloat(e.target.value) || 20)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-sm font-mono text-white"
                />
              </div>

              {/* Urine Cr */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <label className="text-slate-400 block mb-1">Urine Creatinine (mg/dL)</label>
                <input
                  type="number"
                  value={urineCr}
                  onChange={(e) => setUrineCr(parseFloat(e.target.value) || 100)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-sm font-mono text-white"
                />
              </div>

              {/* BUN */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <label className="text-slate-400 block mb-1">BUN (mg/dL)</label>
                <input
                  type="number"
                  value={bun}
                  onChange={(e) => setBun(parseFloat(e.target.value) || 40)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-sm font-mono text-white"
                />
              </div>

              {/* Urine Urea Nitrogen */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <label className="text-slate-400 block mb-1">Urine Urea Nitrogen (mg/dL)</label>
                <input
                  type="number"
                  value={urineUrea}
                  onChange={(e) => setUrineUrea(parseFloat(e.target.value) || 500)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-sm font-mono text-white"
                />
              </div>

              {/* Urine Osmolality */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <label className="text-slate-400 block mb-1">Urine Osmolality (mOsm/kg)</label>
                <input
                  type="number"
                  value={urineOsmolality}
                  onChange={(e) => setUrineOsmolality(parseFloat(e.target.value) || 500)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-sm font-mono text-white"
                />
              </div>

              {/* Specific Gravity */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <label className="text-slate-400 block mb-1">Specific Gravity</label>
                <input
                  type="number"
                  step={0.002}
                  value={urineSg}
                  onChange={(e) => setUrineSg(parseFloat(e.target.value) || 1.020)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-sm font-mono text-white"
                />
              </div>

              {/* BUN:Cr Ratio Display */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <label className="text-slate-400 block mb-1">BUN:Creatinine Ratio</label>
                <div className="text-lg font-bold font-mono text-cyan-400 mt-1">
                  {evaluation.differentiation.bunToCreatinineRatio} : 1
                </div>
              </div>
            </div>

            {/* Differentiation Rationale Card */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-white uppercase tracking-wider">
                Tubular Transport Analysis &amp; Differential Rationale
              </div>
              <p className="text-slate-300 leading-relaxed">
                {evaluation.differentiation.differentiationRationale}
              </p>
            </div>
          </div>
        )}

        {/* Tab 4: Furosemide Stress Test (FST) */}
        {activeTab === 'FST' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                Furosemide Stress Test (FST) Protocol &amp; Tubular Reserve
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Landmark Chawla et al. diagnostic challenge assessing medullary tubular transport integrity to predict Stage 3 AKI and RRT need.
              </p>
            </div>

            {/* Euvolemia Safety Check */}
            <div
              className={`p-4 rounded-xl border flex items-center justify-between ${
                isEuvolemic
                  ? 'bg-emerald-950/20 border-emerald-500/30'
                  : 'bg-rose-950/30 border-rose-500/50'
              }`}
            >
              <div>
                <span className="text-xs font-bold text-white block">Pre-Test Prerequisite: Confirmed Euvolemic / Resuscitated State</span>
                <span className="text-[11px] text-slate-400">
                  FST is strictly contraindicated in unresuscitated hypovolemia or active shock.
                </span>
              </div>
              <button
                onClick={() => setIsEuvolemic(!isEuvolemic)}
                className={`px-4 py-2 rounded-lg text-xs font-bold border transition ${
                  isEuvolemic
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-rose-500/20 border-rose-500 text-rose-300'
                }`}
              >
                {isEuvolemic ? 'EUVOLEMIC CONFIRMED' : 'HYPOVOLEMIC (FST BLOCKED)'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dosing Calculator */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Weight-Based FST Dosing
                </h3>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">Patient Weight</span>
                    <span className="font-mono font-bold text-white">{weightKg} kg</span>
                  </div>
                  <input
                    type="range"
                    min={40}
                    max={140}
                    step={1}
                    value={weightKg}
                    onChange={(e) => setWeightKg(parseInt(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-2">Prior Loop Diuretic Exposure</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setDiureticExposure('DIURETIC_NAIVE')}
                      className={`p-2.5 rounded-lg border text-xs font-semibold transition ${
                        diureticExposure === 'DIURETIC_NAIVE'
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      Diuretic-Naive (1.0 mg/kg)
                    </button>
                    <button
                      onClick={() => setDiureticExposure('PRIOR_LOOP_DIURETIC_USER')}
                      className={`p-2.5 rounded-lg border text-xs font-semibold transition ${
                        diureticExposure === 'PRIOR_LOOP_DIURETIC_USER'
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      Prior User (1.5 mg/kg)
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                  <span className="text-slate-400">Calculated IV Bolus: </span>
                  <span className="text-lg font-black text-white">{evaluation.fst.recommendedFurosemideDoseMg} mg</span>
                  <p className="text-[11px] text-slate-400 mt-1">{evaluation.fst.doseRationale}</p>
                </div>
              </div>

              {/* 2-Hour Response Slider */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Observed 2-Hour Cumulative Urine Output
                </h3>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">Cumulative Urine at 2 Hours</span>
                    <span className="font-mono font-bold text-cyan-400">{twoHourUrineMl} mL</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1000}
                    step={10}
                    value={twoHourUrineMl}
                    onChange={(e) => setTwoHourUrineMl(parseInt(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>0 mL</span>
                    <span className="font-bold text-amber-400">&ge;200 mL (Cutoff)</span>
                    <span>1000 mL</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tubular Status:</span>
                    <span className="font-bold text-white">{evaluation.fst.fstResponsiveness}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Risk of Stage 3 / Dialysis:</span>
                    <span className="font-bold text-rose-400">{evaluation.fst.progressionToStage3OrRrtProbabilityPercent}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Renal Angina Index (RAI) */}
        {activeTab === 'RENAL_ANGINA' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                Renal Angina Index (RAI) Risk Stratification
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Risk score multiplied by Injury score to identify subclinical kidney injury and predict Day-3 severe AKI.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Baseline Patient Risk Cohort
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {[
                  { tier: 'GENERAL_ICU', title: 'General ICU Admission (Risk 1)', desc: 'Standard non-ventilated ICU patient' },
                  { tier: 'TRANSPLANT_RECIPIENT', title: 'Transplant Recipient (Risk 3)', desc: 'Solid organ or bone marrow transplant' },
                  { tier: 'VENTILATED_OR_VASOPRESSOR', title: 'Mechanical Ventilation / Pressors (Risk 5)', desc: 'Invasive mechanical ventilation or shock' },
                ].map((item) => (
                  <button
                    key={item.tier}
                    onClick={() => setRiskTier(item.tier as RenalAnginaRiskTier)}
                    className={`p-3 rounded-lg border text-left transition ${
                      riskTier === item.tier
                        ? 'bg-cyan-500/20 border-cyan-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold">{item.title}</div>
                    <div className="text-[11px] text-slate-400 mt-1">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Computed RAI Score:</span>
                <span className="text-xl font-black text-cyan-400">
                  Risk ({evaluation.renalAngina.riskScore}) &times; Injury ({evaluation.renalAngina.injuryScore}) = {evaluation.renalAngina.totalScore}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-800 pt-2">
                {evaluation.renalAngina.clinicalAction}
              </p>
            </div>
          </div>
        )}

        {/* Tab 6: Cumulative Fluid Overload % */}
        {activeTab === 'FLUID_OVERLOAD' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <HeartCrack className="w-5 h-5 text-cyan-400" />
                Cumulative Fluid Overload Percentage &amp; Congestive Nephropathy
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Quantitative tracking of net positive fluid balance relative to admission body weight. Overload &gt;10% independently drives mortality.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">Total Cumulative Fluid Intake</span>
                    <span className="font-mono font-bold text-white">{fluidInLiters} Liters</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={40}
                    step={0.5}
                    value={fluidInLiters}
                    onChange={(e) => setFluidInLiters(parseFloat(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">Total Cumulative Fluid Output</span>
                    <span className="font-mono font-bold text-white">{fluidOutLiters} Liters</span>
                  </div>
                  <input
                    type="range"
                    min={0.5}
                    max={30}
                    step={0.5}
                    value={fluidOutLiters}
                    onChange={(e) => setFluidOutLiters(parseFloat(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Net Fluid Balance:</span>
                    <span className="font-bold text-cyan-400">+{evaluation.fluidOverload.cumulativeNetFluidBalanceLiters} L</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-slate-400">Calculated Fluid Overload %:</span>
                    <span className="font-bold text-white">{evaluation.fluidOverload.fluidOverloadPercent}%</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <span className="font-bold text-white uppercase tracking-wider block">
                  Pathophysiologic Impact ({evaluation.fluidOverload.overloadCategory.replace('_', ' ')})
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {evaluation.fluidOverload.pathophysiologicImpact}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
