import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Heart, Zap, Waves, Droplets } from 'lucide-react';
import HyperkalemiaShiftSimulator from '../../../components/simulators/HyperkalemiaShiftSimulator';

export const metadata: Metadata = {
  title: 'Severe Hyperkalemia, Cardiac Membrane Stabilization & Shift Kinetics | Mediverse Simulators',
  description:
    'Biophysical electrophysiology simulation of Nernst resting membrane potential shift, Nav1.5 fast sodium channel inactivation, Calcium Gluconate vs Chloride stoichiometry, transcellular shift kinetics (Insulin/Dextrose, Albuterol, Bicarbonate), and definitive elimination.',
};

export default function HyperkalemiaShiftPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/simulators"
            className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-rose-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Clinical Simulators Catalog
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span>Nephrology &amp; Critical Care</span>
            <span>&bull;</span>
            <span className="text-rose-400">Track B20 (Route #221)</span>
          </div>
        </div>

        {/* Interactive Simulator Component */}
        <HyperkalemiaShiftSimulator />

        {/* Deep Physiology & Clinical Evidence Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* 1. Electrophysiology of Hyperkalemia */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              1. Nernst Potential &amp; Nav1.5 Inactivation
            </h3>
            <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <p>
                <strong>Resting Depolarization:</strong> By the Nernst equation, elevated extracellular K+ shifts the
                resting membrane potential (Em) from -90 mV upward toward -70 mV. This baseline depolarization closes
                the voltage-dependent inactivation gates of fast cardiac sodium channels (Nav1.5).
              </p>
              <p>
                <strong>Conduction Slowing &amp; Sine Wave:</strong> Loss of available Nav1.5 channels slows Phase 0
                depolarization velocity (dV/dt max), progressively prolonging the PR interval, flattening P waves,
                widening the QRS complex, and ultimately generating the lethal pre-arrest sine-wave rhythm.
              </p>
            </div>
          </div>

          {/* 2. Calcium Membrane Stabilization */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              2. Calcium Gluconate vs Chloride
            </h3>
            <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <p>
                <strong>Mechanism of Action:</strong> Extracellular calcium does <em>not</em> lower serum potassium.
                Instead, it raises the threshold potential (Vth) toward zero, restoring the normal voltage difference
                between Em and Vth and stabilizing myocardial excitability within 1-3 minutes.
              </p>
              <p>
                <strong>Stoichiometric Potency:</strong> Calcium chloride 10% contains 13.6 mEq (270 mg) of elemental
                calcium per 10 mL ampule—3 times more concentrated than calcium gluconate 10% (4.65 mEq / 90 mg).
                Gluconate is preferred for peripheral lines; chloride is reserved for cardiac arrest or central access.
              </p>
            </div>
          </div>

          {/* 3. Transcellular Shifts vs Definitive Elimination */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Waves className="w-4 h-4 text-cyan-400" />
              3. Shifting Bridges &amp; Elimination
            </h3>
            <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <p>
                <strong>The 2-4 Hour Temporary Bridge:</strong> Regular insulin (10u + 50g D50W) and high-dose
                nebulized albuterol (10-20 mg) drive potassium into cells via Na+/K+-ATPase stimulation. Sodium
                bicarbonate is effective <em>only</em> if metabolic acidosis (pH &lt; 7.25) is present.
              </p>
              <p>
                <strong>Definitive Total-Body Clearance:</strong> Shifting is temporary; potassium rebounds as insulin
                metabolizes. Definitive removal requires loop diuretics (if GFR preserved), modern gastrointestinal
                binders (Lokelma SZC or Patiromer), or emergency hemodialysis (35 mEq/hr clearance).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
