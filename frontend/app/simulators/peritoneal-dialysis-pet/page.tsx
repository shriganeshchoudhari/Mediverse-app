import React from 'react';
import type { Metadata } from 'next';
import PeritonealDialysisSimulator from '@/components/simulators/PeritonealDialysisSimulator';

export const metadata: Metadata = {
  title: 'Peritoneal Dialysis (PD), Adequacy & PET Membrane Workstation | Mediverse',
  description:
    'Nephrology clinical workstation: Twardowski 4-hour Peritoneal Equilibration Test (PET), Three-Pore Model aquaporin-1 sodium sieving, Weekly Kt/V adequacy, Ultrafiltration Failure (UFF Type I-IV), and 2022 ISPD Peritonitis guidelines.',
};

export default function PeritonealDialysisPage() {
  return (
    <main>
      <PeritonealDialysisSimulator />

      {/* High-Yield Curriculum Review Section */}
      <section className="bg-slate-950 border-t border-slate-800 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">
            High-Yield Clinical Review &mdash; Peritoneal Membrane Transport, Adequacy &amp; ISPD Peritonitis
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-sky-400 mb-3">
                Twardowski PET &amp; Membrane Categories
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                The standard 4-hour Peritoneal Equilibration Test (PET) characterizes solute transport and osmotic dissipation:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-rose-300">High Transporters (D/P Cr &ge; 0.82):</strong> Rapid equilibration of creatinine and rapid absorption of dextrose. Osmotic gradient is lost early in dwell. Patients develop fluid retention on standard CAPD long dwells. Best managed on Automated PD (APD) with short dwell cycles and daytime Icodextrin.
                </li>
                <li>
                  <strong className="text-amber-300">High-Average (0.65 &ndash; 0.81) &amp; Low-Average (0.50 &ndash; 0.64):</strong> The majority of PD patients. High-average transports well on both CAPD and APD. Low-average benefits from longer dwell contact time on CAPD.
                </li>
                <li>
                  <strong className="text-emerald-300">Low Transporters (D/P Cr &lt; 0.50):</strong> Slow solute clearance but exceptional ultrafiltration capacity. Rapid APD cycling leads to severe solute under-dialysis. Requires high fill volumes (e.g., 2.5L dwells) and prolonged contact time.
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-cyan-400 mb-3">
                Three-Pore Model &amp; Ultrafiltration Failure (UFF)
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Rippe Three-Pore Model delineates transperitoneal water and solute movement:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-cyan-300">Aquaporin-1 Sodium Sieving:</strong> Ultra-small pores (radius ~0.4 nm) transport water without solutes. During the first 60 minutes of hypertonic dextrose dwell, water dilution produces a dip in dialysate sodium (&Delta;Na &ge; 5 mmol/L). Blunting (&Delta;Na &lt; 5 mmol/L) defines Type II UFF (Aquaporin-1 loss).
                </li>
                <li>
                  <strong className="text-rose-300">Type I UFF (Hyperpermeability):</strong> Increased peritoneal effective vascular surface area (often from neo-angiogenesis / long PD vintage). D/P Cr is high (&ge; 0.82) with rapid glucose loss. Rescued with APD and daytime Icodextrin.
                </li>
                <li>
                  <strong className="text-purple-300">Type III UFF &amp; EPS Precursor:</strong> Severe membrane fibrosis, vascular sclerosis, and loss of peritoneal surface area. Characterized by low solute transport (D/P Cr &lt; 0.50) combined with ultrafiltration failure. Warning sign for Encapsulating Peritoneal Sclerosis (EPS).
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-emerald-400 mb-3">
                ISPD Adequacy &amp; 2022 Peritonitis Guidelines
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Clinical management of solute clearance targets and infectious complications:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-indigo-300">Total Weekly Kt/V Target (&ge; 1.70):</strong> Combines peritoneal urea clearance with residual renal urea clearance normalized to Watson total body water (V). Residual kidney function provides substantial clearance and survival benefit; nephrotoxic exposures must be avoided.
                </li>
                <li>
                  <strong className="text-amber-300">Diagnostic Triad for Peritonitis:</strong> Diagnosis requires at least 2 of: (1) abdominal pain / cloudy effluent, (2) dialysate WBC &gt; 100/&mu;L with &ge; 50% PMN (after &ge; 2h dwell), (3) positive Gram stain or culture.
                </li>
                <li>
                  <strong className="text-rose-300">Empiric IP Antibiotics &amp; Catheter Removal:</strong> Prompt intraperitoneal Cefazolin (or Vancomycin) plus Ceftazidime (or Aminoglycoside) plus Heparin 500 U/L. Absolute indications for catheter removal include fungal peritonitis, refractory peritonitis (&gt; 5 days without clearing), and relapsing episodes.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
