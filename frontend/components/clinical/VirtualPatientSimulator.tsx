'use client';

import React, { useState } from 'react';
import { Activity, Stethoscope, FileText, CheckCircle2, AlertTriangle, Play, RotateCcw, Award, ChevronRight } from 'lucide-react';

export interface VirtualPatientCase {
  id: string;
  title: string;
  specialty: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  patientProfile: {
    name: string;
    age: number;
    gender: string;
    occupation: string;
    chiefComplaint: string;
    initialVitals: {
      hr: number;
      bp: string;
      spo2: number;
      rr: number;
      temp: number;
      gcs: number;
    };
  };
  historyQuestions: Array<{
    id: string;
    question: string;
    patientAnswer: string;
    clinicalClue: string;
  }>;
  availableInvestigations: Array<{
    id: string;
    name: string;
    costTimeMinutes: number;
    finding: string;
    isKeyInvestigation: boolean;
  }>;
  availableInterventions: Array<{
    id: string;
    name: string;
    type: 'Medication' | 'Procedure' | 'Airway';
    response: string;
    isCorrect: boolean;
  }>;
  differentialOptions: Array<{
    id: string;
    diagnosis: string;
    isPrimary: boolean;
    explanation: string;
  }>;
  expertDebrief: string;
}

export const VIRTUAL_PATIENT_CASES: VirtualPatientCase[] = [
  {
    id: 'case-stemi-01',
    title: 'Acute Crushing Retrosternal Chest Pain (STEMI vs Aortic Dissection)',
    specialty: 'Cardiology & Emergency Medicine',
    difficulty: 'Advanced',
    patientProfile: {
      name: 'Ramesh Sharma',
      age: 58,
      gender: 'Male',
      occupation: 'Civil Engineer',
      chiefComplaint: 'Severe retrosternal pressure radiating to left jaw & shoulder × 90 minutes',
      initialVitals: {
        hr: 104,
        bp: '94/62',
        spo2: 95,
        rr: 22,
        temp: 36.8,
        gcs: 15,
      },
    },
    historyQuestions: [
      {
        id: 'hq-1',
        question: 'Can you describe the character of the pain and does it radiate to your back?',
        patientAnswer: 'It feels like an elephant sitting on my chest. It goes into my left jaw and shoulder, not tearing into my back.',
        clinicalClue: 'Classic ischemic pressure; absence of back tearing reduces suspicion of type A aortic dissection.',
      },
      {
        id: 'hq-2',
        question: 'Are you experiencing any sweating, shortness of breath, or nausea?',
        patientAnswer: 'Yes, I started sweating profusely and vomited once before the ambulance arrived.',
        clinicalClue: 'Autonomic diaphoresis and nausea are high-yield signs of transmural myocardial ischemia.',
      },
      {
        id: 'hq-3',
        question: 'Do you have a history of diabetes, hypertension, or smoking?',
        patientAnswer: 'I have had Type 2 diabetes for 12 years and smoke 1 pack a day. I take Metformin.',
        clinicalClue: 'Multiple major coronary artery disease (CAD) risk factors.',
      },
    ],
    availableInvestigations: [
      {
        id: 'inv-1',
        name: '12-Lead Electrocardiogram (ECG)',
        costTimeMinutes: 5,
        finding: 'Hyperacute T waves with 3.5mm ST-segment elevation in Leads V1–V4 with reciprocal ST depression in II, III, aVF. Anterior STEMI confirmed.',
        isKeyInvestigation: true,
      },
      {
        id: 'inv-2',
        name: 'High-Sensitivity Cardiac Troponin-I',
        costTimeMinutes: 20,
        finding: 'hs-cTnI: 4,820 ng/L (Normal < 14 ng/L). Markedly elevated.',
        isKeyInvestigation: true,
      },
      {
        id: 'inv-3',
        name: 'Bedside Echocardiography (POCUS)',
        costTimeMinutes: 10,
        finding: 'Anterior & apical wall hypokinesis; estimated LVEF 35-40%. No pericardial effusion or aortic root dilation.',
        isKeyInvestigation: true,
      },
      {
        id: 'inv-4',
        name: 'Arterial Blood Gas (ABG)',
        costTimeMinutes: 10,
        finding: 'pH 7.34, PaO2 82 mmHg, PaCO2 35 mmHg, Lactate 2.4 mmol/L.',
        isKeyInvestigation: false,
      },
      {
        id: 'inv-5',
        name: 'Chest X-Ray (Portable AP)',
        costTimeMinutes: 15,
        finding: 'Normal cardiothoracic ratio, no mediastinal widening, mild bilateral perihilar vascular congestion.',
        isKeyInvestigation: false,
      },
    ],
    availableInterventions: [
      {
        id: 'int-1',
        name: 'Dual Antiplatelet Therapy (Aspirin 300mg + Ticagrelor 180mg load)',
        type: 'Medication',
        response: 'Administered orally. Platelet aggregation inhibited.',
        isCorrect: true,
      },
      {
        id: 'int-2',
        name: 'Immediate Cath Lab Activation for Primary PCI (<90 min door-to-balloon)',
        type: 'Procedure',
        response: 'Cath lab team mobilized immediately. Interventional cardiologist en route.',
        isCorrect: true,
      },
      {
        id: 'int-3',
        name: 'Unfractionated Heparin 70 IU/kg IV bolus',
        type: 'Medication',
        response: 'Anticoagulation initiated to prevent coronary thrombus propagation.',
        isCorrect: true,
      },
      {
        id: 'int-4',
        name: 'Sublingual Nitroglycerin 0.4mg',
        type: 'Medication',
        response: 'Blood pressure drops to 82/50 mmHg; hold further nitrates due to borderline systolic BP.',
        isCorrect: false,
      },
      {
        id: 'int-5',
        name: 'High-Dose Intravenous Furosemide 80mg',
        type: 'Medication',
        response: 'Hypotension worsens due to pre-load reduction in borderline shock state.',
        isCorrect: false,
      },
    ],
    differentialOptions: [
      {
        id: 'diff-1',
        diagnosis: 'Acute Anterior STEMI (LAD Occlusion)',
        isPrimary: true,
        explanation: 'Confirmed by ST-elevation in V1-V4, elevated hs-Troponin, regional anterior wall motion abnormality on echo, and immediate primary PCI indication.',
      },
      {
        id: 'diff-2',
        diagnosis: 'Acute Type A Aortic Dissection',
        isPrimary: false,
        explanation: 'Unlikely given classic ST elevations, absence of tearing back pain, and normal mediastinum on imaging.',
      },
      {
        id: 'diff-3',
        diagnosis: 'Acute Massive Pulmonary Embolism',
        isPrimary: false,
        explanation: 'Presents typically with S1Q3T3 and right ventricular strain rather than anterior V1-V4 ST elevation.',
      },
      {
        id: 'diff-4',
        diagnosis: 'Acute Pericarditis',
        isPrimary: false,
        explanation: 'Pericarditis features diffuse PR depression and concave ST elevation across all leads without localized reciprocal changes.',
      },
    ],
    expertDebrief: 'This case exemplifies classic Acute Coronary Syndrome (STEMI). The prompt diagnosis via 12-lead ECG within 10 minutes of arrival and rapid dual antiplatelet loading + primary PCI activation are vital to salvaging ischemic myocardium and preventing cardiogenic shock.',
  },
];

export default function VirtualPatientSimulator() {
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const currentCase = VIRTUAL_PATIENT_CASES[activeCaseIndex];

  const [askedQuestions, setAskedQuestions] = useState<string[]>([]);
  const [orderedInvestigations, setOrderedInvestigations] = useState<string[]>([]);
  const [appliedInterventions, setAppliedInterventions] = useState<string[]>([]);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleAskQuestion = (id: string) => {
    if (!askedQuestions.includes(id)) {
      setAskedQuestions([...askedQuestions, id]);
    }
  };

  const handleOrderInvestigation = (id: string) => {
    if (!orderedInvestigations.includes(id)) {
      setOrderedInvestigations([...orderedInvestigations, id]);
    }
  };

  const handleApplyIntervention = (id: string) => {
    if (!appliedInterventions.includes(id)) {
      setAppliedInterventions([...appliedInterventions, id]);
    }
  };

  const handleReset = () => {
    setAskedQuestions([]);
    setOrderedInvestigations([]);
    setAppliedInterventions([]);
    setSelectedDiagnosis(null);
    setIsCompleted(false);
  };

  // Calculate diagnostic accuracy score
  const correctInterventionsCount = appliedInterventions.filter((id) =>
    currentCase.availableInterventions.find((i) => i.id === id)?.isCorrect
  ).length;

  const keyInvestigationsCount = orderedInvestigations.filter((id) =>
    currentCase.availableInvestigations.find((i) => i.id === id)?.isKeyInvestigation
  ).length;

  const isPrimaryCorrect = selectedDiagnosis === currentCase.differentialOptions.find((d) => d.isPrimary)?.id;

  const totalScore = Math.min(
    100,
    (isPrimaryCorrect ? 50 : 0) + keyInvestigationsCount * 10 + correctInterventionsCount * 10
  );

  return (
    <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              {currentCase.specialty}
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {currentCase.difficulty}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">{currentCase.title}</h2>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <RotateCcw size={14} /> Reset Case
          </button>
        </div>
      </div>

      {/* Patient Monitor & Profile */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Stethoscope size={14} className="text-blue-400" /> Patient Demographics
          </div>
          <div className="text-sm font-bold text-white">{currentCase.patientProfile.name}</div>
          <div className="text-xs text-slate-400">
            {currentCase.patientProfile.age} yrs • {currentCase.patientProfile.gender} • {currentCase.patientProfile.occupation}
          </div>
          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/40 text-xs text-rose-200 leading-relaxed">
            <strong>Chief Complaint:</strong> {currentCase.patientProfile.chiefComplaint}
          </div>
        </div>

        {/* Real-Time Vitals Bar */}
        <div className="md:col-span-8 p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            <Activity size={14} className="text-emerald-400" /> Real-Time Bedside Telemetry
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 font-bold">HR (bpm)</div>
              <div className="text-lg font-black text-rose-400">{currentCase.patientProfile.initialVitals.hr}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 font-bold">BP (mmHg)</div>
              <div className="text-lg font-black text-amber-400">{currentCase.patientProfile.initialVitals.bp}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 font-bold">SpO2 (%)</div>
              <div className="text-lg font-black text-emerald-400">{currentCase.patientProfile.initialVitals.spo2}%</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 font-bold">RR (/min)</div>
              <div className="text-lg font-black text-sky-400">{currentCase.patientProfile.initialVitals.rr}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 font-bold">Temp (°C)</div>
              <div className="text-lg font-black text-slate-200">{currentCase.patientProfile.initialVitals.temp}°</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 font-bold">GCS</div>
              <div className="text-lg font-black text-indigo-400">{currentCase.patientProfile.initialVitals.gcs}/15</div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 1: History Taking */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <span>1️⃣</span> Targeted History Taking
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {currentCase.historyQuestions.map((hq) => {
            const isAsked = askedQuestions.includes(hq.id);
            return (
              <button
                key={hq.id}
                onClick={() => handleAskQuestion(hq.id)}
                className={`p-3 rounded-xl text-left border text-xs transition-all ${
                  isAsked
                    ? 'bg-blue-950/40 border-blue-600 text-blue-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold mb-1">❓ {hq.question}</div>
                {isAsked && (
                  <div className="mt-2 pt-2 border-t border-blue-900/60 text-slate-200 text-[11px] leading-relaxed">
                    <strong className="text-blue-400">Patient:</strong> &quot;{hq.patientAnswer}&quot;
                    <div className="mt-1 text-slate-400 text-[10px] italic">💡 Clue: {hq.clinicalClue}</div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Diagnostic Investigations */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <span>2️⃣</span> Order Diagnostic Investigations
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {currentCase.availableInvestigations.map((inv) => {
            const isOrdered = orderedInvestigations.includes(inv.id);
            return (
              <div
                key={inv.id}
                className={`p-3.5 rounded-xl border text-xs transition-all flex flex-col justify-between ${
                  isOrdered
                    ? 'bg-emerald-950/40 border-emerald-600'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-white">{inv.name}</span>
                    <span className="text-[10px] text-slate-400">⏱️ {inv.costTimeMinutes}m</span>
                  </div>
                  {isOrdered && (
                    <div className="mt-2 p-2 rounded bg-slate-900 border border-slate-800 text-[11px] text-emerald-300 leading-relaxed">
                      <strong>Result:</strong> {inv.finding}
                    </div>
                  )}
                </div>

                {!isOrdered && (
                  <button
                    onClick={() => handleOrderInvestigation(inv.id)}
                    className="mt-3 w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                  >
                    Order Test
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 3: Emergency Interventions */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <span>3️⃣</span> Acute Medical Interventions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {currentCase.availableInterventions.map((intv) => {
            const isApplied = appliedInterventions.includes(intv.id);
            return (
              <div
                key={intv.id}
                className={`p-3.5 rounded-xl border text-xs transition-all flex flex-col justify-between ${
                  isApplied
                    ? intv.isCorrect
                      ? 'bg-emerald-950/40 border-emerald-600'
                      : 'bg-rose-950/40 border-rose-600'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-white">{intv.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">[{intv.type}]</span>
                  </div>
                  {isApplied && (
                    <div className="mt-2 p-2 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-200 leading-relaxed">
                      <strong>Response:</strong> {intv.response}
                    </div>
                  )}
                </div>

                {!isApplied && (
                  <button
                    onClick={() => handleApplyIntervention(intv.id)}
                    className="mt-3 w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                  >
                    Administer
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 4: Differential Diagnosis & Debrief */}
      <div className="p-5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
          <span>4️⃣</span> Final Diagnosis &amp; Clinical Debrief
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {currentCase.differentialOptions.map((diff) => (
            <button
              key={diff.id}
              disabled={isCompleted}
              onClick={() => setSelectedDiagnosis(diff.id)}
              className={`p-3.5 rounded-xl text-left border text-xs font-bold transition-all ${
                selectedDiagnosis === diff.id
                  ? 'bg-indigo-950/70 border-indigo-500 text-indigo-200 shadow-md'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{diff.diagnosis}</span>
                {selectedDiagnosis === diff.id && <CheckCircle2 size={14} className="text-indigo-400" />}
              </div>
            </button>
          ))}
        </div>

        {!isCompleted && selectedDiagnosis && (
          <button
            onClick={() => setIsCompleted(true)}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition"
          >
            Submit Diagnostic Assessment &amp; View Debrief
          </button>
        )}

        {isCompleted && (
          <div className="mt-4 p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Award className="text-amber-400" size={20} />
                <span className="text-sm font-bold text-white">Diagnostic Accuracy Score:</span>
                <span className="text-base font-extrabold text-amber-400">{totalScore}%</span>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                isPrimaryCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
              }`}>
                {isPrimaryCorrect ? 'Correct Primary Diagnosis' : 'Incorrect Diagnosis'}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {currentCase.expertDebrief}
            </p>

            <div className="space-y-2">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Differential Rationale:</h5>
              {currentCase.differentialOptions.map((diff) => (
                <div key={diff.id} className="text-xs text-slate-400">
                  <strong className="text-slate-200">{diff.diagnosis}:</strong> {diff.explanation}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
