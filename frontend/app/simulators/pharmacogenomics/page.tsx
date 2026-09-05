import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  Dna,
  Pill,
  ShieldAlert,
  Activity,
  Award,
  BookOpen,
} from 'lucide-react';
import PharmacogenomicsSimulator from '@/components/simulators/PharmacogenomicsSimulator';

export const metadata: Metadata = {
  title: 'Clinical Pharmacogenomics (PGx) & Precision Therapeutics Workstation | Mediverse',
  description: 'CPIC Level 1A gene-drug interaction clinical decision support (CDS), star allele diplotype calling, IWPC precision warfarin algorithm, and 14-day INR kinetics.',
};

export default function PharmacogenomicsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/simulators"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Clinical Simulators
          </Link>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
              PHARMACOGENOMICS &amp; PRECISION MEDICINE
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              CPIC / DPWG LEVEL 1A GUIDELINES
            </span>
          </div>
        </div>

        {/* Main Simulator Component */}
        <PharmacogenomicsSimulator />

        {/* Curriculum & High-Yield Board Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* Card 1: CPIC Level 1A High-Risk Gene-Drug Pairs */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-indigo-400">
              <ShieldAlert className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                CPIC Level 1A High-Risk Pairs
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-indigo-300 font-semibold block mb-0.5">
                  CYP2C19 &amp; Clopidogrel (Plavix)
                </strong>
                Loss-of-function alleles (*2, *3) fail to generate active thiol metabolite. High on-treatment platelet reactivity triggers subacute stent thrombosis post-PCI. Switch to Prasugrel or Ticagrelor.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-indigo-300 font-semibold block mb-0.5">
                  CYP2D6 &amp; Codeine / Tramadol
                </strong>
                Ultrarapid metabolizers (*1xN duplications) hyper-convert codeine to toxic morphine concentrations, causing lethal respiratory arrest. Poor metabolizers (*4/*4) experience analgesia failure.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-indigo-300 font-semibold block mb-0.5">
                  TPMT / NUDT15 &amp; Thiopurines (6-MP, Azathioprine)
                </strong>
                Homozygous deficiency (*3A/*3A) causes cytotoxic 6-TGN accumulation and fatal pancytopenia; requires a 90% dose reduction (10% standard dose).
              </li>
            </ul>
          </div>

          {/* Card 2: Oncology PGx & Star Allele Activity Scores */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-emerald-400">
              <Dna className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Activity Score (AS) Framework
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-emerald-300 font-semibold block mb-0.5">
                  DPYD &amp; Fluoropyrimidines (5-FU, Capecitabine)
                </strong>
                DPYD *2A (exon 14 skipping) and *13 cause severe DPD deficiency. AS = 0 is contraindicated; AS = 1.0–1.5 requires 50% dose reduction to prevent lethal enteritis and agranulocytosis.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-emerald-300 font-semibold block mb-0.5">
                  CYP2D6 Activity Score Calling
                </strong>
                *1, *2 = 1.0 (normal); *10 = 0.25, *41 = 0.5 (reduced); *4, *5 = 0.0 (null); *1xN = 2.0+ (duplication). AS 0 = PM, 0.25–1.0 = IM, 1.25–2.25 = NM, &gt;2.25 = UM.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-emerald-300 font-semibold block mb-0.5">
                  SLCO1B1 &amp; Statin Myopathy
                </strong>
                SLCO1B1 *5 (c.521T&gt;C) impairs hepatic OATP1B1 uptake, raising systemic simvastatin levels with a &gt;16-fold odds ratio of rhabdomyolysis. Switch to Rosuvastatin or Pravastatin.
              </li>
            </ul>
          </div>

          {/* Card 3: Warfarin IWPC & Immune Hypersensitivity */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-amber-400">
              <Activity className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                IWPC Dosing &amp; HLA Hypersensitivity
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-amber-300 font-semibold block mb-0.5">
                  IWPC Warfarin Regression Model
                </strong>
                Accounts for VKORC1 (-1639G&gt;A, target expression), CYP2C9 (*2, *3, S-warfarin clearance), age, height, weight, and amiodarone. Reduces INR &gt; 5 overshoot by 68% during induction.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-amber-300 font-semibold block mb-0.5">
                  HLA-B*57:01 &amp; Abacavir Hypersensitivity
                </strong>
                Abacavir binds the antigen-binding cleft of HLA-B*57:01, altering self-peptide presentation. Triggers multi-organ CD8+ T-cell attack. Screening is 100% mandatory prior to initiation.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-amber-300 font-semibold block mb-0.5">
                  HLA-B*15:02 &amp; Carbamazepine SJS/TEN
                </strong>
                Predominant in Southeast Asian descent. Severe risk of Stevens-Johnson syndrome and toxic epidermal necrolysis. Genotyping required prior to initiating carbamazepine.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
