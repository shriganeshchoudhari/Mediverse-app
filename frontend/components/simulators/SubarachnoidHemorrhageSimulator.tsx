'use client';

import React, { useState, useMemo } from 'react';
import {
  Brain,
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
  ChevronRight,
  Info,
  Scale,
  Eye,
} from 'lucide-react';
import {
  calculateTcdVasospasm,
  evaluateDciRisk,
  auditEvdSafety,
  SAH_SCENARIOS,
  PatientSahState,
  HuntHessGrade,
  ModifiedFisherGrade,
  AneurysmSecurityStatus,
} from '../../.gemini/skills/SubarachnoidHemorrhageEngine';

export default function SubarachnoidHemorrhageSimulator() {
  const [selectedScenarioKey, setSelectedScenarioKey] = useState<string>('peak_vasospasm_dci');
  const scenario = SAH_SCENARIOS[selectedScenarioKey] || SAH_SCENARIOS.peak_vasospasm_dci;

  // Patient Status State
  const [dayPostBleed, setDayPostBleed] = useState<number>(scenario.initialState.dayPostBleed);
  const [huntHessGrade, setHuntHessGrade] = useState<HuntHessGrade>(scenario.initialState.huntHessGrade);
  const [gcsScore, setGcsScore] = useState<number>(scenario.initialState.gcsScore);
  const [modifiedFisherGrade, setModifiedFisherGrade] = useState<ModifiedFisherGrade>(
    scenario.initialState.modifiedFisherGrade
  );
  const [aneurysmStatus, setAneurysmStatus] = useState<AneurysmSecurityStatus>(
    scenario.initialState.aneurysmStatus
  );

  // Hemodynamics
  const [sbp, setSbp] = useState<number>(scenario.initialState.systolicBpMmHg);
  const [dbp, setDbp] = useState<number>(scenario.initialState.diastolicBpMmHg);
  const [cvp, setCvp] = useState<number>(scenario.initialState.centralVenousPressureMmHg);
  const [sodium, setSodium] = useState<number>(scenario.initialState.serumSodiumMeqL);

  // TCD & Neurology
  const [newDeficit, setNewDeficit] = useState<boolean>(scenario.initialState.newFocalDeficitPresent);
  const [mcaVelocity, setMcaVelocity] = useState<number>(scenario.initialState.mcaMeanFlowVelocityCmS);
  const [eicaVelocity, setEicaVelocity] = useState<number>(scenario.initialState.eicaMeanFlowVelocityCmS);

  // EVD & ICP
  const [evdHeight, setEvdHeight] = useState<number>(scenario.initialState.evdPopOffHeightCmH2o);
  const [icp, setIcp] = useState<number>(scenario.initialState.intracranialPressureMmHg);
  const [csfRate, setCsfRate] = useState<number>(scenario.initialState.csfDrainageRateMlHr);

  // Therapeutics
  const [nimodipine, setNimodipine] = useState<boolean>(scenario.initialState.oralNimodipineActive);
  const [inducedHtn, setInducedHtn] = useState<boolean>(scenario.initialState.inducedHypertensionActive);

  // Derived MAP
  const map = useMemo(() => Math.round((2 * dbp + sbp) / 3), [sbp, dbp]);

  // Load Scenario Preset
  const handleLoadScenario = (key: string) => {
    setSelectedScenarioKey(key);
    const sc = SAH_SCENARIOS[key];
    if (!sc) return;

    setDayPostBleed(sc.initialState.dayPostBleed);
    setHuntHessGrade(sc.initialState.huntHessGrade);
    setGcsScore(sc.initialState.gcsScore);
    setModifiedFisherGrade(sc.initialState.modifiedFisherGrade);
    setAneurysmStatus(sc.initialState.aneurysmStatus);

    setSbp(sc.initialState.systolicBpMmHg);
    setDbp(sc.initialState.diastolicBpMmHg);
    setCvp(sc.initialState.centralVenousPressureMmHg);
    setSodium(sc.initialState.serumSodiumMeqL);

    setNewDeficit(sc.initialState.newFocalDeficitPresent);
    setMcaVelocity(sc.initialState.mcaMeanFlowVelocityCmS);
    setEicaVelocity(sc.initialState.eicaMeanFlowVelocityCmS);

    setEvdHeight(sc.initialState.evdPopOffHeightCmH2o);
    setIcp(sc.initialState.intracranialPressureMmHg);
    setCsfRate(sc.initialState.csfDrainageRateMlHr);

    setNimodipine(sc.initialState.oralNimodipineActive);
    setInducedHtn(sc.initialState.inducedHypertensionActive);
  };

  // Compile Patient State
  const currentState: PatientSahState = useMemo(
    () => ({
      patientAge: scenario.initialState.patientAge,
      dayPostBleed,
      huntHessGrade,
      gcsScore,
      modifiedFisherGrade,
      aneurysmStatus,
      systolicBpMmHg: sbp,
      diastolicBpMmHg: dbp,
      meanArterialPressureMmHg: map,
      centralVenousPressureMmHg: cvp,
      newFocalDeficitPresent: newDeficit,
      mcaMeanFlowVelocityCmS: mcaVelocity,
      eicaMeanFlowVelocityCmS: eicaVelocity,
      evdPopOffHeightCmH2o: evdHeight,
      intracranialPressureMmHg: icp,
      csfDrainageRateMlHr: csfRate,
      serumSodiumMeqL: sodium,
      oralNimodipineActive: nimodipine,
      inducedHypertensionActive: inducedHtn,
    }),
    [
      scenario.initialState.patientAge,
      dayPostBleed,
      huntHessGrade,
      gcsScore,
      modifiedFisherGrade,
      aneurysmStatus,
      sbp,
      dbp,
      map,
      cvp,
      newDeficit,
      mcaVelocity,
      eicaVelocity,
      evdHeight,
      icp,
      csfRate,
      sodium,
      nimodipine,
      inducedHtn,
    ]
  );

  // Engine Calculations
  const tcdAudit = useMemo(() => calculateTcdVasospasm(currentState), [currentState]);
  const dciReport = useMemo(() => evaluateDciRisk(currentState), [currentState]);
  const evdAudit = useMemo(() => auditEvdSafety(currentState), [currentState]);

  // Therapeutic Intervention: Induced Hypertension
  const handleToggleInducedHtn = () => {
    if (aneurysmStatus === 'unsecured') {
      alert('CRITICAL WARNING: Induced hypertension is STRICTLY CONTRAINDICATED in unsecured aneurysms due to lethal rebleeding risk!');
      return;
    }
    const nextVal = !inducedHtn;
    setInducedHtn(nextVal);
    if (nextVal) {
      setSbp((prev) => Math.min(185, prev + 35));
      setDbp((prev) => Math.min(105, prev + 15));
      setNewDeficit(false); // Deficit reversed by collateral recruitment!
    } else {
      setSbp(scenario.initialState.systolicBpMmHg);
      setDbp(scenario.initialState.diastolicBpMmHg);
    }
  };

  // Therapeutic Intervention: CSW Hypertonic Saline Bolus
  const handleCorrectCsw = () => {
    setSodium(142);
    setCvp(8);
    setSbp((prev) => Math.max(130, prev + 15));
  };

  const handleReset = () => {
    handleLoadScenario(selectedScenarioKey);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Brain className="w-5 h-5 animate-pulse" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                Neurocritical Care &amp; Vascular Neurosurgery Suite
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Aneurysmal Subarachnoid Hemorrhage (aSAH) &amp; Vasospasm Workstation
            </h1>
            <p className="text-sm text-slate-400 max-w-3xl">
              Biophysical simulation of Hunt &amp; Hess / Modified Fisher grading, Transcranial Doppler (TCD)
              Lindegaard ratio vasospasm kinetics, External Ventricular Drain (EVD) dynamics, Delayed Cerebral
              Ischemia (DCI) surveillance, and euvolemic induced hypertension.
            </p>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div
              className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 ${
                tcdAudit.vasospasmSeverity === 'Severe Vasospasm'
                  ? 'bg-rose-950/80 border-rose-800 text-rose-300 animate-pulse'
                  : tcdAudit.vasospasmSeverity === 'Moderate Vasospasm' || tcdAudit.vasospasmSeverity === 'Mild Vasospasm'
                  ? 'bg-amber-950/80 border-amber-800 text-amber-300'
                  : 'bg-emerald-950/70 border-emerald-800 text-emerald-300'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              TCD: {tcdAudit.vasospasmSeverity}
            </div>

            <div className="px-3 py-1.5 rounded-lg border bg-slate-800/80 border-slate-700 text-xs font-mono font-bold text-cyan-300">
              Lindegaard: {tcdAudit.lindegaardRatio}
            </div>

            <div
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold ${
                dciReport.isPeakVasospasmWindow
                  ? 'bg-amber-950/60 border-amber-800 text-amber-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              Day {dayPostBleed} / 21
            </div>
          </div>
        </div>

        {/* Clinical Scenario Preset Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80">
          <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            Standard Subarachnoid Hemorrhage Scenarios:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2">
            {Object.entries(SAH_SCENARIOS).map(([key, sc]) => {
              const isSelected = selectedScenarioKey === key;
              return (
                <button
                  key={key}
                  onClick={() => handleLoadScenario(key)}
                  className={`px-3 py-2 text-left rounded-xl border text-xs transition-all ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-200 shadow-md ring-1 ring-indigo-500/30'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="font-semibold truncate">{sc.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                    H&amp;H {sc.initialState.huntHessGrade} &bull; Fisher {sc.initialState.modifiedFisherGrade} &bull; {sc.initialState.aneurysmStatus.toUpperCase()}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-3 p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/50 text-xs text-slate-300">
            <span className="font-semibold text-indigo-300">Case Vignette: </span>
            {scenario.patientSummary}
          </div>
        </div>
      </div>

      {/* Main Grid: Left Controls (5 cols) & Right Neurocritical Panel (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Clinical Grade, TCD & Hemodynamics (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Clinical & Radiographic Status Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <Eye className="w-5 h-5" />
                </span>
                <h2 className="text-base font-bold text-white">Clinical &amp; Radiographic Severity</h2>
              </div>
              <span
                className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${
                  aneurysmStatus === 'unsecured'
                    ? 'bg-rose-950 text-rose-300 border-rose-800 animate-pulse'
                    : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                }`}
              >
                {aneurysmStatus.toUpperCase()}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Day Post Bleed Slider */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Bleed Day (Vasospasm Peak: Days 4 - 14)</span>
                  <span className={`font-mono font-bold ${dayPostBleed >= 4 && dayPostBleed <= 14 ? 'text-amber-400' : 'text-slate-200'}`}>
                    Day {dayPostBleed}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="21"
                  value={dayPostBleed}
                  onChange={(e) => setDayPostBleed(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* Hunt & Hess / Modified Fisher Selectors */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block mb-1">Hunt &amp; Hess Grade</span>
                  <select
                    value={huntHessGrade}
                    onChange={(e) => setHuntHessGrade(parseInt(e.target.value) as HuntHessGrade)}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value={1}>Grade 1 (Mild headache)</option>
                    <option value={2}>Grade 2 (Severe headache / CN palsy)</option>
                    <option value={3}>Grade 3 (Drowsy / Confused)</option>
                    <option value={4}>Grade 4 (Stupor / Hemiparesis)</option>
                    <option value={5}>Grade 5 (Coma / Decerebrate)</option>
                  </select>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1">Modified Fisher Scale</span>
                  <select
                    value={modifiedFisherGrade}
                    onChange={(e) => setModifiedFisherGrade(parseInt(e.target.value) as ModifiedFisherGrade)}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value={1}>Grade 1 (Thin SAH, No IVH)</option>
                    <option value={2}>Grade 2 (Thin SAH + IVH)</option>
                    <option value={3}>Grade 3 (Thick SAH, No IVH)</option>
                    <option value={4}>Grade 4 (Thick SAH + IVH - High Risk)</option>
                  </select>
                </div>
              </div>

              {/* Aneurysm Status Selector */}
              <div>
                <span className="text-slate-400 block mb-1">Aneurysm Security Status</span>
                <div className="grid grid-cols-3 gap-2">
                  {(['unsecured', 'coiled', 'clipped'] as AneurysmSecurityStatus[]).map((status) => (
                    <button
                      key={status}
                      onClick={() => setAneurysmStatus(status)}
                      className={`py-1.5 rounded-lg border text-xs font-semibold uppercase transition ${
                        aneurysmStatus === status
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* New Focal Deficit Trigger */}
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newDeficit}
                  onChange={(e) => setNewDeficit(e.target.checked)}
                  className="w-4 h-4 accent-rose-500 rounded"
                />
                <span className="text-slate-300 font-semibold">
                  New Focal Deficit (Speech arrest / Hemiparesis &rarr; Clinical DCI)
                </span>
              </label>
            </div>
          </div>

          {/* Transcranial Doppler (TCD) & Lindegaard Bench */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <Activity className="w-5 h-5" />
                </span>
                <h2 className="text-base font-bold text-white">Transcranial Doppler (TCD) Sonography</h2>
              </div>
              <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                LR: {tcdAudit.lindegaardRatio}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">MCA Mean Velocity (Vmean)</span>
                  <span
                    className={`font-mono font-bold ${
                      mcaVelocity >= 200 ? 'text-rose-400' : mcaVelocity >= 120 ? 'text-amber-400' : 'text-slate-200'
                    }`}
                  >
                    {mcaVelocity} cm/s
                  </span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="280"
                  value={mcaVelocity}
                  onChange={(e) => setMcaVelocity(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Normal &lt; 120</span>
                  <span>120 - 199 = Mild/Mod</span>
                  <span>&ge; 200 = Severe Spasm</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Extracranial ICA Mean Velocity (eICA)</span>
                  <span className="font-mono font-bold text-slate-200">{eicaVelocity} cm/s</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={eicaVelocity}
                  onChange={(e) => setEicaVelocity(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
                <span className="text-[10px] text-slate-500">Normal eICA: 30 - 50 cm/s</span>
              </div>

              {/* Lindegaard Interpretation Box */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                  Sonographic Interpretation:
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">{tcdAudit.findings[0]}</p>
                <p className="text-[11px] text-cyan-300 mt-1">{tcdAudit.recommendation}</p>
              </div>
            </div>
          </div>

          {/* Hemodynamics & Sodium Bench */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-teal-400" />
              Volume &amp; Electrolyte State (CSW vs Euvolemia)
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Blood Pressure (MAP {map})</span>
                  <span className="font-mono font-bold text-slate-200">{sbp} / {dbp}</span>
                </div>
                <input
                  type="range"
                  min="90"
                  max="200"
                  value={sbp}
                  onChange={(e) => setSbp(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">CVP (Target 6-8 mmHg)</span>
                  <span className={`font-mono font-bold ${cvp < 6 ? 'text-rose-400' : 'text-slate-200'}`}>
                    {cvp} mmHg
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="14"
                  value={cvp}
                  onChange={(e) => setCvp(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Serum Sodium (CSW Threat &lt; 135 mEq/L)</span>
                <span className={`font-mono font-bold ${sodium < 135 ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>
                  {sodium} mEq/L
                </span>
              </div>
              <input
                type="range"
                min="120"
                max="150"
                value={sodium}
                onChange={(e) => setSodium(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Right Column: EVD Dynamics, DCI Risk & Neuroprotective Resuscitation (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* DELAYED CEREBRAL ISCHEMIA (DCI) & MODIFIED FISHER CARD */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <AlertOctagon className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-white">Delayed Cerebral Ischemia (DCI) Risk Audit</h2>
                  <p className="text-xs text-slate-400">Modified Fisher prediction &amp; clinical deficit surveillance</p>
                </div>
              </div>

              <span
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border ${
                  dciReport.dciSuspected
                    ? 'bg-rose-950 text-rose-300 border-rose-800 animate-pulse'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                {dciReport.dciSuspected ? 'CLINICAL DCI SUSPECTED' : 'NO DCI DEFICIT'}
              </span>
            </div>

            {/* Metric Box */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Predicted DCI Risk</span>
                <span className="text-2xl font-mono font-bold text-amber-400 mt-0.5 block">
                  ~{dciReport.overallDciRiskPercent}%
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">{dciReport.modifiedFisherDescription}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Vasospasm Temporal Window</span>
                <span
                  className={`text-base font-bold mt-1 block ${
                    dciReport.isPeakVasospasmWindow ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {dciReport.isPeakVasospasmWindow ? 'PEAK DANGER WINDOW (Days 4-14)' : 'Out of Peak Window'}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Serial TCD every 24h indicated</span>
              </div>
            </div>

            {/* Directives & Warnings */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-300 block">Neurocritical Directives:</span>
              {dciReport.managementDirectives.map((d, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60 text-xs text-slate-200 flex items-start gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{d}</span>
                </div>
              ))}
            </div>
          </div>

          {/* EXTERNAL VENTRICULAR DRAIN (EVD) DYNAMICS CARD */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <Gauge className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-base font-bold text-white">External Ventricular Drain (EVD) &amp; ICP</h2>
                  <p className="text-xs text-slate-400">Zeroed at Foramen of Monro (External Auditory Meatus)</p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-800 text-purple-300 border border-slate-700">
                CPP: {evdAudit.cerebralPerfusionPressureMmHg} mmHg
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center font-mono">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Pop-Off Height</span>
                <span className="text-lg font-bold text-slate-200 mt-0.5 block">{evdHeight} cmH&sup2;O</span>
                <span className="text-[9px] text-slate-500">Target 10 - 15</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">CSF Drainage Rate</span>
                <span className={`text-lg font-bold mt-0.5 block ${csfRate > 25 ? 'text-rose-400' : 'text-slate-200'}`}>
                  {csfRate} mL/hr
                </span>
                <span className="text-[9px] text-slate-500">Normal 10 - 20</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Intracranial Pressure</span>
                <span className={`text-lg font-bold mt-0.5 block ${icp >= 20 ? 'text-rose-400' : 'text-slate-200'}`}>
                  {icp} mmHg
                </span>
                <span className="text-[9px] text-slate-500">Target &lt; 20</span>
              </div>
            </div>

            {/* EVD Sliders */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Pop-Off Height</span>
                <input
                  type="range"
                  min="0"
                  max="25"
                  value={evdHeight}
                  onChange={(e) => setEvdHeight(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>
              <div>
                <span className="text-slate-400 block mb-1">CSF Rate (mL/hr)</span>
                <input
                  type="range"
                  min="0"
                  max="45"
                  value={csfRate}
                  onChange={(e) => setCsfRate(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>
              <div>
                <span className="text-slate-400 block mb-1">ICP (mmHg)</span>
                <input
                  type="range"
                  min="5"
                  max="35"
                  value={icp}
                  onChange={(e) => setIcp(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
              </div>
            </div>

            {/* EVD Alerts */}
            {evdAudit.safetyAlerts.length > 0 && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-xs text-rose-200 space-y-1">
                {evdAudit.safetyAlerts.map((alt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    <span>{alt}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* NEURO-ICU THERAPEUTIC RESUSCITATION ACTIONS */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Syringe className="w-5 h-5 text-teal-400" />
              Neuro-ICU Resuscitation Bench
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <button
                onClick={handleToggleInducedHtn}
                className={`p-3 rounded-xl border font-semibold text-left transition flex items-center justify-between ${
                  inducedHtn
                    ? 'bg-rose-950/60 border-rose-600 text-rose-200 shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="font-bold">Euvolemic Induced Hypertension</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Target SBP 160-180 mmHg via Norepinephrine
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded text-[10px] font-bold ${
                    inducedHtn ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {inducedHtn ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </button>

              <button
                onClick={handleCorrectCsw}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700 font-semibold text-left transition flex items-center justify-between"
              >
                <div>
                  <div className="font-bold">CSW Rescue: 3% Saline + Volume</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Corrects hyponatremia &amp; restores CVP 6-8 mmHg
                  </div>
                </div>
                <Droplets className="w-4 h-4 text-teal-400" />
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={nimodipine}
                  onChange={(e) => setNimodipine(e.target.checked)}
                  className="w-4 h-4 accent-indigo-500 rounded"
                />
                <span>Oral Nimodipine 60 mg q4h (Neuroprotection Standard)</span>
              </label>

              <button
                onClick={handleReset}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
