"use client";

import React, { useState } from "react";
import ClinicalBiochemistry2LabViewer from "../../components/biochemistry2/ClinicalBiochemistry2LabViewer";
import {
  BIOCHEMISTRY2_CORE_MODULES,
  getBiochemistry2ModuleById,
} from "../../lib/curriculum/content/biochemistry2";
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
  Dna,
} from "lucide-react";

export default function ClinicalBiochemistry2LabPage() {
  const [selectedModuleId, setSelectedModuleId] = useState<string>("biochemistry2-dna-replication-repair-telomerase");

  const activeModule = getBiochemistry2ModuleById(selectedModuleId) || BIOCHEMISTRY2_CORE_MODULES[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Top Hero Banner */}
      <div className="border-b border-purple-950/80 bg-gradient-to-r from-slate-950 via-purple-950/60 to-slate-950 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles size={14} /> Virtual Clinical Medical Biochemistry II Laboratory
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              🧬 Medical Biochemistry II &amp; Molecular Genetics (BIOC-102)
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
              DNA Replication &amp; Repair Mechanisms (Nucleotide Excision Repair NER endonucleases in Xeroderma Pigmentosum vs Mismatch Repair MMR in Lynch Syndrome with microsatellite instability MSI-H vs Homologous Recombination BRCA1/2 with PARP inhibitor Olaparib synthetic lethality vs Base Excision Repair BER glycosylases), Transcription &amp; Post-Transcriptional Splicing (RNA Polymerase II inhibition by death cap mushroom alpha-Amanitin, Histone Acetylation HATs euchromatin activation vs Vorinostat HDAC inhibition, 5&apos; m7G cap, 3&apos; polyadenylation, and Spliceosome snRNPs targeted by Anti-Smith antibodies in SLE and Anti-U1 RNP in MCTD), Translation &amp; Proteolysis (Genetic code degeneracy and wobble hypothesis, AUG start codon, Diphtheria and Pseudomonas exotoxin A eEF-2 ADP-ribosylation, Heat shock chaperones HSP70/90, Ubiquitin-Proteasome system targeted by Bortezomib in multiple myeloma, and Prion alpha-helix to beta-sheet conformational conversion in CJD), and Molecular Diagnostics &amp; CRISPR (PCR thermal cycling kinetics, SNOW DROP blotting matrix, Sanger sequencing chain-terminating ddNTPs vs NGS, and CRISPR-Cas9 sgRNA PAM sequence gene editing in Casgevy for sickle cell disease).
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
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white text-sm font-bold shadow-lg shadow-purple-500/20 transition"
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
          <ClinicalBiochemistry2LabViewer height="560px" />

          {/* Module Text Reader Card */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                  NMC CBME Competency: {activeModule.unitCode}
                </span>
                <h2 className="text-xl font-bold text-white mt-0.5">{activeModule.title}</h2>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-semibold">
                ⏱️ {activeModule.estimatedMinutes} min
              </span>
            </div>

            {/* Markdown Text Excerpt */}
            <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800/80 max-h-96 overflow-y-auto">
              <MarkdownRenderer content={activeModule.markdownContent} />
            </div>

            {/* Clinical Vignette Card */}
            {activeModule.clinicalVignettes.length > 0 && (
              <div className="mt-6 p-5 rounded-xl bg-purple-950/40 border border-purple-800/60">
                <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <ShieldAlert size={16} /> Molecular Biochemistry Case Vignette
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium mb-3">
                  {activeModule.clinicalVignettes[0].scenario}
                </p>
                <div className="text-sm font-bold text-white mb-2">
                  {activeModule.clinicalVignettes[0].question}
                </div>
                <div className="p-3 rounded-lg bg-purple-900/50 border border-purple-700/60 text-xs text-purple-300 font-medium">
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
              <BookOpen size={18} className="text-purple-400" /> BIOC-102 Curriculum Units
            </h3>

            <div className="flex flex-col gap-2.5">
              {BIOCHEMISTRY2_CORE_MODULES.map((mod) => {
                const isSelected = selectedModuleId === mod.id;
                return (
                  <button
                    key={mod.id}
                    onClick={() => {
                      setSelectedModuleId(mod.id);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all duration-200 ${
                      isSelected
                        ? "bg-purple-950/70 border-purple-500 shadow-md shadow-purple-500/10"
                        : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] font-bold text-purple-400 tracking-wider">
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
          <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/60 to-indigo-950/60 border border-purple-800/40">
            <h4 className="text-sm font-bold text-purple-300 mb-2 flex items-center gap-2">
              <Zap size={16} /> Molecular Biochemistry Rules
            </h4>
            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
              <li>Xeroderma Pigmentosum: <strong>Defective NER endonucleases (G1 phase) &rarr; pyrimidine dimer accumulation</strong>.</li>
              <li>Lynch Syndrome: <strong>Defective MMR (MSH2/MLH1) &rarr; microsatellite instability (MSI-H)</strong>.</li>
              <li>Diphtheria Toxin: <strong>ADP-ribosylates eEF-2 &rarr; halts translation and protein synthesis</strong>.</li>
              <li>CRISPR-Cas9: <strong>sgRNA + 5&apos;-NGG-3&apos; PAM motif &rarr; targeted double-strand break</strong>.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
