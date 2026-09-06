'use client';

import React, { useState, useMemo } from 'react';
import {
  StrokePatientProfile,
  NihssParameters,
  AspectsRegions,
  calculateNihssScore,
  calculateAspectsScore,
  evaluateStrokeIntervention,
  STROKE_PRESETS,
} from '../../.gemini/skills/AcuteStrokeThrombolysisEngine';
import {
  Brain,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Zap,
  Sparkles,
  RefreshCw,
  Sliders,
  ChevronRight,
  Info,
  Pill,
  Radio,
} from 'lucide-react';

export default function AcuteStrokeThrombolysisSimulator() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('hyperacute-m1-lvo');
  const [activeTab, setActiveTab] = useState<'NIHSS' | 'ASPECTS' | 'REPERFUSION'>('REPERFUSION');

  // Patient Profile state
  const [ageYears, setAgeYears] = useState<number>(64);
  const [weightKg, setWeightKg] = useState<number>(78);
  const [hoursFromLkw, setHoursFromLkw] = useState<number>(1.5);
  const [systolicBp, setSystolicBp] = useState<number>(168);
  const [diastolicBp, setDiastolicBp] = useState<number>(94);
  const [bloodGlucose, setBloodGlucose] = useState<number>(124);
  const [platelets, setPlatelets] = useState<number>(240000);
  const [inr, setInr] = useState<number>(1.0);
  const [aptt, setAptt] = useState<number>(28);
  const [recentDoac, setRecentDoac] = useState<boolean>(false);
  const [ichOnCt, setIchOnCt] = useState<boolean>(false);
  const [recentTrauma, setRecentTrauma] = useState<boolean>(false);
  const [internalBleed, setInternalBleed] = useState<boolean>(false);
  const [lvoPresent, setLvoPresent] = useState<boolean>(true);
  const [lvoSite, setLvoSite] = useState<StrokePatientProfile['lvoSite']>('MCA_M1');

  // NIHSS parameters state
  const [nihssParams, setNihssParams] = useState<NihssParameters>(STROKE_PRESETS[0].profile.nihss);

  // ASPECTS regions state
  const [aspectsRegions, setAspectsRegions] = useState<AspectsRegions>(STROKE_PRESETS[0].profile.aspects);

  // Master intervention evaluation
  const evaluation = useMemo(() => {
    return evaluateStrokeIntervention({
      ageYears,
      weightKg,
      hoursFromLastKnownWell: hoursFromLkw,
      systolicBpMmHg: systolicBp,
      diastolicBpMmHg: diastolicBp,
      bloodGlucoseMgDl: bloodGlucose,
      plateletsPerUl: platelets,
      inr,
      apttSeconds: aptt,
      recentDoacWithin48h: recentDoac,
      intracranialHemorrhageOnCt: ichOnCt,
      recentHeadTraumaOrStroke3Mo: recentTrauma,
      activeInternalBleed: internalBleed,
      nihss: nihssParams,
      aspects: aspectsRegions,
      largeVesselOcclusionPresent: lvoPresent,
      lvoSite,
    });
  }, [
    ageYears,
    weightKg,
    hoursFromLkw,
    systolicBp,
    diastolicBp,
    bloodGlucose,
    platelets,
    inr,
    aptt,
    recentDoac,
    ichOnCt,
    recentTrauma,
    internalBleed,
    nihssParams,
    aspectsRegions,
    lvoPresent,
    lvoSite,
  ]);

  // Handle preset select
  const handlePresetSelect = (id: string) => {
    setSelectedPresetId(id);
    const p = STROKE_PRESETS.find(preset => preset.id === id);
    if (p) {
      setAgeYears(p.profile.ageYears);
      setWeightKg(p.profile.weightKg);
      setHoursFromLkw(p.profile.hoursFromLastKnownWell);
      setSystolicBp(p.profile.systolicBpMmHg);
      setDiastolicBp(p.profile.diastolicBpMmHg);
      setBloodGlucose(p.profile.bloodGlucoseMgDl);
      setPlatelets(p.profile.plateletsPerUl);
      setInr(p.profile.inr);
      setAptt(p.profile.apttSeconds);
      setRecentDoac(p.profile.recentDoacWithin48h);
      setIchOnCt(p.profile.intracranialHemorrhageOnCt);
      setRecentTrauma(p.profile.recentHeadTraumaOrStroke3Mo);
      setInternalBleed(p.profile.activeInternalBleed);
      setLvoPresent(p.profile.largeVesselOcclusionPresent);
      setLvoSite(p.profile.lvoSite);
      setNihssParams(p.profile.nihss);
      setAspectsRegions(p.profile.aspects);
    }
  };

  // NIHSS item updater
  const updateNihssItem = (field: keyof NihssParameters, val: number) => {
    setNihssParams(prev => ({ ...prev, [field]: val }));
  };

  // ASPECTS region toggler
  const toggleAspectsRegion = (region: keyof AspectsRegions) => {
    setAspectsRegions(prev => ({ ...prev, [region]: !prev[region] }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-zinc-100 p-2 sm:p-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-600/40 rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-500/20 border border-purple-500/40 rounded-xl text-purple-400">
                <Brain className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                  Acute Ischemic Stroke &amp; Thrombolysis Workstation
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono">
                    Code Stroke &amp; EVT
                  </span>
                </h1>
                <p className="text-sm text-zinc-400 mt-1">
                  NIH Stroke Scale triage, ASPECTS brain CT scoring, Tenecteplase/Alteplase precision dosing, and LVO mechanical thrombectomy solver.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-slate-900/80 border border-slate-700/80 px-3 py-1.5 rounded-lg text-xs font-mono">
              <span className="text-zinc-400">NIHSS:</span>{' '}
              <span className="text-purple-300 font-bold text-sm">
                {evaluation.nihssTotalScore} ({evaluation.nihssSeverity.replace(/_/g, ' ')})
              </span>
            </div>
            <div className="bg-slate-900/80 border border-slate-700/80 px-3 py-1.5 rounded-lg text-xs font-mono">
              <span className="text-zinc-400">ASPECTS:</span>{' '}
              <span className={`font-bold ${evaluation.aspectsScore >= 7 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {evaluation.aspectsScore}/10
              </span>
            </div>
            <div className="bg-slate-900/80 border border-slate-700/80 px-3 py-1.5 rounded-lg text-xs font-mono">
              <span className="text-zinc-400">LKW:</span>{' '}
              <span className={`font-bold ${hoursFromLkw <= 4.5 ? 'text-cyan-400' : 'text-amber-400'}`}>
                {hoursFromLkw}h
              </span>
            </div>
          </div>
        </div>

        {/* Preset Selector Bar */}
        <div className="mt-5 pt-4 border-t border-purple-900/40 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-purple-300 flex items-center gap-1.5 mr-2">
            <Sparkles className="w-3.5 h-3.5" /> Clinical Presets:
          </span>
          {STROKE_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedPresetId === preset.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 ring-1 ring-purple-400'
                  : 'bg-slate-800/80 text-zinc-300 hover:bg-slate-750 hover:text-white border border-slate-700/60'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Tab Bar */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-2 rounded-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('REPERFUSION')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'REPERFUSION'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4 text-purple-300" /> Reperfusion &amp; Dosing Solver
          </button>
          <button
            onClick={() => setActiveTab('NIHSS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'NIHSS'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4 text-cyan-300" /> NIH Stroke Scale ({evaluation.nihssTotalScore})
          </button>
          <button
            onClick={() => setActiveTab('ASPECTS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'ASPECTS'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Brain className="w-4 h-4 text-indigo-300" /> ASPECTS CT Map ({evaluation.aspectsScore}/10)
          </button>
        </div>

        {/* Action Summary Pill */}
        <div className="hidden md:flex items-center gap-2 text-xs font-mono">
          <span className="text-zinc-400">Reperfusion Status:</span>
          {evaluation.isEligibleForIvLysis && evaluation.isEligibleForEvt ? (
            <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
              Dual Lysis + EVT
            </span>
          ) : evaluation.isEligibleForIvLysis ? (
            <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
              IV Lysis Eligible
            </span>
          ) : evaluation.isEligibleForEvt ? (
            <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
              EVT Only
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
              Medical Management
            </span>
          )}
        </div>
      </div>

      {/* Tab 1: Reperfusion & Dosing Solver */}
      {activeTab === 'REPERFUSION' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Clinical Parameters & Contraindications (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Clinical Decision Action Box */}
            <div
              className={`p-4 rounded-2xl border ${
                evaluation.isEligibleForIvLysis
                  ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                  : evaluation.isEligibleForEvt
                  ? 'bg-amber-950/40 border-amber-800/60 text-amber-200'
                  : 'bg-rose-950/40 border-rose-800/60 text-rose-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm mb-1">
                {evaluation.isEligibleForIvLysis ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                )}
                <span>Clinical Decision Protocol:</span>
              </div>
              <p className="text-xs leading-relaxed">{evaluation.clinicalActionSummary}</p>
            </div>

            {/* Contraindication Checklist / Alerts */}
            {evaluation.contraindications.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" /> Active Contraindications to IV Thrombolysis
                </h3>
                <ul className="space-y-1.5 text-xs text-zinc-300">
                  {evaluation.contraindications.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 bg-rose-950/30 p-2.5 rounded-lg border border-rose-800/40">
                      <span className="text-rose-400 font-bold">&times;</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Emergency Stroke Vitals & Time Sliders */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" /> Acute Time Window &amp; Hemodynamics
              </h3>

              {/* Time from LKW */}
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400">Time from Last Known Well (LKW):</span>
                  <span className="font-mono font-bold text-cyan-300">{hoursFromLkw} hours</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="12.0"
                  step="0.5"
                  value={hoursFromLkw}
                  onChange={e => setHoursFromLkw(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                  <span>0h</span>
                  <span>3.0h (Standard)</span>
                  <span>4.5h (ECASS III Max)</span>
                  <span>6.0h (EVT Window)</span>
                  <span>12.0h</span>
                </div>
              </div>

              {/* Blood Pressure Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Systolic BP:</span>
                    <span className={`font-mono font-bold ${systolicBp > 185 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {systolicBp} mmHg
                    </span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="230"
                    value={systolicBp}
                    onChange={e => setSystolicBp(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-purple-500"
                  />
                  <div className="text-[10px] text-zinc-500">Threshold: &le; 185 mmHg</div>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Diastolic BP:</span>
                    <span className={`font-mono font-bold ${diastolicBp > 110 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {diastolicBp} mmHg
                    </span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="130"
                    value={diastolicBp}
                    onChange={e => setDiastolicBp(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-purple-500"
                  />
                  <div className="text-[10px] text-zinc-500">Threshold: &le; 110 mmHg</div>
                </div>
              </div>

              {/* Blood Glucose */}
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400">Fingerstick Blood Glucose:</span>
                  <span className={`font-mono font-bold ${bloodGlucose < 50 ? 'text-rose-400' : 'text-zinc-200'}`}>
                    {bloodGlucose} mg/dL
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="300"
                  value={bloodGlucose}
                  onChange={e => setBloodGlucose(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-500"
                />
                <div className="text-[10px] text-zinc-500">Normal 70-140 mg/dL | Contraindicated if &lt; 50 mg/dL</div>
              </div>
            </div>
          </div>

          {/* Right Column: Thrombolysis Dosing & EVT Consoles (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Tenecteplase vs Alteplase Dosing Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Pill className="w-4 h-4 text-cyan-400" /> Thrombolytic Dosing Solver
                </span>
                <span className="text-[11px] font-mono text-purple-300">Weight: {weightKg} kg</span>
              </h3>

              {/* Tenecteplase (TNK-tPA) Box */}
              <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-purple-300">Tenecteplase (TNK-tPA) Preferred:</span>
                  <span className="text-xs font-mono font-bold text-white bg-purple-900/60 px-2 py-0.5 rounded">
                    0.25 mg/kg (Max 25 mg)
                  </span>
                </div>
                <div className="text-xl font-black font-mono text-cyan-300">
                  {evaluation.tenecteplaseDoseMg} mg IV Single Push
                </div>
                <p className="text-[11px] text-zinc-300">
                  Administer as a single rapid IV bolus over 5 seconds. Preferred in LVO due to higher early recanalization (EXTEND-IA TNK).
                </p>
              </div>

              {/* Alteplase (rtPA) Box */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-zinc-300">Alteplase (rtPA) Standard:</span>
                  <span className="text-xs font-mono font-bold text-zinc-400 bg-slate-800 px-2 py-0.5 rounded">
                    0.9 mg/kg (Max 90 mg)
                  </span>
                </div>
                <div className="text-lg font-bold font-mono text-white">
                  Total: {evaluation.alteplaseDoseMg.totalMg} mg
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="text-zinc-400 text-[10px]">10% Bolus (1 min):</span>
                    <div className="text-cyan-300 font-bold">{evaluation.alteplaseDoseMg.bolusMg} mg</div>
                  </div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="text-zinc-400 text-[10px]">90% Infusion (60 min):</span>
                    <div className="text-purple-300 font-bold">{evaluation.alteplaseDoseMg.infusionMg} mg</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Endovascular Thrombectomy (EVT) Candidate Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                  <Radio className="w-4 h-4 text-amber-400" /> Endovascular Thrombectomy (EVT)
                </h3>
                <span
                  className={`text-xs font-bold font-mono px-2.5 py-0.5 rounded border ${
                    evaluation.isEligibleForEvt
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}
                >
                  {evaluation.isEligibleForEvt ? 'CANDIDATE' : 'NOT CANDIDATE'}
                </span>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Large Vessel Occlusion:</span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={lvoPresent}
                      onChange={e => setLvoPresent(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500"
                    />
                    <span className="font-bold text-white">{lvoPresent ? 'Confirmed LVO' : 'No LVO'}</span>
                  </label>
                </div>

                {lvoPresent && (
                  <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                    <span className="text-zinc-400">Occlusion Site:</span>
                    <select
                      value={lvoSite}
                      onChange={e => setLvoSite(e.target.value as StrokePatientProfile['lvoSite'])}
                      className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-zinc-200 font-mono text-xs"
                    >
                      <option value="MCA_M1">MCA M1 Segment</option>
                      <option value="ICA_TERMINUS">ICA Terminus (T-occlusion)</option>
                      <option value="MCA_M2">MCA M2 Dominant Branch</option>
                      <option value="BASILAR">Basilar Artery</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: NIHSS Interactive Checklist */}
      {activeTab === 'NIHSS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" /> NIH Stroke Scale (NIHSS) Itemized Assessment
            </h2>
            <div className="text-xs font-mono font-bold text-purple-300 bg-purple-950/60 border border-purple-800 px-3 py-1 rounded-lg">
              Total Score: {evaluation.nihssTotalScore} / 42 ({evaluation.nihssSeverity.replace(/_/g, ' ')})
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {/* 1a LOC */}
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <span className="font-semibold text-zinc-300">1a. Level of Consciousness:</span>
              <select
                value={nihssParams.loc1a}
                onChange={e => updateNihssItem('loc1a', Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-zinc-200"
              >
                <option value={0}>0 - Alert; keenly responsive</option>
                <option value={1}>1 - Drowsy; aroused by minor stimulation</option>
                <option value={2}>2 - Obtunded; requires repeated/painful stimulation</option>
                <option value={3}>3 - Coma; responds only with motor reflex or not at all</option>
              </select>
            </div>

            {/* 1b Questions */}
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <span className="font-semibold text-zinc-300">1b. LOC Questions (Month, Age):</span>
              <select
                value={nihssParams.locQuestions1b}
                onChange={e => updateNihssItem('locQuestions1b', Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-zinc-200"
              >
                <option value={0}>0 - Both questions answered correctly</option>
                <option value={1}>1 - Answers one question correctly</option>
                <option value={2}>2 - Neither question answered correctly</option>
              </select>
            </div>

            {/* 1c Commands */}
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <span className="font-semibold text-zinc-300">1c. LOC Commands (Open eyes, Grip):</span>
              <select
                value={nihssParams.locCommands1c}
                onChange={e => updateNihssItem('locCommands1c', Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-zinc-200"
              >
                <option value={0}>0 - Performs both tasks correctly</option>
                <option value={1}>1 - Performs one task correctly</option>
                <option value={2}>2 - Performs neither task correctly</option>
              </select>
            </div>

            {/* 2 Best Gaze */}
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <span className="font-semibold text-zinc-300">2. Best Horizontal Gaze:</span>
              <select
                value={nihssParams.bestGaze2}
                onChange={e => updateNihssItem('bestGaze2', Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-zinc-200"
              >
                <option value={0}>0 - Normal horizontal movements</option>
                <option value={1}>1 - Partial gaze palsy</option>
                <option value={2}>2 - Forced deviation or total gaze paresis</option>
              </select>
            </div>

            {/* 3 Visual Fields */}
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <span className="font-semibold text-zinc-300">3. Visual Field Testing:</span>
              <select
                value={nihssParams.visualFields3}
                onChange={e => updateNihssItem('visualFields3', Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-zinc-200"
              >
                <option value={0}>0 - No visual field loss</option>
                <option value={1}>1 - Partial hemianopia</option>
                <option value={2}>2 - Complete hemianopia</option>
                <option value={3}>3 - Bilateral hemianopia / cortical blindness</option>
              </select>
            </div>

            {/* 4 Facial Palsy */}
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <span className="font-semibold text-zinc-300">4. Facial Palsy:</span>
              <select
                value={nihssParams.facialPalsy4}
                onChange={e => updateNihssItem('facialPalsy4', Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-zinc-200"
              >
                <option value={0}>0 - Normal symmetrical movements</option>
                <option value={1}>1 - Minor paralysis (flattened nasolabial fold)</option>
                <option value={2}>2 - Partial paralysis (total lower face palsy)</option>
                <option value={3}>3 - Complete paralysis of one or both sides</option>
              </select>
            </div>

            {/* 5a/5b Motor Arm */}
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <span className="font-semibold text-zinc-300">5a/5b. Motor Arm (Left / Right):</span>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={nihssParams.motorArmLeft5a}
                  onChange={e => updateNihssItem('motorArmLeft5a', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-zinc-200"
                >
                  <option value={0}>L: 0 - No drift</option>
                  <option value={1}>L: 1 - Drift</option>
                  <option value={2}>L: 2 - Some effort</option>
                  <option value={3}>L: 3 - No effort</option>
                  <option value={4}>L: 4 - No movement</option>
                </select>
                <select
                  value={nihssParams.motorArmRight5b}
                  onChange={e => updateNihssItem('motorArmRight5b', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-zinc-200"
                >
                  <option value={0}>R: 0 - No drift</option>
                  <option value={1}>R: 1 - Drift</option>
                  <option value={2}>R: 2 - Some effort</option>
                  <option value={3}>R: 3 - No effort</option>
                  <option value={4}>R: 4 - No movement</option>
                </select>
              </div>
            </div>

            {/* 6a/6b Motor Leg */}
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <span className="font-semibold text-zinc-300">6a/6b. Motor Leg (Left / Right):</span>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={nihssParams.motorLegLeft6a}
                  onChange={e => updateNihssItem('motorLegLeft6a', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-zinc-200"
                >
                  <option value={0}>L: 0 - No drift</option>
                  <option value={1}>L: 1 - Drift</option>
                  <option value={2}>L: 2 - Some effort</option>
                  <option value={3}>L: 3 - No effort</option>
                  <option value={4}>L: 4 - No movement</option>
                </select>
                <select
                  value={nihssParams.motorLegRight6b}
                  onChange={e => updateNihssItem('motorLegRight6b', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-zinc-200"
                >
                  <option value={0}>R: 0 - No drift</option>
                  <option value={1}>R: 1 - Drift</option>
                  <option value={2}>R: 2 - Some effort</option>
                  <option value={3}>R: 3 - No effort</option>
                  <option value={4}>R: 4 - No movement</option>
                </select>
              </div>
            </div>

            {/* 9 Best Language */}
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <span className="font-semibold text-zinc-300">9. Best Language (Aphasia):</span>
              <select
                value={nihssParams.bestLanguage9}
                onChange={e => updateNihssItem('bestLanguage9', Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-zinc-200"
              >
                <option value={0}>0 - No aphasia; normal fluency</option>
                <option value={1}>1 - Mild-to-moderate aphasia</option>
                <option value={2}>2 - Severe aphasia; fragmented communication</option>
                <option value={3}>3 - Mute, global aphasia</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: ASPECTS CT Map */}
      {activeTab === 'ASPECTS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <Brain className="w-4 h-4 text-indigo-400" /> Alberta Stroke Program Early CT Score (ASPECTS)
            </h2>
            <div className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-800 px-3 py-1 rounded-lg">
              Score: {evaluation.aspectsScore} / 10 ({evaluation.aspectsScore >= 7 ? 'Small Core' : 'Large Core'})
            </div>
          </div>

          <p className="text-xs text-zinc-400">
            Click any region to toggle early ischemic change (hypodensity / loss of grey-white differentiation). 1 point is deducted from 10 for each affected region.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Subcortical Ganglionic Structures (4) */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-xs text-purple-300 uppercase tracking-wider">
                Subcortical Ganglionic Structures (4)
              </span>
              <div className="space-y-1.5">
                {[
                  { key: 'caudate', label: 'Caudate Head (C)' },
                  { key: 'lentiform', label: 'Lentiform Nucleus (L)' },
                  { key: 'internalCapsule', label: 'Internal Capsule Posterior Limb (IC)' },
                  { key: 'insularRibbon', label: 'Insular Ribbon Cortex (I)' },
                ].map(item => {
                  const isIntact = aspectsRegions[item.key as keyof AspectsRegions];
                  return (
                    <button
                      key={item.key}
                      onClick={() => toggleAspectsRegion(item.key as keyof AspectsRegions)}
                      className={`w-full p-2.5 rounded-lg text-xs flex items-center justify-between border transition-all ${
                        isIntact
                          ? 'bg-slate-900 text-zinc-200 border-slate-800 hover:border-slate-700'
                          : 'bg-rose-950/60 text-rose-300 border-rose-800/80 font-bold'
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${isIntact ? 'bg-emerald-900/40 text-emerald-300' : 'bg-rose-900/50 text-rose-200'}`}>
                        {isIntact ? '+1 Intact' : '0 Hypodense'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* MCA Cortical Territories (6) */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-xs text-indigo-300 uppercase tracking-wider">
                MCA Cortical Territories (M1 - M6)
              </span>
              <div className="space-y-1.5">
                {[
                  { key: 'm1AnteriorCortex', label: 'M1: Anterior MCA Cortex' },
                  { key: 'm2TemporalCortex', label: 'M2: Lateral MCA Cortex (Insular branch)' },
                  { key: 'm3PosteriorCortex', label: 'M3: Posterior MCA Cortex' },
                  { key: 'm4AnteriorSupraganglionic', label: 'M4: Anterior Supraganglionic Cortex' },
                  { key: 'm5TemporalSupraganglionic', label: 'M5: Lateral Supraganglionic Cortex' },
                  { key: 'm6PosteriorSupraganglionic', label: 'M6: Posterior Supraganglionic Cortex' },
                ].map(item => {
                  const isIntact = aspectsRegions[item.key as keyof AspectsRegions];
                  return (
                    <button
                      key={item.key}
                      onClick={() => toggleAspectsRegion(item.key as keyof AspectsRegions)}
                      className={`w-full p-2 rounded-lg text-xs flex items-center justify-between border transition-all ${
                        isIntact
                          ? 'bg-slate-900 text-zinc-200 border-slate-800 hover:border-slate-700'
                          : 'bg-rose-950/60 text-rose-300 border-rose-800/80 font-bold'
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${isIntact ? 'bg-emerald-900/40 text-emerald-300' : 'bg-rose-900/50 text-rose-200'}`}>
                        {isIntact ? '+1 Intact' : '0 Hypodense'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Curriculum Clinical Pearls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs uppercase tracking-wider">
            <Zap className="w-4 h-4" /> 1. Tenecteplase vs Alteplase
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Tenecteplase (0.25 mg/kg IV push over 5 seconds) has replaced 60-minute alteplase infusions across leading stroke networks. In addition to rapid single-bolus administration that streamlines "drip-and-ship" interhospital transfer, the EXTEND-IA TNK trial proved double the early recanalization rate prior to thrombectomy for large vessel occlusions.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" /> 2. Blood Pressure Thresholds
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Prior to thrombolysis, blood pressure must be &le;185/110 mmHg. If elevated, titrate IV labetalol (10-20 mg) or nicardipine (5-15 mg/h). Following thrombolysis, maintain strict SBP &le;180 mmHg and DBP &le;105 mmHg for 24 hours to prevent fatal reperfusion intracerebral hemorrhage.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
            <Brain className="w-4 h-4" /> 3. Extended Window Thrombectomy
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            While intravenous thrombolysis is restricted to 4.5 hours from Last Known Well, DAWN and DEFUSE-3 trials extended endovascular mechanical thrombectomy up to 24 hours. Patients with small ischemic cores (&lt;70 mL) and large salvageable penumbral mismatch achieve dramatically superior functional independence.
          </p>
        </div>
      </div>
    </div>
  );
}
