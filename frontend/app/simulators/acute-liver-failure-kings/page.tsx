import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Activity, Brain, Scale, ShieldAlert, Sparkles } from 'lucide-react';
import AcuteLiverFailureSimulator from '../../../components/simulators/AcuteLiverFailureSimulator';

export const metadata: Metadata = {
  title: "Acute Liver Failure (ALF), King's College Criteria & Cerebral Edema | Mediverse Simulators",
  description:
    "Biophysical hepatology simulation of King's College Hospital & Clichy emergency liver transplantation criteria, hyperacute vs subacute latency phenotypes, arterial ammonia astrocytic glutamine swelling, ICP neurocritical bundle, and rebalanced hemostasis.",
};


export const dynamic = 'force-static';
export default function AcuteLiverFailurePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/simulators"
            className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-amber-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Clinical Simulators Catalog
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span>Hepatology &amp; Neurocritical Care</span>
            <span>&bull;</span>
            <span className="text-amber-400">Track B22 (Route #223)</span>
          </div>
        </div>

        {/* Interactive Simulator Component */}
        <AcuteLiverFailureSimulator />

        {/* Deep Physiology & Clinical Hepatology Evidence Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* King's College & Clichy Prognostication */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              1. King&apos;s College &amp; Clichy Rules
            </h3>
            <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <p>
                <strong>APAP Algorithm:</strong> Arterial pH &lt; 7.30 alone regardless of coma grade commands
                emergency listing (mortality &gt; 85% without grafting). Alternatively, the classic triad of INR &gt; 6.5,
                Creatinine &gt; 3.4 mg/dL, and Grade 3/4 encephalopathy mandates immediate UNOS Status 1A triage.
              </p>
              <p>
                <strong>Non-APAP &amp; Clichy Criteria:</strong> In viral or idiosyncratic drug injury, INR &gt; 6.5
                alone or any 3 of 5 criteria (age, latency &gt; 7d, DILI/cryptogenic etiology, INR &gt; 3.5, bilirubin &gt;
                17.5 mg/dL) dictates transplant. In acute HBV, Clichy criteria uses Factor V &lt; 20% (&lt;30yo) or
                &lt; 30% (&ge;30yo) with advanced encephalopathy.
              </p>
            </div>
          </div>

          {/* Latency Phenotypes & The Hyperacute Paradox */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Brain className="w-4 h-4 text-cyan-400" />
              2. The Hyperacute Paradox
            </h3>
            <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <p>
                <strong>Hyperacute ALF (&lt; 7 Days):</strong> Rapid-onset hepatic necrosis (e.g., APAP, ischemia)
                produces sudden toxic hyperammonemia, precipitating the highest rate of intracranial hypertension and
                fatal herniation (&gt; 75%). Paradoxically, it has the highest spontaneous regeneration rate (50-60%) if
                bridged past peak necrosis.
              </p>
              <p>
                <strong>Subacute ALF (&gt; 28 Days):</strong> Indolent progression (e.g., DILI, autoimmune) permits
                osmotic adaptation in astrocytes, so cerebral edema is rare (&lt; 15%). However, hepatocyte loss is
                exhaustive, resulting in dismal spontaneous survival (&lt; 15%) without urgent liver transplantation.
              </p>
            </div>
          </div>

          {/* Neurocritical Ammonia & Rebalanced Hemostasis */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Scale className="w-4 h-4 text-rose-400" />
              3. Neuroprotection &amp; FFP Contraindication
            </h3>
            <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <p>
                <strong>Neurocritical Targets:</strong> Arterial ammonia &gt; 150 &mu;mol/L triggers astrocytic
                glutamine cytotoxic edema. Target serum sodium 145-150 mEq/L with 3% hypertonic saline, elevate head of
                bed to 30&deg;, maintain neutral neck alignment, electively intubate Grade 3/4 coma, and initiate early
                CRRT.
              </p>
              <p>
                <strong>Rebalanced Hemostasis:</strong> Loss of procoagulant factors (II, V, VII, X) is paralleled by
                loss of endogenous anticoagulants (Protein C, Protein S, Antithrombin III). Prophylactic FFP is strictly
                contraindicated because it obscures the prognostic INR value and precipitates fatal hypervolemia without
                reducing bleeding risk.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
