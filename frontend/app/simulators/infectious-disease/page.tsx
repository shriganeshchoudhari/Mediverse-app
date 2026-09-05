import React from 'react';
import type { Metadata } from 'next';
import InfectiousDiseaseSimulator from '@/components/simulators/InfectiousDiseaseSimulator';

export const metadata: Metadata = {
  title: 'Infectious Disease & Antibiogram Solver | Mediverse',
  description: 'Clinical microbiology and antimicrobial stewardship simulator: CLSI/EUCAST MIC breakpoints, PK/PD target attainment, MDRO resistance mechanisms (MRSA, VRE, ESBL, CRE), and Surviving Sepsis 1-hour bundle.',
};

export default function InfectiousDiseasePage() {
  return (
    <main>
      <InfectiousDiseaseSimulator />

      {/* Curriculum Section */}
      <section className="bg-slate-950 border-t border-slate-800 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">High-Yield Board Review — Infectious Disease &amp; Antimicrobial Stewardship</h2>
          <div className="grid md:grid-cols-3 gap-6">

            {/* Card 1 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-emerald-400 mb-3">Pharmacodynamics (PK/PD) Target Attainment</h3>
              <p className="text-sm text-slate-300 mb-3">
                Antimicrobial efficacy depends on three fundamental pharmacokinetic/pharmacodynamic indices:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-cyan-300">Time above MIC (%T &gt; MIC):</strong> Beta-lactams (Penicillins, Cephalosporins, Carbapenems). Killing is time-dependent. Target free drug concentration exceeds MIC for 40–70% of dosing interval. Optimized by extended or continuous infusions.
                </li>
                <li>
                  <strong className="text-amber-300">Peak to MIC (Cmax / MIC):</strong> Aminoglycosides (Gentamicin, Amikacin). Killing is concentration-dependent. Target Cmax/MIC ratio &ge; 8–10 to prevent adaptive resistance and maximize post-antibiotic effect (PAE). Administered once daily (extended-interval).
                </li>
                <li>
                  <strong className="text-purple-300">AUC / MIC (Area Under Curve):</strong> Glycopeptides (Vancomycin), Fluoroquinolones, and Daptomycin. Target AUC24 / MIC ratio &ge; 400–600 for Vancomycin in serious MRSA infections to balance bacterial clearance and nephrotoxicity.
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-amber-400 mb-3">Major MDRO Resistance Mechanisms</h3>
              <p className="text-sm text-slate-300 mb-3">
                Pathognomonic molecular resistance genes frequently tested on USMLE and clinical boards:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-rose-400">MRSA (mecA gene):</strong> Encodes penicillin-binding protein 2a (PBP2a) with low affinity for beta-lactams, conferring cross-resistance to all penicillins and cephalosporins (except Ceftaroline). Treat with Vancomycin, Daptomycin, or Linezolid.
                </li>
                <li>
                  <strong className="text-yellow-400">VRE (vanA / vanB operons):</strong> Substitutes D-Ala-D-Ala cell wall dipeptide with D-Ala-D-Lac, reducing vancomycin binding 1000-fold. Treat with Linezolid or high-dose Daptomycin.
                </li>
                <li>
                  <strong className="text-cyan-400">ESBL (CTX-M, TEM, SHV):</strong> Hydrolyzes penicillins, 3rd/4th generation cephalosporins, and aztreonam. Carbapenems (Meropenem) represent the definitive standard of care (MERINO trial).
                </li>
                <li>
                  <strong className="text-red-400">CRE (KPC vs NDM-1):</strong> Klebsiella pneumoniae carbapenemase (KPC) vs New Delhi metallo-beta-lactamase (NDM-1 zinc-dependent). KPC responds to Ceftazidime-Avibactam; NDM-1 requires Cefiderocol or Aztreonam + Avibactam synergy.
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-cyan-400 mb-3">Surviving Sepsis 1-Hour Bundle &amp; Stewardship</h3>
              <p className="text-sm text-slate-300 mb-2">
                <strong className="text-white">Surviving Sepsis Campaign 1-Hour Bundle:</strong> Five immediate imperatives within 60 minutes of sepsis recognition:
              </p>
              <ol className="text-sm text-slate-400 list-decimal list-inside space-y-1 mb-3">
                <li>Measure serum lactate level (remeasure within 2–4 hours if initial lactate &gt; 2 mmol/L).</li>
                <li>Obtain blood cultures before initiating antimicrobial therapy.</li>
                <li>Administer broad-spectrum empirical intravenous antimicrobials.</li>
                <li>Rapidly infuse 30 mL/kg crystalloid fluid for hypotension or lactate &ge; 4 mmol/L.</li>
                <li>Apply vasopressors (Norepinephrine first-line) if MAP &lt; 65 mmHg despite volume resuscitation.</li>
              </ol>
              <p className="text-sm text-slate-300">
                <strong className="text-white">Antimicrobial Stewardship:</strong> De-escalation from broad empiric therapy (e.g. Vancomycin + Cefepime) to targeted narrow-spectrum agents (Cefazolin, Ceftriaxone) once culture sensitivities are available preserves gut microbiome biodiversity and curtails Clostridioides difficile colonization.
              </p>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
