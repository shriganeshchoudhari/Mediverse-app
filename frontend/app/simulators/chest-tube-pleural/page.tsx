import React from 'react';
import type { Metadata } from 'next';
import ChestTubePleuralSimulator from '@/components/simulators/ChestTubePleuralSimulator';

export const metadata: Metadata = {
  title: 'Pleural Dynamics & Chest Tube Thoracostomy | Mediverse',
  description: 'Critical care pulmonology and trauma workstation: intrapleural pressure dynamics, 3-chamber water seal drainage (collection, water seal, suction), air leak grading, and ATLS massive hemothorax emergency protocols.',
};

export default function ChestTubePleuralPage() {
  return (
    <main>
      <ChestTubePleuralSimulator />

      {/* Curriculum Review Section */}
      <section className="bg-slate-950 border-t border-slate-800 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">High-Yield Clinical Review — Pleural Dynamics &amp; Tube Thoracostomy</h2>
          <div className="grid md:grid-cols-3 gap-6">

            {/* Card 1 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-sky-400 mb-3">Pleural Mechanics &amp; Triangle of Safety</h3>
              <p className="text-sm text-slate-300 mb-3">
                The pleural space is a potential space between visceral and parietal pleura with a thin layer of lubricating fluid (~0.1–0.2 mL/kg):
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-emerald-300">Intrapleural Pressure Swing:</strong> Normally subatmospheric, ranging from &minus;8 cmH2O at end-inspiration to &minus;4 cmH2O at end-expiration. Transpulmonary distending pressure (<code className="text-cyan-300">Ptp = Palv &minus; Ppl</code>) maintains alveolar patency against inward chest wall elastance.
                </li>
                <li>
                  <strong className="text-cyan-300">Tension Hemodynamic Collapse:</strong> A one-way flap valve allows air into the pleural cavity on inspiration without exit on expiration. Intrapleural pressure spikes to &ge; +15 cmH2O, collapsing the ipsilateral lung, shifting mediastinal structures, and kinking the inferior vena cava (IVC), producing obstructive shock.
                </li>
                <li>
                  <strong className="text-amber-300">The Triangle of Safety:</strong> Anatomical landmark for tube thoracostomy insertion bordered anteriorly by the lateral border of Pectoralis Major, posteriorly by the anterior border of Latissimus Dorsi, inferiorly by the 5th Intercostal Space (nipple level / inframammary fold), and superiorly by the axilla.
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-teal-400 mb-3">3-Chamber Drainage System Physics</h3>
              <p className="text-sm text-slate-300 mb-3">
                The standard 3-chamber chest drainage unit (Pleur-evac / Atrium) provides unidirectional evacuated drainage without allowing atmospheric air back into the hemithorax:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-emerald-300">Chamber 1 (Collection):</strong> Receives fluid and blood directly from the patient via wide-bore tubing. Calibrated in milliliters to monitor cumulative and hourly rates.
                </li>
                <li>
                  <strong className="text-cyan-300">Chamber 2 (Water Seal):</strong> Acts as a 2 cmH2O one-way underwater valve. Shows respiratory tidaling (meniscus rises on inspiration and falls on expiration during spontaneous breathing). Absence of tidaling indicates either complete lung re-expansion or tube occlusion/kinking.
                </li>
                <li>
                  <strong className="text-amber-300">Air Leak Meter (Grades 1–5):</strong> Bubbling in the water seal indicates an air leak. Continuous bubbling during quiet tidal respiration indicates a large parenchymal or bronchopleural fistula, while intermittent bubbling only on coughing suggests a resolving minor leak.
                </li>
                <li>
                  <strong className="text-purple-300">Chamber 3 (Suction Control):</strong> Regulates negative pressure applied to the pleural space, typically set to &minus;20 cmH2O.
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-rose-400 mb-3">ATLS Thoracotomy &amp; MIST-2 Protocols</h3>
              <p className="text-sm text-slate-300 mb-2">
                <strong className="text-white">ATLS Massive Hemothorax Triggers:</strong> Immediate indication for urgent exploratory thoracotomy or video-assisted thoracic surgery (VATS) is defined by an initial chest tube output &ge; 1500 mL upon insertion OR persistent ongoing drainage &ge; 200 mL/hr for 2 to 4 consecutive hours.
              </p>
              <p className="text-sm text-slate-300 mb-2">
                <strong className="text-white">MIST-2 Intrapleural Enzyme Protocol:</strong> In complicated parapneumonic effusions and multiloculated empyema (pleural pH &lt; 7.20, low glucose, high LDH), drainage alone often fails. Combined intrapleural Alteplase (tPA 10 mg) and Dornase Alfa (DNase 5 mg) instilled twice daily for 3 days significantly improves fluid clearance, reduces surgical referrals, and shortens hospital stay.
              </p>
              <p className="text-sm text-slate-300">
                <strong className="text-white">Clamping Safety Warning:</strong> Never clamp an actively bubbling chest tube; air will rapidly accumulate in the closed pleural space, causing fatal tension pneumothorax within minutes.
              </p>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
