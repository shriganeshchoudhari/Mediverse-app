import React from 'react';
import type { Metadata } from 'next';
import TraumaATLSSimulator from '@/components/simulators/TraumaATLSSimulator';

export const metadata: Metadata = {
  title: 'Trauma & ATLS Primary Survey | Mediverse',
  description: 'Advanced Trauma Life Support simulation: hemorrhagic shock classification (Class I–IV), FAST/eFAST exam, massive transfusion protocol 1:1:1, damage control surgery, tension pneumothorax, and cardiac tamponade.',
};

export default function TraumaATLSPage() {
  return (
    <main>
      <TraumaATLSSimulator />

      {/* Curriculum Cards */}
      <section className="bg-slate-950 border-t border-slate-800 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">High-Yield Board Review — Trauma Surgery &amp; ATLS</h2>
          <div className="grid md:grid-cols-3 gap-6">

            {/* Card 1 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-red-400 mb-3">ATLS Hemorrhagic Shock Classification</h3>
              <p className="text-sm text-slate-300 mb-3">
                ATLS classifies hemorrhagic shock by estimated blood volume (EBV ~5000 mL in 70 kg adult):
              </p>
              <ul className="text-sm text-slate-400 space-y-1.5">
                <li><span className="text-green-400 font-bold">Class I (&lt;750 mL, &lt;15% EBV)</span>: HR &lt;100, BP normal, normal mental status. Crystalloid only.</li>
                <li><span className="text-yellow-400 font-bold">Class II (750–1500 mL)</span>: HR 100–120, SBP normal-low, anxious. 2 large-bore IVs + blood.</li>
                <li><span className="text-orange-400 font-bold">Class III (1500–2000 mL)</span>: HR 120–140, SBP 70–90, confused. Blood + activate MTP.</li>
                <li><span className="text-red-400 font-bold">Class IV (&gt;2000 mL)</span>: HR &gt;140, SBP &lt;70, lethargy/unresponsive. Exsanguinating — OR now.</li>
              </ul>
              <p className="text-xs text-slate-500 mt-3">
                Shock Index (HR/SBP) &gt;1.0 predicts Class III+ shock with 90% sensitivity. &gt;1.4 predicts mortality.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-amber-400 mb-3">Immediately Life-Threatening Injuries (MARCH/ABCDE)</h3>
              <p className="text-sm text-slate-300 mb-3">
                ATLS primary survey identifies 6 immediately life-threatening thoracic injuries:
              </p>
              <ul className="text-sm text-slate-400 space-y-1.5">
                <li><span className="text-red-400 font-bold">Tension PTX</span>: Absent breath sounds + tracheal deviation + JVD + cardiovascular collapse. Needle decompression 2nd ICS MCL immediately — do NOT wait for CXR.</li>
                <li><span className="text-red-400 font-bold">Cardiac Tamponade</span>: Beck&apos;s triad (JVD + muffled sounds + hypotension) + FAST pericardial stripe. Pericardiocentesis or ER thoracotomy.</li>
                <li><span className="text-orange-400 font-bold">Massive Hemothorax</span>: &gt;1500 mL blood in chest cavity. Chest tube 5th ICS MAL — if &gt;1500 mL drained immediately or &gt;200 mL/hr, consider VATS/thoracotomy.</li>
                <li><span className="text-yellow-400 font-bold">Open PTX</span>: 3-sided occlusive dressing (leave 4th side open to prevent conversion to tension).</li>
                <li><span className="text-yellow-400 font-bold">Flail Chest</span>: 3+ consecutive ribs fractured in 2+ places. Paradoxical movement. Treat with PPV (internal pneumatic splinting) + thoracic epidural analgesia.</li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-cyan-400 mb-3">MTP, Damage Control &amp; FAST</h3>
              <p className="text-sm text-slate-300 mb-2">
                <strong className="text-white">Massive Transfusion Protocol (1:1:1):</strong> pRBC:FFP:Platelets ratio prevents dilutional coagulopathy. Tranexamic acid (TXA) 1g IV within 3 hours of injury reduces mortality (CRASH-2 trial). Target fibrinogen &gt;200 mg/dL with cryoprecipitate. Calcium (1g CaCl or 3g Ca-gluconate) after every 4 units pRBC.
              </p>
              <p className="text-sm text-slate-300 mb-2">
                <strong className="text-white">Lethal Triad of Death:</strong> Hypothermia (&lt;35°C) + Coagulopathy (INR &gt;1.5) + Acidosis (pH &lt;7.2 / BD &lt;-6) — each factor amplifies the others. Damage Control Surgery: abbreviated hemorrhage control (packing, clamping), OR closure, ICU resuscitation, planned re-look at 24–48h.
              </p>
              <p className="text-sm text-slate-400">
                <strong className="text-slate-300">FAST Exam:</strong> 4 windows: Morison&apos;s pouch (hepatorenal), splenorenal, pelvic (pouch of Douglas), pericardial (subxiphoid). eFAST adds bilateral pleural views for pneumothorax. Sensitivity ~70–80% for hemoperitoneum (&gt;200 mL detectable).
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Permissive Hypotension: target SBP 70–90 mmHg (MAP ~50) in penetrating trauma until hemorrhage control — avoids diluting clot. Contraindicated in TBI (maintain CPP &gt;60).
              </p>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
