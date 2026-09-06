import React from 'react';
import type { Metadata } from 'next';
import RightHeartCathSimulator from '@/components/simulators/RightHeartCathSimulator';

export const metadata: Metadata = {
  title: 'Right Heart Catheterization (RHC) & Fick Hemodynamics Workstation | Mediverse',
  description:
    'Pulmonology, critical care, and interventional cardiology workstation: Swan-Ganz catheter pressure waveforms, direct and indirect Fick cardiac output, Pulmonary Vascular Resistance (PVR), 2022 ESC/ERS Pulmonary Hypertension Phenotyping (Pre-capillary, Ipc-PH, Cpc-PH), and acute vasoreactivity challenge testing.',
};

export default function RightHeartCatheterizationPage() {
  return (
    <main>
      <RightHeartCathSimulator />

      {/* Curriculum Review Section */}
      <section className="bg-slate-950 border-t border-slate-800 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">
            High-Yield Clinical Review &mdash; Right Heart Catheterization, Fick Principles &amp; Pulmonary Hypertension
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-sky-400 mb-3">
                Fick Principle &amp; Cardiac Output Physics
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Fundamental conservation of mass applied to transpulmonary gas exchange:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-cyan-300">Direct Fick Principle:</strong> CO = VO2 / C(a-v)O2. Each gram of hemoglobin binds 1.34 mL of O2 when fully saturated. C(a-v)O2 = 1.34 &times; Hb &times; (SaO2 &minus; SvO2).
                </li>
                <li>
                  <strong className="text-purple-300">Thermodilution vs Fick:</strong> Thermodilution loses accuracy in severe tricuspid regurgitation (due to thermal indicator regurgitant recirculation) and low cardiac output states. Fick remains the clinical reference standard.
                </li>
                <li>
                  <strong className="text-amber-300">Mixed Venous Saturation (SvO2):</strong> True mixed venous blood must be sampled from the main pulmonary artery to ensure complete mixing of superior vena cava, inferior vena cava, and coronary sinus blood flows.
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-amber-400 mb-3">
                2022 ESC/ERS PH Phenotyping &amp; Gradients
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Hemodynamic thresholds defining pre-capillary vs post-capillary pulmonary vascular disease:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-rose-300">New Diagnostic Threshold:</strong> Resting mean pulmonary artery pressure mPAP &gt; 20 mmHg (lowered from 25 mmHg in the 2022 guidelines) defines pulmonary hypertension.
                </li>
                <li>
                  <strong className="text-cyan-300">Pre-Capillary PH (Group 1, 3, 4):</strong> mPAP &gt; 20 mmHg, normal wedge PAWP &le; 15 mmHg, and elevated pulmonary vascular resistance PVR &gt; 2.0 Wood Units (&gt; 160 dyn&middot;s&middot;cm&sup5;).
                </li>
                <li>
                  <strong className="text-emerald-300">Ipc-PH vs Cpc-PH (Group 2):</strong> Isolated post-capillary PH has PAWP &gt; 15 mmHg with PVR &le; 2.0 WU and DPG &lt; 7 mmHg. Combined post- and pre-capillary PH exhibits superimposed pulmonary arteriolar remodeling with PVR &gt; 2.0 WU and DPG &ge; 7 mmHg.
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-purple-400 mb-3">
                Right Ventricular Function &amp; Vasoreactivity
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Prognostic indices of RV uncoupling and vasodilator responsiveness:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-purple-300">PAPi RV Failure Index:</strong> Pulmonary Artery Pulsatility Index = (sPAP &minus; dPAP) / RAP. A PAPi &lt; 1.0 indicates severe right ventricular failure in cardiogenic shock, strongly predicting acute RV decompensation following left ventricular assist device (LVAD) placement.
                </li>
                <li>
                  <strong className="text-cyan-300">Acute Vasoreactivity Challenge:</strong> Inhaled Nitric Oxide (20 ppm) for 10 minutes. A positive Sitbon response requires a decrease in mPAP &ge; 10 mmHg to reach an absolute mPAP &le; 40 mmHg with preserved or increased cardiac output.
                </li>
                <li>
                  <strong className="text-rose-300">Therapeutic Implication:</strong> Only positive responders are candidates for high-dose Calcium Channel Blocker monotherapy. CCBs in non-responders cause negative inotropy, systemic hypotension, and acute circulatory collapse.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
