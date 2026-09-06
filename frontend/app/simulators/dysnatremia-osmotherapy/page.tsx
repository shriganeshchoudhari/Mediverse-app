import React from 'react';
import type { Metadata } from 'next';
import DysnatremiaSimulator from '@/components/simulators/DysnatremiaSimulator';

export const metadata: Metadata = {
  title: 'Dysnatremia, Hyponatremia/Hypernatremia Kinetics & Osmotherapy Workstation | Mediverse',
  description:
    'Nephrology & Critical Care clinical workstation: Adrogué-Madias fluid dynamics, Osmotic Demyelination Syndrome (ODS) prevention, 3% hypertonic saline bolus, DDAVP clamp, and neuro-osmotherapy.',
};

export default function DysnatremiaOsmotherapyPage() {
  return (
    <main>
      <DysnatremiaSimulator />

      {/* High-Yield Curriculum Review Section */}
      <section className="bg-slate-950 border-t border-slate-800 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">
            High-Yield Clinical Review &mdash; Dysnatremia Diagnosis, Adrogu&eacute;-Madias Kinetics &amp; ODS Prevention
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-sky-400 mb-3">
                Diagnostic Stepwise Algorithm
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Rigorous evaluation of tonicity, volume status, and renal response guides accurate hyponatremia etiology:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-indigo-300">Serum Osmolality &amp; Pseudohyponatremia:</strong> True hyponatremia is hypotonic (Posm &lt; 275 mOsm/kg). Isotonic (275&ndash;295) indicates pseudohyponatremia from hypertriglyceridemia or paraproteinemia. Hypertonic (&gt; 295) reflects translocational hyperglycemia (Katz correction: add 1.6 to 2.4 mEq/L Na per 100 mg/dL glucose &gt; 100).
                </li>
                <li>
                  <strong className="text-amber-300">Urine Osmolality (&lt; 100 vs &gt; 100):</strong> UOsm &lt; 100 mOsm/kg proves appropriate ADH suppression, pointing to primary psychogenic polydipsia or low solute intake (Beer Potomania, Tea &amp; Toast diet). UOsm &gt; 100 confirms non-osmotic ADH persistence.
                </li>
                <li>
                  <strong className="text-rose-300">Urine Sodium (UNa):</strong> In hypovolemia, UNa &lt; 20 mEq/L denotes extrarenal loss (GI, third-spacing), whereas UNa &gt; 20 denotes renal loss (diuretics, Addison disease). In euvolemia, UNa &gt; 30&ndash;40 with UOsm &gt; 100 is the hallmark of SIADH.
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-cyan-400 mb-3">
                Adrogu&eacute;-Madias &amp; Rule of 4 to 6
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Quantitative fluid selection and emergency bolus resuscitation in acute cerebral edema:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-emerald-300">Adrogu&eacute;-Madias Equation:</strong> &Delta;[Na+] = ([Na_inf] + [K_inf] - [Na_serum]) / (TBW + 1). Quantifies expected serum sodium change per 1 Liter of 3% NaCl (513 mEq/L), 0.9% NaCl (154 mEq/L), or D5W (0 mEq/L).
                </li>
                <li>
                  <strong className="text-blue-300">Acute Symptomatic Seizures:</strong> Administer immediate 100 to 150 mL bolus of 3% Hypertonic Saline IV over 10 minutes. Repeat up to 2 times every 30 minutes until seizures terminate or a +4 to +6 mEq/L acute rise is attained.
                </li>
                <li>
                  <strong className="text-amber-300">The Rule of 4 to 6:</strong> An acute sodium increase of only 4 to 6 mEq/L is sufficient to reverse brain herniation and reduce intracranial pressure by 50%, avoiding hazardous overcorrection.
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-rose-400 mb-3">
                ODS Guardrails &amp; DDAVP Rescue
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Preventing fatal pontine myelinolysis and managing targeted neuro-osmotherapy:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-rose-300">Safe Correction Ceilings:</strong> Maximum &le; 8 mEq/L in 24 hours (&le; 16 in 48 hours). In high-risk patients (baseline Na &lt; 105, hypokalemia, alcoholism, cirrhosis, malnutrition), enforce a strict ceiling of &le; 4 to 6 mEq/L in 24 hours.
                </li>
                <li>
                  <strong className="text-purple-300">DDAVP Clamp for Overcorrection:</strong> If serum sodium rises faster than planned or spontaneous water diuresis ensues, immediately halt hypertonic/isotonic fluids. Administer Desmopressin (DDAVP) 1 to 2 mcg IV/SC and infuse D5W (3&ndash;5 mL/kg/hr) to re-lower sodium into the safe zone.
                </li>
                <li>
                  <strong className="text-yellow-300">Neuro-Osmotherapy in TBI / ICP:</strong> 3% Hypertonic Saline preserves intravascular volume and cerebral perfusion pressure (reflection coefficient &sigma; = 1.0; target Na 145&ndash;155 mEq/L). Mannitol 20% induces potent osmotic diuresis; hold if serum osmolality &gt; 320 mOsm/kg to prevent acute tubular necrosis.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
