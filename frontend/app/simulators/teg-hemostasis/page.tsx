import React from 'react';
import type { Metadata } from 'next';
import TegHemostasisSimulator from '@/components/simulators/TegHemostasisSimulator';

export const metadata: Metadata = {
  title: 'Thromboelastography TEG / ROTEM & Transfusion Solver | Mediverse',
  description: 'Viscoelastic coagulation and hemostasis workstation: TEG clot kinetics (R, K, alpha, MA, LY30), ROTEM 5-assay differential diagnostics (FIBTEM, HEPTEM, APTEM), and goal-directed targeted transfusion algorithms.',
};

export default function TegHemostasisPage() {
  return (
    <main>
      <TegHemostasisSimulator />

      {/* Curriculum Review Section */}
      <section className="bg-slate-950 border-t border-slate-800 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">
            High-Yield Clinical Review — Viscoelastic Hemostasis &amp; Transfusion Medicine
          </h2>
          <div className="grid md:grid-cols-3 gap-6">

            {/* Card 1 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-rose-400 mb-3">
                TEG Kinetics &amp; Clot Elasticity Mechanics
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Thromboelastography (TEG) measures the shear elastic modulus of whole blood during clot formation, strengthening, and dissolution:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-cyan-300">Reaction Time (R):</strong> Time to initial 2 mm clot detection (Normal: 5–10 min). Prolonged R indicates clotting factor deficiency or heparin anticoagulation; treat with FFP, 4-Factor PCC, or Protamine.
                </li>
                <li>
                  <strong className="text-emerald-300">K-Time &amp; &alpha;-Angle:</strong> Rate of clot strengthening to 20 mm amplitude (K: 1–3 min) and slope tangent angle (&alpha;: 53&deg;–72&deg;). Reflects the thrombin burst and fibrinogen cleavage speed into fibrin polymers.
                </li>
                <li>
                  <strong className="text-amber-300">Maximum Amplitude (MA):</strong> Peak clot mechanical strength (Normal: 50–70 mm). Dependent 80% on platelet count and functional GPIIb/IIIa receptors, and 20% on fibrinogen cross-linking.
                </li>
                <li>
                  <strong className="text-rose-300">Clot Lysis (LY30):</strong> Percentage reduction in clot area 30 minutes after reaching MA (Normal: 0–3%). LY30 &gt; 3%–8% confirms pathological hyperfibrinolysis requiring urgent Tranexamic Acid (TXA).
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-purple-400 mb-3">
                ROTEM Differential 5-Assay Logic
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Rotational Thromboelastometry (ROTEM) employs differential reagents to rapidly dissect underlying coagulopathies:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-emerald-300">FIBTEM (+ Cytochalasin D):</strong> Chemically paralyzes platelets to isolate the pure contribution of fibrinogen to clot firmness. FIBTEM MCF &lt; 10 mm is an absolute trigger for Cryoprecipitate or Fibrinogen Concentrate.
                </li>
                <li>
                  <strong className="text-amber-300">HEPTEM (+ Heparinase):</strong> Degrades heparin. If INTEM Clotting Time (CT) is prolonged but HEPTEM CT is normal, circulating heparin is confirmed and Protamine is indicated.
                </li>
                <li>
                  <strong className="text-sky-300">APTEM (+ Aprotinin / TXA):</strong> Inhibits fibrinolysis. If hyperlysis in EXTEM normalizes in APTEM, primary hyperfibrinolysis is definitively confirmed.
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-amber-400 mb-3">
                The Lethal Triad &amp; CRASH-2 / PROPPR Protocols
              </h3>
              <p className="text-sm text-slate-300 mb-2">
                <strong className="text-white">Lethal Triad / Diamond of Death:</strong> Hypothermia (&lt; 35&deg;C), Acidosis (pH &lt; 7.20), and Dilutional Coagulopathy, with Hypocalcemia (ionized Ca &lt; 1.0 mmol/L) as the 4th lethal pillar. Enzymatic coagulation cascade activity drops drastically for every 1&deg;C reduction in core temperature.
              </p>
              <p className="text-sm text-slate-300 mb-2">
                <strong className="text-white">CRASH-2 TXA Golden Rule:</strong> Early IV Tranexamic Acid (1g bolus over 10 min + 1g infusion over 8 hours) significantly improves survival in bleeding trauma patients when started within 3 hours of injury.
              </p>
              <p className="text-sm text-slate-300">
                <strong className="text-rose-400">Targeted vs Blind Resuscitation:</strong> TEG/ROTEM-guided transfusion algorithms prevent unnecessary transfusions, preserve scarce blood bank resources, and reduce transfusion-related acute lung injury (TRALI).
              </p>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
