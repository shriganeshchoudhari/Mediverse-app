import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  Zap,
  Activity,
  Layers,
  ShieldAlert,
  AlertTriangle,
} from 'lucide-react';
import CardiacPacingSimulator from '@/components/simulators/CardiacPacingSimulator';

export const metadata: Metadata = {
  title: 'Cardiac Electrophysiology & Temporary Pacemaker Workstation | Mediverse',
  description:
    'Transvenous and transcutaneous cardiac pacing mechanics, NASPE/BPEG pacing modes (VVI, DDD, VOO), capture and sensing threshold dials, R-on-T prevention, and pacemaker syndrome.',
};

export default function CardiacPacingPage() {
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
              CARDIOLOGY &amp; ELECTROPHYSIOLOGY
            </span>
            <span className="px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold">
              NASPE / BPEG PACING CODE
            </span>
          </div>
        </div>

        {/* Main Simulator Component */}
        <CardiacPacingSimulator />

        {/* Curriculum & High-Yield Board Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* Card 1: NASPE / BPEG Code & Timing Cycles */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-amber-400">
              <Layers className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                NASPE / BPEG Pacemaker Code
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-amber-300 font-semibold block mb-0.5">
                  The Three-Letter Nomenclature
                </strong>
                Position I: Chamber Paced (V=Ventricle, A=Atrium, D=Dual). Position II: Chamber Sensed (V, A, D, O=None). Position III: Response to Sensing (I=Inhibit, T=Trigger, D=Dual, O=None). VVI inhibits ventricular pacing when an intrinsic R-wave is detected.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-amber-300 font-semibold block mb-0.5">
                  Asynchronous Pacing (VOO / DOO)
                </strong>
                Asynchronous modes ignore all intrinsic cardiac electrical activity, delivering pulses at fixed intervals. Indicated during electrocautery (surgery) or magnet application to prevent EMI-induced pacing inhibition, but hazardous in patients with native rhythms.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-amber-300 font-semibold block mb-0.5">
                  Refractory Periods (VRP &amp; PVARP)
                </strong>
                Ventricular Refractory Period (VRP, 250 - 350 ms) prevents the generator from sensing its own paced QRS or T-wave. Post-Ventricular Atrial Refractory Period (PVARP) prevents sensing retrograde P-waves that could trigger pacemaker-mediated endless-loop tachycardia (ELT).
              </li>
            </ul>
          </div>

          {/* Card 2: Pacing Complications & Troubleshooting */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Troubleshooting &amp; Lethal Pitfalls
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-rose-300 font-semibold block mb-0.5">
                  Failure to Capture (Threshold Mismatch)
                </strong>
                Characterized by pacing spikes not followed by QRS complexes. Causes include lead dislodgement, ischemia, hyperkalemia, or exit block. The clinical rule is to set output current to 2x to 3x the measured stimulation threshold.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-rose-300 font-semibold block mb-0.5">
                  Undersensing &amp; The R-on-T Hazard
                </strong>
                Occurs when the sensitivity dial is set too high (e.g. 15 mV), meaning the pacemaker is blind to native R-waves (6-8 mV). It discharges asynchronously; a spike falling on the vulnerable repolarization down-slope of the T-wave triggers lethal polymorphic VT / VF.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-rose-300 font-semibold block mb-0.5">
                  Oversensing &amp; Inappropriate Asystole
                </strong>
                Occurs when the sensitivity dial is set too low (e.g. 0.5 mV). The generator mistakes pectoral muscle tremor, T-waves, or electrocautery noise for native R-waves and inhibits pacing, causing symptomatic asystole in pacemaker-dependent patients.
              </li>
            </ul>
          </div>

          {/* Card 3: Hemodynamics & Pacemaker Syndrome */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-sky-400">
              <Activity className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Hemodynamics &amp; Overdrive Pacing
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-sky-300 font-semibold block mb-0.5">
                  Pacemaker Syndrome Pathophysiology
                </strong>
                VVI pacing lacks AV synchrony, eliminating the 20 - 30% ventricular filling provided by the &quot;atrial kick&quot;. Atria contracting against closed AV valves generate retrograde venous pressure waves (cannon A-waves), jugular venous distention, lightheadedness, and systemic hypotension.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-sky-300 font-semibold block mb-0.5">
                  Dual-Chamber (DDD) Synchrony Restoration
                </strong>
                Switching from single-chamber VVI to dual-chamber DDD coordinates atrial sensing/pacing with a programmable AV delay (120 - 180 ms), restoring physiological end-diastolic volume and raising cardiac output by 1.0 - 1.5 L/min.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-sky-300 font-semibold block mb-0.5">
                  Overdrive Pacing for Torsades de Pointes
                </strong>
                In pause-dependent acquired long QT syndrome, recurrent pauses trigger early afterdepolarizations (EADs). Temporary overdrive pacing at 90 - 110 bpm shortens the QT interval, homogenizes repolarization, and suppresses Torsades de Pointes.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
