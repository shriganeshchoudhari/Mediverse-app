"use client";

import React, { useState } from "react";
import ClinicalInt3LabViewer from "../../components/int3/ClinicalInt3LabViewer";
import {
  INT3_CORE_MODULES,
  getInt3ModuleById,
} from "../../lib/curriculum/content/int3";
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
  Baby,
} from "lucide-react";

export default function ClinicalInt3LabPage() {
  const [selectedModuleId, setSelectedModuleId] = useState<string>("int3-postpartum-hemorrhage-eclampsia");

  const activeModule = getInt3ModuleById(selectedModuleId) || INT3_CORE_MODULES[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Top Hero Banner */}
      <div className="border-b border-rose-950/80 bg-gradient-to-r from-slate-950 via-rose-950/60 to-slate-950 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles size={14} /> Virtual Maternal, Neonatal &amp; Pediatric Emergencies Laboratory
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              🏥 Internship Core Clinical Postings: Maternal, Neonatal &amp; Pediatric Emergencies (INT-503)
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
              Obstetric Emergencies (Postpartum Hemorrhage 4 Ts with uterine atony bimanual massage, uterotonic pharmacological escalation with Oxytocin, Methylergonovine hypertension ban, Carboprost asthma contraindication, Misoprostol, and Tranexamic Acid TXA 1 g IV within 3 hours, and Severe Preeclampsia / Eclampsia Magnesium Sulfate seizure protocol with Calcium Gluconate toxicity antidote), Neonatal Resuscitation Program (NRP 2025 Golden Minute, 40-60 bpm Positive Pressure Ventilation with pre-ductal SpO2, MR SOPA corrective steps, 3:1 two-thumb chest compressions with 100% O2, and umbilical venous Epinephrine), Pediatric Advanced Life Support (PALS 2025 symptomatic bradycardia HR &lt;60 CPR threshold, shockable defibrillation 2 J/kg &rarr; 4 J/kg energy dosing, and 20 mL/kg isotonic fluid bolus resuscitation), and Pediatric Status Epilepticus &amp; Airway Obstruction (American Epilepsy Society 4-phase algorithm with 0-5 min D10W, 5-10 min Lorazepam IV / IM Midazolam, 10-20 min Levetiracetam / Fosphenytoin, Croup subglottic steeple sign dexamethasone/epinephrine, and Epiglottitis drooling tripod no-agitation OR intubation).
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
          <ClinicalInt3LabViewer height="560px" />

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
                  <ShieldAlert size={16} /> Maternal, Neonatal &amp; Pediatric Emergency Vignette
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
              <BookOpen size={18} className="text-rose-400" /> INT-503 Curriculum Units
            </h3>

            <div className="flex flex-col gap-2.5">
              {INT3_CORE_MODULES.map((mod) => {
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
              <Zap size={16} /> Maternal &amp; Pediatric Resuscitation Rules
            </h4>
            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
              <li>PPH Contraindications: <strong>Carboprost BANNED in asthma; Methergine BANNED in HTN</strong>.</li>
              <li>NRP Golden Minute: <strong>Start PPV at 40-60 bpm if HR &lt;100 bpm or apneic at 30s</strong>.</li>
              <li>PALS Bradycardia: <strong>Start CPR if HR &lt;60 bpm persists despite oxygenation/ventilation</strong>.</li>
              <li>Epiglottitis Rule: <strong>DO NOT AGITATE; NO TONGUE BLADE &rarr; emergent OR intubation</strong>.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
