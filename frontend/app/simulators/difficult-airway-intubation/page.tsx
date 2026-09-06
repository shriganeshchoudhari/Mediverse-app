import React from 'react';
import type { Metadata } from 'next';
import DifficultAirwaySimulator from '@/components/simulators/DifficultAirwaySimulator';

export const metadata: Metadata = {
  title: 'Difficult Airway & Awake Fiberoptic Intubation Workstation | Mediverse',
  description:
    'Anesthesiology & Critical Care clinical workstation: Mallampati Class I–IV, Cormack-Lehane Grade 1–4, POGO score, STOP-BANG OSA risk, DAS 2015 Plan A–D algorithm, and CICO emergency scalpel-bougie cricothyroidotomy protocol.',
};

export default function DifficultAirwayPage() {
  return (
    <main>
      <DifficultAirwaySimulator />

      {/* High-Yield Curriculum Review Section */}
      <section className="bg-slate-950 border-t border-slate-800 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">
            High-Yield Clinical Review &mdash; Airway Assessment, DAS 2015 Guidelines &amp; CICO Emergency
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-sky-400 mb-3">
                Bedside Predictors &amp; Glottic View
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Preoperative airway evaluation combines multiple anatomical markers to predict difficult direct laryngoscopy:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-indigo-300">Mallampati &amp; ULBT:</strong> Class III/IV (soft palate only or hard palate only) and Upper Lip Bite Test Class 3 (inability to bite upper lip with lower incisors) reflect reduced mandibular subluxation and restricted pharyngeal space.
                </li>
                <li>
                  <strong className="text-amber-300">Thyromental Distance (&lt; 6.0 cm):</strong> Represents the mandibular space into which the tongue must be displaced during direct laryngoscopy. A short TMD indicates a receding chin (retrognathia) or anterior larynx.
                </li>
                <li>
                  <strong className="text-rose-300">Cormack-Lehane &amp; POGO Score:</strong> Grade 1 (complete glottis; POGO 100%), Grade 2a/2b (posterior cord visible vs arytenoids only), Grade 3 (epiglottis only), and Grade 4 (no glottic structures visible; POGO 0%). Grades 3 and 4 necessitate bougie or video laryngoscopy.
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-cyan-400 mb-3">
                DAS 2015 Step A&ndash;D Algorithm
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Difficult Airway Society (DAS) structured stepwise rescue protocol for unanticipated failed tracheal intubation:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-emerald-300">Plan A &mdash; Tracheal Intubation:</strong> Pre-oxygenate (ETO2 &gt; 85%), optimize head position (HELP ramp), use Macintosh/Video laryngoscope with bougie. Maximum 3 attempts (+1 attempt by experienced supervisor).
                </li>
                <li>
                  <strong className="text-blue-300">Plan B &mdash; SAD Rescue:</strong> Insert 2nd-generation Supraglottic Airway Device (i-gel or ProSeal with gastric drain channel). Maximum 2 attempts. If oxygenation is maintained, either wake the patient or proceed via fiberoptic through SAD.
                </li>
                <li>
                  <strong className="text-amber-300">Plan C &mdash; Facemask Bailout:</strong> Final attempt at oxygenation using 2-person mask technique and oropharyngeal airway. Administer Sugammadex (16 mg/kg) for immediate reversal of rocuronium-induced neuromuscular blockade to wake patient.
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-rose-400 mb-3">
                CICO Emergency &amp; Awake Intubation
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Life-saving emergency front-of-neck access (eFONA) and elective awake fiberoptic management:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-rose-300">Scalpel-Bougie-Tube Cricothyroidotomy:</strong> When Plan C fails, declare CICO immediately. Perform &ldquo;laryngeal handshake&rdquo;, transverse stab through cricothyroid membrane with #10 scalpel, rotate blade 90&deg; caudal, slide 15 Fr coud&eacute; bougie into trachea, and rail-road size 6.0 mm cuffed ETT.
                </li>
                <li>
                  <strong className="text-purple-300">Awake Tracheal Intubation (ATI):</strong> Gold standard for anticipated difficult airway (Ludwig&apos;s angina, pharyngeal tumor, severe trismus, stridor). Patient maintains spontaneous ventilation while upper airway is topicalized with 4% lidocaine under Remifentanil or Dexmedetomidine conscious sedation.
                </li>
                <li>
                  <strong className="text-yellow-300">STOP-BANG OSA Risk:</strong> Scores &ge; 5 identify severe OSA with high risk of immediate pharyngeal collapse upon induction and delayed recovery in PACU. Requires ramped positioning and early CPAP.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
