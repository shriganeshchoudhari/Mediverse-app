"use client";

import React, { useState } from "react";
import ClinicalInt2LabViewer from "../../components/int2/ClinicalInt2LabViewer";
import {
  INT2_CORE_MODULES,
  getInt2ModuleById,
} from "../../lib/curriculum/content/int2";
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
  Stethoscope,
} from "lucide-react";

export default function ClinicalInt2LabPage() {
  const [selectedModuleId, setSelectedModuleId] = useState<string>("int2-vascular-access-arterial-line");

  const activeModule = getInt2ModuleById(selectedModuleId) || INT2_CORE_MODULES[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Top Hero Banner */}
      <div className="border-b border-cyan-950/80 bg-gradient-to-r from-slate-950 via-cyan-950/60 to-slate-950 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles size={14} /> Virtual Procedural Skills &amp; POCUS Laboratory
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              🏥 Internship Core Clinical Postings: Procedural Skills &amp; POCUS (INT-502)
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
              Vascular Access &amp; Arterial Cannulation (Internal jugular CVC Seldinger technique with ultrasound venous compressibility, subclavian infraclavicular approach, NAVEL femoral landmarks, and radial arterial line insertion with modified Allen test), Diagnostic Paracentesis &amp; Thoracentesis (Left lower quadrant Z-track paracentesis, Spontaneous Bacterial Peritonitis ascitic PMN &ge;250/&mu;L, Serum-Ascites Albumin Gradient SAAG &ge;1.1 g/dL portal HTN, superior rib margin thoracentesis vector avoiding VAN, and Light's criteria exudate vs transudate), Lumbar Puncture &amp; CSF Differential Manometry (Tuffier's L4-L5 line, safe conus L1-L2 anatomy, ligamentum flavum 1st pop, dural 2nd pop, and bacterial vs viral vs fungal vs SAH xanthochromia CSF diagnostics), and Point-of-Care Ultrasound (Focused Cardiac Ultrasound FoCUS PLAX/PSAX/A4C/IVC collapsibility and Lung Ultrasound BLUE protocol A-lines, B-lines, and pneumothorax barcode sign).
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
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:opacity-95 text-white text-sm font-bold shadow-lg shadow-cyan-500/20 transition"
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
          <ClinicalInt2LabViewer height="560px" />

          {/* Module Text Reader Card */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  NMC CBME Competency: {activeModule.unitCode}
                </span>
                <h2 className="text-xl font-bold text-white mt-0.5">{activeModule.title}</h2>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold">
                ⏱️ {activeModule.estimatedMinutes} min
              </span>
            </div>

            {/* Markdown Text Excerpt */}
            <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800/80 max-h-96 overflow-y-auto">
              <MarkdownRenderer content={activeModule.markdownContent} />
            </div>

            {/* Clinical Vignette Card */}
            {activeModule.clinicalVignettes.length > 0 && (
              <div className="mt-6 p-5 rounded-xl bg-cyan-950/40 border border-cyan-800/60">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <ShieldAlert size={16} /> Procedural Skills &amp; POCUS Case Vignette
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium mb-3">
                  {activeModule.clinicalVignettes[0].scenario}
                </p>
                <div className="text-sm font-bold text-white mb-2">
                  {activeModule.clinicalVignettes[0].question}
                </div>
                <div className="p-3 rounded-lg bg-cyan-900/50 border border-cyan-700/60 text-xs text-cyan-300 font-medium">
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
              <BookOpen size={18} className="text-cyan-400" /> INT-502 Curriculum Units
            </h3>

            <div className="flex flex-col gap-2.5">
              {INT2_CORE_MODULES.map((mod) => {
                const isSelected = selectedModuleId === mod.id;
                return (
                  <button
                    key={mod.id}
                    onClick={() => {
                      setSelectedModuleId(mod.id);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all duration-200 ${
                      isSelected
                        ? "bg-cyan-950/70 border-cyan-500 shadow-md shadow-cyan-500/10"
                        : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] font-bold text-cyan-400 tracking-wider">
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
          <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/60 to-blue-950/60 border border-cyan-800/40">
            <h4 className="text-sm font-bold text-cyan-300 mb-2 flex items-center gap-2">
              <Zap size={16} /> Bedside Procedural Gold Standards
            </h4>
            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
              <li>IJV vs Carotid: <strong>Vein is compressible under gentle probe pressure and lateral</strong>.</li>
              <li>SBP Diagnostic Cutoff: <strong>Ascitic fluid PMN &ge;250/&mu;L &rarr; IV Ceftriaxone + Albumin</strong>.</li>
              <li>Thoracentesis Vector: <strong>Always insert needle OVER the superior border of the rib</strong>.</li>
              <li>Safe LP Level: <strong>L3-L4 or L4-L5 (Tuffier's line = L4; spinal cord ends at L1-L2)</strong>.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
