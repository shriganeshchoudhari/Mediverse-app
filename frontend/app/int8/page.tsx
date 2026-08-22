"use client";

import React, { useState } from "react";
import ClinicalInt8LabViewer from "../../components/int8/ClinicalInt8LabViewer";
import {
  INT8_CORE_MODULES,
  getInt8ModuleById,
} from "../../lib/curriculum/content/int8";
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
  GraduationCap,
} from "lucide-react";

export default function ClinicalInt8LabPage() {
  const [selectedModuleId, setSelectedModuleId] = useState<string>("int8-medico-legal-death-certification-thota");

  const activeModule = getInt8ModuleById(selectedModuleId) || INT8_CORE_MODULES[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Top Hero Banner */}
      <div className="border-b border-rose-950/80 bg-gradient-to-r from-slate-950 via-rose-950/60 to-slate-950 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles size={14} /> Virtual Exit Competencies &amp; Clinical Portfolio Laboratory
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              🏥 Internship Core Clinical Postings: Exit Competencies &amp; Portfolio (INT-508)
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
              Medico-Legal Jurisprudence &amp; Death Certification (MCCD Form 4/4A Part I sequence, Underlying Cause of Death UCOD vs terminal mechanisms, MLC police registration with saturated saline viscera preservation, and THOTA 2014 statutory brainstem death certification with 4-doctor panel and 6-hour interval apnea testing), Entrustable Professional Activities (AAMC and NMC 13 Core EPAs, Chen\'s 5-level entrustment decision scale with Level 4 independent practice graduation target, and workplace-based assessment triangulation via Mini-CEX, DOPS, and CbD), Exit OSCE Master Stations (Septic shock 30 mL/kg fluid bundle and Norepinephrine MAP &ge;65 mmHg, CICO difficult airway emergency scalpel-bougie-tube cricothyroidotomy with 6.0 cuffed ETT, refractory postpartum hemorrhage uterotonic escalation and Bakri balloon tamponade, and acute ischemic stroke door-to-needle thrombolysis with IV Alteplase 0.9 mg/kg &le;4.5h), and Quality Improvement &amp; Patient Safety (Ishikawa 6M fishbone root cause analysis, 5 Whys iterative interrogation, PDSA rapid-cycle improvement, and SBAR structured clinical handover).
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
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 hover:opacity-95 text-white text-sm font-bold shadow-lg shadow-rose-500/20 transition"
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
          <ClinicalInt8LabViewer height="560px" />

          {/* Module Text Reader Card */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                  NMC CBME Competency: {activeModule.unitCode}
                </span>
                <h2 className="text-xl font-bold text-white mt-0.5">{activeModule.title}</h2>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold">
                ⏱️ {activeModule.estimatedMinutes} min
              </span>
            </div>

            {/* Markdown Text Excerpt */}
            <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800/80 max-h-96 overflow-y-auto">
              <MarkdownRenderer content={activeModule.markdownContent} />
            </div>

            {/* Clinical Vignette Card */}
            {activeModule.clinicalVignettes.length > 0 && (
              <div className="mt-6 p-5 rounded-xl bg-rose-950/40 border border-rose-800/60">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <ShieldAlert size={16} /> Exit Competency Case Vignette
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium mb-3">
                  {activeModule.clinicalVignettes[0].scenario}
                </p>
                <div className="text-sm font-bold text-white mb-2">
                  {activeModule.clinicalVignettes[0].question}
                </div>
                <div className="p-3 rounded-lg bg-rose-900/50 border border-rose-700/60 text-xs text-rose-300 font-medium">
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
              <BookOpen size={18} className="text-rose-400" /> INT-508 Curriculum Units
            </h3>

            <div className="flex flex-col gap-2.5">
              {INT8_CORE_MODULES.map((mod) => {
                const isSelected = selectedModuleId === mod.id;
                return (
                  <button
                    key={mod.id}
                    onClick={() => {
                      setSelectedModuleId(mod.id);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all duration-200 ${
                      isSelected
                        ? "bg-rose-950/70 border-rose-500 shadow-md shadow-rose-500/10"
                        : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] font-bold text-rose-400 tracking-wider">
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
          <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-950/60 to-pink-950/60 border border-rose-800/40">
            <h4 className="text-sm font-bold text-rose-300 mb-2 flex items-center gap-2">
              <Zap size={16} /> Exit Competency Milestones
            </h4>
            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
              <li>MCCD Death Certificate: <strong>Part I Line (c) must be UCOD; NEVER write 'Cardiorespiratory Arrest'</strong>.</li>
              <li>THOTA Brainstem Death: <strong>4-doctor panel + 2 apnea tests 6 hours apart with PaCO2 &ge;60 mmHg</strong>.</li>
              <li>Entrustment Benchmark: <strong>Chen's Level 4 (Independent Practice with distant oversight) for graduation</strong>.</li>
              <li>CICO Airway Crisis: <strong>Immediate Scalpel-Bougie-Tube surgical cricothyroidotomy (6.0 cuffed ETT)</strong>.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
