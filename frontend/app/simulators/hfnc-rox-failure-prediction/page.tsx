import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Wind, Activity, ShieldAlert, BookOpen, Sparkles } from 'lucide-react';
import HfncRoxFailureSimulator from '../../../components/simulators/HfncRoxFailureSimulator';

export const metadata: Metadata = {
  title: 'HFNC Mechanics, ROX Index Trajectory & Failure Prediction | Mediverse Simulators',
  description: 'Advanced biophysical simulation of High-Flow Nasal Cannula (HFNC), anatomical dead space washout, entrainment dilution, Roca ROX index validation, dynamic trajectory modeling, and P-SILI prevention.',
  openGraph: {
    title: 'HFNC Mechanics, ROX Index Trajectory & Failure Prediction | Mediverse Simulators',
    description: 'Advanced biophysical simulation of High-Flow Nasal Cannula (HFNC), anatomical dead space washout, entrainment dilution, Roca ROX index validation, dynamic trajectory modeling, and P-SILI prevention.',
    url: 'https://mediverse.app/simulators/hfnc-rox-failure-prediction',
    siteName: 'Mediverse Medical Simulation',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HFNC Mechanics, ROX Index Trajectory & Failure Prediction | Mediverse Simulators',
    description: 'Advanced biophysical simulation of High-Flow Nasal Cannula (HFNC), anatomical dead space washout, entrainment dilution, Roca ROX index validation, dynamic trajectory modeling, and P-SILI prevention.',
  },
};


export const dynamic = 'force-static';
export default function HfncRoxFailurePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/simulators"
            className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-cyan-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Clinical Simulators Catalog
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span>Critical Care &amp; Pulmonology</span>
            <span>&bull;</span>
            <span className="text-cyan-400">Track B16 (Route #217)</span>
          </div>
        </div>

        {/* Interactive Simulator Component */}
        <HfncRoxFailureSimulator />

        {/* Deep Physiology & Clinical Evidence Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* Anatomical Dead Space & Washout */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Wind className="w-4 h-4 text-cyan-400" />
              1. Dead Space Washout &amp; PEEP
            </h3>
            <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <p>
                The upper extrathoracic airway contains ~150 mL of anatomical dead space (V<sub>D,anat</sub>). At end-expiration, this chamber is filled with alveolar gas containing ~5% CO₂.
              </p>
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 font-mono text-[11px] text-cyan-300">
                Washout Efficiency = 1 - e^(-Flow / 25)
              </div>
              <p>
                High flow rates (30-60 L/min) continuously flush out this reservoir, lowering rebreathing, arterial PaCO₂, and patient minute ventilation demands by 2.0-3.5 L/min. Modest continuous PEEP (+0.7-1.0 cmH₂O per 10 L/min with closed mouth) recruits microatelectatic alveolar units.
              </p>
            </div>
          </div>

          {/* Roca Criteria & ROX Trajectory */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              2. ROX Index Validation (Roca et al.)
            </h3>
            <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <p>
                The ROX index combines oxygenation efficiency with ventilatory effort to predict HFNC success vs imminent exhaustion:
              </p>
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-300">
                ROX = (SpO₂ [%] / FiO₂) / RR [bpm]
              </div>
              <ul className="space-y-1 list-disc pl-4 text-[11px]">
                <li><strong>ROX &ge; 4.88</strong>: High likelihood of success (PPV &gt; 80%).</li>
                <li><strong>ROX 3.85 - 4.88</strong>: Intermediate risk / grey zone; repeat strictly at 2-hour intervals.</li>
                <li><strong>2h Cutoff &lt; 2.85</strong>: High specificity for failure.</li>
                <li><strong>6h Cutoff &lt; 3.47</strong>: Failure imminent; prepare intubation.</li>
                <li><strong>12h Cutoff &lt; 3.85</strong>: Definitive failure threshold.</li>
              </ul>
            </div>
          </div>

          {/* P-SILI & Hazards of Delayed Intubation */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              3. P-SILI &amp; Kang Intubation Delay
            </h3>
            <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <p>
                <strong>Patient-Self-Inflicted Lung Injury (P-SILI)</strong> occurs when vigorous respiratory drive generates intense negative intrapleural pressure swings (&Delta;P<sub>es</sub> &gt; 15-20 cmH₂O).
              </p>
              <p>
                This drives extreme transpulmonary pressures, transvascular fluid filtration (lung edema), and regional <em>pendelluft</em> gas shifts between non-dependent and dependent lung segments.
              </p>
              <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-[11px]">
                <strong>Kang et al. Landmark Finding:</strong> Delaying intubation &gt; 48h after HFNC failure dramatically increased ICU mortality compared to early intubation (&lt; 48h). Do not persist with HFNC when ROX is failing!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
