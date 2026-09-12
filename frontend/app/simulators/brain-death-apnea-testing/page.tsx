import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  Brain,
  ShieldAlert,
  Activity,
  Wind,
  Heart,
  FileCheck,
  Stethoscope,
  Award,
  Zap,
} from 'lucide-react';
import BrainDeathApneaSimulator from '@/components/simulators/BrainDeathApneaSimulator';

export const metadata: Metadata = {
  title: 'Brain Death Determination & Apnea Testing Workstation | Mediverse',
  description:
    'American Academy of Neurology (AAN 2023) Guidelines: Prerequisites, Complete Brainstem Reflexes, Apnea Testing Kinetics, Ancillary Modalities & Organ Donor Resuscitation.',
};

export default function BrainDeathApneaPage() {
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
              <Brain className="w-3.5 h-3.5" />
              NEUROCRITICAL CARE &amp; NEUROLOGY
            </span>
            <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              AAN 2023 CONSENSUS PROTOCOL
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5" />
              ORGAN DONOR OPTIMIZATION
            </span>
          </div>
        </div>

        {/* Main Interactive Simulator Component */}
        <BrainDeathApneaSimulator />

        {/* High-Yield Clinical Reference Curriculum Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {/* Card 1: AAN Prerequisites */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-indigo-400">
              <ShieldAlert className="w-4 h-4" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                AAN 2023 Prerequisites
              </h2>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <li className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-indigo-300 block mb-0.5">Known Proximate Cause:</strong>
                Irreversible catastrophic brain trauma, massive stroke, or global anoxia documented on CT/MRI.
              </li>
              <li className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-indigo-300 block mb-0.5">Core Temp &ge; 36.0°C:</strong>
                Hypothermia suppresses brainstem cranial reflexes and must be reversed with convective warmers.
              </li>
              <li className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-indigo-300 block mb-0.5">Hemodynamics &ge; 100 SBP:</strong>
                Systolic BP &ge; 100 mmHg (or MAP &ge; 60 mmHg); vasopressors titrated to preserve microvascular flow.
              </li>
            </ul>
          </div>

          {/* Card 2: Apnea Physiology */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-sky-400">
              <Wind className="w-4 h-4" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                Apnea Test Gas Kinetics
              </h2>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <li className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-sky-300 block mb-0.5">Pre-Oxygenation Target:</strong>
                100% FiO2 for 10-15 min to achieve baseline PaO2 &ge; 200 mmHg, preventing rapid desaturation.
              </li>
              <li className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-sky-300 block mb-0.5">CO2 Accumulation (+3 mmHg/min):</strong>
                Metabolism produces ~200 mL CO2/min. PaCO2 increases 3 mmHg/min while pH drops 0.08 per 10 mmHg.
              </li>
              <li className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-sky-300 block mb-0.5">Confirmation Thresholds:</strong>
                PaCO2 &ge; 60 mmHg AND &ge; 20 mmHg increase above baseline, with ZERO spontaneous respiratory efforts.
              </li>
            </ul>
          </div>

          {/* Card 3: Ancillary Modalities */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-400">
              <Activity className="w-4 h-4" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                Ancillary Confirmations
              </h2>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <li className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-amber-300 block mb-0.5">4-Vessel Angiography:</strong>
                Non-visualization of intracranial circulation above internal carotid siphon and foramen magnum.
              </li>
              <li className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-amber-300 block mb-0.5">99mTc-HMPAO SPECT:</strong>
                "Hollow skull" / "empty skull" sign: complete absent cerebral uptake with preserved "hot nose" scalp flow.
              </li>
              <li className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-amber-300 block mb-0.5">TCD &amp; EEG Criteria:</strong>
                Biphasic reverberating flow / systolic spikes on TCD; Electrocerebral silence (&lt; 2 &mu;V) for 30 min on EEG.
              </li>
            </ul>
          </div>

          {/* Card 4: Donor Management */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400">
              <Heart className="w-4 h-4" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                "Rule of 100s" &amp; Hormone VIP
              </h2>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <li className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-emerald-300 block mb-0.5">The "Rule of 100s":</strong>
                SBP &ge; 100 mmHg, Urine Output &ge; 100 mL/h (1-3 mL/kg/h), PaO2 &ge; 100 mmHg, Hemoglobin &ge; 100 g/L.
              </li>
              <li className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-emerald-300 block mb-0.5">Diabetes Insipidus Control:</strong>
                Vasopressin (0.5-2.4 U/h) or DDAVP controls massive polyuria and prevents liver-toxic hypernatremia (&gt; 150).
              </li>
              <li className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-emerald-300 block mb-0.5">Endocrine Resuscitation:</strong>
                IV T4/T3 bolus/drip restores myocyte contractility; Methylprednisolone (15 mg/kg) improves lung donation.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
