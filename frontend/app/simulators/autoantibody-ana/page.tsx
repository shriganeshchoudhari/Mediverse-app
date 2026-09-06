import React from 'react';
import type { Metadata } from 'next';
import AutoantibodyAnaSimulator from '@/components/simulators/AutoantibodyAnaSimulator';

export const metadata: Metadata = {
  title: 'Autoantibody Profiling & ANA HEp-2 IFA Solver | Mediverse',
  description:
    'Diagnostic rheumatology and clinical immunology workstation: ICAP standardized HEp-2 IFA patterns (AC-1 to AC-29), quantitative end-point titer kinetics, ENA multiplex profiling, ANCA dual-fluorescence differential, and 2019 ACR/EULAR classification criteria solvers.',
};

export default function AutoantibodyAnaPage() {
  return (
    <main>
      <AutoantibodyAnaSimulator />

      {/* Curriculum Review Section */}
      <section className="bg-slate-950 border-t border-slate-800 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">
            High-Yield Clinical Review &mdash; Autoantibody Serology, ICAP HEp-2 IFA &amp; ACR/EULAR Classification
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-emerald-400 mb-3">
                ICAP Standardized HEp-2 IFA Patterns
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                The International Consensus on ANA Patterns (ICAP) standardizes indirect immunofluorescence patterns on human epithelial type-2 (HEp-2) cells:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-cyan-300">AC-1 Homogeneous (Diffuse):</strong> Uniform nuclear staining with bright metaphase chromosome plates. Driven by anti-dsDNA, anti-histone, and nucleosome antibodies (hallmark of SLE and Drug-Induced Lupus).
                </li>
                <li>
                  <strong className="text-emerald-300">AC-4 &amp; AC-5 Speckled:</strong> Fine speckled (AC-4, anti-Ro/SSA, anti-La/SSB in Sjögren/SLE) vs Coarse speckled (AC-5, anti-Sm, anti-U1-RNP in MCTD). In both, condensed metaphase chromosome plates remain unstained (dark).
                </li>
                <li>
                  <strong className="text-amber-300">AC-3 Centromere:</strong> 40 to 60 distinct discrete dots scattered throughout interphase nuclei, aligning like beads on a string along the split metaphase equator. Diagnostic of limited cutaneous Systemic Sclerosis (CREST).
                </li>
                <li>
                  <strong className="text-purple-300">AC-8 Nucleolar:</strong> Stains the nucleoli intensely. Associates with anti-Scl-70, anti-RNA Polymerase III, and anti-PM/Scl in diffuse Systemic Sclerosis.
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-teal-400 mb-3">
                ENA Multiplex Panel &amp; ANCA Differentials
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Specific extractable nuclear antigens (ENA) confirm individual autoantibody identities beyond screening IFA titers:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-cyan-300">Anti-Sm vs Anti-dsDNA:</strong> Anti-Sm is the most specific antibody for SLE (99% specificity), but does not fluctuate with disease activity. Anti-dsDNA titers fluctuate dynamically, directly mirroring lupus nephritis flare severity.
                </li>
                <li>
                  <strong className="text-emerald-300">Anti-U1-RNP (MCTD):</strong> High titers (&gt;40 U/mL) in the absence of anti-dsDNA or anti-Sm define Mixed Connective Tissue Disease (synovitis, sausage digits, Raynaud, myositis).
                </li>
                <li>
                  <strong className="text-amber-300">c-ANCA vs p-ANCA:</strong> Cytoplasmic c-ANCA targets Proteinase-3 (PR3) in Granulomatosis with Polyangiitis (GPA); Perinuclear p-ANCA targets Myeloperoxidase (MPO) in Microscopic Polyangiitis (MPA) and EGPA.
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-amber-400 mb-3">
                ACR/EULAR Scoring &amp; The DFS70 Exclusion Rule
              </h3>
              <p className="text-sm text-slate-300 mb-2">
                <strong className="text-white">2019 EULAR/ACR SLE Criteria:</strong> Mandatory entry criterion is ANA &ge; 1:80. Classification requires &ge; 10 points across constitutional, hematologic, neuropsychiatric, mucocutaneous, serosal, renal, and immunologic domains.
              </p>
              <p className="text-sm text-slate-300 mb-2">
                <strong className="text-white">Isolated Anti-DFS70 Rule:</strong> The dense fine speckled (AC-2) pattern with confirmed isolated anti-DFS70 in the absence of other ENAs effectively excludes systemic autoimmune rheumatic diseases (SARD), preventing unnecessary immunosuppressive therapy.
              </p>
              <p className="text-sm text-slate-300">
                <strong className="text-rose-400">Lupus Nephritis Biopsy Rule:</strong> Persistent proteinuria &ge; 0.5 g/24h or active cellular casts mandate immediate percutaneous renal biopsy to guide class-specific induction immunosuppression.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
