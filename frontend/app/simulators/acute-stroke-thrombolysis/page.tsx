import React from 'react';
import type { Metadata } from 'next';
import AcuteStrokeThrombolysisSimulator from '@/components/simulators/AcuteStrokeThrombolysisSimulator';

export const metadata: Metadata = {
  title: 'Acute Stroke Thrombolysis & Thrombectomy Workstation | Mediverse',
  description:
    'Neurology emergency and acute stroke simulation workstation: NIH Stroke Scale (NIHSS) assessment, Alberta Stroke Program Early CT Score (ASPECTS) mapping, Tenecteplase (TNK-tPA) and Alteplase (rtPA) precision dosing, blood pressure thresholds, and Large Vessel Occlusion (LVO) mechanical thrombectomy criteria.',
};

export default function AcuteStrokeThrombolysisPage() {
  return (
    <main>
      <AcuteStrokeThrombolysisSimulator />

      {/* Curriculum Review Section */}
      <section className="bg-slate-950 border-t border-slate-800 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">
            High-Yield Clinical Review &mdash; Acute Ischemic Stroke, Reperfusion &amp; Neuroprotection
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-purple-400 mb-3">
                NIHSS &amp; ASPECTS Early Neuro-Imaging
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Standardized clinical and radiographic metrics dictate urgent stroke management:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-cyan-300">NIHSS &gt;= 6 as LVO Predictor:</strong> While any disabling deficit warrants thrombolysis evaluation, an NIHSS &gt;= 6 carries a high probability of proximal large vessel occlusion (ICA terminus or MCA M1) warranting immediate CT angiography.
                </li>
                <li>
                  <strong className="text-purple-300">ASPECTS Scoring (0 to 10):</strong> 10 defined MCA territories are assessed on non-contrast CT. Each region displaying loss of grey-white distinction or sulcal effacement loses 1 point. Scores &gt;= 6 confirm small-to-moderate core infarct eligible for standard EVT.
                </li>
                <li>
                  <strong className="text-rose-300">Low ASPECTS (&lt;= 5):</strong> Reflects large completed core infarct (&gt;1/3 MCA territory) with heightened risk of fatal hemorrhagic transformation upon reperfusion.
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-cyan-400 mb-3">
                Tenecteplase vs Alteplase Dosing Protocols
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Current AHA/ASA guidelines embrace Tenecteplase for acute ischemic stroke:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-cyan-300">Tenecteplase (TNK-tPA):</strong> 0.25 mg/kg IV (max 25 mg) given as a single 5-second rapid bolus. High fibrin specificity and 6-fold longer half-life streamline administration and increase pre-EVT recanalization rates.
                </li>
                <li>
                  <strong className="text-amber-300">Alteplase (rtPA):</strong> 0.9 mg/kg (max 90 mg) total dose; 10% given as IV bolus over 1 minute, remaining 90% infused over 60 minutes.
                </li>
                <li>
                  <strong className="text-emerald-300">Time Windows:</strong> 0 to 4.5 hours from Last Known Well. In the 3.0 to 4.5-hour window, ECASS III relative exclusions (age &gt; 80, prior stroke + diabetes, oral anticoagulation, NIHSS &gt; 25) warrant clinical consensus.
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-emerald-400 mb-3">
                Endovascular Thrombectomy &amp; BP Control
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Catheter-based mechanical recanalization and strict hemodynamic control save penumbral tissue:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-purple-300">Extended Window (6 to 24h):</strong> DAWN and DEFUSE-3 trials demonstrated substantial benefit for EVT in wake-up or delayed strokes presenting with clinical-core or perfusion-core mismatch (ischemic core &lt; 70 mL with penumbra mismatch ratio &gt;= 1.8).
                </li>
                <li>
                  <strong className="text-rose-300">Pre-Lysis BP (&le;185/110 mmHg):</strong> If SBP &gt; 185 or DBP &gt; 110, lower immediately with IV Labetalol 10-20 mg or Nicardipine infusion (5-15 mg/h). Do not give lytic until BP is below threshold.
                </li>
                <li>
                  <strong className="text-amber-300">Post-Reperfusion Target:</strong> Maintain SBP &le;180 mmHg and DBP &le;105 mmHg for 24 hours post-thrombolysis. Following successful complete recanalization (mTICI 3), cautious titration to SBP &lt; 140 mmHg reduces reperfusion edema.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
