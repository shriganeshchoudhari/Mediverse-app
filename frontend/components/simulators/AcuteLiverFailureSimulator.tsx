'use client';

import React, { useState, useMemo } from 'react';
import {
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
  RefreshCw,
  AlertOctagon,
  Timer,
  Syringe,
  Wind,
  ShieldCheck,
  Stethoscope,
  Brain,
  Scale,
  BedDouble,
  ChevronRight,
  Info,
} from 'lucide-react';
import {
  evaluateKingsCriteria,
  evaluateClichyCriteria,
  classifyLatencyPhenotype,
  calculateCerebralEdemaRisk,
  evaluateCoagulopathy,
  ALF_SCENARIOS,
  AlfEtiology,
  WestHavenEncephalopathyGrade,
  PatientAlfState,
} from '../../.gemini/skills/AcuteLiverFailureEngine';

export default function AcuteLiverFailureSimulator() {
  const [selectedScenarioKey, setSelectedScenarioKey] = useState<string>('severe_apap_overdose');
  const scenario = ALF_SCENARIOS[selectedScenarioKey] || ALF_SCENARIOS.severe_apap_overdose;

  // Patient Core Profile
  const [patientAge, setPatientAge] = useState<number>(scenario.initialState.patientAge);
  const [etiology, setEtiology] = useState<AlfEtiology>(scenario.initialState.etiology);
  const [latencyDays, setLatencyDays] = useState<number>(scenario.initialState.jaundiceToEncephalopathyDays);
  const [encephalopathyGrade, setEncephalopathyGrade] = useState<WestHavenEncephalopathyGrade>(
    scenario.initialState.encephalopathyGrade
  );

  // Labs & Hemodynamics
  const [arterialPh, setArterialPh] = useState<number>(scenario.initialState.arterialPh);
  const [lactate, setLactate] = useState<number>(scenario.initialState.arterialLactateMmolL);
  const [creatinine, setCreatinine] = useState<number>(scenario.initialState.serumCreatinineMgDl);
  const [inr, setInr] = useState<number>(scenario.initialState.inr);
  const [factorV, setFactorV] = useState<number>(scenario.initialState.factorVPercent);
  const [bilirubin, setBilirubin] = useState<number>(scenario.initialState.totalBilirubinMgDl);
  const [ammonia, setAmmonia] = useState<number>(scenario.initialState.arterialAmmoniaUmolL);
  const [sodium, setSodium] = useState<number>(scenario.initialState.serumSodiumMeqL);

  // Neuroprotection & Supportive Care
  const [hob30, setHob30] = useState<boolean>(scenario.initialState.headOfBedElevated30Deg);
  const [intubated, setIntubated] = useState<boolean>(scenario.initialState.intubatedAndMechanicallyVentilated);
  const [crrtActive, setCrrtActive] = useState<boolean>(scenario.initialState.crrtActive);
  const [nacActive, setNacActive] = useState<boolean>(scenario.initialState.nacInfusionActive);

  // Scenario Loader
  const handleLoadScenario = (key: string) => {
    setSelectedScenarioKey(key);
    const sc = ALF_SCENARIOS[key];
    if (!sc) return;

    setPatientAge(sc.initialState.patientAge);
    setEtiology(sc.initialState.etiology);
    setLatencyDays(sc.initialState.jaundiceToEncephalopathyDays);
    setEncephalopathyGrade(sc.initialState.encephalopathyGrade);
    setArterialPh(sc.initialState.arterialPh);
    setLactate(sc.initialState.arterialLactateMmolL);
    setCreatinine(sc.initialState.serumCreatinineMgDl);
    setInr(sc.initialState.inr);
    setFactorV(sc.initialState.factorVPercent);
    setBilirubin(sc.initialState.totalBilirubinMgDl);
    setAmmonia(sc.initialState.arterialAmmoniaUmolL);
    setSodium(sc.initialState.serumSodiumMeqL);
    setHob30(sc.initialState.headOfBedElevated30Deg);
    setIntubated(sc.initialState.intubatedAndMechanicallyVentilated);
    setCrrtActive(sc.initialState.crrtActive);
    setNacActive(sc.initialState.nacInfusionActive);
  };

  // Compile Current Patient State
  const currentState: PatientAlfState = useMemo(
    () => ({
      patientAge,
      etiology,
      jaundiceToEncephalopathyDays: latencyDays,
      encephalopathyGrade,
      arterialPh,
      arterialLactateMmolL: lactate,
      serumCreatinineMgDl: creatinine,
      inr,
      factorVPercent: factorV,
      totalBilirubinMgDl: bilirubin,
      arterialAmmoniaUmolL: ammonia,
      serumSodiumMeqL: sodium,
      headOfBedElevated30Deg: hob30,
      intubatedAndMechanicallyVentilated: intubated,
      crrtActive,
      nacInfusionActive: nacActive,
    }),
    [
      patientAge,
      etiology,
      latencyDays,
      encephalopathyGrade,
      arterialPh,
      lactate,
      creatinine,
      inr,
      factorV,
      bilirubin,
      ammonia,
      sodium,
      hob30,
      intubated,
      crrtActive,
      nacActive,
    ]
  );

  // Engine Calculations
  const kingsReport = useMemo(() => evaluateKingsCriteria(currentState), [currentState]);
  const clichyReport = useMemo(() => evaluateClichyCriteria(currentState), [currentState]);
  const latencyReport = useMemo(() => classifyLatencyPhenotype(latencyDays), [latencyDays]);
  const edemaReport = useMemo(() => calculateCerebralEdemaRisk(currentState), [currentState]);
  const coagulopathyReport = useMemo(() => evaluateCoagulopathy(currentState), [currentState]);

  // Quick Action: Apply 3% Hypertonic Saline Protocol (target sodium 148)
  const handleApplyHypertonicSaline = () => {
    setSodium(148);
  };

  // Quick Action: Initiate Emergency CRRT
  const handleToggleCrrt = () => {
    setCrrtActive((prev) => !prev);
    if (!crrtActive) {
      setAmmonia((prev) => Math.max(70, Math.round(prev * 0.65)));
    }
  };

  // Quick Action: Reset to Scenario Baseline
  const handleReset = () => {
    handleLoadScenario(selectedScenarioKey);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Activity className="w-5 h-5 animate-pulse" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Hepatology &amp; Neurocritical Care Workstation
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Acute Liver Failure (ALF), King&apos;s College &amp; Cerebral Edema Simulator
            </h1>
            <p className="text-sm text-slate-400 max-w-3xl">
              Biophysical simulation of King&apos;s College Hospital &amp; Clichy emergency liver transplantation
              criteria, hyperacute vs subacute latency kinetics, arterial ammonia astrocytic glutamine swelling,
              rebalanced hemostasis, and multimodal neuroprotective ICU protocols.
            </p>
          </div>

          {/* Quick Status Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 ${
                kingsReport.emergencyListingRecommended
                  ? 'bg-rose-950/70 border-rose-800 text-rose-300 animate-pulse'
                  : 'bg-emerald-950/70 border-emerald-800 text-emerald-300'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              {kingsReport.emergencyListingRecommended
                ? "SUPER-URGENT TRANSPLANT LISTING (King's Met)"
                : "Medical Management (King's Not Met)"}
            </div>

            <div className="px-3 py-1.5 rounded-lg border bg-slate-800/80 border-slate-700 text-xs font-mono text-cyan-300">
              Latency: {latencyReport.phenotype.split(' ')[0]}
            </div>

            <div
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 ${
                edemaReport.projectedIcpMmHg >= 20
                  ? 'bg-rose-950/60 border-rose-800 text-rose-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              ICP: {edemaReport.projectedIcpMmHg} mmHg
            </div>
          </div>
        </div>

        {/* Clinical Scenario Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80">
          <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            Standard Acute Liver Failure Case Scenarios:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2">
            {Object.entries(ALF_SCENARIOS).map(([key, sc]) => {
              const isSelected = selectedScenarioKey === key;
              return (
                <button
                  key={key}
                  onClick={() => handleLoadScenario(key)}
                  className={`px-3 py-2 text-left rounded-xl border text-xs transition-all ${
                    isSelected
                      ? 'bg-amber-950/40 border-amber-500/50 text-amber-200 shadow-md ring-1 ring-amber-500/30'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="font-semibold truncate">{sc.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                    INR {sc.initialState.inr} &bull; pH {sc.initialState.arterialPh} &bull; NH3 {sc.initialState.arterialAmmoniaUmolL}
                  </div>
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

      {/* Main Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Etiology, Latency & Lab Profile (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Etiology & Staging Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-amber-400" />
                Etiology &amp; Latency Staging
              </h2>
              <span className="text-xs text-slate-400 font-mono">Age: {patientAge} yrs</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Etiology of Acute Hepatic Necrosis</label>
                <select
                  value={etiology}
                  onChange={(e) => setEtiology(e.target.value as AlfEtiology)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="acetaminophen_toxicity">Acetaminophen (APAP) Toxicity</option>
                  <option value="viral_hepatitis_b">Viral Hepatitis B (Acute Fulminant)</option>
                  <option value="viral_hepatitis_a_e">Viral Hepatitis A / E</option>
                  <option value="idiosyncratic_dili">Idiosyncratic DILI (e.g. INH/Rifampin)</option>
                  <option value="autoimmune_hepatitis">Autoimmune Hepatitis</option>
                  <option value="wilsons_disease">Fulminant Wilson&apos;s Disease</option>
                  <option value="budd_chiari_syndrome">Acute Budd-Chiari Syndrome</option>
                  <option value="cryptogenic_indeterminate">Cryptogenic / Indeterminate</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Jaundice to Encephalopathy Interval</span>
                  <span className="font-mono text-cyan-300 font-bold">{latencyDays} days</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="60"
                  value={latencyDays}
                  onChange={(e) => setLatencyDays(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>Hyperacute (&le;7d)</span>
                  <span>Acute (8-28d)</span>
                  <span>Subacute (&gt;28d)</span>
                </div>
              </div>

              {/* Latency Clinical Commentary */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-300">Phenotype: {latencyReport.phenotype}</span>
                  <span className="text-amber-400 font-mono">Edema: {latencyReport.cerebralEdemaRisk}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">{latencyReport.latencyComment}</p>
              </div>

              {/* West Haven Grade */}
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Hepatic Encephalopathy (West Haven Scale)
                </label>
                <div className="grid grid-cols-5 gap-1 text-xs">
                  {([0, 1, 2, 3, 4] as const).map((grade) => (
                    <button
                      key={grade}
                      onClick={() => setEncephalopathyGrade(grade)}
                      className={`py-1.5 rounded-lg border text-center font-mono font-bold transition ${
                        encephalopathyGrade === grade
                          ? grade >= 3
                            ? 'bg-rose-950/70 border-rose-500 text-rose-200 ring-1 ring-rose-500/30'
                            : 'bg-amber-950/70 border-amber-500 text-amber-200 ring-1 ring-amber-500/30'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      Grade {grade}
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  {encephalopathyGrade === 0 && 'Normal mentation; no asterixis'}
                  {encephalopathyGrade === 1 && 'Euphoria or anxiety, shortened attention span, mild asterixis'}
                  {encephalopathyGrade === 2 && 'Lethargy or apathy, disorientation to time, obvious asterixis'}
                  {encephalopathyGrade === 3 && 'Somnolence to semi-stupor, responsive to verbal stimuli, confusion'}
                  {encephalopathyGrade === 4 && 'Coma; unarousable; intubation mandatory'}
                </span>
              </div>
            </div>
          </div>

          {/* Critical Laboratory Biomarkers */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Gauge className="w-4 h-4 text-cyan-400" />
              Acid-Base, Renal &amp; Synthetic Labs
            </h2>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Arterial pH</span>
                  <span className={`font-mono ${arterialPh < 7.30 ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>
                    {arterialPh.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="7.10"
                  max="7.55"
                  step="0.01"
                  value={arterialPh}
                  onChange={(e) => setArterialPh(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
                <span className="text-[10px] text-slate-500">&lt; 7.30 = APAP King&apos;s criterion</span>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Arterial Lactate</span>
                  <span className={`font-mono ${lactate > 3.5 ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>
                    {lactate.toFixed(1)} mmol/L
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="12.0"
                  step="0.1"
                  value={lactate}
                  onChange={(e) => setLactate(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <span className="text-[10px] text-slate-500">&gt; 3.5 = adverse outcome</span>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Serum Creatinine</span>
                  <span className={`font-mono ${creatinine > 3.4 ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>
                    {creatinine.toFixed(1)} mg/dL
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="8.0"
                  step="0.1"
                  value={creatinine}
                  onChange={(e) => setCreatinine(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
                <span className="text-[10px] text-slate-500">&gt; 3.4 mg/dL = APAP triad</span>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Prothrombin INR</span>
                  <span className={`font-mono ${inr > 6.5 ? 'text-rose-400 font-bold' : 'text-amber-400 font-bold'}`}>
                    {inr.toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="12.0"
                  step="0.1"
                  value={inr}
                  onChange={(e) => setInr(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
                <span className="text-[10px] text-slate-500">&gt; 6.5 = decisive criterion</span>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Factor V Activity</span>
                  <span className={`font-mono ${factorV < 20 ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>
                    {factorV}%
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={factorV}
                  onChange={(e) => setFactorV(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <span className="text-[10px] text-slate-500">Clichy: &lt;20% (&lt;30yo) / &lt;30%</span>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Total Bilirubin</span>
                  <span className={`font-mono ${bilirubin > 17.5 ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>
                    {bilirubin.toFixed(1)} mg/dL
                  </span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="45.0"
                  step="0.5"
                  value={bilirubin}
                  onChange={(e) => setBilirubin(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <span className="text-[10px] text-slate-500">&gt; 17.5 mg/dL = Non-APAP</span>
              </div>
            </div>

            {/* Ammonia & Sodium Section */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Arterial Ammonia</span>
                  <span
                    className={`font-mono font-bold ${
                      ammonia > 150 ? 'text-rose-400' : ammonia > 100 ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  >
                    {ammonia} &mu;mol/L
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="350"
                  step="5"
                  value={ammonia}
                  onChange={(e) => setAmmonia(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Normal &lt; 50</span>
                  <span>&gt; 150 &mu;mol/L = Herniation Threshold</span>
                  <span>&gt; 200 &mu;mol/L = 55% ICP &gt; 25</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Serum Sodium (Target 145 - 150 mEq/L)</span>
                  <span
                    className={`font-mono font-bold ${
                      sodium >= 145 && sodium <= 150 ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {sodium} mEq/L
                  </span>
                </div>
                <input
                  type="range"
                  min="125"
                  max="160"
                  value={sodium}
                  onChange={(e) => setSodium(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: King's College, Cerebral Edema & Resuscitation (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* KING'S COLLEGE HOSPITAL CRITERIA CARD */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                  <AlertTriangle className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-white">King&apos;s College Hospital Prognostic Criteria</h2>
                  <p className="text-xs text-slate-400">
                    Validated decision rule for super-urgent emergency liver transplantation
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                {kingsReport.algorithmType}
              </span>
            </div>

            {/* Criteria Checklist */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300 block">
                Criteria Met for Emergency Transplantation:
              </span>
              {kingsReport.fulfilledSpecificCriteria.length > 0 ? (
                kingsReport.fulfilledSpecificCriteria.map((item, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/70 text-xs text-rose-200 flex items-start gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))
              ) : (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                  No King&apos;s College criteria currently fulfilled. Continue intensive medical resuscitation and
                  serial lab reassessment every 4-6 hours.
                </div>
              )}
            </div>

            {/* Prognostic Impact Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block">Mortality without Liver Transplantation:</span>
                <span className="text-lg font-mono font-bold text-rose-400">
                  {kingsReport.mortalityWithoutTransplantPercent}%
                </span>
              </div>

              <div className="text-right">
                <span className="text-slate-400 block">UNOS Status Recommendation:</span>
                <span
                  className={`font-mono font-bold ${
                    kingsReport.emergencyListingRecommended ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {kingsReport.emergencyListingRecommended ? 'STATUS 1A (SUPER-URGENT)' : 'NOT LISTED'}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/30 p-3 rounded-xl border border-slate-700/50">
              {kingsReport.clinicalPrognosticRationale}
            </p>

            {/* Clichy-Villejuif Accordion */}
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 text-xs flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-200">Clichy-Villejuif Criteria (Viral / HBV):</span>
                <p className="text-[11px] text-slate-400 mt-0.5">{clichyReport.rationale}</p>
              </div>
              <span
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold ${
                  clichyReport.isCriteriaMet
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {clichyReport.isCriteriaMet ? 'CLICHY MET' : 'NOT MET'}
              </span>
            </div>
          </div>

          {/* CEREBRAL EDEMA & NEUROCRITICAL CARE PROTOCOL */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <Brain className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-white">Neurocritical Care &amp; Cerebral Edema</h2>
                  <p className="text-xs text-slate-400">
                    Ammonia-mediated astrocytic glutamine accumulation &amp; intracranial hypertension
                  </p>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                  edemaReport.projectedIcpMmHg >= 20
                    ? 'bg-rose-950/70 border-rose-800 text-rose-300 animate-pulse'
                    : 'bg-emerald-950/70 border-emerald-800 text-emerald-300'
                }`}
              >
                {edemaReport.astrocyticSwellingGrade}
              </span>
            </div>

            {/* ICP & CPP Gauge Metrics */}
            <div className="grid grid-cols-3 gap-3 text-xs text-center font-mono">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Projected ICP</span>
                <span
                  className={`text-lg font-bold ${
                    edemaReport.projectedIcpMmHg >= 20 ? 'text-rose-400' : 'text-slate-200'
                  }`}
                >
                  {edemaReport.projectedIcpMmHg} mmHg
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Target &lt; 20</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Cerebral Perfusion (CPP)</span>
                <span
                  className={`text-lg font-bold ${
                    edemaReport.cerebralPerfusionPressureMmHg < 50 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {edemaReport.cerebralPerfusionPressureMmHg} mmHg
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Target 50 - 70</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Herniation Risk</span>
                <span
                  className={`text-lg font-bold ${
                    edemaReport.herniationRiskPercent >= 35 ? 'text-rose-400' : 'text-amber-400'
                  }`}
                >
                  {edemaReport.herniationRiskPercent}%
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Transtentorial</span>
              </div>
            </div>

            {/* Neuroprotective Interventions Bench */}
            <div className="space-y-2 text-xs">
              <span className="font-semibold text-slate-300 block">Neuroprotective Bundle &amp; Interventions:</span>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/40 border border-slate-700/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hob30}
                    onChange={(e) => setHob30(e.target.checked)}
                    className="w-4 h-4 accent-purple-500 rounded"
                  />
                  <span className="text-slate-300">Head of Bed 30&deg; &bull; Neutral Neck</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/40 border border-slate-700/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={intubated}
                    onChange={(e) => setIntubated(e.target.checked)}
                    className="w-4 h-4 accent-purple-500 rounded"
                  />
                  <span className="text-slate-300">Intubated (PaCO2 35-40)</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/40 border border-slate-700/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={crrtActive}
                    onChange={handleToggleCrrt}
                    className="w-4 h-4 accent-purple-500 rounded"
                  />
                  <span className="text-slate-300">CRRT (Ammonia Clearance)</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/40 border border-slate-700/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={nacActive}
                    onChange={(e) => setNacActive(e.target.checked)}
                    className="w-4 h-4 accent-purple-500 rounded"
                  />
                  <span className="text-slate-300">IV N-Acetylcysteine (NAC)</span>
                </label>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={handleApplyHypertonicSaline}
                  className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow"
                >
                  <Droplets className="w-3.5 h-3.5" />
                  Target 3% Hypertonic Saline (Na 148 mEq/L)
                </button>

                <button
                  onClick={handleReset}
                  className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset
                </button>
              </div>
            </div>

            {/* Directives List */}
            {edemaReport.managementDirectives.length > 0 && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                <span className="text-slate-400 font-semibold block">Target Management Directives:</span>
                <ul className="list-disc pl-4 space-y-1 text-slate-300 text-[11px]">
                  {edemaReport.managementDirectives.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* REBALANCED HEMOSTASIS & COAGULOPATHY WARNING */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <Scale className="w-5 h-5" />
              </span>
              <h2 className="text-base font-bold text-white">Rebalanced Hemostasis &amp; The FFP Paradox</h2>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-800/60 text-xs text-rose-200 leading-relaxed">
              <strong className="text-rose-300 block mb-1">
                EASL / AASLD Black-Box Practice Parameter:
              </strong>
              {coagulopathyReport.coagulopathyWarning}
            </div>

            <p className="text-xs text-slate-400">{coagulopathyReport.syntheticDeficitSummary}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
