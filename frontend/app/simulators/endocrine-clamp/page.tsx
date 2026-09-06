import React from 'react';
import type { Metadata } from 'next';
import EndocrineClampSimulator from '@/components/simulators/EndocrineClampSimulator';

export const metadata: Metadata = {
  title: 'Endocrine Glucose Clamp & HOMA2 Precision Solver | Mediverse',
  description: 'Biophysical metabolic workstation: DeFronzo hyperinsulinemic-euglycemic clamp dynamics, whole-body glucose disposal (M value), HOMA2-IR, HOMA2-Beta, and DKA two-bag transition protocols.',
};

export default function EndocrineClampPage() {
  return (
    <main>
      <EndocrineClampSimulator />

      {/* Curriculum Review Section */}
      <section className="bg-slate-950 border-t border-slate-800 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">
            High-Yield Clinical Review — Metabolic Kinetics &amp; Glucose Clamps
          </h2>
          <div className="grid md:grid-cols-3 gap-6">

            {/* Card 1 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-amber-400 mb-3">
                DeFronzo Clamp &amp; Glucose Disposal Kinetics
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                The hyperinsulinemic-euglycemic clamp (DeFronzo 1979) remains the gold standard for measuring in vivo whole-body insulin sensitivity:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-emerald-300">Steady-State M-Value:</strong> Under steady-state hyperinsulinemia (&gt; 60–100 &mu;U/mL), endogenous hepatic glucose production (EGP) is suppressed by &gt; 90%. Therefore, the Glucose Infusion Rate (GIR, mg/kg/min) required to clamp blood glucose at euglycemia (90–100 mg/dL) directly equals tissue glucose disposal ($M$). Normal values are &ge; 7.5–8.0 mg/kg/min; values &lt; 4.5 signify severe insulin resistance.
                </li>
                <li>
                  <strong className="text-cyan-300">Skeletal Muscle Dominance:</strong> Approximately 75–85% of total clamped glucose disposal occurs in skeletal muscle through insulin-stimulated GLUT4 vesicle translocation and non-oxidative glycogen synthesis.
                </li>
                <li>
                  <strong className="text-amber-300">Insulin Sensitivity Index (M/I):</strong> Ratio of glucose disposal ($M$) to steady-state plasma insulin concentration ($I$), normalizing for variations in circulating insulin levels across subjects.
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-sky-400 mb-3">
                HOMA2, QUICKI &amp; The Disposition Index
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Surrogate fasting mathematical models and intravenous glucose tolerance tests quantify the interplay between resistance and beta-cell compensation:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-emerald-300">HOMA-IR &amp; HOMA-&beta;:</strong> HOMA-IR = (Fasting Glucose &times; Fasting Insulin) / 405. Values &gt; 2.5 indicate insulin resistance. HOMA-&beta; = (360 &times; Insulin) / (Glucose &minus; 63)% measures basal beta-cell reserve; values &lt; 50% signal impending beta-cell exhaustion.
                </li>
                <li>
                  <strong className="text-teal-300">QUICKI:</strong> 1 / [log(Fasting Glucose) + log(Fasting Insulin)]. Provides robust linear correlation with clamp-measured insulin sensitivity across obese and diabetic cohorts (normal &gt; 0.35).
                </li>
                <li>
                  <strong className="text-purple-300">The Hyperbolic Disposition Index:</strong> DI = S_I &times; AIRg (Insulin Sensitivity &times; Acute Insulin Response). In health, beta cells increase secretion along a hyperbola as insulin sensitivity drops. Failure to compensate leads to prediabetes and overt T2DM.
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-rose-400 mb-3">
                DKA Two-Bag Protocols &amp; SubQ Transition
              </h3>
              <p className="text-sm text-slate-300 mb-2">
                <strong className="text-white">Two-Bag Fluidics:</strong> When blood glucose falls &le; 200 mg/dL in DKA (or &le; 300 mg/dL in HHS), add 5%–10% Dextrose (D5W or D5 0.45% NS) while maintaining regular insulin at 0.05–0.1 U/kg/hr. This prevents hypoglycemia while sustaining the insulin required to suppress lipolysis and clear ketoacidosis.
              </p>
              <p className="text-sm text-slate-300 mb-2">
                <strong className="text-white">Resolution Criteria:</strong> Serum Anion Gap &le; 12 mEq/L, venous pH &gt; 7.30, serum bicarbonate &ge; 18 mEq/L, and &beta;-hydroxybutyrate &lt; 0.6 mmol/L.
              </p>
              <p className="text-sm text-slate-300">
                <strong className="text-amber-300">Mandatory 2-Hour SubQ Overlap:</strong> Administer subcutaneous basal insulin (Glargine/Degludec) at least 2 hours before discontinuing the IV insulin infusion. The short half-life of IV regular insulin (~5–9 min) otherwise triggers rebound ketoacidosis.
              </p>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
