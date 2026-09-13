import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Brain, Activity, Gauge, ShieldAlert, Sparkles, Scale, Eye } from 'lucide-react';
import SubarachnoidHemorrhageSimulator from '../../../components/simulators/SubarachnoidHemorrhageSimulator';

export const metadata: Metadata = {
  title: 'Subarachnoid Hemorrhage, Vasospasm & TCD Lindegaard Ratio | Mediverse Simulators',
  description:
    'Biophysical neurocritical care simulation of aneurysmal subarachnoid hemorrhage (aSAH), Hunt & Hess / Modified Fisher grading, Transcranial Doppler (TCD) Lindegaard ratio, EVD dynamics, and euvolemic induced hypertension.',
};


export const dynamic = 'force-static';
export default function SubarachnoidHemorrhagePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/simulators"
            className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-indigo-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Clinical Simulators Catalog
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span>Neurocritical Care &amp; Neurosurgery</span>
            <span>&bull;</span>
            <span className="text-indigo-400">Track B24 (Route #225)</span>
          </div>
        </div>

        {/* Interactive Simulator Component */}
        <SubarachnoidHemorrhageSimulator />

        {/* Deep Physiology & Clinical Neurosurgical Evidence Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* Hunt & Hess vs Modified Fisher */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-400" />
              1. Hunt &amp; Hess vs Modified Fisher
            </h3>
            <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <p>
                <strong>Clinical Grading (Hunt &amp; Hess):</strong> Reflects presenting clinical severity from
                Grade 1 (asymptomatic / mild headache) to Grade 5 (deep coma, decerebrate posturing), serving as the
                primary predictor of perioperative mortality.
              </p>
              <p>
                <strong>Radiographic Risk (Modified Fisher):</strong> Stratifies risk of delayed cerebral ischemia
                (DCI) and symptomatic vasospasm based on clot thickness (&ge; 1 mm) and bilateral intraventricular
                hemorrhage (IVH). Grade 4 carries the highest risk (~44%), mandating intensive surveillance.
              </p>
            </div>
          </div>

          {/* TCD Sonography & Lindegaard Ratio */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              2. TCD &amp; The Lindegaard Ratio
            </h3>
            <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <p>
                <strong>Vasospasm vs Hyperemia:</strong> Elevated middle cerebral artery (MCA) velocity alone can
                occur from systemic hyperdynamic flow (fever, pressors, anemia). The Lindegaard Ratio (MCA Vmean /
                extracranial ICA Vmean) normalizes for cardiac output.
              </p>
              <p>
                <strong>Diagnostic Thresholds:</strong> A ratio &lt; 3.0 indicates benign hyperemia. Ratios 3.0 to
                4.5 indicate mild spasm; 4.5 to 6.0 moderate spasm; and &gt; 6.0 (or MCA &ge; 200 cm/s) confirms
                severe mechanical vasospasm with critical stroke risk.
              </p>
            </div>
          </div>

          {/* Triple-H Evolution & Euvolemia */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Scale className="w-4 h-4 text-teal-400" />
              3. Euvolemic Induced Hypertension
            </h3>
            <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <p>
                <strong>Abandoning Triple-H:</strong> Historical hypervolemic hemodilution is abandoned due to high
                rates of iatrogenic pulmonary edema, dilutional hyponatremia, and myocardial injury without reducing
                DCI. Modern guidelines dictate strict <em>euvolemia</em> (CVP 6-8 mmHg) with isotonic crystalloids.
              </p>
              <p>
                <strong>Induced Hypertension:</strong> If clinical DCI develops (new focal deficit), vasopressors
                (Norepinephrine) are titrated to SBP 160-180 mmHg to force collateral flow across auto-paralyzed
                ischemic penumbra, strictly reserving induced hypertension for aneurysms that have been secured by
                coiling or clipping.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
