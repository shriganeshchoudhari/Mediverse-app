import React from 'react';
import type { Metadata } from 'next';
import PreeclampsiaMgso4Simulator from '@/components/simulators/PreeclampsiaMgso4Simulator';

export const metadata: Metadata = {
  title: 'Preeclampsia with Severe Features, Eclampsia & MgSO4 Workstation | Mediverse',
  description:
    'Obstetrics & Maternal-Fetal Medicine clinical workstation: ACOG diagnostic classification, Zuspan/Pritchard Magnesium Sulfate kinetics, toxicity monitoring, 10% Calcium Gluconate antidote, and emergent antihypertensives.',
};

export default function PreeclampsiaEclampsiaPage() {
  return (
    <main>
      <PreeclampsiaMgso4Simulator />

      {/* High-Yield Curriculum Review Section */}
      <section className="bg-slate-950 border-t border-slate-800 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">
            High-Yield Clinical Review &mdash; Preeclampsia Classification, MgSO4 Resuscitation &amp; ACOG Protocols
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-rose-400 mb-3">
                ACOG Diagnostic Classification
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Gestational hypertension develops at &ge; 20 weeks gestation. Preeclampsia is defined by hypertension plus proteinuria or severe features:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-rose-300">Severe Features Criteria:</strong> Systolic BP &ge; 160 or Diastolic BP &ge; 110 mmHg; Thrombocytopenia (&lt; 100,000 /µL); Impaired liver function (AST/ALT &ge; 2&times; ULN or persistent RUQ pain); Renal insufficiency (Creatinine &gt; 1.1 mg/dL); Pulmonary edema; or new-onset persistent cerebral/visual disturbances.
                </li>
                <li>
                  <strong className="text-purple-300">HELLP Syndrome:</strong> Severe variant comprising Hemolysis (LDH &ge; 600 U/L, schistocytes), Elevated Liver enzymes (AST/ALT &ge; 70), and Low Platelets (&lt; 100,000 /µL). Neuraxial anesthesia is contraindicated when platelets &lt; 50,000 /µL.
                </li>
                <li>
                  <strong className="text-amber-300">Eclampsia:</strong> Occurrence of new-onset generalized tonic-clonic convulsions in a patient with preeclampsia, unexplainable by other neurological etiologies.
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-purple-400 mb-3">
                MgSO4 Kinetics &amp; Toxicity Cascades
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Magnesium sulfate is the anticonvulsant of choice for seizure prophylaxis (Magpie trial proven superior to Phenytoin or Diazepam):
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-purple-300">Zuspan IV Regimen:</strong> 4 to 6 g IV loading dose in 100 mL D5W/saline over 15&ndash;20 minutes, followed by 1 to 2 g/hr continuous infusion. Continue through labor and for 24 hours postpartum.
                </li>
                <li>
                  <strong className="text-emerald-300">Therapeutic Serum Range:</strong> 4.8 to 8.4 mg/dL (2.0&ndash;3.5 mmol/L or 4&ndash;7 mEq/L). Baseline physiological level is 1.7 to 2.4 mg/dL.
                </li>
                <li>
                  <strong className="text-rose-300">Toxicity Progression:</strong> Loss of deep tendon reflexes (patellar) at 9&ndash;12 mg/dL; Respiratory depression and arrest at 12&ndash;15 mg/dL; AV block and cardiac arrest at &gt; 15&ndash;20 mg/dL. Oliguria (&lt; 30 mL/hr) accelerates toxic accumulation.
                </li>
                <li>
                  <strong className="text-yellow-300">Antidote &mdash; 10% Calcium Gluconate:</strong> Administer 1 g (10 mL of 10% solution) IV slowly over 3 to 5 minutes to competitively displace magnesium at neuromuscular junctions.
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-sky-400 mb-3">
                Emergent Antihypertensives &amp; Delivery
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Emergency blood pressure lowering within 30&ndash;60 minutes and definitive obstetric delivery timing:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-sky-300">First-Line IV Antihypertensives:</strong> (1) IV Labetalol: 20 mg over 2 min; repeat 40 mg at 10 min, then 80 mg (max 220 mg). Avoid in asthma/cocaine. (2) IV Hydralazine: 5 to 10 mg over 2 min; repeat 10 mg at 20 min. (3) Oral Nifedipine: 10 to 20 mg PO immediate-release.
                </li>
                <li>
                  <strong className="text-emerald-300">Blood Pressure Targets:</strong> Lower SBP to 140&ndash;150 mmHg and DBP to 90&ndash;100 mmHg. Avoid excessive hypotension (DBP &lt; 80 mmHg) to maintain uteroplacental blood flow.
                </li>
                <li>
                  <strong className="text-indigo-300">Delivery Milestones:</strong> Deliver at &ge; 37.0 weeks for gestational HTN / preeclampsia; deliver at &ge; 34.0 weeks for preeclampsia with severe features. Deliver immediately regardless of gestational age for eclampsia, pulmonary edema, HELLP, or fetal distress.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
