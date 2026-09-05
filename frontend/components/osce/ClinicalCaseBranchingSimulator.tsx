'use client';

import React, { useState, useMemo } from 'react';
import {
  CaseScenario,
  CandidateCaseSession,
  CandidatePerformanceReport,
  BranchingAction,
  ActionType,
  initializeCaseSession,
  executeCaseAction,
  calculateRubricScores,
  SEEDED_BRANCHING_SCENARIOS,
} from '@/.gemini/skills/ClinicalCaseBranchingEngine';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from 'recharts';
import {
  Heart,
  Activity,
  Droplets,
  Thermometer,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  Stethoscope,
  TestTube,
  Pill,
  MessageSquare,
  Award,
  Sparkles,
  RotateCcw,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  HelpCircle,
  TrendingUp,
  Brain,
} from 'lucide-react';

export default function ClinicalCaseBranchingSimulator() {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('case-rv-stemi');
  const [session, setSession] = useState<CandidateCaseSession>(() =>
    initializeCaseSession('case-rv-stemi')
  );
  const [activeActionFilter, setActiveActionFilter] = useState<'ALL' | ActionType>('ALL');
  const [report, setReport] = useState<CandidatePerformanceReport | null>(null);

  // Attending Viva State
  const [vivaAnswers, setVivaAnswers] = useState<Record<string, number>>({});
  const [showVivaFeedback, setShowVivaFeedback] = useState<Record<string, boolean>>({});

  const scenario: CaseScenario = useMemo(() => {
    return SEEDED_BRANCHING_SCENARIOS[selectedScenarioId] || SEEDED_BRANCHING_SCENARIOS['case-rv-stemi'];
  }, [selectedScenarioId]);

  const currentNode = useMemo(() => {
    return scenario.nodes[session.currentNodeId] || scenario.nodes[scenario.initialNodeId];
  }, [scenario, session.currentNodeId]);

  const availableActions: BranchingAction[] = useMemo(() => {
    return currentNode.availableActionIds
      .map((id) => scenario.actionsCatalog[id])
      .filter(Boolean)
      .filter((act) => (activeActionFilter === 'ALL' ? true : act.type === activeActionFilter));
  }, [currentNode, scenario, activeActionFilter]);

  const handleSelectScenario = (id: string) => {
    setSelectedScenarioId(id);
    setSession(initializeCaseSession(id));
    setReport(null);
    setVivaAnswers({});
    setShowVivaFeedback({});
  };

  const handleExecuteAction = (actionId: string) => {
    if (session.isCompleted || report) return;
    const { updatedSession } = executeCaseAction(session, actionId);
    setSession(updatedSession);
  };

  const handleUpdateDifferentialRank = (diagnosisId: string, newRank: number) => {
    setSession((prev) => {
      const updated = prev.candidateDifferentialRankings.map((r) => {
        if (r.diagnosisId === diagnosisId) return { ...r, rank: newRank };
        if (r.rank === newRank) return { ...r, rank: r.rank === 1 ? 2 : 1 };
        return r;
      });
      return { ...prev, candidateDifferentialRankings: updated };
    });
  };

  const handleConcludeEncounter = () => {
    const perfReport = calculateRubricScores(session);
    setReport(perfReport);
  };

  const handleResetSession = () => {
    setSession(initializeCaseSession(selectedScenarioId));
    setReport(null);
    setVivaAnswers({});
    setShowVivaFeedback({});
  };

  // Format Elapsed Time
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Radar Data for Performance Report
  const radarData = useMemo(() => {
    if (!report) return [];
    return [
      { subject: 'Diagnostic Accuracy', score: (report.dimensionScores.diagnosticAccuracy / 25) * 100, fullMark: 100 },
      { subject: 'Patient Safety', score: (report.dimensionScores.patientSafety / 25) * 100, fullMark: 100 },
      { subject: 'Stewardship', score: (report.dimensionScores.resourceStewardship / 20) * 100, fullMark: 100 },
      { subject: 'Communication', score: (report.dimensionScores.clinicalCommunication / 15) * 100, fullMark: 100 },
      { subject: 'Decision Velocity', score: (report.dimensionScores.decisionVelocity / 15) * 100, fullMark: 100 },
    ];
  }, [report]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-6 text-slate-100 max-w-7xl mx-auto">
      {/* Top Banner: Scenario Selector & Quick Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-950 border border-indigo-500/40 text-indigo-400">
            <Brain size={24} />
          </div>
          <div>
            <h2 className="font-bold text-lg text-white flex items-center gap-2">
              <span>Interactive Clinical Case Branching & AI OSCE Evaluator</span>
              <span className="text-[10px] font-mono bg-indigo-900/60 border border-indigo-700 text-indigo-300 px-2 py-0.5 rounded-full uppercase">
                {scenario.difficulty}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Dynamic bedside encounters with real-time hemodynamic state transitions, differential diagnosis ranking, and multi-dimensional rubric evaluation.
            </p>
          </div>
        </div>

        {/* Case Scenario Selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="scenario-select" className="text-xs font-mono text-slate-400 whitespace-nowrap">Case Scenario:</label>
          <select
            id="scenario-select"
            value={selectedScenarioId}
            onChange={(e) => handleSelectScenario(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs font-medium p-2 rounded-lg outline-none focus:border-indigo-500"
          >
            {Object.values(SEEDED_BRANCHING_SCENARIOS).map((sc) => (
              <option key={sc.id} value={sc.id}>
                [{sc.specialty}] {sc.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Patient Demographic & Encounter Metric Bar */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className={`px-2 py-0.5 rounded-md font-bold text-xs ${
            scenario.patientDemographics.triageAcuity === 'RED'
              ? 'bg-rose-950 border border-rose-800 text-rose-300'
              : 'bg-amber-950 border border-amber-800 text-amber-300'
          }`}>
            TRIAGE {scenario.patientDemographics.triageAcuity}
          </span>
          <span className="text-white font-bold text-sm">
            {scenario.patientDemographics.name}, {scenario.patientDemographics.age}yo {scenario.patientDemographics.gender}
          </span>
          <span className="text-slate-400 hidden sm:inline">•</span>
          <span className="text-slate-300 text-[11px] hidden md:inline">
            CC: {scenario.patientDemographics.chiefComplaint}
          </span>
        </div>

        {/* Real-time Encounter Metrics */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-slate-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
            <Clock size={13} className="text-indigo-400" />
            <span>{formatTime(session.elapsedSeconds)}</span>
          </div>

          <div className="flex items-center gap-1 text-slate-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
            <DollarSign size={13} className="text-emerald-400" />
            <span>{session.totalCostUnits} pts</span>
          </div>

          {session.safetyViolationCount > 0 && (
            <div className="flex items-center gap-1 text-rose-300 bg-rose-950/80 px-2.5 py-1 rounded-lg border border-rose-700 animate-pulse font-bold">
              <AlertTriangle size={13} className="text-rose-400" />
              <span>{session.safetyViolationCount} Safety Hazard(s)</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Telemetry Monitor (Left) & Bedside Narrative (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (5 cols): Live Telemetry Monitor */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-mono font-bold uppercase text-slate-400 flex items-center gap-1.5">
              <Activity size={14} className="text-rose-400 animate-pulse" /> Live Telemetry Monitor
            </span>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
              session.currentVitals.rhythm === 'BRADYCARDIA'
                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                : session.currentVitals.rhythm === 'ST_ELEVATION'
                ? 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse'
                : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
            }`}>
              {session.currentVitals.rhythm}
            </span>
          </div>

          {/* Vitals Digital Readouts */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            {/* Heart Rate */}
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-0.5">
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <Heart size={12} className="text-rose-400" /> Heart Rate
              </div>
              <div className="text-xl font-bold text-white flex items-baseline gap-1">
                <span>{session.currentVitals.heartRate}</span>
                <span className="text-[10px] text-slate-400 font-normal">BPM</span>
              </div>
            </div>

            {/* Blood Pressure */}
            <div className={`p-2.5 rounded-lg border space-y-0.5 ${
              session.currentVitals.systolicBp < 90
                ? 'bg-rose-950/60 border-rose-700 text-rose-200'
                : 'bg-slate-900 border-slate-800 text-white'
            }`}>
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <TrendingUp size={12} className="text-amber-400" /> Arterial BP
              </div>
              <div className="text-xl font-bold flex items-baseline gap-1">
                <span>{session.currentVitals.systolicBp}/{session.currentVitals.diastolicBp}</span>
                <span className="text-[10px] text-slate-400 font-normal">mmHg</span>
              </div>
            </div>

            {/* SpO2 */}
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-0.5">
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <Droplets size={12} className="text-cyan-400" /> Pulse Oximetry
              </div>
              <div className="text-xl font-bold text-white flex items-baseline gap-1">
                <span>{session.currentVitals.spO2}</span>
                <span className="text-[10px] text-slate-400 font-normal">%</span>
              </div>
            </div>

            {/* Respiratory Rate & Temp */}
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-0.5">
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <Thermometer size={12} className="text-emerald-400" /> Temp & RR
              </div>
              <div className="text-xs font-bold text-slate-200 space-y-0.5">
                <div>RR: {session.currentVitals.respRate} /min</div>
                <div>Temp: {session.currentVitals.temperatureCelsius.toFixed(1)} °C</div>
              </div>
            </div>
          </div>

          {/* Patient Emotional State Badge */}
          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Patient Sensorium:</span>
            <span className={`px-2 py-0.5 rounded-md font-bold ${
              session.currentEmotionalState === 'OBTUNDED'
                ? 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse'
                : session.currentEmotionalState === 'ANXIOUS'
                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
            }`}>
              {session.currentEmotionalState}
            </span>
          </div>

          {/* Known Background & Allergies */}
          <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 text-[11px] font-mono space-y-1">
            <div className="text-slate-400 font-bold">Chart History & Risk Factors:</div>
            <div className="text-slate-300">PMHx: {scenario.patientDemographics.pastMedicalHistory.join(', ')}</div>
            <div className="text-rose-300">Allergies: {scenario.patientDemographics.allergies.join(', ')}</div>
          </div>
        </div>

        {/* Right Column (7 cols): Bedside Clinical Observation & Dialogue */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold uppercase text-indigo-400 flex items-center gap-1.5">
                <Stethoscope size={14} /> Current Encounter Stage: {currentNode.title}
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Node ID: {currentNode.nodeId}
              </span>
            </div>

            {/* Bedside Observation Box */}
            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl text-xs leading-relaxed text-slate-200">
              <strong className="text-indigo-300 font-mono block mb-1">Bedside Examination Findings:</strong>
              {currentNode.narrative}
            </div>

            {/* Last Action Clinical Consequence Feedback */}
            {session.historyLog.length > 0 && (
              <div className="bg-indigo-950/40 border border-indigo-700/50 p-3 rounded-xl text-xs font-mono space-y-1">
                <div className="text-indigo-300 font-bold flex items-center gap-1">
                  <Sparkles size={13} /> Consequence of Last Action: {session.historyLog[session.historyLog.length - 1].action.label}
                </div>
                <div className="text-slate-300">
                  {session.historyLog[session.historyLog.length - 1].action.clinicalConsequence}
                </div>
              </div>
            )}
          </div>

          {/* Action Filter Pills */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase text-slate-400">Available Bedside Actions</span>
              <div className="flex flex-wrap gap-1 text-[10px] font-mono">
                {(['ALL', 'HISTORY', 'PHYSICAL_EXAM', 'INVESTIGATION', 'INTERVENTION'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveActionFilter(cat)}
                    className={`px-2 py-0.5 rounded transition ${
                      activeActionFilter === cat
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons Deck */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {availableActions.map((action) => {
                const isExecuted = session.executedActionIds.includes(action.id);
                return (
                  <button
                    key={action.id}
                    onClick={() => handleExecuteAction(action.id)}
                    disabled={isExecuted || session.isCompleted || !!report}
                    className={`p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between gap-1 text-xs ${
                      isExecuted
                        ? 'bg-slate-900/60 border-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-slate-900 border-slate-700/70 hover:border-indigo-500 text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="font-semibold text-[11px] leading-tight text-white">{action.label}</span>
                      {isExecuted && <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />}
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                      <span>{action.category}</span>
                      <span>+{action.timeSpentSeconds}s | {action.costUnits}pts</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Differential Diagnosis Ranking Deck */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
          <span className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center gap-1.5">
            <TrendingUp size={14} className="text-cyan-400" /> Working Differential Diagnosis Ranking (Bayesian Model)
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            Set Rank #1 for Primary Working Diagnosis
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          {scenario.differentialCatalog.map((diag) => {
            const ranking = session.candidateDifferentialRankings.find((r) => r.diagnosisId === diag.id);
            const isRank1 = ranking?.rank === 1;

            return (
              <div
                key={diag.id}
                className={`p-3 rounded-lg border transition-all space-y-2 flex flex-col justify-between ${
                  isRank1
                    ? 'bg-indigo-950/50 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[11px] leading-snug">{diag.name}</span>
                    <button
                      onClick={() => handleUpdateDifferentialRank(diag.id, 1)}
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        isRank1
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {isRank1 ? 'RANK #1' : 'Set #1'}
                    </button>
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight">
                    {diag.supportingClues.slice(0, 2).join(' • ')}
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800/80 flex items-center justify-between">
                  <span>Probability Weight:</span>
                  <span className="font-bold text-cyan-400">{(diag.likelihoodScore * 100).toFixed(0)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Conclude Button Bar */}
      {!report && (
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleResetSession}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono font-semibold transition flex items-center gap-1.5"
          >
            <RotateCcw size={14} /> Restart Scenario
          </button>

          <button
            onClick={handleConcludeEncounter}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition shadow-lg flex items-center gap-2"
          >
            <Award size={16} /> Conclude Encounter & Submit for AI OSCE Rubric Evaluation
          </button>
        </div>
      )}

      {/* ================= FINAL OSCE PERFORMANCE REPORT & ATTENDING VIVA ================= */}
      {report && (
        <div className="bg-slate-950 border border-indigo-500/50 rounded-2xl p-6 space-y-6 animate-in fade-in zoom-in duration-200">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-indigo-950 border border-indigo-500 text-indigo-400">
                <Award size={28} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                  <span>Attending Evaluation & Competency Score Report</span>
                  <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${
                    report.grade === 'HONORS'
                      ? 'bg-amber-950 border border-amber-600 text-amber-300'
                      : report.passed
                      ? 'bg-emerald-950 border border-emerald-600 text-emerald-300'
                      : 'bg-rose-950 border border-rose-600 text-rose-300'
                  }`}>
                    {report.grade} ({report.totalScore}%)
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Standardized 5-dimension clinical examination performance analysis.
                </p>
              </div>
            </div>

            <button
              onClick={handleResetSession}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono font-semibold transition flex items-center gap-1.5 self-start sm:self-auto"
            >
              <RotateCcw size={14} /> Re-Attempt Scenario
            </button>
          </div>

          {/* Grid: 5-Dimension Radar Chart (Left) & Dimension Score Breakdown (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-5 h-64 bg-slate-900 rounded-xl border border-slate-800 p-2 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                  <Radar name="Candidate Competency (%)" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
                <div className="text-slate-400">Diagnostic Accuracy:</div>
                <div className="text-lg font-bold text-indigo-300">{report.dimensionScores.diagnosticAccuracy} / 25 pts</div>
                <div className="text-[10px] text-slate-400">Identified primary pathology and high-yield tests.</div>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
                <div className="text-slate-400">Patient Safety:</div>
                <div className={`text-lg font-bold ${
                  report.dimensionScores.patientSafety >= 20 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {report.dimensionScores.patientSafety} / 25 pts
                </div>
                <div className="text-[10px] text-slate-400">Avoidance of lethal hemodynamic contraindications.</div>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
                <div className="text-slate-400">Resource Stewardship:</div>
                <div className="text-lg font-bold text-amber-300">{report.dimensionScores.resourceStewardship} / 20 pts</div>
                <div className="text-[10px] text-slate-400">Avoided unnecessary costly testing ({report.totalCostIncurred} units).</div>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
                <div className="text-slate-400">Decision Velocity & Comm:</div>
                <div className="text-lg font-bold text-cyan-300">
                  {report.dimensionScores.clinicalCommunication + report.dimensionScores.decisionVelocity} / 30 pts
                </div>
                <div className="text-[10px] text-slate-400">Time to stabilization: {formatTime(report.totalTimeElapsedSeconds)}.</div>
              </div>
            </div>
          </div>

          {/* Detailed Narrative Debrief */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-xs space-y-2">
            <div className="font-bold text-indigo-400 flex items-center gap-1.5 font-mono">
              <MessageSquare size={14} /> Attending Clinical Debrief:
            </div>
            <p className="text-slate-300 leading-relaxed font-sans">{report.clinicalDebrief}</p>
          </div>

          {/* Attending Oral Viva Section */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-4 text-xs">
            <div className="font-bold text-white flex items-center gap-1.5 font-mono border-b border-slate-800 pb-2">
              <HelpCircle size={15} className="text-amber-400" /> Socratic Attending Oral Examination (Viva Voce)
            </div>

            <div className="space-y-4">
              {scenario.attendingVivaQuestions.map((q, qIndex) => {
                const selectedOption = vivaAnswers[q.id];
                const isAnswered = selectedOption !== undefined;
                const isCorrect = selectedOption === q.correctOptionIndex;

                return (
                  <div key={q.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2 font-mono">
                    <div className="font-bold text-slate-200">
                      Q{qIndex + 1}: {q.question}
                    </div>

                    <div className="space-y-1.5 pt-1">
                      {q.options.map((opt, optIndex) => (
                        <button
                          key={optIndex}
                          onClick={() => {
                            setVivaAnswers((prev) => ({ ...prev, [q.id]: optIndex }));
                            setShowVivaFeedback((prev) => ({ ...prev, [q.id]: true }));
                          }}
                          className={`w-full p-2 rounded-lg text-left text-xs transition flex items-center justify-between ${
                            selectedOption === optIndex
                              ? isCorrect
                                ? 'bg-emerald-950 border border-emerald-600 text-emerald-200 font-semibold'
                                : 'bg-rose-950 border border-rose-600 text-rose-200 font-semibold'
                              : 'bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          <span>{opt}</span>
                          {selectedOption === optIndex && (
                            <span>{isCorrect ? '✓ Correct' : '✗ Incorrect'}</span>
                          )}
                        </button>
                      ))}
                    </div>

                    {showVivaFeedback[q.id] && (
                      <div className="mt-2 p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-[11px] text-slate-300 leading-relaxed font-sans">
                        <strong className="text-amber-400 font-mono">Attending Rationale: </strong>
                        {q.rationale}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
