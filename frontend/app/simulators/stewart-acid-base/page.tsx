import React from 'react';
import type { Metadata } from 'next';
import StewartAcidBaseSimulator from '@/components/simulators/StewartAcidBaseSimulator';

export const metadata: Metadata = {
  title: 'Stewart Physico-Chemical Acid-Base & SID | Mediverse',
  description: 'Nephrology & ICU acid-base simulator: Peter Stewart physico-chemical approach, Strong Ion Difference (SID), Total Weak Acids (Atot), Strong Ion Gap (SIG), and dilutional normal saline hyperchloremic acidosis.',
};

export default function StewartAcidBasePage() {
  return (
    <main>
      <StewartAcidBaseSimulator />

      {/* Curriculum Section */}
      <section className="bg-slate-950 border-t border-slate-800 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">High-Yield Clinical Review — Stewart Physico-Chemical Acid-Base &amp; SID</h2>
          <div className="grid md:grid-cols-3 gap-6">

            {/* Card 1 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-teal-400 mb-3">The Three Independent Variables</h3>
              <p className="text-sm text-slate-300 mb-3">
                Classical Henderson-Hasselbalch models assume bicarbonate is an independent driver of pH. Peter Stewart proved that in aqueous solutions, [H+] and [HCO3&minus;] are strictly dependent variables determined by three independent parameters:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-emerald-300">1. Strong Ion Difference (SID):</strong> The net charge of fully dissociated strong cations minus strong anions: <code className="text-cyan-300">SID = ([Na+] + [K+] + [Ca2+] + [Mg2+]) &minus; ([Cl&minus;] + [Lactate&minus;])</code>. Normal range is 40 to 42 mEq/L. Narrowed SID causes metabolic acidosis; widened SID causes metabolic alkalosis.
                </li>
                <li>
                  <strong className="text-cyan-300">2. Total Non-Volatile Weak Acids (Atot):</strong> Circulating buffers that partially dissociate, predominantly serum Albumin and inorganic Phosphate. <code className="text-amber-300">Atot &approx; 0.28 &times; Albumin(g/L) + 0.3 &times; Phosphate(mmol/L)</code>. Hypoalbuminemia removes acid buffer, exerting an alkalinizing force.
                </li>
                <li>
                  <strong className="text-amber-300">3. Arterial pCO2:</strong> Governed independently by alveolar ventilation and Henry&apos;s law of gas solubility.
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-rose-400 mb-3">Strong Ion Gap (SIG) &amp; Masked Acidosis</h3>
              <p className="text-sm text-slate-300 mb-3">
                The Strong Ion Gap quantifies circulating unmeasured non-volatile strong anions with greater sensitivity than the classical anion gap:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-yellow-300">SIG Formulation:</strong> <code className="text-yellow-300">SIG = SIDapparent &minus; SIDeffective</code>, where <code className="text-cyan-300">SIDeffective = [HCO3&minus;] + [Albumin&minus;] + [Phosphate&minus;]</code>. In healthy plasma, electrical neutrality dictates that <code className="text-emerald-300">SIG &approx; 0 &plusmn; 2 mEq/L</code>.
                </li>
                <li>
                  <strong className="text-rose-400">Pathological SIG Elevation:</strong> A SIG &gt; 2 mEq/L indicates retention of unmeasured strong anions: ketoacids (&beta;-hydroxybutyrate, acetoacetate in DKA), uremic sulfates/hippurate, exogenous toxins (formate, glycolate), or pyroglutamic acid.
                </li>
                <li>
                  <strong className="text-cyan-300">Hypoalbuminemia Concealment:</strong> In septic ICU patients, severe hypoalbuminemia (Albumin &lt; 2.0 g/dL) reduces negative charge by &sim;5–7 mEq/L. This pseudo-normalizes bicarbonate and classical Anion Gap despite dangerous unmeasured tissue acidosis (unmasked by high SIG).
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-cyan-400 mb-3">Fluid Resuscitation &amp; Saline Acidosis</h3>
              <p className="text-sm text-slate-300 mb-2">
                <strong className="text-white">The 0.9% Normal Saline Paradox:</strong> Normal saline contains 154 mEq/L Na+ and 154 mEq/L Cl&minus;, giving it an intrinsic <code className="text-rose-400">SID = 0 mEq/L</code>. Infusing large volumes of saline dilutes extracellular plasma toward SID = 0, rapidly narrowing patient SID and driving iatrogenic hyperchloremic metabolic acidosis.
              </p>
              <p className="text-sm text-slate-300 mb-2">
                <strong className="text-white">Renal Hemodynamic Consequences:</strong> Excessive chloride delivery to the macula densa triggers tubuloglomerular feedback, leading to afferent arteriolar vasoconstriction, reduced renal cortical perfusion, and increased acute kidney injury (SMART and SALT-ED trials).
              </p>
              <p className="text-sm text-slate-300">
                <strong className="text-white">Balanced Crystalloids:</strong> Solutions like Plasma-Lyte (SID &approx; 50 mEq/L) or Ringer&apos;s Lactate (SID &approx; 28 mEq/L) contain metabolizable organic anions (acetate, gluconate, lactate) that leave behind neutral cations, preserving physiological SID and normochloremia.
              </p>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
