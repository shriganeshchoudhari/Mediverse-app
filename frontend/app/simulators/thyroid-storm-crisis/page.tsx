import React from 'react';
import type { Metadata } from 'next';
import ThyroidCrisisSimulator from '@/components/simulators/ThyroidCrisisSimulator';

export const metadata: Metadata = {
  title: 'Thyroid Storm & Myxedema Coma Crisis Workstation | Mediverse',
  description:
    'Endocrine emergency simulation workstation: Burch-Wartofsky Point Scale (BWPS) scoring for Thyroid Storm, 1-hour thionamide-to-iodine pharmacotherapy timing sequencer, and Popoveniuc Myxedema Coma triage and resuscitation protocols.',
};

export default function ThyroidStormCrisisPage() {
  return (
    <main>
      <ThyroidCrisisSimulator />

      {/* Curriculum Review Section */}
      <section className="bg-slate-950 border-t border-slate-800 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">
            High-Yield Clinical Review &mdash; Endocrine Emergencies, Thyroid Storm &amp; Myxedema Coma
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-amber-400 mb-3">
                Burch-Wartofsky Point Scale (BWPS) Triage
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Thyroid storm is a clinical diagnosis; total hormone levels do not reliably correlate with severity:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-emerald-300">&lt; 25 Points (Unlikely Storm):</strong> Continue conservative antithyroid therapy and monitor for precipitating events.
                </li>
                <li>
                  <strong className="text-amber-300">25 to 44 Points (Impending Storm):</strong> Requires ICU/step-down admission, aggressive antipyresis (acetaminophen; avoid aspirin as it displaces T4/T3 from TBG), and beta-blockade.
                </li>
                <li>
                  <strong className="text-rose-300">&gt;= 45 Points (Highly Suggestive of Storm):</strong> Emergency multimodal 5-step pharmacological intervention must be initiated immediately without waiting for repeat laboratory confirmation.
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-rose-400 mb-3">
                The 5-Step Multimodal Pharmacotherapy Sequence
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Strict sequential administration prevents catastrophic exacerbation of thyrotoxicity:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-cyan-300">1. Block Synthesis:</strong> Propylthiouracil (PTU 200 mg PO/NG q4h) is preferred over Methimazole in storm because PTU uniquely blocks peripheral 5&apos;-deiodinase, halting rapid peripheral T4-to-T3 activation.
                </li>
                <li>
                  <strong className="text-amber-300">2. Block Release (Wait &gt;= 60 min!):</strong> Inorganic iodine (Lugol&apos;s or SSKI) induces the Wolff-Chaikoff effect. It MUST be administered at least 1 hour AFTER the thionamide; otherwise, it fuels de novo hormone synthesis (Jod-Basedow effect).
                </li>
                <li>
                  <strong className="text-purple-300">3. Block Sympathetic Drive &amp; Deiodinase:</strong> High-dose Propranolol (60-80 mg PO q4h or IV Esmolol) blunts hyperadrenergic storm and further suppresses 5&apos;-monodeiodinase.
                </li>
                <li>
                  <strong className="text-emerald-300">4. Glucocorticoids:</strong> Hydrocortisone 100 mg IV q8h treats relative adrenal exhaustion and further curtails peripheral T3 generation.
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-cyan-400 mb-3">
                Myxedema Coma: Popoveniuc Score &amp; Resuscitation
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Extreme hypothyroid decompensation carries a 30-50% mortality if unrecognized:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-rose-300">Popoveniuc Score &gt;= 60:</strong> Diagnostic of myxedema coma. Classical triad: hypothermia (&lt;35.5&deg;C), altered mental status (obtundation/coma), and precipitating stressor (cold, sepsis, sedatives).
                </li>
                <li>
                  <strong className="text-purple-300">Steroids Before Thyroid Hormone:</strong> Stress-dose hydrocortisone (100 mg IV q8h) MUST be given BEFORE or with levothyroxine. Thyroid hormone speeds hepatic clearance of cortisol; giving T4 alone in undiagnosed Schmidt syndrome causes fatal Addisonian crisis.
                </li>
                <li>
                  <strong className="text-amber-300">Passive Rewarming:</strong> Avoid active external warming (heating blankets/warm baths) as rapid peripheral vasodilation precipitates irreversible circulatory collapse and refractory shock.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
