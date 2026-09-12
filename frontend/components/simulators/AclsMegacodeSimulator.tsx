"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Activity,
  Heart,
  Zap,
  Clock,
  RotateCcw,
  Play,
  Pause,
  Award,
  AlertTriangle,
  CheckCircle2,
  Wind,
  Droplet,
  Volume2,
  VolumeX,
  ChevronRight,
  Stethoscope,
  ShieldAlert,
  Flame,
} from "lucide-react";
import {
  CardiacArrestRhythm,
  AclsMedication,
  HsAndTsCause,
  MegacodeState,
  INITIAL_MEGACODE_STATE,
  deliverDefibrillation,
  administerAclsMedication,
  treatReversibleCause,
  computeAclsDebriefScore,
} from "../../.gemini/skills/AclsResuscitationEngine";

export default function AclsMegacodeSimulator() {
  const [state, setState] = useState<MegacodeState>(() =>
    JSON.parse(JSON.stringify(INITIAL_MEGACODE_STATE))
  );

  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [selectedEnergy, setSelectedEnergy] = useState<number>(200);
  const [isCharged, setIsCharged] = useState<boolean>(false);
  const [showDebriefModal, setShowDebriefModal] = useState<boolean>(false);
  const [lastActionFeedback, setLastActionFeedback] = useState<string | null>(null);
  const [selectedHtTab, setSelectedHtTab] = useState<"H" | "T">("H");

  // Timer loop for megacode (1s tick)
  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setState((prev) => {
        if (prev.roscAchieved) return prev;
        const newElapsed = prev.elapsedArrestSec + 1;
        const newCprCycle = prev.cprCycleRemainingSec <= 1 ? 120 : prev.cprCycleRemainingSec - 1;

        return {
          ...prev,
          elapsedArrestSec: newElapsed,
          cprCycleRemainingSec: newCprCycle,
        };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning]);

  // Handle Defibrillator Charge
  const handleCharge = () => {
    setIsCharged(true);
    setLastActionFeedback(`Defibrillator capacitor charged to ${selectedEnergy}J biphasic.`);
  };

  // Handle Shock Delivery
  const handleDeliverShock = () => {
    if (!isCharged) {
      setLastActionFeedback("Error: Defibrillator must be charged before delivering shock!");
      return;
    }
    const { updatedState, outcomeMessage } = deliverDefibrillation(state, selectedEnergy);
    setState(updatedState);
    setIsCharged(false);
    setLastActionFeedback(outcomeMessage);
  };

  // Handle Medication
  const handleMedication = (med: AclsMedication) => {
    const { updatedState, outcomeMessage } = administerAclsMedication(state, med);
    setState(updatedState);
    setLastActionFeedback(outcomeMessage);
  };

  // Handle H's and T's Treatment
  const handleTreatHt = (cause: HsAndTsCause, interventionName: string) => {
    const { updatedState, outcomeMessage } = treatReversibleCause(state, cause, interventionName);
    setState(updatedState);
    setLastActionFeedback(outcomeMessage);
  };

  // Reset Megacode
  const handleReset = () => {
    setState(JSON.parse(JSON.stringify(INITIAL_MEGACODE_STATE)));
    setIsRunning(true);
    setIsCharged(false);
    setShowDebriefModal(false);
    setLastActionFeedback(null);
  };

  const debrief = useMemo(() => {
    return computeAclsDebriefScore(state);
  }, [state]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Rhythm Badge Styling
  const getRhythmDisplay = (rhythm: CardiacArrestRhythm) => {
    switch (rhythm) {
      case "VENTRICULAR_FIBRILLATION":
        return { name: "Ventricular Fibrillation (VF)", color: "text-red-400 bg-red-950/60 border-red-600 animate-pulse" };
      case "PULSELESS_VT":
        return { name: "Pulseless Ventricular Tachycardia (pVT)", color: "text-amber-400 bg-amber-950/60 border-amber-600 animate-pulse" };
      case "PEA":
        return { name: "Pulseless Electrical Activity (PEA)", color: "text-yellow-300 bg-yellow-950/60 border-yellow-600" };
      case "ASYSTOLE":
        return { name: "Ventricular Asystole (Flatline)", color: "text-slate-400 bg-slate-900 border-slate-700" };
      case "ROSC_SINUS":
        return { name: "ROSC: Normal Sinus Rhythm", color: "text-emerald-300 bg-emerald-950/60 border-emerald-500 font-bold" };
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 lg:p-8 font-sans">
      {/* Top Banner */}
      <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
              <Heart className="w-6 h-6 animate-pulse" />
            </span>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Advanced Cardiovascular Life Support (ACLS) Megacode Simulator
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            AHA 2020/2025 Adult Cardiac Arrest Algorithms &bull; Biphasic Defibrillation &bull; Quantitative Capnography &bull; H&apos;s and T&apos;s
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition ${
              isRunning
                ? "bg-amber-500/20 border-amber-500 text-amber-300"
                : "bg-emerald-500/20 border-emerald-500 text-emerald-300"
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRunning ? "Pause Code" : "Resume Code"}
          </button>

          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Megacode
          </button>

          <button
            onClick={() => setShowDebriefModal(true)}
            className="px-3.5 py-1.5 rounded-lg border border-violet-500/40 bg-violet-600/20 hover:bg-violet-600/30 text-violet-200 text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
          >
            <Award className="w-4 h-4 text-violet-400" />
            AHA Debrief ({debrief.totalScore}%)
          </button>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (5 Cols): Defibrillator & ECG Monitor */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Defibrillator Monitor Console */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <span className="font-mono text-xs tracking-wider uppercase text-slate-300">
                  LIFEPAK / ZOLL Biphasic Defibrillator
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-400" />
                <span className="font-mono text-sm text-rose-300">Arrest: {formatTime(state.elapsedArrestSec)}</span>
              </div>
            </div>

            {/* Cardiac Rhythm Display */}
            <div className="mt-4 p-3 rounded-lg border bg-slate-950/80 flex flex-col justify-between border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Lead II Rhythm Strip (Paddle Electrodes)</span>
                <span className="font-mono">Paddles Connected</span>
              </div>

              {/* Rhythm Badge */}
              <div className={`p-2 rounded border text-xs font-bold text-center uppercase tracking-wide my-2 ${getRhythmDisplay(state.currentRhythm).color}`}>
                {getRhythmDisplay(state.currentRhythm).name}
              </div>

              {/* Simulated ECG Waveform Canvas */}
              <div className="h-20 w-full bg-slate-950 rounded border border-slate-800/80 overflow-hidden flex items-center justify-center p-1">
                {state.currentRhythm === "VENTRICULAR_FIBRILLATION" && (
                  <svg className="w-full h-full" viewBox="0 0 400 80" preserveAspectRatio="none">
                    <path
                      d="M 0,40 Q 20,10 40,55 T 80,25 T 120,65 T 160,15 T 200,50 T 240,20 T 280,60 T 320,30 T 360,55 T 400,40"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2.5"
                    />
                  </svg>
                )}
                {state.currentRhythm === "PULSELESS_VT" && (
                  <svg className="w-full h-full" viewBox="0 0 400 80" preserveAspectRatio="none">
                    <path
                      d="M 0,40 L 20,40 L 40,10 L 60,70 L 80,40 L 100,40 L 120,10 L 140,70 L 160,40 L 180,40 L 200,10 L 220,70 L 240,40 L 260,40 L 280,10 L 300,70 L 320,40 L 340,40 L 360,10 L 380,70 L 400,40"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                    />
                  </svg>
                )}
                {state.currentRhythm === "ASYSTOLE" && (
                  <div className="w-full border-b-2 border-slate-600 animate-pulse" />
                )}
                {(state.currentRhythm === "PEA" || state.currentRhythm === "ROSC_SINUS") && (
                  <svg className="w-full h-full" viewBox="0 0 400 80" preserveAspectRatio="none">
                    <path
                      d="M 0,45 L 30,45 Q 40,40 50,45 L 65,45 L 70,55 L 80,10 L 90,65 L 95,45 L 110,45 Q 125,30 140,45 L 200,45 L 230,45 Q 240,40 250,45 L 265,45 L 270,55 L 280,10 L 290,65 L 295,45 L 310,45 Q 325,30 340,45 L 400,45"
                      fill="none"
                      stroke={state.currentRhythm === "ROSC_SINUS" ? "#10b981" : "#eab308"}
                      strokeWidth="2.5"
                    />
                  </svg>
                )}
              </div>
            </div>

            {/* 2-Minute CPR Countdown Clock */}
            <div className="mt-4 p-3 rounded-lg border border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-mono uppercase">2-Minute CPR Cycle Timer</span>
                <div className="text-2xl font-bold font-mono text-cyan-400 mt-0.5">
                  {formatTime(state.cprCycleRemainingSec)}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase block">Shocks Delivered</span>
                <span className="text-xl font-bold text-amber-400 font-mono">{state.shocksDeliveredCount}</span>
              </div>
            </div>

            {/* Energy Selector & Defibrillator Controls */}
            <div className="mt-4 p-3 rounded-lg border border-slate-800 bg-slate-950/60">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide block mb-2">
                Biphasic Energy Selection:
              </span>
              <div className="flex gap-2 mb-3">
                {[120, 150, 200].map((joules) => (
                  <button
                    key={joules}
                    onClick={() => setSelectedEnergy(joules)}
                    className={`flex-1 py-1.5 rounded text-xs font-bold font-mono transition ${
                      selectedEnergy === joules
                        ? "bg-amber-600 text-white border border-amber-400"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {joules} J
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleCharge}
                  disabled={isCharged || state.roscAchieved}
                  className={`py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                    isCharged
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white"
                  }`}
                >
                  {isCharged ? "CHARGED & READY ✓" : `CHARGE (${selectedEnergy}J)`}
                </button>

                <button
                  onClick={handleDeliverShock}
                  disabled={!isCharged || state.roscAchieved}
                  className={`py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition shadow-lg ${
                    isCharged
                      ? "bg-red-600 hover:bg-red-500 text-white animate-bounce border border-red-400"
                      : "bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700"
                  }`}
                >
                  ⚡ DELIVER SHOCK
                </button>
              </div>
            </div>
          </div>

          {/* CPR Quality & Capnography Telemetry */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Real-Time CPR Metrics &amp; Waveform Capnography
            </h3>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Rate</span>
                <span className="text-base font-bold text-emerald-400 font-mono">{state.cprCompressionRate}</span>
                <span className="text-[9px] text-slate-500 block">100-120 bpm</span>
              </div>

              <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Depth</span>
                <span className="text-base font-bold text-cyan-400 font-mono">{state.cprDepthMm} mm</span>
                <span className="text-[9px] text-slate-500 block">50-60 mm</span>
              </div>

              <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">CCF</span>
                <span className="text-base font-bold text-violet-400 font-mono">{state.ccfPercent}%</span>
                <span className="text-[9px] text-slate-500 block">&gt; 80% target</span>
              </div>
            </div>

            {/* End-Tidal CO2 Display & Waveform */}
            <div className="mt-3 p-3 rounded-lg border border-slate-800 bg-slate-950/80">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">Quantitative EtCO2 Monitor</span>
                <span className={`text-base font-bold font-mono ${state.etCo2MmHg >= 35 ? "text-emerald-400" : "text-amber-400"}`}>
                  {state.etCo2MmHg} mmHg
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                {state.etCo2MmHg >= 35
                  ? "ROSC INDICATOR: Sudden sustained EtCO2 surge >= 35 mmHg confirms ROSC!"
                  : "Adequate compressions maintaining EtCO2 > 10 mmHg."}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): Medication Dispatch & Reversible H's and T's */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Action Feedback Banner */}
          {lastActionFeedback && (
            <div className="p-3 rounded-lg border border-cyan-500/40 bg-cyan-950/30 text-xs text-cyan-200 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>{lastActionFeedback}</span>
            </div>
          )}

          {/* ACLS Medication Dispatch Deck */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
            <h2 className="text-sm font-bold text-white uppercase tracking-wide mb-3 flex items-center gap-2 pb-2 border-b border-slate-800">
              <Droplet className="w-4 h-4 text-rose-400" />
              ACLS Emergency Resuscitation Medication Tray
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Epinephrine */}
              <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/60">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-200 mb-1">
                  <span>Epinephrine 1 mg IV/IO</span>
                  <span className="text-[10px] text-slate-400">Total: {state.totalEpiCount} doses</span>
                </div>
                <p className="text-[11px] text-slate-400 mb-2">
                  Administer q3-5 min. High-dose alpha-1 vasoconstriction for coronary perfusion.
                </p>
                <button
                  onClick={() => handleMedication("EPINEPHRINE_1MG")}
                  className="w-full py-2 px-3 rounded bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 text-xs font-semibold transition"
                >
                  Give Epinephrine 1 mg IV Push
                </button>
              </div>

              {/* Amiodarone */}
              <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/60">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-200 mb-1">
                  <span>Amiodarone (Refractory VF/pVT)</span>
                  <span className="text-[10px] text-slate-400">Given: {state.amiodaroneDoseGiven} mg</span>
                </div>
                <p className="text-[11px] text-slate-400 mb-2">
                  First dose 300 mg IV bolus; second dose 150 mg IV bolus.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleMedication("AMIODARONE_300MG")}
                    disabled={state.amiodaroneDoseGiven > 0}
                    className={`flex-1 py-2 px-2 rounded text-xs font-medium border transition ${
                      state.amiodaroneDoseGiven > 0
                        ? "bg-slate-800 text-slate-600 border-slate-700"
                        : "bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border-blue-500/40"
                    }`}
                  >
                    300 mg Bolus
                  </button>
                  <button
                    onClick={() => handleMedication("AMIODARONE_150MG")}
                    disabled={state.amiodaroneDoseGiven !== 300}
                    className={`flex-1 py-2 px-2 rounded text-xs font-medium border transition ${
                      state.amiodaroneDoseGiven === 300
                        ? "bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border-blue-500/40"
                        : "bg-slate-800 text-slate-600 border-slate-700"
                    }`}
                  >
                    150 mg Bolus
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Reversible Causes (H's and T's) Diagnostic & Treatment Bench */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-violet-400" />
                Diagnostic &amp; Treatment Bench: Reversible H&apos;s and T&apos;s
              </h2>
              <div className="flex gap-1">
                <button
                  onClick={() => setSelectedHtTab("H")}
                  className={`px-3 py-1 rounded text-xs font-bold transition ${
                    selectedHtTab === "H"
                      ? "bg-violet-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  The 5 H&apos;s
                </button>
                <button
                  onClick={() => setSelectedHtTab("T")}
                  className={`px-3 py-1 rounded text-xs font-bold transition ${
                    selectedHtTab === "T"
                      ? "bg-violet-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  The 5 T&apos;s
                </button>
              </div>
            </div>

            {/* The 5 H's Panel */}
            {selectedHtTab === "H" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-xs text-slate-200">Hypovolemia</span>
                    <span className="text-[10px] text-slate-400 block">Flat neck veins, fluid loss</span>
                  </div>
                  <button
                    onClick={() => handleTreatHt("HYPOVOLEMIA", "Rapid 2L warm crystalloid bolus")}
                    className="px-2.5 py-1.5 rounded bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-medium"
                  >
                    2L Bolus IV
                  </button>
                </div>

                <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-xs text-slate-200">Hypoxia</span>
                    <span className="text-[10px] text-slate-400 block">Airway obstruction / desaturation</span>
                  </div>
                  <button
                    onClick={() => handleTreatHt("HYPOXIA", "Endotracheal Intubation & 100% FiO2")}
                    className="px-2.5 py-1.5 rounded bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-medium"
                  >
                    Intubate &amp; O2
                  </button>
                </div>

                <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-xs text-slate-200">Hydrogen Ion (Acidosis)</span>
                    <span className="text-[10px] text-slate-400 block">Severe metabolic acidemia</span>
                  </div>
                  <button
                    onClick={() => handleTreatHt("HYDROGEN_ION", "Sodium Bicarbonate 50 mEq IV")}
                    className="px-2.5 py-1.5 rounded bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-medium"
                  >
                    NaHCO3 50 mEq
                  </button>
                </div>

                <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-xs text-slate-200">Hyperkalemia</span>
                    <span className="text-[10px] text-slate-400 block">Peaked T-waves, ESRD patient</span>
                  </div>
                  <button
                    onClick={() => handleTreatHt("HYPERKALEMIA", "Calcium Chloride 1g IV push")}
                    className="px-2.5 py-1.5 rounded bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-medium"
                  >
                    Calcium 1g IV
                  </button>
                </div>

                <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 flex items-center justify-between sm:col-span-2">
                  <div>
                    <span className="font-semibold text-xs text-slate-200">Hypothermia</span>
                    <span className="text-[10px] text-slate-400 block">Core temp &lt; 32°C (Osborn waves)</span>
                  </div>
                  <button
                    onClick={() => handleTreatHt("HYPOTHERMIA", "Active internal and external rewarming")}
                    className="px-2.5 py-1.5 rounded bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-medium"
                  >
                    Active Rewarming
                  </button>
                </div>
              </div>
            )}

            {/* The 5 T's Panel */}
            {selectedHtTab === "T" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-xs text-slate-200">Tension Pneumothorax</span>
                    <span className="text-[10px] text-slate-400 block">Tracheal deviation, absent breath sounds</span>
                  </div>
                  <button
                    onClick={() => handleTreatHt("TENSION_PNEUMO", "14G Needle Thoracostomy")}
                    className="px-2.5 py-1.5 rounded bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 text-xs font-medium"
                  >
                    Needle Decompress
                  </button>
                </div>

                <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-xs text-slate-200">Tamponade (Cardiac)</span>
                    <span className="text-[10px] text-slate-400 block">Pericardial effusion on POCUS</span>
                  </div>
                  <button
                    onClick={() => handleTreatHt("TAMPONADE", "Emergency Subxiphoid Pericardiocentesis")}
                    className="px-2.5 py-1.5 rounded bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 text-xs font-medium"
                  >
                    Pericardiocentesis
                  </button>
                </div>

                <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-xs text-slate-200">Toxins (Overdose)</span>
                    <span className="text-[10px] text-slate-400 block">Opioids, CCB/BB, TCA ingestions</span>
                  </div>
                  <button
                    onClick={() => handleTreatHt("TOXINS", "Specific antidote administration (Naloxone/Lipid)")}
                    className="px-2.5 py-1.5 rounded bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 text-xs font-medium"
                  >
                    Targeted Antidote
                  </button>
                </div>

                <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-xs text-slate-200">Thrombosis (Pulmonary PE)</span>
                    <span className="text-[10px] text-slate-400 block">Massive PE with RV strain</span>
                  </div>
                  <button
                    onClick={() => handleTreatHt("THROMBOSIS_PE", "Alteplase 50mg IV bolus")}
                    className="px-2.5 py-1.5 rounded bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 text-xs font-medium"
                  >
                    Alteplase 50mg
                  </button>
                </div>

                <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 flex items-center justify-between sm:col-span-2">
                  <div>
                    <span className="font-semibold text-xs text-slate-200">Thrombosis (Coronary STEMI)</span>
                    <span className="text-[10px] text-slate-400 block">Acute transmural myocardial infarction</span>
                  </div>
                  <button
                    onClick={() => handleTreatHt("THROMBOSIS_MI", "STAT Cardiac Cath Lab / PCI Activation")}
                    className="px-2.5 py-1.5 rounded bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 text-xs font-medium"
                  >
                    STAT Cath Lab Activation
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Code Event Audit Trail */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400" />
              ACLS Code Chronology &amp; Event Audit ({state.eventLog.length} events)
            </h3>
            <div className="max-h-40 overflow-y-auto space-y-1.5 font-mono text-xs pr-1">
              {state.eventLog.map((ev) => (
                <div key={ev.id} className="p-2 rounded bg-slate-950/60 border border-slate-800/80 flex items-start gap-2">
                  <span className="text-slate-500 text-[10px] shrink-0 mt-0.5">+{ev.timestampSec}s</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase shrink-0 ${
                    ev.type === "SHOCK" ? "bg-amber-950 text-amber-300 border border-amber-600" :
                    ev.type === "DRUG" ? "bg-blue-950 text-blue-300 border border-blue-600" :
                    ev.type === "ROSC_ACHIEVED" ? "bg-emerald-950 text-emerald-300 border border-emerald-500 font-bold" :
                    ev.type === "ALGORITHM_ERROR" ? "bg-red-950 text-red-300 border border-red-600" :
                    "bg-slate-800 text-slate-300"
                  }`}>
                    {ev.type}
                  </span>
                  <span className="text-slate-200">{ev.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AHA ACLS Debrief Modal */}
      {showDebriefModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-violet-400" />
                <h3 className="text-lg font-bold text-white">AHA ACLS Megacode Resuscitation Debrief</h3>
              </div>
              <button
                onClick={() => setShowDebriefModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider">Overall Megacode Score</span>
                <div className="text-3xl font-bold text-white mt-0.5">{debrief.totalScore} / 100 pts</div>
              </div>
              <div
                className={`text-3xl font-extrabold px-4 py-2 rounded-xl border ${
                  debrief.letterGrade === "A+" || debrief.letterGrade === "A"
                    ? "bg-emerald-950/60 border-emerald-500 text-emerald-400"
                    : debrief.letterGrade === "B"
                    ? "bg-blue-950/60 border-blue-500 text-blue-400"
                    : "bg-rose-950/60 border-rose-500 text-rose-400"
                }`}
              >
                Grade {debrief.letterGrade}
              </div>
            </div>

            {/* Rubric Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-4">
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="text-[11px] text-slate-400">Rhythm Recognition</div>
                <div className="text-base font-bold text-slate-200 mt-1">{debrief.breakdown.rhythmRecognition} / 20</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="text-[11px] text-slate-400">Shock Timing</div>
                <div className="text-base font-bold text-slate-200 mt-1">{debrief.breakdown.shockTiming} / 20</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="text-[11px] text-slate-400">Medication Intervals</div>
                <div className="text-base font-bold text-slate-200 mt-1">{debrief.breakdown.medicationIntervals} / 20</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="text-[11px] text-slate-400">H&apos;s and T&apos;s Reversal</div>
                <div className="text-base font-bold text-slate-200 mt-1">{debrief.breakdown.hsAndTsIdentification} / 20</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="text-[11px] text-slate-400">CPR Quality</div>
                <div className="text-base font-bold text-slate-200 mt-1">{debrief.breakdown.cprQuality} / 20</div>
              </div>
            </div>

            {/* Feedback Critique */}
            <div className="mt-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Faculty Clinical Assessment:
              </h4>
              <ul className="space-y-1 text-xs text-slate-300">
                {debrief.critiqueComments.map((comment, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                    <span>{comment}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowDebriefModal(false)}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
              >
                Close Debrief
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}