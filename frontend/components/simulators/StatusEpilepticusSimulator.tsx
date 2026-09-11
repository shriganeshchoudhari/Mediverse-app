'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Zap,
  ShieldAlert,
  Sparkles,
  Brain,
  Clock,
  Sliders,
  Layers,
  RefreshCw,
  Flame,
  Info,
  HeartCrack,
  Pill,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import {
  StatusSeizureType,
  StatusPhase,
  FirstLineBenzodiazepine,
  SecondLineAsm,
  ContinuousAnestheticAgent,
  StatusEpilepticusPatientInput,
  performStatusEpilepticusEvaluation,
  calculateReceptorTraffickingKinetics,
  STATUS_PRESETS,
} from '../../.gemini/skills/StatusEpilepticusEngine';

export default function StatusEpilepticusSimulator() {
  // Patient Demographics & Baseline State
  const [age, setAge] = useState<number>(45);
  const [weightKg, setWeightKg] = useState<number>(75);
  const [seizureDurationMinutes, setSeizureDurationMinutes] = useState<number>(8);
  const [seizureType, setSeizureType] = useState<StatusSeizureType>('CONVULSIVE_GCSE');
  const [hasIvAccess, setHasIvAccess] = useState<boolean>(true);
  const [priorEpilepsy, setPriorEpilepsy] = useState<boolean>(true);
  const [knownLiverMito, setKnownLiverMito] = useState<boolean>(false);
  const [hasHeartBlock, setHasHeartBlock] = useState<boolean>(false);
  const [isPregnant, setIsPregnant] = useState<boolean>(false);

  // Phase 1 First-Line Benzodiazepine State
  const [bzdGiven, setBzdGiven] = useState<FirstLineBenzodiazepine>('LORAZEPAM_IV');
  const [bzdDoseGivenMg, setBzdDoseGivenMg] = useState<number>(4.0);
  const [bzdDosesCount, setBzdDosesCount] = useState<number>(1);

  // Phase 2 Second-Line ASM State
  const [secondLineAsm, setSecondLineAsm] = useState<SecondLineAsm>('LEVETIRACETAM_IV');
  const [secondLineComplete, setSecondLineComplete] = useState<boolean>(false);

  // Phase 3 Anesthetic & cEEG State
  const [isVentilated, setIsVentilated] = useState<boolean>(false);
  const [continuousAnesthetic, setContinuousAnesthetic] = useState<ContinuousAnestheticAgent>('PROPOFOL');
  const [anestheticDoseMgKgH, setAnestheticDoseMgKgH] = useState<number>(3.5);
  const [anestheticHours, setAnestheticHours] = useState<number>(0);
  const [continuousEegActive, setContinuousEegActive] = useState<boolean>(false);
  const [eegFrequencyHz, setEegFrequencyHz] = useState<number>(2.0);
  const [eegEvolution, setEegEvolution] = useState<boolean>(false);
  const [eegIvResponse, setEegIvResponse] = useState<boolean>(false);
  const [observedBsrPercent, setObservedBsrPercent] = useState<number>(65);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'SYNTHESIS' | 'PHASE_1_BZD' | 'PHASE_2_ASM' | 'PHASE_3_RSE' | 'RECEPTOR_KINETICS' | 'SALZBURG_NCSE'
  >('SYNTHESIS');

  // Unified Evaluation Computation
  const evaluation = useMemo(() => {
    const input: StatusEpilepticusPatientInput = {
      patientAgeYears: age,
      patientWeightKg: weightKg,
      seizureDurationMinutes,
      seizureType,
      hasIvAccess,
      priorEpilepsyHistory: priorEpilepsy,
      knownMitochondrialDisorderOrLiverDisease: knownLiverMito,
      hasSinusBradycardiaOrHeartBlock: hasHeartBlock,
      isPregnant,
      firstLineBenzodiazepineGiven: bzdGiven,
      firstLineDoseAdministeredMg: bzdDoseGivenMg,
      numberOfBenzodiazepineDosesGiven: bzdDosesCount,
      secondLineAsmAdministered: secondLineAsm,
      secondLineInfusionComplete: secondLineComplete,
      isMechanicallyVentilated: isVentilated,
      continuousAnesthetic,
      anestheticDoseMgKgH,
      anestheticDurationHours: anestheticHours,
      continuousEegActive,
      eegDischargeFrequencyHz: eegFrequencyHz,
      eegHasSpatiotemporalEvolution: eegEvolution,
      eegHasResponseToIvTrial: eegIvResponse,
      observedBurstSuppressionRatioPercent: observedBsrPercent,
    };

    return performStatusEpilepticusEvaluation(input);
  }, [
    age,
    weightKg,
    seizureDurationMinutes,
    seizureType,
    hasIvAccess,
    priorEpilepsy,
    knownLiverMito,
    hasHeartBlock,
    isPregnant,
    bzdGiven,
    bzdDoseGivenMg,
    bzdDosesCount,
    secondLineAsm,
    secondLineComplete,
    isVentilated,
    continuousAnesthetic,
    anestheticDoseMgKgH,
    anestheticHours,
    continuousEegActive,
    eegFrequencyHz,
    eegEvolution,
    eegIvResponse,
    observedBsrPercent,
  ]);

  // Apply Preset
  const applyPreset = (presetId: string) => {
    const preset = STATUS_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    setAge(preset.inputs.patientAgeYears);
    setWeightKg(preset.inputs.patientWeightKg);
    setSeizureDurationMinutes(preset.inputs.seizureDurationMinutes);
    setSeizureType(preset.inputs.seizureType);
    setHasIvAccess(preset.inputs.hasIvAccess);
    setPriorEpilepsy(preset.inputs.priorEpilepsyHistory);
    setKnownLiverMito(preset.inputs.knownMitochondrialDisorderOrLiverDisease);
    setHasHeartBlock(preset.inputs.hasSinusBradycardiaOrHeartBlock);
    setIsPregnant(preset.inputs.isPregnant);

    if (preset.inputs.firstLineBenzodiazepineGiven) {
      setBzdGiven(preset.inputs.firstLineBenzodiazepineGiven);
    }
    if (preset.inputs.firstLineDoseAdministeredMg !== undefined) {
      setBzdDoseGivenMg(preset.inputs.firstLineDoseAdministeredMg);
    }
    setBzdDosesCount(preset.inputs.numberOfBenzodiazepineDosesGiven);

    if (preset.inputs.secondLineAsmAdministered) {
      setSecondLineAsm(preset.inputs.secondLineAsmAdministered);
    }
    setSecondLineComplete(preset.inputs.secondLineInfusionComplete);

    setIsVentilated(preset.inputs.isMechanicallyVentilated);
    if (preset.inputs.continuousAnesthetic) {
      setContinuousAnesthetic(preset.inputs.continuousAnesthetic);
    }
    if (preset.inputs.anestheticDoseMgKgH !== undefined) {
      setAnestheticDoseMgKgH(preset.inputs.anestheticDoseMgKgH);
    }
    if (preset.inputs.anestheticDurationHours !== undefined) {
      setAnestheticHours(preset.inputs.anestheticDurationHours);
    }

    setContinuousEegActive(preset.inputs.continuousEegActive);
    setEegFrequencyHz(preset.inputs.eegDischargeFrequencyHz);
    setEegEvolution(preset.inputs.eegHasSpatiotemporalEvolution);
    setEegIvResponse(preset.inputs.eegHasResponseToIvTrial);
    if (preset.inputs.observedBurstSuppressionRatioPercent !== undefined) {
      setObservedBsrPercent(preset.inputs.observedBurstSuppressionRatioPercent);
    }
  };

  // Receptor Trafficking Chart Data (0 to 60 min)
  const receptorChartData = useMemo(() => {
    const points = [];
    for (let t = 0; t <= 60; t += 5) {
      const k = calculateReceptorTraffickingKinetics(t);
      points.push({
        time: t,
        gabaDensity: k.synapticGabaAReceptorDensityPercent,
        nmdaDensity: k.synapticNmdaReceptorDensityPercent,
        bzdEfficacy: k.relativeBenzodiazepineEfficacyPercent,
      });
    }
    return points;
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-400">
                <Zap className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                  Status Epilepticus (AES / NCS) Emergency Workstation
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium">
                    AES 2023 • ESETT • RSE • Salzburg NCSE
                  </span>
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Time-Critical First-Line Benzodiazepine Dosing, Second-Line ESETT Antiseizure Titration &amp; Refractory Burst Suppression
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
            Standard Neurocritical Care &amp; Emergency Presets
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {STATUS_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset.id)}
                className="text-left p-3 rounded-lg bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800/80 hover:border-rose-500/40 transition group"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-semibold text-xs text-slate-200 group-hover:text-rose-300 transition">
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

        {/* Executive Stratification Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Phase & Time to T2 */}
          <div
            className={`p-4 rounded-xl border ${
              evaluation.statusPhase === 'SUPER_REFRACTORY_SE'
                ? 'bg-purple-950/30 border-purple-500/40'
                : evaluation.statusPhase === 'PHASE_3_REFRACTORY_SE'
                ? 'bg-rose-950/30 border-rose-500/50'
                : evaluation.statusPhase === 'PHASE_2_ESTABLISHED_SE'
                ? 'bg-amber-950/30 border-amber-500/40'
                : evaluation.statusPhase === 'PHASE_1_EARLY_SE'
                ? 'bg-cyan-950/30 border-cyan-500/40'
                : 'bg-emerald-950/30 border-emerald-500/40'
            }`}
          >
            <div className="text-xs font-medium text-slate-400 flex items-center justify-between mb-1">
              <span>Current Status Phase</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-200">
                {seizureDurationMinutes} min
              </span>
            </div>
            <div className="text-lg font-black text-white mt-1">
              {evaluation.phaseLabel}
            </div>
            <div className="text-xs text-slate-300 mt-2">
              {evaluation.isPastT2Threshold ? (
                <span className="text-rose-400 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Past t2 Injury Window (&gt;30m)
                </span>
              ) : (
                <span>t2 Damage Window: <strong className="text-white">{evaluation.timeToT2DamageThresholdMinutes} min</strong> left</span>
              )}
            </div>
          </div>

          {/* Card 2: First-Line BZD Recommendation & Underdose Alert */}
          <div
            className={`p-4 rounded-xl border ${
              evaluation.firstLineBzd.isUnderdosed
                ? 'bg-rose-950/30 border-rose-500/50'
                : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="text-xs font-medium text-slate-400 flex items-center justify-between mb-1">
              <span>First-Line Benzodiazepine</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${evaluation.firstLineBzd.isUnderdosed ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-200'}`}>
                {evaluation.firstLineBzd.isUnderdosed ? 'UNDERDOSE' : 'PHASE 1'}
              </span>
            </div>
            <div className="text-lg font-bold text-white mt-1">
              {evaluation.firstLineBzd.agentName}
            </div>
            <div className="text-xs text-slate-300 mt-2">
              Target Dose: <strong className="text-white">{evaluation.firstLineBzd.recommendedDoseMg} mg</strong> ({evaluation.firstLineBzd.route})
            </div>
          </div>

          {/* Card 3: Second-Line ESETT ASM */}
          <div
            className={`p-4 rounded-xl border ${
              evaluation.secondLineAsm.isContraindicated
                ? 'bg-amber-950/30 border-amber-500/50'
                : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="text-xs font-medium text-slate-400 flex items-center justify-between mb-1">
              <span>Second-Line ESETT ASM</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${evaluation.secondLineAsm.isContraindicated ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-200'}`}>
                {evaluation.secondLineAsm.isContraindicated ? 'CONTRAINDICATION' : 'PHASE 2'}
              </span>
            </div>
            <div className="text-lg font-bold text-white mt-1">
              {evaluation.secondLineAsm.agentName}
            </div>
            <div className="text-xs text-slate-300 mt-2">
              Target: <strong className="text-white">{evaluation.secondLineAsm.recommendedDoseMg} mg</strong> over {evaluation.secondLineAsm.infusionTimeMinutes} min
            </div>
          </div>

          {/* Card 4: Receptor Trafficking Kinetics */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-xs font-medium text-slate-400 flex items-center justify-between mb-1">
              <span>Receptor Remodeling</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-200">
                Trafficking
              </span>
            </div>
            <div className="text-lg font-black text-white mt-1 flex items-baseline gap-2">
              <span>GABA_A: <strong className="text-rose-400">{evaluation.receptorTrafficking.synapticGabaAReceptorDensityPercent}%</strong></span>
              <span className="text-xs text-slate-400">NMDA: <strong className="text-amber-400">{evaluation.receptorTrafficking.synapticNmdaReceptorDensityPercent}%</strong></span>
            </div>
            <div className="text-xs text-slate-300 mt-2">
              Ketamine Synergy: <strong className="text-cyan-400">{evaluation.receptorTrafficking.relativeKetamineSynergyScore}x</strong> (BZD Potency {evaluation.receptorTrafficking.relativeBenzodiazepineEfficacyPercent}%)
            </div>
          </div>

          {/* Card 5: Phase 3 Anesthetic & cEEG */}
          <div
            className={`p-4 rounded-xl border ${
              evaluation.phase3Anesthetic.isPrisRiskHigh
                ? 'bg-rose-950/30 border-rose-500/50'
                : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="text-xs font-medium text-slate-400 flex items-center justify-between mb-1">
              <span>Refractory Burst Target</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${evaluation.phase3Anesthetic.isPrisRiskHigh ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-200'}`}>
                {evaluation.phase3Anesthetic.isPrisRiskHigh ? 'PRIS RISK' : '50 - 80%'}
              </span>
            </div>
            <div className="text-lg font-black text-white mt-1">
              {evaluation.phase3Anesthetic.anestheticAgent || 'None active'}
            </div>
            <div className="text-xs text-slate-300 mt-2">
              Observed BSR: <strong className="text-cyan-400">{observedBsrPercent}%</strong> ({evaluation.phase3Anesthetic.currentBurstSuppressionAdequacy.replace('_', ' ')})
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('SYNTHESIS')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'SYNTHESIS'
                ? 'border-rose-500 text-rose-400 bg-rose-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Unified Clinical Synthesis
          </button>
          <button
            onClick={() => setActiveTab('PHASE_1_BZD')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'PHASE_1_BZD'
                ? 'border-rose-500 text-rose-400 bg-rose-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Phase 1: First-Line Benzodiazepines
          </button>
          <button
            onClick={() => setActiveTab('PHASE_2_ASM')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'PHASE_2_ASM'
                ? 'border-rose-500 text-rose-400 bg-rose-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Phase 2: ESETT Antiseizure Drugs
          </button>
          <button
            onClick={() => setActiveTab('PHASE_3_RSE')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'PHASE_3_RSE'
                ? 'border-rose-500 text-rose-400 bg-rose-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Phase 3: Refractory SE &amp; Burst Suppression
          </button>
          <button
            onClick={() => setActiveTab('RECEPTOR_KINETICS')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'RECEPTOR_KINETICS'
                ? 'border-rose-500 text-rose-400 bg-rose-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Receptor Trafficking Biophysics
          </button>
          <button
            onClick={() => setActiveTab('SALZBURG_NCSE')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'SALZBURG_NCSE'
                ? 'border-rose-500 text-rose-400 bg-rose-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Salzburg NCSE Criteria
          </button>
        </div>

        {/* Tab 1: Unified Clinical Synthesis */}
        {activeTab === 'SYNTHESIS' && (
          <div className="space-y-6">
            {/* Urgent Action Checklist */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                Time-Critical Emergency Action Checklist ({evaluation.phaseLabel})
              </h2>
              <div className="space-y-2.5">
                {evaluation.urgentActionChecklist.map((action, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-200 leading-relaxed font-medium">{action}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Algorithmic Pathway Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-xl border ${seizureDurationMinutes < 10 ? 'bg-cyan-950/20 border-cyan-500/40' : 'bg-slate-900 border-slate-800'}`}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-cyan-400">PHASE 1 (0 - 10 MIN)</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Early SE</span>
                </div>
                <div className="text-sm font-bold text-white mt-1">Immediate Benzodiazepines</div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  IV Lorazepam 0.1 mg/kg (max 4 mg) or IM Midazolam 10 mg. Repeat once at 5-10 min if seizing.
                </p>
              </div>

              <div className={`p-4 rounded-xl border ${seizureDurationMinutes >= 10 && seizureDurationMinutes < 30 ? 'bg-amber-950/20 border-amber-500/40' : 'bg-slate-900 border-slate-800'}`}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-amber-400">PHASE 2 (10 - 30 MIN)</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Established SE</span>
                </div>
                <div className="text-sm font-bold text-white mt-1">Second-Line ESETT ASMs</div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  IV Levetiracetam 60 mg/kg (max 4500 mg), Fosphenytoin 20 mg PE/kg, or Valproate 40 mg/kg over 10 min.
                </p>
              </div>

              <div className={`p-4 rounded-xl border ${seizureDurationMinutes >= 30 ? 'bg-rose-950/20 border-rose-500/40' : 'bg-slate-900 border-slate-800'}`}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-rose-400">PHASE 3 (&gt; 30 MIN)</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Refractory SE</span>
                </div>
                <div className="text-sm font-bold text-white mt-1">ICU Intubation & Anesthetics</div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Propofol, Midazolam, or Ketamine continuous infusion titrated to 50-80% burst suppression for 24-48 hours.
                </p>
              </div>
            </div>

            {/* Clinical Pearls */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-400" />
                Evidence-Based Clinical Pearls & High-Yield Board Safeguards
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {evaluation.clinicalPearls.map((pearl, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    {pearl}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Phase 1 Benzodiazepines */}
        {activeTab === 'PHASE_1_BZD' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Pill className="w-5 h-5 text-rose-400" />
                Phase 1: First-Line Benzodiazepine Precision Dosing & Underdosing Safeguard
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                American Epilepsy Society Guidelines: Weight-based dosing for rapid status termination and underdosing prevention.
              </p>
            </div>

            {/* Underdosing Warning Banner */}
            {evaluation.firstLineBzd.isUnderdosed && (
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/60 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-rose-200 block uppercase tracking-wider">
                    CRITICAL UNDERDOSING INTERLOCK ACTIVATED
                  </span>
                  <p className="text-xs text-rose-300 mt-1 leading-relaxed">
                    {evaluation.firstLineBzd.underdosedWarning}
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Controls */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Patient Parameters & Access
                </h3>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">Patient Weight</span>
                    <span className="font-mono font-bold text-white">{weightKg} kg</span>
                  </div>
                  <input
                    type="range"
                    min={15}
                    max={140}
                    step={1}
                    value={weightKg}
                    onChange={(e) => setWeightKg(parseInt(e.target.value))}
                    className="w-full accent-rose-500"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                  <div>
                    <span className="font-bold text-white block">Intravenous Access Established</span>
                    <span className="text-[11px] text-slate-400">If absent, switch to IM Midazolam (RAMPART protocol)</span>
                  </div>
                  <button
                    onClick={() => setHasIvAccess(!hasIvAccess)}
                    className={`px-3 py-1.5 rounded-lg font-bold border transition ${
                      hasIvAccess
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-amber-500/20 border-amber-500 text-amber-300'
                    }`}
                  >
                    {hasIvAccess ? 'IV ACCESS PRESENT' : 'NO IV (USE IM)'}
                  </button>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-2">Select Administered Benzodiazepine</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {(['LORAZEPAM_IV', 'MIDAZOLAM_IM', 'DIAZEPAM_IV'] as FirstLineBenzodiazepine[]).map((agent) => (
                      <button
                        key={agent}
                        onClick={() => setBzdGiven(agent)}
                        className={`p-2.5 rounded-lg border text-left font-semibold transition ${
                          bzdGiven === agent
                            ? 'bg-rose-500/20 border-rose-500 text-rose-200'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {agent === 'LORAZEPAM_IV'
                          ? 'IV Lorazepam'
                          : agent === 'MIDAZOLAM_IM'
                          ? 'IM Midazolam'
                          : 'IV Diazepam'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">Dose Administered</span>
                    <span className="font-mono font-bold text-rose-400">{bzdDoseGivenMg} mg</span>
                  </div>
                  <input
                    type="range"
                    min={0.5}
                    max={15}
                    step={0.5}
                    value={bzdDoseGivenMg}
                    onChange={(e) => setBzdDoseGivenMg(parseFloat(e.target.value))}
                    className="w-full accent-rose-500"
                  />
                </div>
              </div>

              {/* Dosing Recommendations */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Recommended AES Guideline Regimen
                </h3>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Agent:</span>
                    <span className="font-bold text-white">{evaluation.firstLineBzd.agentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Weight-Based Dose:</span>
                    <span className="font-bold text-rose-400">{evaluation.firstLineBzd.recommendedDoseMg} mg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Route & Speed:</span>
                    <span className="font-bold text-white">{evaluation.firstLineBzd.administrationSpeed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Repeat Window:</span>
                    <span className="font-bold text-slate-200">{evaluation.firstLineBzd.repeatWindowMinutes}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                  <span className="text-slate-400 block mb-1 font-bold">Clinical Rationale:</span>
                  <p className="text-slate-300 leading-relaxed">{evaluation.firstLineBzd.clinicalRationale}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Phase 2 ESETT Antiseizure Drugs */}
        {activeTab === 'PHASE_2_ASM' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-rose-400" />
                Phase 2: Established SE (ESETT Second-Line Non-Sedating ASMs)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Established Status Epilepticus Treatment Trial (ESETT, NEJM 2019): Dosing, infusion kinetics, and safety interlocks.
              </p>
            </div>

            {/* Contraindication Alert */}
            {evaluation.secondLineAsm.isContraindicated && (
              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/60 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-amber-200 block uppercase tracking-wider">
                    CONTRAINDICATION DETECTED FOR SELECTED ASM
                  </span>
                  {evaluation.secondLineAsm.contraindicationsDetected.map((ci, idx) => (
                    <p key={idx} className="text-xs text-amber-300 mt-1 leading-relaxed">
                      {ci}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Agent Selection & Patient Risk Toggles */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Select Second-Line ASM
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'LEVETIRACETAM_IV', name: 'Levetiracetam', dose: '60 mg/kg' },
                    { id: 'FOSPHENYTOIN_IV', name: 'Fosphenytoin', dose: '20 mg PE/kg' },
                    { id: 'VALPROATE_SODIUM_IV', name: 'Valproate', dose: '40 mg/kg' },
                  ].map((asm) => (
                    <button
                      key={asm.id}
                      onClick={() => setSecondLineAsm(asm.id as SecondLineAsm)}
                      className={`p-3 rounded-lg border text-left transition ${
                        secondLineAsm === asm.id
                          ? 'bg-rose-500/20 border-rose-500 text-rose-200'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold">{asm.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{asm.dose}</div>
                    </button>
                  ))}
                </div>

                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pt-2">
                  Patient Specific Clinical Contraindications
                </h3>

                <div className="space-y-2 text-xs">
                  <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                    <span className="text-slate-300">Sinus Bradycardia / Heart Block (Fosphenytoin Risk)</span>
                    <input
                      type="checkbox"
                      checked={hasHeartBlock}
                      onChange={(e) => setHasHeartBlock(e.target.checked)}
                      className="rounded accent-rose-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                    <span className="text-slate-300">Acute Liver Disease / POLG Mitochondrial Disorder (Valproate Risk)</span>
                    <input
                      type="checkbox"
                      checked={knownLiverMito}
                      onChange={(e) => setKnownLiverMito(e.target.checked)}
                      className="rounded accent-rose-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                    <span className="text-slate-300">Pregnancy (Valproate Teratogenicity)</span>
                    <input
                      type="checkbox"
                      checked={isPregnant}
                      onChange={(e) => setIsPregnant(e.target.checked)}
                      className="rounded accent-rose-500"
                    />
                  </label>
                </div>
              </div>

              {/* Dosing & Rate Limits */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  ESETT Trial Dosing & Administration Rate
                </h3>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Calculated Dose:</span>
                    <span className="font-bold text-rose-400 text-sm">{evaluation.secondLineAsm.recommendedDoseMg} mg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Max Single Dose Cap:</span>
                    <span className="font-bold text-white">{evaluation.secondLineAsm.maxSingleDoseMg} mg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Infusion Duration:</span>
                    <span className="font-bold text-white">{evaluation.secondLineAsm.infusionTimeMinutes} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Rate Restriction:</span>
                    <span className="font-bold text-amber-300">{evaluation.secondLineAsm.infusionRateLimit}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                  <span className="font-bold text-slate-300 block mb-1">Mandatory Monitoring Requirements:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-400">
                    {evaluation.secondLineAsm.monitoringRequirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Phase 3 Refractory SE & Anesthetic Burst Suppression */}
        {activeTab === 'PHASE_3_RSE' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-rose-400" />
                Phase 3: Refractory Status Epilepticus (RSE) & Anesthetic Titration
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Continuous IV general anesthetics for electrographic burst suppression (8-12 bursts/min) and PRIS monitoring.
              </p>
            </div>

            {/* PRIS Warning Banner */}
            {evaluation.phase3Anesthetic.isPrisRiskHigh && (
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/60 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-rose-200 block uppercase tracking-wider">
                    PROPOFOL INFUSION SYNDROME (PRIS) SAFETY INTERLOCK
                  </span>
                  <p className="text-xs text-rose-300 mt-1 leading-relaxed">
                    {evaluation.phase3Anesthetic.prisWarning}
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Anesthetic Selection & Sliders */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Continuous Anesthetic Selection
                </h3>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'PROPOFOL', name: 'Propofol', range: '2 - 10 mg/kg/h' },
                    { id: 'MIDAZOLAM_INFUSION', name: 'Midazolam', range: '0.05 - 2 mg/kg/h' },
                    { id: 'KETAMINE_INFUSION', name: 'Ketamine (NMDA)', range: '1 - 5 mg/kg/h' },
                    { id: 'PENTOBARBITAL', name: 'Pentobarbital', range: '1 - 5 mg/kg/h' },
                  ].map((agent) => (
                    <button
                      key={agent.id}
                      onClick={() => setContinuousAnesthetic(agent.id as ContinuousAnestheticAgent)}
                      className={`p-2.5 rounded-lg border text-left transition ${
                        continuousAnesthetic === agent.id
                          ? 'bg-rose-500/20 border-rose-500 text-rose-200'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold">{agent.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{agent.range}</div>
                    </button>
                  ))}
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">Infusion Rate</span>
                    <span className="font-mono font-bold text-rose-400">{anestheticDoseMgKgH} mg/kg/h</span>
                  </div>
                  <input
                    type="range"
                    min={0.5}
                    max={10.0}
                    step={0.1}
                    value={anestheticDoseMgKgH}
                    onChange={(e) => setAnestheticDoseMgKgH(parseFloat(e.target.value))}
                    className="w-full accent-rose-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">Infusion Duration</span>
                    <span className="font-mono font-bold text-white">{anestheticHours} hours</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={72}
                    step={1}
                    value={anestheticHours}
                    onChange={(e) => setAnestheticHours(parseInt(e.target.value))}
                    className="w-full accent-rose-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Duration &gt; 48 hours dramatically elevates PRIS risk.
                  </span>
                </div>
              </div>

              {/* cEEG Burst Suppression Monitoring */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Continuous EEG Burst Suppression Titration
                </h3>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">Observed Burst Suppression Ratio (BSR)</span>
                    <span className="font-mono font-bold text-cyan-400">{observedBsrPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={observedBsrPercent}
                    onChange={(e) => setObservedBsrPercent(parseInt(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>0% (Continuous Seizure)</span>
                    <span className="font-bold text-emerald-400">50 - 80% (Target)</span>
                    <span>100% (Isoelectric)</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                  <span className="font-bold text-slate-300 block mb-1">Titration Guidance:</span>
                  <p className="text-slate-300 leading-relaxed">
                    {evaluation.phase3Anesthetic.titrationRecommendation}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                  <span className="font-bold text-slate-400 block mb-1">Super-Refractory SE (&gt;24h) Modalities:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    {evaluation.phase3Anesthetic.superRefractoryOptions.slice(0, 3).map((opt, idx) => (
                      <li key={idx}>{opt}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Receptor Trafficking Biophysics */}
        {activeTab === 'RECEPTOR_KINETICS' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-rose-400" />
                Synaptic Receptor Trafficking & Pharmacoresistance Clock
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Clathrin-mediated endocytosis of GABA_A receptors versus extrasynaptic NMDA receptor recruitment over time.
              </p>
            </div>

            {/* Kinetic Curve Visualization */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <div className="text-xs font-semibold text-slate-300 mb-3">
                Relative Synaptic Receptor Density (%) vs Seizure Duration (Minutes)
              </div>
              <div className="h-64 sm:h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={receptorChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="time" stroke="#64748b" label={{ value: 'Seizure Duration (min)', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 11 }} />
                    <YAxis stroke="#64748b" domain={[0, 260]} label={{ value: 'Density / Efficacy (%)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <ReferenceLine x={5} stroke="#06b6d4" strokeDasharray="3 3" label={{ value: 't1 (Phase 1)', fill: '#06b6d4', fontSize: 10 }} />
                    <ReferenceLine x={30} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 't2 (Irreversible Injury)', fill: '#ef4444', fontSize: 10 }} />
                    <Line type="monotone" dataKey="gabaDensity" name="GABA_A Surface Receptors (%)" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="nmdaDensity" name="NMDA Excitatory Receptors (%)" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="bzdEfficacy" name="Benzodiazepine Efficacy (%)" stroke="#06b6d4" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Current Pathophysiologic Description */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-white uppercase tracking-wider block">
                Receptor State at {seizureDurationMinutes} Minutes
              </span>
              <p className="text-slate-300 leading-relaxed">
                {evaluation.receptorTrafficking.pathophysiologicDescription}
              </p>
            </div>
          </div>
        )}

        {/* Tab 6: Salzburg Criteria for NCSE */}
        {activeTab === 'SALZBURG_NCSE' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-rose-400" />
                Salzburg Consensus Criteria (2015) for Non-Convulsive Status Epilepticus
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Continuous EEG diagnostic criteria to distinguish NCSE from post-ictal encephalopathy and metabolic delirium.
              </p>
            </div>

            {/* Salzburg Result Banner */}
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 ${
                evaluation.salzburgNcse.diagnosticConfidence === 'DEFINITE_NCSE'
                  ? 'bg-rose-950/40 border-rose-500/60'
                  : evaluation.salzburgNcse.diagnosticConfidence === 'POSSIBLE_NCSE'
                  ? 'bg-amber-950/40 border-amber-500/60'
                  : 'bg-emerald-950/30 border-emerald-500/40'
              }`}
            >
              <Activity className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-white block uppercase tracking-wider">
                  Diagnostic Classification: {evaluation.salzburgNcse.diagnosticConfidence.replace('_', ' ')}
                </span>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {evaluation.salzburgNcse.clinicalManagementAdvice}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* EEG Parameters */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  EEG Waveform Characteristics
                </h3>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">Discharge Frequency</span>
                    <span className="font-mono font-bold text-cyan-400">{eegFrequencyHz} Hz</span>
                  </div>
                  <input
                    type="range"
                    min={0.5}
                    max={4.5}
                    step={0.1}
                    value={eegFrequencyHz}
                    onChange={(e) => setEegFrequencyHz(parseFloat(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>0.5 Hz</span>
                    <span className="font-bold text-amber-400">&gt; 2.5 Hz (Definite Cutoff)</span>
                    <span>4.5 Hz</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                    <span className="text-slate-300">Documented Spatiotemporal Evolution (&gt;1 Hz shift / spatial spread)</span>
                    <input
                      type="checkbox"
                      checked={eegEvolution}
                      onChange={(e) => setEegEvolution(e.target.checked)}
                      className="rounded accent-rose-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                    <span className="text-slate-300">Prompt Clinical or Electrographic Response to IV ASM Trial</span>
                    <input
                      type="checkbox"
                      checked={eegIvResponse}
                      onChange={(e) => setEegIvResponse(e.target.checked)}
                      className="rounded accent-rose-500"
                    />
                  </label>
                </div>
              </div>

              {/* Matched Salzburg Criteria List */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Matched Salzburg Criteria
                </h3>

                {evaluation.salzburgNcse.matchedFeatures.length > 0 ? (
                  <div className="space-y-2">
                    {evaluation.salzburgNcse.matchedFeatures.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2.5 rounded bg-slate-900 border border-slate-800 text-xs text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">
                    No positive Salzburg NCSE electrographic criteria matched at current settings.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
