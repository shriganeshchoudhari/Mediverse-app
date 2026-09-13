'use client';

import React, { useState, useMemo } from 'react';
import {
  Heart,
  Activity,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Flame,
  Droplets,
  Zap,
  Gauge,
  Sparkles,
  RefreshCw,
  AlertOctagon,
  Timer,
  Syringe,
  Pill,
  Waves,
  ShieldCheck,
  Stethoscope,
  ArrowDown,
  Info,
} from 'lucide-react';
import {
  calculateMembranePotential,
  evaluateEkgMorphology,
  calculateShiftKinetics,
  calculateEliminationKinetics,
  HYPERKALEMIA_SCENARIOS,
  CalciumFormulation,
  BinderType,
  PatientHyperkalemiaState,
} from '../../.gemini/skills/HyperkalemiaShiftEngine';

export default function HyperkalemiaShiftSimulator() {
  const [selectedScenarioKey, setSelectedScenarioKey] = useState<string>('missed_dialysis_sine_wave');
  const scenario = HYPERKALEMIA_SCENARIOS[selectedScenarioKey] || HYPERKALEMIA_SCENARIOS.missed_dialysis_sine_wave;

  // Patient Clinical State
  const [potassium, setPotassium] = useState<number>(scenario.initialState.serumPotassiumMeqL);
  const [egfr, setEgfr] = useState<number>(scenario.initialState.baselineEgfrMlMin);
  const [bloodPh, setBloodPh] = useState<number>(scenario.initialState.bloodPh);
  const [bicarbonate, setBicarbonate] = useState<number>(scenario.initialState.serumBicarbonateMeqL);
  const [bloodGlucose, setBloodGlucose] = useState<number>(scenario.initialState.bloodGlucoseMgDl);
  const [ionizedCalcium, setIonizedCalcium] = useState<number>(scenario.initialState.ionizedCalciumMmolL);
  const [onBetaBlocker, setOnBetaBlocker] = useState<boolean>(scenario.initialState.onBetaBlocker);

  // Tier 1: Membrane Stabilization
  const [calciumFormulation, setCalciumFormulation] = useState<CalciumFormulation>(
    scenario.initialState.calciumAdministered.formulation
  );
  const [calciumAmps, setCalciumAmps] = useState<number>(scenario.initialState.calciumAdministered.ampulesGiven);
  const [calciumMinutesAgo, setCalciumMinutesAgo] = useState<number>(
    scenario.initialState.calciumAdministered.minutesAgo
  );

  // Tier 2: Transcellular Shifting
  const [insulinUnits, setInsulinUnits] = useState<number>(
    scenario.initialState.shiftTherapiesGiven.insulinRegularUnits
  );
  const [dextroseGrams, setDextroseGrams] = useState<number>(
    scenario.initialState.shiftTherapiesGiven.dextroseGrams
  );
  const [albuterolMg, setAlbuterolMg] = useState<number>(
    scenario.initialState.shiftTherapiesGiven.albuterolNebulizedMg
  );
  const [bicarbMeq, setBicarbMeq] = useState<number>(
    scenario.initialState.shiftTherapiesGiven.sodiumBicarbonateMeq
  );

  // Tier 3: Elimination
  const [furosemideMg, setFurosemideMg] = useState<number>(scenario.initialState.eliminationActive.furosemideMg);
  const [binder, setBinder] = useState<BinderType>(scenario.initialState.eliminationActive.binder);
  const [hemodialysisActive, setHemodialysisActive] = useState<boolean>(
    scenario.initialState.eliminationActive.hemodialysisActive
  );

  // Scenario Loader
  const handleLoadScenario = (key: string) => {
    setSelectedScenarioKey(key);
    const sc = HYPERKALEMIA_SCENARIOS[key];
    if (!sc) return;

    setPotassium(sc.initialState.serumPotassiumMeqL);
    setEgfr(sc.initialState.baselineEgfrMlMin);
    setBloodPh(sc.initialState.bloodPh);
    setBicarbonate(sc.initialState.serumBicarbonateMeqL);
    setBloodGlucose(sc.initialState.bloodGlucoseMgDl);
    setIonizedCalcium(sc.initialState.ionizedCalciumMmolL);
    setOnBetaBlocker(sc.initialState.onBetaBlocker);

    setCalciumFormulation(sc.initialState.calciumAdministered.formulation);
    setCalciumAmps(sc.initialState.calciumAdministered.ampulesGiven);
    setCalciumMinutesAgo(sc.initialState.calciumAdministered.minutesAgo);

    setInsulinUnits(sc.initialState.shiftTherapiesGiven.insulinRegularUnits);
    setDextroseGrams(sc.initialState.shiftTherapiesGiven.dextroseGrams);
    setAlbuterolMg(sc.initialState.shiftTherapiesGiven.albuterolNebulizedMg);
    setBicarbMeq(sc.initialState.shiftTherapiesGiven.sodiumBicarbonateMeq);

    setFurosemideMg(sc.initialState.eliminationActive.furosemideMg);
    setBinder(sc.initialState.eliminationActive.binder);
    setHemodialysisActive(sc.initialState.eliminationActive.hemodialysisActive);
  };

  // Compile Current Patient State
  const currentState: PatientHyperkalemiaState = useMemo(
    () => ({
      serumPotassiumMeqL: potassium,
      baselineEgfrMlMin: egfr,
      bloodPh,
      serumBicarbonateMeqL: bicarbonate,
      bloodGlucoseMgDl: bloodGlucose,
      ionizedCalciumMmolL: ionizedCalcium,
      onBetaBlocker,
      calciumAdministered: {
        formulation: calciumFormulation,
        ampulesGiven: calciumAmps,
        minutesAgo: calciumMinutesAgo,
      },
      shiftTherapiesGiven: {
        insulinRegularUnits: insulinUnits,
        dextroseGrams,
        albuterolNebulizedMg: albuterolMg,
        sodiumBicarbonateMeq: bicarbMeq,
      },
      eliminationActive: {
        furosemideMg,
        binder,
        hemodialysisActive,
      },
    }),
    [
      potassium,
      egfr,
      bloodPh,
      bicarbonate,
      bloodGlucose,
      ionizedCalcium,
      onBetaBlocker,
      calciumFormulation,
      calciumAmps,
      calciumMinutesAgo,
      insulinUnits,
      dextroseGrams,
      albuterolMg,
      bicarbMeq,
      furosemideMg,
      binder,
      hemodialysisActive,
    ]
  );

  // Engine Calculations
  const membraneReport = useMemo(
    () => calculateMembranePotential(potassium, currentState.calciumAdministered),
    [potassium, currentState.calciumAdministered]
  );

  const ekgReport = useMemo(
    () => evaluateEkgMorphology(potassium, membraneReport.isMembraneStabilizedByCalcium),
    [potassium, membraneReport.isMembraneStabilizedByCalcium]
  );

  const shiftReport = useMemo(() => calculateShiftKinetics(currentState), [currentState]);

  const eliminationReport = useMemo(() => calculateEliminationKinetics(currentState), [currentState]);

  // Quick Action: Administer Calcium Bolus
  const handleQuickCalcium = (formulation: CalciumFormulation) => {
    setCalciumFormulation(formulation);
    setCalciumAmps(formulation === 'calcium_chloride_10' ? 1 : 2);
    setCalciumMinutesAgo(2);
  };

  // Quick Action: Standard Shift Bundle (10u regular insulin + 50g D50W + 20mg albuterol)
  const handleApplyShiftBundle = () => {
    setInsulinUnits(10);
    setDextroseGrams(50);
    setAlbuterolMg(20);
    if (bloodPh < 7.25) {
      setBicarbMeq(100);
    }
  };

  const handleResetResuscitation = () => {
    setCalciumFormulation('none');
    setCalciumAmps(0);
    setCalciumMinutesAgo(0);
    setInsulinUnits(0);
    setDextroseGrams(0);
    setAlbuterolMg(0);
    setBicarbMeq(0);
    setFurosemideMg(0);
    setBinder('none');
    setHemodialysisActive(false);
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
                <Heart className="w-5 h-5 animate-pulse" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">
                Critical Care &amp; Nephrology Resuscitation Suite
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Severe Hyperkalemia &amp; Cardiac Membrane Stabilization Workstation
            </h1>
            <p className="text-sm text-slate-400 max-w-3xl">
              Biophysical simulation of the Nernst resting potential shift, fast sodium channel (Nav1.5)
              depolarization block, Calcium Gluconate vs Chloride stoichiometry, transcellular shift kinetics
              (Insulin/Dextrose, Inhaled Albuterol, Bicarbonate), and definitive elimination.
            </p>
          </div>

          {/* Quick Status Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 ${
                potassium >= 6.5
                  ? 'bg-rose-950/70 border-rose-800 text-rose-300'
                  : potassium >= 5.5
                  ? 'bg-amber-950/70 border-amber-800 text-amber-300'
                  : 'bg-emerald-950/70 border-emerald-800 text-emerald-300'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              Serum K+: {potassium.toFixed(1)} mEq/L
            </div>

            <div
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 ${
                membraneReport.isMembraneStabilizedByCalcium
                  ? 'bg-emerald-950/70 border-emerald-800 text-emerald-300'
                  : 'bg-rose-950/70 border-rose-800 text-rose-300'
              }`}
            >
              {membraneReport.isMembraneStabilizedByCalcium ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Membrane Stabilized ({membraneReport.elementalCalciumDeliveredMg}mg Ca)
                </>
              ) : (
                <>
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                  UNSTABILIZED MYOCARDIUM
                </>
              )}
            </div>
          </div>
        </div>

        {/* Clinical Scenario Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80">
          <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            Standard Hyperkalemia Presentations:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2">
            {Object.entries(HYPERKALEMIA_SCENARIOS).map(([key, sc]) => {
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
                    K+ {sc.initialState.serumPotassiumMeqL} mEq/L &bull; eGFR {sc.initialState.baselineEgfrMlMin}
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
        {/* Left Column: Physiology, Nernst Potential & EKG Strip (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Patient Laboratory Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-cyan-400" />
                Serum Chemistry &amp; Organ Function
              </h2>
              <span className="text-xs text-slate-400 font-mono">eGFR: {egfr} mL/min</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Serum Potassium ([K+])</span>
                  <span
                    className={`font-mono font-bold ${
                      potassium >= 6.5 ? 'text-rose-400' : potassium >= 5.5 ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  >
                    {potassium.toFixed(1)} mEq/L
                  </span>
                </div>
                <input
                  type="range"
                  min="3.5"
                  max="10.0"
                  step="0.1"
                  value={potassium}
                  onChange={(e) => setPotassium(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Blood pH</span>
                    <span className={`font-mono ${bloodPh < 7.25 ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>
                      {bloodPh.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="6.90"
                    max="7.55"
                    step="0.01"
                    value={bloodPh}
                    onChange={(e) => setBloodPh(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <span className="text-[10px] text-slate-500">Normal 7.35 - 7.45</span>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Serum HCO3-</span>
                    <span className="font-mono text-slate-200">{bicarbonate} mEq/L</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="35"
                    value={bicarbonate}
                    onChange={(e) => setBicarbonate(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <span className="text-[10px] text-slate-500">Acidosis &lt; 22</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Blood Glucose</span>
                    <span
                      className={`font-mono ${
                        bloodGlucose < 120 ? 'text-amber-400 font-bold' : 'text-slate-200'
                      }`}
                    >
                      {bloodGlucose} mg/dL
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="400"
                    step="5"
                    value={bloodGlucose}
                    onChange={(e) => setBloodGlucose(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <span className="text-[10px] text-slate-500">&lt; 120 mg/dL: insulin risk</span>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Renal eGFR</span>
                    <span className={`font-mono ${egfr < 15 ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>
                      {egfr} mL/min
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="120"
                    value={egfr}
                    onChange={(e) => setEgfr(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                  />
                  <span className="text-[10px] text-slate-500">&lt; 15: anuric dialysis</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/40 border border-slate-700/50">
                <span className="text-xs text-slate-300">Chronic Beta-Blocker Therapy</span>
                <input
                  type="checkbox"
                  checked={onBetaBlocker}
                  onChange={(e) => setOnBetaBlocker(e.target.checked)}
                  className="w-4 h-4 accent-rose-500 rounded"
                />
              </div>
            </div>
          </div>

          {/* Nernst Membrane Potential & Nav1.5 Biophysics */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Nernst Membrane Potential &amp; Nav1.5
              </h2>
              <span
                className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold ${
                  membraneReport.membraneExcitabilityStatus.includes('Arrest')
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : membraneReport.membraneExcitabilityStatus.includes('Severe')
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}
              >
                {membraneReport.membraneExcitabilityStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-400">Resting Potential (Em)</div>
                <div className="text-lg font-bold font-mono text-cyan-300 mt-0.5">
                  {membraneReport.restingMembranePotentialMv} mV
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Normal: ~ -90 mV</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-400">Threshold Potential (Vth)</div>
                <div className="text-lg font-bold font-mono text-emerald-300 mt-0.5">
                  {membraneReport.thresholdPotentialMv} mV
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  {membraneReport.isMembraneStabilizedByCalcium ? 'Shifted by Calcium' : 'Baseline unshifted'}
                </div>
              </div>
            </div>

            {/* Nav1.5 Channel Availability Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Fast Na+ (Nav1.5) Availability:</span>
                <span
                  className={
                    membraneReport.relativeNavAvailabilityPercent < 40
                      ? 'text-rose-400 font-bold'
                      : 'text-emerald-400 font-bold'
                  }
                >
                  {membraneReport.relativeNavAvailabilityPercent}%
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    membraneReport.relativeNavAvailabilityPercent < 40
                      ? 'bg-rose-600'
                      : membraneReport.relativeNavAvailabilityPercent < 70
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${membraneReport.relativeNavAvailabilityPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Depolarization from hyperkalemia closes Nav1.5 inactivation gates, slowing Phase 0 conduction velocity
                and widening the QRS.
              </p>
            </div>
          </div>

          {/* Real-Time Synthesized EKG Strip */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Simulated 12-Lead Rhythm Strip
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-rose-300 border border-slate-700">
                {ekgReport.ekgSeverityGrade}
              </span>
            </div>

            {/* SVG EKG Strip */}
            <div className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 relative overflow-hidden">
              <div className="text-[11px] font-mono text-emerald-400 mb-1 flex items-center justify-between">
                <span>Rhythm: {ekgReport.rhythmName}</span>
                <span>25 mm/s &bull; 10 mm/mV</span>
              </div>

              <svg viewBox="0 0 500 120" className="w-full h-28 bg-slate-950">
                {/* Background Grid */}
                <defs>
                  <pattern id="ekgGridSmall" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                  </pattern>
                  <pattern id="ekgGridBig" width="50" height="50" patternUnits="userSpaceOnUse">
                    <rect width="50" height="50" fill="url(#ekgGridSmall)" />
                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#334155" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="500" height="120" fill="url(#ekgGridBig)" />

                {/* Dynamic Waveform Path */}
                {ekgReport.ekgSeverityGrade.includes('Sine Wave') ? (
                  // Sine wave oscillation
                  <path
                    d="M 10 60 Q 40 10, 70 60 T 130 60 T 190 60 T 250 60 T 310 60 T 370 60 T 430 60 T 490 60"
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : (
                  // PQRST complex repeated across the strip
                  <path
                    d={`M 10 60 
                       L 30 60 
                       ${ekgReport.pWaveStatus.includes('Absent') ? 'L 50 60' : 'Q 40 52, 50 60'} 
                       L ${50 + (ekgReport.prIntervalMs - 120) * 0.1} 60 
                       L ${60 + (ekgReport.prIntervalMs - 120) * 0.1} 65 
                       L ${65 + (ekgReport.qrsDurationMs * 0.1)} 15 
                       L ${70 + (ekgReport.qrsDurationMs * 0.2)} 75 
                       L ${75 + (ekgReport.qrsDurationMs * 0.25)} 60 
                       L 95 60 
                       Q ${105 + (ekgReport.tWaveAmplitudeMm > 10 ? 0 : 5)} ${60 - ekgReport.tWaveAmplitudeMm * 3}, ${120} 60
                       L 180 60 
                       ${ekgReport.pWaveStatus.includes('Absent') ? 'L 200 60' : 'Q 190 52, 200 60'}
                       L ${200 + (ekgReport.prIntervalMs - 120) * 0.1} 60 
                       L ${210 + (ekgReport.prIntervalMs - 120) * 0.1} 65 
                       L ${215 + (ekgReport.qrsDurationMs * 0.1)} 15 
                       L ${220 + (ekgReport.qrsDurationMs * 0.2)} 75 
                       L ${225 + (ekgReport.qrsDurationMs * 0.25)} 60 
                       L 245 60 
                       Q ${255} ${60 - ekgReport.tWaveAmplitudeMm * 3}, ${270} 60
                       L 330 60
                       ${ekgReport.pWaveStatus.includes('Absent') ? 'L 350 60' : 'Q 340 52, 350 60'}
                       L ${350 + (ekgReport.prIntervalMs - 120) * 0.1} 60 
                       L ${360 + (ekgReport.prIntervalMs - 120) * 0.1} 65 
                       L ${365 + (ekgReport.qrsDurationMs * 0.1)} 15 
                       L ${370 + (ekgReport.qrsDurationMs * 0.2)} 75 
                       L ${375 + (ekgReport.qrsDurationMs * 0.25)} 60 
                       L 395 60 
                       Q ${405} ${60 - ekgReport.tWaveAmplitudeMm * 3}, ${420} 60
                       L 490 60`}
                    fill="none"
                    stroke={membraneReport.isMembraneStabilizedByCalcium ? '#10b981' : '#f59e0b'}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </svg>

              {/* Intervals Metrics Bar */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono mt-2 pt-2 border-t border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[10px]">PR Interval</span>
                  <span className={ekgReport.prIntervalMs > 200 ? 'text-amber-300 font-bold' : 'text-slate-300'}>
                    {ekgReport.prIntervalMs} ms
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">QRS Width</span>
                  <span className={ekgReport.qrsDurationMs >= 120 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                    {ekgReport.qrsDurationMs} ms
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">T-Wave</span>
                  <span className="text-cyan-300 font-bold">{ekgReport.tWaveMorphology}</span>
                </div>
              </div>
            </div>

            {ekgReport.sineWaveRiskPercent > 0 && (
              <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-semibold">
                  <AlertOctagon className="w-4 h-4 text-rose-400" />
                  Sine-Wave Arrest Probability:
                </span>
                <span className="font-mono font-bold text-sm">{ekgReport.sineWaveRiskPercent}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: 3-Tiered Resuscitation Architecture (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* TIER 1: Membrane Stabilization */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-white">Tier 1: Cardiac Membrane Stabilization</h2>
                  <p className="text-xs text-slate-400">Does NOT lower serum K+; raises cardiac threshold potential</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQuickCalcium('calcium_gluconate_10')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-semibold transition border border-slate-700"
                >
                  + Ca Gluconate (2g)
                </button>
                <button
                  onClick={() => handleQuickCalcium('calcium_chloride_10')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-semibold transition border border-slate-700"
                >
                  + Ca Chloride (1g)
                </button>
              </div>
            </div>

            {/* Formulation Comparison Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div
                onClick={() => setCalciumFormulation('calcium_gluconate_10')}
                className={`p-3 rounded-xl border cursor-pointer transition ${
                  calciumFormulation === 'calcium_gluconate_10'
                    ? 'bg-emerald-950/40 border-emerald-500/70 ring-1 ring-emerald-500/30 text-emerald-200'
                    : 'bg-slate-800/30 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="font-bold text-sm text-slate-200">Calcium Gluconate 10%</div>
                <div className="text-[11px] text-slate-400 mt-1">10 mL = 1 g ampule = 90 mg (4.65 mEq) elemental Ca</div>
                <div className="mt-2 text-emerald-400 font-medium">&bull; Peripheral IV safe (preferred)</div>
              </div>

              <div
                onClick={() => setCalciumFormulation('calcium_chloride_10')}
                className={`p-3 rounded-xl border cursor-pointer transition ${
                  calciumFormulation === 'calcium_chloride_10'
                    ? 'bg-rose-950/40 border-rose-500/70 ring-1 ring-rose-500/30 text-rose-200'
                    : 'bg-slate-800/30 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="font-bold text-sm text-slate-200">Calcium Chloride 10%</div>
                <div className="text-[11px] text-slate-400 mt-1">10 mL = 1 g ampule = 270 mg (13.6 mEq) elemental Ca</div>
                <div className="mt-2 text-rose-400 font-medium">&bull; 3&times; more potent; Central line preferred</div>
              </div>
            </div>

            {/* Dose and Time Sliders */}
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Ampules Administered</span>
                  <span className="font-mono text-emerald-300 font-bold">{calciumAmps} amp(s)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="4"
                  value={calciumAmps}
                  onChange={(e) => setCalciumAmps(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Minutes Elapsed</span>
                  <span className="font-mono text-cyan-300 font-bold">{calciumMinutesAgo} min</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="90"
                  value={calciumMinutesAgo}
                  onChange={(e) => setCalciumMinutesAgo(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <span className="text-[10px] text-slate-500">Effect wanes after 45-60 min</span>
              </div>
            </div>

            {/* Clinical Calcium Directive */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-slate-300">Stabilization Status:</span>
                <span className="font-mono text-cyan-300">
                  {membraneReport.isMembraneStabilizedByCalcium
                    ? `Active (${membraneReport.membraneStabilityDurationRemainingMin} min duration remaining)`
                    : 'None active'}
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                {potassium >= 6.5 || ekgReport.qrsDurationMs >= 120
                  ? 'MANDATORY: Wide QRS or K+ >= 6.5 requires immediate IV calcium push. If EKG widening persists after 5 minutes, repeat the dose.'
                  : 'No severe EKG conduction delay. Withhold calcium unless peaked T-waves progress to loss of P waves or widening QRS.'}
              </p>
            </div>
          </div>

          {/* TIER 2: Transcellular Shifting Therapies */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <Waves className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-white">Tier 2: Transcellular Shifting Agents</h2>
                  <p className="text-xs text-slate-400">Translocates K+ into cells; temporary bridge for 2-4 hours</p>
                </div>
              </div>

              <button
                onClick={handleApplyShiftBundle}
                className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow"
              >
                <Zap className="w-3.5 h-3.5" />
                Apply Standard Shift Bundle
              </button>
            </div>

            {/* Shift Modalities Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Insulin & Dextrose */}
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                  <span>Regular Insulin</span>
                  <span className="font-mono text-cyan-300">{insulinUnits} units</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="5"
                  value={insulinUnits}
                  onChange={(e) => setInsulinUnits(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />

                <div className="flex items-center justify-between text-xs font-semibold text-slate-200 pt-1">
                  <span>Dextrose (D50W)</span>
                  <span className="font-mono text-amber-300">{dextroseGrams} g</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="75"
                  step="25"
                  value={dextroseGrams}
                  onChange={(e) => setDextroseGrams(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <span className="text-[10px] text-slate-500 block">K+ Drop: -{shiftReport.insulinShiftEffectMeqL}</span>
              </div>

              {/* Inhaled Albuterol */}
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                  <span>Albuterol Nebulizer</span>
                  <span className="font-mono text-teal-300">{albuterolMg} mg</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="5"
                  value={albuterolMg}
                  onChange={(e) => setAlbuterolMg(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
                <div className="text-[10px] text-slate-400">Requires 10-20 mg (4-8 standard nebules)</div>
                <span className="text-[10px] text-slate-500 block">K+ Drop: -{shiftReport.albuterolShiftEffectMeqL}</span>
              </div>

              {/* Sodium Bicarbonate */}
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                  <span>Sodium Bicarbonate</span>
                  <span className="font-mono text-purple-300">{bicarbMeq} mEq</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  step="50"
                  value={bicarbMeq}
                  onChange={(e) => setBicarbMeq(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <div className="text-[10px] text-slate-400">Only works if pH &lt; 7.25</div>
                <span className="text-[10px] text-slate-500 block">K+ Drop: -{shiftReport.bicarbonateShiftEffectMeqL}</span>
              </div>
            </div>

            {/* Shift Kinetics Projection */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-300 font-semibold">Total Projected Transcellular Shift:</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-rose-400">Baseline: {potassium.toFixed(1)}</span>
                  <ArrowDown className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-sm font-mono font-bold text-emerald-400">
                    Projected Nadir: {shiftReport.projectedPotassiumMeqL} mEq/L
                  </span>
                  <span className="text-xs text-slate-500">(-{shiftReport.predictedPotassiumDropMeqL})</span>
                </div>
              </div>

              {/* Safety Alerts (Hypoglycemia, Futility, Beta-Blocker) */}
              {shiftReport.hypoglycemiaRiskLevel.includes('Severe') && (
                <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-800/70 text-xs text-amber-200 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Severe Hypoglycemia Hazard:</strong> Baseline glucose is low or patient has renal
                    dysfunction (eGFR &lt; 30). Reduce regular insulin to 5 units and follow with 10% Dextrose (D10W)
                    infusion; recheck glucose at 30, 60, 90, and 120 minutes.
                  </span>
                </div>
              )}

              {shiftReport.bicarbonateFutilityAlert && (
                <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/70 text-xs text-rose-200 flex items-start gap-2">
                  <AlertOctagon className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <span>{shiftReport.bicarbonateFutilityAlert}</span>
                </div>
              )}

              {shiftReport.albuterolResistanceAlert && (
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300 flex items-start gap-2">
                  <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>{shiftReport.albuterolResistanceAlert}</span>
                </div>
              )}
            </div>
          </div>

          {/* TIER 3: Total-Body Elimination Kinetics */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <Droplets className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-white">Tier 3: Definitive Elimination Kinetics</h2>
                  <p className="text-xs text-slate-400">Permanent physical clearance from extracellular compartment</p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400">Hourly Clearance</div>
                <div className="text-base font-mono font-bold text-purple-300">
                  {eliminationReport.hourlyRemovalRateMeqHr} mEq / hr
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {/* Loop Diuretic */}
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2">
                <div className="flex justify-between font-semibold text-slate-200">
                  <span>IV Furosemide</span>
                  <span className="font-mono text-cyan-300">{furosemideMg} mg</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="160"
                  step="40"
                  value={furosemideMg}
                  onChange={(e) => setFurosemideMg(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <span className="text-[10px] text-slate-500 block">Requires residual GFR &gt; 15</span>
              </div>

              {/* Potassium Binder */}
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1.5">
                <span className="block font-semibold text-slate-200">Gastrointestinal Binder</span>
                <select
                  value={binder}
                  onChange={(e) => setBinder(e.target.value as BinderType)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="none">None</option>
                  <option value="sodium_zirconium_cyclosilicate">Lokelma (SZC) 10g TID</option>
                  <option value="patiromer">Patiromer 8.4g Daily</option>
                  <option value="sodium_polystyrene_sulfonate">SPS (Kayexalate)</option>
                </select>
                <span className="text-[10px] text-slate-500 block">SZC onset 1h; Patiromer 4-7h</span>
              </div>

              {/* Hemodialysis */}
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between font-semibold text-slate-200">
                    <span>Emergency Hemodialysis</span>
                    <input
                      type="checkbox"
                      checked={hemodialysisActive}
                      onChange={(e) => setHemodialysisActive(e.target.checked)}
                      className="w-4 h-4 accent-purple-500 rounded"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">0-K or 1-K bath</span>
                </div>
                <span className="text-[10px] text-purple-300 font-mono block">Removes ~35 mEq/hr</span>
              </div>
            </div>

            {/* Directive Card */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-300">Active Modality:</span>
                <span className="font-mono text-purple-300">{eliminationReport.primaryModality}</span>
              </div>
              <p className="text-slate-400 leading-relaxed">{eliminationReport.clinicalEliminationDirective}</p>

              <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                <span className="text-slate-400">Estimated Time to Safe K+ (&lt; 5.5 mEq/L):</span>
                <span className="font-mono font-bold text-emerald-400">
                  {eliminationReport.timeToSafePotassiumHours < 90
                    ? `${eliminationReport.timeToSafePotassiumHours} hours`
                    : 'Refractory without Dialysis'}
                </span>
              </div>
            </div>

            {/* Teaching Pearls & Reset */}
            <div className="pt-2 flex items-center justify-between">
              <div className="text-[11px] text-slate-500 italic">
                Remember: Shifting buys 2 to 4 hours. Without definitive elimination, potassium rebounds.
              </div>
              <button
                onClick={handleResetResuscitation}
                className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold transition flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Therapy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
