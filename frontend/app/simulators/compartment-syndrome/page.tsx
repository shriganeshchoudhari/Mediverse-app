import React from 'react';
import type { Metadata } from 'next';
import OrthopedicCompartmentSimulator from '@/components/simulators/OrthopedicCompartmentSimulator';

export const metadata: Metadata = {
  title: 'Orthopedic Surgery & Compartment Syndrome | Mediverse',
  description: 'Orthopedic traumatology simulator: Whitesides intracompartmental pressure manometry, Delta P perfusion calculation, lower leg 4-compartment anatomy, 2-incision emergent fasciotomy, and Volkmann ischemic contracture prevention.',
};

export default function OrthopedicCompartmentPage() {
  return (
    <main>
      <OrthopedicCompartmentSimulator />

      {/* Curriculum Section */}
      <section className="bg-slate-950 border-t border-slate-800 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">High-Yield Board Review — Orthopedic Surgery &amp; Compartment Syndrome</h2>
          <div className="grid md:grid-cols-3 gap-6">

            {/* Card 1 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-cyan-400 mb-3">Diagnostic Criteria &amp; Delta P Biophysics</h3>
              <p className="text-sm text-slate-300 mb-3">
                Acute Compartment Syndrome (ACS) occurs when tissue pressure within an osseofascial space exceeds capillary perfusion pressure:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-rose-400">Delta P Concept (McQueen / Whitesides):</strong> Absolute compartment pressure (&ge;30 mmHg) was historically used, but modern standards rely on perfusion pressure: <code className="text-amber-300">&Delta;P = Diastolic BP &minus; ICP</code>. A &Delta;P &le; 30 mmHg represents critical microvascular collapse requiring emergent surgical decompression.
                </li>
                <li>
                  <strong className="text-amber-300">The 6 P&apos;s (Clinical Presentation):</strong> Pain out of proportion to injury (earliest, most sensitive), Pain on passive muscle stretch, Paresthesia (indicates ischemia to traversing nerve), Pallor, Poikilothermia, and Pulselessness (late, ominous sign of irreversible muscle death).
                </li>
                <li>
                  <strong className="text-cyan-300">Limb Position Pitfall:</strong> Elevating an ischemic limb above the heart level drops local arterial hydrostatic pressure, narrowing &Delta;P and worsening cellular necrosis. Keep limb strictly at heart level.
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-yellow-400 mb-3">Lower Leg 4-Compartment Surgical Anatomy</h3>
              <p className="text-sm text-slate-300 mb-3">
                The leg contains four rigid fascial compartments bounded by the tibia, fibula, and interosseous membrane:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-cyan-300">Anterior Compartment:</strong> Contains Tibialis anterior, EHL, EDL, Anterior tibial artery, and Deep Peroneal Nerve. Nerve deficit causes numbness in the 1st dorsal web space and foot drop.
                </li>
                <li>
                  <strong className="text-emerald-300">Lateral Compartment:</strong> Contains Peroneus longus and brevis, and Superficial Peroneal Nerve. Deficit causes lateral calf/foot dorsum hypoesthesia and loss of eversion.
                </li>
                <li>
                  <strong className="text-amber-300">Superficial Posterior:</strong> Gastrocnemius, soleus, plantaris, and sural nerve.
                </li>
                <li>
                  <strong className="text-purple-300">Deep Posterior:</strong> Tibialis posterior, FHL, FDL, posterior tibial vessels, and Tibial Nerve. Deficit causes plantar foot anesthesia and loss of toe flexion. Most frequently missed compartment during inadequate decompression.
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-rose-400 mb-3">Two-Incision Fasciotomy &amp; Complications</h3>
              <p className="text-sm text-slate-300 mb-2">
                <strong className="text-white">Two-Incision Technique:</strong> Anterolateral incision midway between fibula and tibial crest releases the anterior and lateral compartments via separate longitudinal fascial incisions (protecting the superficial peroneal nerve as it exits anteriorly). Posteromedial incision 2 cm posterior to the posterior tibial border releases the superficial and deep posterior compartments (taking down the soleus bridge from the tibia).
              </p>
              <p className="text-sm text-slate-300 mb-2">
                <strong className="text-white">Time to Decompression:</strong> Decompression within 6 hours achieves near 100% functional muscle recovery. Beyond 8–12 hours, irreversible myoneural necrosis sets in. Beyond 24 hours, fasciotomy carries a high risk of fatal sepsis and severe reperfusion rhabdomyolysis; conservative management or primary amputation is debated.
              </p>
              <p className="text-sm text-slate-300">
                <strong className="text-white">Volkmann Ischemic Contracture:</strong> In the upper extremity (often after pediatric supracondylar humerus fractures), missed forearm compartment syndrome leads to ischemic flexion contracture of the wrist and digits with severe intrinsic wasting.
              </p>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
