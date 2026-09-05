import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  Wind,
  Activity,
  Gauge,
  Droplets,
  Flame,
  ShieldAlert,
  Layers,
} from 'lucide-react';
import AnesthesiaMachineSimulator from '@/components/simulators/AnesthesiaMachineSimulator';

export const metadata: Metadata = {
  title: 'Anesthesia Delivery Workstation & Volatile Vaporizer Engine | Mediverse',
  description: 'Circle breathing system physics, Link-25 hypoxic guard, low-flow anesthesia kinetics, age-adjusted MAC, FA/FI uptake curves, CO2 absorber exhaustion, and Malignant Hyperthermia Dantrolene protocol.',
};

export default function AnesthesiaMachinePage() {
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
            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
              ANESTHESIOLOGY &amp; PERIOPERATIVE MEDICINE
            </span>
            <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
              ASA / APSF / MHAUS COMPLIANT
            </span>
          </div>
        </div>

        {/* Main Simulator Component */}
        <AnesthesiaMachineSimulator />

        {/* Curriculum & High-Yield Board Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* Card 1: Circle System & Low-Flow Kinetics */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-amber-400">
              <Layers className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Circle System &amp; Low-Flow Kinetics
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-amber-300 font-semibold block mb-0.5">
                  Link-25 Hypoxic Proportioning Guard
                </strong>
                Pneumatic/mechanical interlock linking O₂ and N₂O control needles to guarantee delivered FiO₂ is never below 25% when nitrous oxide is flowing.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-amber-300 font-semibold block mb-0.5">
                  Circuit Time Constant (τ = V / FGF)
                </strong>
                Circle circuit volume (~5 L) determines lag in delivering new dial concentrations. In low flow (FGF 0.8 L/min), τ is ~6 min (3τ = 18 min for 95% equilibrium). High flow (FGF 4–6 L/min) accelerates wash-in.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-amber-300 font-semibold block mb-0.5">
                  CO₂ Absorbent Chemistry &amp; Exhaustion
                </strong>
                Soda lime: CO₂ + 2NaOH → Na₂CO₃ + H₂O + Heat, then Na₂CO₃ + Ca(OH)₂ → CaCO₃ + 2NaOH. Ethyl violet indicator turns purple at pH &lt; 10.3 as alkaline base neutralizes.
              </li>
            </ul>
          </div>

          {/* Card 2: Volatile Agent PK/PD & MAC */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-cyan-400">
              <Droplets className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Volatile Pharmacokinetics &amp; MAC
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-cyan-300 font-semibold block mb-0.5">
                  Blood:Gas Partition Coefficient &amp; FA/FI Rise
                </strong>
                Lower solubility produces faster rise in alveolar-to-inspired ratio (FA/FI): Desflurane (0.42) &gt; Sevoflurane (0.65) &gt; Isoflurane (1.40). Allows precise, minute-by-minute titration.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-cyan-300 font-semibold block mb-0.5">
                  Age-Adjusted MAC (Mapleson-Eger Equation)
                </strong>
                <code>MAC_age = MAC_40 × 10^(-0.00269 × [Age - 40])</code>. MAC decreases ~6% per decade of life past 40. Octogenarians require ~25% lower volatile concentrations.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-cyan-300 font-semibold block mb-0.5">
                  Anesthetic Depth Spectrum
                </strong>
                MAC-awake: 0.3–0.4 MAC (eye opening). Surgical anesthesia: 0.8–1.3 MAC. MAC-BAR (blunts autonomic response): 1.5–1.7 MAC. Total MAC &lt; 0.7 carries risk of intraoperative awareness.
              </li>
            </ul>
          </div>

          {/* Card 3: Crisis Algorithms */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Periop Crisis Protocols (ASA/MHAUS)
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-rose-300 font-semibold block mb-0.5">
                  Malignant Hyperthermia (MH) Crisis
                </strong>
                Unexplained rapid exponential surge in ETCO₂ (&gt;70 mmHg) despite hyperventilation is the hallmark sign. Immediately discontinue volatile agent, flush 100% O₂ at 10 L/min, and administer <strong>Dantrolene 2.5 mg/kg IV push</strong> (reconstitute 20 mg vials with 60 mL preservative-free sterile water).
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-rose-300 font-semibold block mb-0.5">
                  Pipeline O₂ Pressure Failure (&lt;30 psi)
                </strong>
                Disconnect wall pipeline hose to prevent back-leak, open backup E-cylinder (660 L at 2000 psi), and reduce fresh gas flow to low-flow to conserve tank life.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-rose-300 font-semibold block mb-0.5">
                  Incompetent Expiratory Unidirectional Valve
                </strong>
                Stuck flutter valve allows exhaled CO₂ into inspiratory limb: capnogram displays elevated baseline FiCO₂ (&gt;4–6 mmHg) failing to return to zero. Does not improve with increased FGF.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
