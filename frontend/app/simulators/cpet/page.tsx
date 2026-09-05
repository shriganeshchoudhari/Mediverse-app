import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  Activity,
  Heart,
  Wind,
  Gauge,
  Flame,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
} from 'lucide-react';
import CPETSimulator from '@/components/simulators/CPETSimulator';

export const metadata: Metadata = {
  title: 'Cardiopulmonary Exercise Testing (CPET) & Metabolic Ergometry | Mediverse',
  description: 'Wasserman 9-panel diagnostic CPET workstation: VO2 peak, anaerobic threshold (V-slope), ventilatory efficiency (VE/VCO2 slope), oxygen pulse kinetics, breathing reserve, and exercise limitation classification.',
};

export default function CPETPage() {
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
            <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
              CARDIOPULMONARY MEDICINE
            </span>
            <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
              ATS / ACCP / EACPR GUIDELINES
            </span>
          </div>
        </div>

        {/* Main Simulator Component */}
        <CPETSimulator />

        {/* Curriculum & High-Yield Board Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* Card 1: Wasserman 9-Panel Architecture */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-cyan-400">
              <Activity className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Wasserman 9-Panel Architecture
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-cyan-300 font-semibold block mb-0.5">
                  Row 1: Ventilatory Demand &amp; Flow
                </strong>
                Panel 1 (V̇E vs Time), Panel 4 (V̇E vs V̇CO₂ slope), and Panel 7 (V̇CO₂ vs V̇O₂ V-Slope) evaluate ventilatory drive and efficiency.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-cyan-300 font-semibold block mb-0.5">
                  Row 2: Circulatory &amp; Stroke Volume Kinetics
                </strong>
                Panel 2 (HR &amp; O₂ Pulse), Panel 5 (Ventilatory Equivalents), and Panel 8 (RER) establish cardiac output limits and test validity.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-cyan-300 font-semibold block mb-0.5">
                  Row 3: Gas Exchange &amp; Mechanics
                </strong>
                Panel 3 (V̇O₂ &amp; V̇CO₂), Panel 6 (End-Tidal Tensions), and Panel 9 (Hey Plot VT vs V̇E) differentiate dead space from lung mechanical limits.
              </li>
            </ul>
          </div>

          {/* Card 2: Thresholds & Slopes */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-amber-400">
              <Gauge className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Thresholds &amp; Prognostic Slopes
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-amber-300 font-semibold block mb-0.5">
                  Anaerobic Threshold (AT / VT1)
                </strong>
                Point where anaerobic glycolysis supplements aerobic ATP generation. Identified by Beaver V-slope inflection (slope &gt; 1.0) and nadir of V̇E/V̇O₂ without rise in V̇E/V̇CO₂. Normal &gt; 50-60% of peak V̇O₂.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-amber-300 font-semibold block mb-0.5">
                  V̇E / V̇CO₂ Slope &amp; Prognosis
                </strong>
                Reflects ventilation-perfusion mismatch and dead space (VD/VT). Slope &gt; 34 indicates poor prognosis in HFrEF (ISHLT criteria) and pulmonary arterial hypertension.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-amber-300 font-semibold block mb-0.5">
                  Oxygen Pulse &amp; Ischemia
                </strong>
                O₂ pulse (V̇O₂/HR = SV × C[a-v̄]O₂) tracks stroke volume. Early plateau or downward deflection during peak exercise is pathognomonic for myocardial ischemia or acute LV dysfunction.
              </li>
            </ul>
          </div>

          {/* Card 3: Exercise Limitation Differential */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-emerald-400">
              <Heart className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Limitation Differential Diagnosis
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-emerald-300 font-semibold block mb-0.5">
                  Ventilatory vs. Circulatory Limitation
                </strong>
                Ventilatory (COPD): Breathing Reserve &lt; 15%, VT plateau, SpO₂ desaturation, preserved HR reserve. Circulatory (HF): Preserved BR (&gt;20%), low peak V̇O₂, early AT, flat O₂ pulse.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-emerald-300 font-semibold block mb-0.5">
                  Pulmonary Vascular Disease (PAH)
                </strong>
                Extreme V̇E/V̇CO₂ slope (&gt; 40), depressed PETCO₂ throughout exercise (&lt; 30 mmHg), early desaturation, and blunted right ventricular stroke volume.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-emerald-300 font-semibold block mb-0.5">
                  Submaximal Effort Criteria
                </strong>
                Peak RER &lt; 1.05 with large unused breathing reserve (&gt; 30%) and heart rate reserve (&gt; 20 bpm) invalidates peak V̇O₂ as a true physiological maximum.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
