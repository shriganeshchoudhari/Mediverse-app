import React from 'react';
import type { Metadata } from 'next';
import NeurosurgeryEVDSimulator from '@/components/simulators/NeurosurgeryEVDSimulator';

export const metadata: Metadata = {
  title: 'Neurosurgery EVD & Kocher\'s Point Ventriculostomy | Mediverse',
  description: 'Neurosurgical ventriculostomy workstation: Kocher\'s point stereotactic trajectory, Foramen of Monro frontal horn cannulation, EVD graduated burette hydrodynamics, tragus zero leveling, slit ventricle prevention, and intrathecal thrombolysis.',
};

export default function NeurosurgeryEVDPage() {
  return (
    <main>
      <NeurosurgeryEVDSimulator />

      {/* Curriculum Section */}
      <section className="bg-slate-950 border-t border-slate-800 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">High-Yield Clinical Review — Neurosurgery &amp; Ventriculostomy Hydrodynamics</h2>
          <div className="grid md:grid-cols-3 gap-6">

            {/* Card 1 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-cyan-400 mb-3">Kocher&apos;s Point Stereotactic Landmarks</h3>
              <p className="text-sm text-slate-300 mb-3">
                Kocher&apos;s point provides the safest corridor for cannulating the ipsilateral frontal horn of the lateral ventricle:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-emerald-300">Calvarial Coordinates:</strong> Located approximately 11 cm posterior from the nasion along the midline and 3 cm lateral to the midline (along the mid-pupillary line, typically 1–2 cm anterior to the coronal suture to avoid primary motor cortex).
                </li>
                <li>
                  <strong className="text-cyan-300">Orthogonal Trajectory:</strong> Catheter is passed perpendicular to the skull curvature: in the coronal plane, aimed toward the ipsilateral medial canthus; in the sagittal plane, aimed toward the external auditory meatus / tragus.
                </li>
                <li>
                  <strong className="text-amber-300">Depth &amp; Landmark Target:</strong> The frontal horn is entered at a depth of 5.5 to 6.5 cm from the outer calvarium at the level of the Foramen of Monro. A catheter depth &gt; 7.0 cm carries a catastrophic risk of brainstem / midbrain injury.
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-amber-400 mb-3">EVD Hydrodynamics &amp; Tragus Leveling</h3>
              <p className="text-sm text-slate-300 mb-3">
                An External Ventricular Drain (EVD) couples therapeutic CSF decompression with continuous intracranial pressure monitoring:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-yellow-300">The Tragus Zero Reference:</strong> The laser level must be strictly zeroed to the external auditory tragus (anatomical proxy for the Foramen of Monro). If the transducer is positioned too high, ICP is falsely underestimated; if too low, ICP is overestimated.
                </li>
                <li>
                  <strong className="text-cyan-300">Pressure Conversion &amp; Driving Gradient:</strong> <code className="text-yellow-300">1 mmHg &approx; 1.36 cmH2O</code>. CSF drains only when ventricular hydrostatic pressure exceeds the burette chamber threshold (<code className="text-cyan-300">&Delta;P = ICP &minus; Chamber Height &gt; 0</code>).
                </li>
                <li>
                  <strong className="text-rose-400">Slit Ventricle Overdrainage Danger:</strong> Lowering the chamber below 5 cmH2O causes rapid ventricular collapse (&quot;slit ventricles&quot;), leading to severe intracranial hypotension, bridging cortical vein traction, and secondary subdural hematomas.
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-rose-400 mb-3">Occlusion, tPA &amp; Weaning Protocol</h3>
              <p className="text-sm text-slate-300 mb-2">
                <strong className="text-white">Catheter Occlusion &amp; Pulsatility:</strong> Normal EVD fluid menisci demonstrate brisk respiratory and cardiac pulse waveforms. A static, non-pulsatile meniscus indicates clot occlusion or parenchymal abutment. Sterile, gentle 1–2 mL preservative-free saline flush can restore patency.
              </p>
              <p className="text-sm text-slate-300 mb-2">
                <strong className="text-white">Intrathecal Thrombolysis (CLEAR III Protocol):</strong> In massive intraventricular hemorrhage (IVH), instilling 1 mg recombinant tissue plasminogen activator (rt-PA) followed by 1-hour clamping accelerates third and fourth ventricle blood clot clearance and reduces chronic shunt dependency.
              </p>
              <p className="text-sm text-slate-300">
                <strong className="text-white">EVD Challenge Weaning:</strong> Once CSF clears and the primary pathology stabilizes, the chamber is stepwise raised (e.g., to 20 cmH2O) over 24 hours and then clamped for 24 hours. If baseline ICP remains &lt; 20 mmHg without neurological deterioration, the drain can be safely pulled.
              </p>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
