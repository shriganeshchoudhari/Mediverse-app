"use client";

import React, { useState } from "react";
import ClinicalMedicineAdvLabViewer from "../../components/medicineadv/ClinicalMedicineAdvLabViewer";
import {
  MEDICINE_ADV_CORE_MODULES,
  getMedicineAdvModuleById,
} from "../../lib/curriculum/content/medicineadv";
import Link from "next/link";
import {
  Sparkles,
  BookOpen,
  Activity,
  Flame,
  Shield,
  Zap,
  HeartPulse,
} from "lucide-react";

export default function ClinicalMedicineLabPage() {
  const [selectedModuleId, setSelectedModuleId] = useState<string>("medicine-adv-acute-coronary-syndromes");

  const activeModule = getMedicineAdvModuleById(selectedModuleId) || MEDICINE_ADV_CORE_MODULES[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Top Hero Banner */}
      <div className="border-b border-sky-950/80 bg-gradient-to-r from-slate-950 via-sky-950/60 to-slate-950 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles size={14} /> Virtual Clinical Internal Medicine Laboratory
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              🩺 Clinical Internal Medicine: Advanced Cardiology, Pulmonology &amp; Nephrology (MED-301)
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
              Acute Coronary Syndromes (STEMI/NSTEMI culprit vessel ECG localization, LAD anterior vs RCA inferior with right-sided V4R RV infarct caution, primary PCI &le;90 min vs fibrinolysis, DAPT and high-intensity statins), Heart Failure with Reduced Ejection Fraction (HFrEF 4-pillar GDMT optimization: ARNI Sacubitril/Valsartan with 36h ACEi washout, mortality beta-blockers Carvedilol/Metoprolol succinate, MRA Spironolactone, and SGLT2i Dapagliflozin), Advanced Acid-Base &amp; ABG Analysis (5-step systematic algorithm, Winter&apos;s formula, Delta-Delta ratio, albumin-corrected anion gap, and toxic alcohol osmolar gaps), and Acute Kidney Injury (KDIGO Stages 1-3 staging, Prerenal FeNa &lt;1% vs ATN muddy brown granular casts vs AIN drug-induced WBC casts and eosinophiluria).
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
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-sky-600 to-blue-600 hover:opacity-95 text-white text-sm font-bold shadow-lg shadow-sky-500/20 transition"
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
          <ClinicalMedicineAdvLabViewer height="560px" />

          {/* Module Text Reader Card */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                  NMC CBME Competency: {activeModule.unitCode}
                </span>
                <h2 className="text-xl font-bold text-white mt-0.5">{activeModule.title}</h2>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 font-semibold">
                ⏱️ {activeModule.estimatedMinutes} min
              </span>
            </div>

            {/* Markdown Text Excerpt */}
            <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans bg-slate-950/60 p-5 rounded-xl border border-slate-800/80 max-h-96 overflow-y-auto">
              {activeModule.markdownContent}
            </div>

            {/* Clinical Vignette Card */}
            {activeModule.clinicalVignettes.length > 0 && (
              <div className="mt-6 p-5 rounded-xl bg-sky-950/40 border border-sky-800/60">
                <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <HeartPulse size={16} /> Internal Medicine Case Vignette
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium mb-3">
                  {activeModule.clinicalVignettes[0].scenario}
                </p>
                <div className="text-sm font-bold text-white mb-2">
                  {activeModule.clinicalVignettes[0].question}
                </div>
                <div className="p-3 rounded-lg bg-sky-900/50 border border-sky-700/60 text-xs text-sky-300 font-medium">
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
              <BookOpen size={18} className="text-sky-400" /> MED-301 Curriculum Units
            </h3>

            <div className="flex flex-col gap-2.5">
              {MEDICINE_ADV_CORE_MODULES.map((mod) => {
                const isSelected = selectedModuleId === mod.id;
                return (
                  <button
                    key={mod.id}
                    onClick={() => {
                      setSelectedModuleId(mod.id);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all duration-200 ${
                      isSelected
                        ? "bg-sky-950/70 border-sky-500 shadow-md shadow-sky-500/10"
                        : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] font-bold text-sky-400 tracking-wider">
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
          <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-950/60 to-blue-950/60 border border-sky-800/40">
            <h4 className="text-sm font-bold text-sky-300 mb-2 flex items-center gap-2">
              <Zap size={16} /> Clinical Medicine Rules
            </h4>
            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
              <li>RV Infarction: <strong>ST elevation in V4R; AVOID nitrates, morphine, diuretics; give IV fluids!</strong></li>
              <li>HFrEF GDMT: <strong>36-hour washout when switching from ACEi to ARNI (prevents angioedema)</strong>.</li>
              <li>Delta-Delta &gt; 2.0: <strong>Mixed HAGMA + Metabolic Alkalosis (e.g., DKA + vomiting)</strong>.</li>
              <li>Muddy Brown Casts: <strong>Pathognomonic for Acute Tubular Necrosis (ATN) with FeNa &gt; 2%</strong>.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
