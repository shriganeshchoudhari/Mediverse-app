import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  Droplets,
  Wind,
  Heart,
  Layers,
  ShieldAlert,
  AlertTriangle,
} from 'lucide-react';
import ECMODynamicsSimulator from '@/components/simulators/ECMODynamicsSimulator';

export const metadata: Metadata = {
  title: 'Extracorporeal Membrane Oxygenation (ECMO) Workstation | Mediverse',
  description:
    'Comprehensive VV & VA ECMO simulation: gas exchange kinetics, sweep gas titration, recirculation fraction, Harlequin syndrome dual circulation, and LV venting mechanics.',
};

export default function ECMODynamicsPage() {
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
            <span className="px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold">
              CRITICAL CARE &amp; CARDIOTHORACIC
            </span>
            <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold">
              EXTRACORPOREAL LIFE SUPPORT (ELSO)
            </span>
          </div>
        </div>

        {/* Main Simulator Component */}
        <ECMODynamicsSimulator />

        {/* Curriculum & High-Yield Board Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* Card 1: VV vs VA ECMO Mechanics & Gas Exchange */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-sky-400">
              <Layers className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                VV vs VA ECMO Gas Exchange
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-sky-300 font-semibold block mb-0.5">
                  Veno-Venous (VV) ECMO
                </strong>
                Indicated for refractory hypoxemic or hypercapnic respiratory failure (ARDS, Murray score &ge; 3.0, PaO2/FiO2 &lt; 80 for &gt;6h). Blood is drained from the vena cava, oxygenated, and returned into the right atrium. Provides zero hemodynamic pump support.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-sky-300 font-semibold block mb-0.5">
                  Veno-Arterial (VA) ECMO
                </strong>
                Indicated for refractory cardiogenic shock (AMI, postcardiotomy shock, fulminant myocarditis, ECPR). Drains deoxygenated venous blood and pumps oxygenated blood under arterial pressure into the femoral or ascending aorta, providing biventricular circulatory support.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-sky-300 font-semibold block mb-0.5">
                  Sweep Gas vs Blood Flow Dissociation
                </strong>
                CO2 elimination depends linearly on Sweep Gas Flow (L/min) through the membrane lung. Oxygen delivery depends on ECMO Blood Flow (L/min) relative to native cardiac output and hemoglobin concentration.
              </li>
            </ul>
          </div>

          {/* Card 2: Recirculation & Line Chattering */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Recirculation &amp; Line Chattering
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-amber-300 font-semibold block mb-0.5">
                  Recirculation Fraction (Rf) Mechanics
                </strong>
                In VV ECMO, a portion of reinfused hyperoxygenated blood is directly drawn back into the drainage cannula without passing through systemic tissue. If cannula tips are too close (&lt;10-15 cm), Rf exceeds 35-50%, producing profound systemic hypoxemia despite 100% circuit SpostO2.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-amber-300 font-semibold block mb-0.5">
                  Venous Drainage Chattering (&quot;Kicking&quot;)
                </strong>
                When pump suction draws blood faster than venous return (hypovolemia, cough, or cannula abutment against vena cava wall), drainage pressure plummets below -200 to -250 mmHg. The vessel collapses cyclically, producing visible tubing vibration and micro-cavitation.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-amber-300 font-semibold block mb-0.5">
                  Membrane Lung Thrombosis (&Delta;P Surge)
                </strong>
                Transmembrane pressure gradient (&Delta;P = P_pre - P_post) normally ranges from 15 to 40 mmHg. A progressive rise &gt;50-60 mmHg signals hollow-fiber microvascular clotting, impairing gas exchange and escalating hemolysis.
              </li>
            </ul>
          </div>

          {/* Card 3: Harlequin Syndrome & LV Distention */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Harlequin Syndrome &amp; LV Distention
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-rose-400 font-semibold block mb-0.5">
                  Harlequin Syndrome (North-South Dual Circulation)
                </strong>
                In femoral VA ECMO with recovering native LV contractility but severely diseased native lungs, the LV ejects hypoxic pulmonary blood into the ascending aorta. Brain and coronary arteries become hypoxic (Right radial SpO2 &lt; 85%) while lower extremities are hyperoxemic (Femoral SpO2 100%).
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-rose-400 font-semibold block mb-0.5">
                  Right Radial Arterial Line Monitoring
                </strong>
                In peripheral VA ECMO, the arterial line MUST be placed in the right radial artery to detect cerebral and coronary hypoxemia. Upgrading to V-AV (triple-cannula) or central cannulation is required if dual circulation occurs.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-rose-400 font-semibold block mb-0.5">
                  Left Ventricular Distention &amp; ECPELLA Venting
                </strong>
                Retrograde arterial inflow increases LV afterload. If the stunned LV cannot open the aortic valve, intra-ventricular pressure surges (LVEDP &gt; 30 mmHg), causing fatal intra-cavitary thrombosis and pulmonary hemorrhage. Mechanical venting with Impella (&quot;ECPELLA&quot;) decompresses the ventricle.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
