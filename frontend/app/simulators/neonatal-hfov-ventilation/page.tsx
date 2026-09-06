import React from 'react';
import type { Metadata } from 'next';
import NeonatalHfovSimulator from '@/components/simulators/NeonatalHfovSimulator';

export const metadata: Metadata = {
  title: 'Neonatal HFOV & Surfactant Kinematics Workstation | Mediverse',
  description:
    'Neonatal & Pediatric Critical Care workstation: High-Frequency Oscillatory Ventilation (HFOV), sub-dead-space gas transport (Taylor dispersion, Pendelluft), Open-Lung hysteresis recruitment, and exogenous surfactant kinetics (LISA/MIST).',
};

export default function NeonatalHfovPage() {
  return (
    <main>
      <NeonatalHfovSimulator />

      {/* High-Yield Curriculum Review Section */}
      <section className="bg-slate-950 border-t border-slate-800 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">
            High-Yield Clinical Review &mdash; Neonatal HFOV, Gas Transport Physics &amp; Surfactant Mechanics
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-cyan-400 mb-3">
                Sub-Dead-Space Gas Transport Physics
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                On HFOV, tidal volume (1.0 &ndash; 2.5 mL/kg) is substantially smaller than anatomical dead space (2.5 &ndash; 3.0 mL/kg). Gas exchange occurs through five non-bulk convective mechanisms:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-cyan-300">Taylor Dispersion:</strong> Velocity gradients between rapid central axial gas and slower boundary-layer gas create longitudinal shear. Radial molecular diffusion across these streamlines greatly enhances axial CO2 clearance.
                </li>
                <li>
                  <strong className="text-purple-300">Pendelluft:</strong> Inter-alveolar gas exchange occurring between adjacent units possessing disparate time constants (resistance &times; compliance). Gas sloshes out of fast-filling units into slow-filling units before exhalation.
                </li>
                <li>
                  <strong className="text-emerald-300">Asymmetric Velocity Profiles:</strong> Inspiration produces a sharp central bullet-shaped velocity peak, while active expiration forms a flat velocity annulus along the airway wall, generating net forward core flow and peripheral expiratory egress.
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-purple-400 mb-3">
                HFOV Carbon Dioxide Kinetics &amp; DCO2
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Unlike conventional ventilation where alveolar ventilation is linear with frequency (VA = f &times; Vt), HFOV ventilation is governed by:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-purple-300">Diffusion Coefficient (DCO2 = f &times; Vt&sup2;):</strong> Carbon dioxide elimination is proportional to the <em>square</em> of the oscillatory tidal volume. Therefore, small changes in Amplitude (&Delta;P) dramatically change PaCO2.
                </li>
                <li>
                  <strong className="text-amber-300">Counter-Intuitive Frequency Rule:</strong> To blow off CO2 in hypercapnia, one must <strong>decrease</strong> the oscillatory frequency (e.g. 12 Hz &rarr; 10 Hz). Lower frequency provides a longer piston cycle time, increasing stroke displacement and tidal volume, which quadratically increases DCO2!
                </li>
                <li>
                  <strong className="text-rose-300">Hypocapnia Danger (PVL):</strong> Extreme hypocapnia (PaCO2 &lt; 35 mmHg) induces intense cerebral arteriolar vasoconstriction, causing periventricular leukomalacia (PVL) and neurodevelopmental impairment. Promptly wean amplitude or raise frequency when compliance surges.
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-emerald-400 mb-3">
                Open-Lung Strategy &amp; LISA Surfactant
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Optimal alveolar recruitment maneuvers and non-invasive surfactant delivery:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-cyan-300">Laplace&apos;s Law (P = 2&gamma; / r):</strong> Without surfactant, surface tension (&gamma;) is high (~70 mN/m), generating crushing collapsing pressure in small-radius alveoli. Exogenous surfactant (Poractant alfa 200 mg/kg) drops &gamma; to &lt; 5 mN/m, preventing atelectasis.
                </li>
                <li>
                  <strong className="text-emerald-300">Deflation Limb Optimization:</strong> Increment mPaw in 1&ndash;2 cmH2O steps until oxygenation improves (opening pressure), then decrement stepwise to identify closing pressure (Pclose). Setting optimal mPaw at Pclose + 2 cmH2O maintains the lung on the high-compliance deflation limb with minimal distending pressure.
                </li>
                <li>
                  <strong className="text-indigo-300">LISA / MIST Delivery:</strong> Administering surfactant via a 16-gauge vascular catheter into the trachea during spontaneous breathing on nCPAP avoids positive pressure barotrauma and reduces the incidence of bronchopulmonary dysplasia (BPD).
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
