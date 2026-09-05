import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  Wind,
  Activity,
  Gauge,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
} from 'lucide-react';
import MechanicalVentilationSimulator from '@/components/simulators/MechanicalVentilationSimulator';

export const metadata: Metadata = {
  title: 'Mechanical Ventilation & Critical Care Respiratory Mechanics | Mediverse',
  description: 'Enterprise virtual mechanical ventilator workstation: Equation of Motion, VCV vs. PCV waveforms, inspiratory hold mechanics, driving pressure, auto-PEEP, and ARDSNet lung-protective titration.',
};

export default function MechanicalVentilationPage() {
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
              CRITICAL CARE MEDICINE
            </span>
            <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
              ARDSNET / ATS-ERS COMPLIANT
            </span>
          </div>
        </div>

        {/* Main Simulator Component */}
        <MechanicalVentilationSimulator />

        {/* Curriculum & High-Yield Board Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* Card 1: Equation of Motion & Modes */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-cyan-400">
              <Wind className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Equation of Motion &amp; Modes
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <span className="font-semibold text-cyan-300 block mb-0.5">Equation of Motion</span>
                P_vent(t) = P_resistive + P_elastic + PEEP = Flow(t) × Raw + V(t)/Cstat + PEEP.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <span className="font-semibold text-cyan-300 block mb-0.5">Volume Control (VCV)</span>
                Constant (square) or decelerating flow delivered until set VT is reached. Pressure varies dynamically with lung compliance and airway resistance.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <span className="font-semibold text-cyan-300 block mb-0.5">Pressure Control (PCV)</span>
                Constant inspiratory pressure creates a decelerating exponential flow curve. Delivered VT varies directly with compliance: if lungs stiffen, VT drops!
              </li>
            </ul>
          </div>

          {/* Card 2: Hold Maneuvers & Mechanics */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-amber-400">
              <Gauge className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Diagnostic Holds &amp; Mechanics
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <span className="font-semibold text-amber-300 block mb-0.5">Inspiratory Hold (Plateau Pressure)</span>
                Zero flow eliminates resistive pressure (Flow × Raw = 0), unmasking Plateau Pressure (Pplat). Driving Pressure = Pplat - PEEP (target &lt; 14 cmH2O).
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <span className="font-semibold text-amber-300 block mb-0.5">Peak vs. Plateau Disparity</span>
                Elevated Ppeak with NORMAL Pplat indicates increased Airway Resistance (bronchospasm, kinked ETT, secretions). Elevated Ppeak AND elevated Pplat indicates decreased Compliance (ARDS, pneumothorax, pulmonary edema).
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <span className="font-semibold text-amber-300 block mb-0.5">Expiratory Hold (Auto-PEEP)</span>
                Incomplete exhalation (Te &lt; 3-4 time constants) traps gas, creating intrinsic Auto-PEEP. Increases work of breathing and risks hemodynamic collapse.
              </li>
            </ul>
          </div>

          {/* Card 3: ARDSNet & Weaning Indices */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-emerald-400">
              <Activity className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                ARDSNet &amp; Weaning Indices
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <span className="font-semibold text-emerald-300 block mb-0.5">ARDSNet Tidal Volume Titration</span>
                Calculate Predicted Body Weight (PBW). Initiate ventilation at 6 mL/kg PBW (titratable 4–8 mL/kg). Keep Pplat &le; 30 cmH2O to prevent volutrauma and biotrauma.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <span className="font-semibold text-emerald-300 block mb-0.5">Driving Pressure (Amato Criteria)</span>
                Driving pressure &Delta;P = Pplat - PEEP is the single strongest predictor of survival in ARDS (NEJM 2015). Maintain &Delta;P &le; 14 cmH2O.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <span className="font-semibold text-emerald-300 block mb-0.5">Rapid Shallow Breathing Index (RSBI)</span>
                During spontaneous breathing trials: RSBI = f / VT(liters). RSBI &lt; 105 predicts high extubation success; RSBI &gt; 105 indicates diaphragmatic fatigue.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
