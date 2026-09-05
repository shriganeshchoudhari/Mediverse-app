import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  Droplets,
  Activity,
  ShieldAlert,
  Gauge,
  Layers,
  Beaker,
  Award,
} from 'lucide-react';
import CRRTSimulator from '@/components/simulators/CRRTSimulator';

export const metadata: Metadata = {
  title: 'Continuous Renal Replacement Therapy (CRRT) Workstation | Mediverse',
  description: 'Extracorporeal blood purification, SCUF, CVVH, CVVHD, CVVHDF, TMP hydraulics, KDIGO effluent dosing, and regional citrate anticoagulation (RCA).',
};

export default function CRRTPage() {
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
            <span className="px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold">
              NEPHROLOGY &amp; CRITICAL CARE ICU
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              KDIGO / ADQI CLINICAL CONSENSUS
            </span>
          </div>
        </div>

        {/* Main Simulator Component */}
        <CRRTSimulator />

        {/* Curriculum & High-Yield Board Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* Card 1: Modalities & Transport Physics */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-sky-400">
              <Layers className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                CRRT Transport Physics
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-sky-300 font-semibold block mb-0.5">
                  Diffusion (CVVHD) vs Convection (CVVH)
                </strong>
                Diffusion is governed by Fick&apos;s law across a concentration gradient (ideal for small solutes: urea, K+). Convection relies on bulk solvent drag driven by transmembrane pressure (removes middle molecules &gt;500 Da like beta-2 microglobulin and cytokines).
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-sky-300 font-semibold block mb-0.5">
                  Pre-Dilution vs Post-Dilution
                </strong>
                Post-dilution maximizes clearance per liter of fluid (C = Q_UF &times; Sc), but concentrates blood (FF &gt; 20-25%) increasing clotting. Pre-dilution lowers hematocrit and prolongs filter life, but dilutes solute concentration reducing clearance by Qp / (Qp + Qrep).
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-sky-300 font-semibold block mb-0.5">
                  KDIGO Effluent Dosing Target
                </strong>
                Delivered effluent dose should be 20 - 25 mL/kg/h. The landmark ATN and RENAL trials showed doses &gt;35 mL/kg/h provide zero survival benefit while accelerating antibiotic, amino acid, and phosphate depletion.
              </li>
            </ul>
          </div>

          {/* Card 2: Membrane Hydraulics & TMP */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-emerald-400">
              <Gauge className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Membrane Hydraulics &amp; Clotting
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-emerald-300 font-semibold block mb-0.5">
                  Transmembrane Pressure (TMP) Formula
                </strong>
                TMP = (Pin + Pout) / 2 - Peffluent. Normal TMP is 50 - 150 mmHg. An isolated climb in TMP reflects protein polarization layer (&quot;cake&quot;) on the membrane surface.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-emerald-300 font-semibold block mb-0.5">
                  Filter Pressure Drop (&Delta;P_filter)
                </strong>
                &Delta;P_filter = Pin - Pout. Normal is 20 - 70 mmHg. A steep climb in &Delta;P_filter &gt; 120-150 mmHg signals true hollow-fiber thrombosis within the blood pathway.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-emerald-300 font-semibold block mb-0.5">
                  Catheter Access Insufficiency
                </strong>
                Excessively negative access pressure (&lt; -200 to -250 mmHg) indicates catheter suction against vessel wall, intraluminal fibrin clot, or patient hypovolemia.
              </li>
            </ul>
          </div>

          {/* Card 3: Regional Citrate Anticoagulation */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-violet-400">
              <Beaker className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Regional Citrate &amp; Citrate Lock
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-violet-300 font-semibold block mb-0.5">
                  KDIGO Recommended 1st Line Anticoagulation
                </strong>
                Citrate chelates calcium in the filter circuit, dropping circuit iCa &lt; 0.35 mmol/L to block clotting cascade. Calcium is re-infused post-filter to normalize systemic iCa (1.1 - 1.3 mmol/L).
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-violet-300 font-semibold block mb-0.5">
                  Citrate Accumulation (&quot;Citrate Lock&quot;)
                </strong>
                Occurs in severe liver failure or mitochondrial hypoperfusion (Krebs cycle shut-off). Citrate cannot be metabolized into bicarbonate. Total serum calcium climbs while ionized calcium paradoxically falls.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-violet-300 font-semibold block mb-0.5">
                  Diagnostic Ratio: Total Ca / iCa &ge; 2.5
                </strong>
                A ratio &ge; 2.5 (in mmol/L) with widening anion gap metabolic acidosis confirms Citrate Lock. Stop citrate immediately, administer IV calcium, and switch to heparin or flush-only CRRT.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
