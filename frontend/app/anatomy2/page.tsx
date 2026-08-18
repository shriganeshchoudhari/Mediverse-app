"use client";

import React, { useState } from "react";
import ClinicalAnatomy2LabViewer from "../../components/anatomy2/ClinicalAnatomy2LabViewer";
import {
  ANATOMY2_CORE_MODULES,
  getAnatomy2ModuleById,
} from "../../lib/curriculum/content/anatomy2";
import Link from "next/link";
import {
  Sparkles,
  BookOpen,
  Activity,
  Flame,
  Shield,
  Zap,
  ShieldAlert,
} from "lucide-react";

export default function ClinicalAnatomy2LabPage() {
  const [selectedModuleId, setSelectedModuleId] = useState<string>("anatomy2-cranial-nerves-brainstem-syndromes");

  const activeModule = getAnatomy2ModuleById(selectedModuleId) || ANATOMY2_CORE_MODULES[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Top Hero Banner */}
      <div className="border-b border-sky-950/80 bg-gradient-to-r from-slate-950 via-sky-950/60 to-slate-950 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles size={14} /> Virtual Clinical Human Anatomy II Laboratory
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              🏛️ Human Anatomy II: Head, Neck, Neuroanatomy &amp; Embryology (ANAT-102)
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
              Cranial Nerves &amp; Brainstem Stroke Syndromes (Lateral Medullary Wallenberg PICA occlusion with nucleus ambiguus dysphagia/hoarseness and Horner syndrome vs Medial Medullary Dejerine ASA occlusion with ipsilateral tongue deviation and hemiplegia vs Weber PCA midbrain syndrome), Deep Cervical Fascia &amp; Spaces (Retropharyngeal danger space extending from skull base to T1-T4 posterior mediastinitis, Ludwig angina bilateral submandibular cellulitis with massive tongue elevation, Pterygopalatine fossa gateways, and Carotid sheath Lemierre thrombophlebitis), Orbit &amp; Cavernous Sinus (Cavernous sinus thrombosis with early CN VI abducens paralysis, lateral wall CN III/IV/V1/V2 compression, facial danger triangle valveless ophthalmic venous spread, and Middle ear ossicles/tegmen tympani), and Clinical Embryology (Pharyngeal arches 1-6, pouches 1-4, DiGeorge syndrome 22q11.2 deletion athymia and hypocalcemia, midline thyroglossal duct cysts moving with tongue protrusion vs lateral branchial cleft cysts).
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
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-sky-600 to-cyan-600 hover:opacity-95 text-white text-sm font-bold shadow-lg shadow-sky-500/20 transition"
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
          <ClinicalAnatomy2LabViewer height="560px" />

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
                  <ShieldAlert size={16} /> Anatomy Case Vignette
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
              <BookOpen size={18} className="text-sky-400" /> ANAT-102 Curriculum Units
            </h3>

            <div className="flex flex-col gap-2.5">
              {ANATOMY2_CORE_MODULES.map((mod) => {
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
          <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-950/60 to-cyan-950/60 border border-sky-800/40">
            <h4 className="text-sm font-bold text-sky-300 mb-2 flex items-center gap-2">
              <Zap size={16} /> Clinical Anatomy Rules
            </h4>
            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
              <li>Wallenberg (PICA): <strong>Nucleus ambiguus (CN IX/X) &rarr; dysphagia, hoarseness, loss of gag</strong>.</li>
              <li>Danger Space: <strong>Between alar and prevertebral fascia &rarr; descends to posterior mediastinum</strong>.</li>
              <li>Cavernous Sinus: <strong>CN VI (Abducens) is free in lumen &rarr; earliest paralyzed in CST</strong>.</li>
              <li>DiGeorge 22q11.2: <strong>3rd/4th pouches fail &rarr; absent thymus (T-cells) and parathyroids (tetany)</strong>.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
