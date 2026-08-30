'use client';

import React, { useState } from 'react';
import { Save, Sparkles, CheckCircle } from 'lucide-react';
import { EVALUATE_SOAP_NOTE_CLIENT_MOCK, SoapGradingResult } from '@/frontend/.gemini/skills/SoapGradingRubric';
import ClinicalEvaluationReport from './ClinicalEvaluationReport';

export default function SoapNoteWriter({ patientId, onSave }: { patientId: string; onSave: () => void }) {
  const [form, setForm] = useState({
    noteType: 'PROGRESS_NOTE',
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<SoapGradingResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // 1. Submit Note to Backend API
      const payload = { ...form, authorId: 'Dr. Student' };
      fetch(`/api/v1/emr/patients/${patientId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(console.warn);

      // 2. Fetch AI Faculty Evaluation from Backend or Fallback Evaluator
      try {
        const evalRes = await fetch(`/api/v1/emr/soap-grade/evaluate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (evalRes.ok) {
          const evalData = await evalRes.json();
          // Merge with structured client report
          const clientReport = EVALUATE_SOAP_NOTE_CLIENT_MOCK(
            form.subjective,
            form.objective,
            form.assessment,
            form.plan
          );
          setEvaluationResult({
            ...clientReport,
            totalScore: evalData.totalScore || clientReport.totalScore,
            grade: evalData.grade || clientReport.grade,
          });
        } else {
          setEvaluationResult(
            EVALUATE_SOAP_NOTE_CLIENT_MOCK(form.subjective, form.objective, form.assessment, form.plan)
          );
        }
      } catch {
        setEvaluationResult(
          EVALUATE_SOAP_NOTE_CLIENT_MOCK(form.subjective, form.objective, form.assessment, form.plan)
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (evaluationResult) {
    return <ClinicalEvaluationReport result={evaluationResult} onContinue={onSave} />;
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden max-w-4xl mx-auto">
      <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-indigo-400" />
          <h3 className="font-bold text-white">Write & AI-Grade Clinical SOAP Note</h3>
        </div>
        <select
          value={form.noteType}
          onChange={(e) => setForm({ ...form, noteType: e.target.value })}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 outline-none focus:border-indigo-500"
        >
          <option value="H&P">History & Physical (H&P)</option>
          <option value="PROGRESS_NOTE">Daily Progress Note</option>
          <option value="DISCHARGE_SUMMARY">Discharge Summary</option>
        </select>
      </div>

      <div className="p-6 space-y-6">
        {[
          { field: 'subjective', hint: 'Chief complaint, HPI, onset timing, pain severity, past medical & allergies' },
          { field: 'objective', hint: 'Vitals (BP, HR, RR, Temp, SpO2), physical exam findings, pertinent labs' },
          { field: 'assessment', hint: 'Primary working diagnosis, ranked differential diagnoses, clinical reasoning' },
          { field: 'plan', hint: 'Diagnostics workup, pharmacology with specific doses, nursing orders, disposition' },
        ].map(({ field, hint }) => (
          <div key={field}>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-indigo-400 font-bold capitalize">{field}</label>
              <span className="text-[11px] text-slate-500 italic">{hint}</span>
            </div>
            <textarea
              required
              rows={4}
              value={(form as any)[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 text-sm focus:border-indigo-500 outline-none resize-y"
              placeholder={`Enter ${field} details for faculty evaluation...`}
            />
          </div>
        ))}
      </div>

      <div className="bg-slate-800/50 p-4 border-t border-slate-800 flex justify-between items-center">
        <span className="text-xs text-slate-400">
          Automated evaluation includes ICD-10 validation, safety checks & differential diagnosis rating.
        </span>
        <button
          type="submit"
          disabled={isSaving}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 shadow-lg text-sm"
        >
          <Save size={16} />
          {isSaving ? 'Evaluating Clinical Note...' : 'Sign & AI Evaluate Note'}
        </button>
      </div>
    </form>
  );
}
