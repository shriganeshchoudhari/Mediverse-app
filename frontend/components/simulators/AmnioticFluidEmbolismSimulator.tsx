'use client';

import React, { useState, useMemo } from 'react';
import {
  Baby,
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
  Flame,
  Layers,
  Sliders,
  FileText,
  Droplets,
  Wind
} from 'lucide-react';
import {
  auditClarkCriteria,
  calculatePregnancyDic,
  evaluateRightHeartHemodynamics,
  generateAfeDirectives,
  AFE_SCENARIOS,
  PatientAfeState,
  AfePhase
} from '../../.gemini/skills/AmnioticFluidEmbolismEngine';

export default function AmnioticFluidEmbolismSimulator() {
  const [selectedScenarioKey, setSelectedScenarioKey] = useState<string>('peripartum_sudden_collapse_phase1');
  const scenario = AFE_SCENARIOS[selectedScenarioKey] || AFE_SCENARIOS.peripartum_sudden_collapse_phase1;

  // Patient Clinical State & Phase
  const [phase, setPhase] = useState<AfePhase>(scenario.initialState.currentPhase);
  const [timingMin, setTimingMin] = useState<number>(scenario.initialState.peripartumTimingMinutes);
  const [isArrest, setIsArrest] = useState<boolean>(scenario.initialState.cardiorespiratoryArrest);

  // Vitals & Gas Exchange
  const [sbp, setSbp] = useState<number>(scenario.initialState.systolicBpMmHg);
  const [dbp, setDbp] = useState<number>(scenario.initialState.diastolicBpMmHg);
  const [hr, setHr] = useState<number>(scenario.initialState.heartRateBpm);
  const [spo2, setSpo2] = useState<number>(scenario.initialState.spo2Percent);
  const [temp, setTemp] = useState<number>(scenario.initialState.temperatureCelsius);

  // Pulmonary & Echo
  const [pvr, setPvr] = useState<number>(scenario.initialState.pulmonaryVascularResistanceDyns);
  const [rvLvRatio, setRvLvRatio] = useState<number>(scenario.initialState.rvLvDiameterRatio);
  const [septalD, setSeptalD] = useState<boolean>(scenario.initialState.septalDShapedFlattening);
  const [lvef, setLvef] = useState<number>(scenario.initialState.leftVentricularEjectionFractionPercent);

  // Coagulation (Pregnancy Modified)
  const [platelets, setPlatelets] = useState<number>(scenario.initialState.plateletCountThousands);
  const [fibrinogen, setFibrinogen] = useState<number>(scenario.initialState.serumFibrinogenMgDl);
  const [inr, setInr] = useState<number>(scenario.initialState.prothrombinTimeInr);
  const [dDimer, setDDimer] = useState<number>(scenario.initialState.dDimerUgl);
  const [altEtiology, setAltEtiology] = useState<boolean>(scenario.initialState.alternativeEtiologyIdentified);

  // Therapeutics
  const [inhaledVasodilator, setInhaledVasodilator] = useState<boolean>(scenario.initialState.inhaledPulmonaryVasodilatorActive);
  const [vasopressorType, setVasopressorType] = useState<PatientAfeState['vasopressorInotropeSupport']>(
    scenario.initialState.vasopressorInotropeSupport
  );
  const [aOkGiven, setAOkGiven] = useState<boolean>(scenario.initialState.aOkProtocolAdministered);
  const [txaGiven, setTxaGiven] = useState<boolean>(scenario.initialState.tranexamicAcidGiven);
  const [cryoUnits, setCryoUnits] = useState<number>(scenario.initialState.fibrinogenReplacementUnits);
  const [ecmoActive, setEcmoActive] = useState<boolean>(scenario.initialState.vaEcmoCannulated);

  // Load Scenario Preset
  const handleLoadScenario = (key: string) => {
    setSelectedScenarioKey(key);
    const sc = AFE_SCENARIOS[key];
    if (!sc) return;

    setPhase(sc.initialState.currentPhase);
    setTimingMin(sc.initialState.peripartumTimingMinutes);
    setIsArrest(sc.initialState.cardiorespiratoryArrest);

    setSbp(sc.initialState.systolicBpMmHg);
    setDbp(sc.initialState.diastolicBpMmHg);
    setHr(sc.initialState.heartRateBpm);
    setSpo2(sc.initialState.spo2Percent);
    setTemp(sc.initialState.temperatureCelsius);

    setPvr(sc.initialState.pulmonaryVascularResistanceDyns);
    setRvLvRatio(sc.initialState.rvLvDiameterRatio);
    setSeptalD(sc.initialState.septalDShapedFlattening);
    setLvef(sc.initialState.leftVentricularEjectionFractionPercent);

    setPlatelets(sc.initialState.plateletCountThousands);
    setFibrinogen(sc.initialState.serumFibrinogenMgDl);
    setInr(sc.initialState.prothrombinTimeInr);
    setDDimer(sc.initialState.dDimerUgl);
    setAltEtiology(sc.initialState.alternativeEtiologyIdentified);

    setInhaledVasodilator(sc.initialState.inhaledPulmonaryVasodilatorActive);
    setVasopressorType(sc.initialState.vasopressorInotropeSupport);
    setAOkGiven(sc.initialState.aOkProtocolAdministered);
    setTxaGiven(sc.initialState.tranexamicAcidGiven);
    setCryoUnits(sc.initialState.fibrinogenReplacementUnits);
    setEcmoActive(sc.initialState.vaEcmoCannulated);
  };

  // Compile Current Patient State
  const currentState: PatientAfeState = useMemo(
    () => ({
      patientAge: scenario.initialState.patientAge,
      gestationalWeeks: scenario.initialState.gestationalWeeks,
      peripartumTimingMinutes: timingMin,
      currentPhase: phase,
      cardiorespiratoryArrest: isArrest,
      systolicBpMmHg: sbp,
      diastolicBpMmHg: dbp,
      heartRateBpm: hr,
      spo2Percent: spo2,
      fio2Percent: scenario.initialState.fio2Percent,
      pulmonaryVascularResistanceDyns: pvr,
      rvLvDiameterRatio: rvLvRatio,
      septalDShapedFlattening: septalD,
      leftVentricularEjectionFractionPercent: lvef,
      plateletCountThousands: platelets,
      serumFibrinogenMgDl: fibrinogen,
      prothrombinTimeInr: inr,
      dDimerUgl: dDimer,
      temperatureCelsius: temp,
      alternativeEtiologyIdentified: altEtiology,
      inhaledPulmonaryVasodilatorActive: inhaledVasodilator,
      vasopressorInotropeSupport: vasopressorType,
      aOkProtocolAdministered: aOkGiven,
      tranexamicAcidGiven: txaGiven,
      fibrinogenReplacementUnits: cryoUnits,
      vaEcmoCannulated: ecmoActive,
    }),
    [
      scenario.initialState.patientAge,
      scenario.initialState.gestationalWeeks,
      scenario.initialState.fio2Percent,
      timingMin,
      phase,
      isArrest,
      sbp,
      dbp,
      hr,
      spo2,
      temp,
      pvr,
      rvLvRatio,
      septalD,
      lvef,
      platelets,
      fibrinogen,
      inr,
      dDimer,
      altEtiology,
      inhaledVasodilator,
      vasopressorType,
      aOkGiven,
      txaGiven,
      cryoUnits,
      ecmoActive,
    ]
  );

  // Engine Calculations
  const clarkAudit = useMemo(() => auditClarkCriteria(currentState), [currentState]);
  const dicAudit = useMemo(() => calculatePregnancyDic(currentState), [currentState]);
  const rvAudit = useMemo(() => evaluateRightHeartHemodynamics(currentState), [currentState]);
  const report = useMemo(() => generateAfeDirectives(currentState), [currentState]);

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 lg:p-8">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-pink-500/10 border border-pink-500/30 rounded-xl text-pink-400">
                <Baby className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-400 via-rose-300 to-purple-400 bg-clip-text text-transparent">
                  Amniotic Fluid Embolism (AFE) &amp; Collapse Workstation
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Clark Diagnostic Criteria (SMFM 2016), Biphasic RV Failure &amp; Consumptive DIC Kinetics, A-OK Protocol, Inhaled Prostacyclin &amp; VA-ECMO
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-pink-950/60 border border-pink-800/50 text-pink-300 text-xs font-semibold rounded-full flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 animate-pulse text-pink-400" />
              SMFM / SOAP Obstetric Emergency Guidelines
            </span>
          </div>
        </div>

        {/* Clinical Scenario Selector */}
        <div className="mt-6">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Select Obstetric Collapse Presentation
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {Object.entries(AFE_SCENARIOS).map(([key, sc]) => {
              const isSelected = selectedScenarioKey === key;
              return (
                <button
                  key={key}
                  onClick={() => handleLoadScenario(key)}
                  className={`text-left p-3 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                    isSelected
                      ? 'bg-pink-950/40 border-pink-500/60 text-pink-200 shadow-md shadow-pink-950/30'
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
              <Info className="w-5 h-5 text-pink-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-semibold text-pink-300 uppercase tracking-wider">
                  Obstetric Vignette ({scenario.name})
                </span>
                <p className="text-xs text-slate-300 mt-0.5">{scenario.patientSummary}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {scenario.clinicalPearls.map((pearl, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-800 text-[11px] text-slate-300 border border-slate-700"
                    >
                      <Sparkles className="w-3 h-3 text-pink-400" />
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
          {/* Panel 1: Phase & Peripartum Timing */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-pink-300 flex items-center gap-2">
                <Timer className="w-4 h-4 text-pink-400" />
                AFE Phase &amp; Delivery Timing
              </h3>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                timingMin <= 30
                  ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {timingMin <= 30 ? 'Clark Timing Met (<= 30 min)' : 'Delayed Presentation'}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1.5 font-medium">Biphasic Pathophysiology Stage</label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { id: 'phase_1_acute_cor_pulmonale', label: 'Phase 1: RV Failure / Spasm' },
                      { id: 'phase_2_lv_atony_and_dic', label: 'Phase 2: LV Atony & DIC' },
                    ] as const
                  ).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPhase(p.id)}
                      className={`py-2 px-2 rounded-lg text-xs font-medium border text-center transition ${
                        phase === p.id
                          ? 'bg-pink-600/30 border-pink-500 text-pink-200 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Peripartum Timing</span>
                  <span className="text-pink-400 font-bold">
                    {timingMin < 0 ? `${Math.abs(timingMin)} min Antepartum` : `${timingMin} min Postpartum`}
                  </span>
                </div>
                <input
                  type="range"
                  min="-60"
                  max="120"
                  step="5"
                  value={timingMin}
                  onChange={(e) => setTimingMin(Number(e.target.value))}
                  className="w-full accent-pink-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                  <span>-60 min (Labor)</span>
                  <span>0 (Delivery)</span>
                  <span>+30 min (Clark Window)</span>
                  <span>+120 min</span>
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isArrest}
                    onChange={(e) => setIsArrest(e.target.checked)}
                    className="rounded border-slate-700 text-rose-500 focus:ring-rose-500 bg-slate-900 w-4 h-4"
                  />
                  <span className="text-xs text-rose-300 font-bold">
                    Cardiorespiratory Arrest (PEA / Asystole / Collapse)
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Panel 2: Hemodynamics & Cardiopulmonary Mechanics */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <h3 className="text-sm font-semibold text-pink-300 flex items-center gap-2 mb-3">
              <Gauge className="w-4 h-4 text-pink-400" />
              Hemodynamics &amp; Pulmonary Mechanics
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Systolic BP</span>
                    <span className={`font-bold ${sbp < 90 ? 'text-rose-400' : 'text-slate-200'}`}>{sbp} mmHg</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="140"
                    value={sbp}
                    onChange={(e) => setSbp(Number(e.target.value))}
                    className="w-full accent-pink-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">SpO2 Oxygenation</span>
                    <span className={`font-bold ${spo2 < 90 ? 'text-rose-400' : 'text-slate-200'}`}>{spo2}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={spo2}
                    onChange={(e) => setSpo2(Number(e.target.value))}
                    className="w-full accent-pink-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Pulmonary Vascular Resistance (PVR)</span>
                  <span className={`font-bold ${pvr >= 400 ? 'text-rose-400' : 'text-slate-200'}`}>
                    {pvr} dyn·s/cm⁵ (Normal 50-150)
                  </span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="900"
                  step="20"
                  value={pvr}
                  onChange={(e) => setPvr(Number(e.target.value))}
                  className="w-full accent-pink-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">RV/LV Ratio</span>
                    <span className={`font-bold ${rvLvRatio >= 1.0 ? 'text-rose-400' : 'text-slate-200'}`}>
                      {rvLvRatio.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.4"
                    max="1.6"
                    step="0.05"
                    value={rvLvRatio}
                    onChange={(e) => setRvLvRatio(Number(e.target.value))}
                    className="w-full accent-pink-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Temperature</span>
                    <span className={`font-bold ${temp >= 38.0 ? 'text-amber-400' : 'text-slate-200'}`}>
                      {temp.toFixed(1)} °C
                    </span>
                  </div>
                  <input
                    type="range"
                    min="35.5"
                    max="40.0"
                    step="0.1"
                    value={temp}
                    onChange={(e) => setTemp(Number(e.target.value))}
                    className="w-full accent-pink-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={septalD}
                    onChange={(e) => setSeptalD(e.target.checked)}
                    className="rounded border-slate-700 text-pink-500 focus:ring-pink-500 bg-slate-900 w-4 h-4"
                  />
                  <span className="text-xs text-slate-300">
                    Interventricular septal D-shaped flattening (LV compression)
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Panel 3: Consumptive Coagulopathy & Fibrinogen */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <h3 className="text-sm font-semibold text-pink-300 flex items-center gap-2 mb-3">
              <Droplets className="w-4 h-4 text-pink-400" />
              Consumptive Coagulation &amp; Fibrinogen
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Serum Fibrinogen</span>
                  <span className={`font-bold ${fibrinogen < 200 ? 'text-rose-400 font-black' : 'text-emerald-400'}`}>
                    {fibrinogen} mg/dL (Pregnancy Target &gt; 200)
                  </span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="600"
                  step="10"
                  value={fibrinogen}
                  onChange={(e) => setFibrinogen(Number(e.target.value))}
                  className="w-full accent-pink-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                  <span>&lt; 100 (Exsanguination)</span>
                  <span>200 (Pregnancy Alert)</span>
                  <span>400-600 (Normal Term)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Platelets</span>
                    <span className={`font-bold ${platelets < 100 ? 'text-rose-400' : 'text-slate-200'}`}>
                      {platelets}k /µL
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="350"
                    step="5"
                    value={platelets}
                    onChange={(e) => setPlatelets(Number(e.target.value))}
                    className="w-full accent-pink-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">INR</span>
                    <span className={`font-bold ${inr > 1.5 ? 'text-rose-400' : 'text-slate-200'}`}>
                      {inr.toFixed(1)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.9"
                    max="3.5"
                    step="0.1"
                    value={inr}
                    onChange={(e) => setInr(Number(e.target.value))}
                    className="w-full accent-pink-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Panel 4: Active Resuscitation & Interventions */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <h3 className="text-sm font-semibold text-pink-300 flex items-center gap-2 mb-3">
              <Syringe className="w-4 h-4 text-pink-400" />
              Targeted AFE Therapeutics
            </h3>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inhaledVasodilator}
                    onChange={(e) => setInhaledVasodilator(e.target.checked)}
                    className="rounded border-slate-700 text-pink-500 focus:ring-pink-500 bg-slate-900 w-4 h-4"
                  />
                  <span className="text-xs text-slate-300 font-medium">Inhaled Epoprostenol / iNO</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={aOkGiven}
                    onChange={(e) => setAOkGiven(e.target.checked)}
                    className="rounded border-slate-700 text-pink-500 focus:ring-pink-500 bg-slate-900 w-4 h-4"
                  />
                  <span className="text-xs text-slate-300 font-medium">A-OK Triple Therapy</span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={txaGiven}
                    onChange={(e) => setTxaGiven(e.target.checked)}
                    className="rounded border-slate-700 text-pink-500 focus:ring-pink-500 bg-slate-900 w-4 h-4"
                  />
                  <span className="text-xs text-slate-300 font-medium">Tranexamic Acid (TXA 1g)</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ecmoActive}
                    onChange={(e) => setEcmoActive(e.target.checked)}
                    className="rounded border-slate-700 text-pink-500 focus:ring-pink-500 bg-slate-900 w-4 h-4"
                  />
                  <span className="text-xs text-slate-300 font-medium">VA-ECMO Cannulated</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Clark Criteria, Gauges, Directives (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Clark Criteria Diagnostic Banner */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              clarkAudit.allCriteriaMet
                ? 'bg-pink-950/40 border-pink-500/60 text-pink-200 shadow-lg shadow-pink-950/20'
                : clarkAudit.diagnosticCertainty.includes('Excluded')
                ? 'bg-amber-950/30 border-amber-500/50 text-amber-200'
                : 'bg-purple-950/30 border-purple-500/50 text-purple-200'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                {clarkAudit.allCriteriaMet ? (
                  <AlertOctagon className="w-8 h-8 text-pink-400 shrink-0 mt-0.5 animate-pulse" />
                ) : (
                  <Info className="w-8 h-8 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="text-xs uppercase tracking-wider font-bold opacity-80">
                    Clark Diagnostic Evaluation (SMFM 2016 Consensus)
                  </div>
                  <h2 className="text-xl font-extrabold mt-0.5">{clarkAudit.diagnosticCertainty}</h2>
                  <p className="text-xs mt-1.5 opacity-90">{clarkAudit.diagnosticSummary}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    clarkAudit.allCriteriaMet
                      ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {clarkAudit.allCriteriaMet ? 'CLARK CRITERIA MET' : 'ATYPICAL / NON-AFE'}
                </span>
              </div>
            </div>
          </div>

          {/* Key Metrics: Clark Scorecard, DIC, RV Strain, ECMO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Pregnancy Modified DIC Card */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Consumptive DIC Severity
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-bold ${
                    dicAudit.isHypofibrinogenemiaCritical
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  Score {dicAudit.modifiedIsthScore}/8
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-100">{fibrinogen}</span>
                <span className="text-xs text-slate-400">mg/dL Fibrinogen</span>
              </div>
              <div className="mt-2 text-xs text-slate-300 font-medium">
                {dicAudit.consumptiveDicSeverity}
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 truncate">
                {dicAudit.hemostaticSummary}
              </div>
            </div>

            {/* 2. Right Heart & Pulmonary Resistance */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Acute Cor Pulmonale
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-bold ${
                    rvAudit.corPulmonaleSeverity.includes('Catastrophic')
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {rvAudit.corPulmonaleSeverity}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-100">{pvr}</span>
                <span className="text-xs text-slate-400">dyn·s/cm⁵ PVR</span>
              </div>
              <div className="mt-2 text-xs text-slate-300">
                RV/LV: <strong className="text-white">{rvLvRatio.toFixed(2)}</strong> | Septal Flattening: <strong className={septalD ? 'text-rose-400' : 'text-emerald-400'}>{septalD ? 'Present' : 'Absent'}</strong>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 truncate">
                {rvAudit.hemodynamicSummary}
              </div>
            </div>

            {/* 3. A-OK Protocol Status */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  A-OK Receptor Antagonism
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-bold ${
                    aOkGiven
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {aOkGiven ? 'Administered' : 'Not Given'}
                </span>
              </div>
              <div className="text-xs text-slate-300 space-y-1 mt-1">
                <div>• <strong>Atropine 1mg:</strong> Vagolysis, counteracts bradycardia</div>
                <div>• <strong>Ondansetron 8mg:</strong> 5-HT3 blockade, stops pulmonary spasm</div>
                <div>• <strong>Ketorolac 30mg:</strong> Cyclooxygenase/thromboxane block</div>
              </div>
            </div>

            {/* 4. ECMO Triage Status */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  VA-ECMO Mechanical Rescue
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-bold ${
                    report.ecmoEligibility.includes('Mandatory')
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 animate-pulse'
                      : report.ecmoEligibility.includes('Consider')
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {report.ecmoEligibility}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-100">{ecmoActive ? 'CANNULATED' : 'STANDBY'}</span>
              </div>
              <div className="mt-2 text-xs text-slate-400">
                Extracorporeal membrane oxygenation bridges through explosive 48-hour RV afterload mismatch and myocardial stunning.
              </div>
            </div>
          </div>

          {/* Contraindicated Actions Warning */}
          {report.contraindicatedActions.length > 0 && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/50 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-300 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Critical Obstetric Contraindications
              </div>
              <ul className="space-y-1.5">
                {report.contraindicatedActions.map((c, idx) => (
                  <li key={idx} className="text-xs text-rose-200 flex items-start gap-2">
                    <span className="text-rose-400 mt-0.5">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actionable Directives */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <h4 className="text-xs font-semibold text-pink-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <FileText className="w-4 h-4 text-pink-400" />
              Actionable Directives &amp; Resuscitation Bundle
            </h4>
            <div className="space-y-2">
              {report.actionableDirectives.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-200 flex items-start gap-2.5"
                >
                  <ChevronRight className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
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
