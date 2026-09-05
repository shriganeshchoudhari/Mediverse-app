import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  Activity,
  Heart,
  Droplets,
  Zap,
  Gauge,
  ShieldAlert,
  Cpu
} from 'lucide-react';
import VentricularAssistSimulator from '@/components/simulators/VentricularAssistSimulator';

export const metadata: Metadata = {
  title: 'Mechanical Circulatory Support & Percutaneous VAD Workstation | Mediverse',
  description:
    'High-fidelity simulation of microaxial transvalvular blood pumps (Impella CP, 5.5, RP), TandemHeart, and ECPELLA synergy. Real-time PV-loop unloading dynamics, P-level kinetics, purge fluidics, and suction troubleshooting.',
};

export default function VentricularAssistPage() {
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
            <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
              MECHANICAL CIRCULATORY SUPPORT
            </span>
            <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold">
              SCAI SHOCK CLASSIFICATION
            </span>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
              PV-LOOP UNLOADING &amp; ECPELLA
            </span>
          </div>
        </div>

        {/* Main Workstation Interactive Component */}
        <VentricularAssistSimulator />

        {/* High-Yield Board Review & Curriculum Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* Card 1: Microaxial Pump Mechanics & P-Level Kinetics */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-cyan-400">
              <Cpu className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Microaxial Pump Mechanics &amp; P-Levels
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-cyan-300 font-semibold block mb-0.5">
                  Continuous Microaxial Flow:
                </strong>
                The Impella catheter uses an Archimedes screw motor to aspirate oxygenated blood from the left ventricular cavity and eject it continuously into the ascending aorta, delivering up to 4.0 L/min (CP) or 5.5 L/min (5.5).
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-cyan-300 font-semibold block mb-0.5">
                  P-Level Rotational Velocity:
                </strong>
                Rotational speeds range from 25,000 RPM (P-1) to 46,000 RPM (P-9). Forward flow depends on both rotational speed and the transvalvular pressure gradient (aortic pressure minus LV cavity pressure).
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-cyan-300 font-semibold block mb-0.5">
                  Cardiac Power Output (CPO):
                </strong>
                Defined as CPO = (MAP × Total CO) / 451 Watts. In cardiogenic shock (SCAI stages C to E), CPO &lt;0.60 W is the single strongest independent hemodynamic predictor of inpatient mortality.
              </li>
            </ul>
          </div>

          {/* Card 2: LV Unloading, PV-Loops & ECPELLA Synergy */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-rose-400">
              <Activity className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                LV Unloading &amp; ECPELLA Synergy
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-rose-300 font-semibold block mb-0.5">
                  Leftward PV-Loop Shift:
                </strong>
                Mechanical unloading aspirates volume during diastole, dramatically decreasing LVEDP, end-diastolic volume (EDV), and left ventricular stroke work (represented by PV-loop area), reducing myocardial oxygen demand.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-rose-300 font-semibold block mb-0.5">
                  The V-A ECMO Distension Trap:
                </strong>
                Peripheral V-A ECMO infuses retrogradely into the femoral artery, imposing massive afterload on a stunned LV. Without venting, the aortic valve fails to open, resulting in intracardiac thrombosis, pulmonary edema, and refractory distension.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-rose-300 font-semibold block mb-0.5">
                  ECPELLA Synergy:
                </strong>
                Combining V-A ECMO (biventricular and oxygenation support) with Impella LV venting optimizes systemic perfusion while decompressing the pulmonary capillary wedge pressure (PCWP &lt;15 mmHg).
              </li>
            </ul>
          </div>

          {/* Card 3: Alarm Management & Purge Fluidics */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-amber-400">
              <ShieldAlert className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Alarm Troubleshooting &amp; Fluidics
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-amber-300 font-semibold block mb-0.5">
                  Suction &amp; Septal Abutment:
                </strong>
                Triggered by acute hypovolemia (CVP &lt;5 mmHg), RV failure, or malposition against the septum. Immediate intervention requires dropping to P-2 to release suction and giving 500-1000 mL crystalloid.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-amber-300 font-semibold block mb-0.5">
                  Catheter Migration (&quot;Ao-Ao&quot; Position):
                </strong>
                Retrograde retraction into the ascending aorta abolishes ventricular pulsatility on the optical sensor and halts LV decompression. Catheter must be advanced back across the aortic valve under fluoroscopy or TEE.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-amber-300 font-semibold block mb-0.5">
                  Purge Cassette &amp; HIT:
                </strong>
                Normal purge pressure is 300 - 1100 mmHg. In Heparin-Induced Thrombocytopenia (HIT), convert purge solution immediately to 25 mEq/L Sodium Bicarbonate in D5W to prevent motor bearing clotting.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
