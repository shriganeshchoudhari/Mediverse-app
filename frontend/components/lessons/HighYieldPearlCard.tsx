'use client';

import React from 'react';
import { Lightbulb, AlertOctagon, Target, Stethoscope, ShieldAlert } from 'lucide-react';
import { ClinicalPearl } from '@/.gemini/skills/HighYieldClinicalPearls';

interface HighYieldPearlCardProps {
  pearl: ClinicalPearl;
}

export default function HighYieldPearlCard({ pearl }: HighYieldPearlCardProps) {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-indigo-500/30 rounded-2xl p-6 my-6 shadow-xl relative overflow-hidden">
      {/* Accent glow banner */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-indigo-500 to-emerald-500" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Lightbulb size={20} />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              High-Yield Exam Pearl
            </span>
            <h4 className="text-base font-bold text-white mt-1">{pearl.topic}</h4>
          </div>
        </div>
        <span className="text-xs text-slate-400 font-mono self-start sm:self-auto bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
          {pearl.domain}
        </span>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 text-xs">
        {/* Buzzword */}
        <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 space-y-1">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
            <Target size={14} /> Classic Board Buzzword / Presentation:
          </div>
          <p className="text-slate-300 leading-relaxed italic">&ldquo;{pearl.buzzword}&rdquo;</p>
        </div>

        {/* Pathophysiology */}
        <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 space-y-1">
          <div className="flex items-center gap-1.5 text-indigo-400 font-bold">
            <Stethoscope size={14} /> Core Pathophysiology:
          </div>
          <p className="text-slate-300 leading-relaxed">{pearl.pathophysiology}</p>
        </div>

        {/* First-Line Workup */}
        <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <CheckCircleIcon size={14} /> 1st-Line Diagnostic:
          </div>
          <p className="text-slate-300 leading-relaxed font-mono">{pearl.firstLineDiagnostic}</p>
        </div>

        {/* First-Line Treatment */}
        <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 space-y-1">
          <div className="flex items-center gap-1.5 text-blue-400 font-bold">
            <CheckCircleIcon size={14} /> 1st-Line Management:
          </div>
          <p className="text-slate-300 leading-relaxed">{pearl.firstLineTreatment}</p>
        </div>
      </div>

      {/* Examiner Trap Pitfall Alert */}
      <div className="bg-rose-950/30 border border-rose-500/30 p-4 rounded-xl flex items-start gap-3 mt-1">
        <div className="text-rose-400 mt-0.5 shrink-0">
          <AlertOctagon size={18} />
        </div>
        <div>
          <div className="text-xs font-bold text-rose-300 uppercase tracking-wide">
            Examiner Trap & Common MCQ Pitfall:
          </div>
          <p className="text-xs text-rose-200/90 mt-1 leading-relaxed">
            {pearl.examinerTrap}
          </p>
        </div>
      </div>

      {/* Mnemonics if available */}
      {pearl.clinicalMnemonics && (
        <div className="mt-3 text-xs bg-slate-950/40 p-2.5 rounded-lg border border-slate-800 text-slate-400 font-mono">
          <strong className="text-indigo-400 font-sans">Memory Anchor: </strong> {pearl.clinicalMnemonics}
        </div>
      )}
    </div>
  );
}

function CheckCircleIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
