import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  Compass,
  Activity,
  Heart,
  Layers,
  Gauge,
  ShieldAlert,
} from 'lucide-react';
import { TEENavigationSimulator } from '@/components/simulators/TEENavigationSimulator';

export const metadata: Metadata = {
  title: 'Transesophageal Echocardiography (TEE) 28-View Workstation | Mediverse',
  description:
    'Comprehensive ASE/SCA 28 standard TEE views navigation, multiplane omniplane probe manipulation, continuity equation for aortic stenosis, and diastolic hemodynamic solver.',
};

export default function TEENavigationPage() {
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
              CARDIOTHORACIC &amp; ANESTHESIOLOGY
            </span>
            <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
              ASE / SCA 28-VIEW GUIDELINE
            </span>
          </div>
        </div>

        {/* Main Simulator Component */}
        <TEENavigationSimulator />

        {/* Curriculum & High-Yield Board Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* Card 1: ASE/SCA 28-View Standard & Probe Manipulation */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-cyan-400">
              <Compass className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                ASE/SCA 28 Views &amp; Probe Physics
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-cyan-300 font-semibold block mb-0.5">
                  The 4 Depth Zones
                </strong>
                Upper Esophageal (UE: 20-25cm, ascending aorta &amp; RPA), Mid Esophageal (ME: 30-35cm, primary cardiac chambers &amp; valves), Transgastric (TG: 40-45cm, ventricular short-axis &amp; ischemia monitoring), Deep Transgastric (DTG: 45-50cm, co-linear LVOT/AV alignment).
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-cyan-300 font-semibold block mb-0.5">
                  Electronic Omniplane Multiplane (0° - 180°)
                </strong>
                Steers ultrasound crystal plane electronically without rotating probe shaft. 0° = Transverse (ME 4-Chamber, TG Mid SAX), 45° = AV SAX, 60° = RV Inflow-Outflow, 90° = Vertical Orthogonal (ME 2-Chamber, Bicaval), 120-140° = Long Axis (ME LAX, AV LAX).
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-cyan-300 font-semibold block mb-0.5">
                  Mechanical Shaft Degrees of Freedom
                </strong>
                Advance/Withdraw (depth), Rotate Clockwise/Counter-Clockwise (anterior vs posterior/descending aorta), Large wheel (Anteflexion/Retroflexion), Small wheel (Right/Left lateral deflection).
              </li>
            </ul>
          </div>

          {/* Card 2: Hemodynamic Doppler Calculations */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-blue-400">
              <Gauge className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Valvular &amp; Hemodynamic Doppler
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-blue-300 font-semibold block mb-0.5">
                  Aortic Stenosis Continuity Equation
                </strong>
                Conservation of mass dictates Stroke Volume across LVOT equals Stroke Volume through stenotic aortic orifice: <code className="text-cyan-300 font-mono">AVA = (Area_LVOT &times; VTI_LVOT) / VTI_AV</code>. Critical AS is defined as AVA &lt; 1.0 cm², Vmax &ge; 4.0 m/s, Mean Gradient &ge; 40 mmHg, or DVI &lt; 0.25.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-blue-300 font-semibold block mb-0.5">
                  Deep Transgastric Beam Alignment
                </strong>
                In ME Long Axis, the ultrasound beam is nearly 90° perpendicular to AV flow, creating severe cosine theta underestimation. Deep TG Long Axis provides 0° co-linear alignment essential for accurate CW Doppler velocities.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-blue-300 font-semibold block mb-0.5">
                  RVSP &amp; Diastology Classification
                </strong>
                Right Ventricular Systolic Pressure is calculated via modified Bernoulli: <code className="text-cyan-300 font-mono">RVSP = 4 &times; (TR_Vmax)² + RAP</code>. Restrictive filling (Grade III) features towering E wave (E/A &gt; 2.0), steep deceleration time (&lt;160ms), and elevated left atrial pressure (E/e&#39; &gt; 14).
              </li>
            </ul>
          </div>

          {/* Card 3: Critical Perioperative Pathologies */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Critical Pathologies &amp; Board Pearls
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-rose-300 font-semibold block mb-0.5">
                  Acute Mitral Regurgitation &amp; Flail Leaflet
                </strong>
                Posterior leaflet (P2) flail with torn chordae tendineae produces an anteriorly-directed eccentric jet hugging the interatrial septum. Pulsed-wave Doppler in the pulmonary veins confirms systolic flow reversal.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-rose-300 font-semibold block mb-0.5">
                  Acute Massive PE &amp; McConnell&#39;s Sign
                </strong>
                Characterized by severe RV dilation, RV free wall akinesis with hyperdynamic apical contractility, tricuspid regurgitation jet spike, and systolic/diastolic flattening of the interventricular septum (D-shaped LV on TG Mid SAX).
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-rose-300 font-semibold block mb-0.5">
                  Stanford Type A Aortic Dissection
                </strong>
                Mobile intimal flap undulating in the ascending aorta (ME Ascending Aorta SAX/LAX), acute aortic insufficiency from commissural detachment, coronary malperfusion, and hemopericardium requiring emergency surgical repair.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
