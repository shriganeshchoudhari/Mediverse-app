'use client';

import React, { useState, useMemo } from 'react';
import {
  Wind,
  Activity,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
  Gauge,
  Heart,
  Sparkles,
  RefreshCw,
  AlertOctagon,
  Timer,
  Syringe,
  ChevronRight,
  Info,
  Scale,
  Zap,
  TrendingUp,
  Sliders,
  FileText
} from 'lucide-react';
import {
  calculateRsbi,
  calculateDiaphragmaticUltrasound,
  auditCuffLeak,
  evaluateSbtReadiness,
  WEANING_SCENARIOS,
  PatientWeaningState,
  SbtTechnique
} from '../../.gemini/skills/VentilatorWeaningEngine';

export default function VentilatorWeaningSimulator() {
  const [selectedScenarioKey, setSelectedScenarioKey] = useState<string>('successful_psv_wean');
  const scenario = WEANING_SCENARIOS[selectedScenarioKey] || WEANING_SCENARIOS.successful_psv_wean;

  // Patient Status & Technique
  const [sbtTechnique, setSbtTechnique] = useState<SbtTechnique>(scenario.initialState.currentSbtTechnique);
  const [sbtDuration, setSbtDuration] = useState<number>(scenario.initialState.sbtDurationMinutes);
  const [daysIntubated, setDaysIntubated] = useState<number>(scenario.initialState.daysIntubated);

  // Respiratory Mechanics & Pattern
  const [rr, setRr] = useState<number>(scenario.initialState.respiratoryRateBpm);
  const [vt, setVt] = useState<number>(scenario.initialState.tidalVolumeMl);
  const [initialRsbi, setInitialRsbi] = useState<number>(scenario.initialState.initialSbtRsbi);
  const [p01, setP01] = useState<number>(scenario.initialState.p01AirwayOcclusionPressureCmH2o);
  const [rapidShallow, setRapidShallow] = useState<boolean>(scenario.initialState.rapidShallowBreathingPattern);

  // Diaphragmatic Ultrasound (POCUS)
  const [excursion, setExcursion] = useState<number>(scenario.initialState.diaphragmaticExcursionCm);
  const [tinsp, setTinsp] = useState<number>(scenario.initialState.endInspiratoryThicknessMm);
  const [texp, setTexp] = useState<number>(scenario.initialState.endExpiratoryThicknessMm);

  // Cuff Leak Test
  const [cuffLeak, setCuffLeak] = useState<number>(scenario.initialState.cuffLeakVolumeMl);
  const [baselineVt, setBaselineVt] = useState<number>(scenario.initialState.baselineInspiratoryVtMl);
  const [steroidsActive, setSteroidsActive] = useState<boolean>(scenario.initialState.steroidProphylaxisActive);

  // Hemodynamics & Vitals
  const [sbp, setSbp] = useState<number>(scenario.initialState.systolicBpMmHg);
  const [dbp, setDbp] = useState<number>(scenario.initialState.diastolicBpMmHg);
  const [spo2, setSpo2] = useState<number>(scenario.initialState.spo2Percent);
  const [hr, setHr] = useState<number>(scenario.initialState.heartRateBpm);

  // Load Scenario Preset
  const handleLoadScenario = (key: string) => {
    setSelectedScenarioKey(key);
    const sc = WEANING_SCENARIOS[key];
    if (!sc) return;

    setSbtTechnique(sc.initialState.currentSbtTechnique);
    setSbtDuration(sc.initialState.sbtDurationMinutes);
    setDaysIntubated(sc.initialState.daysIntubated);

    setRr(sc.initialState.respiratoryRateBpm);
    setVt(sc.initialState.tidalVolumeMl);
    setInitialRsbi(sc.initialState.initialSbtRsbi);
    setP01(sc.initialState.p01AirwayOcclusionPressureCmH2o);
    setRapidShallow(sc.initialState.rapidShallowBreathingPattern);

    setExcursion(sc.initialState.diaphragmaticExcursionCm);
    setTinsp(sc.initialState.endInspiratoryThicknessMm);
    setTexp(sc.initialState.endExpiratoryThicknessMm);

    setCuffLeak(sc.initialState.cuffLeakVolumeMl);
    setBaselineVt(sc.initialState.baselineInspiratoryVtMl);
    setSteroidsActive(sc.initialState.steroidProphylaxisActive);

    setSbp(sc.initialState.systolicBpMmHg);
    setDbp(sc.initialState.diastolicBpMmHg);
    setSpo2(sc.initialState.spo2Percent);
    setHr(sc.initialState.heartRateBpm);
  };

  // Compile Current Patient State
  const currentState: PatientWeaningState = useMemo(
    () => ({
      patientAge: scenario.initialState.patientAge,
      daysIntubated,
      currentSbtTechnique: sbtTechnique,
      sbtDurationMinutes: sbtDuration,
      respiratoryRateBpm: rr,
      tidalVolumeMl: vt,
      initialSbtRsbi: initialRsbi,
      p01AirwayOcclusionPressureCmH2o: p01,
      rapidShallowBreathingPattern: rapidShallow,
      diaphragmaticExcursionCm: excursion,
      endInspiratoryThicknessMm: tinsp,
      endExpiratoryThicknessMm: texp,
      spo2Percent: spo2,
      fio2Delivered: scenario.initialState.fio2Delivered,
      heartRateBpm: hr,
      systolicBpMmHg: sbp,
      diastolicBpMmHg: dbp,
      cuffLeakVolumeMl: cuffLeak,
      baselineInspiratoryVtMl: baselineVt,
      steroidProphylaxisActive: steroidsActive,
    }),
    [
      scenario.initialState.patientAge,
      scenario.initialState.fio2Delivered,
      daysIntubated,
      sbtTechnique,
      sbtDuration,
      rr,
      vt,
      initialRsbi,
      p01,
      rapidShallow,
      excursion,
      tinsp,
      texp,
      spo2,
      hr,
      sbp,
      dbp,
      cuffLeak,
      baselineVt,
      steroidsActive,
    ]
  );

  // Engine Calculations
  const rsbiAudit = useMemo(() => calculateRsbi(currentState), [currentState]);
  const pocusAudit = useMemo(() => calculateDiaphragmaticUltrasound(currentState), [currentState]);
  const cuffAudit = useMemo(() => auditCuffLeak(currentState), [currentState]);
  const sbtReport = useMemo(() => evaluateSbtReadiness(currentState), [currentState]);

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 lg:p-8">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
                <Wind className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">
                  Difficult Ventilator Weaning & SBT Workstation
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Yang-Tobin RSBI Kinetics, P0.1 Neuromuscular Drive, Diaphragmatic Ultrasound (TFdi & Excursion), & Cuff Leak Stridor Screen
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-cyan-950/60 border border-cyan-800/50 text-cyan-300 text-xs font-semibold rounded-full flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
              ATS / CHEST Weaning Protocol
            </span>
          </div>
        </div>

        {/* Clinical Scenario Selector */}
        <div className="mt-6">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Select High-Acuity Weaning Case
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {Object.entries(WEANING_SCENARIOS).map(([key, sc]) => {
              const isSelected = selectedScenarioKey === key;
              return (
                <button
                  key={key}
                  onClick={() => handleLoadScenario(key)}
                  className={`text-left p-3 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-200 shadow-md shadow-cyan-950/30'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="font-semibold text-slate-200 truncate">{sc.name}</div>
                  <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">{sc.patientSummary}</div>
                </button>
              );
            })}
          </div>

          {/* Active Case Narrative Card */}
          <div className="mt-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                  Patient Summary ({scenario.name})
                </span>
                <p className="text-xs text-slate-300 mt-0.5">{scenario.patientSummary}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {scenario.clinicalPearls.map((pearl, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-800 text-[11px] text-slate-300 border border-slate-700"
                    >
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      {pearl}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={() => handleLoadScenario(selectedScenarioKey)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium rounded-lg flex items-center gap-1.5 shrink-0 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Case
            </button>
          </div>
        </div>
      </div>

      {/* Main Workstation Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Panel 1: SBT Setup & Mode */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-cyan-300 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                SBT Technique & Duration
              </h3>
              <span className="text-xs text-slate-400">{daysIntubated} Days Intubated</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1.5 font-medium">SBT Mode</label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: 'low_level_psv', label: 'Low-Level PSV (7/5)' },
                      { id: 't_piece', label: 'T-Piece Circuit' },
                      { id: 'cpap_zero_peep', label: 'CPAP / Zero PEEP' },
                    ] as const
                  ).map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSbtTechnique(m.id)}
                      className={`py-2 px-2 rounded-lg text-xs font-medium border text-center transition ${
                        sbtTechnique === m.id
                          ? 'bg-cyan-600/30 border-cyan-500 text-cyan-200'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">SBT Duration Elapsed</span>
                  <span className="text-cyan-400 font-bold">{sbtDuration} minutes</span>
                </div>
                <input aria-label="SBT Duration Elapsed"
                  type="range"
                  min="0"
                  max="120"
                  step="5"
                  value={sbtDuration}
                  onChange={(e) => setSbtDuration(Number(e.target.value))}
                  className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                  <span>0 min</span>
                  <span>30 min (ATS Benchmark)</span>
                  <span>120 min</span>
                </div>
              </div>
            </div>
          </div>

          {/* Panel 2: Respiratory Mechanics & RSBI Inputs */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <h3 className="text-sm font-semibold text-cyan-300 flex items-center gap-2 mb-3">
              <Gauge className="w-4 h-4 text-cyan-400" />
              Respiratory Mechanics (Yang-Tobin & P0.1)
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Spontaneous Respiratory Rate (RR)</span>
                  <span className={`font-bold ${rr > 30 ? 'text-rose-400' : 'text-cyan-300'}`}>{rr} bpm</span>
                </div>
                <input aria-label="30 ? text-rose-400 : text-cyan-300}`}>{rr} bpm"
                  type="range"
                  min="8"
                  max="45"
                  value={rr}
                  onChange={(e) => setRr(Number(e.target.value))}
                  className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Spontaneous Tidal Volume (Vt)</span>
                  <span className={`font-bold ${vt < 300 ? 'text-amber-400' : 'text-cyan-300'}`}>{vt} mL</span>
                </div>
                <input aria-label="Spontaneous Tidal Volume (Vt)"
                  type="range"
                  min="150"
                  max="750"
                  step="10"
                  value={vt}
                  onChange={(e) => setVt(Number(e.target.value))}
                  className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Initial SBT Minute-1 RSBI (Baseline)</span>
                  <span className="text-slate-300 font-semibold">{initialRsbi} bpm/L</span>
                </div>
                <input aria-label="Initial SBT Minute-1 RSBI (Baseline)"
                  type="range"
                  min="20"
                  max="160"
                  value={initialRsbi}
                  onChange={(e) => setInitialRsbi(Number(e.target.value))}
                  className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Airway Occlusion Pressure (P0.1)</span>
                  <span className={`font-bold ${p01 > 4.0 ? 'text-rose-400' : p01 < 1.0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {p01.toFixed(1)} cmH2O
                  </span>
                </div>
                <input aria-label="Airway Occlusion Pressure (P0.1)"
                  type="range"
                  min="0.5"
                  max="7.0"
                  step="0.1"
                  value={p01}
                  onChange={(e) => setP01(Number(e.target.value))}
                  className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                  <span>&lt; 1.0 (Blunted Drive)</span>
                  <span>1.0 - 2.0 (Normal)</span>
                  <span>&gt; 4.0 (Impending Fatigue)</span>
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rapidShallow}
                    onChange={(e) => setRapidShallow(e.target.checked)}
                    className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 bg-slate-900 w-4 h-4"
                  />
                  <span className="text-xs text-slate-300">
                    Thoracoabdominal paradox or suprasternal accessory retractions
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Panel 3: Diaphragmatic Ultrasound (POCUS) */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <h3 className="text-sm font-semibold text-cyan-300 flex items-center gap-2 mb-3">
              <Stethoscope className="w-4 h-4 text-cyan-400" />
              Diaphragmatic Ultrasound (VIDD Screen)
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Diaphragmatic Excursion</span>
                  <span className={`font-bold ${excursion < 1.0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {excursion.toFixed(1)} cm (Normal &ge; 1.0)
                  </span>
                </div>
                <input aria-label="Diaphragmatic Excursion"
                  type="range"
                  min="0.3"
                  max="2.8"
                  step="0.1"
                  value={excursion}
                  onChange={(e) => setExcursion(Number(e.target.value))}
                  className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">End-Insp (Tinsp)</span>
                    <span className="text-cyan-400 font-bold">{tinsp.toFixed(1)} mm</span>
                  </div>
                  <input aria-label="End-Insp (Tinsp)"
                    type="range"
                    min="1.2"
                    max="4.5"
                    step="0.1"
                    value={tinsp}
                    onChange={(e) => setTinsp(Number(e.target.value))}
                    className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">End-Exp (Texp)</span>
                    <span className="text-cyan-400 font-bold">{texp.toFixed(1)} mm</span>
                  </div>
                  <input aria-label="End-Exp (Texp)"
                    type="range"
                    min="1.0"
                    max="3.5"
                    step="0.1"
                    value={texp}
                    onChange={(e) => setTexp(Number(e.target.value))}
                    className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Panel 4: Cuff Leak Test & Hemodynamics */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <h3 className="text-sm font-semibold text-cyan-300 flex items-center gap-2 mb-3">
              <Syringe className="w-4 h-4 text-cyan-400" />
              Cuff Leak Test & Cardiovascular Vitals
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Cuff Leak Volume (Airway Deflation)</span>
                  <span className={`font-bold ${cuffLeak < 110 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {cuffLeak} mL ({Math.round((cuffLeak / Math.max(100, baselineVt)) * 100)}%)
                  </span>
                </div>
                <input aria-label="Cuff Leak"
                  type="range"
                  min="20"
                  max="350"
                  step="5"
                  value={cuffLeak}
                  onChange={(e) => setCuffLeak(Number(e.target.value))}
                  className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                  <span>&lt; 110 mL (Critical Stridor Risk)</span>
                  <span>&ge; 110 mL (Safe Airway)</span>
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={steroidsActive}
                    onChange={(e) => setSteroidsActive(e.target.checked)}
                    className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 bg-slate-900 w-4 h-4"
                  />
                  <span className="text-xs text-slate-300">
                    IV Methylprednisolone (20mg q4h x 4) Prophylaxis Administered (&ge; 4h prior)
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Systolic BP</span>
                    <span className={`font-bold ${sbp > 180 ? 'text-rose-400' : 'text-slate-200'}`}>{sbp} mmHg</span>
                  </div>
                  <input aria-label="180 ? text-rose-400 : text-slate-200}`}>{sbp} mmHg"
                    type="range"
                    min="80"
                    max="220"
                    value={sbp}
                    onChange={(e) => setSbp(Number(e.target.value))}
                    className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Heart Rate</span>
                    <span className={`font-bold ${hr > 120 ? 'text-rose-400' : 'text-slate-200'}`}>{hr} bpm</span>
                  </div>
                  <input aria-label="120 ? text-rose-400 : text-slate-200}`}>{hr} bpm"
                    type="range"
                    min="50"
                    max="160"
                    value={hr}
                    onChange={(e) => setHr(Number(e.target.value))}
                    className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Audits, Meters, Decision Engine (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Decision Engine Verdict Card */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              sbtReport.readyForExtubation
                ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                : sbtReport.isSbtSuccessful
                ? 'bg-amber-950/30 border-amber-500/50 text-amber-200'
                : 'bg-rose-950/30 border-rose-500/50 text-rose-200'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                {sbtReport.readyForExtubation ? (
                  <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0 mt-0.5" />
                ) : sbtReport.isSbtSuccessful ? (
                  <Timer className="w-8 h-8 text-amber-400 shrink-0 mt-0.5" />
                ) : (
                  <ShieldAlert className="w-8 h-8 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="text-xs uppercase tracking-wider font-bold opacity-80">
                    ATS / CHEST Extubation Assessment
                  </div>
                  <h2 className="text-xl font-extrabold mt-0.5">
                    {sbtReport.readyForExtubation
                      ? 'PATIENT CLEARED FOR IMMEDIATE EXTUBATION'
                      : sbtReport.isSbtSuccessful
                      ? 'SBT PHYSIOLOGICALLY STABLE - COMPLETE 30-MIN TRIAL'
                      : 'ABORT WEANING TRIAL - RETURN TO RESTING VENTILATION'}
                  </h2>
                  <p className="text-xs mt-1.5 opacity-90">
                    {sbtReport.readyForExtubation
                      ? 'All physiological, diaphragmatic, and upper airway criteria are satisfied. Proceed with airway suctioning and extubation.'
                      : sbtReport.isSbtSuccessful
                      ? `Trial duration is ${sbtDuration} min (&lt; 30 min benchmark). Continue monitoring for late diaphragmatic fatigue before extubation.`
                      : `Weaning failure identified: ${sbtReport.weaningFailureClassification.replace(/_/g, ' ').toUpperCase()}. Do not extubate.`}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    sbtReport.readyForExtubation
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : sbtReport.isSbtSuccessful
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {sbtReport.readyForExtubation ? 'EXTUBATION READY' : sbtReport.isSbtSuccessful ? 'MONITORING' : 'WEANING FAILED'}
                </span>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid: RSBI, P0.1, TFdi, Cuff Leak */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. RSBI Card */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Yang-Tobin RSBI
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-bold ${
                    rsbiAudit.isRsbiFavorable
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {rsbiAudit.isRsbiFavorable ? 'Favorable (< 105)' : 'Failure (>= 105)'}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-100">{rsbiAudit.rsbiValue}</span>
                <span className="text-xs text-slate-400">breaths/min/L</span>
              </div>
              <div className="mt-2 text-xs text-slate-300">
                Formula: {rr} bpm / {(vt / 1000).toFixed(2)} L
              </div>
              {/* Dynamic Rise Bar */}
              <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                  Dynamic Rise:
                </span>
                <span
                  className={`font-semibold ${
                    rsbiAudit.isFatiguingOverTime ? 'text-rose-400 font-bold' : 'text-slate-300'
                  }`}
                >
                  {rsbiAudit.rsbiRateOfRisePercent >= 0 ? `+${rsbiAudit.rsbiRateOfRisePercent}%` : `${rsbiAudit.rsbiRateOfRisePercent}%`}
                  {rsbiAudit.isFatiguingOverTime && ' (Fatigue!)'}
                </span>
              </div>
            </div>

            {/* 2. Diaphragmatic Ultrasound (TFdi) Card */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Diaphragm POCUS (TFdi)
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-bold ${
                    !pocusAudit.hasVidd
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {!pocusAudit.hasVidd ? 'Preserved Strength' : 'VIDD Detected'}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-100">{pocusAudit.thickeningFractionPercent}%</span>
                <span className="text-xs text-slate-400">TFdi (Target &ge; 30%)</span>
              </div>
              <div className="mt-2 text-xs text-slate-300">
                Excursion: {excursion.toFixed(1)} cm (Target &ge; 1.0 cm)
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 truncate">
                {pocusAudit.hasVidd ? 'Diaphragmatic disuse atrophy' : 'Adequate contractile recruitment'}
              </div>
            </div>

            {/* 3. P0.1 Neuromuscular Drive Card */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Airway Occlusion P0.1
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-bold ${
                    p01 > 4.0
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      : p01 < 1.0
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {p01 > 4.0 ? 'Excessive Drive' : p01 < 1.0 ? 'Blunted Drive' : 'Normal Drive'}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-100">{p01.toFixed(1)}</span>
                <span className="text-xs text-slate-400">cmH2O (100ms occlusion)</span>
              </div>
              <div className="mt-2 text-xs text-slate-400">
                {p01 > 4.0
                  ? 'High respiratory center drive: respiratory muscle exhaustion likely within hours.'
                  : p01 < 1.0
                  ? 'Inadequate respiratory center output: check sedation or central hypoventilation.'
                  : 'Balanced neuromotor output matching metabolic demand.'}
              </div>
            </div>

            {/* 4. Cuff Leak Test Card */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Cuff Leak & Stridor Risk
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-bold ${
                    cuffAudit.isLeakAdequate
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {cuffAudit.stridorRisk}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-100">{cuffLeak} mL</span>
                <span className="text-xs text-slate-400">({cuffAudit.cuffLeakPercentage}% of baseline)</span>
              </div>
              <div className="mt-2 text-xs text-slate-300">
                {steroidsActive ? (
                  <span className="text-emerald-400 font-medium">Steroid prophylaxis active</span>
                ) : (
                  <span className="text-slate-400">No steroid premedication</span>
                )}
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 truncate">
                {cuffAudit.isLeakAdequate ? 'Patent glottic aperture' : 'Glottic edema / high re-intubation risk'}
              </div>
            </div>
          </div>

          {/* Safety Checklist vs Failure Triggers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Extubation Safety Criteria Satisfied */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Criteria Satisfied ({sbtReport.extubationSafetyChecklist.length})
              </h4>
              {sbtReport.extubationSafetyChecklist.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No criteria satisfied.</p>
              ) : (
                <ul className="space-y-2">
                  {sbtReport.extubationSafetyChecklist.map((item, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Failure Triggers & Impediments */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <h4 className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                <AlertOctagon className="w-4 h-4 text-rose-400" />
                Failure Triggers ({sbtReport.failureTriggers.length})
              </h4>
              {sbtReport.failureTriggers.length === 0 ? (
                <p className="text-xs text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Zero failure triggers detected. SBT passed.
                </p>
              ) : (
                <ul className="space-y-2">
                  {sbtReport.failureTriggers.map((item, idx) => (
                    <li key={idx} className="text-xs text-rose-300 flex items-start gap-2">
                      <span className="text-rose-400 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Actionable Clinical Recommendations */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <h4 className="text-xs font-semibold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              Actionable Weaning Protocol Directive
            </h4>
            <div className="space-y-2">
              {sbtReport.actionableRecommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-200 flex items-start gap-2.5"
                >
                  <ChevronRight className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
