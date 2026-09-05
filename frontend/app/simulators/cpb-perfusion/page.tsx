import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  Heart,
  Droplets,
  Layers,
  Thermometer,
  ShieldAlert,
  Gauge
} from 'lucide-react';
import { CPBPerfusionSimulator } from '@/components/simulators/CPBPerfusionSimulator';

export const metadata: Metadata = {
  title: 'Cardiopulmonary Bypass (CPB) & Perfusion Workstation | Mediverse',
  description:
    'Comprehensive heart-lung machine simulation: roller vs centrifugal pumps, VAVD venous drainage, hypothermia gas strategies (alpha-stat vs pH-stat), cardioplegia myocardial protection, and protamine stoichiometry.',
};

export default function CPBPerfusionPage() {
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
              CARDIOTHORACIC SURGERY &amp; PERFUSION
            </span>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
              AmSECT / STS / EACTS STANDARDS
            </span>
          </div>
        </div>

        {/* Main Simulator Component */}
        <CPBPerfusionSimulator />

        {/* Curriculum & High-Yield Board Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* Card 1: Heart-Lung Machine Biophysics & Hydraulics */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-rose-400">
              <Gauge className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Circuit Hydraulics &amp; Pump Mechanics
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-rose-300 font-semibold block mb-0.5">
                  Roller vs Centrifugal Arterial Pumps
                </strong>
                Roller pumps are positive-displacement occlusive pumps whose output depends solely on RPM regardless of downstream resistance (generating dangerous line pressures &gt;500 mmHg if clamped). Centrifugal pumps use constrained vortex impellers that are afterload-dependent and non-occlusive, preventing line overpressure but risking retrograde exsanguination if pump slows without a one-way clamp.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-rose-300 font-semibold block mb-0.5">
                  Venous Drainage &amp; Reservoir Low Limit
                </strong>
                Venous return depends on height difference (gravity syphon) or negative pressure via Vacuum-Assisted Venous Drainage (VAVD, -20 to -40 mmHg). Cardiotomy venous reservoir level must strictly stay &gt;800 mL; sudden airlock can drain the reservoir in &lt;15 seconds, demanding immediate pump deceleration to avert catastrophic systemic air embolism.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-rose-300 font-semibold block mb-0.5">
                  Target Oxygen Delivery (DO2)
                </strong>
                Modern goal-directed perfusion targets <code className="text-cyan-300 font-mono">DO2 &gt; 280 - 300 mL/min/m²</code> on bypass to prevent subclinical tissue dysoxia, hyperlactatemia, and acute kidney injury (AKI).
              </li>
            </ul>
          </div>

          {/* Card 2: Thermoregulation, DHCA & Gas Strategies */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-amber-400">
              <Thermometer className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Hypothermia &amp; Blood Gas Strategies
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-amber-300 font-semibold block mb-0.5">
                  Alpha-Stat vs pH-Stat Strategies
                </strong>
                Alpha-stat does not correct for hypothermia (measures blood gas at 37°C), maintaining constant cellular electrochemical neutrality (alpha imidazole charge) and preserving cerebral autoregulation in adult surgery. pH-stat corrects for patient temp, adding CO2 to the sweep to induce cerebral vasodilatation and uniform brain cooling prior to circulatory arrest.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-amber-300 font-semibold block mb-0.5">
                  Deep Hypothermic Circulatory Arrest (DHCA) &amp; ACP
                </strong>
                At 18°C, cerebral metabolic rate (CMRO2) is reduced by &gt;80%. Unilateral or bilateral Antegrade Cerebral Perfusion (ACP) at 10-15 mL/kg/min via right axillary or innominate cannulation (pressure 40-60 mmHg) extends safe arrest duration beyond 60-90 minutes.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-amber-300 font-semibold block mb-0.5">
                  Rewarming Thermal Gradients
                </strong>
                Water-to-blood gradient must NEVER exceed 10°C, and arterial blood temperature must not exceed 37°C. Rapid rewarming triggers gaseous microemboli outgassing and cerebral hyperthermic injury.
              </li>
            </ul>
          </div>

          {/* Card 3: Myocardial Protection & Heparin-Protamine */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-blue-400">
              <ShieldAlert className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Cardioplegia &amp; Anticoagulation
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-blue-300 font-semibold block mb-0.5">
                  Del Nido vs Buckberg Cardioplegia
                </strong>
                Del Nido (single dose 4:1 crystalloid:blood with lidocaine and magnesium) provides 90 minutes of electromechanical arrest with minimal calcium entry. Buckberg (4:1 blood cardioplegia) uses warm/cold induction, repeat maintenance every 20 minutes, and a terminal warm substrate &quot;hot shot&quot; to restore ATP pools prior to clamp removal.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-blue-300 font-semibold block mb-0.5">
                  Coronary Sinus Pressure Limit (&le;50 mmHg)
                </strong>
                Retrograde cardioplegia via the coronary sinus must be continuously monitored; line pressure &gt;50 mmHg can rupture the thin-walled coronary sinus, causing massive hemorrhage.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-blue-300 font-semibold block mb-0.5">
                  Antithrombin III Deficiency &amp; Protamine Type III
                </strong>
                Heparin resistance (ACT &lt; 480s despite &gt;400 U/kg) requires AT-III concentrate or FFP. Rapid protamine administration risks catastrophic Type III pulmonary vasoconstriction (thromboxane A2 mediated) with acute RV failure and cardiovascular collapse.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
