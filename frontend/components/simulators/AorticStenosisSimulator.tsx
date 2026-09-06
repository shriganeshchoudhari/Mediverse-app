'use client';

import React, { useState, useMemo } from 'react';
import {
  EchoParameters,
  InvasiveCathParameters,
  ClinicalPatientProfile,
  evaluateAorticStenosis,
  AS_PRESETS,
} from '../../.gemini/skills/AorticStenosisEngine';
import {
  Heart,
  Activity,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Zap,
  Sparkles,
  RefreshCw,
  Stethoscope,
  Scale,
  Gauge,
  Sliders,
  ChevronRight,
} from 'lucide-react';

export default function AorticStenosisSimulator() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('severe-high-gradient-d1');

  // Echo parameters
  const [lvotDiameter, setLvotDiameter] = useState<number>(1.9);
  const [lvotVti, setLvotVti] = useState<number>(17);
  const [avVti, setAvVti] = useState<number>(71);
  const [lvotPeakVel, setLvotPeakVel] = useState<number>(0.85);
  const [avPeakVel, setAvPeakVel] = useState<number>(4.7);
  const [meanGrad, setMeanGrad] = useState<number>(54);
  const [aortaDiameter, setAortaDiameter] = useState<number>(2.9);

  // Invasive Cath parameters
  const [cardiacOutput, setCardiacOutput] = useState<number>(4.2);
  const [heartRate, setHeartRate] = useState<number>(76);
  const [sepSec, setSepSec] = useState<number>(0.28);
  const [invasiveMeanGrad, setInvasiveMeanGrad] = useState<number>(56);

  // Clinical profile
  const [age, setAge] = useState<number>(72);
  const [bsa, setBsa] = useState<number>(1.72);
  const [lvef, setLvef] = useState<number>(55);
  const [svi, setSvi] = useState<number>(36);
  const [sbp, setSbp] = useState<number>(142);
  const [hasSymptoms, setHasSymptoms] = useState<boolean>(true);
  const [stsScore, setStsScore] = useState<number>(2.1);
  const [isBicuspid, setIsBicuspid] = useState<boolean>(false);
  const [femoralAccess, setFemoralAccess] = useState<boolean>(true);
  const [porcelainAorta, setPorcelainAorta] = useState<boolean>(false);
  const [dobutamineResp, setDobutamineResp] = useState<
    'TRUE_SEVERE' | 'PSEUDO_SEVERE' | 'NO_CONTRACTILE_RESERVE' | undefined
  >(undefined);

  // Run Master Evaluation Engine
  const evaluation = useMemo(() => {
    const echo: EchoParameters = {
      lvotDiameterCm: lvotDiameter,
      lvotVtiCm: lvotVti,
      avVtiCm: avVti,
      lvotPeakVelocityMs: lvotPeakVel,
      avPeakVelocityMs: avPeakVel,
      meanGradientMmHg: meanGrad,
      aorticRootDiameterCm: aortaDiameter,
    };
    const cath: InvasiveCathParameters = {
      cardiacOutputLMin: cardiacOutput,
      heartRateBpm: heartRate,
      systolicEjectionPeriodSec: sepSec,
      invasiveMeanGradientMmHg: invasiveMeanGrad,
    };
    const profile: ClinicalPatientProfile = {
      age,
      bsaM2: bsa,
      lvefPct: lvef,
      strokeVolumeIndexMlM2: svi,
      systolicBpMmHg: sbp,
      hasSymptoms,
      stsPromScorePct: stsScore,
      isBicuspid,
      transfemoralAccessFeasible: femoralAccess,
      severeAortaCalcificationPorcelain: porcelainAorta,
      dobutamineResponse: dobutamineResp,
    };

    return evaluateAorticStenosis(echo, cath, profile);
  }, [
    lvotDiameter,
    lvotVti,
    avVti,
    lvotPeakVel,
    avPeakVel,
    meanGrad,
    aortaDiameter,
    cardiacOutput,
    heartRate,
    sepSec,
    invasiveMeanGrad,
    age,
    bsa,
    lvef,
    svi,
    sbp,
    hasSymptoms,
    stsScore,
    isBicuspid,
    femoralAccess,
    porcelainAorta,
    dobutamineResp,
  ]);

  // Handle Preset Selection
  const handlePresetSelect = (id: string) => {
    setSelectedPresetId(id);
    const p = AS_PRESETS.find(item => item.id === id);
    if (p) {
      setLvotDiameter(p.echo.lvotDiameterCm);
      setLvotVti(p.echo.lvotVtiCm);
      setAvVti(p.echo.avVtiCm);
      setLvotPeakVel(p.echo.lvotPeakVelocityMs);
      setAvPeakVel(p.echo.avPeakVelocityMs);
      setMeanGrad(p.echo.meanGradientMmHg);
      setAortaDiameter(p.echo.aorticRootDiameterCm);

      setCardiacOutput(p.cath.cardiacOutputLMin);
      setHeartRate(p.cath.heartRateBpm);
      setSepSec(p.cath.systolicEjectionPeriodSec);
      setInvasiveMeanGrad(p.cath.invasiveMeanGradientMmHg);

      setAge(p.profile.age);
      setBsa(p.profile.bsaM2);
      setLvef(p.profile.lvefPct);
      setSvi(p.profile.strokeVolumeIndexMlM2);
      setSbp(p.profile.systolicBpMmHg);
      setHasSymptoms(p.profile.hasSymptoms);
      setStsScore(p.profile.stsPromScorePct);
      setIsBicuspid(p.profile.isBicuspid);
      setFemoralAccess(p.profile.transfemoralAccessFeasible);
      setPorcelainAorta(p.profile.severeAortaCalcificationPorcelain);
      setDobutamineResp(p.profile.dobutamineResponse);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-zinc-100 p-2 sm:p-4">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-indigo-950 border border-red-600/40 rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-500/20 border border-red-500/40 rounded-xl text-red-400">
                <Heart className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                  Aortic Stenosis &amp; Valve Hemodynamics Workstation
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 font-mono">
                    Gorlin &amp; Continuity Solver
                  </span>
                </h1>
                <p className="text-sm text-zinc-400 mt-1">
                  Multi-modality AS evaluation: Doppler Continuity Equation, Cath Gorlin &amp; Hakki equations, Energy Loss Index, and ACC/AHA Heart Team decision tree.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-slate-900/80 border border-slate-700/80 px-3 py-1.5 rounded-lg text-xs font-mono">
              <span className="text-zinc-400">AVA:</span>{' '}
              <span
                className={`font-bold text-sm ${
                  evaluation.continuityAvaCm2 <= 1.0 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {evaluation.continuityAvaCm2} cm&sup2; ({evaluation.indexedAvaCm2M2} cm&sup2;/m&sup2;)
              </span>
            </div>
            <div className="bg-slate-900/80 border border-slate-700/80 px-3 py-1.5 rounded-lg text-xs font-mono">
              <span className="text-zinc-400">Mean &Delta;P:</span>{' '}
              <span
                className={`font-bold ${
                  meanGrad >= 40 ? 'text-rose-400' : meanGrad >= 20 ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {meanGrad} mmHg
              </span>
            </div>
            <div className="bg-slate-900/80 border border-slate-700/80 px-3 py-1.5 rounded-lg text-xs font-mono">
              <span className="text-zinc-400">Stage:</span>{' '}
              <span className="text-cyan-300 font-bold">
                {evaluation.guidelineStage.replace('STAGE_', '')}
              </span>
            </div>
          </div>
        </div>

        {/* Preset Selector Bar */}
        <div className="mt-5 pt-4 border-t border-red-900/40 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-red-300 flex items-center gap-1.5 mr-2">
            <Sparkles className="w-3.5 h-3.5" /> Clinical Presets:
          </span>
          {AS_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedPresetId === preset.id
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 ring-1 ring-red-400'
                  : 'bg-slate-800/80 text-zinc-300 hover:bg-slate-750 hover:text-white border border-slate-700/60'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Controls (Left 5 cols) & Diagnostic Evaluation (Right 7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Hemodynamic Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card 1: Doppler Echocardiography Inputs */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3.5 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" /> Doppler Echocardiography
              </h2>
              <span className="font-mono text-cyan-300 font-bold">
                LVOT Area: {evaluation.lvotAreaCm2} cm&sup2;
              </span>
            </div>

            {/* LVOT Diameter */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-zinc-400">LVOT Diameter (Parasternal Long-Axis):</span>
                <span className="font-mono font-bold text-cyan-300">{lvotDiameter} cm</span>
              </div>
              <input
                type="range"
                min="1.6"
                max="2.6"
                step="0.05"
                value={lvotDiameter}
                onChange={e => setLvotDiameter(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            {/* LVOT VTI & AV VTI */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-400">LVOT VTI:</span>
                  <span className="font-mono font-bold text-cyan-300">{lvotVti} cm</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="30"
                  step="1"
                  value={lvotVti}
                  onChange={e => setLvotVti(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Aortic Valve VTI:</span>
                  <span className="font-mono font-bold text-rose-400">{avVti} cm</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="120"
                  step="1"
                  value={avVti}
                  onChange={e => setAvVti(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-rose-500"
                />
              </div>
            </div>

            {/* Peak Velocities */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-400">LVOT Vmax:</span>
                  <span className="font-mono font-bold text-cyan-300">{lvotPeakVel} m/s</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.05"
                  value={lvotPeakVel}
                  onChange={e => setLvotPeakVel(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Aortic Vmax:</span>
                  <span className={`font-mono font-bold ${avPeakVel >= 4.0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {avPeakVel} m/s
                  </span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="6.0"
                  step="0.1"
                  value={avPeakVel}
                  onChange={e => setAvPeakVel(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-rose-500"
                />
              </div>
            </div>

            {/* Mean Transvalvular Gradient & Ascending Aorta */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Mean Gradient (&Delta;P):</span>
                  <span className={`font-mono font-bold ${meanGrad >= 40 ? 'text-rose-400' : 'text-amber-400'}`}>
                    {meanGrad} mmHg
                  </span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="90"
                  step="1"
                  value={meanGrad}
                  onChange={e => setMeanGrad(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-rose-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Aorta Root Diameter:</span>
                  <span className="font-mono font-bold text-indigo-300">{aortaDiameter} cm</span>
                </div>
                <input
                  type="range"
                  min="2.0"
                  max="5.5"
                  step="0.1"
                  value={aortaDiameter}
                  onChange={e => setAortaDiameter(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Invasive Catheterization Parameters */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3.5 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-emerald-400" /> Invasive Cath Parameters (Gorlin)
              </h2>
              <span className="font-mono text-emerald-400 font-bold">
                Gorlin: {evaluation.gorlinAvaCm2} cm&sup2;
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Cardiac Output:</span>
                  <span className="font-mono font-bold text-emerald-400">{cardiacOutput} L/min</span>
                </div>
                <input
                  type="range"
                  min="2.0"
                  max="8.0"
                  step="0.1"
                  value={cardiacOutput}
                  onChange={e => setCardiacOutput(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Heart Rate:</span>
                  <span className="font-mono font-bold text-white">{heartRate} bpm</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="130"
                  step="1"
                  value={heartRate}
                  onChange={e => setHeartRate(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Systolic Ejection Period:</span>
                  <span className="font-mono font-bold text-white">{sepSec} s/beat</span>
                </div>
                <input
                  type="range"
                  min="0.20"
                  max="0.40"
                  step="0.01"
                  value={sepSec}
                  onChange={e => setSepSec(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Cath Mean &Delta;P:</span>
                  <span className="font-mono font-bold text-amber-300">{invasiveMeanGrad} mmHg</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="90"
                  step="1"
                  value={invasiveMeanGrad}
                  onChange={e => setInvasiveMeanGrad(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Patient Demographics & Anatomy */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3.5 text-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2 border-b border-slate-800 pb-2.5">
              <Sliders className="w-4 h-4 text-purple-400" /> Patient Risk &amp; Anatomy Profile
            </h2>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-zinc-400">Age: <span className="text-white font-mono font-bold">{age} yr</span></label>
                <input
                  type="range"
                  min="30"
                  max="95"
                  value={age}
                  onChange={e => setAge(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-purple-500 mt-1"
                />
              </div>

              <div>
                <label className="text-zinc-400">LVEF: <span className={`font-mono font-bold ${lvef < 50 ? 'text-rose-400' : 'text-emerald-400'}`}>{lvef}%</span></label>
                <input
                  type="range"
                  min="15"
                  max="75"
                  value={lvef}
                  onChange={e => setLvef(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-purple-500 mt-1"
                />
              </div>

              <div>
                <label className="text-zinc-400">SVI: <span className={`font-mono font-bold ${svi < 35 ? 'text-amber-400' : 'text-cyan-300'}`}>{svi} mL/m&sup2;</span></label>
                <input
                  type="range"
                  min="15"
                  max="55"
                  value={svi}
                  onChange={e => setSvi(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-purple-500 mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-zinc-400">Systolic BP: <span className="text-white font-mono font-bold">{sbp} mmHg</span></label>
                <input
                  type="range"
                  min="90"
                  max="190"
                  value={sbp}
                  onChange={e => setSbp(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-purple-500 mt-1"
                />
              </div>

              <div>
                <label className="text-zinc-400">STS-PROM Score: <span className={`font-mono font-bold ${stsScore >= 8 ? 'text-rose-400' : stsScore >= 4 ? 'text-amber-400' : 'text-emerald-400'}`}>{stsScore}%</span></label>
                <input
                  type="range"
                  min="0.2"
                  max="15.0"
                  step="0.2"
                  value={stsScore}
                  onChange={e => setStsScore(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-purple-500 mt-1"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasSymptoms}
                  onChange={e => setHasSymptoms(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-500"
                />
                <span className="text-zinc-300">Active Symptoms (Angina/Syncope/HF)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBicuspid}
                  onChange={e => setIsBicuspid(e.target.checked)}
                  className="w-4 h-4 rounded text-cyan-500"
                />
                <span className="text-zinc-300">Bicuspid Aortic Valve</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={femoralAccess}
                  onChange={e => setFemoralAccess(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500"
                />
                <span className="text-zinc-300">Transfemoral Access Feasible</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={porcelainAorta}
                  onChange={e => setPorcelainAorta(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500"
                />
                <span className="text-zinc-300">Porcelain Ascending Aorta</span>
              </label>
            </div>

            {/* Dobutamine Stress Selector for Low Flow AS */}
            {svi < 35 && lvef < 50 && (
              <div className="pt-2 border-t border-slate-800/80 space-y-1 bg-amber-950/20 p-2.5 rounded-xl border border-amber-800/40">
                <span className="text-amber-300 font-semibold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> Low-Dose Dobutamine Echo Response:
                </span>
                <div className="grid grid-cols-3 gap-1 mt-1">
                  {[
                    { val: undefined, label: 'Not Tested' },
                    { val: 'TRUE_SEVERE', label: 'True Severe' },
                    { val: 'PSEUDO_SEVERE', label: 'Pseudo-Severe' },
                  ].map(opt => (
                    <button
                      key={String(opt.val)}
                      onClick={() => setDobutamineResp(opt.val as any)}
                      className={`p-1 rounded text-center border transition-all ${
                        dobutamineResp === opt.val
                          ? 'bg-amber-800 text-white border-amber-400 font-bold'
                          : 'bg-slate-950 text-zinc-400 border-slate-800'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Diagnostic Synthesis & Multi-Modality Matrix (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Stage & Classification Banner */}
          <div
            className={`p-5 rounded-2xl border ${
              evaluation.guidelineStage === 'STAGE_D1' ||
              evaluation.guidelineStage === 'STAGE_D2' ||
              evaluation.guidelineStage === 'STAGE_D3' ||
              evaluation.guidelineStage === 'STAGE_C2'
                ? 'bg-rose-950/40 border-rose-800/80 text-rose-200'
                : evaluation.guidelineStage === 'STAGE_C1'
                ? 'bg-purple-950/40 border-purple-800/80 text-purple-200'
                : evaluation.guidelineStage === 'STAGE_B'
                ? 'bg-amber-950/40 border-amber-800/80 text-amber-200'
                : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
                <ShieldAlert className="w-5 h-5 shrink-0 text-red-400" />
                <span>{evaluation.stageTitle}</span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-slate-900/80 border border-slate-700">
                Grade: {evaluation.severityGrade}
              </span>
            </div>
            <p className="text-xs leading-relaxed font-medium opacity-90">
              {evaluation.stageRationale}
            </p>
          </div>

          {/* Heart Team Recommendation Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <Scale className="w-4 h-4 text-cyan-400" /> Heart Team Intervention Recommendation
              </h3>
              <span
                className={`px-3 py-1 rounded-lg text-xs font-bold font-mono ${
                  evaluation.interventionStrategy === 'TAVI_PREFERRED'
                    ? 'bg-indigo-900/80 text-indigo-300 border border-indigo-600'
                    : evaluation.interventionStrategy === 'SAVR_PREFERRED'
                    ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-600'
                    : evaluation.interventionStrategy === 'EQUIPOISE_HEART_TEAM'
                    ? 'bg-purple-900/80 text-purple-300 border border-purple-600'
                    : 'bg-slate-800 text-zinc-300 border border-slate-700'
                }`}
              >
                {evaluation.interventionStrategy.replace(/_/g, ' ')}
              </span>
            </div>

            <p className="text-xs leading-relaxed text-zinc-300 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
              {evaluation.recommendationSummary}
            </p>

            <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
              <span>Surgical Operative Risk:</span>
              <span
                className={`font-mono font-bold ${
                  evaluation.operativeRiskCategory === 'HIGH_OR_PROHIBITIVE'
                    ? 'text-rose-400'
                    : evaluation.operativeRiskCategory === 'INTERMEDIATE'
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {evaluation.operativeRiskCategory.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          {/* Multi-Modality Hemodynamic Metrics Matrix */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2 border-b border-slate-800 pb-2.5">
              <Gauge className="w-4 h-4 text-amber-400" /> Multi-Modality Hemodynamics &amp; Indices
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-zinc-400">Continuity AVA</div>
                <div
                  className={`text-base font-bold mt-0.5 ${
                    evaluation.continuityAvaCm2 <= 1.0 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {evaluation.continuityAvaCm2} cm&sup2;
                </div>
                <div className="text-[9px] text-zinc-500">
                  Indexed: {evaluation.indexedAvaCm2M2} cm&sup2;/m&sup2;
                </div>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-zinc-400">Velocity Index (DVI)</div>
                <div
                  className={`text-base font-bold mt-0.5 ${
                    evaluation.dimensionlessVelocityIndex < 0.25 ? 'text-rose-400' : 'text-cyan-300'
                  }`}
                >
                  {evaluation.dimensionlessVelocityIndex}
                </div>
                <div className="text-[9px] text-zinc-500">&lt; 0.25 = Severe AS</div>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-zinc-400">Invasive Gorlin AVA</div>
                <div
                  className={`text-base font-bold mt-0.5 ${
                    evaluation.gorlinAvaCm2 <= 1.0 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {evaluation.gorlinAvaCm2} cm&sup2;
                </div>
                <div className="text-[9px] text-zinc-500">Hakki: {evaluation.hakkiAvaCm2} cm&sup2;</div>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-zinc-400">Peak Gradient (&Delta;P)</div>
                <div className="text-base font-bold text-rose-400 mt-0.5">
                  {evaluation.peakGradientMmHg} mmHg
                </div>
                <div className="text-[9px] text-zinc-500">4 &times; Vmax&sup2;</div>
              </div>
            </div>

            {/* Advanced Mechanics: Pressure Recovery & Zva */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono">
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-zinc-400">Energy Loss Index (ELI):</span>
                  <span className="font-bold text-indigo-300">{evaluation.energyLossIndexCm2M2} cm&sup2;/m&sup2;</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-zinc-500 mt-1">
                  <span>Pressure Recovery:</span>
                  <span>+{evaluation.pressureRecoveryMmHg} mmHg</span>
                </div>
                <p className="text-[9px] text-zinc-500 font-sans mt-1">
                  Corrects for ascending aorta re-expansion in small roots (&le; 3.0 cm).
                </p>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-zinc-400">Valvuloarterial Impedance (Zva):</span>
                  <span
                    className={`font-bold ${
                      evaluation.valvuloarterialImpedanceMmHgMlM2 > 4.5
                        ? 'text-rose-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {evaluation.valvuloarterialImpedanceMmHgMlM2} mmHg/(mL/m&sup2;)
                  </span>
                </div>
                <div className="text-[10px] text-zinc-500 mt-1">
                  Formula: (SBP + &Delta;P_mean) / SVI
                </div>
                <p className="text-[9px] text-zinc-500 font-sans mt-1">
                  &gt; 4.5 reflects severe global afterload and elevated post-op mortality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum Pearls (3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs uppercase tracking-wider">
            <Heart className="w-4 h-4" /> 1. Continuity vs Gorlin Principles
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            The Doppler continuity equation measures effective orifice area (EOA) at the vena contracta based on conservation of mass (CSA_LVOT &times; VTI_LVOT = AVA &times; VTI_AV). In contrast, the invasive Gorlin equation calculates anatomic orifice area from pressure drop and flow rate. Because flow accelerates through the orifice, EOA is typically 10-15% smaller than Gorlin anatomic area.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
            <Zap className="w-4 h-4" /> 2. The Low-Flow Low-Gradient Dilemma
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            When stroke volume index is low (SVI &lt; 35 mL/m&sup2;), the failing left ventricle cannot generate the classical &ge;40 mmHg gradient despite severe orifice restriction. Low-dose Dobutamine Stress Echo (up to 20 mcg/kg/min) tests for contractile reserve (&ge;20% SV increase). If AVA expands &gt;1.2 cm&sup2; as gradient rises minimally, the patient has <em>pseudo-severe AS</em> and benefits from heart failure medical management.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider">
            <Scale className="w-4 h-4" /> 3. TAVI vs SAVR ACC/AHA Staging
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Age, life expectancy, and vascular anatomy govern procedural choice: In patients &lt;65 years or life expectancy &gt;20 years, SAVR is preferred (allowing mechanical prosthesis and concomitant aortic root reconstruction). In patients &ge;75 years or high/prohibitive STS risk (&ge;8%), transfemoral TAVI is the standard of care with lower periprocedural morbidity and accelerated recovery.
          </p>
        </div>
      </div>
    </div>
  );
}
