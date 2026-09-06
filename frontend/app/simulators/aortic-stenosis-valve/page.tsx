import React from 'react';
import type { Metadata } from 'next';
import AorticStenosisSimulator from '@/components/simulators/AorticStenosisSimulator';

export const metadata: Metadata = {
  title: 'Aortic Stenosis & Valve Hemodynamics Workstation | Mediverse',
  description:
    'Cardiology and interventional valve hemodynamics workstation: Doppler continuity equation, invasive Gorlin and Hakki equation solver, Energy Loss Index (ELI), Valvuloarterial Impedance (Zva), ACC/AHA 2020 Stage A-D3 classification, and Heart Team TAVI vs SAVR decision matrix.',
};

export default function AorticStenosisValvePage() {
  return (
    <main>
      <AorticStenosisSimulator />

      {/* Curriculum Review Section */}
      <section className="bg-slate-950 border-t border-slate-800 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">
            High-Yield Clinical Review &mdash; Aortic Stenosis, Valve Hemodynamics &amp; Heart Team Decision-Making
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-red-400 mb-3">
                Doppler Continuity vs Invasive Gorlin
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Principles of transvalvular orifice quantification across echocardiography and cardiac catheterization:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-cyan-300">Continuity Principle:</strong> Calculates effective orifice area (EOA) at the vena contracta from flow velocity time integrals: AVA = (CSA_LVOT &times; VTI_LVOT) / VTI_AV. EOA is routinely 10-15% smaller than the anatomic orifice due to flow contraction.
                </li>
                <li>
                  <strong className="text-purple-300">Invasive Gorlin Equation:</strong> Calculates anatomic area from hydraulic discharge coefficient (C = 1.0) and square root of mean pressure gradient: AVA = (CO / [HR &times; SEP]) / (44.3 &times; &radic;&Delta;P).
                </li>
                <li>
                  <strong className="text-amber-300">Dimensionless Velocity Index (DVI):</strong> Ratio of LVOT velocity to aortic jet velocity (V_LVOT / V_AV). A DVI &lt; 0.25 strongly confirms severe AS independent of LVOT diameter measurement errors.
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-amber-400 mb-3">
                Low-Flow Low-Gradient AS Phenotypes
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Discordant gradient-area findings in reduced and preserved ejection fraction:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-rose-300">Classical Low-Flow Low-Gradient (Stage D2):</strong> LVEF &lt; 50% and SVI &lt; 35 mL/m&sup2; with AVA &le; 1.0 cm&sup2; but mean gradient &lt; 40 mmHg. Requires Low-Dose Dobutamine Echo to assess contractile reserve (&ge;20% SV increase) and differentiate true severe AS from pseudo-severe AS.
                </li>
                <li>
                  <strong className="text-cyan-300">Paradoxical Low-Flow Low-Gradient (Stage D3):</strong> Preserved LVEF (&ge;50%) but low stroke volume (SVI &lt; 35 mL/m&sup2;) due to severe concentric remodeling with small cavity size. Multislice CT aortic valve calcium scoring (&gt;1200 AU in females, &gt;2000 AU in males) confirms true severe obstruction.
                </li>
                <li>
                  <strong className="text-emerald-300">Energy Loss Index (ELI):</strong> Accounts for pressure recovery in ascending aorta diameters &le; 3.0 cm: ELI = (AVA &times; A_aorta) / (A_aorta - AVA) / BSA. Reclassifies pseudo-severe cases caused by small aortic root re-expansion.
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-cyan-400 mb-3">
                Heart Team Procedural Selection: TAVI vs SAVR
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Contemporary ACC/AHA and ESC guideline consensus criteria:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-purple-300">Young Patients (&lt;65 years):</strong> SAVR is strongly preferred to enable mechanical prosthesis implantation (avoiding structural bioprosthetic deterioration), provide long-term durability (&gt;20 years), and address concomitant bicuspid aortopathy.
                </li>
                <li>
                  <strong className="text-cyan-300">Older Patients (&ge;75 years):</strong> Transfemoral TAVI is the standard of care based on equal or superior long-term survival, reduced stroke rates, faster recovery, and lower bleeding incidence in the PARTNER and Evolut Low Risk trials.
                </li>
                <li>
                  <strong className="text-amber-300">Intermediate Cohort (65 to 75 years):</strong> Multidisciplinary Heart Team evaluation weighing life expectancy, coronary revascularization feasibility, valve morphology, and annular height.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
