import React from 'react';
import type { Metadata } from 'next';
import HematologyMorphologySimulator from '@/components/simulators/HematologyMorphologySimulator';

export const metadata: Metadata = {
  title: 'Hematology Smear & Bone Marrow Morphology Workstation | Mediverse',
  description:
    'Clinical hematology and pathology workstation: Peripheral blood smear (PBS) red cell poikilocytosis (schistocytes, target cells, tear drops), bone marrow myeloid-to-erythroid (M:E) ratio, WHO 2022 acute and chronic leukemia classification, and Cairo-Bishop Tumor Lysis Syndrome emergency triage.',
};

export default function HematologyMorphologyPage() {
  return (
    <main>
      <HematologyMorphologySimulator />

      {/* Curriculum Review Section */}
      <section className="bg-slate-950 border-t border-slate-800 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">
            High-Yield Clinical Review &mdash; Hematology Morphology, Bone Marrow Kinetics &amp; Oncologic Emergencies
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-purple-400 mb-3">
                M:E Ratio &amp; Erythrocyte Poikilocytosis
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Diagnostic clues from bone marrow cellularity and peripheral RBC architecture:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-cyan-300">Myeloid:Erythroid (M:E) Ratio:</strong> Physiologic ratio is 2:1 to 4:1. Depressed M:E (&lt;1.5:1) reflects erythroid hyperplasia driven by hemolysis or ineffective erythropoiesis. Elevated M:E (&gt;5:1) indicates myeloid hyperplasia (infection, CML) or erythroid hypoplasia.
                </li>
                <li>
                  <strong className="text-rose-300">Schistocytes (Helmet Cells):</strong> Fragmented red cells formed by mechanical shear against microvascular fibrin thrombi. Characteristic of TTP, HUS, and DIC; requires immediate evaluation for plasma exchange.
                </li>
                <li>
                  <strong className="text-amber-300">Tear-Drops &amp; Rouleaux:</strong> Dacryocytes signify marrow space-occupying lesions or myelofibrosis. Rouleaux (coin-stacks) are induced by elevated plasma globulins or paraproteins in Multiple Myeloma.
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-rose-400 mb-3">
                Acute vs Chronic Leukemic Morphologies
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Cytomorphologic and immunophenotypic distinctions under WHO 2022 guidelines:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-rose-300">Acute Myeloid Leukemia (AML):</strong> Blast threshold &ge;20% in bone marrow or blood. Large myeloblasts with delicate chromatin, prominent nucleoli, and Auer rods (fused crystalline primary granules, MPO-positive).
                </li>
                <li>
                  <strong className="text-purple-300">APML Medical Emergency:</strong> Characterized by t(15;17) PML-RARA and faggot cells (stacked Auer rods). Initiate emergent All-Trans Retinoic Acid (ATRA) immediately upon morphological suspicion to prevent fatal DIC.
                </li>
                <li>
                  <strong className="text-emerald-300">CML vs CLL:</strong> CML displays marked leukocytosis with the full spectrum of granulocytic maturation (myelocyte bulge, basophilia) and t(9;22). CLL features mature small lymphocytes with soccer-ball chromatin and smudge/basket cells.
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-amber-400 mb-3">
                Leukostasis &amp; Cairo-Bishop TLS
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Life-threatening metabolic and rheologic complications in high-grade hematologic malignancies:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-rose-300">Leukostasis Syndrome:</strong> In acute leukemia with WBC &gt; 50-100 &times;10&sup9;/L, rigid myeloblasts cause microvascular plugging in cerebral and pulmonary circulations (dyspnea, confusion, intracranial hemorrhage). Avoid packed RBC transfusions; initiate emergent cytoreduction.
                </li>
                <li>
                  <strong className="text-amber-300">Cairo-Bishop Criteria:</strong> Laboratory TLS requires &ge;2 of: Uric acid &ge;8.0 mg/dL, Potassium &ge;6.0 mEq/L, Phosphorus &ge;4.5 mg/dL, Calcium &le;7.0 mg/dL. Clinical TLS occurs when complicated by renal failure (creatinine &ge;1.8 mg/dL), seizures, or cardiac arrhythmias.
                </li>
                <li>
                  <strong className="text-cyan-300">Rasburicase Therapy:</strong> Recombinant urate oxidase enzymatically degrades insoluble uric acid to water-soluble allantoin, protecting renal tubular integrity during induction therapy.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
