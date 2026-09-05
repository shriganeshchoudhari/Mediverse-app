import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  Brain,
  Activity,
  Layers,
  ShieldAlert,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import ICPDynamicsSimulator from '@/components/simulators/ICPDynamicsSimulator';

export const metadata: Metadata = {
  title: 'Neurocritical Care & Intracranial Pressure (ICP) Workstation | Mediverse',
  description:
    'Interactive Monro-Kellie volume-pressure elastance, P1-P3 pulse waveform morphology, Lundberg waves, Brain Trauma Foundation tiered therapy, and herniation dynamics.',
};

export default function ICPDynamicsPage() {
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
            <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold">
              NEUROCRITICAL CARE ICU
            </span>
            <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold">
              BTF 4TH EDITION PROTOCOL
            </span>
          </div>
        </div>

        {/* Main Simulator Component */}
        <ICPDynamicsSimulator />

        {/* Curriculum & High-Yield Board Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* Card 1: Monro-Kellie Doctrine & Elastance */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-purple-400">
              <Layers className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Monro-Kellie Elastance Doctrine
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-purple-300 font-semibold block mb-0.5">
                  The Closed Cranial Vault
                </strong>
                The cranial vault is rigid and non-expansile. Total volume consists of brain parenchyma (~80%), blood (~10%), and CSF (~10%). An increase in any one compartment (e.g., epidural hematoma, edema) must be compensated by an equal reduction in others.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-purple-300 font-semibold block mb-0.5">
                  Spatial Buffering Phase (~55 mL)
                </strong>
                Initial mass expansion is buffered by CSF displacement into the lumbar thecal sac and compression of low-pressure cortical venous sinuses. ICP remains &le; 15 mmHg during this high-compliance phase.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-purple-300 font-semibold block mb-0.5">
                  Elastance Collapse (dP / dV Surge)
                </strong>
                Once venous and CSF spatial reserves are exhausted (typically 50-60 mL in young adults), intracranial elastance spikes vertically. Minute volume additions of 1-2 mL produce steep surges in ICP, threatening cerebral perfusion.
              </li>
            </ul>
          </div>

          {/* Card 2: Waveform Morphology & Lundberg Waves */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-sky-400">
              <Activity className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Pulse Morphology &amp; Lundberg Waves
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-sky-300 font-semibold block mb-0.5">
                  P1 vs P2: The Compliance Signature
                </strong>
                Normal pulse waveform displays descending amplitude: P1 (percussion) &gt; P2 (tidal) &gt; P3 (dicrotic). When brain compliance fails, the dampening capacity vanishes and P2 exceeds P1 (P2 &gt; P1 reversal), confirming critical brain stiffness.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-sky-300 font-semibold block mb-0.5">
                  Lundberg A (Plateau) Waves
                </strong>
                Sudden steep rises in ICP to 50 - 100 mmHg lasting 5 to 20 minutes, followed by a precipitous decline. Reflects cyclic cerebral vasodilation triggered by ischemia (Rosner vasodilatory cascade). Herald impending herniation.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-sky-300 font-semibold block mb-0.5">
                  Lundberg B &amp; C Waves
                </strong>
                B waves: rhythmic oscillations at 0.5 - 2 per minute reaching 20-30 mmHg, correlated with respiratory instability and Cheyne-Stokes breathing. C waves: small oscillations (4-8/min, &lt;20 mmHg) reflecting normal Traube-Hering-Mayer systemic blood pressure rhythms.
              </li>
            </ul>
          </div>

          {/* Card 3: BTF Tiered Management & Herniation Syndromes */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                BTF Tiers &amp; Herniation Syndromes
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-rose-300 font-semibold block mb-0.5">
                  Cerebral Perfusion Pressure (CPP) Target
                </strong>
                CPP = MAP - ICP. Brain Trauma Foundation guidelines mandate maintaining CPP between 60 - 70 mmHg. Avoid CPP &lt; 60 mmHg (ischemia) and aggressive vasopressor titration &gt; 70 mmHg (risk of ARDS and vasogenic edema).
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-rose-300 font-semibold block mb-0.5">
                  BTF Tiered Escalation Ladder
                </strong>
                Tier 0: HOB 30&deg;, neutral neck, analgesia/sedation, normothermia, normoglycemia. Tier 1: Osmolar therapy (3% saline or mannitol), EVD CSF drainage. Tier 2: Mild hyperventilation (PaCO2 30-35), neuromuscular blockade. Tier 3: Decompressive craniectomy, barbiturate coma, moderate hypothermia.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-rose-300 font-semibold block mb-0.5">
                  Uncal Herniation &amp; Cushing Triad
                </strong>
                Uncal herniation compresses the ipsilateral oculomotor nerve (CN III) causing a dilated, sluggish/fixed pupil, followed by contralateral hemiparesis. Tonsillar herniation drives cerebellar tonsils into the foramen magnum, producing Cushing Triad (hypertension, bradycardia, irregular respiration).
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
