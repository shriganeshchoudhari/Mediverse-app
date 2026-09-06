'use client';

import React, { useState, useMemo } from 'react';
import {
  RhcPressures,
  FickParameters,
  VasoreactivityTest,
  evaluateRightHeartCath,
  RHC_PRESETS,
} from '../../.gemini/skills/RightHeartCathEngine';
import {
  Activity,
  Heart,
  Wind,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Zap,
  Sparkles,
  Gauge,
  Sliders,
  Scale,
  Stethoscope,
  Info,
} from 'lucide-react';

export default function RightHeartCathSimulator() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('idiopathic-pah-group-1');

  // Pressure state
  const [rap, setRap] = useState<number>(11);
  const [rvs, setRvs] = useState<number>(82);
  const [rvedp, setRvedp] = useState<number>(12);
  const [pas, setPas] = useState<number>(82);
  const [pad, setPad] = useState<number>(34);
  const [pam, setPam] = useState<number>(52);
  const [pawp, setPawp] = useState<number>(10);
  const [sbp, setSbp] = useState<number>(108);
  const [dbp, setDbp] = useState<number>(68);
  const [mapVal, setMapVal] = useState<number>(81);

  // Fick oximetry state
  const [hb, setHb] = useState<number>(15.0);
  const [sao2, setSao2] = useState<number>(93);
  const [svo2, setSvo2] = useState<number>(58);
  const [hr, setHr] = useState<number>(88);
  const [age, setAge] = useState<number>(36);
  const [sex, setSex] = useState<'MALE' | 'FEMALE'>('FEMALE');
  const [heightCm, setHeightCm] = useState<number>(164);
  const [weightKg, setWeightKg] = useState<number>(58);

  // Vasoreactivity state
  const [vasoActive, setVasoActive] = useState<boolean>(false);
  const [postDrugMpap, setPostDrugMpap] = useState<number>(32);
  const [postDrugPawp, setPostDrugPawp] = useState<number>(10);
  const [postDrugCo, setPostDrugCo] = useState<number>(4.8);

  // Run Master Evaluation Engine
  const evaluation = useMemo(() => {
    const pressures: RhcPressures = {
      rightAtrialPressureMeanMmHg: rap,
      rvSystolicMmHg: rvs,
      rvEndDiastolicMmHg: rvedp,
      paSystolicMmHg: pas,
      paDiastolicMmHg: pad,
      paMeanMmHg: pam,
      pulmonaryCapillaryWedgeMmHg: pawp,
      aorticSystolicMmHg: sbp,
      aorticDiastolicMmHg: dbp,
      aorticMeanMmHg: mapVal,
    };

    const fick: FickParameters = {
      hemoglobinGPerDl: hb,
      arterialO2SaturationPct: sao2,
      mixedVenousO2SaturationPct: svo2,
      vo2Method: 'ESTIMATED_BERGSTRA',
      patientAge: age,
      patientSex: sex,
      patientHeightCm: heightCm,
      patientWeightKg: weightKg,
      heartRateBpm: hr,
    };

    const vaso: VasoreactivityTest = {
      performed: vasoActive,
      agentUsed: 'INHALED_NITRIC_OXIDE',
      postDrugPaMeanMmHg: postDrugMpap,
      postDrugPawpMmHg: postDrugPawp,
      postDrugCardiacOutputLMin: postDrugCo,
    };

    return evaluateRightHeartCath(pressures, fick, vaso);
  }, [
    rap,
    rvs,
    rvedp,
    pas,
    pad,
    pam,
    pawp,
    sbp,
    dbp,
    mapVal,
    hb,
    sao2,
    svo2,
    hr,
    age,
    sex,
    heightCm,
    weightKg,
    vasoActive,
    postDrugMpap,
    postDrugPawp,
    postDrugCo,
  ]);

  // Handle Preset Selection
  const handlePresetSelect = (id: string) => {
    setSelectedPresetId(id);
    const p = RHC_PRESETS.find(item => item.id === id);
    if (p) {
      setRap(p.pressures.rightAtrialPressureMeanMmHg);
      setRvs(p.pressures.rvSystolicMmHg);
      setRvedp(p.pressures.rvEndDiastolicMmHg);
      setPas(p.pressures.paSystolicMmHg);
      setPad(p.pressures.paDiastolicMmHg);
      setPam(p.pressures.paMeanMmHg);
      setPawp(p.pressures.pulmonaryCapillaryWedgeMmHg);
      setSbp(p.pressures.aorticSystolicMmHg);
      setDbp(p.pressures.aorticDiastolicMmHg);
      setMapVal(p.pressures.aorticMeanMmHg);

      setHb(p.fick.hemoglobinGPerDl);
      setSao2(p.fick.arterialO2SaturationPct);
      setSvo2(p.fick.mixedVenousO2SaturationPct);
      setHr(p.fick.heartRateBpm);
      setAge(p.fick.patientAge);
      setSex(p.fick.patientSex);
      setHeightCm(p.fick.patientHeightCm);
      setWeightKg(p.fick.patientWeightKg);

      if (p.vaso && p.vaso.performed) {
        setVasoActive(true);
        setPostDrugMpap(p.vaso.postDrugPaMeanMmHg ?? 32);
        setPostDrugPawp(p.vaso.postDrugPawpMmHg ?? 10);
        setPostDrugCo(p.vaso.postDrugCardiacOutputLMin ?? 4.8);
      } else {
        setVasoActive(false);
      }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-zinc-100 p-2 sm:p-4">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 border border-sky-600/40 rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-sky-500/20 border border-sky-500/40 rounded-xl text-sky-400">
                <Activity className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                  Right Heart Catheterization (RHC) Workstation
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 font-mono">
                    Fick &amp; PVR Solver
                  </span>
                </h1>
                <p className="text-sm text-zinc-400 mt-1">
                  Swan-Ganz catheterization analysis: Fick Cardiac Output, Pulmonary Vascular Resistance (PVR), 2022 ESC/ERS PH Phenotyping, and Vasoreactivity Testing.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-slate-900/80 border border-slate-700/80 px-3 py-1.5 rounded-lg text-xs font-mono">
              <span className="text-zinc-400">mPAP:</span>{' '}
              <span className={`font-bold ${pam > 20 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {pam} mmHg
              </span>
            </div>
            <div className="bg-slate-900/80 border border-slate-700/80 px-3 py-1.5 rounded-lg text-xs font-mono">
              <span className="text-zinc-400">PAWP:</span>{' '}
              <span className={`font-bold ${pawp > 15 ? 'text-amber-400' : 'text-cyan-300'}`}>
                {pawp} mmHg
              </span>
            </div>
            <div className="bg-slate-900/80 border border-slate-700/80 px-3 py-1.5 rounded-lg text-xs font-mono">
              <span className="text-zinc-400">PVR:</span>{' '}
              <span className={`font-bold ${evaluation.pvrWoodUnits > 2.0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {evaluation.pvrWoodUnits} WU
              </span>
            </div>
            <div className="bg-slate-900/80 border border-slate-700/80 px-3 py-1.5 rounded-lg text-xs font-mono">
              <span className="text-zinc-400">CI:</span>{' '}
              <span className="text-white font-bold">{evaluation.cardiacIndexLMinM2} L/min/m&sup2;</span>
            </div>
          </div>
        </div>

        {/* Preset Selector Bar */}
        <div className="mt-5 pt-4 border-t border-sky-900/40 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-sky-300 flex items-center gap-1.5 mr-2">
            <Sparkles className="w-3.5 h-3.5" /> Clinical Presets:
          </span>
          {RHC_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedPresetId === preset.id
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30 ring-1 ring-sky-400'
                  : 'bg-slate-800/80 text-zinc-300 hover:bg-slate-750 hover:text-white border border-slate-700/60'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Inputs (Left 5 cols) & Diagnostic Evaluation (Right 7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Pressures, Oximetry & Vasoreactivity (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card 1: Swan-Ganz Pressure Profiles */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3.5 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-sky-400" /> Swan-Ganz Intracardiac Pressures
              </h2>
              <span className="font-mono text-cyan-300 font-bold">
                TPG: {evaluation.transpulmonaryGradientMmHg} mmHg
              </span>
            </div>

            {/* Mean Pulmonary Artery Pressure (mPAP) */}
            <div className="space-y-1 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
              <div className="flex justify-between">
                <span className="text-zinc-300 font-semibold">Mean PA Pressure (mPAP):</span>
                <span className={`font-mono font-bold ${pam > 20 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {pam} mmHg
                </span>
              </div>
              <input
                type="range"
                min="8"
                max="80"
                value={pam}
                onChange={e => setPam(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-rose-500"
              />
              <div className="text-[10px] text-zinc-500">Normal &le; 20 mmHg | &gt; 20 defines Pulmonary Hypertension</div>
            </div>

            {/* PA Systolic & Diastolic */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-400">PA Systolic (sPAP):</span>
                  <span className="font-mono font-bold text-rose-400">{pas} mmHg</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="120"
                  value={pas}
                  onChange={e => setPas(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-rose-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-400">PA Diastolic (dPAP):</span>
                  <span className="font-mono font-bold text-cyan-300">{pad} mmHg</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="60"
                  value={pad}
                  onChange={e => setPad(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
            </div>

            {/* PAWP (Wedge) & RAP (CVP) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-400">PA Wedge (PAWP):</span>
                  <span className={`font-mono font-bold ${pawp > 15 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {pawp} mmHg
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="35"
                  value={pawp}
                  onChange={e => setPawp(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-500"
                />
                <div className="text-[10px] text-zinc-500">&le;15 Pre-capillary | &gt;15 Post-capillary</div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Right Atrial (RAP/CVP):</span>
                  <span className={`font-mono font-bold ${rap >= 12 ? 'text-rose-400' : 'text-white'}`}>
                    {rap} mmHg
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  value={rap}
                  onChange={e => setRap(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-sky-500"
                />
                <div className="text-[10px] text-zinc-500">Normal: 2-6 mmHg</div>
              </div>
            </div>

            {/* Mean Arterial Pressure (MAP) */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between">
                <span className="text-zinc-400">Mean Arterial Pressure (MAP):</span>
                <span className="font-mono font-bold text-white">{mapVal} mmHg</span>
              </div>
              <input
                type="range"
                min="45"
                max="135"
                value={mapVal}
                onChange={e => setMapVal(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-sky-500"
              />
            </div>
          </div>

          {/* Card 2: Fick Oximetry & Metabolic Parameters */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3.5 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <Wind className="w-4 h-4 text-emerald-400" /> Fick Oximetry &amp; Metabolism
              </h2>
              <span className="font-mono text-emerald-400 font-bold">
                VO2: {evaluation.calculatedVo2MlMin} mL/min
              </span>
            </div>

            {/* SaO2 & SvO2 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Arterial Sat (SaO2):</span>
                  <span className="font-mono font-bold text-cyan-300">{sao2}%</span>
                </div>
                <input
                  type="range"
                  min="75"
                  max="100"
                  value={sao2}
                  onChange={e => setSao2(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Mixed Venous (SvO2):</span>
                  <span className={`font-mono font-bold ${svo2 < 60 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {svo2}%
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="85"
                  value={svo2}
                  onChange={e => setSvo2(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="text-[10px] text-zinc-500">&lt;60% reflects impaired oxygen delivery</div>
              </div>
            </div>

            {/* Hemoglobin & Heart Rate */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Hemoglobin (Hb):</span>
                  <span className="font-mono font-bold text-amber-300">{hb} g/dL</span>
                </div>
                <input
                  type="range"
                  min="7.0"
                  max="20.0"
                  step="0.2"
                  value={hb}
                  onChange={e => setHb(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Heart Rate:</span>
                  <span className="font-mono font-bold text-white">{hr} bpm</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="130"
                  value={hr}
                  onChange={e => setHr(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Acute Vasoreactivity Testing Protocol */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-400" /> Vasoreactivity Challenge (iNO 20 ppm)
              </h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={vasoActive}
                  onChange={e => setVasoActive(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-500"
                />
                <span className="text-zinc-300 font-semibold">Test Performed</span>
              </label>
            </div>

            {vasoActive && (
              <div className="space-y-3 pt-1 bg-purple-950/20 p-3 rounded-xl border border-purple-800/40">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Post-Challenge mPAP:</span>
                    <span className="font-mono font-bold text-purple-300">{postDrugMpap} mmHg</span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="60"
                    value={postDrugMpap}
                    onChange={e => setPostDrugMpap(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-purple-500"
                  />
                  <div className="text-[10px] text-zinc-500">
                    Sitbon Responder: &Delta;mPAP &ge; 10 mmHg to &le; 40 mmHg with stable CO.
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Post-Challenge CO:</span>
                    <span className="font-mono font-bold text-emerald-400">{postDrugCo} L/min</span>
                  </div>
                  <input
                    type="range"
                    min="2.0"
                    max="8.0"
                    step="0.1"
                    value={postDrugCo}
                    onChange={e => setPostDrugCo(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Diagnostic Synthesis & Multi-Modality Matrix (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Phenotype Classification Callout Banner */}
          <div
            className={`p-5 rounded-2xl border ${
              evaluation.phenotype === 'PRE_CAPILLARY_PH'
                ? 'bg-rose-950/40 border-rose-800/80 text-rose-200'
                : evaluation.phenotype === 'ISOLATED_POST_CAPILLARY_PH'
                ? 'bg-amber-950/40 border-amber-800/80 text-amber-200'
                : evaluation.phenotype === 'COMBINED_POST_AND_PRE_CAPILLARY_PH'
                ? 'bg-purple-950/40 border-purple-800/80 text-purple-200'
                : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
                <ShieldAlert className="w-5 h-5 shrink-0 text-sky-400" />
                <span>{evaluation.phenotypeTitle}</span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-slate-900/80 border border-slate-700">
                {evaluation.suggestedClinicalGroup.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs leading-relaxed font-medium opacity-90">
              {evaluation.phenotypeDescription}
            </p>
          </div>

          {/* Treatment Recommendation & Vasoreactivity Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-cyan-400" /> Clinical Management &amp; Pharmacotherapy Guidance
              </h3>
              {vasoActive && (
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-bold font-mono ${
                    evaluation.vasoreactiveResponder
                      ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-600'
                      : 'bg-rose-900/80 text-rose-300 border border-rose-600'
                  }`}
                >
                  {evaluation.vasoreactiveResponder ? 'VASOREACTIVE (CCB Candidate)' : 'NON-RESPONDER'}
                </span>
              )}
            </div>

            {vasoActive && (
              <div className="text-xs font-semibold text-purple-300 bg-purple-950/40 p-2.5 rounded-xl border border-purple-800/60">
                {evaluation.vasoreactivitySummary}
              </div>
            )}

            <p className="text-xs leading-relaxed text-zinc-300 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
              {evaluation.treatmentRecommendation}
            </p>

            <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
              <span>Right Ventricular Systolic Failure Risk (PAPi):</span>
              <span
                className={`font-mono font-bold ${
                  evaluation.rvFailureRisk === 'SEVERE_RV_FAILURE'
                    ? 'text-rose-400'
                    : evaluation.rvFailureRisk === 'MODERATE'
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                PAPi {evaluation.pulmonaryArteryPulsatilityIndex} ({evaluation.rvFailureRisk.replace(/_/g, ' ')})
              </span>
            </div>
          </div>

          {/* Multi-Modality Hemodynamic Metrics Matrix */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2 border-b border-slate-800 pb-2.5">
              <Gauge className="w-4 h-4 text-amber-400" /> Comprehensive Hemodynamic Panel
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-zinc-400">Fick Cardiac Output</div>
                <div className="text-base font-bold text-white mt-0.5">
                  {evaluation.cardiacOutputLMin} L/min
                </div>
                <div className="text-[9px] text-zinc-500">
                  CI: {evaluation.cardiacIndexLMinM2} L/min/m&sup2;
                </div>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-zinc-400">Pulmonary Resistance (PVR)</div>
                <div
                  className={`text-base font-bold mt-0.5 ${
                    evaluation.pvrWoodUnits > 2.0 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {evaluation.pvrWoodUnits} WU
                </div>
                <div className="text-[9px] text-zinc-500">{evaluation.pvrDyneSecCm5} dyn&middot;s/cm&sup5;</div>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-zinc-400">Systemic Resistance (SVR)</div>
                <div className="text-base font-bold text-white mt-0.5">
                  {evaluation.svrDyneSecCm5} dyn
                </div>
                <div className="text-[9px] text-zinc-500">{evaluation.svrWoodUnits} Wood Units</div>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-zinc-400">Diastolic Grad (DPG)</div>
                <div
                  className={`text-base font-bold mt-0.5 ${
                    evaluation.diastolicPulmonaryGradientMmHg >= 7 ? 'text-rose-400' : 'text-cyan-300'
                  }`}
                >
                  {evaluation.diastolicPulmonaryGradientMmHg} mmHg
                </div>
                <div className="text-[9px] text-zinc-500">TPG: {evaluation.transpulmonaryGradientMmHg} mmHg</div>
              </div>
            </div>

            {/* Capacitance & RV Performance Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono">
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-zinc-400">PA Capacitance (PAC):</span>
                  <span className="font-bold text-indigo-300">
                    {evaluation.pulmonaryArteryCapacitanceMlMmHg} mL/mmHg
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-zinc-500 mt-1">
                  <span>Stroke Volume:</span>
                  <span>{evaluation.strokeVolumeMl} mL ({evaluation.strokeVolumeIndexMlM2} mL/m&sup2;)</span>
                </div>
                <p className="text-[9px] text-zinc-500 font-sans mt-1">
                  &lt; 1.1 mL/mmHg reflects severe vascular stiffening and uncoupled RV afterload.
                </p>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-zinc-400">RV PAPi Index:</span>
                  <span
                    className={`font-bold ${
                      evaluation.pulmonaryArteryPulsatilityIndex < 1.0
                        ? 'text-rose-400'
                        : evaluation.pulmonaryArteryPulsatilityIndex < 2.0
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {evaluation.pulmonaryArteryPulsatilityIndex}
                  </span>
                </div>
                <div className="text-[10px] text-zinc-500 mt-1">
                  Formula: (sPAP &minus; dPAP) / RAP
                </div>
                <p className="text-[9px] text-zinc-500 font-sans mt-1">
                  &lt; 1.0 indicates severe RV failure, warning against isolated LVAD implantation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum Pearls (3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs uppercase tracking-wider">
            <Wind className="w-4 h-4" /> 1. Fick Principle Thermodynamics
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            The Fick principle is the gold standard for cardiac output measurement, particularly in low-output states and severe tricuspid regurgitation where thermodilution is notoriously unreliable. Oxygen consumption (VO2) divided by the arteriovenous oxygen difference (C(a-v)O2 = 1.34 &times; Hb &times; [SaO2 &minus; SvO2]) yields total pulmonary blood flow without dye or thermal dissipation artifacts.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" /> 2. 2022 ESC/ERS PH Definition
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            The 2022 ESC/ERS guidelines redefined pulmonary hypertension as resting mean pulmonary arterial pressure mPAP &gt; 20 mmHg (lowered from 25 mmHg). Pre-capillary PH requires mPAP &gt; 20 mmHg, normal wedge PAWP &le; 15 mmHg, AND elevated pulmonary vascular resistance PVR &gt; 2.0 Wood Units (lowered from 3.0 WU). Isolated post-capillary PH requires PAWP &gt; 15 mmHg and PVR &le; 2.0 WU.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs uppercase tracking-wider">
            <Zap className="w-4 h-4" /> 3. Vasoreactivity &amp; Sitbon Protocol
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Acute vasoreactivity testing is mandatory for all patients with idiopathic, heritable, or drug-induced PAH. Administer 20 ppm inhaled Nitric Oxide (or Iloprost) for 10 minutes. A positive response (Sitbon criteria) requires a drop in mPAP of &ge;10 mmHg to reach an absolute value &le;40 mmHg with stable or increased CO. Only ~10% of patients respond, identifying those eligible for high-dose Calcium Channel Blocker monotherapy.
          </p>
        </div>
      </div>
    </div>
  );
}
