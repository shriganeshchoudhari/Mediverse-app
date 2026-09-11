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
  Heart,
  Stethoscope,
  Pill,
  Info,
} from 'lucide-react';
import {
  AcutePancreatitisPatientInput,
  ResuscitationFluidType,
  evaluatePancreatitisCase,
  PANCREATITIS_PRESETS,
} from '../../.gemini/skills/AcutePancreatitisEngine';

export default function AcutePancreatitisSimulator() {
  // Diagnostic Triad
  const [typicalPain, setTypicalPain] = useState<boolean>(true);
  const [lipaseUln, setLipaseUln] = useState<number>(8.5);
  const [imagingConsistent, setImagingConsistent] = useState<boolean>(true);

  // Modified Marshall Parameters
  const [pfRatio, setPfRatio] = useState<number>(440);
  const [creatinine, setCreatinine] = useState<number>(0.9);
  const [sbp, setSbp] = useState<number>(124);
  const [fluidResponsive, setFluidResponsive] = useState<boolean>(true);
  const [ph, setPh] = useState<number>(7.41);
  const [failureHours, setFailureHours] = useState<number>(0);

  // Complications
  const [localComplications, setLocalComplications] = useState<boolean>(false);
  const [systemicComorbidity, setSystemicComorbidity] = useState<boolean>(false);
  const [infectedNecrosis, setInfectedNecrosis] = useState<boolean>(false);

  // BISAP Parameters
  const [bun, setBun] = useState<number>(14);
  const [gcs, setGcs] = useState<number>(15);
  const [sirsCount, setSirsCount] = useState<number>(1);
  const [age, setAge] = useState<number>(42);
  const [effusion, setEffusion] = useState<boolean>(false);

  // Resuscitation & Fluid Parameters
  const [hct, setHct] = useState<number>(39);
  const [weightKg, setWeightKg] = useState<number>(75);
  const [uop, setUop] = useState<number>(0.8);
  const [overloadSigns, setOverloadSigns] = useState<boolean>(false);
  const [activeInfusionRate, setActiveInfusionRate] = useState<number>(120);
  const [fluidType, setFluidType] = useState<ResuscitationFluidType>('LACTATED_RINGERS');

  const currentInput: AcutePancreatitisPatientInput = useMemo(
    () => ({
      typicalEpigastricPain: typicalPain,
      serumLipaseUlnRatio: lipaseUln,
      imagingConsistent,
      pao2Fio2Ratio: pfRatio,
      serumCreatinineMgDl: creatinine,
      systolicBpMmHg: sbp,
      systolicBpFluidResponsive: fluidResponsive,
      arterialBloodPh: ph,
      organFailureDurationHours: failureHours,
      localComplicationsPresent: localComplications,
      systemicComorbidityExacerbation: systemicComorbidity,
      infectedPancreaticNecrosisSuspected: infectedNecrosis,
      serumBunMgDl: bun,
      gcsScore: gcs,
      sirsCriteriaMetCount: sirsCount,
      patientAgeYears: age,
      pleuralEffusionPresent: effusion,
      hematocritPercent: hct,
      patientWeightKg: weightKg,
      hourlyUrineOutputMlKgH: uop,
      clinicalFluidOverloadSigns: overloadSigns,
      activeHourlyInfusionMlH: activeInfusionRate,
      selectedFluidType: fluidType,
    }),
    [
      typicalPain,
      lipaseUln,
      imagingConsistent,
      pfRatio,
      creatinine,
      sbp,
      fluidResponsive,
      ph,
      failureHours,
      localComplications,
      systemicComorbidity,
      infectedNecrosis,
      bun,
      gcs,
      sirsCount,
      age,
      effusion,
      hct,
      weightKg,
      uop,
      overloadSigns,
      activeInfusionRate,
      fluidType,
    ]
  );

  const metrics = useMemo(() => evaluatePancreatitisCase(currentInput), [currentInput]);

  const applyPreset = (presetId: string) => {
    const p = PANCREATITIS_PRESETS.find((item) => item.id === presetId);
    if (!p) return;
    setTypicalPain(p.input.typicalEpigastricPain);
    setLipaseUln(p.input.serumLipaseUlnRatio);
    setImagingConsistent(p.input.imagingConsistent);
    setPfRatio(p.input.pao2Fio2Ratio);
    setCreatinine(p.input.serumCreatinineMgDl);
    setSbp(p.input.systolicBpMmHg);
    setFluidResponsive(p.input.systolicBpFluidResponsive);
    setPh(p.input.arterialBloodPh);
    setFailureHours(p.input.organFailureDurationHours);
    setLocalComplications(p.input.localComplicationsPresent);
    setSystemicComorbidity(p.input.systemicComorbidityExacerbation);
    setInfectedNecrosis(p.input.infectedPancreaticNecrosisSuspected);
    setBun(p.input.serumBunMgDl);
    setGcs(p.input.gcsScore);
    setSirsCount(p.input.sirsCriteriaMetCount);
    setAge(p.input.patientAgeYears);
    setEffusion(p.input.pleuralEffusionPresent);
    setHct(p.input.hematocritPercent);
    setWeightKg(p.input.patientWeightKg);
    setUop(p.input.hourlyUrineOutputMlKgH);
    setOverloadSigns(p.input.clinicalFluidOverloadSigns);
    setActiveInfusionRate(p.input.activeHourlyInfusionMlH);
    setFluidType(p.input.selectedFluidType);
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
              <span>Gastroenterology & Critical Care</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <Activity className="w-8 h-8 text-amber-500 animate-pulse" />
              Acute Pancreatitis, Revised Atlanta & WATERFALL Resuscitation Workstation
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Precision severity stratifier (Atlanta 2012 / Modified Marshall), BISAP mortality calculator, WATERFALL goal-directed fluid resuscitator, and antimicrobial stewardship engine.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-950/80 border border-amber-500/40 text-amber-300 rounded-full text-xs font-semibold">
              Revised Atlanta &amp; BISAP
            </span>
            <span className="px-3 py-1 bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 rounded-full text-xs font-semibold">
              NEJM WATERFALL Protocol
            </span>
            <span className="px-3 py-1 bg-purple-950/80 border border-purple-500/40 text-purple-300 rounded-full text-xs font-semibold">
              Track A53
            </span>
          </div>
        </div>

        {/* Clinical Presets */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Standard Clinical Cases & Scenarios
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {PANCREATITIS_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => applyPreset(p.id)}
                className="text-left p-3 rounded-lg border border-slate-800 bg-slate-950/60 hover:border-amber-500/50 hover:bg-slate-800/60 transition group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-200 group-hover:text-amber-400">
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

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Diagnostic Triad Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-emerald-400" />
                  Diagnostic Triad (Need &ge; 2 of 3)
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  metrics.diagnosticTriadMet ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-rose-950 text-rose-300 border border-rose-800'
                }`}>
                  {metrics.triadCriteriaCount}/3 Criteria Met
                </span>
              </h2>

              <div className="space-y-2.5">
                <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 cursor-pointer hover:border-slate-700">
                  <span className="text-xs text-slate-300">1. Characteristic Epigastric Pain (Radiating to Back)</span>
                  <input
                    type="checkbox"
                    checked={typicalPain}
                    onChange={(e) => setTypicalPain(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                </label>

                <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>2. Serum Lipase / Amylase:</span>
                    <span className={`font-mono font-bold ${lipaseUln >= 3.0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {lipaseUln.toFixed(1)}x ULN {lipaseUln >= 3.0 ? '(Diagnostic ≥ 3x)' : '(< 3x)'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="15.0"
                    step="0.5"
                    value={lipaseUln}
                    onChange={(e) => setLipaseUln(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 cursor-pointer hover:border-slate-700">
                  <span className="text-xs text-slate-300">3. Imaging Consistent (CT / MRI / Ultrasound)</span>
                  <input
                    type="checkbox"
                    checked={imagingConsistent}
                    onChange={(e) => setImagingConsistent(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                </label>
              </div>

              {/* Complications Toggles */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="text-xs font-semibold text-slate-400 uppercase">Complications &amp; Comorbidities:</div>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <label className="flex items-center justify-between p-2 rounded bg-slate-950/40 border border-slate-800 cursor-pointer">
                    <span className="text-slate-300">Local Complication (Collection/Necrosis)</span>
                    <input
                      type="checkbox"
                      checked={localComplications}
                      onChange={(e) => setLocalComplications(e.target.checked)}
                      className="w-4 h-4 accent-amber-500 rounded"
                    />
                  </label>
                  <label className="flex items-center justify-between p-2 rounded bg-slate-950/40 border border-slate-800 cursor-pointer">
                    <span className="text-slate-300">Preexisting Comorbidity Exacerbation</span>
                    <input
                      type="checkbox"
                      checked={systemicComorbidity}
                      onChange={(e) => setSystemicComorbidity(e.target.checked)}
                      className="w-4 h-4 accent-amber-500 rounded"
                    />
                  </label>
                  <label className="flex items-center justify-between p-2 rounded bg-slate-950/40 border border-slate-800 cursor-pointer">
                    <span className="text-rose-300 font-semibold">Infected Necrosis Suspected (Gas on CT / FNA)</span>
                    <input
                      type="checkbox"
                      checked={infectedNecrosis}
                      onChange={(e) => setInfectedNecrosis(e.target.checked)}
                      className="w-4 h-4 accent-rose-500 rounded"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Modified Marshall Organ Failure Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-rose-400" />
                  Modified Marshall Scoring Inputs
                </span>
                <span className="text-xs text-slate-400 font-mono">Score &ge; 2 = Failure</span>
              </h2>

              {/* Respiratory PaO2/FiO2 */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                  <span>Respiratory (PaO2/FiO2):</span>
                  <span className={`font-mono font-bold ${pfRatio <= 300 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {pfRatio} {pfRatio <= 300 ? `(Score ${metrics.marshall.respiratoryScore})` : '(Normal)'}
                  </span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="480"
                  step="10"
                  value={pfRatio}
                  onChange={(e) => setPfRatio(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              {/* Renal Creatinine */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                  <span>Renal (Serum Creatinine):</span>
                  <span className={`font-mono font-bold ${creatinine >= 1.9 ? 'text-rose-400' : 'text-slate-300'}`}>
                    {creatinine.toFixed(1)} mg/dL {creatinine >= 1.9 ? `(Score ${metrics.marshall.renalScore})` : ''}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="6.0"
                  step="0.1"
                  value={creatinine}
                  onChange={(e) => setCreatinine(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              {/* Cardiovascular SBP */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                  <span>Cardiovascular (Systolic BP):</span>
                  <span className={`font-mono font-bold ${sbp < 90 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {sbp} mmHg {sbp < 90 ? `(Score ${metrics.marshall.cardiovascularScore})` : ''}
                  </span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="160"
                  step="2"
                  value={sbp}
                  onChange={(e) => setSbp(Number(e.target.value))}
                  className="w-full accent-rose-500"
                />
              </div>

              {/* SBP Fluid Responsiveness & pH */}
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center justify-between p-2 rounded bg-slate-950/50 border border-slate-800 cursor-pointer">
                  <span className="text-[11px] text-slate-300">SBP Fluid Responsive</span>
                  <input
                    type="checkbox"
                    checked={fluidResponsive}
                    onChange={(e) => setFluidResponsive(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                </label>
                <div>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                    <span>Arterial pH:</span>
                    <span className="font-mono text-purple-400 font-bold">{ph.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="7.10"
                    max="7.46"
                    step="0.01"
                    value={ph}
                    onChange={(e) => setPh(Number(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                </div>
              </div>

              {/* Duration of Organ Failure */}
              <div className="pt-2 border-t border-slate-800">
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                  <span>Organ Failure Duration:</span>
                  <span className={`font-mono font-bold ${failureHours >= 48 ? 'text-rose-400' : 'text-amber-400'}`}>
                    {failureHours} hours {failureHours >= 48 ? '(Persistent ≥ 48h → Severe)' : '(Transient < 48h)'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="96"
                  step="6"
                  value={failureHours}
                  onChange={(e) => setFailureHours(Number(e.target.value))}
                  className="w-full accent-rose-500"
                />
              </div>
            </div>

            {/* BISAP & Resuscitation Inputs */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                <Droplets className="w-4 h-4 text-cyan-400" />
                BISAP &amp; Resuscitation Hemodynamics
              </h2>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>BUN:</span>
                    <span className={`font-mono font-bold ${bun > 25 ? 'text-rose-400' : 'text-slate-300'}`}>
                      {bun} mg/dL
                    </span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="60"
                    step="1"
                    value={bun}
                    onChange={(e) => setBun(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>Hematocrit:</span>
                    <span className={`font-mono font-bold ${hct > 44 ? 'text-rose-400' : 'text-cyan-400'}`}>
                      {hct}% {hct > 44 ? '(Hemoconc)' : ''}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="25"
                    max="55"
                    step="1"
                    value={hct}
                    onChange={(e) => setHct(Number(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>SIRS Criteria Met:</span>
                    <span className="font-mono text-amber-400 font-bold">{sirsCount} / 4</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    step="1"
                    value={sirsCount}
                    onChange={(e) => setSirsCount(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>GCS Score:</span>
                    <span className="font-mono text-blue-400 font-bold">{gcs} / 15</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="15"
                    step="1"
                    value={gcs}
                    onChange={(e) => setGcs(Number(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center justify-between p-2 rounded bg-slate-950/50 border border-slate-800 cursor-pointer">
                  <span className="text-xs text-slate-300">Pleural Effusion (CXR)</span>
                  <input
                    type="checkbox"
                    checked={effusion}
                    onChange={(e) => setEffusion(e.target.checked)}
                    className="w-4 h-4 accent-cyan-500 rounded"
                  />
                </label>
                <label className="flex items-center justify-between p-2 rounded bg-slate-950/50 border border-rose-800/60 cursor-pointer">
                  <span className="text-xs text-rose-300 font-semibold">Fluid Overload Signs</span>
                  <input
                    type="checkbox"
                    checked={overloadSigns}
                    onChange={(e) => setOverloadSigns(e.target.checked)}
                    className="w-4 h-4 accent-rose-500 rounded"
                  />
                </label>
              </div>

              {/* Patient Weight, Active Rate & Fluid Selection */}
              <div className="pt-2 border-t border-slate-800 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                      <span>Weight:</span>
                      <span className="font-mono text-slate-300">{weightKg} kg</span>
                    </div>
                    <input
                      type="range"
                      min="45"
                      max="120"
                      step="1"
                      value={weightKg}
                      onChange={(e) => setWeightKg(Number(e.target.value))}
                      className="w-full accent-slate-400"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                      <span>Active IV Rate:</span>
                      <span className="font-mono text-cyan-400 font-bold">{activeInfusionRate} mL/h</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="500"
                      step="10"
                      value={activeInfusionRate}
                      onChange={(e) => setActiveInfusionRate(Number(e.target.value))}
                      className="w-full accent-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <span className="text-xs text-slate-300 block mb-1 font-semibold">Resuscitation Crystalloid Type:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFluidType('LACTATED_RINGERS')}
                      className={`p-2 rounded text-xs font-bold border transition ${
                        fluidType === 'LACTATED_RINGERS'
                          ? 'bg-emerald-950 border-emerald-500 text-emerald-200'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      Lactated Ringer's (Preferred)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFluidType('NORMAL_SALINE')}
                      className={`p-2 rounded text-xs font-bold border transition ${
                        fluidType === 'NORMAL_SALINE'
                          ? 'bg-rose-950 border-rose-500 text-rose-200'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      0.9% Normal Saline (Suboptimal)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Output Metrics & Guidelines (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Atlanta Classification */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Revised Atlanta</div>
                <div className={`text-lg font-black mt-1 ${
                  metrics.atlantaClassification === 'SEVERE'
                    ? 'text-rose-400'
                    : metrics.atlantaClassification === 'MODERATELY_SEVERE'
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}>
                  {metrics.atlantaClassification.replace(/_/g, ' ')}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Failure: {failureHours}h duration
                </div>
              </div>

              {/* Modified Marshall Score */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Marshall Score</div>
                <div className={`text-xl font-bold font-mono mt-1 ${metrics.marshall.hasOrganFailure ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {metrics.marshall.totalMarshallScore} <span className="text-xs font-normal">pts</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  {metrics.marshall.hasOrganFailure ? 'Organ Failure Present' : 'No Organ Failure'}
                </div>
              </div>

              {/* BISAP Score & Mortality */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">BISAP Score</div>
                <div className={`text-xl font-bold font-mono mt-1 ${metrics.bisapScore >= 3 ? 'text-rose-400' : 'text-amber-400'}`}>
                  {metrics.bisapScore} <span className="text-xs font-normal">/ 5</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Mortality: ~{metrics.bisapMortalityPercent}%
                </div>
              </div>

              {/* Volume Status */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Volume Status</div>
                <div className={`text-sm font-bold mt-1 ${
                  metrics.fluidResuscitationProtocol.fluidOverloadRisk === 'HIGH_OVERLOAD_DETECTED'
                    ? 'text-rose-400'
                    : metrics.isHemoconcentrated
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}>
                  {metrics.fluidResuscitationProtocol.fluidOverloadRisk === 'HIGH_OVERLOAD_DETECTED'
                    ? 'FLUID OVERLOAD'
                    : metrics.isHemoconcentrated
                    ? 'HEMOCONCENTRATED'
                    : 'EUVOLEMIC'}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Hct: {hct}% | BUN: {bun}
                </div>
              </div>
            </div>

            {/* Modified Marshall Organ Matrix */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-rose-400" />
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                    Modified Marshall Organ Failure Matrix
                  </h3>
                </div>
                <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                  metrics.marshall.hasOrganFailure
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  {metrics.marshall.hasOrganFailure ? 'ORGAN FAILURE (Score ≥ 2)' : 'NO ORGAN FAILURE'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {/* Respiratory */}
                <div className={`p-3 rounded-lg border ${
                  metrics.marshall.respiratoryScore >= 2
                    ? 'bg-rose-950/40 border-rose-700'
                    : 'bg-slate-950/60 border-slate-800'
                }`}>
                  <div className="font-bold text-slate-300 flex items-center justify-between">
                    <span>Respiratory:</span>
                    <span className="font-mono text-cyan-400">Score {metrics.marshall.respiratoryScore}</span>
                  </div>
                  <div className="text-slate-400 mt-1">
                    PaO2/FiO2: {pfRatio}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {metrics.marshall.respiratoryScore >= 2 ? 'ARDS / Acute Lung Injury' : 'Adequate Gas Exchange'}
                  </div>
                </div>

                {/* Renal */}
                <div className={`p-3 rounded-lg border ${
                  metrics.marshall.renalScore >= 2
                    ? 'bg-rose-950/40 border-rose-700'
                    : 'bg-slate-950/60 border-slate-800'
                }`}>
                  <div className="font-bold text-slate-300 flex items-center justify-between">
                    <span>Renal:</span>
                    <span className="font-mono text-amber-400">Score {metrics.marshall.renalScore}</span>
                  </div>
                  <div className="text-slate-400 mt-1">
                    Creatinine: {creatinine.toFixed(1)} mg/dL
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {metrics.marshall.renalScore >= 2 ? 'Acute Kidney Injury' : 'Preserved Renal Function'}
                  </div>
                </div>

                {/* Cardiovascular */}
                <div className={`p-3 rounded-lg border ${
                  metrics.marshall.cardiovascularScore >= 2
                    ? 'bg-rose-950/40 border-rose-700'
                    : 'bg-slate-950/60 border-slate-800'
                }`}>
                  <div className="font-bold text-slate-300 flex items-center justify-between">
                    <span>Cardiovascular:</span>
                    <span className="font-mono text-purple-400">Score {metrics.marshall.cardiovascularScore}</span>
                  </div>
                  <div className="text-slate-400 mt-1">
                    SBP: {sbp} mmHg
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {metrics.marshall.cardiovascularScore >= 2 ? 'Vasopressor Shock' : 'Hemodynamically Stable'}
                  </div>
                </div>
              </div>

              {metrics.marshall.hasOrganFailure && (
                <div className="text-xs text-rose-300 bg-rose-950/40 rounded p-2.5 border border-rose-800">
                  <span className="font-bold">Involved Domains:</span> {metrics.marshall.organFailureDomains.join(' | ')}.
                  {failureHours >= 48 ? ' Persistent for >= 48 hours confirms Severe Acute Pancreatitis (ICU admission required).' : ' Duration < 48 hours indicates Moderately Severe Acute Pancreatitis (monitor for progression).'}
                </div>
              )}
            </div>

            {/* WATERFALL Goal-Directed Resuscitation Solver */}
            <div className={`border rounded-xl p-5 space-y-4 ${
              metrics.fluidResuscitationProtocol.fluidOverloadRisk === 'HIGH_OVERLOAD_DETECTED'
                ? 'bg-rose-950/30 border-rose-500'
                : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                    WATERFALL Goal-Directed Resuscitation Plan
                  </h3>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  metrics.fluidResuscitationProtocol.fluidOverloadRisk === 'HIGH_OVERLOAD_DETECTED'
                    ? 'bg-rose-600 text-white animate-bounce'
                    : 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                }`}>
                  {metrics.fluidResuscitationProtocol.fluidOverloadRisk.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Dosing Prescription Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3">
                  <span className="text-[11px] text-slate-400 block">Recommended Crystalloid:</span>
                  <span className="text-sm font-bold text-emerald-400">
                    Lactated Ringer's
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Prevents hyperchloremic acidosis</span>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3">
                  <span className="text-[11px] text-slate-400 block">Initial Fluid Bolus (10 mL/kg):</span>
                  <span className="text-lg font-mono font-extrabold text-cyan-400">
                    {metrics.fluidResuscitationProtocol.recommendedBolusMl} <span className="text-xs font-normal">mL</span>
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {metrics.isHemoconcentrated ? 'Over 2 hours (Hemoconcentrated)' : 'None indicated (Euvolemic)'}
                  </span>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3">
                  <span className="text-[11px] text-slate-400 block">Maintenance Rate (1.5 mL/kg/h):</span>
                  <span className="text-lg font-mono font-extrabold text-amber-400">
                    {metrics.fluidResuscitationProtocol.recommendedMaintenanceMlH} <span className="text-xs font-normal">mL/h</span>
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Active: {activeInfusionRate} mL/h
                  </span>
                </div>
              </div>

              {/* Guidance Box */}
              <div className="text-xs text-slate-300 bg-slate-950/80 rounded-lg p-3 border border-slate-800 leading-relaxed space-y-1">
                <span className="font-bold text-cyan-400 block">Trial-Based Clinical Directive:</span>
                <p>{metrics.fluidResuscitationProtocol.guidance}</p>
              </div>
            </div>

            {/* Antimicrobial Stewardship & Infection Control */}
            <div className={`border rounded-xl p-5 space-y-3 ${
              metrics.antibioticIndication.indicated
                ? 'bg-purple-950/40 border-purple-600'
                : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Pill className="w-5 h-5 text-purple-400" />
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                    Antimicrobial Stewardship Directive
                  </h3>
                </div>
                <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                  metrics.antibioticIndication.indicated
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {metrics.antibioticIndication.indicated ? 'TREATMENT INDICATED' : 'PROPHYLAXIS PROHIBITED'}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {metrics.antibioticIndication.rationale}
              </p>
            </div>
          </div>
        </div>

        {/* Clinical Teaching Pearls */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Pancreatology &amp; Critical Care Practice Essentials
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-400 leading-relaxed">
            <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80">
              <h4 className="font-bold text-slate-200 mb-1">1. The WATERFALL Paradigm Shift</h4>
              <p>
                Historically, massive fluid resuscitation was aggressively prescribed. The 2022 WATERFALL trial demonstrated that aggressive hydration tripled fluid overload rates without improving outcomes. Moderate goal-directed resuscitation (10 mL/kg bolus if hypovolemic, 1.5 mL/kg/h maintenance) is now the international gold standard.
              </p>
            </div>
            <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80">
              <h4 className="font-bold text-slate-200 mb-1">2. Lactated Ringer's vs Normal Saline</h4>
              <p>
                Lactated Ringer's is superior to 0.9% Normal Saline because large NS volumes induce hyperchloremic non-anion gap metabolic acidosis. Acidosis directly triggers trypsinogen auto-activation within pancreatic acinar cells, accelerating tissue necrosis.
              </p>
            </div>
            <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80">
              <h4 className="font-bold text-slate-200 mb-1">3. The Prophylaxis Fallacy</h4>
              <p>
                Prophylactic antibiotics are strictly ineffective for preventing infected necrosis in sterile acute pancreatitis. They select for multidrug-resistant bacteria and invasive Candida superinfections. Antibiotics must be reserved exclusively for documented infected necrosis or extrapancreatic sepsis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
