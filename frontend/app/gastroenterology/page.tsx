"use client";

import React, { useState } from "react";
import GastroenterologyLabViewer from "../../components/gastroenterologyadv/GastroenterologyLabViewer";
import {
  GASTROENTEROLOGY_ADV_CORE_MODULES,
  getGastroenterologyAdvModuleById,
} from "../../lib/curriculum/content/gastroenterologyadv";
import Link from "next/link";
import {
  Sparkles,
  BookOpen,
  Award,
  Flame,
  Activity,
  Zap,
} from "lucide-react";

export default function GastroenterologyLabPage() {
  const [selectedModuleId, setSelectedModuleId] = useState<string>("gastroenterology-adv-cirrhosis-portal-hypertension");

  const activeModule = getGastroenterologyAdvModuleById(selectedModuleId) || GASTROENTEROLOGY_ADV_CORE_MODULES[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Top Hero Banner */}
      <div className="border-b border-amber-950/80 bg-gradient-to-r from-slate-950 via-amber-950/60 to-slate-950 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles size={14} /> Virtual Clinical Gastroenterology &amp; Hepatology Laboratory
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              🔬 Clinical Gastroenterology &amp; Hepatology (GASTRO-301)
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
              Cirrhosis &amp; Portal Hypertension (SAAG &ge;1.1, SBP ANC &gt;250, Varices Octreotide/EVL, Hepatorenal Syndrome), Jaundice Differential (Gilbert, Crigler-Najjar, Dubin-Johnson black liver, Courvoisier sign), Inflammatory Bowel Disease (Crohn skip/transmural/ASCA vs UC mucosal/crypt abscesses/p-ANCA), and Pancreatitis, Celiac &amp; Malabsorption.
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
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-yellow-600 hover:opacity-95 text-white text-sm font-bold shadow-lg shadow-amber-500/20 transition"
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
          <GastroenterologyLabViewer height="560px" />

          {/* Module Text Reader Card */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  NMC CBME Competency: {activeModule.unitCode}
                </span>
                <h2 className="text-xl font-bold text-white mt-0.5">{activeModule.title}</h2>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold">
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
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <Flame size={16} /> Clinical Gastroenterology Case Vignette
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium mb-3">
                  {activeModule.clinicalVignettes[0].scenario}
                </p>
                <div className="text-sm font-bold text-white mb-2">
                  {activeModule.clinicalVignettes[0].question}
                </div>
                <div className="p-3 rounded-lg bg-amber-900/50 border border-amber-700/60 text-xs text-amber-300 font-medium">
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
              <BookOpen size={18} className="text-amber-400" /> GASTRO-301 Curriculum Units
            </h3>

            <div className="flex flex-col gap-2.5">
              {GASTROENTEROLOGY_ADV_CORE_MODULES.map((mod) => {
                const isSelected = selectedModuleId === mod.id;
                return (
                  <button
                    key={mod.id}
                    onClick={() => {
                      setSelectedModuleId(mod.id);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all duration-200 ${
                      isSelected
                        ? "bg-amber-950/70 border-amber-500 shadow-md shadow-amber-500/10"
                        : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] font-bold text-amber-400 tracking-wider">
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
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/60 to-orange-950/60 border border-amber-800/40">
            <h4 className="text-sm font-bold text-amber-300 mb-2 flex items-center gap-2">
              <Zap size={16} /> Hepatology Clinical Rules
            </h4>
            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
              <li>SBP Paracentesis: <strong>ANC &gt;250/uL &rarr; IV Ceftriaxone + IV Albumin</strong>.</li>
              <li>SAAG &ge;1.1 g/dL: <strong>Portal Hypertension Transudate</strong>.</li>
              <li>Dubin-Johnson: <strong>Black liver (MRP2 defect)</strong> vs Rotor (normal liver).</li>
              <li>Crohn Disease: <strong>Transmural, skip lesions, non-caseating granulomas, ASCA+</strong>.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
