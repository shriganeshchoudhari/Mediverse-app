"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Users,
  Activity,
  Heart,
  Zap,
  Clock,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Volume2,
  VolumeX,
  MessageSquare,
  BookOpen,
  Table,
  Sliders,
  Sparkles,
  Info
} from 'lucide-react';
import {
  DEFAULT_TEAM_MEMBERS,
  REVERSIBLE_CAUSES_LIST,
  CRM_SCENARIOS,
  TeamRole,
  TeamMember,
  CommunicationMessage,
  CrmTelemetry,
  ReversibleCause,
  validateClosedLoopMessage,
  computeCrmStep
} from '../../.gemini/skills/CodeTeamCrmEngine';

export default function CodeTeamCrmSimulator() {
  const scenarios = CRM_SCENARIOS;
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(scenarios[0].id);
  const currentScenario = useMemo(
    () => scenarios.find(s => s.id === selectedScenarioId) || scenarios[0],
    [scenarios, selectedScenarioId]
  );

  const [activeTab, setActiveTab] = useState<'arena' | 'comms' | 'acls-tree'>('arena');

  // Team state
  const [team, setTeam] = useState<Record<TeamRole, TeamMember>>(DEFAULT_TEAM_MEMBERS);

  // Reversible causes
  const [causes, setCauses] = useState<ReversibleCause[]>(REVERSIBLE_CAUSES_LIST);

  // Telemetry state
  const [telemetry, setTelemetry] = useState<CrmTelemetry>({
    elapsedSeconds: 0,
    cycleTimerSeconds: 0,
    cycleCount: 1,
    chestCompressionFraction: 0.88,
    totalHandsOnSeconds: 88,
    totalHandsOffSeconds: 12,
    compressorRateBpm: 112,
    compressorDepthMm: 54,
    etco2MmHg: 24,
    teamStressIndex: 42,
    closedLoopCompliancePercent: 94,
    currentRhythm: currentScenario.initialRhythm,
    shocksDelivered: 0,
    epinephrineDosesGiven: 0,
    amiodaroneDosesGiven: 0
  });

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompressing, setIsCompressing] = useState<boolean>(true);
  const [isDefibCharged, setIsDefibCharged] = useState<boolean>(false);
  const [defibEnergyJoules, setDefibEnergyJoules] = useState<number>(200);

  // Communication message stream
  const [messages, setMessages] = useState<CommunicationMessage[]>([
    {
      id: 'm-init',
      senderRole: 'TEAM_LEADER',
      senderName: DEFAULT_TEAM_MEMBERS.TEAM_LEADER.assignedUser,
      content: 'Team, we have a witnessed cardiac arrest. Marcus on compressions, Carlos on airway. I need defibrillator pads placed STAT.',
      timestampSeconds: 0,
      type: 'DIRECTIVE',
      isClosedLoop: true
    },
    {
      id: 'm-init-readback',
      senderRole: 'COMPRESSOR',
      senderName: DEFAULT_TEAM_MEMBERS.COMPRESSOR.assignedUser,
      content: 'Starting chest compressions at 110/min, 5-6 cm depth.',
      timestampSeconds: 2,
      type: 'READBACK',
      isClosedLoop: true,
      closedLoopId: 'm-init'
    }
  ]);

  // Timer loop for simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTeam(prevTeam => {
          const compFatigue = Math.min(100, prevTeam.COMPRESSOR.fatiguePercent + (isCompressing ? 0.4 : -0.2));
          return {
            ...prevTeam,
            COMPRESSOR: {
              ...prevTeam.COMPRESSOR,
              fatiguePercent: parseFloat(compFatigue.toFixed(1))
            }
          };
        });

        setTelemetry(prev => {
          const compFatigue = team.COMPRESSOR.fatiguePercent;
          return computeCrmStep(prev, isCompressing, compFatigue);
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isCompressing, team.COMPRESSOR.fatiguePercent]);

  // Scenario switch handler
  const handleScenarioSelect = (scId: string) => {
    setSelectedScenarioId(scId);
    const targetSc = scenarios.find(s => s.id === scId);
    if (targetSc) {
      setTelemetry(prev => ({
        ...prev,
        currentRhythm: targetSc.initialRhythm,
        elapsedSeconds: 0,
        cycleTimerSeconds: 0,
        cycleCount: 1,
        shocksDelivered: 0,
        epinephrineDosesGiven: 0,
        amiodaroneDosesGiven: 0
      }));
      setIsRunning(false);
      setIsCompressing(true);
      setIsDefibCharged(false);
    }
  };

  // Actions
  const handleSwapCompressor = () => {
    setTeam(prev => ({
      ...prev,
      COMPRESSOR: {
        ...prev.COMPRESSOR,
        fatiguePercent: 0,
        assignedUser: prev.COMPRESSOR.assignedUser.includes('Marcus') ? 'David Miller, RN' : 'Marcus Vance, BSN',
        currentAction: 'Fresh compressor took over chest compressions'
      }
    }));
    addCommunicationMessage({
      senderRole: 'TEAM_LEADER',
      senderName: team.TEAM_LEADER.assignedUser,
      content: 'Rotate compressors now! 2-minute cycle swap.',
      type: 'DIRECTIVE'
    });
    addCommunicationMessage({
      senderRole: 'COMPRESSOR',
      senderName: 'David Miller, RN',
      content: 'Compressor swapped. Chest compressions resumed.',
      type: 'READBACK'
    });
  };

  const handleChargeDefibrillator = () => {
    setIsDefibCharged(true);
    addCommunicationMessage({
      senderRole: 'DEFIBRILLATOR_OPERATOR',
      senderName: team.DEFIBRILLATOR_OPERATOR.assignedUser,
      content: `Pre-charging defibrillator to ${defibEnergyJoules}J biphasic during CPR hover.`,
      type: 'CALLOUT'
    });
  };

  const handleDeliverShock = () => {
    if (!isDefibCharged) return;
    setIsCompressing(false);
    setTimeout(() => {
      setIsDefibCharged(false);
      setIsCompressing(true);
      setTelemetry(prev => ({
        ...prev,
        shocksDelivered: prev.shocksDelivered + 1,
        currentRhythm: prev.currentRhythm === 'VF' ? 'ROSC' : prev.currentRhythm
      }));
      addCommunicationMessage({
        senderRole: 'DEFIBRILLATOR_OPERATOR',
        senderName: team.DEFIBRILLATOR_OPERATOR.assignedUser,
        content: `I am clear, you are clear, team clear! Shock delivered at ${defibEnergyJoules}J. Compressions immediately resumed!`,
        type: 'CONFIRMATION'
      });
    }, 800);
  };

  const handleGiveEpinephrine = () => {
    setTelemetry(prev => ({
      ...prev,
      epinephrineDosesGiven: prev.epinephrineDosesGiven + 1
    }));
    addCommunicationMessage({
      senderRole: 'TEAM_LEADER',
      senderName: team.TEAM_LEADER.assignedUser,
      content: 'Med nurse, please give Epinephrine 1 milligram IV push with 20 mL saline flush.',
      type: 'DIRECTIVE'
    });
    addCommunicationMessage({
      senderRole: 'MEDICATION_NURSE',
      senderName: team.MEDICATION_NURSE.assignedUser,
      content: 'Epinephrine 1 milligram IV push given with 20 mL saline flush and limb elevated.',
      type: 'READBACK'
    });
  };

  const handleGiveAmiodarone = () => {
    setTelemetry(prev => ({
      ...prev,
      amiodaroneDosesGiven: prev.amiodaroneDosesGiven + 1
    }));
    const dose = telemetry.amiodaroneDosesGiven === 0 ? '300 mg' : '150 mg';
    addCommunicationMessage({
      senderRole: 'TEAM_LEADER',
      senderName: team.TEAM_LEADER.assignedUser,
      content: `Med nurse, administer Amiodarone ${dose} IV push for refractory shockable rhythm.`,
      type: 'DIRECTIVE'
    });
    addCommunicationMessage({
      senderRole: 'MEDICATION_NURSE',
      senderName: team.MEDICATION_NURSE.assignedUser,
      content: `Amiodarone ${dose} IV push administered.`,
      type: 'READBACK'
    });
  };

  const handleTreatCause = (causeId: string) => {
    setCauses(prev =>
      prev.map(c => (c.id === causeId ? { ...c, isIdentified: true, isTreated: true } : c))
    );
    const target = causes.find(c => c.id === causeId);
    if (target) {
      addCommunicationMessage({
        senderRole: 'TEAM_LEADER',
        senderName: team.TEAM_LEADER.assignedUser,
        content: `Identified reversible cause: ${target.name}. Performing intervention: ${target.correctIntervention}`,
        type: 'DIRECTIVE'
      });
      if (currentScenario.underlyingCauseId === causeId) {
        setTelemetry(prev => ({ ...prev, currentRhythm: 'ROSC' }));
      }
    }
  };

  const addCommunicationMessage = (msg: Omit<CommunicationMessage, 'id' | 'timestampSeconds' | 'isClosedLoop'>) => {
    const newMsg: CommunicationMessage = {
      ...msg,
      id: `msg-${Date.now()}-${Math.random()}`,
      timestampSeconds: telemetry.elapsedSeconds,
      isClosedLoop: msg.type === 'READBACK' || msg.type === 'CONFIRMATION'
    };
    setMessages(prev => [newMsg, ...prev.slice(0, 19)]);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Hero Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute -top-12 -right-12 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Track C5 &bull; Crisis Resource Management (CRM) &amp; Code Team
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                AHA ACLS 2020 Guidelines
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                Closed-Loop Verification
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Multi-User Code Team &amp; Virtual OR Crisis Resource Management (CRM) Workstation
            </h1>
            <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
              Multi-role real-time resuscitation orchestrator. Direct interprofessional team members
              (Team Leader, Compressor, Airway, Defibrillator, Med Nurse, Scribe), enforce closed-loop
              communication, maintain chest compression fraction (CCF &ge; 80%), and solve reversible etiologies (5 H&apos;s and 5 T&apos;s).
            </p>
          </div>

          {/* Master Simulation Clock & Controls */}
          <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <button
              onClick={() => setIsRunning(prev => !prev)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition shadow-md ${
                isRunning ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  Pause Code
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Start 2-Min Cycle
                </>
              )}
            </button>
            <div className="text-right pl-2">
              <div className="text-[10px] uppercase font-mono text-slate-400">Cycle Countdown</div>
              <div className="text-sm font-mono font-bold text-white">
                {120 - telemetry.cycleTimerSeconds}s / 120s
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Scenario Presets */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
            Select Crisis Resuscitation Scenario:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {scenarios.map(sc => {
              const isSelected = sc.id === selectedScenarioId;
              return (
                <button
                  key={sc.id}
                  onClick={() => handleScenarioSelect(sc.id)}
                  className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-rose-950/40 border-rose-500/70 shadow-md shadow-rose-900/20'
                      : 'bg-slate-800/50 border-slate-700/60 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-900/70 text-rose-400">
                        {sc.initialRhythm} Arrest
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{sc.location.split(' ')[0]}</span>
                    </div>
                    <div className="text-xs font-bold text-white line-clamp-1">{sc.title}</div>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-2 line-clamp-2">{sc.patientDescription}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Real-time Resuscitation Telemetry Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center shadow">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Cardiac Rhythm</div>
          <div className={`text-base font-bold font-mono mt-0.5 ${telemetry.currentRhythm === 'ROSC' ? 'text-emerald-400' : 'text-rose-400'}`}>
            {telemetry.currentRhythm}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center shadow">
          <div className="text-[10px] font-mono text-slate-400 uppercase">CCF (Compression Frac)</div>
          <div className={`text-base font-bold font-mono mt-0.5 ${telemetry.chestCompressionFraction >= 0.8 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {Math.round(telemetry.chestCompressionFraction * 100)}% <span className="text-[10px] text-slate-400">(&ge;80%)</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center shadow">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Rate &amp; Depth</div>
          <div className="text-base font-bold font-mono text-white mt-0.5">
            {telemetry.compressorRateBpm} <span className="text-[10px] text-slate-400">cpm</span> / {telemetry.compressorDepthMm} <span className="text-[10px] text-slate-400">mm</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center shadow">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Waveform EtCO2</div>
          <div className={`text-base font-bold font-mono mt-0.5 ${telemetry.etco2MmHg >= 20 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {telemetry.etco2MmHg} <span className="text-[10px] text-slate-400">mmHg</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center shadow">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Closed-Loop Compl.</div>
          <div className="text-base font-bold font-mono text-indigo-400 mt-0.5">
            {telemetry.closedLoopCompliancePercent}%
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center shadow">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Shocks / Epi Doses</div>
          <div className="text-base font-bold font-mono text-cyan-400 mt-0.5">
            {telemetry.shocksDelivered} shocks / {telemetry.epinephrineDosesGiven} epi
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1">
        <button
          onClick={() => setActiveTab('arena')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition ${
            activeTab === 'arena' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Activity className="w-4 h-4" />
          Resuscitation Arena &amp; Role Cockpit
        </button>

        <button
          onClick={() => setActiveTab('comms')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition ${
            activeTab === 'comms' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Closed-Loop Communication Log
        </button>

        <button
          onClick={() => setActiveTab('acls-tree')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition ${
            activeTab === 'acls-tree' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          AHA ACLS Algorithm &amp; CRM Principles
        </button>
      </div>

      {/* Tab 1: Arena & Role Cockpit */}
      {activeTab === 'arena' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: 6-Role Team Cards & Quick Action Buttons (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Role 1: Team Leader */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-500" />
                    <span className="font-bold text-xs text-white">Team Leader</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{team.TEAM_LEADER.assignedUser}</span>
                </div>
                <p className="text-xs text-slate-300 min-h-[32px]">{team.TEAM_LEADER.currentAction}</p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => addCommunicationMessage({
                      senderRole: 'TEAM_LEADER',
                      senderName: team.TEAM_LEADER.assignedUser,
                      content: 'Assess pulse and rhythm at 2-minute mark! Clear hands.',
                      type: 'DIRECTIVE'
                    })}
                    className="w-full py-1.5 px-2 bg-indigo-600/80 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition"
                  >
                    Call Rhythm Check
                  </button>
                </div>
              </div>

              {/* Role 2: Compressor */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
                    <span className="font-bold text-xs text-white">Compressor</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{team.COMPRESSOR.assignedUser}</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Compressor Fatigue:</span>
                    <span className={`font-mono font-bold ${team.COMPRESSOR.fatiguePercent > 60 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {Math.round(team.COMPRESSOR.fatiguePercent)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        team.COMPRESSOR.fatiguePercent > 60 ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${team.COMPRESSOR.fatiguePercent}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleSwapCompressor}
                    className="w-full py-1.5 px-2 bg-rose-600/80 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg transition"
                  >
                    Rotate Compressor (Swap)
                  </button>
                </div>
              </div>

              {/* Role 3: Defibrillator Operator */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="font-bold text-xs text-white">Defibrillator Operator</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{team.DEFIBRILLATOR_OPERATOR.assignedUser}</span>
                </div>
                <p className="text-xs text-slate-300 min-h-[32px]">{team.DEFIBRILLATOR_OPERATOR.currentAction}</p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={handleChargeDefibrillator}
                    className={`py-1.5 px-2 text-xs font-semibold rounded-lg transition ${
                      isDefibCharged ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 hover:bg-slate-700 text-white'
                    }`}
                  >
                    {isDefibCharged ? 'CHARGED (200J)' : 'Pre-Charge 200J'}
                  </button>
                  <button
                    onClick={handleDeliverShock}
                    disabled={!isDefibCharged}
                    className={`py-1.5 px-2 text-xs font-semibold rounded-lg transition ${
                      isDefibCharged
                        ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                        : 'bg-slate-800/40 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Deliver Shock
                  </button>
                </div>
              </div>

              {/* Role 4: Medication Nurse */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="font-bold text-xs text-white">Medication Nurse</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{team.MEDICATION_NURSE.assignedUser}</span>
                </div>
                <p className="text-xs text-slate-300 min-h-[32px]">{team.MEDICATION_NURSE.currentAction}</p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={handleGiveEpinephrine}
                    className="py-1.5 px-2 bg-emerald-600/80 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition"
                  >
                    Epinephrine 1mg
                  </button>
                  <button
                    onClick={handleGiveAmiodarone}
                    className="py-1.5 px-2 bg-teal-600/80 hover:bg-teal-500 text-white text-xs font-semibold rounded-lg transition"
                  >
                    Amiodarone (300/150)
                  </button>
                </div>
              </div>

              {/* Role 5: Airway Manager */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-cyan-500" />
                    <span className="font-bold text-xs text-white">Airway Manager</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{team.AIRWAY_MANAGER.assignedUser}</span>
                </div>
                <p className="text-xs text-slate-300 min-h-[32px]">{team.AIRWAY_MANAGER.currentAction}</p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => addCommunicationMessage({
                      senderRole: 'AIRWAY_MANAGER',
                      senderName: team.AIRWAY_MANAGER.assignedUser,
                      content: 'Continuous waveform capnography verified. Bilateral breath sounds present. EtCO2 is 24 mmHg.',
                      type: 'CALLOUT'
                    })}
                    className="w-full py-1.5 px-2 bg-cyan-600/80 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg transition"
                  >
                    Verify Capnography &amp; ETT
                  </button>
                </div>
              </div>

              {/* Role 6: Scribe Recorder */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                    <span className="font-bold text-xs text-white">Scribe Recorder</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{team.SCRIBE_RECORDER.assignedUser}</span>
                </div>
                <p className="text-xs text-slate-300 min-h-[32px]">{team.SCRIBE_RECORDER.currentAction}</p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => addCommunicationMessage({
                      senderRole: 'SCRIBE_RECORDER',
                      senderName: team.SCRIBE_RECORDER.assignedUser,
                      content: `Time check: 2-minute cycle complete. ${telemetry.shocksDelivered} shocks delivered, ${telemetry.epinephrineDosesGiven} doses epinephrine given.`,
                      type: 'ALERT'
                    })}
                    className="w-full py-1.5 px-2 bg-purple-600/80 hover:bg-purple-500 text-white text-xs font-semibold rounded-lg transition"
                  >
                    Call 2-Min Interval Warning
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Reversible Causes (5 H's and 5 T's) Checklist (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-bold text-white text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Reversible Etiologies (H&apos;s &amp; T&apos;s)
                </span>
                <span className="text-[11px] font-mono text-rose-400 font-bold">AHA Protocol</span>
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {causes.map(cause => (
                  <div
                    key={cause.id}
                    className={`p-3 rounded-xl border transition text-xs space-y-1.5 ${
                      cause.isTreated
                        ? 'bg-emerald-950/30 border-emerald-500/50'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-mono text-amber-400">
                          {cause.type}
                        </span>
                        {cause.name}
                      </span>
                      {cause.isTreated ? (
                        <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          TREATED
                        </span>
                      ) : (
                        <button
                          onClick={() => handleTreatCause(cause.id)}
                          className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold"
                        >
                          Treat STAT
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{cause.clinicalClue}</p>
                    <div className="text-[10px] text-indigo-300 font-medium">Rx: {cause.correctIntervention}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Closed-Loop Communication Log */}
      {activeTab === 'comms' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-rose-400" />
              <h2 className="text-lg font-bold text-white">Closed-Loop Communication &amp; Event Stream</h2>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              Protocol Compliance: {telemetry.closedLoopCompliancePercent}%
            </span>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`p-3 rounded-xl border text-xs flex items-start gap-3 ${
                  msg.type === 'DIRECTIVE'
                    ? 'bg-indigo-950/30 border-indigo-500/40'
                    : msg.type === 'READBACK'
                    ? 'bg-emerald-950/30 border-emerald-500/40'
                    : msg.type === 'CONFIRMATION'
                    ? 'bg-teal-950/30 border-teal-500/40'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-900 border border-slate-700 text-slate-300">
                  {msg.type}
                </div>
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{msg.senderName} ({msg.senderRole})</span>
                    <span className="font-mono text-[10px] text-slate-400">+{msg.timestampSeconds}s</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: ACLS Algorithmic Tree & CRM Principles */}
      {activeTab === 'acls-tree' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-rose-400" />
            <h2 className="text-lg font-bold text-white">AHA ACLS Algorithm &amp; Crisis Resource Management</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Shockable Rhythms (VF / pVT):</div>
              <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4 leading-relaxed">
                <li>Immediate 200J biphasic defibrillation within 3 seconds of rhythm recognition.</li>
                <li>Resume CPR immediately without checking pulse after shock.</li>
                <li>Epinephrine 1 mg IV/IO every 3-5 minutes after second shock.</li>
                <li>Amiodarone 300 mg bolus after third shock; second dose 150 mg.</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Non-Shockable (Asystole / PEA):</div>
              <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4 leading-relaxed">
                <li>Defibrillation is contraindicated (does not reset non-fibrillating myocardium).</li>
                <li>Immediate Epinephrine 1 mg IV/IO as early as possible.</li>
                <li>Aggressive diagnostic pursuit and treatment of reversible causes (H&apos;s &amp; T&apos;s).</li>
                <li>Waveform capnography monitoring for sudden EtCO2 rise &gt; 35 mmHg indicating ROSC.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
