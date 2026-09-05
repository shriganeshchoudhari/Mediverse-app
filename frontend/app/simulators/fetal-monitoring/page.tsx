import React from 'react';
import type { Metadata } from 'next';
import FetalMonitoringSimulator from '@/components/simulators/FetalMonitoringSimulator';

export const metadata: Metadata = {
  title: 'Fetal Monitoring & CTG Interpretation | Mediverse',
  description: 'Cardiotocography (CTG) biophysical simulator: NICHD 3-tier categories, early/late/variable/sinusoidal decelerations, Montevideo units, Bishop score, and intrauterine resuscitation protocols.',
};

export default function FetalMonitoringPage() {
  return (
    <main>
      <FetalMonitoringSimulator />

      {/* Curriculum Section */}
      <section className="bg-slate-950 border-t border-slate-800 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">High-Yield Board Review — Obstetrics &amp; Intrapartum Fetal Monitoring</h2>
          <div className="grid md:grid-cols-3 gap-6">

            {/* Card 1 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-rose-400 mb-3">NICHD 3-Tier Classification System</h3>
              <p className="text-sm text-slate-300 mb-3">
                ACOG and NICHD categorize electronic fetal monitoring tracings into three distinct tiers:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-emerald-400">Category I (Normal):</strong> Baseline 110–160 bpm, moderate variability (6–25 bpm), absent late or variable decelerations. Early decelerations and accelerations may be present or absent. Strongly predictive of normal fetal umbilical cord pH.
                </li>
                <li>
                  <strong className="text-amber-400">Category II (Indeterminate):</strong> Not Category I or III. Minimal variability, absent variability without recurrent decelerations, marked variability, absence of induced accelerations, or recurrent variable/late decelerations with moderate variability. Requires ongoing evaluation and intrauterine resuscitation.
                </li>
                <li>
                  <strong className="text-rose-400">Category III (Abnormal):</strong> Absent baseline variability PLUS recurrent late decels, recurrent variable decels, or bradycardia (&lt;110 bpm); OR a sinusoidal pattern. Predictive of abnormal fetal acidemia. Requires prompt delivery preparation.
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-amber-400 mb-3">Deceleration Biophysics &amp; Pathophysiology</h3>
              <p className="text-sm text-slate-300 mb-3">
                Decelerations reflect autonomic responses to intrapartum physiological stressors:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-cyan-300">Early Decelerations (Head Compression):</strong> Symmetric nadir synchronous with contraction peak (mirror image). Caused by fetal head compression stimulating vagal tone (dural stretch). Benign — no intervention required.
                </li>
                <li>
                  <strong className="text-rose-300">Late Decelerations (Uteroplacental Insufficiency):</strong> Gradual drop with nadir occurring AFTER the contraction peak. Caused by transient hypoxemia triggering chemoreceptor-mediated vagal discharge and myocardial depression.
                </li>
                <li>
                  <strong className="text-yellow-300">Variable Decelerations (Cord Compression):</strong> Abrupt decrease (&lt;30s to nadir) &ge;15 bpm for &ge;15s. Caused by umbilical vein/artery occlusion inducing systemic afterload spikes and baroreceptor stimulation. Characterized by pre- and post-shoulders.
                </li>
                <li>
                  <strong className="text-purple-300">Sinusoidal Pattern:</strong> Smooth 3–5 cycles/min sine wave with absent variability. Classic for severe fetal anemia (Rh alloimmunization, parvovirus B19, fetomaternal hemorrhage).
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-cyan-400 mb-3">Resuscitation &amp; Induction (Bishop Score)</h3>
              <p className="text-sm text-slate-300 mb-2">
                <strong className="text-white">Intrauterine Resuscitation:</strong> Five core maneuvers to restore fetal oxygenation:
              </p>
              <ol className="text-sm text-slate-400 list-decimal list-inside space-y-1 mb-3">
                <li>Maternal repositioning (Left lateral decubitus to relieve IVC / aortic compression).</li>
                <li>IV fluid bolus (500–1000 mL crystalloid to expand maternal plasma volume).</li>
                <li>Discontinue uterotonics (Stop oxytocin infusion immediately).</li>
                <li>Supplemental oxygen (10 L/min non-rebreather mask if maternal hypoxia).</li>
                <li>Tocolytic therapy (Terbutaline 0.25 mg SC for uterine tachysystole &gt;5 contractions in 10 min).</li>
              </ol>
              <p className="text-sm text-slate-300">
                <strong className="text-white">Modified Bishop Score (0–13):</strong> Assesses cervical readiness for labor induction: Dilation (0–3), Effacement (0–3), Station (0–3), Consistency (0–2), and Position (0–2). A score &ge;8 predicts vaginal delivery success comparable to spontaneous labor; &lt;6 indicates an unripe cervix requiring cervical ripening agents (Dinoprostone, Misoprostol, or Foley bulb).
              </p>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
