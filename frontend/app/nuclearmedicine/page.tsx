"use client";

import React, { useState } from "react";
import NuclearMedicineLabViewer from "../../components/nuclearmedicine/NuclearMedicineLabViewer";
import {
  NUCLEAR_MEDICINE_CORE_MODULES,
  getNuclearMedicineModuleById,
} from "../../lib/curriculum/content/nuclearmedicine";
import Link from "next/link";
import {
  Sparkles,
  BookOpen,
  Award,
  ShieldAlert,
  Activity,
  Zap,
} from "lucide-react";

export default function NuclearMedicineLabPage() {
  const [selectedModuleId, setSelectedModuleId] = useState<string>("nuclearmedicine-radiopharmaceuticals-decay-physics");

  const activeModule = getNuclearMedicineModuleById(selectedModuleId) || NUCLEAR_MEDICINE_CORE_MODULES[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Top Hero Banner */}
      <div className="border-b border-amber-950/80 bg-gradient-to-r from-slate-950 via-stone-950/80 to-slate-950 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles size={14} /> Virtual Nuclear Medicine &amp; Molecular Theranostics Laboratory
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              🩻 Nuclear Medicine (NUCL-401)
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
              Diagnostic &amp; Therapeutic Radiopharmaceuticals (99mTc, 18F, 131I, 177Lu, 68Ga), Planar &amp; SPECT-CT Scintigraphy (HIDA, V/Q Mismatch, Bone Scan), 18F-FDG PET-CT Oncology &amp; Neurodegenerative Dementia Patterns, and Molecular Theranostics (177Lu-DOTATATE PRRT &amp; 177Lu-PSMA-617).
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
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-600 to-amber-600 hover:opacity-95 text-white text-sm font-bold shadow-lg shadow-yellow-500/20 transition"
            >
              Take Clinical Exam
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Nuclear Medicine Lab Viewer (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <NuclearMedicineLabViewer height="560px" />

          {/* Module Text Reader Card */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">
                  NMC CBME Competency: {activeModule.unitCode}
                </span>
                <h2 className="text-xl font-bold text-white mt-0.5">{activeModule.title}</h2>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 font-semibold">
                ⏱️ {activeModule.estimatedMinutes} min
              </span>
            </div>

            {/* Markdown Text Excerpt */}
            <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans bg-slate-950/60 p-5 rounded-xl border border-slate-800/80 max-h-96 overflow-y-auto">
              {activeModule.markdownContent}
            </div>

            {/* Clinical Vignette Card */}
            {activeModule.clinicalVignettes.length > 0 && (
              <div className="mt-6 p-5 rounded-xl bg-amber-950/40 border border-amber-800/60">
                <div className="flex items-center gap-2 text-yellow-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <ShieldAlert size={16} /> Nuclear Medicine Case Vignette
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium mb-3">
                  {activeModule.clinicalVignettes[0].scenario}
                </p>
                <div className="text-sm font-bold text-white mb-2">
                  {activeModule.clinicalVignettes[0].question}
                </div>
                <div className="p-3 rounded-lg bg-amber-900/50 border border-amber-700/60 text-xs text-yellow-300 font-medium">
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
              <BookOpen size={18} className="text-yellow-400" /> NUCL-401 Curriculum Units
            </h3>

            <div className="flex flex-col gap-2.5">
              {NUCLEAR_MEDICINE_CORE_MODULES.map((mod) => {
                const isSelected = selectedModuleId === mod.id;
                return (
                  <button
                    key={mod.id}
                    onClick={() => {
                      setSelectedModuleId(mod.id);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all duration-200 ${
                      isSelected
                        ? "bg-amber-950/70 border-yellow-500 shadow-md shadow-yellow-500/10"
                        : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] font-bold text-yellow-400 tracking-wider">
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
          <div className="p-5 rounded-2xl bg-gradient-to-br from-stone-900 to-amber-950 border border-amber-800/40">
            <h4 className="text-sm font-bold text-yellow-300 mb-2 flex items-center gap-2">
              <Zap size={16} /> Nuclear Medicine Master Guide
            </h4>
            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
              <li>99mTc: T1/2 = 6.02h, 140 keV pure gamma from 99Mo generator.</li>
              <li>HIDA scan: Gallbladder non-visualization at 60 min = <strong>Acute Cholecystitis</strong>.</li>
              <li>Brain PET: <strong>Cingulate Island Sign</strong> identifies Dementia with Lewy Bodies.</li>
              <li>177Lu-DOTATATE: Co-infuse <strong>L-lysine &amp; L-arginine</strong> for renal protection.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
