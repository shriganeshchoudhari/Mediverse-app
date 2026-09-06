import React from 'react';
import type { Metadata } from 'next';
import LaborPartogramSimulator from '@/components/simulators/LaborPartogramSimulator';

export const metadata: Metadata = {
  title: 'Labor Care Guide, Partogram & Bishop Score Solver | Mediverse',
  description:
    'Obstetrics and intrapartum care simulation workstation: Modified WHO Partogram (Alert and Action lines), Calder Modified Bishop Score for pre-induction cervical ripening, Montevideo Units (MVU) IUPC contraction physics, oxytocin tachysystole resuscitation, and cephalopelvic disproportion (CPD) diagnostics.',
};

export default function LaborPartogramPage() {
  return (
    <main>
      <LaborPartogramSimulator />

      {/* Curriculum Review Section */}
      <section className="bg-slate-950 border-t border-slate-800 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">
            High-Yield Clinical Review &mdash; WHO Partogram, Cervical Ripening &amp; Labor Dynamics
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-rose-400 mb-3">
                WHO Partogram &amp; Labor Progress Curves
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                The WHO Partogram visually tracks cervical dilatation against evidence-based progression boundaries:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-emerald-300">Alert Line (1 cm/h):</strong> Begins at active phase entry (4&ndash;5 cm dilatation) and slopes upward to 10 cm at a minimum rate of 1.0 cm per hour in nulliparas. Dilatation plotting to the right indicates protracted labor requiring transfer or obstetric assessment.
                </li>
                <li>
                  <strong className="text-rose-300">Action Line (+4 Hours):</strong> Parallel to the Alert line, displaced 4 hours to the right. Crossing the Action line represents secondary arrest of labor, mandating active intervention: artificial rupture of membranes (ARM), oxytocin augmentation, or operative delivery.
                </li>
                <li>
                  <strong className="text-amber-300">ACOG/SMFM Arrest Criteria:</strong> Spontaneous or induced labor &ge; 6 cm with ruptured membranes that fails to progress despite 4 hours of adequate contractions (&gt; 200 MVU) or 6 hours of oxytocin with inadequate contractions.
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-amber-400 mb-3">
                Bishop Score &amp; Pre-Induction Ripening
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Calder Modified Bishop scoring stratifies readiness for labor induction across 5 clinical parameters:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-emerald-300">Favorable Cervix (Score &ge; 8):</strong> Probability of vaginal delivery equals spontaneous labor onset. Patient is a candidate for direct amniotomy and low-dose oxytocin titration without pre-ripening.
                </li>
                <li>
                  <strong className="text-rose-300">Unfavorable Cervix (Score &le; 6):</strong> High rate of prolonged labor and failed induction if oxytocin is started immediately. Pre-induction cervical ripening is strongly indicated.
                </li>
                <li>
                  <strong className="text-sky-300">Ripening Modalities:</strong> Dinoprostone (PGE2) 10 mg controlled-release vaginal insert; Misoprostol (PGE1) 25 mcg orally/vaginally q4h (contraindicated in prior uterine scar); or Mechanical transcervical Foley / Cook double balloon (30&ndash;50 mL saline).
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-teal-400 mb-3">
                Uterine Dynamics &amp; Tachysystole Resuscitation
              </h3>
              <p className="text-sm text-slate-300 mb-2">
                <strong className="text-white">Montevideo Units (MVU):</strong> Calculated via Intrauterine Pressure Catheter (IUPC) as contraction frequency per 10 minutes multiplied by mean amplitude (mmHg) above basal tonus. Adequate active labor requires &ge; 200&ndash;250 MVU.
              </p>
              <p className="text-sm text-slate-300 mb-2">
                <strong className="text-rose-400">Uterine Tachysystole:</strong> Defined as &gt; 5 contractions per 10 minutes averaged over a 30-minute window. Restricts intervillous blood flow, causing progressive fetal hypoxemia and acidemia.
              </p>
              <p className="text-sm text-slate-300">
                <strong className="text-cyan-300">Intrauterine Resuscitation Bundle:</strong> Immediately discontinue Oxytocin; turn patient to left lateral decubitus; administer 500&ndash;1000 mL IV fluid bolus (Lactated Ringer); deliver 10 L/min O&sub2; via non-rebreather; and administer Subcutaneous Terbutaline 0.25 mg if fetal heart rate decelerations persist.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
