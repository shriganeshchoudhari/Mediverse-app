"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Activity,
  Heart,
  Wind,
  AlertTriangle,
  Users,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Play,
  Pause,
  ShieldAlert,
  Sparkles,
  Clock,
  Stethoscope,
  Volume2,
  VolumeX,
  FileText,
  Award,
  Flame,
  ChevronRight,
} from "lucide-react";
import {
  TeamRole,
  DasPlanStep,
  TeamMemberState,
  PatientApneaVitals,
  OrScenarioState,
  INITIAL_TEAM_ROSTER,
  computeApneaDesaturation,
  dispatchTeamCommand,
  computeCrmDebriefScore,
} from "../../.gemini/skills/VirtualOrTeamCrmEngine";

export default function VirtualOrTeamCrmSimulator() {
  // Scenario simulation state
  const [scenarioState, setScenarioState] = useState<OrScenarioState>({
    patientWeightKg: 110,
    patientBmi: 38.5,
    frcVolumeMl: 1400,
    oxygenConsumptionVo2MlMin: 350,
    currentPlan: "PLAN_A_INTUBATION",
    intubationAttemptsCount: 0,
    sadAttemptsCount: 0,
    sugammadexGiven: false,
    cicoDeclared: false,
    airwayCartAtBedside: false,
    cricothyroidotomy: {
      laryngealHandshakeDone: false,
      incisionType: "NONE",
      bladeTurned90Deg: false,
      bougieRailroaded: false,
      trachealClicksFelt: false,
      tube60Inserted: false,
      cuffInflated: false,
      capnographyConfirmed: false,
    },
    teamMembers: JSON.parse(JSON.stringify(INITIAL_TEAM_ROSTER)),
    eventLog: [
      {
        id: "ev-init",
        timestampSec: 0,
        actor: "AIRWAY_LEAD",
        message: "Induction of anesthesia complete with Propofol & Rocuronium. Patient is apneic. Beginning Plan A.",
        type: "CALLOUT",
      },
    ],
  });

  // Apnea Clock & Simulation loop
  const [elapsedSec, setElapsedSec] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [showDebriefModal, setShowDebriefModal] = useState<boolean>(false);
  const [lastActionResult, setLastActionResult] = useState<{ message: string; isSuccess: boolean } | null>(null);

  const isOxygenRestored = scenarioState.cricothyroidotomy.capnographyConfirmed;

  // Real-time vitals calculation
  const vitals: PatientApneaVitals = useMemo(() => {
    return computeApneaDesaturation(
      elapsedSec,
      scenarioState.frcVolumeMl,
      scenarioState.oxygenConsumptionVo2MlMin,
      isOxygenRestored
    );
  }, [elapsedSec, scenarioState.frcVolumeMl, scenarioState.oxygenConsumptionVo2MlMin, isOxygenRestored]);

  // Simulation timer tick (1 sec real = 1 sec sim)
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setElapsedSec((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  // Handle Command Execution
  const handleCommand = (
    role: TeamRole,
    cmd:
      | "DECLARE_CICO"
      | "CALL_AIRWAY_CART"
      | "ATTEMPT_VIDEO_LARYNGOSCOPY"
      | "INSERT_SAD_IGEL"
      | "TWO_PERSON_MASK_OPA"
      | "GIVE_SUGAMMADEX_16"
      | "PREPARE_SCALPEL_BOUGIE"
      | "PERFORM_CRIC_INCISION"
      | "INSERT_BOUGIE"
      | "RAILROAD_60_TUBE"
      | "INFLATE_CUFF_CONFIRM"
  ) => {
    const { updatedState, callbackMessage, isActionSuccess } = dispatchTeamCommand(role, cmd, scenarioState);
    setScenarioState(updatedState);
    setLastActionResult({ message: callbackMessage, isSuccess: isActionSuccess });
  };

  // Reset simulator
  const handleReset = () => {
    setElapsedSec(0);
    setIsRunning(true);
    setShowDebriefModal(false);
    setLastActionResult(null);
    setScenarioState({
      patientWeightKg: 110,
      patientBmi: 38.5,
      frcVolumeMl: 1400,
      oxygenConsumptionVo2MlMin: 350,
      currentPlan: "PLAN_A_INTUBATION",
      intubationAttemptsCount: 0,
      sadAttemptsCount: 0,
      sugammadexGiven: false,
      cicoDeclared: false,
      airwayCartAtBedside: false,
      cricothyroidotomy: {
        laryngealHandshakeDone: false,
        incisionType: "NONE",
        bladeTurned90Deg: false,
        bougieRailroaded: false,
        trachealClicksFelt: false,
        tube60Inserted: false,
        cuffInflated: false,
        capnographyConfirmed: false,
      },
      teamMembers: JSON.parse(JSON.stringify(INITIAL_TEAM_ROSTER)),
      eventLog: [
        {
          id: "ev-init",
          timestampSec: 0,
          actor: "AIRWAY_LEAD",
          message: "Induction of anesthesia complete with Propofol & Rocuronium. Patient is apneic. Beginning Plan A.",
          type: "CALLOUT",
        },
      ],
    });
  };

  const debrief = useMemo(() => {
    return computeCrmDebriefScore(scenarioState);
  }, [scenarioState]);

  // Helper formatting for time MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Color coding for SpO2
  const getSpo2ColorClass = (spo2: number) => {
    if (spo2 >= 92) return "text-emerald-400 border-emerald-500/50 bg-emerald-950/20";
    if (spo2 >= 80) return "text-amber-400 border-amber-500/50 bg-amber-950/20";
    return "text-rose-500 border-rose-500/50 bg-rose-950/30 animate-pulse";
  };

  // Color coding for Heart Rate & Rhythm
  const getRhythmBadge = (rhythm: PatientApneaVitals["cardiacRhythm"]) => {
    switch (rhythm) {
      case "RECOVERED_SINUS":
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Sinus (Recovered)</span>;
      case "SINUS_RHYTHM":
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Normal Sinus</span>;
      case "SINUS_TACHYCARDIA":
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">Sinus Tachycardia</span>;
      case "HYPOXIC_BRADYCARDIA":
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">Hypoxic Bradycardia</span>;
      case "PEA_ARREST":
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-red-600/40 text-red-200 border border-red-500 animate-bounce">PEA CARDIAC ARREST</span>;
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 lg:p-8 font-sans">
      {/* Top Header Banner */}
      <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
              <ShieldAlert className="w-6 h-6" />
            </span>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Virtual OR & Surgical Airway Team Dynamics Simulator
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            DAS 2015 Difficult Airway Algorithm • Interprofessional CRM Closed-Loop Communication • Emergency Front-of-Neck Access (eFONA)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition ${
              soundEnabled
                ? "bg-indigo-600/20 border-indigo-500 text-indigo-300"
                : "bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200"
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            Pulse Ox Tone
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition ${
              isRunning
                ? "bg-amber-500/20 border-amber-500 text-amber-300 hover:bg-amber-500/30"
                : "bg-emerald-500/20 border-emerald-500 text-emerald-300 hover:bg-emerald-500/30"
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRunning ? "Pause Sim" : "Resume Sim"}
          </button>

          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>

          <button
            onClick={() => setShowDebriefModal(true)}
            className="px-3.5 py-1.5 rounded-lg border border-violet-500/40 bg-violet-600/20 hover:bg-violet-600/30 text-violet-200 text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
          >
            <Award className="w-4 h-4 text-violet-400" />
            CRM Debrief ({debrief.totalScore}%)
          </button>
        </div>
      </header>

      {/* Main Grid: Telemetry + Team Roster + DAS Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (5 Cols): Live Anesthesia Telemetry Monitor */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                <span className="font-mono text-sm tracking-wider uppercase text-slate-300">OR Monitor 04 • Telemetry</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="font-mono text-sm text-amber-300">Apnea: {formatTime(elapsedSec)}</span>
              </div>
            </div>

            {/* Vital Signs Display */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
              {/* SpO2 */}
              <div className={`p-3 rounded-lg border flex flex-col justify-between ${getSpo2ColorClass(vitals.spO2Percent)}`}>
                <span className="text-xs font-mono tracking-wide uppercase opacity-80">SpO2 (Pulse Ox)</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-mono font-bold">{vitals.spO2Percent}%</span>
                </div>
                <span className="text-[10px] opacity-70">PaO2: {vitals.paO2MmHg} mmHg</span>
              </div>

              {/* Heart Rate */}
              <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/60 flex flex-col justify-between">
                <span className="text-xs font-mono tracking-wide uppercase text-slate-400 flex items-center justify-between">
                  HR (ECG) <Heart className="w-3.5 h-3.5 text-rose-500 animate-ping" />
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-mono font-bold text-rose-400">{vitals.heartRateBpm}</span>
                  <span className="text-xs text-slate-400">bpm</span>
                </div>
                <div className="mt-1">{getRhythmBadge(vitals.cardiacRhythm)}</div>
              </div>

              {/* Blood Pressure */}
              <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/60 flex flex-col justify-between">
                <span className="text-xs font-mono tracking-wide uppercase text-slate-400">NIBP</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-mono font-bold text-cyan-400">
                    {vitals.systolicBp}/{vitals.diastolicBp}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">MAP: {Math.round((vitals.systolicBp + 2 * vitals.diastolicBp) / 3)} mmHg</span>
              </div>

              {/* End-Tidal CO2 */}
              <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/60 flex flex-col justify-between">
                <span className="text-xs font-mono tracking-wide uppercase text-slate-400 flex items-center justify-between">
                  EtCO2 <Wind className="w-3.5 h-3.5 text-amber-400" />
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-mono font-bold text-amber-400">
                    {scenarioState.cricothyroidotomy.capnographyConfirmed ? vitals.etCo2MmHg : 0}
                  </span>
                  <span className="text-xs text-slate-400">mmHg</span>
                </div>
                <span className="text-[10px] text-slate-400">
                  {scenarioState.cricothyroidotomy.capnographyConfirmed ? "Square wave confirmed" : "No airway exchange"}
                </span>
              </div>

              {/* FRC Oxygen Reserve */}
              <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/60 flex flex-col justify-between sm:col-span-2">
                <span className="text-xs font-mono tracking-wide uppercase text-slate-400">FRC Desaturation Margin</span>
                <div className="w-full bg-slate-800 rounded-full h-3 mt-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      vitals.spO2Percent >= 90
                        ? "bg-emerald-500"
                        : vitals.spO2Percent >= 75
                        ? "bg-amber-500"
                        : "bg-rose-600"
                    }`}
                    style={{ width: `${Math.max(0, Math.min(100, vitals.spO2Percent))}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                  <span>BMI 38.5 (FRC: 1,400 mL)</span>
                  <span>VO2: 350 mL/min</span>
                </div>
              </div>
            </div>

            {/* Capnogram Trace Visualizer */}
            <div className="mt-4 p-3 rounded-lg border border-slate-800 bg-slate-950/80 font-mono">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Capnography Waveform (II)</span>
                <span className={scenarioState.cricothyroidotomy.capnographyConfirmed ? "text-emerald-400" : "text-rose-400"}>
                  {scenarioState.cricothyroidotomy.capnographyConfirmed ? "NORMAL RECTANGULAR WAVE" : "FLATLINE (NO VENTILATION)"}
                </span>
              </div>
              <div className="h-16 w-full flex items-end justify-between px-2 bg-slate-900/50 rounded border border-slate-800/80 overflow-hidden">
                {scenarioState.cricothyroidotomy.capnographyConfirmed ? (
                  <svg className="w-full h-full" viewBox="0 0 300 60" preserveAspectRatio="none">
                    <path
                      d="M 0,55 L 20,55 L 25,15 L 75,12 L 80,55 L 120,55 L 125,15 L 175,12 L 180,55 L 220,55 L 225,15 L 275,12 L 280,55 L 300,55"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                    />
                  </svg>
                ) : (
                  <div className="w-full border-b-2 border-rose-500/70 mb-1 animate-pulse" />
                )}
              </div>
            </div>
          </div>

          {/* Interprofessional Team Status Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
            <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-300 flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-sky-400" />
              Interprofessional OR Team Roster & Roles
            </h2>

            <div className="space-y-2.5">
              {(Object.keys(scenarioState.teamMembers) as TeamRole[]).map((role) => {
                const member = scenarioState.teamMembers[role];
                const isLead = role === "AIRWAY_LEAD";
                return (
                  <div
                    key={role}
                    className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                      isLead
                        ? "bg-indigo-950/20 border-indigo-500/40 text-indigo-200"
                        : "bg-slate-950/40 border-slate-800/80 text-slate-300"
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                        {member.name}
                        {isLead && (
                          <span className="px-1.5 py-0.2 bg-indigo-600 text-white rounded text-[10px] font-bold">
                            YOU (LEAD)
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">{member.title}</div>
                      <div className="text-[10px] text-emerald-400 mt-0.5">Task: {member.currentTask}</div>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm" title="Ready & Checked In" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): DAS Algorithm Commands & Front of Neck Access */}
        <div className="lg:col-span-7 space-y-4">
          {/* Action Feedback Banner */}
          {lastActionResult && (
            <div
              className={`p-3 rounded-lg border text-xs flex items-start gap-2 transition-all ${
                lastActionResult.isSuccess
                  ? "bg-emerald-950/30 border-emerald-500/50 text-emerald-200"
                  : "bg-rose-950/30 border-rose-500/50 text-rose-200"
              }`}
            >
              {lastActionResult.isSuccess ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-semibold">{lastActionResult.isSuccess ? "Action Executed: " : "Clinical Notice: "}</span>
                {lastActionResult.message}
              </div>
            </div>
          )}

          {/* DAS Difficult Airway Algorithm Control Deck */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-400" />
                DAS 2015 Difficult Airway Guidelines Execution
              </h2>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                Current: {scenarioState.currentPlan.replace(/_/g, " ")}
              </span>
            </div>

            {/* Plan A & B & C Quick Dispatch Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Plan A: Intubation */}
              <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/50">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>Plan A: Video Laryngoscopy</span>
                  <span className="text-[10px] text-slate-400">Attempts: {scenarioState.intubationAttemptsCount}/3</span>
                </div>
                <p className="text-[11px] text-slate-400 mb-2">
                  Anesthesia Resident attempts intubation with hyperangulated blade and stylet.
                </p>
                <button
                  onClick={() => handleCommand("RESIDENT_ANESTHESIA", "ATTEMPT_VIDEO_LARYNGOSCOPY")}
                  className="w-full py-2 px-3 rounded-md bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-medium transition"
                >
                  Attempt Video Laryngoscopy
                </button>
              </div>

              {/* Plan B: SAD / i-gel */}
              <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/50">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>Plan B: Supraglottic Airway</span>
                  <span className="text-[10px] text-slate-400">Attempts: {scenarioState.sadAttemptsCount}/2</span>
                </div>
                <p className="text-[11px] text-slate-400 mb-2">
                  Insert 2nd generation SAD (i-gel size 4) to establish rescue oxygenation.
                </p>
                <button
                  onClick={() => handleCommand("RESIDENT_ANESTHESIA", "INSERT_SAD_IGEL")}
                  className="w-full py-2 px-3 rounded-md bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 text-xs font-medium transition"
                >
                  Insert i-gel Supraglottic Airway
                </button>
              </div>

              {/* Plan C: Facemask & Sugammadex */}
              <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/50">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>Plan C: 2-Person Bag-Mask + OPA</span>
                </div>
                <p className="text-[11px] text-slate-400 mb-2">
                  Two-person VE grip with oral airway and high-flow 100% O2 flush.
                </p>
                <button
                  onClick={() => handleCommand("RESIDENT_ANESTHESIA", "TWO_PERSON_MASK_OPA")}
                  className="w-full py-2 px-3 rounded-md bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-300 text-xs font-medium transition"
                >
                  Attempt 2-Person Mask Ventilation
                </button>
              </div>

              {/* Sugammadex Reversal */}
              <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/50">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>Reversal: Sugammadex 16 mg/kg</span>
                  {scenarioState.sugammadexGiven && <span className="text-emerald-400 text-[10px]">Given</span>}
                </div>
                <p className="text-[11px] text-slate-400 mb-2">
                  Emergency high-dose neuromuscular reversal of Rocuronium (Circulator RN).
                </p>
                <button
                  onClick={() => handleCommand("CIRCULATING_RN", "GIVE_SUGAMMADEX_16")}
                  disabled={scenarioState.sugammadexGiven}
                  className={`w-full py-2 px-3 rounded-md border text-xs font-medium transition ${
                    scenarioState.sugammadexGiven
                      ? "bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed"
                      : "bg-purple-600/20 hover:bg-purple-600/30 border-purple-500/40 text-purple-300"
                  }`}
                >
                  {scenarioState.sugammadexGiven ? "Sugammadex Administered" : "Order Sugammadex 16 mg/kg"}
                </button>
              </div>
            </div>

            {/* CICO DECLARATION BUTTON */}
            <div className="mt-4 pt-4 border-t border-slate-800">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-lg border border-rose-500/60 bg-rose-950/20">
                <div>
                  <div className="text-xs font-bold text-rose-300 uppercase tracking-wide flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    DAS Plan D Trigger: Cannot Intubate, Cannot Oxygenate (CICO)
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    When Plans A, B, and C fail during persistent desaturation, verbally declare CICO to initiate surgical airway.
                  </p>
                </div>
                <button
                  onClick={() => handleCommand("AIRWAY_LEAD", "DECLARE_CICO")}
                  disabled={scenarioState.cicoDeclared}
                  className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider shrink-0 transition shadow-lg ${
                    scenarioState.cicoDeclared
                      ? "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
                      : "bg-rose-600 hover:bg-rose-500 text-white border border-rose-400 animate-pulse"
                  }`}
                >
                  {scenarioState.cicoDeclared ? "CICO DECLARED (PLAN D ACTIVE)" : "DECLARE CICO EMERGENCY"}
                </button>
              </div>
            </div>
          </div>

          {/* Plan D: Scalpel-Bougie-Tube Surgical Cricothyroidotomy Bench */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-rose-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                  Plan D: Emergency Scalpel-Bougie-Tube Cricothyroidotomy Bench
                </h3>
              </div>
              <button
                onClick={() => handleCommand("CIRCULATING_RN", "CALL_AIRWAY_CART")}
                disabled={scenarioState.airwayCartAtBedside}
                className={`px-2.5 py-1 rounded text-xs font-medium border ${
                  scenarioState.airwayCartAtBedside
                    ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-300"
                    : "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300"
                }`}
              >
                {scenarioState.airwayCartAtBedside ? "Airway Cart Bedside ✓" : "Call Cart to Bedside"}
              </button>
            </div>

            {/* Step-by-Step Surgical Progression */}
            <div className="space-y-2.5">
              {/* Step 1: Laryngeal Handshake */}
              <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-xs text-slate-200 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-300">
                      1
                    </span>
                    Step 1: Anatomical Laryngeal Handshake
                  </div>
                  <p className="text-[11px] text-slate-400 ml-7">
                    Palpate thyroid notch, cricothyroid membrane (CTM), and cricoid ring with non-dominant hand.
                  </p>
                </div>
                <button
                  onClick={() => handleCommand("AIRWAY_LEAD", "PREPARE_SCALPEL_BOUGIE")}
                  disabled={scenarioState.cricothyroidotomy.laryngealHandshakeDone}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition ${
                    scenarioState.cricothyroidotomy.laryngealHandshakeDone
                      ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 cursor-default"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white"
                  }`}
                >
                  {scenarioState.cricothyroidotomy.laryngealHandshakeDone ? "Handshake Completed ✓" : "Perform Handshake"}
                </button>
              </div>

              {/* Step 2: Transverse Stab Incision */}
              <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-xs text-slate-200 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-300">
                      2
                    </span>
                    Step 2: Transverse Stab Incision & 90° Caudal Blade Turn
                  </div>
                  <p className="text-[11px] text-slate-400 ml-7">
                    Full thickness #10 scalpel incision across CTM; rotate blade 90° towards patient feet.
                  </p>
                </div>
                <button
                  onClick={() => handleCommand("AIRWAY_LEAD", "PERFORM_CRIC_INCISION")}
                  disabled={
                    !scenarioState.cricothyroidotomy.laryngealHandshakeDone ||
                    scenarioState.cricothyroidotomy.bladeTurned90Deg
                  }
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition ${
                    scenarioState.cricothyroidotomy.bladeTurned90Deg
                      ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 cursor-default"
                      : !scenarioState.cricothyroidotomy.laryngealHandshakeDone
                      ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white"
                  }`}
                >
                  {scenarioState.cricothyroidotomy.bladeTurned90Deg ? "Incision & Blade Turned ✓" : "Make Incision & Rotate"}
                </button>
              </div>

              {/* Step 3: Insert Coude-Tip Bougie */}
              <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-xs text-slate-200 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-300">
                      3
                    </span>
                    Step 3: Insert Coude-Tip Bougie (Tactile Clicks)
                  </div>
                  <p className="text-[11px] text-slate-400 ml-7">
                    Advance angled coude tip 10-15 cm along posterior scalpel blade into trachea until rings felt.
                  </p>
                </div>
                <button
                  onClick={() => handleCommand("AIRWAY_LEAD", "INSERT_BOUGIE")}
                  disabled={
                    !scenarioState.cricothyroidotomy.bladeTurned90Deg ||
                    scenarioState.cricothyroidotomy.bougieRailroaded
                  }
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition ${
                    scenarioState.cricothyroidotomy.bougieRailroaded
                      ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 cursor-default"
                      : !scenarioState.cricothyroidotomy.bladeTurned90Deg
                      ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white"
                  }`}
                >
                  {scenarioState.cricothyroidotomy.bougieRailroaded ? "Bougie Railroaded ✓" : "Insert Bougie"}
                </button>
              </div>

              {/* Step 4: Railroad 6.0 mm ETT */}
              <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-xs text-slate-200 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-300">
                      4
                    </span>
                    Step 4: Railroad Cuffed 6.0 mm ETT Over Bougie
                  </div>
                  <p className="text-[11px] text-slate-400 ml-7">
                    Railroad lubricated 6.0 mm cuffed tube over bougie into trachea with twisting motion.
                  </p>
                </div>
                <button
                  onClick={() => handleCommand("AIRWAY_LEAD", "RAILROAD_60_TUBE")}
                  disabled={
                    !scenarioState.cricothyroidotomy.bougieRailroaded ||
                    scenarioState.cricothyroidotomy.tube60Inserted
                  }
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition ${
                    scenarioState.cricothyroidotomy.tube60Inserted
                      ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 cursor-default"
                      : !scenarioState.cricothyroidotomy.bougieRailroaded
                      ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white"
                  }`}
                >
                  {scenarioState.cricothyroidotomy.tube60Inserted ? "Tube Railroaded ✓" : "Railroad 6.0 ETT"}
                </button>
              </div>

              {/* Step 5: Inflate Cuff & Confirm Capnography */}
              <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-xs text-slate-200 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-300">
                      5
                    </span>
                    Step 5: Inflate Cuff & Confirm Ventilation
                  </div>
                  <p className="text-[11px] text-slate-400 ml-7">
                    Inflate cuff, remove bougie, attach bag-valve, confirm square-wave EtCO2 and bilateral chest rise.
                  </p>
                </div>
                <button
                  onClick={() => handleCommand("AIRWAY_LEAD", "INFLATE_CUFF_CONFIRM")}
                  disabled={
                    !scenarioState.cricothyroidotomy.tube60Inserted ||
                    scenarioState.cricothyroidotomy.capnographyConfirmed
                  }
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition ${
                    scenarioState.cricothyroidotomy.capnographyConfirmed
                      ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 cursor-default"
                      : !scenarioState.cricothyroidotomy.tube60Inserted
                      ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                      : "bg-emerald-600 hover:bg-emerald-500 text-white animate-pulse"
                  }`}
                >
                  {scenarioState.cricothyroidotomy.capnographyConfirmed ? "Airway Restored ✓" : "Inflate & Confirm"}
                </button>
              </div>
            </div>
          </div>

          {/* CRM Event Log & Transcript */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-400" />
              Closed-Loop Communication Audit Trail ({scenarioState.eventLog.length} events)
            </h3>
            <div className="max-h-48 overflow-y-auto space-y-1.5 font-mono text-xs pr-1">
              {scenarioState.eventLog.map((ev) => {
                let badgeColor = "bg-slate-800 text-slate-300";
                if (ev.type === "CALLOUT") badgeColor = "bg-blue-900/60 text-blue-200 border border-blue-700";
                if (ev.type === "CHECKBACK") badgeColor = "bg-emerald-900/60 text-emerald-200 border border-emerald-700";
                if (ev.type === "FIXATION_PENALTY") badgeColor = "bg-rose-950 text-rose-300 border border-rose-600";
                if (ev.type === "CRITICAL_ALERT") badgeColor = "bg-amber-950 text-amber-200 border border-amber-600";

                return (
                  <div key={ev.id} className="p-2 rounded bg-slate-950/60 border border-slate-800/80 flex items-start gap-2">
                    <span className="text-slate-500 text-[10px] shrink-0 mt-0.5">+{ev.timestampSec}s</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase shrink-0 ${badgeColor}`}>
                      {ev.type}
                    </span>
                    <div className="flex-1">
                      <span className="text-slate-400 font-semibold mr-1">[{ev.actor}]:</span>
                      <span className="text-slate-200">{ev.message}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* CRM Debrief & Scoring Modal */}
      {showDebriefModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-violet-400" />
                <h3 className="text-lg font-bold text-white">Crisis Resource Management (CRM) Debrief Rubric</h3>
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
                <span className="text-xs text-slate-400 uppercase tracking-wider">Overall CRM Performance</span>
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
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="text-xs text-slate-400">Closed-Loop Communication</div>
                <div className="text-lg font-bold text-slate-200 mt-1">{debrief.breakdown.closedLoopCommunication} / 25 pts</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="text-xs text-slate-400">DAS Algorithm Adherence</div>
                <div className="text-lg font-bold text-slate-200 mt-1">{debrief.breakdown.dasAlgorithmAdherence} / 25 pts</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="text-xs text-slate-400">CICO Declaration Timing</div>
                <div className="text-lg font-bold text-slate-200 mt-1">{debrief.breakdown.cicoDeclarationTiming} / 25 pts</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="text-xs text-slate-400">Surgical Technical Skill</div>
                <div className="text-lg font-bold text-slate-200 mt-1">{debrief.breakdown.surgicalTechnicalSkill} / 25 pts</div>
              </div>
            </div>

            {/* Qualitative Feedback */}
            <div className="mt-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Pedagogical Assessment & Feedback
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {debrief.feedbackComments.map((comment, i) => (
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