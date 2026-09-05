'use client';

/**
 * OSCECircuitStation.tsx
 * Multi-Domain Interactive OSCE Circuit Examination Station
 * Location: frontend/components/exam/OSCECircuitStation.tsx
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  OsceStation,
  OsceDimension,
} from '@/lib/exam/osceStationRegistry';
import {
  OsceCircuitPhase,
  OsceStationAttempt,
  evaluateStationPerformance,
  playOsceChime,
} from '@/.gemini/skills/OsceCircuitEngine';
import {
  Clock,
  Volume2,
  VolumeX,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  User,
  Stethoscope,
  ShieldAlert,
  Award,
  ArrowRight,
  RotateCcw,
  Sparkles,
  ChevronRight,
  FileText,
  MessageSquare,
  Activity,
  Check,
  Mic,
} from 'lucide-react';
import SimulatedPatientVoiceStation from '@/components/cases/SimulatedPatientVoiceStation';

interface OSCECircuitStationProps {
  station: OsceStation;
  circuitMode?: boolean;
  stationIndex?: number;
  totalCircuitStations?: number;
  readingTimeSeconds?: number;
  onCompleteStation?: (attempt: OsceStationAttempt) => void;
  onNextStation?: () => void;
}

type StationTab = 'SCENARIO' | 'ACTOR_CUES' | 'CHECKLIST' | 'SAFETY_FLAGS' | 'MODEL_DEBRIEF';

export default function OSCECircuitStation({
  station,
  circuitMode = false,
  stationIndex = 1,
  totalCircuitStations = 1,
  readingTimeSeconds = 60,
  onCompleteStation,
  onNextStation,
}: OSCECircuitStationProps) {
  // Phase management
  const [phase, setPhase] = useState<OsceCircuitPhase>(
    circuitMode ? 'READING_DOOR_NOTE' : 'STATION_ENCOUNTER'
  );

  // Time state
  const encounterTotalSeconds = station.timeLimitMinutes * 60;
  const [timeLeft, setTimeLeft] = useState<number>(
    circuitMode ? readingTimeSeconds : encounterTotalSeconds
  );
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Interaction states
  const [activeTab, setActiveTab] = useState<StationTab>('CHECKLIST');
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [triggeredCriticalFails, setTriggeredCriticalFails] = useState<Set<string>>(new Set());
  const [revealedActorCues, setRevealedActorCues] = useState<Set<number>>(new Set());
  const [examSubmitted, setExamSubmitted] = useState<boolean>(false);
  const [twoMinuteWarningFired, setTwoMinuteWarningFired] = useState<boolean>(false);
  const [actorMode, setActorMode] = useState<'VOICE' | 'CARDS'>('CARDS');

  // Reset when station changes
  useEffect(() => {
    setCheckedItems(new Set());
    setTriggeredCriticalFails(new Set());
    setRevealedActorCues(new Set());
    setExamSubmitted(false);
    setTwoMinuteWarningFired(false);
    if (circuitMode) {
      setPhase('READING_DOOR_NOTE');
      setTimeLeft(readingTimeSeconds);
      setActiveTab('SCENARIO');
    } else {
      setPhase('STATION_ENCOUNTER');
      setTimeLeft(station.timeLimitMinutes * 60);
      setActiveTab('CHECKLIST');
    }
  }, [station.id, circuitMode, readingTimeSeconds, station.timeLimitMinutes]);

  // Countdown timer logic
  useEffect(() => {
    if (!isTimerRunning || examSubmitted || phase === 'STATION_DEBRIEF' || phase === 'CIRCUIT_COMPLETED') {
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Timer expired
          if (phase === 'READING_DOOR_NOTE') {
            // Reading time elapsed -> start station encounter
            setPhase('STATION_ENCOUNTER');
            playOsceChime('START', isMuted);
            setActiveTab('CHECKLIST');
            return encounterTotalSeconds;
          } else if (phase === 'STATION_ENCOUNTER') {
            // Station time elapsed -> finish
            playOsceChime('FINISH', isMuted);
            setExamSubmitted(true);
            setPhase('STATION_DEBRIEF');
            return 0;
          }
        }

        // 2-minute warning check
        if (phase === 'STATION_ENCOUNTER' && prev === 120 && !twoMinuteWarningFired) {
          setTwoMinuteWarningFired(true);
          playOsceChime('WARNING_2MIN', isMuted);
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [
    isTimerRunning,
    examSubmitted,
    phase,
    isMuted,
    encounterTotalSeconds,
    twoMinuteWarningFired,
  ]);

  // Checklist toggles
  const toggleCheck = (itemId: string) => {
    if (examSubmitted) return;
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  const toggleCriticalFail = (failReason: string) => {
    if (examSubmitted) return;
    setTriggeredCriticalFails((prev) => {
      const next = new Set(prev);
      if (next.has(failReason)) next.delete(failReason);
      else next.add(failReason);
      return next;
    });
  };

  const toggleActorCue = (cueIndex: number) => {
    setRevealedActorCues((prev) => {
      const next = new Set(prev);
      if (next.has(cueIndex)) next.delete(cueIndex);
      else next.add(cueIndex);
      return next;
    });
  };

  // Performance calculation
  const performance: OsceStationAttempt = useMemo(() => {
    const timeSpent =
      phase === 'STATION_ENCOUNTER'
        ? encounterTotalSeconds - timeLeft
        : encounterTotalSeconds;
    return evaluateStationPerformance(
      station,
      Array.from(checkedItems),
      Array.from(triggeredCriticalFails),
      timeSpent
    );
  }, [station, checkedItems, triggeredCriticalFails, phase, encounterTotalSeconds, timeLeft]);

  // Submission handler
  const handleFinalSubmit = useCallback(() => {
    setExamSubmitted(true);
    setPhase('STATION_DEBRIEF');
    playOsceChime('FINISH', isMuted);
    if (onCompleteStation) {
      onCompleteStation(performance);
    }
  }, [isMuted, onCompleteStation, performance]);

  const enterEncounterRoomEarly = () => {
    setPhase('STATION_ENCOUNTER');
    setTimeLeft(encounterTotalSeconds);
    playOsceChime('START', isMuted);
    setActiveTab('CHECKLIST');
  };

  // Format seconds mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // AI Socratic discussion bridge
  const askAiAboutStation = () => {
    const context = `[OSCE Station Context] Station: ${station.title} (${station.domainTitle}).
Type: ${station.stationType}. Difficulty: ${station.difficulty}.
Candidate Brief: ${station.candidateBrief}
Patient: ${station.patientProfile.name}, ${station.patientProfile.age}yo ${station.patientProfile.gender}.
Current Candidate Score: ${performance.scorePercentage}% (${performance.totalScored}/${performance.totalPossible} marks).
Passed: ${performance.isPassed ? 'YES' : 'NO'}.
Critical Violations: ${performance.criticalFailsTriggered.join('; ') || 'None'}.
Model Answers / Guidance: ${station.examinerGuidance.join('; ')}`;

    window.dispatchEvent(
      new CustomEvent('mediverse:open-ai-with-context', { detail: { context } })
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Top Station Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {station.domainTitle}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                {station.stationType} Station
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
                Pass: {station.passingScorePct}%
              </span>
              {circuitMode && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Station {stationIndex} of {totalCircuitStations}
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Stethoscope className="w-6 h-6 text-blue-400" />
              {station.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Setting: <span className="text-slate-200">{station.patientProfile.setting}</span> • Patient:{' '}
              <span className="text-slate-200">{station.patientProfile.name}</span> ({station.patientProfile.age}yo {station.patientProfile.gender})
            </p>
          </div>

          {/* Timer & Sound Controls */}
          <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-end">
            {/* Audio Toggle */}
            <button
              onClick={() => setIsMuted((prev) => !prev)}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition border border-slate-700"
              title={isMuted ? 'Unmute OSCE Chimes' : 'Mute OSCE Chimes'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Timer Badge */}
            <div
              className={`px-4 py-2 rounded-xl border font-mono font-black flex items-center gap-2 text-sm sm:text-base ${
                timeLeft <= 120 && phase === 'STATION_ENCOUNTER'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300 animate-pulse'
                  : phase === 'READING_DOOR_NOTE'
                  ? 'bg-amber-950/50 border-amber-600 text-amber-300'
                  : 'bg-slate-950 border-slate-800 text-white'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>
                {phase === 'READING_DOOR_NOTE' ? 'Reading: ' : 'Time Left: '}
                {formatTime(timeLeft)}
              </span>
            </div>

            {/* Quick Submit / Action */}
            {phase === 'READING_DOOR_NOTE' ? (
              <button
                onClick={enterEncounterRoomEarly}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                Enter Room <ChevronRight className="w-4 h-4" />
              </button>
            ) : phase === 'STATION_ENCOUNTER' ? (
              <button
                onClick={handleFinalSubmit}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                Submit Station
              </button>
            ) : null}
          </div>
        </div>

        {/* Phase Notification Banner */}
        {phase === 'READING_DOOR_NOTE' && (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Candidate Reading Interval: Read the door note and plan your clinical encounter.
            </span>
            <button
              onClick={enterEncounterRoomEarly}
              className="text-xs font-bold underline hover:text-amber-200 ml-2 shrink-0"
            >
              Skip to Encounter →
            </button>
          </div>
        )}

        {twoMinuteWarningFired && phase === 'STATION_ENCOUNTER' && timeLeft <= 120 && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 animate-bounce" />
            2-MINUTE WARNING: Complete your physical examination and conclude patient communication.
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-1.5 flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('SCENARIO')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'SCENARIO'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Door Note &amp; Scenario</span>
        </button>

        <button
          onClick={() => setActiveTab('ACTOR_CUES')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'ACTOR_CUES'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Standardized Actor Prompts</span>
          <span className="text-[10px] bg-slate-800 px-1.5 py-0.2 rounded-full">
            {station.actorCues.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('CHECKLIST')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'CHECKLIST'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Examiner Marking Checklist</span>
          <span className="text-[10px] bg-slate-800 px-1.5 py-0.2 rounded-full">
            {checkedItems.size}/{station.checklist.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('SAFETY_FLAGS')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'SAFETY_FLAGS'
              ? 'bg-rose-600 text-white shadow-sm'
              : triggeredCriticalFails.size > 0
              ? 'text-rose-400 hover:bg-rose-950/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Critical Safety Triggers</span>
          {triggeredCriticalFails.size > 0 && (
            <span className="text-[10px] bg-rose-500 text-slate-950 px-1.5 py-0.2 rounded-full font-black">
              {triggeredCriticalFails.size}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('MODEL_DEBRIEF')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'MODEL_DEBRIEF'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Model Debrief &amp; Guidance</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
        {/* ============================================================ */}
        {/* TAB 1: SCENARIO / DOOR NOTE */}
        {/* ============================================================ */}
        {activeTab === 'SCENARIO' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-gradient-to-r from-blue-950/40 to-slate-900 border border-blue-800/40 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-xs font-mono text-blue-400 uppercase font-bold tracking-wider mb-2">
                <FileText className="w-4 h-4" />
                Candidate Door Note Brief
              </div>
              <p className="text-base sm:text-lg text-white font-medium leading-relaxed">
                {station.candidateBrief}
              </p>
            </div>

            {/* Patient Profile Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-400" />
                Standardized Patient Profile &amp; Demographics
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
                  <div className="text-slate-400">Name</div>
                  <div className="font-bold text-white mt-0.5">{station.patientProfile.name}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
                  <div className="text-slate-400">Age &amp; Gender</div>
                  <div className="font-bold text-white mt-0.5">
                    {station.patientProfile.age} years • {station.patientProfile.gender}
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
                  <div className="text-slate-400">Clinical Setting</div>
                  <div className="font-bold text-white mt-0.5">{station.patientProfile.setting}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
                  <div className="text-slate-400">Chief Complaint</div>
                  <div className="font-bold text-white mt-0.5 truncate" title={station.patientProfile.chiefComplaint}>
                    {station.patientProfile.chiefComplaint}
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions for candidate */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-300 leading-relaxed">
              <div className="font-bold text-white mb-1.5 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                General OSCE Examination Instructions:
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Demonstrate all actions and explain your clinical rationale aloud to the examiner.</li>
                <li>Communicate with the standardized actor with professional empathy, clear non-jargon language, and active listening.</li>
                <li>Observe strict aseptic precautions and safety protocols where indicated.</li>
                <li>Avoid critical safety violations which trigger mandatory station failure.</li>
              </ul>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: STANDARDIZED ACTOR PROMPTS */}
        {/* ============================================================ */}
        {activeTab === 'ACTOR_CUES' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Mic className="w-4 h-4 text-rose-400" />
                  Standardized Simulated Actor Dialogue
                </h3>
                <p className="text-xs text-slate-400">
                  Interview the simulated actor in open voice/text or inspect standardized cue triggers.
                </p>
              </div>

              {/* Mode Toggle Pills */}
              <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800 self-start sm:self-auto">
                <button
                  onClick={() => setActorMode('VOICE')}
                  className={`px-3 py-1 rounded text-xs font-bold transition flex items-center gap-1.5 ${
                    actorMode === 'VOICE'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  AI Voice Actor
                </button>
                <button
                  onClick={() => setActorMode('CARDS')}
                  className={`px-3 py-1 rounded text-xs font-bold transition flex items-center gap-1.5 ${
                    actorMode === 'CARDS'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Cue Cards ({station.actorCues.length})
                </button>
              </div>
            </div>

            {actorMode === 'VOICE' ? (
              <SimulatedPatientVoiceStation caseId={station.id} />
            ) : (
              <div className="space-y-3">
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      const allIndices = station.actorCues.map((_, i) => i);
                      setRevealedActorCues(new Set(allIndices));
                    }}
                    className="text-xs text-blue-400 hover:text-blue-300 underline font-semibold"
                  >
                    Reveal All Cues
                  </button>
                </div>
              {station.actorCues.map((cue, idx) => {
                const isRevealed = revealedActorCues.has(idx);
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 transition space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-xs text-blue-400 font-mono font-bold flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        Candidate Trigger / Question:
                      </div>
                      <button
                        onClick={() => toggleActorCue(idx)}
                        className="text-xs text-slate-400 hover:text-white px-2.5 py-1 bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-800 transition"
                      >
                        {isRevealed ? 'Hide Response' : 'Ask Patient / Examine'}
                      </button>
                    </div>

                    <p className="text-xs font-semibold text-white pl-7">
                      &ldquo;{cue.trigger}&rdquo;
                    </p>

                    {isRevealed && (
                      <div className="pl-7 pt-2 border-t border-slate-800/80 animate-fade-in">
                        <div className="text-[10px] uppercase font-bold text-indigo-400 font-mono mb-1">
                          Standardized Actor Response:
                        </div>
                        <p className="text-xs text-slate-200 italic leading-relaxed bg-indigo-950/20 border border-indigo-800/30 p-3 rounded-lg">
                          {cue.response}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: EXAMINER CHECKLIST */}
        {/* ============================================================ */}
        {activeTab === 'CHECKLIST' && (
          <div className="space-y-6 animate-fade-in">
            {/* Live Score Bar */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Real-Time Examination Score
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-white font-mono">
                    {performance.scorePercentage}%
                  </span>
                  <span className="text-xs text-slate-400">
                    ({performance.totalScored} / {performance.totalPossible} marks)
                  </span>
                  <span
                    className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      performance.isPassed
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {performance.isPassed ? 'MEETING PASS THRESHOLD' : 'BELOW PASSING CUTOFF'}
                  </span>
                </div>
              </div>

              {/* Dimension Score Mini Indicators */}
              <div className="grid grid-cols-5 gap-1.5 w-full sm:w-auto">
                {(Object.keys(performance.dimensionScores) as OsceDimension[]).map((dim) => {
                  const d = performance.dimensionScores[dim];
                  const label =
                    dim === 'COMMUNICATION'
                      ? 'COMM'
                      : dim === 'CLINICAL_SKILL'
                      ? 'SKILL'
                      : dim === 'PATIENT_SAFETY'
                      ? 'SAFE'
                      : dim === 'DIAGNOSTIC_REASONING'
                      ? 'DIAG'
                      : 'MGMT';
                  return (
                    <div key={dim} className="text-center p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px]">
                      <div className="text-slate-400 font-mono">{label}</div>
                      <div className="font-bold text-white mt-0.5">{d.percentage}%</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Checklist Items Grouped */}
            <div className="space-y-2.5">
              {station.checklist.map((item) => {
                const isChecked = checkedItems.has(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isChecked
                        ? 'bg-emerald-950/20 border-emerald-700/60 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isChecked ? 'bg-emerald-500 text-slate-950' : 'border border-slate-700 bg-slate-900'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    <div className="flex-1 text-xs">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                          {item.dimension.replace('_', ' ')}
                        </span>
                        <span className="font-mono text-[10px] font-bold text-blue-400">
                          +{item.marks} marks
                        </span>
                        {item.isCriticalSafety && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-rose-500/20 text-rose-400 border border-rose-500/30">
                            CRITICAL SAFETY
                          </span>
                        )}
                      </div>
                      <p className={`font-sans leading-relaxed ${isChecked ? 'text-white' : 'text-slate-300'}`}>
                        {item.text}
                      </p>
                      {item.examinerNote && isChecked && (
                        <p className="mt-1 text-[11px] text-amber-300/90 italic">
                          Examiner Note: {item.examinerNote}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: CRITICAL SAFETY RED FLAGS */}
        {/* ============================================================ */}
        {activeTab === 'SAFETY_FLAGS' && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-800/40 text-xs text-rose-300">
              <div className="font-bold text-sm mb-1 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                Statutory Critical Safety Violations
              </div>
              <p className="text-slate-300">
                In professional licensure OSCEs, committing any of the following critical errors triggers
                an automatic safety failure for the station regardless of checklist mark accumulation.
              </p>
            </div>

            <div className="space-y-3">
              {station.criticalFailTriggers.map((trigger, idx) => {
                const isTriggered = triggeredCriticalFails.has(trigger);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleCriticalFail(trigger)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                      isTriggered
                        ? 'bg-rose-950/40 border-rose-600 shadow-md ring-1 ring-rose-600'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                          isTriggered ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        !
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{trigger}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Click to {isTriggered ? 'dismiss' : 'simulate/record'} safety violation
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                        isTriggered
                          ? 'bg-rose-500 text-white border-rose-400'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {isTriggered ? 'SAFETY VIOLATION DETECTED' : 'Not Triggered'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 5: MODEL DEBRIEF & GUIDANCE */}
        {/* ============================================================ */}
        {activeTab === 'MODEL_DEBRIEF' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-indigo-950/20 border border-indigo-800/40 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Award className="w-4 h-4" />
                Examiner Guidance &amp; Model Benchmark
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {station.modelDebrief}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Official Examiner Evaluation Guidance Notes:
              </h4>
              <ul className="space-y-2">
                {station.examinerGuidance.map((note, idx) => (
                  <li
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-md bg-indigo-500/15 text-indigo-300 flex items-center justify-center font-bold text-[10px] shrink-0">
                      ✓
                    </span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* POST-STATION DEBRIEF MODAL / VIEW */}
        {/* ============================================================ */}
        {examSubmitted && (
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {performance.isPassed ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-8 h-8 text-rose-400 shrink-0" />
                )}
                <div>
                  <h3 className="text-base font-black text-white">
                    Station Attempt Concluded —{' '}
                    <span className={performance.isPassed ? 'text-emerald-400' : 'text-rose-400'}>
                      {performance.isPassed ? 'PASSED' : 'FAILED'}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Candidate scored {performance.scorePercentage}% (Passing threshold: {station.passingScorePct}%)
                  </p>
                </div>
              </div>

              <button
                onClick={askAiAboutStation}
                className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Ask AI Examiner
              </button>
            </div>

            {performance.criticalFailsTriggered.length > 0 && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-700/60 text-xs text-rose-300">
                <span className="font-bold">Immediate Safety Fails: </span>
                {performance.criticalFailsTriggered.join(', ')}
              </div>
            )}

            {/* Next Station Action */}
            {circuitMode && onNextStation && (
              <div className="pt-3 border-t border-slate-800 flex justify-end">
                <button
                  onClick={onNextStation}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-lg"
                >
                  Proceed to Next Station ({stationIndex + 1}/{totalCircuitStations})
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
