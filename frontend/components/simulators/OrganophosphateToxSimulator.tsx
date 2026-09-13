'use client';

import React, { useState, useMemo } from 'react';
import {
  Skull,
  Activity,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Flame,
  Droplets,
  Zap,
  Gauge,
  Heart,
  Sparkles,
  Info,
  RefreshCw,
  AlertOctagon,
  Timer,
  Syringe,
  Wind,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';
import {
  calculateAcheAging,
  evaluateAtropinization,
  calculatePralidoximeDosing,
  assessIntermediateSyndromeRisk,
  OP_SCENARIOS,
  ToxinClass,
  PatientToxState,
} from '../../.gemini/skills/OrganophosphateToxEngine';

export default function OrganophosphateToxSimulator() {
  const [selectedScenarioKey, setSelectedScenarioKey] = useState<string>('severe_malathion_ingestion');
  const scenario = OP_SCENARIOS[selectedScenarioKey] || OP_SCENARIOS.severe_malathion_ingestion;

  // Clinical & Toxicological State
  const [toxinName, setToxinName] = useState<string>(scenario.initialState.toxinName);
  const [toxinClass, setToxinClass] = useState<ToxinClass>(scenario.initialState.toxinClass);
  const [exposureHoursAgo, setExposureHoursAgo] = useState<number>(scenario.initialState.exposureHoursAgo);
  const [plasmaAche, setPlasmaAche] = useState<number>(scenario.initialState.plasmaAcheActivityPercent);
  const [rbcAche, setRbcAche] = useState<number>(scenario.initialState.rbcAcheActivityPercent);

  // Vitals & Muscarinic Signs
  const [heartRate, setHeartRate] = useState<number>(scenario.initialState.heartRateBpm);
  const [systolicBp, setSystolicBp] = useState<number>(scenario.initialState.systolicBpMmHg);
  const [respiratoryRate, setRespiratoryRate] = useState<number>(scenario.initialState.respiratoryRateBpm);
  const [spo2, setSpo2] = useState<number>(scenario.initialState.spo2Percent);
  const [bronchorrhea, setBronchorrhea] = useState<'none' | 'mild' | 'moderate' | 'massive'>(
    scenario.initialState.bronchorrheaSeverity
  );
  const [wheezing, setWheezing] = useState<boolean>(scenario.initialState.wheezingBronchospasm);
  const [pupilDiameter, setPupilDiameter] = useState<number>(scenario.initialState.pupilDiameterMm);
  const [axillaeMoisture, setAxillaeMoisture] = useState<'dry' | 'moist' | 'drenching_sweat'>(
    scenario.initialState.axillaeMoisture
  );

  // Nicotinic & CNS Signs
  const [fasciculations, setFasciculations] = useState<'none' | 'mild' | 'moderate' | 'generalized'>(
    scenario.initialState.fasciculationsSeverity
  );
  const [diaphragmStrength, setDiaphragmStrength] = useState<number>(
    scenario.initialState.diaphragmStrengthPercent
  );
  const [seizureActivity, setSeizureActivity] = useState<boolean>(scenario.initialState.seizureActivity);

  // Therapeutics
  const [cumulativeAtropine, setCumulativeAtropine] = useState<number>(scenario.initialState.cumulativeAtropineMg);
  const [pralidoximeInfused, setPralidoximeInfused] = useState<number>(scenario.initialState.pralidoximeInfusedGrams);

  // Scenario Loader
  const handleLoadScenario = (key: string) => {
    setSelectedScenarioKey(key);
    const sc = OP_SCENARIOS[key];
    if (!sc) return;

    setToxinName(sc.initialState.toxinName);
    setToxinClass(sc.initialState.toxinClass);
    setExposureHoursAgo(sc.initialState.exposureHoursAgo);
    setPlasmaAche(sc.initialState.plasmaAcheActivityPercent);
    setRbcAche(sc.initialState.rbcAcheActivityPercent);
    setHeartRate(sc.initialState.heartRateBpm);
    setSystolicBp(sc.initialState.systolicBpMmHg);
    setRespiratoryRate(sc.initialState.respiratoryRateBpm);
    setSpo2(sc.initialState.spo2Percent);
    setBronchorrhea(sc.initialState.bronchorrheaSeverity);
    setWheezing(sc.initialState.wheezingBronchospasm);
    setPupilDiameter(sc.initialState.pupilDiameterMm);
    setAxillaeMoisture(sc.initialState.axillaeMoisture);
    setFasciculations(sc.initialState.fasciculationsSeverity);
    setDiaphragmStrength(sc.initialState.diaphragmStrengthPercent);
    setSeizureActivity(sc.initialState.seizureActivity);
    setCumulativeAtropine(sc.initialState.cumulativeAtropineMg);
    setPralidoximeInfused(sc.initialState.pralidoximeInfusedGrams);
  };

  // Compile Current Patient State
  const currentPatientState: PatientToxState = useMemo(
    () => ({
      toxinName,
      toxinClass,
      exposureHoursAgo,
      plasmaAcheActivityPercent: plasmaAche,
      rbcAcheActivityPercent: rbcAche,
      heartRateBpm: heartRate,
      systolicBpMmHg: systolicBp,
      respiratoryRateBpm: respiratoryRate,
      spo2Percent: spo2,
      bronchorrheaSeverity: bronchorrhea,
      wheezingBronchospasm: wheezing,
      pupilDiameterMm: pupilDiameter,
      axillaeMoisture,
      fasciculationsSeverity: fasciculations,
      diaphragmStrengthPercent: diaphragmStrength,
      seizureActivity,
      cumulativeAtropineMg: cumulativeAtropine,
      pralidoximeInfusedGrams: pralidoximeInfused,
    }),
    [
      toxinName,
      toxinClass,
      exposureHoursAgo,
      plasmaAche,
      rbcAche,
      heartRate,
      systolicBp,
      respiratoryRate,
      spo2,
      bronchorrhea,
      wheezing,
      pupilDiameter,
      axillaeMoisture,
      fasciculations,
      diaphragmStrength,
      seizureActivity,
      cumulativeAtropine,
      pralidoximeInfused,
    ]
  );

  // Engine Calculations
  const agingReport = useMemo(
    () => calculateAcheAging(toxinClass, exposureHoursAgo),
    [toxinClass, exposureHoursAgo]
  );

  const atropinizationReport = useMemo(
    () => evaluateAtropinization(currentPatientState),
    [currentPatientState]
  );

  const pralidoximeReport = useMemo(
    () => calculatePralidoximeDosing(toxinClass, agingReport, fasciculations, diaphragmStrength),
    [toxinClass, agingReport, fasciculations, diaphragmStrength]
  );

  const imsRiskReport = useMemo(
    () => assessIntermediateSyndromeRisk(toxinClass, exposureHoursAgo, rbcAche),
    [toxinClass, exposureHoursAgo, rbcAche]
  );

  // Interactive Atropine Administration
  const handleAdministerDoubledAtropine = () => {
    const doseToAdd = atropinizationReport.recommendedNextAtropineDoseMg;
    const newTotal = cumulativeAtropine + doseToAdd;
    setCumulativeAtropine(newTotal);

    // Simulate clinical response to therapeutic atropine dose:
    if (newTotal >= 14 || doseToAdd >= 8) {
      setBronchorrhea('none');
      setWheezing(false);
      setHeartRate((prev) => Math.max(88, prev + 25));
      setSystolicBp((prev) => Math.max(90, prev + 20));
      setAxillaeMoisture('dry');
    } else if (newTotal >= 6) {
      setBronchorrhea('mild');
      setHeartRate((prev) => Math.max(72, prev + 18));
      setSystolicBp((prev) => Math.max(82, prev + 12));
      setAxillaeMoisture('moist');
    } else {
      setHeartRate((prev) => prev + 8);
      setSystolicBp((prev) => prev + 6);
    }
  };

  const handleResetAtropine = () => {
    setCumulativeAtropine(0);
    setBronchorrhea(scenario.initialState.bronchorrheaSeverity);
    setWheezing(scenario.initialState.wheezingBronchospasm);
    setHeartRate(scenario.initialState.heartRateBpm);
    setSystolicBp(scenario.initialState.systolicBpMmHg);
    setAxillaeMoisture(scenario.initialState.axillaeMoisture);
  };

  const handleInfusePralidoxime = () => {
    setPralidoximeInfused((prev) => prev + 2.0);
    if (agingReport.reactivatableFractionPercent > 30) {
      setFasciculations('none');
      setDiaphragmStrength((prev) => Math.min(95, prev + 35));
      setRbcAche((prev) => Math.min(75, prev + 25));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Skull className="w-5 h-5" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Medical Toxicology & Resuscitation Suite
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Organophosphate & Carbamate Toxicology Workstation
            </h1>
            <p className="text-sm text-slate-400 max-w-3xl">
              Biophysical simulation of Acetylcholinesterase (AChE) inhibition, covalent aging kinetics,
              the muscarinic Killer B&apos;s vs nicotinic NMJ collapse, Atropine doubling resuscitation endpoints,
              Pralidoxime (2-PAM) reactivation, and delayed Intermediate Syndrome (IMS).
            </p>
          </div>

          {/* Quick Status Pill */}
          <div className="flex items-center gap-3">
            <div
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 ${
                atropinizationReport.isFullyAtropinized
                  ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                  : 'bg-rose-950/60 border-rose-800 text-rose-300'
              }`}
            >
              {atropinizationReport.isFullyAtropinized ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Fully Atropinized
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
                  Killer B&apos;s Active (Under-Atropinized)
                </>
              )}
            </div>
            <div className="px-3 py-1.5 rounded-lg border bg-slate-800/80 border-slate-700 text-xs font-mono text-cyan-300">
              AChE Aging: {agingReport.estimatedAgingPercent}%
            </div>
          </div>
        </div>

        {/* Clinical Scenario Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80">
          <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            Standard Toxicological Case Scenarios:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2">
            {Object.entries(OP_SCENARIOS).map(([key, sc]) => {
              const isSelected = selectedScenarioKey === key;
              return (
                <button
                  key={key}
                  onClick={() => handleLoadScenario(key)}
                  className={`px-3 py-2 text-left rounded-xl border text-xs transition-all ${
                    isSelected
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200 shadow-md ring-1 ring-emerald-500/30'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="font-semibold truncate">{sc.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 truncate">{sc.toxinName}</div>
                </button>
              );
            })}
          </div>
          <div className="mt-3 p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/50 text-xs text-slate-300">
            <span className="font-semibold text-amber-300">Case Vignette: </span>
            {scenario.patientSummary}
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Toxin Dynamics & Clinical Status Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Toxin Identity & Exposure Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Skull className="w-4 h-4 text-emerald-400" />
                Xenobiotic Profile & Kinetics
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                {toxinClass}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Toxin Agent Name</label>
                <input
                  type="text"
                  value={toxinName}
                  onChange={(e) => setToxinName(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Elapsed Time Since Exposure</span>
                  <span className="font-mono text-cyan-300">{exposureHoursAgo} hours</span>
                </div>
                <input aria-label="Elapsed Time Since Exposure"
                  type="range"
                  min="0.5"
                  max="96"
                  step="0.5"
                  value={exposureHoursAgo}
                  onChange={(e) => setExposureHoursAgo(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">RBC AChE Activity</span>
                    <span className="font-mono text-emerald-300">{rbcAche}%</span>
                  </div>
                  <input aria-label="RBC AChE Activity"
                    type="range"
                    min="1"
                    max="100"
                    value={rbcAche}
                    onChange={(e) => setRbcAche(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <span className="text-[10px] text-slate-500">Synaptic surrogate (nl &gt; 80%)</span>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Plasma BuChE Activity</span>
                    <span className="font-mono text-cyan-300">{plasmaAche}%</span>
                  </div>
                  <input aria-label="Plasma BuChE Activity"
                    type="range"
                    min="1"
                    max="100"
                    value={plasmaAche}
                    onChange={(e) => setPlasmaAche(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <span className="text-[10px] text-slate-500">Hepatic pseudocholinesterase</span>
                </div>
              </div>
            </div>
          </div>

          {/* Vitals & Muscarinic Syndromic Examination */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-cyan-400" />
                Vitals & Killer B&apos;s Muscarinic Status
              </h2>
              <span className="text-xs text-rose-400 font-mono">D.U.M.B.E.L.S.</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Heart Rate</span>
                  <span className={`font-mono ${heartRate < 60 ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>
                    {heartRate} bpm
                  </span>
                </div>
                <input aria-label="Heart Rate"
                  type="range"
                  min="30"
                  max="160"
                  value={heartRate}
                  onChange={(e) => setHeartRate(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Systolic BP</span>
                  <span className={`font-mono ${systolicBp < 80 ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>
                    {systolicBp} mmHg
                  </span>
                </div>
                <input aria-label="Systolic BP"
                  type="range"
                  min="50"
                  max="160"
                  value={systolicBp}
                  onChange={(e) => setSystolicBp(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Resp Rate</span>
                  <span className="font-mono text-slate-200">{respiratoryRate} /min</span>
                </div>
                <input aria-label="Resp Rate"
                  type="range"
                  min="8"
                  max="50"
                  value={respiratoryRate}
                  onChange={(e) => setRespiratoryRate(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">SpO2</span>
                  <span className={`font-mono ${spo2 < 90 ? 'text-rose-400 font-bold' : 'text-emerald-400'}`}>
                    {spo2}%
                  </span>
                </div>
                <input aria-label="SpO2"
                  type="range"
                  min="60"
                  max="100"
                  value={spo2}
                  onChange={(e) => setSpo2(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </div>

            {/* Secretions & Bronchial Mechanics */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Bronchorrhea (Pulmonary Alveolar Secretions)
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['none', 'mild', 'moderate', 'massive'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setBronchorrhea(lvl)}
                      className={`px-2 py-1 rounded text-xs capitalize transition ${
                        bronchorrhea === lvl
                          ? lvl === 'none'
                            ? 'bg-emerald-700 text-white font-semibold'
                            : 'bg-rose-600 text-white font-semibold'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/40 border border-slate-700/50">
                <span className="text-xs text-slate-300">Wheezing & Bronchospasm Present</span>
                <input
                  type="checkbox"
                  checked={wheezing}
                  onChange={(e) => setWheezing(e.target.checked)}
                  className="w-4 h-4 accent-rose-500 rounded"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Axillary Moisture</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['dry', 'moist', 'drenching_sweat'] as const).map((moisture) => (
                    <button
                      key={moisture}
                      onClick={() => setAxillaeMoisture(moisture)}
                      className={`px-2 py-1 rounded text-xs capitalize transition ${
                        axillaeMoisture === moisture
                          ? moisture === 'dry'
                            ? 'bg-emerald-700 text-white font-semibold'
                            : 'bg-amber-600 text-white font-semibold'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {moisture.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pupil Diameter with Amber Alert */}
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-semibold">Pupil Diameter</span>
                  <span className="font-mono text-amber-300">{pupilDiameter.toFixed(1)} mm</span>
                </div>
                <input aria-label="Pupil Diameter"
                  type="range"
                  min="1.0"
                  max="8.0"
                  step="0.5"
                  value={pupilDiameter}
                  onChange={(e) => setPupilDiameter(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex items-start gap-2 text-[11px] text-amber-300/90 bg-amber-950/40 border border-amber-800/60 rounded-lg p-2">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-400" />
                  <span>
                    <strong>Caution:</strong> Pupil dilation is <em>NOT</em> an endpoint for atropinization! Dosing to
                    mydriasis induces fatal anticholinergic hyperthermia.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Nicotinic NMJ & CNS Manifestations */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Nicotinic Motor Endplate & CNS Toxicity
            </h2>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Muscle Fasciculations Severity</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['none', 'mild', 'moderate', 'generalized'] as const).map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setFasciculations(sev)}
                    className={`px-2 py-1 rounded text-xs capitalize transition ${
                      fasciculations === sev
                        ? sev === 'none'
                          ? 'bg-emerald-700 text-white font-semibold'
                          : 'bg-amber-600 text-white font-semibold'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Diaphragm Motor Strength</span>
                <span className={`font-mono ${diaphragmStrength < 50 ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>
                  {diaphragmStrength}%
                </span>
              </div>
              <input aria-label="Diaphragm Motor Strength"
                type="range"
                min="10"
                max="100"
                value={diaphragmStrength}
                onChange={(e) => setDiaphragmStrength(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <span className="text-[10px] text-slate-500">Below 50% triggers acute ventilatory failure</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/40 border border-slate-700/50">
              <span className="text-xs text-slate-300">Central Seizure Activity (GABA Inactivation)</span>
              <input
                type="checkbox"
                checked={seizureActivity}
                onChange={(e) => setSeizureActivity(e.target.checked)}
                className="w-4 h-4 accent-rose-500 rounded"
              />
            </div>
            {seizureActivity && (
              <div className="text-[11px] text-rose-300 bg-rose-950/40 border border-rose-800/60 rounded-lg p-2 flex items-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                <span>Administer Midazolam 10 mg IV/IM or Diazepam 10-20 mg IV immediately!</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Therapeutics, Endpoints & Kinetics (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Atropine Titration Bench & Doubling Protocol */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <Syringe className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-white">Atropine Doubling Protocol & Endpoints</h2>
                  <p className="text-xs text-slate-400">Titrate to pulmonary secretion clearance (Eddleston 2008)</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">Cumulative Atropine</div>
                <div className="text-xl font-mono font-bold text-emerald-400">{cumulativeAtropine} mg</div>
              </div>
            </div>

            {/* Atropinization Clinical Checklist (5 Endpoints) */}
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/80 space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                The 5 Classical Atropinization Endpoints:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div
                  className={`flex items-center gap-2 p-2 rounded-lg border ${
                    atropinizationReport.clearLungsAchieved
                      ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                      : 'bg-rose-950/30 border-rose-900 text-rose-300'
                  }`}
                >
                  {atropinizationReport.clearLungsAchieved ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  )}
                  <span>1. Clear Lungs (No bronchorrhea / wheezing)</span>
                </div>

                <div
                  className={`flex items-center gap-2 p-2 rounded-lg border ${
                    atropinizationReport.heartRateAdequate
                      ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                      : 'bg-rose-950/30 border-rose-900 text-rose-300'
                  }`}
                >
                  {atropinizationReport.heartRateAdequate ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  )}
                  <span>2. Heart Rate &ge; 80 bpm ({heartRate} bpm)</span>
                </div>

                <div
                  className={`flex items-center gap-2 p-2 rounded-lg border ${
                    atropinizationReport.bloodPressureAdequate
                      ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                      : 'bg-rose-950/30 border-rose-900 text-rose-300'
                  }`}
                >
                  {atropinizationReport.bloodPressureAdequate ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  )}
                  <span>3. Systolic BP &ge; 80 mmHg ({systolicBp} mmHg)</span>
                </div>

                <div
                  className={`flex items-center gap-2 p-2 rounded-lg border ${
                    atropinizationReport.dryAxillaeAchieved
                      ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                      : 'bg-rose-950/30 border-rose-900 text-rose-300'
                  }`}
                >
                  {atropinizationReport.dryAxillaeAchieved ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  )}
                  <span>4. Dry Axillae ({axillaeMoisture})</span>
                </div>
              </div>
            </div>

            {/* Action Buttons & Recommendation */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Algorithmic Clinical Directive:</span>
                <span className="text-xs font-mono text-cyan-400">
                  Doubling Sequence: 2 &rarr; 4 &rarr; 8 &rarr; 16 &rarr; 32 mg
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{atropinizationReport.clinicalAction}</p>

              {atropinizationReport.isFullyAtropinized && (
                <div className="p-3 rounded-lg bg-emerald-950/50 border border-emerald-800/80 text-xs text-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Continuous IV Maintenance Infusion (10-20% load/hr):</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-300 text-sm">
                    {atropinizationReport.recommendedContinuousInfusionMgHr} mg / hour
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                {!atropinizationReport.isFullyAtropinized ? (
                  <button
                    onClick={handleAdministerDoubledAtropine}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-900/30 transition flex items-center justify-center gap-2"
                  >
                    <Syringe className="w-4 h-4" />
                    Administer Next Doubled Dose ({atropinizationReport.recommendedNextAtropineDoseMg} mg IV)
                  </button>
                ) : (
                  <button
                    onClick={handleAdministerDoubledAtropine}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-semibold text-xs transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Maintain Atropinization (Give Supplemental 2 mg)
                  </button>
                )}

                <button
                  onClick={handleResetAtropine}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Acetylcholinesterase Aging & Pralidoxime (2-PAM) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <Timer className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-base font-bold text-white">
                    AChE Covalent Aging Kinetics &amp; Oximes (2-PAM)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Irreversible dealkylation prevents nucleophilic reactivation
                  </p>
                </div>
              </div>
              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                  agingReport.oximeEfficacyRating.includes('High')
                    ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                    : agingReport.oximeEfficacyRating.includes('Moderate')
                    ? 'bg-amber-950/60 border-amber-800 text-amber-300'
                    : 'bg-rose-950/60 border-rose-800 text-rose-300'
                }`}
              >
                {agingReport.oximeEfficacyRating}
              </span>
            </div>

            {/* Aging Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-rose-400">Irreversibly Aged: {agingReport.estimatedAgingPercent}%</span>
                <span className="text-emerald-400">
                  Reactivatable: {agingReport.reactivatableFractionPercent}%
                </span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  className="bg-rose-600 transition-all duration-300"
                  style={{ width: `${agingReport.estimatedAgingPercent}%` }}
                />
                <div
                  className="bg-emerald-500 transition-all duration-300"
                  style={{ width: `${agingReport.reactivatableFractionPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Aging t1/2: {agingReport.agingHalfLifeHours} hrs</span>
                <span>First-order dealkylation rate</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              {agingReport.clinicalAgingComment}
            </p>

            {/* Pralidoxime Dosing Guidance */}
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                  <ShieldAlert className="w-4 h-4 text-purple-400" />
                  Pralidoxime (2-PAM) Regimen (WHO / Lancet Standard):
                </div>
                <span
                  className={`text-xs font-mono font-bold ${
                    pralidoximeReport.isIndicated ? 'text-purple-400' : 'text-slate-500'
                  }`}
                >
                  {pralidoximeReport.isIndicated ? 'INDICATED' : 'NOT INDICATED'}
                </span>
              </div>

              {pralidoximeReport.isIndicated ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-slate-400">IV Loading Dose</div>
                      <div className="text-base font-bold text-purple-300 font-mono">
                        {pralidoximeReport.loadingDoseGrams} g IV
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Infuse over 20-30 min</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-slate-400">Maintenance Infusion</div>
                      <div className="text-base font-bold text-cyan-300 font-mono">
                        {pralidoximeReport.maintenanceInfusionMgHr} mg / hr
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Duration: &ge; {pralidoximeReport.durationHoursRecommended} hrs
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="text-xs text-slate-400">
                      Cumulative 2-PAM Given:{' '}
                      <span className="font-mono text-purple-300 font-bold">{pralidoximeInfused} g</span>
                    </div>
                    <button
                      onClick={handleInfusePralidoxime}
                      className="py-1.5 px-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow"
                    >
                      <Syringe className="w-3.5 h-3.5" />
                      Infuse 2-PAM 2.0 g
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">{pralidoximeReport.rationale}</p>
              )}
            </div>
          </div>

          {/* Intermediate Syndrome (IMS) Surveillance Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Wind className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-base font-bold text-white">Intermediate Syndrome (IMS) Surveillance</h2>
                  <p className="text-xs text-slate-400">Delayed post-synaptic neuromuscular junction failure</p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                  imsRiskReport.imsRiskLevel === 'High'
                    ? 'bg-rose-950/70 border-rose-800 text-rose-300'
                    : imsRiskReport.imsRiskLevel === 'Moderate'
                    ? 'bg-amber-950/70 border-amber-800 text-amber-300'
                    : 'bg-emerald-950/70 border-emerald-800 text-emerald-300'
                }`}
              >
                {imsRiskReport.imsRiskLevel} IMS Risk
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span className="font-semibold">Onset Latency:</span>
                <span className="font-mono text-cyan-300">{imsRiskReport.onsetWindowHours}</span>
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-slate-300">Cardinal Presentations:</span>
                <ul className="list-disc pl-4 space-y-1 text-slate-400">
                  {imsRiskReport.manifestations.map((man, i) => (
                    <li key={i} className="leading-snug">
                      {man}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-2 border-t border-slate-800 text-amber-300/90 font-medium">
                <strong>ICU Mandate: </strong>
                {imsRiskReport.monitoringMandate}
              </div>
            </div>

            {/* Teaching Pearl Banner */}
            <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/50 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300">
                <Sparkles className="w-3.5 h-3.5" />
                Scenario Pearls ({scenario.name}):
              </div>
              <ul className="list-disc pl-4 space-y-1 text-xs text-slate-300">
                {scenario.clinicalPearls.map((pearl, i) => (
                  <li key={i}>{pearl}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
