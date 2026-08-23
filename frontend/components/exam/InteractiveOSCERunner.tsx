'use client';

import React, { useState, useEffect } from 'react';
import { Timer, CheckCircle, Circle, AlertCircle, Award, RotateCcw, Play, Pause, Stethoscope, ChevronRight } from 'lucide-react';

export interface OSCEStation {
  id: string;
  title: string;
  domain: string;
  timeLimitMinutes: number;
  passingScorePct: number;
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
  patientScenario: {
    demographics: string;
    setting: string;
    taskPrompt: string;
    vitalSigns: Record<string, string>;
  };
  checklistItems: Array<{
    id: string;
    description: string;
    marks: number;
    category: 'Communication' | 'Procedure' | 'Clinical Reasoning' | 'Safety';
  }>;
  examinerNotes: string;
}

export const OSCE_STATIONS_CATALOG: OSCEStation[] = [
  {
    id: 'osce-iv-cannula',
    title: 'Station 1: Intravenous Cannulation & Fluid Resuscitation',
    domain: 'Nursing & Emergency Medicine',
    timeLimitMinutes: 8,
    passingScorePct: 70,
    difficulty: 'Intermediate',
    patientScenario: {
      demographics: '45-year-old male presenting with acute dehydration secondary to gastroenteritis',
      setting: 'Emergency Observation Unit',
      taskPrompt: 'Select equipment, perform aseptic IV cannulation on the simulator arm, attach normal saline, and calculate the initial drip rate.',
      vitalSigns: { 'Heart Rate': '112 bpm', 'Blood Pressure': '92/60 mmHg', 'Capillary Refill': '3.5 seconds' },
    },
    checklistItems: [
      { id: 'c1', description: 'Performs hand hygiene (WHO 6 steps) before patient contact', marks: 10, category: 'Safety' },
      { id: 'c2', description: 'Explains procedure and obtains informed verbal consent', marks: 10, category: 'Communication' },
      { id: 'c3', description: 'Applies tourniquet 10-15cm proximal to target vein', marks: 10, category: 'Procedure' },
      { id: 'c4', description: 'Disinfects site with 2% chlorhexidine in 70% alcohol for 30s and lets dry', marks: 10, category: 'Safety' },
      { id: 'c5', description: 'Inserts 18G/20G cannula bevel up at 15-30° angle', marks: 15, category: 'Procedure' },
      { id: 'c6', description: 'Observes primary flashback in chamber before advancing catheter', marks: 15, category: 'Procedure' },
      { id: 'c7', description: 'Secures cannula with transparent dressing and flushes with normal saline', marks: 15, category: 'Procedure' },
      { id: 'c8', description: 'Safely disposes stylet immediately into designated sharps container', marks: 15, category: 'Safety' },
    ],
    examinerNotes: 'Candidate must maintain strict aseptic non-touch technique (ANTT). Sharps safety is critical.',
  },
  {
    id: 'osce-acute-abdomen',
    title: 'Station 2: Abdominal Examination — Acute Appendicitis',
    domain: 'General Surgery & Allopathic Medicine',
    timeLimitMinutes: 10,
    passingScorePct: 75,
    difficulty: 'Intermediate',
    patientScenario: {
      demographics: '23-year-old female presenting with 18 hours of periumbilical pain radiating to the right lower quadrant',
      setting: 'Surgical Assessment Unit',
      taskPrompt: 'Conduct a systematic abdominal examination, elicit specific peritoneal signs, and present your provisional diagnosis and differential.',
      vitalSigns: { 'Temperature': '38.1°C', 'Heart Rate': '98 bpm', 'Blood Pressure': '118/76 mmHg' },
    },
    checklistItems: [
      { id: 'ca1', description: 'Positions patient supine with head supported and knees slightly flexed', marks: 10, category: 'Procedure' },
      { id: 'ca2', description: 'Inspects abdomen for scars, distension, and localized movement with respiration', marks: 10, category: 'Procedure' },
      { id: 'ca3', description: 'Auscultates for bowel sounds prior to palpation', marks: 10, category: 'Procedure' },
      { id: 'ca4', description: 'Lightly palpates furthest from site of pain first', marks: 15, category: 'Procedure' },
      { id: 'ca5', description: 'Demonstrates McBurney point tenderness and rebound tenderness (Blumberg sign)', marks: 15, category: 'Clinical Reasoning' },
      { id: 'ca6', description: 'Tests for Rovsing sign (RLQ pain on LLQ palpation)', marks: 15, category: 'Clinical Reasoning' },
      { id: 'ca7', description: 'Tests for Psoas sign and Obturator sign', marks: 10, category: 'Clinical Reasoning' },
      { id: 'ca8', description: 'Communicates provisional diagnosis: Acute Appendicitis (Alvarado score >= 7)', marks: 15, category: 'Communication' },
    ],
    examinerNotes: 'Candidate must avoid starting palpation at the tender RLQ to prevent voluntary muscle guarding.',
  },
];

export default function InteractiveOSCERunner() {
  const [activeStationIndex, setActiveStationIndex] = useState(0);
  const station = OSCE_STATIONS_CATALOG[activeStationIndex];

  const [timeLeftSeconds, setTimeLeftSeconds] = useState(station.timeLimitMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setTimeLeftSeconds(station.timeLimitMinutes * 60);
    setIsRunning(false);
    setCompletedItems([]);
    setIsSubmitted(false);
  }, [activeStationIndex, station]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeftSeconds > 0) {
      timer = setInterval(() => {
        setTimeLeftSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeftSeconds]);

  const toggleCheckItem = (id: string) => {
    if (isSubmitted) return;
    if (completedItems.includes(id)) {
      setCompletedItems(completedItems.filter((i) => i !== id));
    } else {
      setCompletedItems([...completedItems, id]);
    }
  };

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;

  const totalPossibleMarks = station.checklistItems.reduce((sum, item) => sum + item.marks, 0);
  const earnedMarks = station.checklistItems
    .filter((item) => completedItems.includes(item.id))
    .reduce((sum, item) => sum + item.marks, 0);

  const scorePct = Math.round((earnedMarks / totalPossibleMarks) * 100);
  const hasPassed = scorePct >= station.passingScorePct;

  return (
    <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
      {/* Station Selector & Timer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {station.domain}
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Passing Benchmark: {station.passingScorePct}%
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">{station.title}</h2>
        </div>

        {/* Timed Station Controls */}
        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 font-mono text-base font-bold ${
            timeLeftSeconds < 120
              ? 'bg-rose-950/50 border-rose-600 text-rose-400 animate-pulse'
              : 'bg-slate-950 border-slate-800 text-slate-200'
          }`}>
            <Timer size={18} />
            <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
          </div>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            {isRunning ? <Pause size={16} /> : <Play size={16} />}
          </button>

          <button
            onClick={() => {
              setTimeLeftSeconds(station.timeLimitMinutes * 60);
              setIsRunning(false);
              setCompletedItems([]);
              setIsSubmitted(false);
            }}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Patient Scenario Card */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          <Stethoscope size={14} className="text-sky-400" /> Standardized Clinical Encounter
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
          <div><strong>Patient:</strong> {station.patientScenario.demographics}</div>
          <div><strong>Setting:</strong> {station.patientScenario.setting}</div>
          <div className="flex gap-2">
            <strong>Vitals:</strong>
            {Object.entries(station.patientScenario.vitalSigns).map(([k, v]) => (
              <span key={k} className="text-slate-400 font-mono">{k}: {v} •</span>
            ))}
          </div>
        </div>
        <div className="p-3 rounded-lg bg-sky-950/30 border border-sky-800/40 text-xs text-sky-200">
          <strong>Candidate Instruction:</strong> {station.patientScenario.taskPrompt}
        </div>
      </div>

      {/* Step-by-Step Checklist Rubric */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            Examiner Checklist Items ({completedItems.length}/{station.checklistItems.length} Marked)
          </h3>
          <span className="text-xs font-mono text-slate-400">Current Score: {earnedMarks}/{totalPossibleMarks} pts</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {station.checklistItems.map((item) => {
            const isDone = completedItems.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => toggleCheckItem(item.id)}
                className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                  isDone
                    ? 'bg-emerald-950/40 border-emerald-600 text-emerald-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isDone ? <CheckCircle size={16} className="text-emerald-400" /> : <Circle size={16} className="text-slate-500" />}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{item.description}</div>
                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">{item.category}</span>
                    <span className="font-mono font-bold text-amber-400">+{item.marks} pts</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Submission & Grading Station */}
      <div className="pt-2">
        {!isSubmitted ? (
          <button
            onClick={() => {
              setIsRunning(false);
              setIsSubmitted(true);
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition"
          >
            Complete Station &amp; Calculate OSCE Grade
          </button>
        ) : (
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Award className={hasPassed ? 'text-emerald-400' : 'text-rose-400'} size={22} />
                <span className="text-sm font-bold text-white">OSCE Station Result:</span>
                <span className={`text-base font-extrabold ${hasPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {scorePct}% ({earnedMarks}/{totalPossibleMarks} Marks)
                </span>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                hasPassed ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}>
                {hasPassed ? 'PASSED STATION' : 'NEEDS REMEDIATION'}
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <strong className="text-slate-100">Examiner Feedback &amp; Safety Traps:</strong> {station.examinerNotes}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
