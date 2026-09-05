import React from 'react';
import type { Metadata } from 'next';
import GIEndoscopySimulator from '@/components/simulators/GIEndoscopySimulator';

export const metadata: Metadata = {
  title: 'Upper GI Endoscopy (EGD) & ERCP Workstation | Mediverse',
  description: 'Interventional gastroenterology simulator: Forrest classification of peptic ulcer bleeding, dual endoscopic hemostasis, variceal band ligation, ERCP biliary cannulation, and post-ERCP pancreatitis prophylaxis.',
};

export default function GIEndoscopyPage() {
  return (
    <main>
      <GIEndoscopySimulator />

      {/* Curriculum Section */}
      <section className="bg-slate-950 border-t border-slate-800 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">High-Yield Board Review — Interventional Gastroenterology &amp; ERCP</h2>
          <div className="grid md:grid-cols-3 gap-6">

            {/* Card 1 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-amber-400 mb-3">Peptic Ulcer Forrest Classification</h3>
              <p className="text-sm text-slate-300 mb-3">
                The Forrest classification guides endoscopic hemostasis and predicts rebleeding risk in upper GI bleeding:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-rose-400">Forrest Ia (Spurting arterial hemorrhage):</strong> Rebleeding risk &gt;90%. Requires urgent dual endoscopic hemostasis (dilute epinephrine + mechanical hemoclips or thermal contact coagulation).
                </li>
                <li>
                  <strong className="text-rose-300">Forrest Ib (Oozing hemorrhage):</strong> Rebleeding risk ~50%. Requires dual endoscopic therapy.
                </li>
                <li>
                  <strong className="text-amber-300">Forrest IIa (Non-bleeding visible vessel):</strong> Rebleeding risk ~40–50%. Endoscopic therapy mandatory.
                </li>
                <li>
                  <strong className="text-amber-400">Forrest IIb (Adherent clot):</strong> Rebleeding risk ~20–30%. Target irrigation and clot removal for targeted treatment of underlying stigmata.
                </li>
                <li>
                  <strong className="text-emerald-400">Forrest IIc / III (Flat pigmented spot / Clean base):</strong> Rebleeding risk &lt;5%. No endoscopic therapy indicated; early oral feeding and outpatient discharge.
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-rose-400 mb-3">Acute Variceal Bleeding Protocol</h3>
              <p className="text-sm text-slate-300 mb-3">
                Emergency management of decompensated cirrhotic portal hypertension with active variceal hemorrhage:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-cyan-300">Vasoactive Pharmacotherapy:</strong> Start IV Octreotide (50 mcg IV bolus, then 50 mcg/hr continuous infusion for 3–5 days) or Terlipressin to induce splanchnic vasoconstriction and reduce portal venous pressure.
                </li>
                <li>
                  <strong className="text-emerald-300">Antibiotic Prophylaxis:</strong> IV Ceftriaxone (1g every 24 hours for 7 days) reduces rebleeding, spontaneous bacterial peritonitis (SBP), and overall mortality.
                </li>
                <li>
                  <strong className="text-amber-300">Endoscopic Band Ligation (EBL):</strong> Preferred definitive modality over sclerotherapy. Apply elastic rubber rings to columns starting immediately at GE junction and progressing proximally.
                </li>
                <li>
                  <strong className="text-purple-300">Refractory Rescue:</strong> Transjugular Intrahepatic Portosystemic Shunt (TIPS) within 72 hours for high-risk patients (Child-Pugh C or Child-Pugh B with active bleeding).
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-cyan-400 mb-3">ERCP Biliary Mechanics &amp; PEP Prevention</h3>
              <p className="text-sm text-slate-300 mb-2">
                <strong className="text-white">Cannulation &amp; Sphincterotomy:</strong> Selective deep common bile duct (CBD) cannulation requires orienting the sphincterotome toward the 11 to 1 o&apos;clock position. Inadvertent cannulation of the pancreatic duct (PD) at 1 to 3 o&apos;clock carries a high risk of Post-ERCP Pancreatitis (PEP).
              </p>
              <p className="text-sm text-slate-300 mb-2">
                <strong className="text-white">PEP Prevention (Guidelines):</strong> Routine administration of single-dose rectal Indomethacin (100 mg) or Diclofenac immediately pre- or post-procedure halves PEP incidence. If difficult cannulation or repeated PD wire passage occurs, deploy a temporary 3 Fr or 5 Fr prophylactic pancreatic stent.
              </p>
              <p className="text-sm text-slate-300">
                <strong className="text-white">Choledocholithiasis Clearance:</strong> Electrosurgical sphincterotomy creates an opening through the sphincter of Oddi; biliary stone extraction balloons or Dormia baskets clear calculi into the duodenal lumen. Plastic or metallic stents ensure biliary decompression if stones cannot be fully extracted.
              </p>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
