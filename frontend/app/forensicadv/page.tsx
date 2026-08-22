"use client";

import React, { useState } from "react";
import ClinicalForensicLabViewer from "../../components/forensicadv/ClinicalForensicLabViewer";
import {
  FORENSIC_ADV_CORE_MODULES,
  getForensicAdvModuleById,
} from "../../lib/curriculum/content/forensicadv";
import Link from "next/link";
import MarkdownRenderer from "../../components/common/MarkdownRenderer";
import {
  Sparkles,
  BookOpen,
  Activity,
  Flame,
  Shield,
  Zap,
  Crosshair,
} from "lucide-react";

export default function ClinicalForensicLabPage() {
  const [selectedModuleId, setSelectedModuleId] = useState<string>("forensic-adv-thanatology-pmi");

  const activeModule = getForensicAdvModuleById(selectedModuleId) || FORENSIC_ADV_CORE_MODULES[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Top Hero Banner */}
      <div className="border-b border-indigo-950/80 bg-gradient-to-r from-slate-950 via-indigo-950/60 to-slate-950 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles size={14} /> Virtual Clinical Forensic Pathology &amp; Legal Toxicology Laboratory
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              🔬 Clinical Forensic Pathology &amp; Legal Toxicology (FOR-301)
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
              Thanatology &amp; Postmortem Interval Estimation (Algor mortis cooling rate and Henssge nomogram, Rigor mortis ATP depletion and Nysten law, Livor mortis hypostasis fixation and color signatures in carbon monoxide, cyanide, and methemoglobinemia, putrefactive decomposition with right iliac fossa greening, marbling, and Casper ratio 1:2:8), Forensic Ballistics &amp; Gunshot Wounds (Hard contact cranial stellate gas tearing vs close range flame singeing and washable soot vs intermediate range unwashed dermal powder tattooing/stippling vs distant range abrasion collar and bullet wipe, entrance internal beveling vs exit external beveling), Mechanical Asphyxia Traumatology (Ante-mortem suspension hanging oblique non-continuous mark with salivary dribbling vs ligature strangulation horizontal continuous mark with Tardieu petechiae vs manual strangulation throttling with crescentic fingernail scratches and hyoid bone fractures, aquatic drowning mushroom of foam and closed marrow diatoms), and Medicolegal Autopsy Toxicology (Carbon monoxide cherry-red lividity and globus pallidus necrosis, cyanide cytochrome c oxidase inhibition with bright pink lividity, bitter almond scent, and hydroxocobalamin antidote, arsenic Aldrich-Mees lines, and organophosphate irreversible cholinesterase inhibition).
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
          <ClinicalForensicLabViewer height="560px" />

          {/* Module Text Reader Card */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  NMC CBME Competency: {activeModule.unitCode}
                </span>
                <h2 className="text-xl font-bold text-white mt-0.5">{activeModule.title}</h2>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-semibold">
                ⏱️ {activeModule.estimatedMinutes} min
              </span>
            </div>

            {/* Markdown Text Excerpt */}
            <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800/80 max-h-96 overflow-y-auto">
              <MarkdownRenderer content={activeModule.markdownContent} />
            </div>

            {/* Clinical Vignette Card */}
            {activeModule.clinicalVignettes.length > 0 && (
              <div className="mt-6 p-5 rounded-xl bg-indigo-950/40 border border-indigo-800/60">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <Crosshair size={16} /> Forensic Pathology Case Vignette
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
              <BookOpen size={18} className="text-indigo-400" /> FOR-301 Curriculum Units
            </h3>

            <div className="flex flex-col gap-2.5">
              {FORENSIC_ADV_CORE_MODULES.map((mod) => {
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
              <Zap size={16} /> Medicolegal Rules
            </h4>
            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
              <li>Cherry-Red Lividity: <strong>Carbon Monoxide (COHb) and Cyanide (Complex IV)</strong>.</li>
              <li>Intermediate GSW: <strong>Gunpowder tattooing (stippling) embedded in dermis (cannot wash off)</strong>.</li>
              <li>Ante-Mortem Hanging: <strong>Oblique mark above thyroid + salivary dribbling opposite knot</strong>.</li>
              <li>Drowning Marrow Test: <strong>Presence of diatoms in closed femoral marrow confirms ante-mortem submersion</strong>.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
