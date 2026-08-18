"use client";

import React, { useState } from "react";
import ClinicalInt5LabViewer from "../../components/int5/ClinicalInt5LabViewer";
import {
  INT5_CORE_MODULES,
  getInt5ModuleById,
} from "../../lib/curriculum/content/int5";
import Link from "next/link";
import {
  Sparkles,
  BookOpen,
  Activity,
  Flame,
  Shield,
  Zap,
  ShieldAlert,
  Scissors,
} from "lucide-react";

export default function ClinicalInt5LabPage() {
  const [selectedModuleId, setSelectedModuleId] = useState<string>("int5-acute-abdomen-appendicitis-cholecystitis");

  const activeModule = getInt5ModuleById(selectedModuleId) || INT5_CORE_MODULES[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Top Hero Banner */}
      <div className="border-b border-red-950/80 bg-gradient-to-r from-slate-950 via-red-950/60 to-slate-950 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles size={14} /> Virtual Surgical Postings &amp; Trauma Call Laboratory
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              🏥 Internship Core Clinical Postings: Surgical Postings &amp; Trauma Call (INT-505)
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
              Acute Abdomen Surgical Triage (Alvarado MANTRELS scoring &ge;7 for appendicitis, Tokyo TG18 guidelines for cholecystitis, adhesive SBO vs closed-loop strangulation whirl sign, and perforated viscus peritonitis), Thermal Burns &amp; Fluid Resuscitation (Wallace Rule of Nines %TBSA burn surface area, Parkland crystalloid formula 4 mL &times; kg &times; %TBSA with 50% in first 8 hours from burn time, and hourly urine output titration), Acute Extremity Compartment Syndrome (The 6 Ps, Stryker intracompartmental manometry with Delta P &le;30 mmHg tissue ischemia threshold, and emergent two-incision four-compartment lower leg fasciotomy), and Necrotizing Soft Tissue Infections (Type I polymicrobial vs Type II monomicrobial GAS/Staph, LRINEC scoring &ge;6, immediate radical OR debridement, and Clindamycin 50S ribosomal protein toxin shutdown).
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
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-amber-600 hover:opacity-95 text-white text-sm font-bold shadow-lg shadow-red-500/20 transition"
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
          <ClinicalInt5LabViewer height="560px" />

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
            <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans bg-slate-950/60 p-5 rounded-xl border border-slate-800/80 max-h-96 overflow-y-auto">
              {activeModule.markdownContent}
            </div>

            {/* Clinical Vignette Card */}
            {activeModule.clinicalVignettes.length > 0 && (
              <div className="mt-6 p-5 rounded-xl bg-red-950/40 border border-red-800/60">
                <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <ShieldAlert size={16} /> Surgical &amp; Trauma Call Case Vignette
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
              <BookOpen size={18} className="text-red-400" /> INT-505 Curriculum Units
            </h3>

            <div className="flex flex-col gap-2.5">
              {INT5_CORE_MODULES.map((mod) => {
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
          <div className="p-5 rounded-2xl bg-gradient-to-br from-red-950/60 to-amber-950/60 border border-red-800/40">
            <h4 className="text-sm font-bold text-red-300 mb-2 flex items-center gap-2">
              <Zap size={16} /> Surgical Trauma Benchmarks
            </h4>
            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
              <li>Alvarado Score: <strong>&ge;7 indicates high probability of appendicitis</strong>.</li>
              <li>Parkland Formula: <strong>4 mL &times; kg &times; %TBSA; 50% given in first 8h from burn time</strong>.</li>
              <li>Compartment Syndrome: <strong>&Delta;P = DBP - Pcomp &le;30 mmHg &rarr; emergent fasciotomy</strong>.</li>
              <li>LRINEC Score: <strong>&ge;6 suggests necrotizing fasciitis; immediate radical OR debridement</strong>.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
