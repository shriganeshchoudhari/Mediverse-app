import React from 'react';
import type { Metadata } from 'next';
import NeuraxialAnesthesiaSimulator from '@/components/simulators/NeuraxialAnesthesiaSimulator';

export const metadata: Metadata = {
  title: 'Neuraxial Anesthesia, Spinal/Epidural Level & LAST Rescue Workstation | Mediverse',
  description:
    'Anesthesiology & Obstetric clinical workstation: dermatome sensory level mapping, Bromage motor score, high/total spinal Bezold-Jarisch resuscitation, epidural test dose, and ASRA 20% Lipid Emulsion rescue.',
};

export default function NeuraxialSpinalEpiduralPage() {
  return (
    <main>
      <NeuraxialAnesthesiaSimulator />

      {/* High-Yield Curriculum Review Section */}
      <section className="bg-slate-950 border-t border-slate-800 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">
            High-Yield Clinical Review &mdash; Neuraxial Level Mapping, High Spinal &amp; ASRA LAST Protocols
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-sky-400 mb-3">
                Dermatome Levels &amp; Blockade Triad
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Differential nerve fiber sensitivity governs the clinical extent of neuraxial spinal and epidural blockade:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-indigo-300">Differential Blockade:</strong> Autonomic sympathetic preganglionic B-fibers are blocked 2 to 4 segments higher than sensory pinprick (A-delta/C fibers), while large myelinated motor fibers (A-alpha) are blocked approximately 2 segments lower.
                </li>
                <li>
                  <strong className="text-amber-300">Target Surgical Levels:</strong> T4 (nipple line) is mandatory for Cesarean delivery to prevent visceral peritoneal traction pain during exteriorization of the uterus. T10 (umbilicus) is the target level for labor epidural analgesia.
                </li>
                <li>
                  <strong className="text-rose-300">Modified Bromage Scale:</strong> Grade 0 (Nil &mdash; full hip/knee/foot flexion), Grade 1 (Partial &mdash; knee and foot only), Grade 2 (Almost Complete &mdash; foot only), Grade 3 (Complete &mdash; zero movement in lower extremities).
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-cyan-400 mb-3">
                High Spinal &amp; Bezold-Jarisch Crisis
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Cephalad spread of local anesthetic beyond T4 initiates profound hemodynamic and respiratory compromise:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-emerald-300">Cardioaccelerator Block (T1&ndash;T4):</strong> Sympathectomy unmasks vagal dominance. Decreased venous return triggers ventricular mechanoreceptors (Bezold-Jarisch reflex), causing severe bradycardia and profound hypotension.
                </li>
                <li>
                  <strong className="text-blue-300">Total Spinal Collapse (C3&ndash;C5):</strong> Blockade of phrenic nerve motor roots paralyzes the diaphragm, causing sudden respiratory arrest, unresponsiveness, dilated pupils, and brainstem local anesthetic depression.
                </li>
                <li>
                  <strong className="text-amber-300">Emergency Resuscitation:</strong> Immediate ABCs: 100% FiO2, bag-valve-mask or rapid endotracheal intubation, Ephedrine 5&ndash;10 mg or Phenylephrine 50&ndash;100 mcg IV for hypotension; Atropine 0.5&ndash;1.0 mg or Epinephrine 10&ndash;20 mcg IV for severe bradycardia.
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-rose-400 mb-3">
                ASRA LAST Protocol &amp; Blood Patch
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Life-saving toxicity reversal and management of post-dural puncture headache:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-rose-300">20% Lipid Emulsion (Intralipid):</strong> Administer immediate 1.5 mL/kg IV bolus over 1 minute, followed by continuous infusion at 0.25 mL/kg/min (approx. 1000 mL/hr for 70 kg). Max cumulative dose 12 mL/kg. Acts as a &ldquo;lipid sink&rdquo; sequestering lipophilic bupivacaine.
                </li>
                <li>
                  <strong className="text-purple-300">Drug Contraindications:</strong> Avoid Vasopressin, calcium channel blockers, and beta-blockers. Reduce Epinephrine boluses to small titrations (&le; 1 mcg/kg) to prevent intractable arrhythmias.
                </li>
                <li>
                  <strong className="text-yellow-300">Epidural Blood Patch (EBP):</strong> Definitive treatment for persistent postural PDPH. 15 to 20 mL of aseptic autologous blood injected into epidural space creates a gelatinous seal over the dural rent, restoring intracranial CSF pressure in &gt; 85% of cases.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
