'use client';

import React from 'react';
import { Award, CheckCircle, AlertTriangle, XCircle, FileText, Sparkles, ArrowRight } from 'lucide-react';
import { SoapGradingResult } from '@/frontend/.gemini/skills/SoapGradingRubric';

export default function ClinicalEvaluationReport({
  result,
  onContinue,
}: {
  result: SoapGradingResult;
  onContinue?: () => void;
}) {
  const getGradeColor = (grade: SoapGradingResult['grade']) => {
    switch (grade) {
      case 'HONORS':
        return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
      case 'PASS':
        return 'text-blue-400 border-blue-500/40 bg-blue-500/10';
      case 'CONDITIONAL':
        return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
      default:
        return 'text-red-400 border-red-500/40 bg-red-500/10';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-4xl mx-auto shadow-2xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono mb-1">
            <Sparkles size={14} /> AI FACULTY EVALUATION REPORT
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Clinical SOAP Note Assessment</h2>
          <p className="text-xs text-slate-400 mt-1">Evaluated on {new Date(result.evaluatedAt).toLocaleString()}</p>
        </div>

        <div className={`px-5 py-3 rounded-xl border flex items-center gap-3 ${getGradeColor(result.grade)}`}>
          <Award size={28} />
          <div>
            <div className="text-xs opacity-75 font-mono uppercase">Clinical Standing</div>
            <div className="text-xl font-extrabold">{result.grade} ({result.totalScore}/100)</div>
          </div>
        </div>
      </div>

      {/* Rubric Breakdown Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Evaluation Rubric Breakdown</h3>
        <div className="grid grid-cols-1 gap-3">
          {result.criteria.map((c, idx) => (
            <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {c.status === 'MET' ? (
                    <CheckCircle size={16} className="text-emerald-400" />
                  ) : c.status === 'PARTIALLY_MET' ? (
                    <AlertTriangle size={16} className="text-amber-400" />
                  ) : (
                    <XCircle size={16} className="text-red-400" />
                  )}
                  <span className="font-bold text-slate-200 text-sm">{c.title}</span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">{c.category}</span>
                </div>
                <p className="text-xs text-slate-400 pl-6">{c.clinicalFeedback}</p>
              </div>

              <div className="font-mono text-sm font-bold pl-6 md:pl-0">
                <span className={c.scoreAchieved >= c.maxScore * 0.8 ? 'text-emerald-400' : 'text-amber-400'}>
                  {c.scoreAchieved}
                </span>
                <span className="text-slate-600">/{c.maxScore}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Medical Coding & Safety Findings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Detected ICD-10 Codes */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <FileText size={14} /> Identified ICD-10 Clinical Codes
          </h4>
          <div className="space-y-2">
            {result.detectedIcd10Codes.map((code, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs p-2 bg-slate-900 rounded-lg">
                <span className="font-mono font-bold text-emerald-400">{code.code}</span>
                <span className="text-slate-300 truncate max-w-[200px]">{code.description}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Faculty Feedback */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Sparkles size={14} /> Attending Physician Teaching Points
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "{result.aiFacultyFeedback}"
            </p>
          </div>

          {onContinue && (
            <button
              onClick={onContinue}
              className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded-lg text-xs flex items-center justify-center gap-2 transition-colors"
            >
              Continue to Chart <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
