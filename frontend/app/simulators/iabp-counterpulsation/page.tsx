import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  Heart,
  Activity,
  Layers,
  ShieldAlert,
  AlertTriangle,
} from 'lucide-react';
import IABPCounterpulsationSimulator from '@/components/simulators/IABPCounterpulsationSimulator';

export const metadata: Metadata = {
  title: 'Intra-Aortic Balloon Pump (IABP) Counterpulsation Workstation | Mediverse',
  description:
    'Interactive mechanical circulatory support simulator: diastolic augmentation, coronary perfusion, afterload reduction, dicrotic notch timing errors, and arterial line waveform analysis.',
};

export default function IABPCounterpulsationPage() {
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
            <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold">
              CARDIAC SURGERY &amp; CATH LAB
            </span>
            <span className="px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold">
              MECHANICAL COUNTERPULSATION
            </span>
          </div>
        </div>

        {/* Main Simulator Component */}
        <IABPCounterpulsationSimulator />

        {/* Curriculum & High-Yield Board Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* Card 1: Counterpulsation Hemodynamics */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-rose-400">
              <Layers className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Counterpulsation Hemodynamics
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-rose-300 font-semibold block mb-0.5">
                  Diastolic Balloon Augmentation (MVO2 Supply)
                </strong>
                Inflation occurs immediately at the dicrotic notch upon aortic valve closure. Helium displacement shifts 40-50 cc of blood retrogradely into the coronary ostia and carotid arteries, surging coronary perfusion by +30% to +50%.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-rose-300 font-semibold block mb-0.5">
                  Presystolic Deflation Vacuum (MVO2 Demand)
                </strong>
                Rapid helium evacuation immediately prior to ventricular systole creates a transient low-pressure sinkhole in the ascending aorta. Balloon end-diastolic pressure (BAEDP) drops 10-15 mmHg below native PAEDP.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-rose-300 font-semibold block mb-0.5">
                  Left Ventricular Afterload Reduction
                </strong>
                Because the LV ejects against the lower BAEDP, peak assisted systolic pressure (APSP) drops by 10-15%. Isovolumetric contraction time and LV stroke work are reduced, substantially decreasing myocardial oxygen consumption.
              </li>
            </ul>
          </div>

          {/* Card 2: The 4 Classic Timing Errors */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                The 4 Waveform Timing Errors
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-rose-400 font-semibold block mb-0.5">
                  1. Early Inflation (Lethal Error)
                </strong>
                Inflation occurs before the dicrotic notch while the aortic valve is still open. Results in premature valve closure, an acute spike in LV wall stress, reduced stroke volume, and worsened ischemia.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-amber-300 font-semibold block mb-0.5">
                  2. Late Inflation (Suboptimal)
                </strong>
                Inflation begins well after the dicrotic notch (visible U-shaped notch). Diastolic augmentation (PDP) is delayed and blunted, compromising coronary collateral perfusion.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-amber-300 font-semibold block mb-0.5">
                  3. Early Deflation (Loss of Reduction)
                </strong>
                Balloon deflates prematurely in mid-diastole. Aortic pressure rebounds back to baseline PAEDP before systole, terminating coronary augmentation early and forfeiting LV afterload reduction.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-rose-400 font-semibold block mb-0.5">
                  4. Late Deflation (Afterload Penalty)
                </strong>
                Balloon remains inflated during isovolumetric contraction. The LV is forced to eject against an occluded aorta, driving APSP above native PSP and increasing myocardial work.
              </li>
            </ul>
          </div>

          {/* Card 3: Indications, Contraindications & Weaning */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-sky-400">
              <ShieldAlert className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Clinical Indications &amp; Contraindications
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-sky-300 font-semibold block mb-0.5">
                  Primary Indications
                </strong>
                Cardiogenic shock post-acute myocardial infarction, acute mitral regurgitation secondary to papillary muscle rupture, post-infarction ventricular septal rupture (VSR), refractory angina, and weaning failure from CPB.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-rose-400 font-semibold block mb-0.5">
                  Absolute Contraindications
                </strong>
                Moderate-to-severe Aortic Regurgitation (retrograde diastolic augmentation drives blood back into the LV, triggering catastrophic acute volume overload) and Thoracic / Abdominal Aortic Dissection.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-sky-300 font-semibold block mb-0.5">
                  Stepwise Weaning Protocol
                </strong>
                Weaning is performed by frequency decrements: 1:1 &rarr; 1:2 &rarr; 1:3 over 4 - 24 hours. A patient maintaining CI &gt; 2.2 L/min/m2, MAP &gt; 65 mmHg, and PCWP &lt; 18 mmHg on 1:3 assist is ready for removal.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
