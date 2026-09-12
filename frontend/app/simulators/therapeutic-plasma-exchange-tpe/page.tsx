import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  Droplets,
  ShieldAlert,
  Activity,
  Heart,
  FileCheck,
  Stethoscope,
  Award,
  Zap,
  Layers,
  Sparkles,
} from 'lucide-react';
import TherapeuticPlasmaExchangeSimulator from '@/components/simulators/TherapeuticPlasmaExchangeSimulator';

export const metadata: Metadata = {
  title: 'Therapeutic Plasma Exchange (TPE) Workstation | Mediverse',
  description:
    'American Society for Apheresis (ASFA 2023) Guidelines: Plasma Volume Kinetics, First-Order Solute Removal, 5% Albumin vs FFP Replacement, ACD-A Citrate & Calcium Titration.',
};

export default function TherapeuticPlasmaExchangePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Bar & Header Badges */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/simulators"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Clinical Simulators
          </Link>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5" />
              HEMATOLOGY &amp; APHERESIS MEDICINE
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              ASFA 2023 9th EDITION GUIDELINES
            </span>
            <span className="px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              CRITICAL CARE NEPHROLOGY
            </span>
          </div>
        </div>

        {/* Main Interactive Simulator Component */}
        <TherapeuticPlasmaExchangeSimulator />

        {/* High-Yield Clinical Reference Curriculum Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {/* Card 1: PV & Solute Clearance */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-indigo-400">
              <Layers className="w-4 h-4" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                Plasma Volume &amp; Kinetics
              </h2>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <li className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-indigo-300 block mb-0.5">PV Calculation:</strong>
                <div className="font-mono text-[11px] text-indigo-300 mb-1">
                  PV (mL) = Weight (kg) &times; 70 &times; (1 - Hct)
                </div>
                Example: 70 kg with 40% Hct has an estimated PV of 2940 mL.
              </li>
              <li className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-indigo-300 block mb-0.5">First-Order Exponential Washout:</strong>
                <div className="font-mono text-[11px] text-indigo-300 mb-1">
                  C(Ve) / C0 = e^(-Ve / PV)
                </div>
                1.0 PV exchange clears 63.2% of intravascular solute; 1.5 PV clears 77.7%; 2.0 PV clears 86.5%.
              </li>
              <li className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-indigo-300 block mb-0.5">Extravascular Re-equilibration:</strong>
                IgG has an intravascular fraction of ~45%; extravascular autoantibodies re-equilibrate over 24-48 hours.
              </li>
            </ul>
          </div>

          {/* Card 2: Replacement Fluids */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-sky-400">
              <Droplets className="w-4 h-4" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                Replacement Fluids &amp; Coagulation
              </h2>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <li className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-sky-300 block mb-0.5">5% Human Albumin:</strong>
                Preferred for neuro/renal diseases. Carries zero viral risk and minimal allergic reactions.
              </li>
              <li className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-sky-300 block mb-0.5">Dilutional Coagulopathy:</strong>
                Albumin contains no clotting factors. A 1.0 PV exchange drops fibrinogen by ~60-70% (target &ge; 100 mg/dL).
              </li>
              <li className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-sky-300 block mb-0.5">Fresh Frozen Plasma (FFP):</strong>
                Mandatory for TTP to replenish ADAMTS13 metalloprotease; requires ABO compatibility verification.
              </li>
            </ul>
          </div>

          {/* Card 3: Citrate & Calcium */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-400">
              <Zap className="w-4 h-4" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                ACD-A Citrate &amp; Hypocalcemia
              </h2>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <li className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-amber-300 block mb-0.5">Circuit Anticoagulation:</strong>
                ACD-A is infused at a 10:1 to 14:1 blood ratio, chelating calcium to prevent extracorporeal filter clotting.
              </li>
              <li className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-amber-300 block mb-0.5">Hypocalcemia Symptoms:</strong>
                Perioral paresthesias, fingertip tingling, carpopedal spasm, and prolonged QTc occur when iCa &lt; 1.05 mmol/L.
              </li>
              <li className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-amber-300 block mb-0.5">&quot;Citrate Lock&quot; Detection:</strong>
                <div className="font-mono text-[11px] text-amber-300 mb-1">
                  Total Calcium (mmol/L) / Ionized Calcium (mmol/L) &gt; 2.5
                </div>
                Indicates impaired hepatic metabolism of citrate; requires widening the ACD-A ratio.
              </li>
            </ul>
          </div>

          {/* Card 4: ASFA Categories */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400">
              <Award className="w-4 h-4" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                ASFA 2023 Categorization
              </h2>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <li className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-emerald-300 block mb-0.5">Category I (First-Line):</strong>
                TTP, Guillain-Barré Syndrome, Myasthenia Gravis crisis, Anti-GBM (Goodpasture), and chronic inflammatory demyelinating polyneuropathy (CIDP).
              </li>
              <li className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-emerald-300 block mb-0.5">Category II (Second-Line / Adjunct):</strong>
                NMOSD (anti-AQP4), severe steroid-refractory MS attacks, Lambert-Eaton syndrome, and Catastrophic Antiphospholipid Syndrome (CAPS).
              </li>
              <li className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-emerald-300 block mb-0.5">Category IV (Contraindicated):</strong>
                Disorders where TPE is ineffective or harmful (e.g., active ITP without hemorrhage, DIC with consumption).
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
