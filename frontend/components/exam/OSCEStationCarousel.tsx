'use client';

import React, { useState, useEffect } from 'react';
import {
  OsceScenario,
  OsceStation,
  OsceCandidateAction,
  OsceScoreReport,
  evaluateCandidateOSCEPerformance,
} from '@/.gemini/skills/OSCEExamSkills';
import VirtualAuscultationExam from './VirtualAuscultationExam';
import {
  Clock,
  AlertTriangle,
  ChevronRight,
  CheckCircle,
  FileText,
  Activity,
  Award,
  Sparkles,
  RotateCcw,
  Stethoscope,
  Pill,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';

interface OSCEStationCarouselProps {
  scenario: OsceScenario;
  onExamComplete?: (report: OsceScoreReport) => void;
}

export default function OSCEStationCarousel({ scenario, onExamComplete }: OSCEStationCarouselProps) {
  const [currentStationIndex, setCurrentStationIndex] = useState(0);
  const [stationTimeRemaining, setStationTimeRemaining] = useState<number>(
    scenario.stations[0]?.durationSeconds || 360
  );
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [candidateActions, setCandidateActions] = useState<OsceCandidateAction[]>([]);
  const [historyAnswersRevealed, setHistoryAnswersRevealed] = useState<string[]>([]);
  const [orderedInvestigations, setOrderedInvestigations] = useState<string[]>([]);
  const [selectedMedications, setSelectedMedications] = useState<string[]>([]);
  const [vivaResponseNotes, setVivaResponseNotes] = useState('');
  const [scoreReport, setScoreReport] = useState<OsceScoreReport | null>(null);

  const currentStation: OsceStation = scenario.stations[currentStationIndex];

  // Station Timer
  useEffect(() => {
    if (!isTimerRunning || scoreReport) return;

    const interval = setInterval(() => {
      setStationTimeRemaining((prev) => {
        if (prev <= 1) {
          handleNextStation();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, currentStationIndex, scoreReport]);

  const recordAction = (detail: string, actionType: string, isContraindicated = false) => {
    const action: OsceCandidateAction = {
      stationId: currentStation.id,
      timestamp: Date.now(),
      actionType,
      detail,
      isContraindicated,
    };
    setCandidateActions((prev) => [...prev, action]);
  };

  const handleNextStation = () => {
    if (currentStationIndex < scenario.stations.length - 1) {
      const nextIndex = currentStationIndex + 1;
      setCurrentStationIndex(nextIndex);
      setStationTimeRemaining(scenario.stations[nextIndex].durationSeconds);
    } else {
      // Final Station Finished - Generate Evaluation
      setIsTimerRunning(false);
      const report = evaluateCandidateOSCEPerformance(scenario, candidateActions, stationTimeRemaining);
      setScoreReport(report);
      if (onExamComplete) {
        onExamComplete(report);
      }
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl w-full mx-auto space-y-6 text-slate-100">
      {/* Top Banner: Scenario Header, Patient Vitals & Station Steps */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800/60 px-2 py-0.5 rounded-full uppercase">
                {scenario.patientDemographics.triageCategory} Triage
              </span>
              <span className="text-xs text-slate-400 font-mono">{scenario.specialty}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white mt-1">{scenario.title}</h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Patient: <span className="font-semibold text-white">{scenario.patientDemographics.name}</span>,{' '}
              {scenario.patientDemographics.age}y {scenario.patientDemographics.gender} — "
              {scenario.patientDemographics.chiefComplaint}"
            </p>
          </div>

          {/* Vitals HUD */}
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs font-mono">
            <div className="px-2 border-r border-slate-800 text-center">
              <div className="text-[10px] text-slate-400">HR</div>
              <div className="font-bold text-rose-400">{scenario.initialVitals.heartRate} bpm</div>
            </div>
            <div className="px-2 border-r border-slate-800 text-center">
              <div className="text-[10px] text-slate-400">BP</div>
              <div className="font-bold text-amber-300">{scenario.initialVitals.bloodPressure}</div>
            </div>
            <div className="px-2 border-r border-slate-800 text-center">
              <div className="text-[10px] text-slate-400">SpO2</div>
              <div className="font-bold text-emerald-400">{scenario.initialVitals.spO2}%</div>
            </div>
            <div className="px-2 text-center">
              <div className="text-[10px] text-slate-400">RR</div>
              <div className="font-bold text-indigo-300">{scenario.initialVitals.respiratoryRate}/m</div>
            </div>
          </div>
        </div>

        {/* Station Navigation Stepper */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-2 border-t border-slate-800">
          {scenario.stations.map((st, idx) => {
            const isCurrent = idx === currentStationIndex;
            const isCompleted = idx < currentStationIndex;

            return (
              <div
                key={st.id}
                className={`p-2.5 rounded-xl border text-xs transition-all ${
                  isCurrent
                    ? 'bg-indigo-950/80 border-indigo-500 text-white shadow-lg ring-1 ring-indigo-500'
                    : isCompleted
                    ? 'bg-slate-950/70 border-emerald-900/60 text-emerald-400'
                    : 'bg-slate-950/40 border-slate-800/80 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[10px] font-bold">
                  <span>STATION {st.stationNumber}</span>
                  {isCompleted && <CheckCircle size={12} className="text-emerald-400" />}
                </div>
                <div className="truncate font-semibold mt-1">
                  {st.title.split(':')[1]?.trim() || st.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Active Station Interface or Final Score Report */}
      {!scoreReport ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          {/* Station Objective & Timer Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold">
                Station Type: {currentStation.stationType}
              </span>
              <h2 className="text-xl font-bold text-white mt-0.5">{currentStation.title}</h2>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">{currentStation.clinicalPrompt}</p>
            </div>

            {/* Countdown Station Timer */}
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-mono font-bold text-base transition-colors ${
                stationTimeRemaining < 60
                  ? 'bg-rose-950/80 border-rose-600 text-rose-300 animate-pulse'
                  : 'bg-slate-950 border-slate-700 text-amber-300'
              }`}
            >
              <Clock size={18} />
              <span>{formatTimer(stationTimeRemaining)}</span>
            </div>
          </div>

          {/* Station Type-Specific Content */}
          <div className="space-y-6">
            {/* 1. HISTORY STATION */}
            {currentStation.stationType === 'HISTORY' && (
              <div className="space-y-4">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 leading-relaxed font-mono">
                  <span className="text-amber-400 font-bold">Patient Vignette: </span>
                  {currentStation.patientVignette}
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono">
                    Candidate Diagnostic Question Checklist
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {[
                      {
                        q: 'Introduce self & confirm patient identity',
                        ans: '"Hello Doctor, I am Ramesh. The pain is getting unbearable."',
                      },
                      {
                        q: 'Assess pain radiation to arm, neck, or jaw',
                        ans: '"Yes, it shoots down my left arm and aches into my jaw."',
                      },
                      {
                        q: 'Ask about sudden ripping/tearing pain to back (Aortic Dissection rule-out)',
                        ans: '"No tearing feeling in my back, it is purely a heavy crushing feeling in my front chest."',
                      },
                      {
                        q: 'Check for active bleeding, peptic ulcer, or recent stroke',
                        ans: '"No history of stomach ulcers, bleeding, or brain stroke."',
                      },
                      {
                        q: 'Establish time of symptom onset (critical for PCI door-to-balloon window)',
                        ans: '"Started exactly 90 minutes ago while I was climbing stairs at work."',
                      },
                      {
                        q: 'Recommending patient go home with antacids (Contraindicated)',
                        ans: 'Patient condition deteriorates into fatal ventricular fibrillation.',
                        bad: true,
                      },
                    ].map((item, i) => {
                      const revealed = historyAnswersRevealed.includes(item.q);
                      return (
                        <div
                          key={i}
                          className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all ${
                            revealed
                              ? item.bad
                                ? 'bg-rose-950/60 border-rose-600'
                                : 'bg-slate-950 border-emerald-600/80'
                              : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <button
                            onClick={() => {
                              if (!revealed) {
                                setHistoryAnswersRevealed([...historyAnswersRevealed, item.q]);
                                recordAction(item.q, 'QUESTION', item.bad);
                              }
                            }}
                            className="w-full text-left font-semibold text-slate-200 flex items-center justify-between"
                          >
                            <span>{item.q}</span>
                            {revealed ? (
                              <CheckCircle size={14} className={item.bad ? 'text-rose-400' : 'text-emerald-400'} />
                            ) : (
                              <span className="text-[10px] text-indigo-400 font-mono bg-indigo-950 px-2 py-0.5 rounded">
                                Ask
                              </span>
                            )}
                          </button>
                          {revealed && (
                            <p className="text-[11px] text-slate-400 font-mono border-t border-slate-800 pt-1.5">
                              {item.ans}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 2. EXAMINATION STATION */}
            {currentStation.stationType === 'EXAMINATION' && (
              <VirtualAuscultationExam
                heartRateBpm={scenario.initialVitals.heartRate}
                onLogFinding={(finding) => recordAction(finding, 'EXAM_FINDING')}
              />
            )}

            {/* 3. INVESTIGATION STATION */}
            {currentStation.stationType === 'INVESTIGATION' && currentStation.investigationOptions && (
              <div className="space-y-4">
                <div className="text-xs text-slate-400">
                  Select mandatory emergency diagnostics. Avoid contraindicated orders that delay primary catheterization.
                </div>

                <div className="space-y-2">
                  {currentStation.investigationOptions.map((inv) => {
                    const isOrdered = orderedInvestigations.includes(inv.id);
                    return (
                      <div
                        key={inv.id}
                        className={`p-3.5 rounded-xl border text-xs space-y-2 transition-all ${
                          isOrdered
                            ? inv.isAppropriate
                              ? 'bg-slate-950 border-emerald-600'
                              : 'bg-rose-950/50 border-rose-600'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-bold text-white text-sm">{inv.name}</span>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              Est. Turnaround: {inv.turnaroundSeconds}s | Cost: {inv.costUnits} units
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              if (!isOrdered) {
                                setOrderedInvestigations([...orderedInvestigations, inv.id]);
                                recordAction(`Ordered ${inv.name}`, 'INVESTIGATION', !inv.isAppropriate);
                              }
                            }}
                            disabled={isOrdered}
                            className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${
                              isOrdered
                                ? 'bg-slate-800 text-slate-400 cursor-default'
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                            }`}
                          >
                            {isOrdered ? 'Order Placed' : 'Order Stat'}
                          </button>
                        </div>

                        {isOrdered && (
                          <div className="border-t border-slate-800/80 pt-2 space-y-1">
                            <div className="font-mono text-xs font-bold text-amber-300">Result: {inv.resultText}</div>
                            <div className="text-[11px] text-slate-400">{inv.explanation}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. PRESCRIPTION / COUNSELING */}
            {currentStation.stationType === 'PRESCRIPTION_COUNSELING' && (
              <div className="space-y-4">
                <div className="bg-amber-950/40 border border-amber-800/60 p-3.5 rounded-xl text-xs text-amber-200/90 flex items-start gap-2">
                  <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Clinical Safety Check:</strong> Patient’s blood pressure is 88/58 mmHg. Verify all contraindications before prescribing vasodilators or negative inotropes.
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {[
                    { name: 'Aspirin 300 mg chewable stat', safe: true },
                    { name: 'Ticagrelor 180 mg loading dose', safe: true },
                    { name: 'Activate Cath Lab for Primary PCI (<90 mins)', safe: true },
                    { name: 'Withhold Nitroglycerin due to hypotension (SBP <90 mmHg)', safe: true },
                    {
                      name: 'Administering sublingual or IV Nitroglycerin when SBP is <90 mmHg',
                      safe: false,
                      alert: 'FATAL: Nitrate administration in SBP <90 precipitates profound circulatory arrest.',
                    },
                    {
                      name: 'Administering oral beta-blockers in acute cardiogenic shock / hypotension',
                      safe: false,
                      alert: 'CONTRAINDICATED: Negative inotropy worsens acute cardiogenic shock.',
                    },
                  ].map((med, i) => {
                    const isSelected = selectedMedications.includes(med.name);
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          if (!isSelected) {
                            setSelectedMedications([...selectedMedications, med.name]);
                            recordAction(med.name, 'PRESCRIPTION', !med.safe);
                          }
                        }}
                        className={`p-3 rounded-xl border text-left text-xs transition-all ${
                          isSelected
                            ? med.safe
                              ? 'bg-slate-950 border-emerald-500 text-emerald-300'
                              : 'bg-rose-950/80 border-rose-600 text-rose-300'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200'
                        }`}
                      >
                        <div className="font-bold">{med.name}</div>
                        {isSelected && !med.safe && med.alert && (
                          <div className="text-[10px] text-rose-400 mt-1 font-mono">{med.alert}</div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5. ATTENDING VIVA DEFENSE */}
            {currentStation.stationType === 'ATTENDING_VIVA' && (
              <div className="space-y-4">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="text-xs font-mono font-bold text-indigo-400 uppercase">
                    Attending Cardiologist Query:
                  </div>
                  <p className="text-sm text-slate-200 italic font-serif leading-relaxed">
                    "{currentStation.patientVignette}"
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">
                    Defend your clinical decisions (Type your rationale or click key clinical defenses below):
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {[
                      'Identify Left Anterior Descending (LAD) coronary artery as culprit lesion',
                      'Explain that nitrates decrease preload and precipitate profound cardiovascular collapse in SBP <90',
                      'State international target: Door-to-Balloon time < 90 minutes',
                      'Mention secondary prevention (High-intensity Statin, ACEi/ARB once hemodynamically stable)',
                    ].map((defense, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setVivaResponseNotes((prev) => (prev ? `${prev}\n• ${defense}` : `• ${defense}`));
                          recordAction(defense, 'VIVA_DEFENSE');
                        }}
                        className="text-xs bg-slate-950 border border-slate-800 hover:border-indigo-500 text-indigo-300 px-3 py-1.5 rounded-lg transition-all"
                      >
                        + Add "{defense.substring(0, 45)}..."
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={4}
                    value={vivaResponseNotes}
                    onChange={(e) => setVivaResponseNotes(e.target.value)}
                    placeholder="Enter your clinical defense points to the attending physician..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Station Footer / Navigation */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-500 font-mono">
              Action Count: {candidateActions.filter((a) => a.stationId === currentStation.id).length} recorded
            </div>

            <button
              onClick={handleNextStation}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg transition-all"
            >
              <span>{currentStationIndex < scenario.stations.length - 1 ? 'Next Station' : 'Submit & View Scorecard'}</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      ) : (
        /* Final OSCE Score Report */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="text-center space-y-2 border-b border-slate-800 pb-6">
            <div className="inline-flex p-3 rounded-2xl bg-indigo-950/70 border border-indigo-500/40 text-indigo-400">
              <Award size={32} />
            </div>
            <h2 className="text-3xl font-extrabold text-white">OSCE Clinical Performance Scorecard</h2>
            <p className="text-xs text-slate-400 max-w-xl mx-auto">
              Holistic objective clinical evaluation based on national competency standards.
            </p>
          </div>

          {/* Top Score Summary Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-center">
              <div className="text-xs text-slate-400 font-mono uppercase">Overall Score</div>
              <div className={`text-3xl font-black mt-1 ${scoreReport.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                {scoreReport.totalScore}%
              </div>
              <div className="text-[11px] font-bold mt-1 text-slate-300">
                Status: {scoreReport.passed ? 'PASS (Honors)' : 'REMEDIATION NEEDED'}
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-center">
              <div className="text-xs text-slate-400 font-mono uppercase">Diagnostic Precision</div>
              <div className="text-3xl font-black mt-1 text-indigo-400">{scoreReport.diagnosticPrecisionScore}%</div>
              <div className="text-[11px] text-slate-400 mt-1">Culprit lesion & ECG</div>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-center">
              <div className="text-xs text-slate-400 font-mono uppercase">Patient Safety Index</div>
              <div className="text-3xl font-black mt-1 text-amber-400">{scoreReport.safetyScore}%</div>
              <div className="text-[11px] text-slate-400 mt-1">Contraindications avoided</div>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-center">
              <div className="text-xs text-slate-400 font-mono uppercase">Time Management</div>
              <div className="text-3xl font-black mt-1 text-teal-400">{scoreReport.timeManagementScore}%</div>
              <div className="text-[11px] text-slate-400 mt-1">Station pacing</div>
            </div>
          </div>

          {/* Attending Evaluator Feedback */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1.5">
            <div className="text-xs font-mono font-bold text-indigo-400 uppercase flex items-center gap-1.5">
              <Sparkles size={14} /> Attending Examiner Synthesis & Debrief
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              {scoreReport.attendingSummaryFeedback}
            </p>
          </div>

          {/* Station by Station Breakdown */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Station Breakdown & Action Audit
            </h3>
            <div className="space-y-2">
              {scoreReport.stationBreakdown.map((item) => (
                <div key={item.stationNumber} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{item.title}</span>
                    <span className="font-mono font-bold text-xs text-emerald-400">{item.score}%</span>
                  </div>

                  <ul className="space-y-1 text-xs text-slate-300">
                    {item.feedback.map((fb, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                        <span>{fb}</span>
                      </li>
                    ))}
                    {item.safetyViolations.map((v, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-rose-400">
                        <AlertTriangle size={13} className="shrink-0 mt-0.5" />
                        <span>Safety Breach: Triggered contraindicated action "{v}"</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Reset button */}
          <div className="pt-4 flex justify-end">
            <button
              onClick={() => {
                setScoreReport(null);
                setCurrentStationIndex(0);
                setStationTimeRemaining(scenario.stations[0].durationSeconds);
                setCandidateActions([]);
                setHistoryAnswersRevealed([]);
                setOrderedInvestigations([]);
                setSelectedMedications([]);
                setVivaResponseNotes('');
                setIsTimerRunning(true);
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 transition-all"
            >
              <RotateCcw size={14} />
              <span>Retake OSCE Scenario</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
