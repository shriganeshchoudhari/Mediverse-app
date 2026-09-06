import React from 'react';
import type { Metadata } from 'next';
import BurnsResuscitationSimulator from '@/components/simulators/BurnsResuscitationSimulator';

export const metadata: Metadata = {
  title: 'Emergency Burns Resuscitation & Fluid Shift Workstation | Mediverse',
  description:
    'Emergency burn care and critical care fluid resuscitation simulator: Wallace Rule of Nines, Lund-Browder pediatric age adjustments, Parkland and ABA Consensus formulas, hourly urine output (UOP) titration, carboxyhemoglobin kinetics, and Ivy index fluid creep surveillance.',
};

export default function BurnsResuscitationPage() {
  return (
    <main>
      <BurnsResuscitationSimulator />

      {/* Curriculum Review Section */}
      <section className="bg-slate-950 border-t border-slate-800 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">
            High-Yield Clinical Review &mdash; Acute Burn Shock, Fluid Creep &amp; Inhalation Injury
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-orange-400 mb-3">
                Rule of Nines, Depth &amp; Fluid Resuscitation
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Resuscitation is required for burns &gt;20% TBSA in adults (&gt;10-15% in pediatrics/elderly):
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-amber-300">Exclude 1st Degree:</strong> Only partial-thickness (2nd degree) and full-thickness (3rd degree) burns count toward TBSA. Superficial erythema (sunburn) does not cause capillary leak and is strictly excluded.
                </li>
                <li>
                  <strong className="text-cyan-300">Parkland vs ABA Consensus:</strong> Parkland predicts 4 mL &times; kg &times; %TBSA of Lactated Ringer&apos;s (LR), while modern ABA consensus starts at 2 mL &times; kg &times; %TBSA (3 mL in children, 4 mL in electrical burns) to reduce fluid creep.
                </li>
                <li>
                  <strong className="text-orange-300">Timing Anchor:</strong> The 8-hour clock begins at the moment of burn injury, NOT emergency department arrival. Patients with delayed presentation require rapid catch-up over remaining hours.
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-rose-400 mb-3">
                UOP Titration &amp; Fluid Creep Prevention
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Fluid formulas provide only starting estimates; rates must be titrated hourly strictly to physiologic endpoints:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-emerald-300">Urine Output (UOP) Targets:</strong> 0.5 to 1.0 mL/kg/h in adults (approx 30-50 mL/h); 1.0 to 1.5 mL/kg/h in pediatric patients. In electrical burns with myoglobinuria, target is raised to 1.5 to 2.0 mL/kg/h until pigment clears.
                </li>
                <li>
                  <strong className="text-rose-300">The Ivy Index (&gt;250 mL/kg):</strong> Infusing &gt;250 mL/kg within 24 hours creates catastrophic fluid creep, precipitating Intra-Abdominal Hypertension (IAH) and Abdominal Compartment Syndrome (ACS).
                </li>
                <li>
                  <strong className="text-amber-300">Bladder Pressure Monitoring:</strong> Transduce intra-abdominal pressure via Foley catheter when TBSA &gt;40% or when fluid totals exceed 200 mL/kg. Sustained IAP &gt;20 mmHg with organ dysfunction warrants decompressive laparotomy.
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-cyan-400 mb-3">
                Inhalation Injury, CO &amp; Escharotomy
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Life-threatening complications of thermal injury demanding immediate surgical and medical interventions:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-cyan-300">Carbon Monoxide Clearance:</strong> CO binds hemoglobin with 200-250x higher affinity than O2. Half-life is 320 minutes on room air, reduced to 80 minutes on 100% FiO2 (NRB) and 23 minutes under Hyperbaric Oxygen (HBO 2.8-3.0 ATA).
                </li>
                <li>
                  <strong className="text-purple-300">Cyanide Co-Toxicity:</strong> Closed-space fire exposure with lactic acidosis (&gt;8 mmol/L) warrants empiric Hydroxocobalamin (Cyanokit 5g IV) to bind cyanide without inducing methemoglobinemia.
                </li>
                <li>
                  <strong className="text-rose-300">Circumferential Escharotomy:</strong> Rigid, leathery third-degree eschars cannot expand. Torso eschar causes thoracic restriction (peak airway pressure &gt;40 cmH2O); extremity eschar causes compartment syndrome. Mid-axial longitudinal escharotomy releases tension immediately.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
