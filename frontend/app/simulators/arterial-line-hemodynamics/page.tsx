import React from 'react';
import type { Metadata } from 'next';
import ArterialLineHemodynamicsSimulator from '@/components/simulators/ArterialLineHemodynamicsSimulator';

export const metadata: Metadata = {
  title: 'Arterial Line Hemodynamics, PPV & Fluid Responsiveness Workstation | Mediverse',
  description:
    'Critical Care & Anesthesiology workstation: Invasive arterial blood pressure monitoring, Pulse Pressure Variation (PPV), Stroke Volume Variation (SVV), Dynamic Arterial Elastance (Ea_dyn), and Fast-Flush Square Wave Test damping analysis.',
};

export default function ArterialLineHemodynamicsPage() {
  return (
    <main>
      <ArterialLineHemodynamicsSimulator />

      {/* High-Yield Curriculum Review Section */}
      <section className="bg-slate-950 border-t border-slate-800 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">
            High-Yield Clinical Review &mdash; Arterial Pulse Contour, Dynamic Fluid Indices &amp; Damping
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-rose-400 mb-3">
                Pulse Waveform Anatomy &amp; Damping Tests
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Invasive arterial pressure monitoring relies on an acoustic fluid column transmitting intra-arterial pressure pulses to a piezoresistive transducer:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-rose-300">Waveform Landmarks:</strong> Rapid anacrotic upstroke (systolic ejection velocity dP/dt), peak systolic pressure (PSP), dicrotic notch (incisura marking aortic valve closure and end of left ventricular systole), and exponential diastolic runoff slope (determined by arterial compliance and systemic vascular resistance).
                </li>
                <li>
                  <strong className="text-amber-300">Underdamping (&zeta; &lt; 0.40):</strong> Caused by stiff compliant tubing, multiple stopcocks, or excessive line length. Resonance causes systolic ringing overshoot (&gt; 2&ndash;3 post-flush oscillations). Systolic BP is falsely elevated by 15&ndash;30 mmHg, while diastolic BP is falsely low. Mean Arterial Pressure (MAP) remains accurate.
                </li>
                <li>
                  <strong className="text-sky-300">Overdamping (&zeta; &gt; 0.75):</strong> Caused by micro-air bubbles in the transducer dome, intraluminal blood clots, or kinked catheter. Blunts high-frequency transients, producing a sluggish upstroke, absent dicrotic notch, and falsely low SBP.
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-sky-400 mb-3">
                Heart-Lung Interactions &amp; PPV Cutoffs
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                In positive-pressure mechanical ventilation, inspiration expands the lungs and increases pleural pressure, cyclically modulating venous return:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-emerald-300">PPV &gt; 13% (Fluid Responsive):</strong> Indicates the patient is operating on the ascending limb of the Frank-Starling cardiac function curve. A 500 mL crystalloid infusion will reliably produce a &ge; 10&ndash;15% increase in stroke volume and cardiac index.
                </li>
                <li>
                  <strong className="text-rose-300">PPV &lt; 9% (Non-Responsive):</strong> Indicates the heart is operating on the flat plateau of the Frank-Starling curve. Further fluid administration will precipitate hydrostatic pulmonary edema, right ventricular strain, and fluid overload morbidity.
                </li>
                <li>
                  <strong className="text-amber-300">Gray Zone (9 &ndash; 13%):</strong> Intermediate territory. Requires confirmatory dynamic maneuvers such as a Tidal Volume Challenge (&Delta;PPV &gt; 3.5%) or Passive Leg Raising (PLR &Delta;SV &gt; 10%).
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-indigo-400 mb-3">
                Dynamic Arterial Elastance (Ea_dyn) &amp; Confounders
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Clinical nuances and strict prerequisites essential for interpreting functional hemodynamic monitoring:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-purple-300">Dynamic Arterial Elastance (Ea_dyn = PPV / SVV):</strong> Quantifies arterial vasomotor tone. If Ea_dyn &ge; 0.8&ndash;1.0, volume expansion increases both SV and MAP. If Ea_dyn &lt; 0.8, the patient has profound vasoplegic shock (e.g. septic shock); volume expands SV but MAP fails to rise. Vasopressor (Norepinephrine) uptitration is indicated.
                </li>
                <li>
                  <strong className="text-rose-300">Mandatory PPV Prerequisites:</strong> Must have (1) full mechanical ventilation without spontaneous breathing efforts, (2) tidal volume &ge; 8 mL/kg predicted body weight, (3) regular sinus rhythm, (4) closed chest, and (5) absence of severe acute cor pulmonale / right ventricular failure.
                </li>
                <li>
                  <strong className="text-emerald-300">Passive Leg Raising (PLR):</strong> Gold-standard reversible autotransfusion of ~300&ndash;500 mL from lower extremities. An increase in cardiac output &gt; 10% confirms fluid responsiveness even in patients with arrhythmias, low tidal volumes, or spontaneous breathing efforts.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
