import React from 'react';
import type { Metadata } from 'next';
import TciAnesthesiaSimulator from '@/components/simulators/TciAnesthesiaSimulator';

export const metadata: Metadata = {
  title: 'TCI Anesthesia & Volatile MAC Solver | Mediverse',
  description:
    'Target-Controlled Infusion (TCI) and Age-Corrected Volatile MAC simulator: Marsh & Schnider 3-compartment Propofol kinetics, Minto Remifentanil pharmacodynamics, Mapleson age decay, BIS electrocortical depth monitoring, and context-sensitive half-time.',
};

export default function TciAnesthesiaPage() {
  return (
    <main>
      <TciAnesthesiaSimulator />

      {/* Curriculum Review Section */}
      <section className="bg-slate-950 border-t border-slate-800 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">
            High-Yield Clinical Review &mdash; Target-Controlled Infusion (TCI) &amp; Volatile Anesthetic Depth
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-indigo-400 mb-3">
                TIVA 3-Compartment Models &amp; Effect-Site Targeting
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Target-Controlled Infusion (TCI) uses pharmacokinetic-pharmacodynamic (PK/PD) algorithms to titrate IV anesthetics dynamically:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-cyan-300">Marsh vs Schnider Models:</strong> Marsh uses total body weight with fixed compartment volumes; Schnider incorporates James Lean Body Mass (LBM), height, and age, preventing dangerous overdosing in obese or elderly patients.
                </li>
                <li>
                  <strong className="text-emerald-300">Effect-Site Rate Constant (k<sub>e0</sub>):</strong> Dictates the rate of drug transfer between plasma (C<sub>p</sub>) and the brain effect-site (C<sub>e</sub>). Schnider uses a fast k<sub>e0</sub> (0.456 min<sup>-1</sup>), achieving rapid peak brain concentration within 1.6 minutes.
                </li>
                <li>
                  <strong className="text-amber-300">Plasma vs Effect-Site Targeting:</strong> In C<sub>e</sub> targeting, the pump delivers a larger initial bolus to achieve the desired brain concentration rapidly, followed by an automated infusion rate decrement.
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-sky-400 mb-3">
                Volatile MAC &amp; Mapleson Age-Decay Mechanics
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Minimum Alveolar Concentration (MAC) is the end-tidal concentration of vapor that prevents skeletal movement in 50% of subjects in response to surgical skin incision:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-cyan-300">Mapleson Age Equation:</strong> MAC declines exponentially by approximately 6% per decade past age 40: MAC<sub>age</sub> = MAC<sub>40</sub> &times; 10<sup>-0.00269 &times; (Age - 40)</sup>. An 80-year-old requires 25% less volatile anesthetic than a 40-year-old.
                </li>
                <li>
                  <strong className="text-emerald-300">Additive Volatiles &amp; Second Gas Effect:</strong> Volatile agents and Nitrous Oxide (N<sub>2</sub>O) are strictly additive in fraction of MAC (e.g. 0.5 MAC Sevoflurane + 0.5 MAC N<sub>2</sub>O = 1.0 MAC).
                </li>
                <li>
                  <strong className="text-amber-300">MAC-Awake vs MAC-BAR:</strong> MAC-Awake (0.35 MAC) is the threshold for eye-opening and voluntary response; MAC-BAR (1.5 MAC) blunts autonomic sympathetic response to noxious stimuli.
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-amber-400 mb-3">
                Depth Monitoring, CSHT &amp; Malignant Hyperthermia
              </h3>
              <p className="text-sm text-slate-300 mb-2">
                <strong className="text-white">Bispectral Index (BIS 40–60):</strong> Processed EEG derived from bispectral power and phase coherence. BIS &gt; 65 heralds impending awareness; BIS &lt; 30 with burst suppression increases postoperative cognitive dysfunction in elderly patients.
              </p>
              <p className="text-sm text-slate-300 mb-2">
                <strong className="text-white">Context-Sensitive Half-Time (CSHT):</strong> Remifentanil clearance is invariant (~3.5 min) because of rapid hydrolysis by non-specific plasma and tissue esterases. Propofol CSHT increases with duration as peripheral lipophilic tissues saturate.
              </p>
              <p className="text-sm text-slate-300">
                <strong className="text-rose-400">Malignant Hyperthermia Emergency:</strong> Triggered by halogenated volatiles and succinylcholine. Immediate protocol: turn off vaporizers, hyperventilate with 100% O<sub>2</sub>, switch to trigger-free TIVA, and push IV Dantrolene 2.5 mg/kg.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
