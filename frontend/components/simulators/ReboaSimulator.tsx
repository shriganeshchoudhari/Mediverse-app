'use client';

import React, { useState, useMemo } from 'react';
import {
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
  TrendingDown,
  Droplets,
  Radio
} from 'lucide-react';
import {
  calculateHemodynamicGradients,
  auditIschemiaReperfusionWindow,
  evaluateReboaSafety,
  REBOA_SCENARIOS,
  PatientReboaState,
  AorticZone,
  OcclusionStrategy,
  InjuryPhenotype
} from '../../.gemini/skills/ReboaPhysiologyEngine';

export default function ReboaSimulator() {
  const [selectedScenarioKey, setSelectedScenarioKey] = useState<string>('pelvic_zone3_preboa');
  const scenario = REBOA_SCENARIOS[selectedScenarioKey] || REBOA_SCENARIOS.pelvic_zone3_preboa;

  // Patient Clinical State
  const [injuryPhenotype, setInjuryPhenotype] = useState<InjuryPhenotype>(scenario.initialState.injuryPhenotype);
  const [zone, setZone] = useState<AorticZone>(scenario.initialState.balloonZone);
  const [strategy, setStrategy] = useState<OcclusionStrategy>(scenario.initialState.occlusionStrategy);
  const [inflationVol, setInflationVol] = useState<number>(scenario.initialState.inflationVolumeMl);
  const [durationMin, setDurationMin] = useState<number>(scenario.initialState.totalInflationDurationMinutes);

  // Arterial Line Hemodynamics
  const [radialSbp, setRadialSbp] = useState<number>(scenario.initialState.radialArtLineSbp);
  const [radialDbp, setRadialDbp] = useState<number>(scenario.initialState.radialArtLineDbp);
  const [femoralMap, setFemoralMap] = useState<number>(scenario.initialState.femoralArtLineMeanBp);

  // Resuscitation & Labs
  const [unitsPrbc, setUnitsPrbc] = useState<number>(scenario.initialState.unitsPrbcTransfused);
  const [lactate, setLactate] = useState<number>(scenario.initialState.serumLactateMmolL);
  const [potassium, setPotassium] = useState<number>(scenario.initialState.serumPotassiumMeqL);
  const [arterialPh, setArterialPh] = useState<number>(scenario.initialState.pHValue);
  const [hemostasisAchieved, setHemostasisAchieved] = useState<boolean>(scenario.initialState.ongoingSurgicalControlAchieved);

  // Load Scenario Preset
  const handleLoadScenario = (key: string) => {
    setSelectedScenarioKey(key);
    const sc = REBOA_SCENARIOS[key];
    if (!sc) return;

    setInjuryPhenotype(sc.initialState.injuryPhenotype);
    setZone(sc.initialState.balloonZone);
    setStrategy(sc.initialState.occlusionStrategy);
    setInflationVol(sc.initialState.inflationVolumeMl);
    setDurationMin(sc.initialState.totalInflationDurationMinutes);

    setRadialSbp(sc.initialState.radialArtLineSbp);
    setRadialDbp(sc.initialState.radialArtLineDbp);
    setFemoralMap(sc.initialState.femoralArtLineMeanBp);

    setUnitsPrbc(sc.initialState.unitsPrbcTransfused);
    setLactate(sc.initialState.serumLactateMmolL);
    setPotassium(sc.initialState.serumPotassiumMeqL);
    setArterialPh(sc.initialState.pHValue);
    setHemostasisAchieved(sc.initialState.ongoingSurgicalControlAchieved);
  };

  // Compile Current Patient State
  const currentState: PatientReboaState = useMemo(
    () => ({
      patientAge: scenario.initialState.patientAge,
      injuryPhenotype,
      balloonZone: zone,
      occlusionStrategy: strategy,
      inflationVolumeMl: inflationVol,
      totalInflationDurationMinutes: durationMin,
      radialArtLineSbp: radialSbp,
      radialArtLineDbp: radialDbp,
      femoralArtLineMeanBp: femoralMap,
      unitsPrbcTransfused: unitsPrbc,
      serumLactateMmolL: lactate,
      serumPotassiumMeqL: potassium,
      pHValue: arterialPh,
      ongoingSurgicalControlAchieved: hemostasisAchieved,
    }),
    [
      scenario.initialState.patientAge,
      injuryPhenotype,
      zone,
      strategy,
      inflationVol,
      durationMin,
      radialSbp,
      radialDbp,
      femoralMap,
      unitsPrbc,
      lactate,
      potassium,
      arterialPh,
      hemostasisAchieved,
    ]
  );

  // Engine Calculations
  const hemoAudit = useMemo(() => calculateHemodynamicGradients(currentState), [currentState]);
  const ischAudit = useMemo(() => auditIschemiaReperfusionWindow(currentState), [currentState]);
  const verdict = useMemo(() => evaluateReboaSafety(currentState), [currentState]);

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 lg:p-8">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400">
                <Heart className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-rose-400 via-amber-300 to-red-500 bg-clip-text text-transparent">
                  REBOA &amp; Aortic Occlusion Workstation
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Zone 1 vs Zone 3 Aortic Occlusion, Partial REBOA (pREBOA) Titration, Ischemia-Reperfusion Windows &amp; Damage Control Resuscitation
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-rose-950/60 border border-rose-800/50 text-rose-300 text-xs font-semibold rounded-full flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 animate-pulse text-rose-400" />
              EAST / JTS Trauma Protocol
            </span>
          </div>
        </div>

        {/* Clinical Scenario Selector */}
        <div className="mt-6">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Select High-Acuity Exsanguination Scenario
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {Object.entries(REBOA_SCENARIOS).map(([key, sc]) => {
              const isSelected = selectedScenarioKey === key;
              return (
                <button
                  key={key}
                  onClick={() => handleLoadScenario(key)}
                  className={`text-left p-3 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                    isSelected
                      ? 'bg-rose-950/40 border-rose-500/60 text-rose-200 shadow-md shadow-rose-950/30'
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
              <Info className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider">
                  Case Vignette ({scenario.name})
                </span>
                <p className="text-xs text-slate-300 mt-0.5">{scenario.patientSummary}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {scenario.clinicalPearls.map((pearl, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-800 text-[11px] text-slate-300 border border-slate-700"
                    >
                      <Sparkles className="w-3 h-3 text-rose-400" />
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
              Reset Vignette
            </button>
          </div>
        </div>
      </div>

      {/* Main Workstation Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Panel 1: Aortic Occlusion Zone & Strategy */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-rose-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-rose-400" />
                Aortic Occlusion Zone
              </h3>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                zone === 'zone_1_thoracic'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                  : zone === 'zone_2_visceral_no_occlusion'
                  ? 'bg-rose-600/30 text-rose-300 border border-rose-500 animate-pulse'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {zone === 'zone_1_thoracic' ? 'Zone 1 (Thoracic)' : zone === 'zone_2_visceral_no_occlusion' ? 'Zone 2 (NO-FLY)' : 'Zone 3 (Infrarenal)'}
              </span>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'zone_1_thoracic', label: 'Zone 1', sub: 'Thoracic (T4-T12)' },
                    { id: 'zone_2_visceral_no_occlusion', label: 'Zone 2', sub: 'Visceral (NO-FLY)' },
                    { id: 'zone_3_infrarenal', label: 'Zone 3', sub: 'Infrarenal (L3-L5)' },
                  ] as const
                ).map((z) => (
                  <button
                    key={z.id}
                    onClick={() => setZone(z.id)}
                    className={`p-2 rounded-lg text-xs font-medium border text-center transition ${
                      zone === z.id
                        ? z.id === 'zone_2_visceral_no_occlusion'
                          ? 'bg-rose-900/40 border-rose-500 text-rose-200 font-bold'
                          : 'bg-rose-600/30 border-rose-500 text-rose-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold">{z.label}</div>
                    <div className="text-[10px] opacity-75">{z.sub}</div>
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1.5 font-medium">Occlusion Modality</label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { id: 'complete_reboa', label: 'Complete REBOA (cREBOA)' },
                      { id: 'partial_preboa', label: 'Partial REBOA (pREBOA)' },
                      { id: 'intermittent_ireboa', label: 'Intermittent (iREBOA)' },
                      { id: 'deflated_standby', label: 'Deflated Standby' },
                    ] as const
                  ).map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setStrategy(m.id)}
                      className={`py-2 px-2 rounded-lg text-xs font-medium border text-center transition ${
                        strategy === m.id
                          ? 'bg-rose-600/30 border-rose-500 text-rose-200'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Panel 2: Balloon Inflation & Ischemic Timer */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <h3 className="text-sm font-semibold text-rose-300 flex items-center gap-2 mb-3">
              <Timer className="w-4 h-4 text-rose-400" />
              Inflation Volume &amp; Ischemia Duration
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Balloon Inflation Volume</span>
                  <span className="text-rose-400 font-bold">{inflationVol.toFixed(1)} mL</span>
                </div>
                <input aria-label="Balloon Inflation Volume"
                  type="range"
                  min="0"
                  max="12"
                  step="0.5"
                  value={inflationVol}
                  onChange={(e) => setInflationVol(Number(e.target.value))}
                  className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                  <span>0 mL (Deflated)</span>
                  <span>~2-4 mL (Zone 3)</span>
                  <span>~8 mL (Zone 1 max)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Total Inflation Time Elapsed</span>
                  <span className={`font-bold ${
                    durationMin > ischAudit.maxSafeDurationMinutes
                      ? 'text-rose-400 font-black animate-pulse'
                      : durationMin >= ischAudit.maxSafeDurationMinutes - 10
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}>
                    {durationMin} minutes (Ceiling: {ischAudit.maxSafeDurationMinutes} min)
                  </span>
                </div>
                <input aria-label="Duration Min"
                  type="range"
                  min="0"
                  max="90"
                  step="2"
                  value={durationMin}
                  onChange={(e) => setDurationMin(Number(e.target.value))}
                  className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                  <span>0 min</span>
                  <span>30 min (Zone 1 limit)</span>
                  <span>60 min (Zone 3 limit)</span>
                  <span>90 min</span>
                </div>
              </div>
            </div>
          </div>

          {/* Panel 3: Dual Arterial Line Transduction */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <h3 className="text-sm font-semibold text-rose-300 flex items-center gap-2 mb-3">
              <Gauge className="w-4 h-4 text-rose-400" />
              Dual Arterial Line Transduction
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Radial / Proximal SBP</span>
                  <span className={`font-bold ${radialSbp > 160 ? 'text-rose-400' : radialSbp < 80 ? 'text-amber-400' : 'text-slate-200'}`}>
                    {radialSbp} mmHg (MAP {hemoAudit.proximalMap})
                  </span>
                </div>
                <input aria-label="Radial / Proximal SBP"
                  type="range"
                  min="50"
                  max="200"
                  value={radialSbp}
                  onChange={(e) => setRadialSbp(Number(e.target.value))}
                  className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Radial / Proximal DBP</span>
                  <span className="text-slate-200 font-semibold">{radialDbp} mmHg</span>
                </div>
                <input aria-label="Radial / Proximal DBP"
                  type="range"
                  min="30"
                  max="120"
                  value={radialDbp}
                  onChange={(e) => setRadialDbp(Number(e.target.value))}
                  className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Femoral / Distal Mean BP</span>
                  <span className={`font-bold ${
                    femoralMap >= 35 && femoralMap <= 45
                      ? 'text-emerald-400'
                      : femoralMap < 25
                      ? 'text-blue-400'
                      : 'text-amber-400'
                  }`}>
                    {femoralMap} mmHg (Target pREBOA: 35-45)
                  </span>
                </div>
                <input aria-label="Femoral Map"
                  type="range"
                  min="10"
                  max="80"
                  value={femoralMap}
                  onChange={(e) => setFemoralMap(Number(e.target.value))}
                  className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Panel 4: Resuscitation & Critical Labs */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <h3 className="text-sm font-semibold text-rose-300 flex items-center gap-2 mb-3">
              <Droplets className="w-4 h-4 text-rose-400" />
              Damage Control Labs &amp; Transfusion
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">PRBC Transfused</span>
                    <span className="text-rose-400 font-bold">{unitsPrbc} units</span>
                  </div>
                  <input aria-label="PRBC Transfused"
                    type="range"
                    min="0"
                    max="18"
                    value={unitsPrbc}
                    onChange={(e) => setUnitsPrbc(Number(e.target.value))}
                    className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Arterial Lactate</span>
                    <span className={`font-bold ${lactate > 6.0 ? 'text-rose-400' : 'text-slate-200'}`}>
                      {lactate.toFixed(1)} mmol/L
                    </span>
                  </div>
                  <input aria-label="Arterial Lactate"
                    type="range"
                    min="1.0"
                    max="16.0"
                    step="0.5"
                    value={lactate}
                    onChange={(e) => setLactate(Number(e.target.value))}
                    className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Serum K+</span>
                    <span className={`font-bold ${potassium >= 5.5 ? 'text-rose-400' : 'text-slate-200'}`}>
                      {potassium.toFixed(1)} mEq/L
                    </span>
                  </div>
                  <input aria-label="Serum K+"
                    type="range"
                    min="3.0"
                    max="7.5"
                    step="0.1"
                    value={potassium}
                    onChange={(e) => setPotassium(Number(e.target.value))}
                    className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Arterial pH</span>
                    <span className={`font-bold ${arterialPh < 7.25 ? 'text-rose-400' : 'text-slate-200'}`}>
                      {arterialPh.toFixed(2)}
                    </span>
                  </div>
                  <input aria-label="Arterial pH"
                    type="range"
                    min="6.90"
                    max="7.45"
                    step="0.01"
                    value={arterialPh}
                    onChange={(e) => setArterialPh(Number(e.target.value))}
                    className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hemostasisAchieved}
                    onChange={(e) => setHemostasisAchieved(e.target.checked)}
                    className="rounded border-slate-700 text-rose-500 focus:ring-rose-500 bg-slate-900 w-4 h-4"
                  />
                  <span className="text-xs text-slate-300 font-semibold">
                    Definitive Surgical / Interventional Angio Hemostasis Achieved
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Gauges, Reperfusion Risk, Protocol (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Critical Alert / Contraindication Banner */}
          {verdict.contraindicationAlert ? (
            <div className="p-4 rounded-2xl bg-rose-950/60 border-2 border-rose-500 text-rose-200 animate-pulse">
              <div className="flex items-start gap-3">
                <AlertOctagon className="w-8 h-8 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-base font-extrabold text-white">PROCEDURAL CONTRAINDICATION ALERT</h3>
                  <p className="text-xs mt-1 leading-relaxed">{verdict.contraindicationAlert}</p>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`p-5 rounded-2xl border transition-all ${
                ischAudit.ischemicRiskTier === 'critical_necrosis_imminent'
                  ? 'bg-rose-950/30 border-rose-500/50 text-rose-200'
                  : ischAudit.ischemicRiskTier === 'caution'
                  ? 'bg-amber-950/30 border-amber-500/50 text-amber-200'
                  : 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  {ischAudit.ischemicRiskTier === 'safe' ? (
                    <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0 mt-0.5" />
                  ) : ischAudit.ischemicRiskTier === 'caution' ? (
                    <Timer className="w-8 h-8 text-amber-400 shrink-0 mt-0.5" />
                  ) : (
                    <ShieldAlert className="w-8 h-8 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="text-xs uppercase tracking-wider font-bold opacity-80">
                      Physiological Status Verdict
                    </div>
                    <h2 className="text-xl font-extrabold mt-0.5">
                      {ischAudit.ischemicRiskTier === 'safe'
                        ? 'REBOA OCCLUSION PHYSIOLOGICALLY STABLE'
                        : ischAudit.ischemicRiskTier === 'caution'
                        ? 'ISCHEMIC TIME RUNNING OUT - PREPARE pREBOA'
                        : 'CRITICAL ISCHEMIC THRESHOLD EXCEEDED - MANDATORY RELEASE'}
                    </h2>
                    <p className="text-xs mt-1.5 opacity-90">{verdict.strategyRecommendation}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      ischAudit.ischemicRiskTier === 'safe'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : ischAudit.ischemicRiskTier === 'caution'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    {ischAudit.ischemicRiskTier.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Key Metrics: Proximal vs Distal MAP, Reperfusion Washout, K+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Transverse Pressure Gradient */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Transverse Gradient
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-bold ${
                    hemoAudit.coronaryCerebralPerfusionAdequate
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {hemoAudit.coronaryCerebralPerfusionAdequate ? 'Perfusion OK' : 'Arrest Risk'}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-100">{hemoAudit.transverseGradientMmHg}</span>
                <span className="text-xs text-slate-400">mmHg (Aortic ΔP)</span>
              </div>
              <div className="mt-2 text-xs text-slate-300">
                Proximal MAP: <strong className="text-white">{hemoAudit.proximalMap}</strong> | Distal MAP: <strong className="text-rose-400">{hemoAudit.distalMap}</strong>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 truncate">
                {hemoAudit.summary}
              </div>
            </div>

            {/* 2. Expected Post-Deflation K+ */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Post-Deflation Serum K+
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-bold ${
                    ischAudit.postDeflationExpectedPotassium >= 6.0
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {ischAudit.postDeflationExpectedPotassium >= 6.0 ? 'Lethal Washout Risk' : 'Manageable K+'}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-100">{ischAudit.postDeflationExpectedPotassium.toFixed(1)}</span>
                <span className="text-xs text-slate-400">mEq/L (Predicted Peak)</span>
              </div>
              <div className="mt-2 text-xs text-slate-300">
                Baseline K+: {potassium.toFixed(1)} mEq/L | Projected Surge: +{(ischAudit.postDeflationExpectedPotassium - potassium).toFixed(1)}
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 truncate">
                {ischAudit.postDeflationExpectedPotassium >= 6.0
                  ? 'Administer 1g IV Calcium Chloride prior to release'
                  : 'Routine post-deflation blood gas monitoring'}
              </div>
            </div>

            {/* 3. Reperfusion Shock Risk Index */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Reperfusion Shock Score
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-bold ${
                    ischAudit.reperfusionShockRiskScore > 65
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      : ischAudit.reperfusionShockRiskScore > 35
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {ischAudit.reperfusionShockRiskScore}/100
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-100">{ischAudit.reperfusionShockRiskScore}</span>
                <span className="text-xs text-slate-400">/100 Vasoplegia Index</span>
              </div>
              <div className="mt-2 text-xs text-slate-400">
                Washout of distal adenosine, lactic acid, and reactive hyperemia will trigger profound vasodilation drop in SBP.
              </div>
            </div>

            {/* 4. Expected Post-Deflation Lactate */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Predicted Lactate Washout
                </span>
                <span className="text-xs px-2 py-0.5 rounded font-bold bg-slate-800 text-slate-300">
                  Peak Surge
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-100">{ischAudit.postDeflationExpectedLactate.toFixed(1)}</span>
                <span className="text-xs text-slate-400">mmol/L</span>
              </div>
              <div className="mt-2 text-xs text-slate-300">
                Baseline: {lactate.toFixed(1)} mmol/L | Washout Acidosis
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 truncate">
                Prepare 8.4% Sodium Bicarbonate infusion for refractory metabolic acidosis.
              </div>
            </div>
          </div>

          {/* Washout Acidosis Warning (if present) */}
          {ischAudit.washoutAcidosisWarning && (
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/50 text-amber-200 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{ischAudit.washoutAcidosisWarning}</span>
            </div>
          )}

          {/* Damage Control Checklist & Step-by-Step Deflation Protocol */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Checklist */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Resuscitation Milestones ({verdict.damageControlChecklist.length})
              </h4>
              {verdict.damageControlChecklist.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No milestones satisfied yet.</p>
              ) : (
                <ul className="space-y-2">
                  {verdict.damageControlChecklist.map((item, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Protocol */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <h4 className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                <FileText className="w-4 h-4 text-rose-400" />
                Deflation Protocol Directives
              </h4>
              <ul className="space-y-2">
                {verdict.deflationProtocolSteps.map((step, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
