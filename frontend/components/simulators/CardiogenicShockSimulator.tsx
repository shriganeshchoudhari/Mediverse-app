'use client';

import React, { useState, useMemo } from 'react';
import {
  HeartPulse,
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
  Cpu,
} from 'lucide-react';
import {
  computeHemodynamics,
  classifyScaiStage,
  auditRvFailure,
  recommendMcsEscalation,
  SHOCK_SCENARIOS,
  HemodynamicProfile,
  InotropeVasopressorDoses,
  McsDeviceType,
  ScaiStage,
} from '../../.gemini/skills/CardiogenicShockEngine';

export default function CardiogenicShockSimulator() {
  const [selectedScenarioKey, setSelectedScenarioKey] = useState<string>('anterior_stemi_stage_c');
  const scenario = SHOCK_SCENARIOS[selectedScenarioKey] || SHOCK_SCENARIOS.anterior_stemi_stage_c;

  // Hemodynamic Profile State
  const [sbp, setSbp] = useState<number>(scenario.initialHemodynamics.systolicBpMmHg);
  const [dbp, setDbp] = useState<number>(scenario.initialHemodynamics.diastolicBpMmHg);
  const [hr, setHr] = useState<number>(scenario.initialHemodynamics.heartRateBpm);
  const [co, setCo] = useState<number>(scenario.initialHemodynamics.cardiacOutputLpm);
  const [cvp, setCvp] = useState<number>(scenario.initialHemodynamics.centralVenousPressureMmHg);
  const [mpap, setMpap] = useState<number>(scenario.initialHemodynamics.meanPulmonaryArteryPressureMmHg);
  const [pasp, setPasp] = useState<number>(scenario.initialHemodynamics.pulmonaryArterySystolicMmHg);
  const [padp, setPadp] = useState<number>(scenario.initialHemodynamics.pulmonaryArteryDiastolicMmHg);
  const [pcwp, setPcwp] = useState<number>(scenario.initialHemodynamics.pulmonaryCapillaryWedgePressureMmHg);
  const [lactate, setLactate] = useState<number>(scenario.initialHemodynamics.arterialLactateMmolL);
  const [svo2, setSvo2] = useState<number>(scenario.initialHemodynamics.mixedVenousSatSvo2Percent);
  const [uop, setUop] = useState<number>(scenario.initialHemodynamics.urineOutputMlKgHr);
  const [cardiacArrestMod, setCardiacArrestMod] = useState<boolean>(scenario.initialHemodynamics.hasCardiacArrestModifier);

  // Vasoactives State
  const [norepi, setNorepi] = useState<number>(scenario.initialVasoactives.norepinephrineMcgKgMin);
  const [epi, setEpi] = useState<number>(scenario.initialVasoactives.epinephrineMcgKgMin);
  const [dobutamine, setDobutamine] = useState<number>(scenario.initialVasoactives.dobutamineMcgKgMin);
  const [milrinone, setMilrinone] = useState<number>(scenario.initialVasoactives.milrinoneMcgKgMin);
  const [vaso, setVaso] = useState<number>(scenario.initialVasoactives.vasopressinUnitsMin);

  // MCS Device State
  const [currentDevice, setCurrentDevice] = useState<McsDeviceType>(scenario.initialDevice);

  // Derived MAP & CI (BSA assumed 1.9 m2)
  const bsa = 1.9;
  const map = useMemo(() => Math.round((2 * dbp + sbp) / 3), [sbp, dbp]);
  const ci = useMemo(() => parseFloat((co / bsa).toFixed(2)), [co, bsa]);

  // Load Scenario Preset
  const handleLoadScenario = (key: string) => {
    setSelectedScenarioKey(key);
    const sc = SHOCK_SCENARIOS[key];
    if (!sc) return;

    setSbp(sc.initialHemodynamics.systolicBpMmHg);
    setDbp(sc.initialHemodynamics.diastolicBpMmHg);
    setHr(sc.initialHemodynamics.heartRateBpm);
    setCo(sc.initialHemodynamics.cardiacOutputLpm);
    setCvp(sc.initialHemodynamics.centralVenousPressureMmHg);
    setMpap(sc.initialHemodynamics.meanPulmonaryArteryPressureMmHg);
    setPasp(sc.initialHemodynamics.pulmonaryArterySystolicMmHg);
    setPadp(sc.initialHemodynamics.pulmonaryArteryDiastolicMmHg);
    setPcwp(sc.initialHemodynamics.pulmonaryCapillaryWedgePressureMmHg);
    setLactate(sc.initialHemodynamics.arterialLactateMmolL);
    setSvo2(sc.initialHemodynamics.mixedVenousSatSvo2Percent);
    setUop(sc.initialHemodynamics.urineOutputMlKgHr);
    setCardiacArrestMod(sc.initialHemodynamics.hasCardiacArrestModifier);

    setNorepi(sc.initialVasoactives.norepinephrineMcgKgMin);
    setEpi(sc.initialVasoactives.epinephrineMcgKgMin);
    setDobutamine(sc.initialVasoactives.dobutamineMcgKgMin);
    setMilrinone(sc.initialVasoactives.milrinoneMcgKgMin);
    setVaso(sc.initialVasoactives.vasopressinUnitsMin);
    setCurrentDevice(sc.initialDevice);
  };

  // Compile Current Patient State
  const currentHemoProfile: HemodynamicProfile = useMemo(
    () => ({
      systolicBpMmHg: sbp,
      diastolicBpMmHg: dbp,
      meanArterialPressureMmHg: map,
      heartRateBpm: hr,
      cardiacOutputLpm: co,
      cardiacIndexLpmM2: ci,
      bodySurfaceAreaM2: bsa,
      centralVenousPressureMmHg: cvp,
      meanPulmonaryArteryPressureMmHg: mpap,
      pulmonaryArterySystolicMmHg: pasp,
      pulmonaryArteryDiastolicMmHg: padp,
      pulmonaryCapillaryWedgePressureMmHg: pcwp,
      arterialLactateMmolL: lactate,
      mixedVenousSatSvo2Percent: svo2,
      urineOutputMlKgHr: uop,
      hasCardiacArrestModifier: cardiacArrestMod,
    }),
    [sbp, dbp, map, hr, co, ci, bsa, cvp, mpap, pasp, padp, pcwp, lactate, svo2, uop, cardiacArrestMod]
  );

  const currentDrugs: InotropeVasopressorDoses = useMemo(
    () => ({
      norepinephrineMcgKgMin: norepi,
      epinephrineMcgKgMin: epi,
      dobutamineMcgKgMin: dobutamine,
      milrinoneMcgKgMin: milrinone,
      vasopressinUnitsMin: vaso,
      dopamineMcgKgMin: 0,
    }),
    [norepi, epi, dobutamine, milrinone, vaso]
  );

  // Engine Outputs
  const metrics = useMemo(() => computeHemodynamics(currentHemoProfile, currentDrugs), [currentHemoProfile, currentDrugs]);
  const scaiReport = useMemo(
    () => classifyScaiStage(currentHemoProfile, currentDrugs, currentDevice),
    [currentHemoProfile, currentDrugs, currentDevice]
  );
  const rvAudit = useMemo(() => auditRvFailure(currentHemoProfile), [currentHemoProfile]);
  const mcsRecommendation = useMemo(
    () => recommendMcsEscalation(currentHemoProfile, currentDrugs, currentDevice),
    [currentHemoProfile, currentDrugs, currentDevice]
  );

  // Deploy Recommended Device Maneuver
  const handleDeployDevice = (device: McsDeviceType) => {
    setCurrentDevice(device);
    if (device === 'impella_cp') {
      setCo((prev) => parseFloat((prev + 2.5).toFixed(1)));
      setSbp((prev) => Math.min(130, prev + 18));
      setPcwp((prev) => Math.max(12, prev - 8));
      setLactate((prev) => Math.max(1.2, parseFloat((prev * 0.7).toFixed(1))));
    } else if (device === 'ecpella_combined' || device === 'va_ecmo') {
      setCo((prev) => parseFloat((prev + 3.5).toFixed(1)));
      setSbp((prev) => Math.min(140, prev + 25));
      setPcwp((prev) => (device === 'ecpella_combined' ? Math.max(10, prev - 10) : prev + 4));
      setCvp((prev) => Math.max(8, prev - 6));
      setLactate((prev) => Math.max(1.5, parseFloat((prev * 0.6).toFixed(1))));
    } else if (device === 'iabp_counterpulsation') {
      setCo((prev) => parseFloat((prev + 0.6).toFixed(1)));
      setSbp((prev) => prev + 6);
      setPcwp((prev) => Math.max(14, prev - 3));
    }
  };

  const handleReset = () => {
    handleLoadScenario(selectedScenarioKey);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <HeartPulse className="w-5 h-5 animate-pulse" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">
                Critical Care Cardiology &amp; Hemodynamics Suite
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Cardiogenic Shock &amp; Mechanical Circulatory Support (MCS) Workstation
            </h1>
            <p className="text-sm text-slate-400 max-w-3xl">
              Biophysical simulation of SCAI Shock Classification (Stages A to E), invasive Swan-Ganz hemodynamic
              indices (Cardiac Power Output [CPO], PAPi, PVR, SVR), biventricular failure phenotyping, and device
              escalation (IABP, Impella CP/5.5, VA-ECMO, ECPELLA).
            </p>
          </div>

          {/* Quick Status Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div
              className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 ${
                scaiReport.stage === 'E' || scaiReport.stage === 'D'
                  ? 'bg-rose-950/80 border-rose-800 text-rose-300 animate-pulse'
                  : scaiReport.stage === 'C'
                  ? 'bg-amber-950/80 border-amber-800 text-amber-300'
                  : 'bg-emerald-950/70 border-emerald-800 text-emerald-300'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              SCAI {scaiReport.stageWithModifier}
            </div>

            <div
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold ${
                metrics.cardiacPowerOutputWatts < 0.6
                  ? 'bg-rose-950/60 border-rose-800 text-rose-300'
                  : 'bg-slate-800 border-slate-700 text-emerald-400'
              }`}
            >
              CPO: {metrics.cardiacPowerOutputWatts} W
            </div>

            <div
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold ${
                rvAudit.isRvFailurePresent
                  ? 'bg-purple-950/60 border-purple-800 text-purple-300'
                  : 'bg-slate-800 border-slate-700 text-cyan-300'
              }`}
            >
              PAPi: {metrics.pulmonaryArteryPulsatilityIndex}
            </div>
          </div>
        </div>

        {/* Clinical Scenario Preset Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80">
          <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-rose-400" />
            Standard Cardiogenic Shock Scenarios:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2">
            {Object.entries(SHOCK_SCENARIOS).map(([key, sc]) => {
              const isSelected = selectedScenarioKey === key;
              return (
                <button
                  key={key}
                  onClick={() => handleLoadScenario(key)}
                  className={`px-3 py-2 text-left rounded-xl border text-xs transition-all ${
                    isSelected
                      ? 'bg-rose-950/40 border-rose-500/50 text-rose-200 shadow-md ring-1 ring-rose-500/30'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="font-semibold truncate">{sc.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                    MAP {sc.initialHemodynamics.meanArterialPressureMmHg} &bull; CI {sc.initialHemodynamics.cardiacIndexLpmM2} &bull; Lact {sc.initialHemodynamics.arterialLactateMmolL}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-3 p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/50 text-xs text-slate-300">
            <span className="font-semibold text-rose-300">Clinical Vignette: </span>
            {scenario.patientSummary}
          </div>
        </div>
      </div>

      {/* Main Grid: Hemodynamics (5 cols) & SCAI/MCS Analysis (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Hemodynamics & Vasoactive Bench (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Swan-Ganz Catheter Profile Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <Gauge className="w-5 h-5" />
                </span>
                <h2 className="text-base font-bold text-white">Invasive Hemodynamics (PAC)</h2>
              </div>
              <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                <input
                  type="checkbox"
                  checked={cardiacArrestMod}
                  onChange={(e) => setCardiacArrestMod(e.target.checked)}
                  className="w-3.5 h-3.5 accent-rose-500 rounded"
                />
                <span>Cardiac Arrest (+A)</span>
              </label>
            </div>

            {/* Core Pressures */}
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Blood Pressure (Systolic / Diastolic)</span>
                  <span className="font-mono font-bold text-slate-200">
                    {sbp} / {dbp} mmHg (MAP {map})
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input aria-label="Blood Pressure (Systolic / Diastolic)"
                    type="range"
                    min="50"
                    max="160"
                    value={sbp}
                    onChange={(e) => setSbp(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
                  <input aria-label="Dbp"
                    type="range"
                    min="30"
                    max="100"
                    value={dbp}
                    onChange={(e) => setDbp(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Cardiac Output / Index</span>
                  <span className={`font-mono font-bold ${ci < 2.2 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {co.toFixed(1)} L/min ({ci} L/min/m&sup2;)
                  </span>
                </div>
                <input aria-label="Cardiac Output / Index"
                  type="range"
                  min="1.0"
                  max="8.0"
                  step="0.1"
                  value={co}
                  onChange={(e) => setCo(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <span className="text-[10px] text-slate-500">&lt; 2.2 L/min/m&sup2; = Classic Shock Threshold</span>
              </div>

              {/* Wedge and CVP */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">PCWP (Wedge)</span>
                    <span className={`font-mono font-bold ${pcwp > 18 ? 'text-rose-400' : 'text-slate-200'}`}>
                      {pcwp} mmHg
                    </span>
                  </div>
                  <input aria-label="PCWP (Wedge)"
                    type="range"
                    min="4"
                    max="35"
                    value={pcwp}
                    onChange={(e) => setPcwp(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
                  <span className="text-[10px] text-slate-500">&gt; 18 = Pulmonary Congestion</span>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">CVP (RA Pressure)</span>
                    <span className={`font-mono font-bold ${cvp >= 15 ? 'text-purple-400' : 'text-slate-200'}`}>
                      {cvp} mmHg
                    </span>
                  </div>
                  <input aria-label="CVP (RA Pressure)"
                    type="range"
                    min="2"
                    max="28"
                    value={cvp}
                    onChange={(e) => setCvp(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                  <span className="text-[10px] text-slate-500">Target &lt; 12-14 mmHg</span>
                </div>
              </div>

              {/* PA Pressures */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div>
                  <span className="text-slate-400 block text-[10px]">PA Systolic</span>
                  <input
                    type="number"
                    value={pasp}
                    onChange={(e) => setPasp(parseInt(e.target.value) || 0)}
                    className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-800 font-mono text-xs text-white"
                  />
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">PA Diastolic</span>
                  <input
                    type="number"
                    value={padp}
                    onChange={(e) => setPadp(parseInt(e.target.value) || 0)}
                    className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-800 font-mono text-xs text-white"
                  />
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Mean PA</span>
                  <input
                    type="number"
                    value={mpap}
                    onChange={(e) => setMpap(parseInt(e.target.value) || 0)}
                    className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-800 font-mono text-xs text-white"
                  />
                </div>
              </div>

              {/* Lactate & Urine Output */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Arterial Lactate</span>
                  <span
                    className={`font-mono font-bold ${
                      lactate >= 4.0 ? 'text-rose-400' : lactate >= 2.0 ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  >
                    {lactate.toFixed(1)} mmol/L
                  </span>
                </div>
                <input aria-label="Lactate"
                  type="range"
                  min="0.5"
                  max="14.0"
                  step="0.1"
                  value={lactate}
                  onChange={(e) => setLactate(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Normal &lt; 2.0</span>
                  <span>&ge; 2.0 = Stage C Shock</span>
                  <span>&ge; 8.0 = Stage E Extremis</span>
                </div>
              </div>
            </div>
          </div>

          {/* Vasoactive & Inotropic Support Bench */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Syringe className="w-5 h-5" />
                </span>
                <h2 className="text-base font-bold text-white">Vasoactive &amp; Inotropic Support</h2>
              </div>
              <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-slate-800 text-amber-300 border border-slate-700">
                VIS: {metrics.vasoactiveInotropicScore}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Norepinephrine (&alpha;1 &gt; &beta;1)</span>
                  <span className="font-mono font-bold text-rose-400">{norepi.toFixed(2)} mcg/kg/min</span>
                </div>
                <input aria-label="Norepinephrine (&alpha;1 &gt; &beta;1)"
                  type="range"
                  min="0"
                  max="0.8"
                  step="0.02"
                  value={norepi}
                  onChange={(e) => setNorepi(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Dobutamine (&beta;1 inotrope)</span>
                  <span className="font-mono font-bold text-cyan-400">{dobutamine.toFixed(1)} mcg/kg/min</span>
                </div>
                <input aria-label="Dobutamine (&beta;1 inotrope)"
                  type="range"
                  min="0"
                  max="20"
                  step="0.5"
                  value={dobutamine}
                  onChange={(e) => setDobutamine(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Epinephrine</span>
                    <span className="font-mono font-bold text-slate-200">{epi.toFixed(2)}</span>
                  </div>
                  <input aria-label="Epinephrine"
                    type="range"
                    min="0"
                    max="0.5"
                    step="0.02"
                    value={epi}
                    onChange={(e) => setEpi(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Vasopressin</span>
                    <span className="font-mono font-bold text-slate-200">{vaso.toFixed(2)}</span>
                  </div>
                  <input aria-label="Vasopressin"
                    type="range"
                    min="0"
                    max="0.04"
                    step="0.01"
                    value={vaso}
                    onChange={(e) => setVaso(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: SCAI Staging, Hemodynamic Gauges & MCS Support (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* SCAI SHOCK STAGE CLASSIFICATION CARD */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                  <AlertOctagon className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-white">SCAI Shock Classification (2019 / 2022)</h2>
                  <p className="text-xs text-slate-400">Standardized cardiogenic shock severity stratification</p>
                </div>
              </div>

              <span
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border ${
                  scaiReport.stage === 'E' || scaiReport.stage === 'D'
                    ? 'bg-rose-950 text-rose-300 border-rose-800'
                    : scaiReport.stage === 'C'
                    ? 'bg-amber-950 text-amber-300 border-amber-800'
                    : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                }`}
              >
                {scaiReport.stageName}
              </span>
            </div>

            {/* Mortality & Setting Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Predicted In-Hospital Mortality</span>
                <span
                  className={`text-xl font-mono font-bold ${
                    scaiReport.mortalityRiskPercent >= 40 ? 'text-rose-400' : 'text-amber-400'
                  }`}
                >
                  ~{scaiReport.mortalityRiskPercent}%
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  {cardiacArrestMod ? 'Markedly elevated by cardiac arrest (+A)' : 'Standard SCAI trajectory'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Recommended Care Setting</span>
                <span className="text-xs font-semibold text-slate-200 block mt-1">
                  {scaiReport.recommendedCareSetting}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-slate-800/30 p-3 rounded-xl border border-slate-700/50 leading-relaxed">
              {scaiReport.clinicalDescription}
            </p>

            {/* Criteria Checklist */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-300 block">SCAI Criteria Identified:</span>
              {scaiReport.criteriaMet.map((crit, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-slate-800/40 border border-slate-700/60 text-xs text-slate-200 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                  <span>{crit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* HEMODYNAMIC INDICES: CPO, PAPi, SVR, PVR */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <Activity className="w-5 h-5" />
                </span>
                <h2 className="text-base font-bold text-white">Biventricular Hemodynamic Indices</h2>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
              {/* CPO Box */}
              <div
                className={`p-3 rounded-xl border ${
                  metrics.cardiacPowerOutputWatts < 0.6
                    ? 'bg-rose-950/40 border-rose-800/70 text-rose-300'
                    : 'bg-slate-950 border-slate-800 text-slate-200'
                }`}
              >
                <span className="text-[10px] text-slate-400 block">Cardiac Power (CPO)</span>
                <span className="text-lg font-bold block mt-0.5">{metrics.cardiacPowerOutputWatts} W</span>
                <span className="text-[9px] text-slate-500 block">&lt; 0.60 W = Critical</span>
              </div>

              {/* PAPi Box */}
              <div
                className={`p-3 rounded-xl border ${
                  rvAudit.isRvFailurePresent
                    ? 'bg-purple-950/40 border-purple-800/70 text-purple-300'
                    : 'bg-slate-950 border-slate-800 text-slate-200'
                }`}
              >
                <span className="text-[10px] text-slate-400 block">PAPi (RV Function)</span>
                <span className="text-lg font-bold block mt-0.5">{metrics.pulmonaryArteryPulsatilityIndex}</span>
                <span className="text-[9px] text-slate-500 block">&lt; 0.90 = RV Failure</span>
              </div>

              {/* SVR Box */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">SVR (Dyn&bull;s/cm&sup5;)</span>
                <span className="text-lg font-bold text-slate-200 block mt-0.5">
                  {metrics.systemicVascularResistanceDyneSecCm5}
                </span>
                <span className="text-[9px] text-slate-500 block">Normal 800 - 1200</span>
              </div>

              {/* PVR Box */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">PVR (Wood Units)</span>
                <span className="text-lg font-bold text-slate-200 block mt-0.5">
                  {metrics.pulmonaryVascularResistanceWoodUnits}
                </span>
                <span className="text-[9px] text-slate-500 block">&gt; 3.0 = Elevated</span>
              </div>
            </div>

            {/* RV Failure Warning Banner */}
            {rvAudit.isRvFailurePresent && (
              <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800 text-xs text-purple-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-purple-300">
                  <AlertTriangle className="w-4 h-4 text-purple-400" />
                  {rvAudit.rvFailureSeverity} Detected (PAPi {rvAudit.papiValue})
                </div>
                <p className="text-[11px] leading-relaxed">{rvAudit.warningNote}</p>
              </div>
            )}
          </div>

          {/* MECHANICAL CIRCULATORY SUPPORT (MCS) ESCALATION CARD */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
                  <Cpu className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-base font-bold text-white">Mechanical Circulatory Support (MCS) Decision Bench</h2>
                  <p className="text-xs text-slate-400">DanGer Shock &amp; Extracorporeal Resuscitation Protocol</p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-teal-950 border border-teal-800 text-teal-300">
                Active: {currentDevice.toUpperCase().replace(/_/g, ' ')}
              </span>
            </div>

            {/* Recommended Device Banner */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Algorithmic Recommendation:</span>
                <span className="font-mono font-bold text-teal-400 uppercase">
                  {mcsRecommendation.primaryDevice.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{mcsRecommendation.deviceRationale}</p>

              <div className="pt-2 flex flex-wrap gap-2">
                {mcsRecommendation.primaryDevice !== 'none' && (
                  <button
                    onClick={() => handleDeployDevice(mcsRecommendation.primaryDevice)}
                    className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Deploy {mcsRecommendation.primaryDevice.toUpperCase().replace(/_/g, ' ')}
                  </button>
                )}

                <button
                  onClick={handleReset}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset Baseline
                </button>
              </div>
            </div>

            {/* The Retrograde ECMO Afterload Trap Alert */}
            <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-800/60 text-xs text-rose-200 leading-relaxed">
              <strong className="text-rose-300 block mb-0.5">
                The Retrograde ECMO Afterload Trap &amp; Mandatory LV Venting:
              </strong>
              Veno-Arterial (VA) ECMO returns oxygenated blood retrogradely into the femoral artery, significantly
              increasing LV afterload. Without active LV unloading (e.g. ECPELLA with Impella CP/5.5 or surgical vent),
              the failing LV cannot eject against this pressure, precipitating acute hydrostatic pulmonary edema, left
              atrial stasis, and intraventricular thrombus formation.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
