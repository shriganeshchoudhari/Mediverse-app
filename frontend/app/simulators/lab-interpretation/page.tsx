import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  Activity,
  FlaskConical,
  Microscope,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Info,
  Droplet,
  Layers,
} from 'lucide-react';
import ClinicalLabInterpretationSimulator from '@/components/simulators/ClinicalLabInterpretationSimulator';

export const metadata: Metadata = {
  title: 'Clinical Diagnostic Laboratory & Blood Gas (ABG/VBG) Solver | Mediverse',
  description: 'Enterprise multi-disorder acid-base, anemia differentiation, electrolyte osmolar gap, and coagulation cascade interpretation workstation.',
};

export default function ClinicalLabInterpretationPage() {
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
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              INTERNAL MEDICINE & CRITICAL CARE
            </span>
            <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
              USMLE / NMC CBME STANDARDS
            </span>
          </div>
        </div>

        {/* Main Simulator Component */}
        <ClinicalLabInterpretationSimulator />

        {/* Board Review Clinical Reference Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* Card 1: Acid-Base & Compensation Formulas */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-emerald-400">
              <Activity className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Acid-Base &amp; Compensation
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <span className="font-semibold text-emerald-300 block mb-0.5">Winter's Formula (Metabolic Acidosis)</span>
                Expected PaCO2 = 1.5 × [HCO3-] + 8 ± 2. If measured PaCO2 &gt; expected, concurrent respiratory acidosis exists; if &lt; expected, concurrent respiratory alkalosis.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <span className="font-semibold text-emerald-300 block mb-0.5">Albumin-Corrected Anion Gap</span>
                AG_corr = [Na+] - ([Cl-] + [HCO3-]) + 2.5 × (4.0 - Albumin). For every 1 g/dL drop in serum albumin below 4.0, normal AG decreases by 2.5 mEq/L.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <span className="font-semibold text-emerald-300 block mb-0.5">Delta-Delta Ratio (ΔAG / ΔHCO3-)</span>
                Ratio &lt; 0.4: mixed NAGMA; 0.4–0.8: combined HAGMA + NAGMA; 1.0–2.0: pure HAGMA; &gt; 2.0: concurrent metabolic alkalosis (e.g. vomiting).
              </li>
            </ul>
          </div>

          {/* Card 2: CBC & Anemia Morphologic Pathways */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-blue-400">
              <Microscope className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Anemia &amp; Smear Pathways
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <span className="font-semibold text-blue-300 block mb-0.5">Mentzer Index (MCV / RBC)</span>
                In microcytic anemia (MCV &lt; 80): Ratio &lt; 13 strongly suggests Thalassemia trait (high RBC count); Ratio &ge; 13 favors Iron Deficiency Anemia (low RBC count + elevated RDW).
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <span className="font-semibold text-blue-300 block mb-0.5">Reticulocyte Production Index (RPI)</span>
                RPI = Retic% × (Hct / Normal Hct) ÷ Maturation Factor. RPI &lt; 2.0 reflects hypoproliferative bone marrow failure; RPI &ge; 2.0 indicates acute hemolysis or blood loss response.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <span className="font-semibold text-blue-300 block mb-0.5">High-Yield Peripheral Smear Clues</span>
                Hypersegmented neutrophils: B12/Folate deficiency. Schistocytes / Helmet cells: TTP / HUS / DIC. Target cells: Hemoglobinopathies / Liver disease. Spherocytes: AIHA / Hereditary spherocytosis.
              </li>
            </ul>
          </div>

          {/* Card 3: Electrolyte & Coagulation Pearls */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-amber-400">
              <FlaskConical className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Electrolytes &amp; Hemostasis
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <span className="font-semibold text-amber-300 block mb-0.5">Hyperglycemic Sodium Correction (Katz)</span>
                Corrected Na = Measured Na + 0.016 × (Glucose - 100). Prevents misinterpreting dilutional pseudohyponatremia during diabetic ketoacidosis or hyperosmolar hyperglycemic state.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <span className="font-semibold text-amber-300 block mb-0.5">1:1 Mixing Study Diagnostic Pivot</span>
                Prolonged aPTT that corrects upon 1:1 mixing with normal plasma indicates Clotting Factor Deficiency (Factor VIII, IX, XI). Failure to correct indicates Circulating Inhibitor (Lupus Anticoagulant).
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <span className="font-semibold text-amber-300 block mb-0.5">BUN/Creatinine Ratio in AKI</span>
                BUN/Cr &gt; 20:1 with elevated creatinine indicates Pre-renal azotemia (dehydration, CHF) or upper GI bleeding. BUN/Cr &lt; 15:1 indicates Intrinsic Acute Tubular Necrosis.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
