"use client";

import React, { useState } from "react";
import ClinicalInt1LabViewer from "../../components/int1/ClinicalInt1LabViewer";
import {
  INT1_CORE_MODULES,
  getInt1ModuleById,
} from "../../lib/curriculum/content/int1";
import Link from "next/link";
import MarkdownRenderer from "../../components/common/MarkdownRenderer";
import {
  Sparkles,
  BookOpen,
  Activity,
  Flame,
  Shield,
  Zap,
  ShieldAlert,
} from "lucide-react";

export default function ClinicalInt1LabPage() {
  const [selectedModuleId, setSelectedModuleId] = useState<string>("int1-acls-pathways-arrest");

  const activeModule = getInt1ModuleById(selectedModuleId) || INT1_CORE_MODULES[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Top Hero Banner */}
      <div className="border-b border-red-950/80 bg-gradient-to-r from-slate-950 via-red-950/60 to-slate-950 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles size={14} /> Virtual Internship Emergency &amp; Critical Care Laboratory
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              🏥 Internship Core Clinical Postings: Emergency &amp; Critical Care (INT-501)
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
              Advanced Cardiac Life Support (ACLS 2025 Algorithmic Pathways for shockable VF/pulseless VT with biphasic defibrillation and Amiodarone, non-shockable PEA/Asystole with immediate Epinephrine, the reversible 5 Hs and 5 Ts checklist, and post-ROSC Targeted Temperature Management 32-36&deg;C neuroprotection), Sepsis-3 Resuscitation Bundles (Surviving Sepsis Campaign Hour-1 bundle, 30 mL/kg balanced crystalloid fluid bolus, Norepinephrine first-line vasopressor titration to MAP &ge;65 mmHg, and refractory septic shock vasopressin/hydrocortisone escalation), Trauma Primary &amp; Secondary Surveys (ATLS ABCDE framework, tension pneumothorax needle decompression, Massive Transfusion Protocol 1:1:1 balanced blood component resuscitation, Tranexamic Acid TXA within 3 hours, and bedside FAST / E-FAST ultrasound exams), and Rapid Sequence Intubation (The 7 Ps of emergency airway control, hemodynamically neutral Etomidate and Ketamine induction, Succinylcholine hyperkalemia contraindications versus Rocuronium, and continuous waveform capnography EtCO2 confirmation).
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/subjects"
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-semibold transition"
            >
              Browse All Subjects
            </Link>
            <Link
              href="/exam"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:opacity-95 text-white text-sm font-bold shadow-lg shadow-red-500/20 transition"
            >
              Take Clinical Exam
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Lab Viewer (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <ClinicalInt1LabViewer height="560px" />

          {/* Module Text Reader Card */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                  NMC CBME Competency: {activeModule.unitCode}
                </span>
                <h2 className="text-xl font-bold text-white mt-0.5">{activeModule.title}</h2>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 font-semibold">
                ⏱️ {activeModule.estimatedMinutes} min
              </span>
            </div>

            {/* Markdown Text Excerpt */}
            <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800/80 max-h-96 overflow-y-auto">
              <MarkdownRenderer content={activeModule.markdownContent} />
            </div>

            {/* Clinical Vignette Card */}
            {activeModule.clinicalVignettes.length > 0 && (
              <div className="mt-6 p-5 rounded-xl bg-red-950/40 border border-red-800/60">
                <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <ShieldAlert size={16} /> Emergency Resuscitation &amp; Critical Care Vignette
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium mb-3">
                  {activeModule.clinicalVignettes[0].scenario}
                </p>
                <div className="text-sm font-bold text-white mb-2">
                  {activeModule.clinicalVignettes[0].question}
                </div>
                <div className="p-3 rounded-lg bg-red-900/50 border border-red-700/60 text-xs text-red-300 font-medium">
                  <strong>Answer &amp; Rationale:</strong> {activeModule.clinicalVignettes[0].explanation}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Curriculum Units & High-Yield Pearls (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <BookOpen size={18} className="text-red-400" /> INT-501 Curriculum Units
            </h3>

            <div className="flex flex-col gap-2.5">
              {INT1_CORE_MODULES.map((mod) => {
                const isSelected = selectedModuleId === mod.id;
                return (
                  <button
                    key={mod.id}
                    onClick={() => {
                      setSelectedModuleId(mod.id);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all duration-200 ${
                      isSelected
                        ? "bg-red-950/70 border-red-500 shadow-md shadow-red-500/10"
                        : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] font-bold text-red-400 tracking-wider">
                        {mod.unitCode}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {mod.estimatedMinutes} min
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-200 line-clamp-1">{mod.title}</div>
                    <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                      <span>{mod.competencies.join(", ")}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Guide */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-red-950/60 to-rose-950/60 border border-red-800/40">
            <h4 className="text-sm font-bold text-red-300 mb-2 flex items-center gap-2">
              <Zap size={16} /> Resuscitation Rules of Thumb
            </h4>
            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
              <li>VF / pVT Arrest: <strong>Defibrillate stat &rarr; CPR &rarr; Epinephrine after shock 2 &rarr; Amiodarone after shock 3</strong>.</li>
              <li>Sepsis Hour-1: <strong>Lactate, blood cultures x2, broad-spectrum IV abx &le;1h, 30 mL/kg fluids</strong>.</li>
              <li>Trauma Hemorrhage: <strong>MTP 1:1:1 PRBC:FFP:Platelets + TXA 1 g IV within 3 hours</strong>.</li>
              <li>RSI Succinylcholine: <strong>STRICTLY CONTRAINDICATED in burns &gt;24h and crush injuries (fatal hyperkalemia)</strong>.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
