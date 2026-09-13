import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Flame, Syringe, ShieldCheck, Waves, Clock } from 'lucide-react';
import AnaphylaxisResuscitationSimulator from '../../../components/simulators/AnaphylaxisResuscitationSimulator';

export const metadata: Metadata = {
  title: 'Anaphylaxis & Refractory Vasoplegic Shock Workstation | Mediverse Simulators',
  description:
    'Biophysical simulation of WAO/EAACI diagnostic criteria, Vastus Lateralis IM Epinephrine pharmacokinetics, Refractory Vasoplegic Shock protocols (Continuous IV Epinephrine, Glucagon in Beta-Blocker patients, Methylene Blue), Biphasic Reactions, and Serum Tryptase validation.',
};


export const dynamic = 'force-static';
export default function AnaphylaxisResuscitationPage() {
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
            <span>Allergy, Immunology &amp; Critical Care</span>
            <span>&bull;</span>
            <span className="text-rose-400">Track B21 (Route #222)</span>
          </div>
        </div>

        {/* Interactive Simulator Component */}
        <AnaphylaxisResuscitationSimulator />

        {/* Deep Physiology & Resuscitation Evidence Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* 1. Intramuscular Pharmacokinetics */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Syringe className="w-4 h-4 text-emerald-400" />
              1. Vastus Lateralis IM vs Deltoid/SubQ
            </h3>
            <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <p>
                <strong>Vastus Lateralis Superiority (Simons et al.):</strong> Intramuscular injection into the
                anterolateral aspect of the middle third of the thigh achieves peak plasma epinephrine concentrations
                (Cmax ~2100 pg/mL) within 8 &plusmn; 2 minutes. Deltoid IM injection requires ~25 minutes, while
                subcutaneous injection requires ~34 minutes due to local alpha-1 vasoconstriction.
              </p>
              <p>
                <strong>The Fatal Delay Hazard:</strong> Delayed administration of epinephrine is the primary predictor
                of fatal anaphylaxis. Second-line agents (antihistamines, systemic corticosteroids) do <em>not</em>
                relieve upper airway laryngeal edema or distributive shock and must never delay prompt epinephrine.
              </p>
            </div>
          </div>

          {/* 2. Beta-Blocker Resistance & Glucagon */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              2. Beta-Blocker Shock &amp; Glucagon Rescue
            </h3>
            <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <p>
                <strong>The Beta-Blocker Dilemma:</strong> In patients receiving chronic beta-blocker therapy, beta-2
                receptors are competitively blocked. Exogenous epinephrine fails to stimulate adenylate cyclase,
                resulting in severe refractory bronchospasm, profound bradycardia, and dangerous unopposed alpha-1
                vasoconstriction with cardiac decompensation.
              </p>
              <p>
                <strong>Glucagon Mechanism:</strong> IV Glucagon (1 - 5 mg bolus over 5 min, then 5 - 15 mcg/min
                infusion) activates adenylate cyclase directly via specific G-protein-coupled glucagon receptors,
                generating intracellular cAMP independently of the adrenergic receptor complex to restore cardiac
                inotropy and vascular tone.
              </p>
            </div>
          </div>

          {/* 3. Biphasic Recurrence & Serum Tryptase */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              3. Biphasic Reactions &amp; Tryptase Kinetics
            </h3>
            <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <p>
                <strong>Biphasic Recurrence Window:</strong> Secondary recurrence occurs in 4-15% of patients,
                peaking 4 to 12 hours after apparent complete resolution of the index episode without re-exposure.
                High-risk predictors (severe initial hypotension, delayed epinephrine &gt; 45 min, multiple doses)
                mandate at least 12-24 hours of monitored observation.
              </p>
              <p>
                <strong>Consensus Tryptase Formula:</strong> Serum total tryptase peaks 1-2 hours post-onset (half-life
                ~2 hours). The international consensus formula for confirmed systemic mast cell activation requires:
                Peak Tryptase &ge; (1.2 &times; Baseline Tryptase) + 2.0 mcg/L.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
