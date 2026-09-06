import React from 'react';
import type { Metadata } from 'next';
import PulmonaryEmbolismSimulator from '@/components/simulators/PulmonaryEmbolismSimulator';

export const metadata: Metadata = {
  title: 'Pulmonary Embolism Severity, RV Strain & Thrombolysis (CDT) Workstation | Mediverse',
  description:
    'Interventional Cardiology & Critical Care clinical workstation: ESC/AHA risk stratification, sPESI prognostic scoring, echocardiographic RV strain, systemic Alteplase, and EKOS catheter-directed thrombolysis.',
};

export default function PulmonaryEmbolismPage() {
  return (
    <main>
      <PulmonaryEmbolismSimulator />

      {/* High-Yield Curriculum Review Section */}
      <section className="bg-slate-950 border-t border-slate-800 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">
            High-Yield Clinical Review &mdash; ESC PE Risk Stratification, RV Strain &amp; Reperfusion Modalities
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-rose-400 mb-3">
                ESC / AHA Risk Stratification
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Risk stratification dictates the urgency and invasiveness of clinical management:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-rose-300">High-Risk (Massive PE):</strong> Defined by hemodynamic instability (sustained SBP &lt; 90 mmHg for &gt; 15 min, vasopressor requirement, or cardiac arrest). 30-day mortality exceeds 15&ndash;30%. Mandates immediate systemic thrombolysis or surgical/percutaneous embolectomy.
                </li>
                <li>
                  <strong className="text-amber-300">Intermediate-High Risk (Submassive):</strong> Hemodynamically stable (SBP &ge; 90 mmHg) BUT positive for BOTH RV dysfunction (RV/LV &ge; 0.9, TAPSE &lt; 16 mm) and myocardial injury (elevated Troponin I or BNP). High risk of secondary decompensation (~10%); requires ICU monitoring, UFH, and consideration of catheter-directed thrombolysis.
                </li>
                <li>
                  <strong className="text-emerald-300">Low-Risk PE &amp; sPESI Score:</strong> sPESI = 0 (age &le; 80, no cancer, no chronic lung/heart disease, HR &lt; 110, SBP &ge; 100, SpO2 &ge; 90%) has a 30-day mortality of only 1.0%. Eligible for early discharge or outpatient DOAC therapy.
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-sky-400 mb-3">
                RV Strain &amp; McConnell&apos;s Sign
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Acute pulmonary arterial obstruction imposes a sudden afterload mismatch on the thin-walled right ventricle:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-sky-300">RV/LV Diameter Ratio &ge; 0.9:</strong> End-diastolic RV diameter exceeding LV diameter on 4-chamber echo or axial CTPA indicates acute cor pulmonale and is an independent predictor of in-hospital mortality.
                </li>
                <li>
                  <strong className="text-indigo-300">McConnell&apos;s Sign:</strong> Severe hypokinesia or akinesia of the mid-RV free wall with preserved, hyperdynamic apical contraction. Highly specific for acute pulmonary thromboembolism.
                </li>
                <li>
                  <strong className="text-purple-300">Paradoxical Septal D-Sign:</strong> Interventricular septal flattening and leftward shift during diastole and systole, mechanically impairing left ventricular filling and reducing stroke volume.
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-amber-400 mb-3">
                Reperfusion &amp; Catheter Modalities
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Balancing rapid clot debulking against the catastrophic risk of intracranial hemorrhage:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-rose-300">Systemic Alteplase (tPA):</strong> Full-dose 100 mg IV over 2 hours (or 50 mg half-dose MOPETT protocol). Discontinue therapeutic heparin during infusion. Carries a 2 to 3% intracranial hemorrhage risk.
                </li>
                <li>
                  <strong className="text-sky-300">EKOS Ultrasound-Accelerated CDT:</strong> Bilateral catheters deliver 2.2 MHz high-frequency ultrasound to disaggregate fibrin mesh, accelerating uptake of low-dose tPA (0.5&ndash;1.0 mg/hr/catheter, total 12&ndash;24 mg). Proven in ULTIMA and SEATTLE II trials with &lt; 1.5% major bleeding.
                </li>
                <li>
                  <strong className="text-purple-300">Mechanical Aspiration (FlowTriever):</strong> 20&ndash;24 Fr aspiration system physically extracts emboli without thrombolytics. Essential for massive PE in patients with absolute contraindications (recent surgery, CNS hemorrhage).
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
