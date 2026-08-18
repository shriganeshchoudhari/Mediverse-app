"use client";

import React, { useState } from "react";
import ClinicalPg1LabViewer from "../../components/pg1/ClinicalPg1LabViewer";
import {
  PG1_CORE_MODULES,
  getPg1ModuleById,
} from "../../lib/curriculum/content/pg1";
import Link from "next/link";
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

export default function ClinicalPg1LabPage() {
  const [selectedModuleId, setSelectedModuleId] = useState<string>("pg1-critical-care-hemodynamics-ecmo");

  const activeModule = getPg1ModuleById(selectedModuleId) || PG1_CORE_MODULES[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Top Hero Banner */}
      <div className="border-b border-indigo-950/80 bg-gradient-to-r from-slate-950 via-indigo-950/60 to-slate-950 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles size={14} /> Virtual Postgraduate Critical Care &amp; Residency Laboratory
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              🏥 Postgraduate Core Clinical Foundations &amp; Residency Readiness (PG-601)
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
              Advanced Critical Care Hemodynamics (Swan-Ganz pulmonary artery catheter thermodilution shock profiles, mixed venous SvO2 65-75%, global oxygen delivery DO2 kinetics, Veno-Venous VV-ECMO for refractory ARDS PaO2/FiO2 &lt;80, and peripheral Veno-Arterial VA-ECMO with mandatory 6-8 Fr distal limb perfusion cannulas and Harlequin syndrome mitigation), Advanced Mechanical Ventilation (ARDS Berlin definition, ARDSNet lung-protective strategy with 4-6 mL/kg PBW, plateau pressure Pplat &le;30 cmH2O, driving pressure &Delta;P &le;14 cmH2O, prone positioning &ge;16h/day, 48h Cisatracurium paralysis, double-triggering breath stacking, and Auto-PEEP I:E prolongations), Sepsis-3 Precision Resuscitation (Seymour Alpha-Delta clinical phenotypes, dynamic Passive Leg Raise PLR &Delta;stroke volume &ge;10% preload recruitability, Pulse Pressure Variation PPV &gt;13%, and the 4-phase ROSE de-escalation framework with active fluid evacuation), and Residency Core Competencies &amp; Systems Safety (ACGME 6 Core Competencies, Morbidity &amp; Mortality cognitive heuristic audits, Reason\'s Swiss Cheese latent failure models, and Resuscitation Crisis Resource Management with hands-off leadership and sterile cockpit closed-loop communication).
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
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-95 text-white text-sm font-bold shadow-lg shadow-indigo-500/20 transition"
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
          <ClinicalPg1LabViewer height="560px" />

          {/* Module Text Reader Card */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  Postgraduate Milestone: {activeModule.unitCode}
                </span>
                <h2 className="text-xl font-bold text-white mt-0.5">{activeModule.title}</h2>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-semibold">
                ⏱️ {activeModule.estimatedMinutes} min
              </span>
            </div>

            {/* Markdown Text Excerpt */}
            <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans bg-slate-950/60 p-5 rounded-xl border border-slate-800/80 max-h-96 overflow-y-auto">
              {activeModule.markdownContent}
            </div>

            {/* Clinical Vignette Card */}
            {activeModule.clinicalVignettes.length > 0 && (
              <div className="mt-6 p-5 rounded-xl bg-indigo-950/40 border border-indigo-800/60">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <ShieldAlert size={16} /> Postgraduate Critical Care Case Vignette
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium mb-3">
                  {activeModule.clinicalVignettes[0].scenario}
                </p>
                <div className="text-sm font-bold text-white mb-2">
                  {activeModule.clinicalVignettes[0].question}
                </div>
                <div className="p-3 rounded-lg bg-indigo-900/50 border border-indigo-700/60 text-xs text-indigo-300 font-medium">
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
              <BookOpen size={18} className="text-indigo-400" /> PG-601 Curriculum Units
            </h3>

            <div className="flex flex-col gap-2.5">
              {PG1_CORE_MODULES.map((mod) => {
                const isSelected = selectedModuleId === mod.id;
                return (
                  <button
                    key={mod.id}
                    onClick={() => {
                      setSelectedModuleId(mod.id);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all duration-200 ${
                      isSelected
                        ? "bg-indigo-950/70 border-indigo-500 shadow-md shadow-indigo-500/10"
                        : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] font-bold text-indigo-400 tracking-wider">
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
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-violet-950/60 border border-indigo-800/40">
            <h4 className="text-sm font-bold text-indigo-300 mb-2 flex items-center gap-2">
              <Zap size={16} /> Critical Care Residency Benchmarks
            </h4>
            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
              <li>Swan-Ganz Shock: <strong>Cardiogenic has high PCWP &gt;18, low CI &lt;2.2, and low SvO2 &lt;60%</strong>.</li>
              <li>ARDSNet Driving Pressure: <strong>Target &Delta;P (Pplat - PEEP) &le;14 cmH2O; Prone &ge;16h/d for P/F &lt;150</strong>.</li>
              <li>Dynamic PLR Test: <strong>Positive if real-time stroke volume rises &ge;10% on leg elevation</strong>.</li>
              <li>ROSE De-escalation: <strong>Evacuation phase (Day 3+) achieves active negative daily fluid balance</strong>.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
