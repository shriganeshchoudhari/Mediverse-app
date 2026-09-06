import React from 'react';
import type { Metadata } from 'next';
import CirrhosisPortalHypertensionSimulator from '@/components/simulators/CirrhosisPortalHypertensionSimulator';

export const metadata: Metadata = {
  title: 'Cirrhosis Decompensation & MELD-Na Solver | Mediverse',
  description:
    'Hepatology and portal hypertension clinical workstation: 2016 UNOS MELD-Na, Child-Turcotte-Pugh (CTP) score, Maddrey Discriminant Function for alcoholic hepatitis, hepatic venous pressure gradient (HVPG) hemodynamics, diagnostic paracentesis SAAG, spontaneous bacterial peritonitis (SBP), and hepatorenal syndrome (HRS-AKI).',
};

export default function CirrhosisPortalHypertensionPage() {
  return (
    <main>
      <CirrhosisPortalHypertensionSimulator />

      {/* Curriculum Review Section */}
      <section className="bg-slate-950 border-t border-slate-800 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">
            High-Yield Clinical Review &mdash; Cirrhosis, MELD-Na &amp; Portal Hypertension
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-amber-400 mb-3">
                MELD-Na &amp; Child-Turcotte-Pugh (CTP)
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Prognostic scoring systems guide liver transplant allocation and surgical risk stratification:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-amber-300">2016 UNOS MELD-Na:</strong> Incorporates Bilirubin, INR, Creatinine (max 4.0 mg/dL or default 4.0 if dialyzed &ge; 2 times in preceding 7 days), and Serum Sodium (bounded 125&ndash;137 mEq/L). If raw MELD &gt; 11: MELD-Na = MELD + 1.32 &times; (137 &minus; Na) &minus; [0.033 &times; MELD &times; (137 &minus; Na)].
                </li>
                <li>
                  <strong className="text-sky-300">Child-Pugh Classification:</strong> Assesses Total Bilirubin, Albumin, INR/PT, Ascites severity, and Hepatic Encephalopathy (West Haven grades 1&ndash;4). Class A (5&ndash;6 pts, 1-yr survival 100%), Class B (7&ndash;9 pts, 80%), and Class C (10&ndash;15 pts, 45%).
                </li>
                <li>
                  <strong className="text-rose-300">Maddrey DF:</strong> 4.6 &times; [PT(sec) &minus; Control(sec)] + Total Bilirubin(mg/dL). Score &ge; 32 indicates severe acute alcoholic hepatitis with 30-day mortality up to 50%, warranting Prednisolone 40 mg/day (Lille model day 7 re-evaluation).
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-sky-400 mb-3">
                HVPG &amp; Variceal Hemodynamics
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Hepatic Venous Pressure Gradient (HVPG = WHVP &minus; FHVP) reflects sinusoidal and presinusoidal resistance:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-cyan-300">Clinically Significant (CSPH &ge; 10 mmHg):</strong> Threshold for formation of gastroesophageal varices, portosystemic collaterals, and ascites. Carvedilol (NSBB) or Endoscopic Variceal Ligation (EVL) indicated.
                </li>
                <li>
                  <strong className="text-rose-300">Variceal Bleed Threshold (&ge; 12 mmHg):</strong> High imminent rupture risk. Acute variceal hemorrhage management: restrictive transfusion (target Hb 7&ndash;8 g/dL), IV Octreotide / Terlipressin splanchnic vasoconstrictor bolus + infusion, IV Ceftriaxone prophylaxis (7 days), and urgent EGD &le; 12 hours with band ligation.
                </li>
                <li>
                  <strong className="text-purple-300">HVPG &ge; 20 mmHg:</strong> Predicts high failure to control bleeding and early rebleeding. Early pre-emptive TIPS (&le; 72 hours) significantly improves survival in high-risk patients (Child C &lt; 14 or Child B with active bleeding).
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-emerald-400 mb-3">
                Ascites, SBP &amp; Hepatorenal Syndrome
              </h3>
              <p className="text-sm text-slate-300 mb-2">
                <strong className="text-white">Serum-Ascites Albumin Gradient (SAAG):</strong> Serum Albumin &minus; Ascitic Albumin. SAAG &ge; 1.1 g/dL confirms portal hypertension etiology (cirrhosis, heart failure, Budd-Chiari) with 97% accuracy.
              </p>
              <p className="text-sm text-slate-300 mb-2">
                <strong className="text-white">Spontaneous Bacterial Peritonitis (SBP):</strong> Ascitic fluid absolute neutrophil count (PMN) &ge; 250 cells/mm&sup3;. Treat immediately with IV 3rd-generation cephalosporin (Cefotaxime 2g IV q8h) + IV 20% Albumin (1.5 g/kg day 1, 1.0 g/kg day 3) to prevent hepatorenal syndrome and reduce mortality from 30% to 10%.
              </p>
              <p className="text-sm text-slate-300">
                <strong className="text-rose-400">Hepatorenal Syndrome (HRS-AKI):</strong> Progressive functional renal vasoconstriction unresponsive to 48 hours of diuretic withdrawal and IV albumin volume challenge (1 g/kg/day). First-line treatment: Terlipressin (IV bolus or continuous infusion) + IV Albumin (20&ndash;40 g/day), aiming for serum creatinine reduction &lt; 1.5 mg/dL.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
