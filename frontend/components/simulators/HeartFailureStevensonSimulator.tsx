'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Heart,
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
  ArrowRight,
  Gauge,
  HelpCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ReferenceLine,
} from 'recharts';
import {
  StevensonProfile,
  InotropeAgent,
  VasodilatorAgent,
  HeartFailurePatientInput,
  StevensonClassification,
  CardiorenalCongestionAnalysis,
  DiureticRegimenPlan,
  NatriureticPeptideTrajectory,
  InotropeVasodilatorEvaluation,
  HeartFailureComprehensiveOutput,
  classifyStevensonProfile,
  analyzeCardiorenalCongestion,
  calculateDiureticPlan,
  calculatePeptideTrajectory,
  evaluatePharmacotherapy,
  performHeartFailureEvaluation,
  ADHF_PRESETS,
  AdhfPreset,
} from '../../.gemini/skills/HeartFailureStevensonEngine';

export default function HeartFailureStevensonSimulator() {
  // Clinical Congestion States
  const [hasOrthopneaOrPnd, setHasOrthopneaOrPnd] = useState<boolean>(true);
  const [hasElevatedJvp, setHasElevatedJvp] = useState<boolean>(true);
  const [hasHepatojugularReflux, setHasHepatojugularReflux] = useState<boolean>(true);
  const [hasPulmonaryRales, setHasPulmonaryRales] = useState<boolean>(true);
  const [hasLowerExtremityEdema, setHasLowerExtremityEdema] = useState<boolean>(true);
  const [hasAscites, setHasAscites] = useState<boolean>(false);
  const [pcwpMmHg, setPcwpMmHg] = useState<number>(26);
  const [cvpMmHg, setCvpMmHg] = useState<number>(14);

  // Clinical Perfusion States
  const [hasNarrowPulsePressure, setHasNarrowPulsePressure] = useState<boolean>(false);
  const [hasCoolClammyExtremities, setHasCoolClammyExtremities] = useState<boolean>(false);
  const [hasAlteredMentation, setHasAlteredMentation] = useState<boolean>(false);
  const [hasDilutionalHyponatremia, setHasDilutionalHyponatremia] = useState<boolean>(false);
  const [serumLactateMmolL, setSerumLactateMmolL] = useState<number>(1.2);
  const [cardiacIndexLMinM2, setCardiacIndexLMinM2] = useState<number>(2.6);
  const [svo2Percent, setSvo2Percent] = useState<number>(68);

  // Vitals & Demographics
  const [patientAgeYears, setPatientAgeYears] = useState<number>(66);
  const [patientWeightKg, setPatientWeightKg] = useState<number>(82);
  const [systolicBpMmHg, setSystolicBpMmHg] = useState<number>(164);
  const [diastolicBpMmHg, setDiastolicBpMmHg] = useState<number>(98);
  const [heartRateBpm, setHeartRateBpm] = useState<number>(104);

  // Renal & Biomarker States
  const [baselineCreatinineMgDl, setBaselineCreatinineMgDl] = useState<number>(1.2);
  const [currentCreatinineMgDl, setCurrentCreatinineMgDl] = useState<number>(1.5);
  const [admissionNtProBnpPgMl, setAdmissionNtProBnpPgMl] = useState<number>(8400);
  const [currentNtProBnpPgMl, setCurrentNtProBnpPgMl] = useState<number>(7200);
  const [homeOralFurosemideDoseMg, setHomeOralFurosemideDoseMg] = useState<number>(40);

  // Active Pharmacotherapy States
  const [activeInotrope, setActiveInotrope] = useState<InotropeAgent>('NONE');
  const [inotropeDoseMcgKgMin, setInotropeDoseMcgKgMin] = useState<number>(0);
  const [activeVasodilator, setActiveVasodilator] = useState<VasodilatorAgent>('NITROGLYCERIN');
  const [vasodilatorDoseMcgMin, setVasodilatorDoseMcgMin] = useState<number>(40);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'SYNTHESIS' | 'MATRIX' | 'CARDIORENAL' | 'DIURETICS' | 'INOTROPES' | 'BIOMARKERS'
  >('SYNTHESIS');

  // Load Preset
  const applyPreset = (preset: AdhfPreset) => {
    const inp = preset.inputs;
    setPatientAgeYears(inp.patientAgeYears);
    setPatientWeightKg(inp.patientWeightKg);
    setSystolicBpMmHg(inp.systolicBpMmHg);
    setDiastolicBpMmHg(inp.diastolicBpMmHg);
    setHeartRateBpm(inp.heartRateBpm);
    setHasOrthopneaOrPnd(inp.hasOrthopneaOrPnd);
    setHasElevatedJvp(inp.hasElevatedJvp);
    setHasHepatojugularReflux(inp.hasHepatojugularReflux);
    setHasPulmonaryRales(inp.hasPulmonaryRales);
    setHasLowerExtremityEdema(inp.hasLowerExtremityEdema);
    setHasAscites(inp.hasAscites);
    setPcwpMmHg(inp.pcwpMmHg ?? 16);
    setCvpMmHg(inp.cvpMmHg ?? 8);
    setHasNarrowPulsePressure(inp.hasNarrowPulsePressure);
    setHasCoolClammyExtremities(inp.hasCoolClammyExtremities);
    setHasAlteredMentation(inp.hasAlteredMentation);
    setHasDilutionalHyponatremia(inp.hasDilutionalHyponatremia);
    setSerumLactateMmolL(inp.serumLactateMmolL);
    setCardiacIndexLMinM2(inp.cardiacIndexLMinM2 ?? 2.4);
    setSvo2Percent(inp.svo2Percent ?? 65);
    setBaselineCreatinineMgDl(inp.baselineCreatinineMgDl);
    setCurrentCreatinineMgDl(inp.currentCreatinineMgDl);
    setAdmissionNtProBnpPgMl(inp.admissionNtProBnpPgMl);
    setCurrentNtProBnpPgMl(inp.currentNtProBnpPgMl);
    setHomeOralFurosemideDoseMg(inp.homeOralFurosemideDoseMg);
    setActiveInotrope(inp.activeInotrope);
    setInotropeDoseMcgKgMin(inp.inotropeDoseMcgKgMin);
    setActiveVasodilator(inp.activeVasodilator);
    setVasodilatorDoseMcgMin(inp.vasodilatorDoseMcgMin);
  };

  // Compile Current Patient Input
  const currentInput: HeartFailurePatientInput = useMemo(() => {
    return {
      patientAgeYears,
      patientWeightKg,
      systolicBpMmHg,
      diastolicBpMmHg,
      heartRateBpm,
      hasOrthopneaOrPnd,
      hasElevatedJvp,
      hasHepatojugularReflux,
      hasPulmonaryRales,
      hasLowerExtremityEdema,
      hasAscites,
      pcwpMmHg,
      cvpMmHg,
      hasNarrowPulsePressure,
      hasCoolClammyExtremities,
      hasAlteredMentation,
      hasDilutionalHyponatremia,
      serumLactateMmolL,
      cardiacIndexLMinM2,
      svo2Percent,
      baselineCreatinineMgDl,
      currentCreatinineMgDl,
      admissionNtProBnpPgMl,
      currentNtProBnpPgMl,
      homeOralFurosemideDoseMg,
      activeInotrope,
      inotropeDoseMcgKgMin,
      activeVasodilator,
      vasodilatorDoseMcgMin,
    };
  }, [
    patientAgeYears,
    patientWeightKg,
    systolicBpMmHg,
    diastolicBpMmHg,
    heartRateBpm,
    hasOrthopneaOrPnd,
    hasElevatedJvp,
    hasHepatojugularReflux,
    hasPulmonaryRales,
    hasLowerExtremityEdema,
    hasAscites,
    pcwpMmHg,
    cvpMmHg,
    hasNarrowPulsePressure,
    hasCoolClammyExtremities,
    hasAlteredMentation,
    hasDilutionalHyponatremia,
    serumLactateMmolL,
    cardiacIndexLMinM2,
    svo2Percent,
    baselineCreatinineMgDl,
    currentCreatinineMgDl,
    admissionNtProBnpPgMl,
    currentNtProBnpPgMl,
    homeOralFurosemideDoseMg,
    activeInotrope,
    inotropeDoseMcgKgMin,
    activeVasodilator,
    vasodilatorDoseMcgMin,
  ]);

  // Compute Comprehensive Evaluation
  const evaluation: HeartFailureComprehensiveOutput = useMemo(() => {
    return performHeartFailureEvaluation(currentInput);
  }, [currentInput]);

  const { classification, cardiorenal, diureticPlan, peptideTrajectory, pharmacotherapy } = evaluation;

  // Chart data for Biomarkers
  const biomarkerChartData = useMemo(() => {
    const targetValue = Math.round(admissionNtProBnpPgMl * 0.7);
    return [
      { name: 'Admission', value: admissionNtProBnpPgMl, fill: '#ef4444' },
      { name: 'Current', value: currentNtProBnpPgMl, fill: peptideTrajectory.isDecongestionBenchmarkMet ? '#22c55e' : '#f59e0b' },
      { name: '-30% Target', value: targetValue, fill: '#3b82f6' },
    ];
  }, [admissionNtProBnpPgMl, currentNtProBnpPgMl, peptideTrajectory.isDecongestionBenchmarkMet]);

  // Quadrant color helper
  const getProfileTheme = (profile: StevensonProfile) => {
    switch (profile) {
      case 'PROFILE_B_WARM_WET':
        return {
          border: 'border-amber-500/40',
          bg: 'bg-amber-950/20',
          text: 'text-amber-400',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        };
      case 'PROFILE_C_COLD_WET':
        return {
          border: 'border-rose-500/50',
          bg: 'bg-rose-950/30',
          text: 'text-rose-400',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        };
      case 'PROFILE_L_COLD_DRY':
        return {
          border: 'border-blue-500/40',
          bg: 'bg-blue-950/20',
          text: 'text-blue-400',
          badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
        };
      case 'PROFILE_A_WARM_DRY':
      default:
        return {
          border: 'border-emerald-500/40',
          bg: 'bg-emerald-950/20',
          text: 'text-emerald-400',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        };
    }
  };

  const currentTheme = getProfileTheme(classification.profile);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Link href="/simulators" className="hover:text-slate-200 transition">
            Simulators
          </Link>
          <span>/</span>
          <span className="text-rose-400 font-medium">
            Heart Failure (ADHF) &amp; Stevenson Profiles
          </span>
        </div>

        {/* Header Title Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-950/50 via-slate-900 to-indigo-950/40 border border-rose-800/40 p-6 md:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400">
                  <Heart className="w-8 h-8 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                    ADHF Stevenson Profiles &amp; Hemodynamics
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      AHA/ACC 2022 • ESC 2023
                    </span>
                  </h1>
                  <p className="text-sm text-slate-300 mt-1 max-w-3xl">
                    Precision hemodynamic stratification across the Forrester/Stevenson 2×2 matrix (Profiles A, B, L, C), congestive nephropathy backpressure mechanics (RPP = MAP − CVP), DOSE trial diuretic dosing, and inotrope/vasodilator safety interlocks.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center">
              <button
                onClick={() => applyPreset(ADHF_PRESETS[0])}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset Presets
              </button>
            </div>
          </div>

          {/* Quick Presets Ribbon */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap gap-2.5 items-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mr-2">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" /> Clinical Presets:
            </span>
            {ADHF_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-rose-500/50 transition flex items-center gap-2 shadow-sm"
              >
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                <span className="font-medium">{preset.name.split(':')[0]}</span>
                <span className="text-[11px] text-slate-400 hidden sm:inline">({preset.badge})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Executive Summary Cards Grid (5 Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Stevenson Profile */}
          <div className={`p-4 rounded-xl border ${currentTheme.border} ${currentTheme.bg} space-y-2 shadow-lg`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Stevenson Profile</span>
              <Activity className={`w-4 h-4 ${currentTheme.text}`} />
            </div>
            <div className="flex flex-col">
              <span className={`text-lg font-bold ${currentTheme.text}`}>{classification.profileName.split(':')[1]}</span>
              <span className="text-xs text-slate-400">{classification.profileName.split(':')[0]}</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Mortality:</span>
              <span className="font-semibold text-rose-400">~{classification.inHospitalMortalityRiskPercent}% in-hospital</span>
            </div>
          </div>

          {/* Card 2: Cardiorenal & RPP */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Renal Perfusion</span>
              <Droplets className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-cyan-300">{cardiorenal.renalPerfusionPressureMmHg} <span className="text-xs text-slate-400 font-normal">mmHg RPP</span></span>
              <span className="text-xs text-slate-400">MAP {cardiorenal.meanArterialPressureMmHg} − CVP {cardiorenal.effectiveCvpMmHg}</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Venous Stasis:</span>
              <span className={`font-semibold ${cardiorenal.isCongestiveNephropathyDominant ? 'text-amber-400' : 'text-emerald-400'}`}>
                {cardiorenal.isCongestiveNephropathyDominant ? 'Congestive Nephropathy' : 'Preserved'}
              </span>
            </div>
          </div>

          {/* Card 3: DOSE Diuretic Regimen */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">DOSE Diuretic Plan</span>
              <Pill className="w-4 h-4 text-violet-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-violet-300">{diureticPlan.recommendedIvFurosemideDoseMg} mg <span className="text-xs text-slate-400 font-normal">IV Bolus</span></span>
              <span className="text-xs text-slate-400">2.5× home dose ({diureticPlan.homeOralFurosemideDoseMg} mg PO)</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Torsemide Equiv:</span>
              <span className="font-medium text-slate-300">{diureticPlan.equivalentTorsemideOralMg} mg</span>
            </div>
          </div>

          {/* Card 4: NT-proBNP Trajectory */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">NT-proBNP Delta</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex flex-col">
              <span className={`text-xl font-bold ${peptideTrajectory.percentageChange <= -30 ? 'text-emerald-400' : peptideTrajectory.percentageChange < 0 ? 'text-amber-400' : 'text-rose-400'}`}>
                {peptideTrajectory.percentageChange > 0 ? `+${peptideTrajectory.percentageChange}%` : `${peptideTrajectory.percentageChange}%`}
              </span>
              <span className="text-xs text-slate-400">{admissionNtProBnpPgMl} → {currentNtProBnpPgMl} pg/mL</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Benchmark:</span>
              <span className={`font-semibold ${peptideTrajectory.isDecongestionBenchmarkMet ? 'text-emerald-400' : 'text-slate-400'}`}>
                {peptideTrajectory.isDecongestionBenchmarkMet ? 'Met (≥30% Drop)' : 'Sub-target'}
              </span>
            </div>
          </div>

          {/* Card 5: Inotrope & Vasodilator */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pharmacotherapy</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-amber-300 truncate">
                {classification.profile === 'PROFILE_C_COLD_WET' ? 'Inotrope + Vasopressor' : classification.profile === 'PROFILE_B_WARM_WET' ? 'IV Vasodilator' : 'GDMT Transition'}
              </span>
              <span className="text-xs text-slate-400">SBP {systolicBpMmHg} / DBP {diastolicBpMmHg}</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Safety Check:</span>
              <span className={`font-semibold ${systolicBpMmHg < 85 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {systolicBpMmHg < 85 ? 'SBP < 85 Alert!' : 'Hemodynamics Stable'}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center overflow-x-auto gap-2 border-b border-slate-800 pb-2 scrollbar-thin">
          {[
            { id: 'SYNTHESIS', label: 'Clinical Synthesis & 2×2 Diagram', icon: Layers },
            { id: 'MATRIX', label: 'Stevenson 2×2 Matrix', icon: Activity },
            { id: 'CARDIORENAL', label: 'Cardiorenal & RPP Engine', icon: Droplets },
            { id: 'DIURETICS', label: 'DOSE Diuretic Titration', icon: Pill },
            { id: 'INOTROPES', label: 'Inotropes & Vasodilators', icon: Zap },
            { id: 'BIOMARKERS', label: 'Natriuretic Peptide Trajectory', icon: TrendingUp },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-rose-400' : 'text-slate-500'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Clinical Synthesis & 2x2 Diagram */}
        {activeTab === 'SYNTHESIS' && (
          <div className="space-y-6">
            {/* Urgent Action Checklist */}
            <div className="rounded-2xl border border-rose-500/30 bg-rose-950/10 p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-2.5 text-rose-400 font-semibold text-base">
                <AlertTriangle className="w-5 h-5" />
                <span>Urgent Action Checklist &amp; Acute Trajectory</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {evaluation.urgentActionChecklist.map((action, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-slate-200 shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Forrester 2x2 Matrix */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-2 text-white font-semibold text-base">
                  <Activity className="w-5 h-5 text-indigo-400" />
                  <span>Interactive Forrester / Stevenson 2×2 Matrix</span>
                </div>
                <span className="text-xs text-slate-400">
                  Active Profile Highlighted • PCWP Cutoff 18 mmHg • CI Cutoff 2.2 L/min/m²
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Quadrant 1: Profile A (Warm & Dry) */}
                <div
                  className={`p-5 rounded-xl border transition-all ${
                    classification.profile === 'PROFILE_A_WARM_DRY'
                      ? 'border-emerald-500 bg-emerald-950/30 ring-2 ring-emerald-500/40'
                      : 'border-slate-800 bg-slate-900/40 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-emerald-400 text-base">Profile A: Warm &amp; Dry</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Mortality ~2-3%
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Adequate perfusion (CI &gt; 2.2 L/min/m²) and dry/euvolemic filling pressures (PCWP ≤ 18 mmHg). Patient is compensated. Main strategy: optimize GDMT (Quadruple Therapy: ARNI, BB, MRA, SGLT2i).
                  </p>
                </div>

                {/* Quadrant 2: Profile B (Warm & Wet) */}
                <div
                  className={`p-5 rounded-xl border transition-all ${
                    classification.profile === 'PROFILE_B_WARM_WET'
                      ? 'border-amber-500 bg-amber-950/30 ring-2 ring-amber-500/40'
                      : 'border-slate-800 bg-slate-900/40 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-amber-400 text-base">Profile B: Warm &amp; Wet</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Mortality ~7-10% • 70% of ADHF
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Congested with elevated filling pressures (PCWP &gt; 18 mmHg, high JVP, rales, edema) but preserved peripheral perfusion. Therapy: IV loop diuretics (DOSE protocol) ± IV vasodilators (Nitroglycerin). Inotropes contraindicated.
                  </p>
                </div>

                {/* Quadrant 3: Profile L (Cold & Dry) */}
                <div
                  className={`p-5 rounded-xl border transition-all ${
                    classification.profile === 'PROFILE_L_COLD_DRY'
                      ? 'border-blue-500 bg-blue-950/30 ring-2 ring-blue-500/40'
                      : 'border-slate-800 bg-slate-900/40 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-blue-400 text-base">Profile L: Cold &amp; Dry</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      Mortality ~12-15% • ~5% of ADHF
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Low forward output (CI &lt; 2.2 L/min/m², narrow pulse pressure, cold extremities) with low filling pressures (PCWP &lt; 14 mmHg). Typically over-diuresed. Requires cautious fluid challenge (250-500 mL) before inotropic agents.
                  </p>
                </div>

                {/* Quadrant 4: Profile C (Cold & Wet) */}
                <div
                  className={`p-5 rounded-xl border transition-all ${
                    classification.profile === 'PROFILE_C_COLD_WET'
                      ? 'border-rose-500 bg-rose-950/40 ring-2 ring-rose-500/40'
                      : 'border-slate-800 bg-slate-900/40 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-rose-400 text-base">Profile C: Cold &amp; Wet (Cardiogenic Shock)</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      Mortality ~25-35%
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Combined severe congestion (PCWP &gt; 18 mmHg) AND forward failure (CI &lt; 2.2 L/min/m², lactic acidosis, end-organ oliguria). Requires urgent inotropic support (Dobutamine / Milrinone), vasopressor if SBP &lt; 85 mmHg, and MCS evaluation.
                  </p>
                </div>
              </div>
            </div>

            {/* Clinical Pearls Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-base">
                <Sparkles className="w-5 h-5" />
                <span>Evidence-Based Clinical Pearls &amp; Trial Benchmarks</span>
              </div>
              <div className="space-y-3">
                {evaluation.clinicalPearls.map((pearl, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs md:text-sm text-slate-300 leading-relaxed flex items-start gap-3">
                    <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>{pearl}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Stevenson 2x2 Matrix & Hemodynamic Classifiers */}
        {activeTab === 'MATRIX' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Congestion Panel (Wet vs Dry) */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-white font-semibold text-base">
                  <Droplets className="w-5 h-5 text-cyan-400" />
                  <span>Volume Status: Wet vs. Dry</span>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${classification.isWet ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'}`}>
                  {classification.isWet ? 'WET (Congested)' : 'DRY (Euvolemic)'}
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                  <span className="text-slate-200">Orthopnea or Paroxysmal Nocturnal Dyspnea (PND)</span>
                  <input
                    type="checkbox"
                    checked={hasOrthopneaOrPnd}
                    onChange={(e) => setHasOrthopneaOrPnd(e.target.checked)}
                    className="w-4 h-4 text-cyan-500 rounded bg-slate-900 border-slate-700 focus:ring-cyan-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                  <span className="text-slate-200">Elevated Jugular Venous Pressure (JVP &gt; 8-10 cm H₂O)</span>
                  <input
                    type="checkbox"
                    checked={hasElevatedJvp}
                    onChange={(e) => setHasElevatedJvp(e.target.checked)}
                    className="w-4 h-4 text-cyan-500 rounded bg-slate-900 border-slate-700 focus:ring-cyan-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                  <span className="text-slate-200">Positive Hepatojugular Reflux (HJR)</span>
                  <input
                    type="checkbox"
                    checked={hasHepatojugularReflux}
                    onChange={(e) => setHasHepatojugularReflux(e.target.checked)}
                    className="w-4 h-4 text-cyan-500 rounded bg-slate-900 border-slate-700 focus:ring-cyan-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                  <span className="text-slate-200">Pulmonary Rales / Crackles</span>
                  <input
                    type="checkbox"
                    checked={hasPulmonaryRales}
                    onChange={(e) => setHasPulmonaryRales(e.target.checked)}
                    className="w-4 h-4 text-cyan-500 rounded bg-slate-900 border-slate-700 focus:ring-cyan-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                  <span className="text-slate-200">Peripheral Edema (Lower Extremity 2+ to 4+)</span>
                  <input
                    type="checkbox"
                    checked={hasLowerExtremityEdema}
                    onChange={(e) => setHasLowerExtremityEdema(e.target.checked)}
                    className="w-4 h-4 text-cyan-500 rounded bg-slate-900 border-slate-700 focus:ring-cyan-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                  <span className="text-slate-200">Ascites / Congestive Hepatomegaly</span>
                  <input
                    type="checkbox"
                    checked={hasAscites}
                    onChange={(e) => setHasAscites(e.target.checked)}
                    className="w-4 h-4 text-cyan-500 rounded bg-slate-900 border-slate-700 focus:ring-cyan-500"
                  />
                </label>
              </div>

              {/* PCWP Slider */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-medium text-slate-300">
                  <span>Pulmonary Capillary Wedge Pressure (PCWP):</span>
                  <span className="font-bold text-cyan-400">{pcwpMmHg} mmHg</span>
                </div>
                <input
                  type="range"
                  min={6}
                  max={36}
                  step={1}
                  value={pcwpMmHg}
                  onChange={(e) => setPcwpMmHg(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Normal (≤ 12 mmHg)</span>
                  <span>Cutoff (18 mmHg)</span>
                  <span>Severe Edema (&gt; 25 mmHg)</span>
                </div>
              </div>
            </div>

            {/* Perfusion Panel (Cold vs Warm) */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-white font-semibold text-base">
                  <Activity className="w-5 h-5 text-rose-400" />
                  <span>Perfusion Status: Cold vs. Warm</span>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${classification.isCold ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'}`}>
                  {classification.isCold ? 'COLD (Hypoperfused)' : 'WARM (Adequate Output)'}
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                  <span className="text-slate-200">Narrow Pulse Pressure (PP &lt; 25% SBP or &lt; 30 mmHg)</span>
                  <input
                    type="checkbox"
                    checked={hasNarrowPulsePressure}
                    onChange={(e) => setHasNarrowPulsePressure(e.target.checked)}
                    className="w-4 h-4 text-rose-500 rounded bg-slate-900 border-slate-700 focus:ring-rose-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                  <span className="text-slate-200">Cool, Clammy Extremities / Mottling</span>
                  <input
                    type="checkbox"
                    checked={hasCoolClammyExtremities}
                    onChange={(e) => setHasCoolClammyExtremities(e.target.checked)}
                    className="w-4 h-4 text-rose-500 rounded bg-slate-900 border-slate-700 focus:ring-rose-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                  <span className="text-slate-200">Altered Mentation / Lethargy / Somnolence</span>
                  <input
                    type="checkbox"
                    checked={hasAlteredMentation}
                    onChange={(e) => setHasAlteredMentation(e.target.checked)}
                    className="w-4 h-4 text-rose-500 rounded bg-slate-900 border-slate-700 focus:ring-rose-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                  <span className="text-slate-200">Dilutional Hyponatremia (Serum Na &lt; 135 mEq/L)</span>
                  <input
                    type="checkbox"
                    checked={hasDilutionalHyponatremia}
                    onChange={(e) => setHasDilutionalHyponatremia(e.target.checked)}
                    className="w-4 h-4 text-rose-500 rounded bg-slate-900 border-slate-700 focus:ring-rose-500"
                  />
                </label>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-200">Serum Lactate (mmol/L):</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      min="0.4"
                      max="12.0"
                      value={serumLactateMmolL}
                      onChange={(e) => setSerumLactateMmolL(Number(e.target.value))}
                      className="w-20 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-right text-rose-400 font-bold text-sm"
                    />
                    <span className="text-xs text-slate-400">{serumLactateMmolL >= 2.0 ? 'Elevated' : 'Normal'}</span>
                  </div>
                </div>
              </div>

              {/* Cardiac Index Slider */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-medium text-slate-300">
                  <span>Cardiac Index (CI):</span>
                  <span className="font-bold text-rose-400">{cardiacIndexLMinM2.toFixed(1)} L/min/m²</span>
                </div>
                <input
                  type="range"
                  min={1.0}
                  max={4.0}
                  step={0.1}
                  value={cardiacIndexLMinM2}
                  onChange={(e) => setCardiacIndexLMinM2(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Shock (&lt; 1.8)</span>
                  <span>Hypoperfusion (2.2 L/min/m²)</span>
                  <span>Normal (&gt; 2.5)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Cardiorenal Congestion & RPP Engine */}
        {activeTab === 'CARDIORENAL' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Vitals and Pressures Panel */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5 shadow-xl">
              <div className="flex items-center gap-2 text-white font-semibold text-base border-b border-slate-800 pb-3">
                <Gauge className="w-5 h-5 text-cyan-400" />
                <span>Hemodynamic Drivers &amp; Renal Pressures</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400">Systolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={systolicBpMmHg}
                    onChange={(e) => setSystolicBpMmHg(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-semibold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400">Diastolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={diastolicBpMmHg}
                    onChange={(e) => setDiastolicBpMmHg(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-semibold"
                  />
                </div>
              </div>

              {/* CVP Slider */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-medium text-slate-300">
                  <span>Central Venous Pressure (CVP):</span>
                  <span className="font-bold text-cyan-400">{cvpMmHg} mmHg</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={25}
                  step={1}
                  value={cvpMmHg}
                  onChange={(e) => setCvpMmHg(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Normal (2-6 mmHg)</span>
                  <span>Congestive Threshold (12 mmHg)</span>
                  <span>Severe Congestion (&gt; 16 mmHg)</span>
                </div>
              </div>

              {/* Renal Perfusion Pressure Output */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-cyan-950/40 border border-cyan-500/30 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase font-bold text-cyan-300">Renal Perfusion Pressure (RPP)</span>
                  <span className="text-2xl font-black text-cyan-200">{cardiorenal.renalPerfusionPressureMmHg} mmHg</span>
                </div>
                <div className="text-xs text-slate-300 font-mono">
                  RPP = MAP ({cardiorenal.meanArterialPressureMmHg} mmHg) − CVP ({cardiorenal.effectiveCvpMmHg} mmHg)
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Target RPP &gt; 60 mmHg ensures transglomerular hydrostatic driving pressure. When CVP rises above 12-14 mmHg, venous backpressure collapses peritubular capillaries, impairing renal parenchymal perfusion.
                </p>
              </div>

              {/* Creatinine Comparison */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400">Baseline Creatinine (mg/dL)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={baselineCreatinineMgDl}
                    onChange={(e) => setBaselineCreatinineMgDl(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-semibold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400">Current Creatinine (mg/dL)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={currentCreatinineMgDl}
                    onChange={(e) => setCurrentCreatinineMgDl(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Pathophysiology & Decongestion Paradox Panel */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-white font-semibold text-base border-b border-slate-800 pb-3">
                  <Droplets className="w-5 h-5 text-indigo-400" />
                  <span>Cardiorenal Syndrome &amp; Decongestion Paradox</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold uppercase text-slate-400">Clinical Interpretation:</span>
                  <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
                    {cardiorenal.clinicalInterpretation}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4" />
                    <span>The &quot;Decongestion Paradox&quot; Rule:</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    In patients with severe venous congestion (CVP &gt; 12 mmHg), aggressive loop diuresis frequently causes a transient bump in serum creatinine (0.3 to 0.5 mg/dL) due to hemoconcentration and tubuloglomerular feedback. Landmark trials (DOSE, ESCAPE) demonstrated that this transient creatinine rise does NOT indicate true parenchymal tubular injury and is paradoxically associated with IMPROVED long-term survival, provided effective decongestion is achieved.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Creatinine Fold Increase:</span>
                <span className={`font-bold text-sm ${cardiorenal.creatinineFoldIncrease >= 1.5 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {cardiorenal.creatinineFoldIncrease}× of baseline
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: DOSE Diuretic Titration */}
        {activeTab === 'DIURETICS' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input & Calculation Panel */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5 shadow-xl">
              <div className="flex items-center gap-2 text-white font-semibold text-base border-b border-slate-800 pb-3">
                <Pill className="w-5 h-5 text-violet-400" />
                <span>DOSE Protocol Diuretic Dosing</span>
              </div>

              <div className="space-y-3">
                <label className="text-xs text-slate-400 font-medium">Home Oral Furosemide Daily Dose (mg PO)</label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    step="20"
                    min="0"
                    max="320"
                    value={homeOralFurosemideDoseMg}
                    onChange={(e) => setHomeOralFurosemideDoseMg(Number(e.target.value))}
                    className="w-36 px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-violet-300 font-bold text-lg"
                  />
                  <div className="flex flex-wrap gap-2">
                    {[0, 40, 80, 160].map((dose) => (
                      <button
                        key={dose}
                        onClick={() => setHomeOralFurosemideDoseMg(dose)}
                        className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                      >
                        {dose === 0 ? 'Naive' : `${dose} mg`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommended Regimen Output */}
              <div className="p-5 rounded-xl bg-violet-950/20 border border-violet-500/40 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase font-bold text-violet-300">Recommended IV Bolus Dose</span>
                  <span className="text-3xl font-extrabold text-violet-200">
                    {diureticPlan.recommendedIvFurosemideDoseMg} mg IV
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {diureticPlan.doseRationale}
                </p>
              </div>

              {/* Spot Urine Sodium Benchmarking */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-slate-200 text-xs font-bold uppercase">
                  <Clock className="w-4 h-4 text-violet-400" />
                  <span>2-Hour Post-Dose Sodium Target</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  ESC 2023 Guidelines: Assess spot urine sodium at 2 hours post-bolus. Target is &gt; 50-70 mEq/L and 6-hour urine output &gt; 1000-1400 mL. If spot Na is &lt; 50 mEq/L, double the loop diuretic dose or add sequential nephron blockade (Metolazone 2.5-5 mg PO).
                </p>
              </div>
            </div>

            {/* Equivalencies & Electrolyte Safety */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-white font-semibold text-base border-b border-slate-800 pb-3">
                  <ShieldAlert className="w-5 h-5 text-emerald-400" />
                  <span>Loop Diuretic Equivalencies &amp; Electrolytes</span>
                </div>

                {/* Potency Table */}
                <div className="rounded-xl border border-slate-800 overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-semibold">
                      <tr>
                        <th className="p-3">Diuretic Agent</th>
                        <th className="p-3">Oral Dose</th>
                        <th className="p-3">IV Dose</th>
                        <th className="p-3">Bioavailability</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      <tr>
                        <td className="p-3 font-medium text-white">Furosemide</td>
                        <td className="p-3">{diureticPlan.homeOralFurosemideDoseMg || 40} mg</td>
                        <td className="p-3 text-violet-400 font-bold">{diureticPlan.recommendedIvFurosemideDoseMg} mg</td>
                        <td className="p-3 text-slate-400">~50% (variable)</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-white">Torsemide</td>
                        <td className="p-3">{diureticPlan.equivalentTorsemideOralMg} mg</td>
                        <td className="p-3 text-violet-400 font-bold">{diureticPlan.equivalentTorsemideOralMg} mg</td>
                        <td className="p-3 text-slate-400">~80-100% (reliable)</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-white">Bumetanide</td>
                        <td className="p-3">{diureticPlan.equivalentBumetanideOralMg} mg</td>
                        <td className="p-3 text-violet-400 font-bold">{diureticPlan.equivalentBumetanideOralMg} mg</td>
                        <td className="p-3 text-slate-400">~80-100% (reliable)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Electrolyte Safety Card */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Electrolyte Guardrails (Arrhythmia Protection):</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {diureticPlan.potassiumMagnesiumSafetyGuidance}
                  </p>
                </div>
              </div>

              <div className="text-xs text-slate-500 italic">
                *DOSE Trial (NEJM 2011): High-dose vs low-dose loop strategy did not increase 60-day all-cause mortality or rehospitalization.
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Inotropes & Vasodilators */}
        {activeTab === 'INOTROPES' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Titration & Agent Select */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5 shadow-xl">
              <div className="flex items-center gap-2 text-white font-semibold text-base border-b border-slate-800 pb-3">
                <Zap className="w-5 h-5 text-amber-400" />
                <span>Vasoactive Agent Selection &amp; Titration</span>
              </div>

              {/* Inotrope Selection */}
              <div className="space-y-3">
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Inotrope Selection</label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'NONE', label: 'None' },
                    { id: 'DOBUTAMINE', label: 'Dobutamine' },
                    { id: 'MILRINONE', label: 'Milrinone' },
                  ].map((agent) => (
                    <button
                      key={agent.id}
                      onClick={() => setActiveInotrope(agent.id as InotropeAgent)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                        activeInotrope === agent.id
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                          : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {agent.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vasodilator Selection */}
              <div className="space-y-3">
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Vasodilator Selection</label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'NONE', label: 'None' },
                    { id: 'NITROGLYCERIN', label: 'Nitroglycerin' },
                    { id: 'NITROPRUSSIDE', label: 'Nitroprusside' },
                  ].map((agent) => (
                    <button
                      key={agent.id}
                      onClick={() => setActiveVasodilator(agent.id as VasodilatorAgent)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                        activeVasodilator === agent.id
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                          : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {agent.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Safety Interlocks & Warnings */}
              {pharmacotherapy.safetyWarnings.length > 0 && (
                <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/50 space-y-2">
                  <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Safety Interlock Triggered</span>
                  </div>
                  {pharmacotherapy.safetyWarnings.map((warn, idx) => (
                    <p key={idx} className="text-xs text-rose-200 leading-relaxed font-medium">
                      {warn}
                    </p>
                  ))}
                </div>
              )}

              {/* Recommendations Box */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase">Inotrope Guidance:</span>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {pharmacotherapy.inotropeRecommendation}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-xs font-bold text-cyan-400 uppercase">Vasodilator Guidance:</span>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {pharmacotherapy.vasodilatorRecommendation}
                  </p>
                </div>
              </div>
            </div>

            {/* Milrinone vs Dobutamine & MCS Candidacy */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-white font-semibold text-base border-b border-slate-800 pb-3">
                  <Flame className="w-5 h-5 text-rose-400" />
                  <span>Inotrope Comparative Mechanics &amp; MCS</span>
                </div>

                {/* Comparison Table */}
                <div className="rounded-xl border border-slate-800 overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-semibold">
                      <tr>
                        <th className="p-2.5">Feature</th>
                        <th className="p-2.5 text-amber-400">Dobutamine (β1/β2)</th>
                        <th className="p-2.5 text-indigo-400">Milrinone (PDE3-i)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      <tr>
                        <td className="p-2.5 font-medium">Beta-blocker on board</td>
                        <td className="p-2.5 text-rose-400">Blunted effect</td>
                        <td className="p-2.5 text-emerald-400 font-bold">Bypasses β-receptor</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium">Pulmonary vasodilation</td>
                        <td className="p-2.5">Modest</td>
                        <td className="p-2.5 text-indigo-300 font-bold">Marked PVR reduction</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium">Renal clearance</td>
                        <td className="p-2.5 text-emerald-400 font-bold">Hepatic metabolism</td>
                        <td className="p-2.5 text-amber-400">Renal (reduce if CrCl &lt; 30)</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium">Profound hypotension</td>
                        <td className="p-2.5 text-emerald-400 font-bold">Preferred (less vasodilation)</td>
                        <td className="p-2.5 text-rose-400">Severe vasodilation / collapse</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* MCS Candidacy */}
                <div className={`p-4 rounded-xl border space-y-2 ${pharmacotherapy.mechanicalCirculatorySupportCandidate ? 'bg-rose-950/20 border-rose-500/40' : 'bg-slate-950/80 border-slate-800'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-slate-300">Mechanical Circulatory Support (MCS) Candidacy</span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${pharmacotherapy.mechanicalCirculatorySupportCandidate ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-slate-800 text-slate-400'}`}>
                      {pharmacotherapy.mechanicalCirculatorySupportCandidate ? 'CANDIDATE (Shock Stage C/D)' : 'Not Indicated'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {pharmacotherapy.mechanicalCirculatorySupportCandidate
                      ? 'Patient exhibits refractory Profile C hemodynamics. Prompt evaluation for temporary MCS (Impella CP/5.5, Intra-Aortic Balloon Pump [IABP], or Venoarterial ECMO) is warranted before irreversible multiorgan hypoperfusion.'
                      : 'Hemodynamics do not warrant invasive mechanical circulatory support at this time.'}
                  </p>
                </div>
              </div>

              <div className="text-xs text-slate-500 italic">
                *ESCAPE &amp; OPTIME-CHF Trials: Routine inotropes in non-hypoperfused ADHF (Profile B) increase tachyarrhythmias and mortality without clinical benefit.
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Natriuretic Peptide Trajectory */}
        {activeTab === 'BIOMARKERS' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input & Benchmark Assessment */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5 shadow-xl">
              <div className="flex items-center gap-2 text-white font-semibold text-base border-b border-slate-800 pb-3">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span>NT-proBNP Decongestion Monitoring</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-medium">Admission NT-proBNP (pg/mL)</label>
                  <input
                    type="number"
                    value={admissionNtProBnpPgMl}
                    onChange={(e) => setAdmissionNtProBnpPgMl(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-semibold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-medium">Current NT-proBNP (pg/mL)</label>
                  <input
                    type="number"
                    value={currentNtProBnpPgMl}
                    onChange={(e) => setCurrentNtProBnpPgMl(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-semibold"
                  />
                </div>
              </div>

              {/* Percentage Change Card */}
              <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase font-bold text-slate-400">Trajectory Delta</span>
                  <span className={`text-3xl font-black ${peptideTrajectory.percentageChange <= -30 ? 'text-emerald-400' : peptideTrajectory.percentageChange < 0 ? 'text-amber-400' : 'text-rose-400'}`}>
                    {peptideTrajectory.percentageChange > 0 ? `+${peptideTrajectory.percentageChange}%` : `${peptideTrajectory.percentageChange}%`}
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${peptideTrajectory.isDecongestionBenchmarkMet ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    style={{
                      width: `${Math.min(100, Math.max(0, Math.abs(peptideTrajectory.percentageChange) * 2))}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {peptideTrajectory.prognosticAssessment}
                </p>
              </div>

              {/* Landmark Discharge Criterion */}
              <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Discharge Readiness Benchmark:</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  A decline of ≥30% in NT-proBNP during hospitalization reflects genuine biological and hemodynamic decongestion, correlating with a 50% reduction in 30-day post-discharge cardiovascular mortality or rehospitalization (B-type Natriuretic Peptide Discharge Guidance).
                </p>
              </div>
            </div>

            {/* Recharts BarChart Visualization */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-white font-semibold text-base">
                    <Activity className="w-5 h-5 text-indigo-400" />
                    <span>Trajectory vs. Benchmark</span>
                  </div>
                  <span className="text-xs text-slate-400">Target: ≤ 70% of peak</span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={biomarkerChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          borderRadius: '0.75rem',
                          color: '#f8fafc',
                        }}
                      />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {biomarkerChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-rose-950/20 border border-rose-500/30">
                    <span className="text-slate-400 block">Admission</span>
                    <span className="font-bold text-rose-300">{admissionNtProBnpPgMl} pg/mL</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400 block">Current</span>
                    <span className="font-bold text-slate-200">{currentNtProBnpPgMl} pg/mL</span>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-950/20 border border-blue-500/30">
                    <span className="text-slate-400 block">-30% Target</span>
                    <span className="font-bold text-blue-300">{Math.round(admissionNtProBnpPgMl * 0.7)} pg/mL</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-500 italic">
                *Note: In renal failure or severe obesity (BMI &gt; 35), absolute natriuretic peptide thresholds shift; however, relative percent changes retain robust prognostic fidelity.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
