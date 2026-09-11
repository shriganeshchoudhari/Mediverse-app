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
  Heart,
  Stethoscope,
  Info,
  Clock,
  RefreshCw,
  TrendingUp,
  Flame,
  ArrowRight,
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
  HeartHistoryScore,
  HeartEcgScore,
  HeartAgeScore,
  HeartRiskFactorsScore,
  HeartTroponinScore,
  EscTroponinAssay,
  EscProtocolTiming,
  KillipClass,
  HeartScoreInput,
  HsTroponinInput,
  TimiScoreInput,
  GraceScoreInput,
  AcsPharmacotherapyInput,
  performComprehensiveAcsEvaluation,
  ACS_PRESETS,
} from '../../.gemini/skills/AcsRiskTroponinEngine';

export default function AcsRiskSimulator() {
  // HEART Score State
  const [historyScore, setHistoryScore] = useState<HeartHistoryScore>(1);
  const [ecgScore, setEcgScore] = useState<HeartEcgScore>(1);
  const [ageScore, setAgeScore] = useState<HeartAgeScore>(1);
  const [riskFactorsScore, setRiskFactorsScore] = useState<HeartRiskFactorsScore>(1);
  const [troponinScore, setTroponinScore] = useState<HeartTroponinScore>(1);

  // ESC hs-cTn Rapid Protocol State
  const [assay, setAssay] = useState<EscTroponinAssay>('HS_CTNT_ROCHE');
  const [timingProtocol, setTimingProtocol] = useState<EscProtocolTiming>('ZERO_ONE_HOUR');
  const [chestPainOnsetHours, setChestPainOnsetHours] = useState<number>(3.5);
  const [baselineTroponin, setBaselineTroponin] = useState<number>(14.0);
  const [repeatTroponin, setRepeatTroponin] = useState<number>(15.5);

  // TIMI Score State
  const [age65OrOlder, setAge65OrOlder] = useState<boolean>(false);
  const [threeOrMoreCadRiskFactors, setThreeOrMoreCadRiskFactors] = useState<boolean>(true);
  const [knownCadStenosis50Percent, setKnownCadStenosis50Percent] = useState<boolean>(false);
  const [aspirinUsePast7Days, setAspirinUsePast7Days] = useState<boolean>(false);
  const [severeAnginaEpisodesPast24h, setSevereAnginaEpisodesPast24h] = useState<boolean>(true);
  const [stDeviationPoint5Mm, setStDeviationPoint5Mm] = useState<boolean>(false);
  const [elevatedCardiacMarkers, setElevatedCardiacMarkers] = useState<boolean>(false);

  // GRACE 2.0 Score State
  const [ageYears, setAgeYears] = useState<number>(56);
  const [heartRateBpm, setHeartRateBpm] = useState<number>(76);
  const [systolicBpMmHg, setSystolicBpMmHg] = useState<number>(130);
  const [serumCreatinineMgDl, setSerumCreatinineMgDl] = useState<number>(1.0);
  const [killipClass, setKillipClass] = useState<KillipClass>(1);
  const [cardiacArrestAtAdmission, setCardiacArrestAtAdmission] = useState<boolean>(false);
  const [stSegmentDeviationGrace, setStSegmentDeviationGrace] = useState<boolean>(false);
  const [elevatedMarkersGrace, setElevatedMarkersGrace] = useState<boolean>(false);

  // Pharmacotherapy & Safety Interlock State
  const [contraindicationAspirin, setContraindicationAspirin] = useState<boolean>(false);
  const [priorStrokeOrTia, setPriorStrokeOrTia] = useState<boolean>(false);
  const [age75OrWeightUnder60, setAge75OrWeightUnder60] = useState<boolean>(false);
  const [plannedEarlyInvasiveCath, setPlannedEarlyInvasiveCath] = useState<boolean>(false);
  const [rvInfarctionSuspected, setRvInfarctionSuspected] = useState<boolean>(false);
  const [recentPde5Use, setRecentPde5Use] = useState<boolean>(false);
  const [giBleedRiskHigh, setGiBleedRiskHigh] = useState<boolean>(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'HEART' | 'TROPONIN' | 'TIMI_GRACE' | 'PHARMA' | 'EVALUATION'>('EVALUATION');

  // Compute evaluation via Engine
  const evaluation = useMemo(() => {
    const heartInput: HeartScoreInput = {
      history: historyScore,
      ecg: ecgScore,
      age: ageScore,
      riskFactors: riskFactorsScore,
      troponin: troponinScore,
    };

    const troponinInput: HsTroponinInput = {
      assay,
      protocolTiming: timingProtocol,
      chestPainOnsetHours,
      baselineTroponinNgL: baselineTroponin,
      repeatTroponinNgL: repeatTroponin,
    };

    const timiInput: TimiScoreInput = {
      age65OrOlder,
      threeOrMoreCadRiskFactors,
      knownCadStenosis50Percent,
      aspirinUsePast7Days,
      severeAnginaEpisodesPast24h,
      stDeviationPoint5Mm,
      elevatedCardiacMarkers,
    };

    const graceInput: GraceScoreInput = {
      ageYears,
      heartRateBpm,
      systolicBpMmHg,
      serumCreatinineMgDl,
      killipClass,
      cardiacArrestAtAdmission,
      stSegmentDeviation: stSegmentDeviationGrace,
      elevatedCardiacMarkers: elevatedMarkersGrace,
    };

    const pharmacotherapyInput: AcsPharmacotherapyInput = {
      contraindicationToAspirin: contraindicationAspirin,
      priorStrokeOrTia,
      ageOver75OrWeightUnder60Kg: age75OrWeightUnder60,
      plannedEarlyInvasiveCatheterization: plannedEarlyInvasiveCath,
      rightVentricularInfarctionSuspected: rvInfarctionSuspected,
      recentPde5InhibitorUse: recentPde5Use,
      gastrointestinalBleedRiskHigh: giBleedRiskHigh,
    };

    return performComprehensiveAcsEvaluation({
      heartInput,
      troponinInput,
      timiInput,
      graceInput,
      pharmacotherapyInput,
    });
  }, [
    historyScore,
    ecgScore,
    ageScore,
    riskFactorsScore,
    troponinScore,
    assay,
    timingProtocol,
    chestPainOnsetHours,
    baselineTroponin,
    repeatTroponin,
    age65OrOlder,
    threeOrMoreCadRiskFactors,
    knownCadStenosis50Percent,
    aspirinUsePast7Days,
    severeAnginaEpisodesPast24h,
    stDeviationPoint5Mm,
    elevatedCardiacMarkers,
    ageYears,
    heartRateBpm,
    systolicBpMmHg,
    serumCreatinineMgDl,
    killipClass,
    cardiacArrestAtAdmission,
    stSegmentDeviationGrace,
    elevatedMarkersGrace,
    contraindicationAspirin,
    priorStrokeOrTia,
    age75OrWeightUnder60,
    plannedEarlyInvasiveCath,
    rvInfarctionSuspected,
    recentPde5Use,
    giBleedRiskHigh,
  ]);

  // Apply clinical preset
  const applyPreset = (presetId: string) => {
    const preset = ACS_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    // HEART
    setHistoryScore(preset.inputs.heart.history);
    setEcgScore(preset.inputs.heart.ecg);
    setAgeScore(preset.inputs.heart.age);
    setRiskFactorsScore(preset.inputs.heart.riskFactors);
    setTroponinScore(preset.inputs.heart.troponin);

    // hs-cTn
    setAssay(preset.inputs.troponin.assay);
    setTimingProtocol(preset.inputs.troponin.protocolTiming);
    setChestPainOnsetHours(preset.inputs.troponin.chestPainOnsetHours);
    setBaselineTroponin(preset.inputs.troponin.baselineTroponinNgL);
    setRepeatTroponin(preset.inputs.troponin.repeatTroponinNgL);

    // TIMI
    setAge65OrOlder(preset.inputs.timi.age65OrOlder);
    setThreeOrMoreCadRiskFactors(preset.inputs.timi.threeOrMoreCadRiskFactors);
    setKnownCadStenosis50Percent(preset.inputs.timi.knownCadStenosis50Percent);
    setAspirinUsePast7Days(preset.inputs.timi.aspirinUsePast7Days);
    setSevereAnginaEpisodesPast24h(preset.inputs.timi.severeAnginaEpisodesPast24h);
    setStDeviationPoint5Mm(preset.inputs.timi.stDeviationPoint5Mm);
    setElevatedCardiacMarkers(preset.inputs.timi.elevatedCardiacMarkers);

    // GRACE
    setAgeYears(preset.inputs.grace.ageYears);
    setHeartRateBpm(preset.inputs.grace.heartRateBpm);
    setSystolicBpMmHg(preset.inputs.grace.systolicBpMmHg);
    setSerumCreatinineMgDl(preset.inputs.grace.serumCreatinineMgDl);
    setKillipClass(preset.inputs.grace.killipClass);
    setCardiacArrestAtAdmission(preset.inputs.grace.cardiacArrestAtAdmission);
    setStSegmentDeviationGrace(preset.inputs.grace.stSegmentDeviation);
    setElevatedMarkersGrace(preset.inputs.grace.elevatedCardiacMarkers);

    // Pharma
    setContraindicationAspirin(preset.inputs.pharmacotherapy.contraindicationToAspirin);
    setPriorStrokeOrTia(preset.inputs.pharmacotherapy.priorStrokeOrTia);
    setAge75OrWeightUnder60(preset.inputs.pharmacotherapy.ageOver75OrWeightUnder60Kg);
    setPlannedEarlyInvasiveCath(preset.inputs.pharmacotherapy.plannedEarlyInvasiveCatheterization);
    setRvInfarctionSuspected(preset.inputs.pharmacotherapy.rightVentricularInfarctionSuspected);
    setRecentPde5Use(preset.inputs.pharmacotherapy.recentPde5InhibitorUse);
    setGiBleedRiskHigh(preset.inputs.pharmacotherapy.gastrointestinalBleedRiskHigh);
  };

  // Recharts troponin comparison data
  const troponinComparisonData = useMemo(() => {
    const isRoche = assay === 'HS_CTNT_ROCHE';
    const ruleOutCutoff = isRoche ? 5 : 4;
    const ruleInCutoff = 52;
    return [
      {
        name: '0h Baseline',
        troponin: baselineTroponin,
        ruleOutCutoff,
        ruleInCutoff,
      },
      {
        name: timingProtocol === 'ZERO_ONE_HOUR' ? '1h Repeat' : '2h Repeat',
        troponin: repeatTroponin,
        ruleOutCutoff,
        ruleInCutoff,
      },
    ];
  }, [assay, baselineTroponin, repeatTroponin, timingProtocol]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      {/* Header Bar */}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-400">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                  ACS Risk Stratification & hs-cTn Delta Workstation
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium">
                    HEART • TIMI • GRACE • ESC 0/1h
                  </span>
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  High-Sensitivity Troponin Delta Protocol, Multi-Score Ischemic Stratification & Evidence-Based Revascularization Timing
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
            <Sparkles className="w-4 h-4 text-rose-400" />
            Standard Clinical Vignettes & Benchmark Pathways
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {ACS_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset.id)}
                className="text-left p-3 rounded-lg bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800/80 hover:border-rose-500/40 transition group"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-semibold text-xs text-slate-200 group-hover:text-rose-300 transition">
                    {preset.name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    {preset.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {preset.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Executive Stratification Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* HEART Score Summary */}
          <div
            className={`p-4 rounded-xl border ${
              evaluation.heart.riskCategory === 'LOW'
                ? 'bg-emerald-950/20 border-emerald-500/30'
                : evaluation.heart.riskCategory === 'INTERMEDIATE'
                ? 'bg-amber-950/20 border-amber-500/30'
                : 'bg-rose-950/20 border-rose-500/30'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-1">
              <span>HEART Score</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  evaluation.heart.riskCategory === 'LOW'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : evaluation.heart.riskCategory === 'INTERMEDIATE'
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-rose-500/20 text-rose-300'
                }`}
              >
                {evaluation.heart.riskCategory} RISK
              </span>
            </div>
            <div className="text-3xl font-extrabold text-white mt-1">
              {evaluation.heart.totalScore} <span className="text-sm font-normal text-slate-400">/ 10</span>
            </div>
            <div className="text-xs text-slate-300 mt-2">
              6-Week MACE: <span className="font-bold text-white">{evaluation.heart.maceRatePercent}%</span>
            </div>
          </div>

          {/* ESC hs-cTn Rapid Decision Pathway */}
          <div
            className={`p-4 rounded-xl border ${
              evaluation.troponinEsc.pathway === 'RULE_OUT'
                ? 'bg-emerald-950/20 border-emerald-500/30'
                : evaluation.troponinEsc.pathway === 'OBSERVE'
                ? 'bg-amber-950/20 border-amber-500/30'
                : 'bg-rose-950/20 border-rose-500/30'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-1">
              <span>ESC Troponin Protocol</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  evaluation.troponinEsc.pathway === 'RULE_OUT'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : evaluation.troponinEsc.pathway === 'OBSERVE'
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-rose-500/20 text-rose-300'
                }`}
              >
                {evaluation.troponinEsc.pathway.replace('_', '-')}
              </span>
            </div>
            <div className="text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
              {evaluation.troponinEsc.pathway === 'RULE_OUT' ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              ) : evaluation.troponinEsc.pathway === 'OBSERVE' ? (
                <Clock className="w-6 h-6 text-amber-400" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-rose-400" />
              )}
              <span>{evaluation.troponinEsc.pathway === 'RULE_OUT' ? 'RULE-OUT' : evaluation.troponinEsc.pathway === 'OBSERVE' ? 'OBSERVE' : 'RULE-IN'}</span>
            </div>
            <div className="text-xs text-slate-300 mt-2">
              Delta: <span className="font-mono font-bold text-white">{evaluation.troponinEsc.deltaTroponinNgL > 0 ? `+${evaluation.troponinEsc.deltaTroponinNgL}` : evaluation.troponinEsc.deltaTroponinNgL} ng/L</span>
            </div>
          </div>

          {/* TIMI Score Summary */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-1">
              <span>TIMI Risk Score</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold">
                {evaluation.timi.riskTier} TIER
              </span>
            </div>
            <div className="text-3xl font-extrabold text-white mt-1">
              {evaluation.timi.totalScore} <span className="text-sm font-normal text-slate-400">/ 7</span>
            </div>
            <div className="text-xs text-slate-300 mt-2">
              14-Day MACE: <span className="font-bold text-white">{evaluation.timi.fourteenDayMacePercent}%</span>
            </div>
          </div>

          {/* GRACE 2.0 In-Hospital Score */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-1">
              <span>GRACE 2.0 Score</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold">
                {evaluation.grace.riskCategory}
              </span>
            </div>
            <div className="text-3xl font-extrabold text-white mt-1">
              {evaluation.grace.totalScore} <span className="text-sm font-normal text-slate-400">pts</span>
            </div>
            <div className="text-xs text-slate-300 mt-2">
              In-Hosp Mort: <span className="font-bold text-white">{evaluation.grace.inHospitalMortalityPercent}%</span> | 6-Mo: <span className="font-bold text-white">{evaluation.grace.sixMonthMortalityPercent}%</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('EVALUATION')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'EVALUATION'
                ? 'border-rose-500 text-rose-400 bg-rose-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Unified Clinical Synthesis
          </button>
          <button
            onClick={() => setActiveTab('HEART')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'HEART'
                ? 'border-rose-500 text-rose-400 bg-rose-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            HEART Score Calculator
          </button>
          <button
            onClick={() => setActiveTab('TROPONIN')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'TROPONIN'
                ? 'border-rose-500 text-rose-400 bg-rose-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            hs-cTn Kinetics & ESC Algorithm
          </button>
          <button
            onClick={() => setActiveTab('TIMI_GRACE')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'TIMI_GRACE'
                ? 'border-rose-500 text-rose-400 bg-rose-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            TIMI & GRACE 2.0 Workstation
          </button>
          <button
            onClick={() => setActiveTab('PHARMA')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'PHARMA'
                ? 'border-rose-500 text-rose-400 bg-rose-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            DAPT & Safety Interlocks
          </button>
        </div>

        {/* Tab 1: Unified Clinical Synthesis */}
        {activeTab === 'EVALUATION' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
                <Activity className="w-5 h-5 text-rose-400" />
                Integrated Management Synthesis & Clinical Action Plan
              </h2>
              <div
                className={`p-4 rounded-xl border leading-relaxed text-sm ${
                  evaluation.troponinEsc.pathway === 'RULE_IN'
                    ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                    : evaluation.troponinEsc.pathway === 'RULE_OUT' && evaluation.heart.riskCategory === 'LOW'
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                    : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                }`}
              >
                {evaluation.unifiedClinicalSynthesis}
              </div>

              {/* Early Presenter Warning Banner */}
              {evaluation.troponinEsc.earlyPresenterWarning && (
                <div className="mt-4 p-4 rounded-xl bg-amber-950/40 border border-amber-500/50 text-amber-200 flex items-start gap-3 text-xs leading-relaxed">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold uppercase tracking-wider block text-amber-300 mb-0.5">
                      Critical Safeguard: Hyperacute Presentation (&lt;3 Hours)
                    </span>
                    {evaluation.troponinEsc.pathwayRationale}
                  </div>
                </div>
              )}

              {/* Critical Safety Warnings if any */}
              {evaluation.pharmacotherapy.criticalWarnings.length > 0 && (
                <div className="mt-4 space-y-2">
                  {evaluation.pharmacotherapy.criticalWarnings.map((warning, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/50 text-rose-200 flex items-center gap-2.5 text-xs font-semibold"
                    >
                      <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{warning}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Revascularization Timing Recommendation */}
              <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-rose-400" />
                  Catheterization Timing Guideline (ESC 2023 ACS Guidelines)
                </div>
                <div className="text-base font-extrabold text-white mt-1">
                  {evaluation.grace.invasiveStrategyTiming === 'IMMEDIATE_LESS_THAN_2H' && (
                    <span className="text-rose-400">IMMEDIATE INVASIVE STRATEGY (&lt; 2 HOURS)</span>
                  )}
                  {evaluation.grace.invasiveStrategyTiming === 'EARLY_LESS_THAN_24H' && (
                    <span className="text-amber-400">EARLY INVASIVE STRATEGY (&lt; 24 HOURS)</span>
                  )}
                  {evaluation.grace.invasiveStrategyTiming === 'SELECTIVE_OR_NON_INVASIVE' && (
                    <span className="text-emerald-400">SELECTIVE INVASIVE / NON-INVASIVE TESTING</span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {evaluation.grace.timingRationale}
                </p>
              </div>
            </div>

            {/* Troponin Kinetic Trajectory Visualization */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-rose-400" />
                Serial Troponin Kinetics vs ESC Rule-Out / Rule-In Thresholds (ng/L)
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={troponinComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }}
                    />
                    <Legend />
                    <Bar dataKey="troponin" name="Patient hs-cTn (ng/L)" fill="#f43f5e" radius={[4, 4, 0, 0]}>
                      {troponinComparisonData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.troponin >= 52 ? '#ef4444' : entry.troponin <= 5 ? '#10b981' : '#f59e0b'}
                        />
                      ))}
                    </Bar>
                    <Bar dataKey="ruleOutCutoff" name="Rule-Out Upper Limit" fill="#10b981" fillOpacity={0.3} />
                    <Bar dataKey="ruleInCutoff" name="Rule-In Threshold (52 ng/L)" fill="#ef4444" fillOpacity={0.3} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-slate-400 text-center mt-2">
                Green zone (&le;5 ng/L) indicates Rule-Out candidacy; Red zone (&ge;52 ng/L or acute surge) confirms myocardial injury.
              </p>
            </div>

            {/* Teaching Pearls */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-3">
                <Info className="w-4 h-4 text-cyan-400" />
                Core Cardiology & Emergency Medicine Teaching Pearls
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {evaluation.teachingPearls.map((pearl, idx) => (
                  <div key={idx} className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                    {pearl}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: HEART Score Calculator */}
        {activeTab === 'HEART' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-400" />
                HEART Score Calculator for Emergency Room Chest Pain
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Validated 0-10 point risk tool predicting 6-week Major Adverse Cardiac Events (MACE: all-cause death, myocardial infarction, coronary revascularization).
              </p>
            </div>

            <div className="space-y-4">
              {/* History */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  1. History of Chest Pain Presentation
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { val: 0, label: 'Slightly Suspicious (0 pts)', desc: 'Pleuritic, sharp, localized, or positional discomfort' },
                    { val: 1, label: 'Moderately Suspicious (1 pt)', desc: 'Typical retrosternal tightness but atypical features' },
                    { val: 2, label: 'Highly Suspicious (2 pts)', desc: 'Classic crushing pressure radiating to jaw, neck, or left arm' },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => setHistoryScore(opt.val as HeartHistoryScore)}
                      className={`p-3 rounded-lg text-left border text-xs transition ${
                        historyScore === opt.val
                          ? 'bg-rose-500/20 border-rose-500 text-rose-200'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-white">{opt.label}</div>
                      <div className="text-[11px] text-slate-400 mt-1">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* ECG */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  2. Admission 12-Lead Electrocardiogram (ECG)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { val: 0, label: 'Normal (0 pts)', desc: 'No repolarization abnormality or bundle branch block' },
                    { val: 1, label: 'Non-Specific Abnormality (1 pt)', desc: 'LBBB, paced rhythm, non-specific ST-T changes' },
                    { val: 2, label: 'Significant ST Deviation (2 pts)', desc: 'ST depression &gt; 1mm or T-wave inversion without STEMI alert' },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => setEcgScore(opt.val as HeartEcgScore)}
                      className={`p-3 rounded-lg text-left border text-xs transition ${
                        ecgScore === opt.val
                          ? 'bg-rose-500/20 border-rose-500 text-rose-200'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-white">{opt.label}</div>
                      <div className="text-[11px] text-slate-400 mt-1">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Age */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  3. Patient Age
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { val: 0, label: '&lt; 45 Years (0 pts)', desc: 'Low chronological cardiovascular vulnerability' },
                    { val: 1, label: '45 - 64 Years (1 pt)', desc: 'Intermediate age cohort' },
                    { val: 2, label: '&ge; 65 Years (2 pts)', desc: 'High atherosclerotic burden threshold' },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => setAgeScore(opt.val as HeartAgeScore)}
                      className={`p-3 rounded-lg text-left border text-xs transition ${
                        ageScore === opt.val
                          ? 'bg-rose-500/20 border-rose-500 text-rose-200'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-white">{opt.label.replace('&lt;', '<').replace('&ge;', '≥')}</div>
                      <div className="text-[11px] text-slate-400 mt-1">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Risk Factors */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  4. Cardiovascular Risk Factors (HTN, Hyperlipidemia, DM, Smoking, Fam Hx, BMI&gt;30)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { val: 0, label: 'No Known Risk Factors (0 pts)', desc: 'Zero documented conventional risk factors' },
                    { val: 1, label: '1 - 2 Risk Factors (1 pt)', desc: 'Single or dual established risk markers' },
                    { val: 2, label: '&ge; 3 Factors or Established CAD (2 pts)', desc: 'Prior MI, CABG, PCI, stroke, or peripheral arterial disease' },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => setRiskFactorsScore(opt.val as HeartRiskFactorsScore)}
                      className={`p-3 rounded-lg text-left border text-xs transition ${
                        riskFactorsScore === opt.val
                          ? 'bg-rose-500/20 border-rose-500 text-rose-200'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-white">{opt.label.replace('&ge;', '≥')}</div>
                      <div className="text-[11px] text-slate-400 mt-1">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Troponin */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  5. Baseline Cardiac Troponin Concentration
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { val: 0, label: '&le; Normal URL (0 pts)', desc: 'Below 99th percentile upper reference limit' },
                    { val: 1, label: '1 - 3x Normal URL (1 pt)', desc: 'Mild or intermediate elevation' },
                    { val: 2, label: '&gt; 3x Normal URL (2 pts)', desc: 'Marked myocardial necrosis biomarker release' },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => setTroponinScore(opt.val as HeartTroponinScore)}
                      className={`p-3 rounded-lg text-left border text-xs transition ${
                        troponinScore === opt.val
                          ? 'bg-rose-500/20 border-rose-500 text-rose-200'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-white">{opt.label.replace('&le;', '≤').replace('&gt;', '>')}</div>
                      <div className="text-[11px] text-slate-400 mt-1">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Calculated Result Card */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total HEART Score</div>
                  <div className="text-2xl font-extrabold text-white mt-0.5">
                    {evaluation.heart.totalScore} / 10 ({evaluation.heart.riskCategory} RISK)
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">6-Week MACE Rate</div>
                  <div className="text-2xl font-extrabold text-rose-400 mt-0.5">{evaluation.heart.maceRatePercent}%</div>
                </div>
              </div>
              <p className="text-xs text-slate-300 mt-3 leading-relaxed border-t border-slate-800 pt-3">
                {evaluation.heart.recommendation}
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: hs-cTn Kinetics & ESC Protocol */}
        {activeTab === 'TROPONIN' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-rose-400" />
                ESC High-Sensitivity Cardiac Troponin (hs-cTn) 0/1h & 0/2h Protocol
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                European Society of Cardiology validated algorithm integrating baseline concentrations and minute kinetic deltas for rapid rule-out and rule-in.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Assay Selection */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  hs-cTn Clinical Assay
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setAssay('HS_CTNT_ROCHE')}
                    className={`p-3 rounded-lg border text-xs font-semibold transition ${
                      assay === 'HS_CTNT_ROCHE'
                        ? 'bg-rose-500/20 border-rose-500 text-rose-200'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    hs-cTnT (Roche Elecsys)
                  </button>
                  <button
                    onClick={() => setAssay('HS_CTNI_ABBOTT')}
                    className={`p-3 rounded-lg border text-xs font-semibold transition ${
                      assay === 'HS_CTNI_ABBOTT'
                        ? 'bg-rose-500/20 border-rose-500 text-rose-200'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    hs-cTnI (Abbott Architect)
                  </button>
                </div>
              </div>

              {/* Protocol Timing */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Sampling Protocol
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setTimingProtocol('ZERO_ONE_HOUR')}
                    className={`p-3 rounded-lg border text-xs font-semibold transition ${
                      timingProtocol === 'ZERO_ONE_HOUR'
                        ? 'bg-rose-500/20 border-rose-500 text-rose-200'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    0 / 1-Hour Protocol
                  </button>
                  <button
                    onClick={() => setTimingProtocol('ZERO_TWO_HOUR')}
                    className={`p-3 rounded-lg border text-xs font-semibold transition ${
                      timingProtocol === 'ZERO_TWO_HOUR'
                        ? 'bg-rose-500/20 border-rose-500 text-rose-200'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    0 / 2-Hour Protocol
                  </button>
                </div>
              </div>
            </div>

            {/* Biomarker Sliders */}
            <div className="space-y-4">
              {/* Chest Pain Onset Hours */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Duration from Chest Pain Onset
                  </label>
                  <span className="text-xs font-mono font-bold text-rose-400">{chestPainOnsetHours} hours</span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={24}
                  step={0.5}
                  value={chestPainOnsetHours}
                  onChange={(e) => setChestPainOnsetHours(parseFloat(e.target.value))}
                  className="w-full accent-rose-500"
                />
                {chestPainOnsetHours < 3.0 && (
                  <p className="text-[11px] text-amber-400 mt-1">
                    Notice: Onset &lt;3h triggers the early presenter caveat. A negative 0h troponin cannot safely rule out ACS alone.
                  </p>
                )}
              </div>

              {/* Baseline Troponin */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    0-Hour Baseline Troponin
                  </label>
                  <span className="text-xs font-mono font-bold text-rose-400">{baselineTroponin} ng/L</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={200}
                  step={1}
                  value={baselineTroponin}
                  onChange={(e) => setBaselineTroponin(parseFloat(e.target.value))}
                  className="w-full accent-rose-500"
                />
              </div>

              {/* Repeat Troponin */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    {timingProtocol === 'ZERO_ONE_HOUR' ? '1-Hour Repeat Troponin' : '2-Hour Repeat Troponin'}
                  </label>
                  <span className="text-xs font-mono font-bold text-rose-400">{repeatTroponin} ng/L</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={250}
                  step={1}
                  value={repeatTroponin}
                  onChange={(e) => setRepeatTroponin(parseFloat(e.target.value))}
                  className="w-full accent-rose-500"
                />
              </div>
            </div>

            {/* Diagnostic Outcome Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Diagnostic Pathway</span>
                <span className="text-xs font-bold text-rose-400">
                  {evaluation.troponinEsc.pathway.replace('_', '-')}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {evaluation.troponinEsc.pathwayRationale}
              </p>
              <div className="border-t border-slate-800 pt-2 text-xs text-slate-400">
                <span className="font-semibold text-white">Recommended Action: </span>
                {evaluation.troponinEsc.clinicalAction}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: TIMI & GRACE 2.0 Workstation */}
        {activeTab === 'TIMI_GRACE' && (
          <div className="space-y-6">
            {/* TIMI Score Panel */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-rose-400" />
                TIMI Risk Score for UA/NSTEMI (7 Dichotomous Predictors)
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  { label: 'Age ≥ 65 years', val: age65OrOlder, set: setAge65OrOlder },
                  { label: '≥ 3 CAD Risk Factors (HTN, DM, Smoking, Dyslipidemia, Family Hx)', val: threeOrMoreCadRiskFactors, set: setThreeOrMoreCadRiskFactors },
                  { label: 'Known CAD (Prior Coronary Stenosis ≥ 50%)', val: knownCadStenosis50Percent, set: setKnownCadStenosis50Percent },
                  { label: 'Aspirin Use within Past 7 Days', val: aspirinUsePast7Days, set: setAspirinUsePast7Days },
                  { label: 'Severe Angina (≥ 2 anginal episodes in past 24 hours)', val: severeAnginaEpisodesPast24h, set: setSevereAnginaEpisodesPast24h },
                  { label: 'ST-Segment Deviation ≥ 0.5 mm on Admission ECG', val: stDeviationPoint5Mm, set: setStDeviationPoint5Mm },
                  { label: 'Elevated Cardiac Biomarkers (cTn or CK-MB)', val: elevatedCardiacMarkers, set: setElevatedCardiacMarkers },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => item.set(!item.val)}
                    className={`p-3 rounded-lg border text-left flex items-center justify-between transition ${
                      item.val
                        ? 'bg-rose-500/20 border-rose-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="font-bold text-xs font-mono">{item.val ? '+1 pt' : '0 pts'}</span>
                  </button>
                ))}
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
                <div>
                  <span className="text-slate-400">TIMI Score: </span>
                  <span className="font-bold text-white text-base">{evaluation.timi.totalScore} / 7</span>
                  <span className="text-slate-400 ml-2">({evaluation.timi.riskTier} TIER)</span>
                </div>
                <div>
                  <span className="text-slate-400">14-Day MACE: </span>
                  <span className="font-bold text-rose-400 text-base">{evaluation.timi.fourteenDayMacePercent}%</span>
                </div>
              </div>
            </div>

            {/* GRACE 2.0 Score Panel */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-rose-400" />
                GRACE 2.0 In-Hospital & 6-Month Mortality Calculator
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {/* Age */}
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <label className="text-xs font-bold text-slate-400 block mb-1">Age (Years)</label>
                  <input
                    type="number"
                    min={20}
                    max={100}
                    value={ageYears}
                    onChange={(e) => setAgeYears(parseInt(e.target.value) || 50)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-sm font-mono text-white"
                  />
                </div>

                {/* Heart Rate */}
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <label className="text-xs font-bold text-slate-400 block mb-1">Heart Rate (BPM)</label>
                  <input
                    type="number"
                    min={30}
                    max={220}
                    value={heartRateBpm}
                    onChange={(e) => setHeartRateBpm(parseInt(e.target.value) || 75)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-sm font-mono text-white"
                  />
                </div>

                {/* SBP */}
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <label className="text-xs font-bold text-slate-400 block mb-1">Systolic BP (mmHg)</label>
                  <input
                    type="number"
                    min={60}
                    max={240}
                    value={systolicBpMmHg}
                    onChange={(e) => setSystolicBpMmHg(parseInt(e.target.value) || 120)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-sm font-mono text-white"
                  />
                </div>

                {/* Creatinine */}
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <label className="text-xs font-bold text-slate-400 block mb-1">Creatinine (mg/dL)</label>
                  <input
                    type="number"
                    step={0.1}
                    min={0.3}
                    max={8.0}
                    value={serumCreatinineMgDl}
                    onChange={(e) => setSerumCreatinineMgDl(parseFloat(e.target.value) || 1.0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-sm font-mono text-white"
                  />
                </div>
              </div>

              {/* Killip Class */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <label className="text-xs font-bold text-slate-400 block mb-2">Killip Classification of Heart Failure</label>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                  {[
                    { class: 1, title: 'Class I', desc: 'No clinical heart failure' },
                    { class: 2, title: 'Class II', desc: 'Rales, S3 gallop, elevated JVP' },
                    { class: 3, title: 'Class III', desc: 'Frank acute pulmonary edema' },
                    { class: 4, title: 'Class IV', desc: 'Cardiogenic shock' },
                  ].map((k) => (
                    <button
                      key={k.class}
                      onClick={() => setKillipClass(k.class as KillipClass)}
                      className={`p-2.5 rounded-lg border text-left transition ${
                        killipClass === k.class
                          ? 'bg-rose-500/20 border-rose-500 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold">{k.title}</div>
                      <div className="text-[10px] text-slate-400">{k.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* GRACE Binary Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <button
                  onClick={() => setCardiacArrestAtAdmission(!cardiacArrestAtAdmission)}
                  className={`p-3 rounded-lg border text-left flex items-center justify-between transition ${
                    cardiacArrestAtAdmission
                      ? 'bg-rose-500/20 border-rose-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span>Cardiac Arrest at Admission</span>
                  <span className="font-mono font-bold">{cardiacArrestAtAdmission ? '+43 pts' : '0 pts'}</span>
                </button>

                <button
                  onClick={() => setStSegmentDeviationGrace(!stSegmentDeviationGrace)}
                  className={`p-3 rounded-lg border text-left flex items-center justify-between transition ${
                    stSegmentDeviationGrace
                      ? 'bg-rose-500/20 border-rose-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span>ST-Segment Deviation</span>
                  <span className="font-mono font-bold">{stSegmentDeviationGrace ? '+30 pts' : '0 pts'}</span>
                </button>

                <button
                  onClick={() => setElevatedMarkersGrace(!elevatedMarkersGrace)}
                  className={`p-3 rounded-lg border text-left flex items-center justify-between transition ${
                    elevatedMarkersGrace
                      ? 'bg-rose-500/20 border-rose-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span>Elevated Cardiac Markers</span>
                  <span className="font-mono font-bold">{elevatedMarkersGrace ? '+15 pts' : '0 pts'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: DAPT & Safety Interlocks */}
        {activeTab === 'PHARMA' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Pill className="w-5 h-5 text-rose-400" />
                Evidence-Based Pharmacotherapy & Clinical Safety Interlocks
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Precision selection of Dual Antiplatelet Therapy (DAPT), parenteral anticoagulation, and critical safety interlocks (ISAR-REACT 5, TRITON-TIMI 38, PLATO).
              </p>
            </div>

            {/* Patient Specific Risk Factors / Contraindications */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Clinical Context & Hemodynamic Red Flags
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                {[
                  { label: 'Prior Stroke or TIA (Prasugrel Contraindicated)', val: priorStrokeOrTia, set: setPriorStrokeOrTia },
                  { label: 'Right Ventricular Infarction (Nitrates Contraindicated)', val: rvInfarctionSuspected, set: setRvInfarctionSuspected },
                  { label: 'Recent PDE-5 Inhibitor Use (<24-48h)', val: recentPde5Use, set: setRecentPde5Use },
                  { label: 'Planned Early Invasive Angiography (<24h)', val: plannedEarlyInvasiveCath, set: setPlannedEarlyInvasiveCath },
                  { label: 'True Aspirin Anaphylaxis / Allergy', val: contraindicationAspirin, set: setContraindicationAspirin },
                  { label: 'Age ≥ 75 or Weight < 60 kg (Prasugrel Dose Caution)', val: age75OrWeightUnder60, set: setAge75OrWeightUnder60 },
                  { label: 'High Gastrointestinal Bleeding Risk', val: giBleedRiskHigh, set: setGiBleedRiskHigh },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => item.set(!item.val)}
                    className={`p-3 rounded-lg border text-left flex items-center justify-between transition ${
                      item.val
                        ? 'bg-rose-500/20 border-rose-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="font-bold text-xs">{item.val ? 'ACTIVE' : 'NO'}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Prescribed Regimen Output Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Aspirin */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Antiplatelet 1: Aspirin</span>
                <p className="text-xs text-slate-200 leading-relaxed mt-1">
                  {evaluation.pharmacotherapy.aspirinRecommendation}
                </p>
              </div>

              {/* P2Y12 Inhibitor */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Antiplatelet 2: P2Y12 Inhibitor</span>
                  <span className="text-xs font-bold text-rose-400">{evaluation.pharmacotherapy.p2y12InhibitorChoice}</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed mt-1">
                  {evaluation.pharmacotherapy.p2y12DosingRationale}
                </p>
              </div>

              {/* Anticoagulation */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Parenteral Anticoagulation</span>
                <p className="text-xs text-slate-200 leading-relaxed mt-1">
                  {evaluation.pharmacotherapy.anticoagulationRecommendation}
                </p>
              </div>

              {/* Nitrates & Opioids */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Nitrates & Opioid Safety</span>
                <p className="text-xs text-slate-200 leading-relaxed mt-1">
                  {evaluation.pharmacotherapy.nitrateAndOpioidSafety}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
