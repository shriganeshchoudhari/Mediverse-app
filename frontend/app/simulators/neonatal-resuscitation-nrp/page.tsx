import React from 'react';
import type { Metadata } from 'next';
import NeonatalResuscitationSimulator from '@/components/simulators/NeonatalResuscitationSimulator';

export const metadata: Metadata = {
  title: 'Neonatal Resuscitation Program (NRP 8th Ed.) Workstation | Mediverse',
  description:
    'Pediatrics & neonatology delivery room resuscitation simulator: NRP 8th Edition step-by-step algorithm, interactive APGAR score calculator, pre-ductal target SpO2 nomogram, MR. SOPA ventilation troubleshooting, weight-based epinephrine dosing, and Sarnat HIE hypothermia criteria.',
};

export default function NeonatalResuscitationPage() {
  return (
    <main>
      <NeonatalResuscitationSimulator />

      {/* Curriculum Review Section */}
      <section className="bg-slate-950 border-t border-slate-800 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">
            High-Yield Clinical Review &mdash; Neonatal Resuscitation Program (NRP 8th Edition) &amp; APGAR Scoring
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-rose-400 mb-3">
                Ventilation &amp; The Golden Minute
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Key principles of transition from intrauterine to extrauterine life:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-rose-300">The Golden Minute:</strong> Within 60 seconds of birth, perform rapid assessment (Term? Tone? Breathing/crying?), provide warmth, clear airway if obstructed, dry, and stimulate. If apneic or HR &lt; 100 bpm, initiate PPV immediately.
                </li>
                <li>
                  <strong className="text-amber-300">Respiratory vs Cardiac Origin:</strong> Neonatal bradycardia is almost exclusively caused by hypoxia. Ventilation is the single most critical and effective intervention in neonatal resuscitation.
                </li>
                <li>
                  <strong className="text-emerald-300">Avoid Routine Suctioning:</strong> In vigorous infants born through meconium-stained fluid, routine endotracheal or deep oropharyngeal suctioning is no longer recommended.
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-amber-400 mb-3">
                Pre-Ductal SpO2 &amp; FiO2 Titration
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Target oxygen saturation values gradually increase during normal postnatal transition:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-cyan-300">Right Wrist Sensor:</strong> Always attach the pulse oximeter sensor to the right wrist or palm (pre-ductal arterial blood supply via the right subclavian artery) before connecting to the monitor.
                </li>
                <li>
                  <strong className="text-purple-300">Transition Nomogram:</strong> 1 min: 60-65% | 2 min: 65-70% | 3 min: 70-75% | 4 min: 75-80% | 5 min: 80-85% | 10 min: 85-95%. Hyperoxia causes oxidative injury and constricts cerebral vasculature.
                </li>
                <li>
                  <strong className="text-amber-300">Starting Blended Gas:</strong> For term &ge;35 weeks infants, start resuscitation on room air (21% FiO2). For preterm infants &lt;35 weeks, start on 21-30% FiO2 and titrate to target pre-ductal saturation.
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-cyan-400 mb-3">
                Advanced Interventions &amp; HIE Cooling
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Cardiopulmonary resuscitation and post-resuscitation neuroprotection:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-rose-300">3:1 Compressions (120 events/min):</strong> Indicated if HR remains &lt; 60 bpm after at least 30 seconds of effective PPV with chest rise (preferably via secured endotracheal tube). Synchronize 3 compressions to 1 breath; increase FiO2 to 100%.
                </li>
                <li>
                  <strong className="text-cyan-300">UVC Epinephrine Dosing:</strong> 0.02 mg/kg (0.2 mL/kg of 1:10,000 solution) followed by 3 mL normal saline flush. Administer via emergency umbilical venous catheter (UVC) inserted 2-4 cm until blood returns.
                </li>
                <li>
                  <strong className="text-emerald-300">Therapeutic Hypothermia:</strong> Infants &ge;36 weeks with evidence of intrapartum asphyxia (cord pH &le; 7.00, base deficit &ge; 16 mmol/L, or 10-min APGAR &le; 5) and moderate-to-severe HIE encephalopathy qualify for 72 hours of systemic hypothermia (33.5&deg;C) started within 6 hours.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
