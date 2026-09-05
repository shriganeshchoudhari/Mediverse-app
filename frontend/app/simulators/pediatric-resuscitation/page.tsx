import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  Baby,
  Heart,
  Activity,
  Zap,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldAlert,
} from 'lucide-react';
import PediatricResuscitationSimulator from '@/components/simulators/PediatricResuscitationSimulator';

export const metadata: Metadata = {
  title: 'Pediatric & Neonatal Resuscitation (PALS / NRP) Workstation | Mediverse',
  description: 'Enterprise virtual PALS and NRP simulation suite: Broselow tape weight estimation, endotracheal tube sizing, emergency pharmacology dosing, and neonatal Golden Minute APGAR scoring.',
};

export default function PediatricResuscitationPage() {
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
              PEDIATRIC EMERGENCY &amp; NEONATOLOGY
            </span>
            <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
              AHA PALS / AAP NRP 8th ED
            </span>
          </div>
        </div>

        {/* Main Simulator Component */}
        <PediatricResuscitationSimulator />

        {/* High-Yield Clinical Curriculum & Board Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* Card 1: PALS Resuscitation Algorithm */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-rose-400">
              <Heart className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                PALS Resuscitation Principles
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <span className="font-semibold text-rose-300 block mb-0.5">Cardiac Arrest Epinephrine</span>
                0.01 mg/kg (0.1 mL/kg of 1:10,000 solution) IV/IO every 3–5 minutes. Maximum single dose: 1 mg. Flush with 5 mL normal saline.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <span className="font-semibold text-rose-300 block mb-0.5">Defibrillation Hierarchy</span>
                1st Shock: 2 J/kg. 2nd and subsequent shocks: 4 J/kg (titratable up to 10 J/kg or adult 200 J max). Resume CPR immediately for 2 minutes post-shock.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <span className="font-semibold text-rose-300 block mb-0.5">Volume Resuscitation</span>
                20 mL/kg isotonic crystalloid bolus over 5–20 min for hypovolemic or septic shock. Re-assess for rales and hepatomegaly before repeat boluses.
              </li>
            </ul>
          </div>

          {/* Card 2: Pediatric Airway Anatomy & Sizing */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-blue-400">
              <Activity className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Pediatric Airway Anatomy
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <span className="font-semibold text-blue-300 block mb-0.5">Anatomical Distinctives</span>
                Large occiput (causes neck flexion in supine position), large tongue, cephalad funnel-shaped larynx, and narrowest point at cricoid cartilage in young children.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <span className="font-semibold text-blue-300 block mb-0.5">Endotracheal Tube Formulas</span>
                Cuffed: Age/4 + 3.5 mm. Uncuffed: Age/4 + 4.0 mm. Depth at upper lip = 3 × internal diameter or Age/2 + 12 cm.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <span className="font-semibold text-blue-300 block mb-0.5">Hypotension Floor (1-10 yrs)</span>
                Minimum acceptable Systolic Blood Pressure = 70 + (2 × Age in years). Below this threshold defines uncompensated decompensated shock!
              </li>
            </ul>
          </div>

          {/* Card 3: NRP Neonatal Golden Minute */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-emerald-400">
              <Baby className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                NRP Golden Minute &amp; SpO2
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <span className="font-semibold text-emerald-300 block mb-0.5">The Golden Minute (0–60s)</span>
                Assess gestation, tone, breathing. Warm, dry, stimulate. If apnea, gasping, or HR &lt; 100 bpm: initiate Positive Pressure Ventilation (PPV) with 21% O2 immediately.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <span className="font-semibold text-emerald-300 block mb-0.5">Pre-Ductal SpO2 Target Curve</span>
                Placed on right wrist: 1 min (60–65%), 2 min (65–70%), 3 min (70–75%), 4 min (75–80%), 5 min (80–85%), 10 min (85–95%).
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <span className="font-semibold text-emerald-300 block mb-0.5">Chest Compressions (3:1 Ratio)</span>
                Indicated only if HR remains &lt; 60 bpm despite 30 seconds of effective PPV that moves the chest. 3 compressions to 1 breath (90 compressions + 30 breaths = 120 events/min).
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
