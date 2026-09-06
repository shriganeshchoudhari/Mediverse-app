import React from 'react';
import type { Metadata } from 'next';
import UreaKineticDialysisSimulator from '@/components/simulators/UreaKineticDialysisSimulator';

export const metadata: Metadata = {
  title: 'Urea Kinetic Modeling (Kt/V) & Dialysis Solver | Mediverse',
  description:
    'Hemodialysis adequacy and Urea Kinetic Modeling (UKM) biophysical workstation: Daugirdas second-generation variable-volume spKt/V, equilibrated eKt/V with intracellular urea rebound, URR %, nPCR nutritional surveillance, vascular access recirculation (AR%), and ultrafiltration rate cardiovascular risk monitoring.',
};

export default function UreaKineticDialysisPage() {
  return (
    <main>
      <UreaKineticDialysisSimulator />

      {/* Curriculum Review Section */}
      <section className="bg-slate-950 border-t border-slate-800 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">
            High-Yield Clinical Review &mdash; Hemodialysis Urea Kinetics &amp; KDOQI Adequacy
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-sky-400 mb-3">
                Daugirdas Formula &amp; Rebound Kinetics
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Urea Kinetic Modeling (UKM) quantifies small-molecule dialytic clearance through Daugirdas second-generation equations:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-cyan-300">Single-Pool spKt/V:</strong> spKt/V = -ln(R - 0.008 &times; t) + (4 - 3.5 &times; R) &times; (UF / postBW), where R = postBUN / preBUN and t is session duration in hours. KDOQI targets a delivered spKt/V &ge; 1.2 (prescribed &ge; 1.4).
                </li>
                <li>
                  <strong className="text-emerald-300">Double-Pool eKt/V:</strong> Accounts for intracellular-to-extracellular urea redistribution (&quot;urea rebound&quot;) occurring 30 to 60 minutes post-dialysis: eKt/V = spKt/V - 0.6 &times; (spKt/V / t) + 0.03.
                </li>
                <li>
                  <strong className="text-amber-300">Urea Reduction Ratio (URR):</strong> URR = ((preBUN - postBUN) / preBUN) &times; 100%. KDOQI minimum threshold is 65%, which roughly corresponds to spKt/V 1.2.
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-teal-400 mb-3">
                Access Recirculation &amp; Needle Reversal
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Vascular access recirculation dramatically reduces true systemic dialyzer clearance:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-cyan-300">Two-Needle Test Formula:</strong> AR% = ((S - A) / (S - V)) &times; 100%, where S is systemic peripheral urea, A is arterial line blood urea entering the dialyzer, and V is venous blood urea returning to the patient.
                </li>
                <li>
                  <strong className="text-emerald-300">Pathological Cutoff (&gt; 10%):</strong> Cardiopulmonary recirculation accounts for up to 10%. Values &gt; 10% indicate significant venous outflow stenosis or accidental needle reversal (arterial needle placed downstream of venous needle).
                </li>
                <li>
                  <strong className="text-amber-300">Falsely Low Post-BUN:</strong> Recirculation creates an artificially low post-BUN due to localized blood dilution in the fistula, misleading clinicians into overestimating delivered clearance.
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-amber-400 mb-3">
                Ultrafiltration Stunning &amp; Disequilibrium
              </h3>
              <p className="text-sm text-slate-300 mb-2">
                <strong className="text-white">UFR &gt; 13 mL/kg/h Threshold:</strong> High ultrafiltration rates trigger recurrent myocardial stunning, persistent left ventricular diastolic dysfunction, gut mucosal ischemia, and increased all-cause cardiovascular mortality.
              </p>
              <p className="text-sm text-slate-300 mb-2">
                <strong className="text-white">Protein Catabolic Rate (nPCR):</strong> Target nPCR &ge; 1.0–1.2 g/kg/day reflects adequate protein nutrition. Values &lt; 0.8 g/kg/day signal protein-energy wasting (PEW) requiring nutritional supplementation.
              </p>
              <p className="text-sm text-slate-300">
                <strong className="text-rose-400">Dialysis Disequilibrium Syndrome (DDS):</strong> Severe chronic uremia (pre-BUN &gt; 120 mg/dL) treated with overly aggressive clearance leads to cerebral edema. First dialysis must be gentle: 2 hours, Qb 150–200 mL/min, and urea reduction &lt; 30%.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
