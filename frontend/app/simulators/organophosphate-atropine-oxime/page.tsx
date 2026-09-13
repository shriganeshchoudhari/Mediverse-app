import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Skull, Syringe, Wind, ShieldAlert, Sparkles } from 'lucide-react';
import OrganophosphateToxSimulator from '../../../components/simulators/OrganophosphateToxSimulator';

export const metadata: Metadata = {
  title: 'Organophosphate & Carbamate Poisoning, Atropine Titration & Oximes | Mediverse Simulators',
  description:
    'Biophysical toxicology simulation of Acetylcholinesterase (AChE) aging kinetics, muscarinic Killer B\'s vs nicotinic motor collapse, Atropine doubling resuscitation endpoints, Pralidoxime (2-PAM) nucleophilic reactivation, and Intermediate Syndrome (IMS).',
};

export default function OrganophosphateToxPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/simulators"
            className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-emerald-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Clinical Simulators Catalog
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span>Toxicology &amp; Critical Care</span>
            <span>&bull;</span>
            <span className="text-emerald-400">Track B19 (Route #220)</span>
          </div>
        </div>

        {/* Interactive Simulator Component */}
        <OrganophosphateToxSimulator />

        {/* Deep Physiology & Toxicological Evidence Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* Muscarinic vs Nicotinic Crisis */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Skull className="w-4 h-4 text-emerald-400" />
              1. Muscarinic vs Nicotinic Crisis
            </h3>
            <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <p>
                <strong>The Muscarinic Toxidrome (DUMBELS):</strong> Defecation, Urination, Miosis, Bradycardia, Bronchorrhea/Bronchospasm, Emesis, Lacrimation, Salivation. The lethal threats are the <em>Killer B&apos;s</em> (Bronchorrhea, Bronchospasm, Bradycardia) which drown alveoli in copious bronchial secretions.
              </p>
              <p>
                <strong>The Nicotinic Syndrome (NMJ):</strong> Excessive acetylcholine at skeletal motor endplates induces fasciculations followed by flaccid depolarizing block and diaphragmatic paralysis. Atropine has zero effect at nicotinic receptors.
              </p>
            </div>
          </div>

          {/* Atropinization & Doubling Protocol */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Syringe className="w-4 h-4 text-cyan-400" />
              2. Atropine Doubling Protocol
            </h3>
            <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <p>
                <strong>Dose Doubling Strategy (Lancet 2008):</strong> Start with 2 mg IV. If no clinical response in 3-5 minutes, double to 4 mg, then 8 mg, 16 mg, and 32 mg until endpoints are met. Underdosing atropine is the most common cause of preventable mortality.
              </p>
              <p>
                <strong>Titration Endpoints:</strong> Clear chest to auscultation, HR &ge; 80 bpm, SBP &ge; 80 mmHg, and dry axillae. <em>Crucial rule:</em> Never titrate to pupillary dilation, as pupils may remain pinpoint from direct conjunctival vapor contact or adrenergic receptor desensitization.
              </p>
            </div>
          </div>

          {/* Oxime Aging & Intermediate Syndrome */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Wind className="w-4 h-4 text-purple-400" />
              3. Aging Kinetics &amp; Intermediate Syndrome
            </h3>
            <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <p>
                <strong>Covalent Aging:</strong> Non-enzymatic loss of an alkoxy alkyl group strengthens the phosphorus-enzyme covalent bond, rendering inhibition irreversible. Sarin ages in ~5 hours; Soman in ~2 minutes; agricultural OPs in 24-48 hours. Carbamates do NOT age.
              </p>
              <p>
                <strong>Intermediate Syndrome (IMS):</strong> Occurs 24-96 hours post-exposure with cardinal neck flexor weakness (&quot;head drop&quot;), proximal limb paralysis, and diaphragmatic arrest despite clear lungs. Treated exclusively with mechanical ventilation, not atropine.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
