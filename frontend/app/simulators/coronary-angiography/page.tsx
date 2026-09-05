import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  Activity,
  Heart,
  Compass,
  Radio,
  Gauge,
  Zap
} from 'lucide-react';
import CoronaryAngiographySimulator from '@/components/simulators/CoronaryAngiographySimulator';

export const metadata: Metadata = {
  title: 'Cardiac Catheterization & Coronary Angiography Workstation | Mediverse',
  description:
    'Comprehensive C-arm fluoroscopy projections, 18-segment coronary tree, Gorlin equation Aortic Valve Area, FFR/iFR adenosine physiology, and TIMI flow grading.',
};

export default function CoronaryAngiographyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Navigation & Status Badges */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/simulators"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Clinical Simulators
          </Link>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-bold">
              INTERVENTIONAL CARDIOLOGY
            </span>
            <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
              SCAI / ACC / AHA STANDARDS
            </span>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
              C-ARM FLUOROSCOPY &amp; HEMODYNAMICS
            </span>
          </div>
        </div>

        {/* Main Workstation Interactive Component */}
        <CoronaryAngiographySimulator />

        {/* High-Yield Board Review & Curriculum Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* Card 1: Coronary Anatomy, Dominance & C-Arm Projections */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-cyan-400">
              <Compass className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Coronary Anatomy &amp; C-Arm Projections
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-cyan-300 font-semibold block mb-0.5">
                  Spider View (LAO 45° / Cranial 30°):
                </strong>
                The gold standard projection to uncoil the Left Main Coronary Artery (LMCA) bifurcation and evaluate ostial/proximal LAD and LCx without vessel overlap or foreshortening.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-cyan-300 font-semibold block mb-0.5">
                  RAO Projections (Caudal vs Cranial):
                </strong>
                RAO Caudal (30°/25°) profiles the main body of the Circumflex (LCx) and Obtuse Marginal (OM) branches. RAO Cranial (30°/30°) lays out the LAD in its true anatomic long axis, optimal for sizing stents in mid/distal LAD and diagonals.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-cyan-300 font-semibold block mb-0.5">
                  Coronary Dominance Rules:
                </strong>
                Right-dominant (85%): RCA gives rise to the Posterior Descending Artery (PDA) and supplies the AV node. Left-dominant (10%): LCx gives rise to the PDA. Co-dominant (5%): RCA gives PDA, LCx gives posterolateral branch.
              </li>
            </ul>
          </div>

          {/* Card 2: Coronary Physiology & Lesion Assessment */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-amber-400">
              <Gauge className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Coronary Physiology (FFR / iFR) &amp; TIMI
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-amber-300 font-semibold block mb-0.5">
                  Fractional Flow Reserve (FFR Cutoff ≤0.80):
                </strong>
                Ratio of distal coronary pressure (Pd) to aortic pressure (Pa) during maximal hyperemic vasodilation with IV Adenosine (140 µg/kg/min). FFR ≤0.80 establishes functional myocardial ischemia warranting revascularization; FFR &gt;0.80 favors medical therapy.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-amber-300 font-semibold block mb-0.5">
                  Instantaneous Wave-Free Ratio (iFR):
                </strong>
                Measures the Pd/Pa ratio specifically during the diastolic wave-free period when resting microvascular resistance is naturally minimal and constant, eliminating the need for adenosine (ischemic cutoff ≤0.89).
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-amber-300 font-semibold block mb-0.5">
                  TIMI Flow Grading (0 to 3):
                </strong>
                TIMI 0: Complete occlusion, no antegrade flow. TIMI 1: Faint penetration past stenosis without distal bed filling. TIMI 2: Complete opacification but sluggish clearance. TIMI 3: Normal, prompt opacification and rapid clearance.
              </li>
            </ul>
          </div>

          {/* Card 3: Invasive Hemodynamics & Valve Area */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-red-400">
              <Activity className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Invasive Hemodynamics &amp; Gorlin AVA
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-red-300 font-semibold block mb-0.5">
                  Gorlin Equation for Aortic Valve Area:
                </strong>
                AVA = CO / (44.3 × HR × SEP × √ΔPmean). Severe aortic stenosis is defined by an AVA &lt;1.0 cm² (or indexed AVA &lt;0.6 cm²/m²), peak-to-peak transvalvular systolic gradient &gt;40 mmHg, and elevated LVEDP.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-red-300 font-semibold block mb-0.5">
                  Left Ventricular End-Diastolic Pressure (LVEDP):
                </strong>
                Normal LVEDP is 4–12 mmHg. Values &gt;18–20 mmHg reflect acute loss of diastolic compliance (ischemia/infarction), severe concentric hypertrophy, or left heart failure with pulmonary congestion.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-red-300 font-semibold block mb-0.5">
                  Fick Principle Intracardiac Shunts (Qp/Qs):
                </strong>
                An oxygen saturation step-up of ≥7% from mixed venous (SVC/IVC) to the Right Atrium indicates an Atrial Septal Defect (ASD). A pulmonary-to-systemic flow ratio (Qp/Qs) &gt;1.5 defines a hemodynamically significant shunt.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
