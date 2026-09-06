import React from 'react';
import type { Metadata } from 'next';
import OphthalmologySlitLampSimulator from '@/components/simulators/OphthalmologySlitLampSimulator';

export const metadata: Metadata = {
  title: 'Slit Lamp Biomicroscopy & Goldmann Tonometry | Mediverse',
  description: 'Ophthalmology biomicroscopy workstation: optical slit beam cross-sectioning, Goldmann applanation tonometry (GAT) Imbert-Fick physics, CCT pachymetry correction, Van Herick anterior chamber depth grading, and acute angle-closure crisis management.',
};

export default function SlitLampTonometryPage() {
  return (
    <main>
      <OphthalmologySlitLampSimulator />

      {/* Curriculum Section */}
      <section className="bg-slate-950 border-t border-slate-800 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">High-Yield Clinical Review — Ophthalmology &amp; Anterior Segment Optics</h2>
          <div className="grid md:grid-cols-3 gap-6">

            {/* Card 1 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-sky-400 mb-3">Slit Lamp Biomicroscopy &amp; Optical Slices</h3>
              <p className="text-sm text-slate-300 mb-3">
                The Haag-Streit style slit lamp couples a binocular stereomicroscope with an adjustable slit illumination system sharing a coincident focal point:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-emerald-300">Optical Section:</strong> A razor-thin (0.1–0.2 mm) intense slit beam angled at 30° to 45° produces an anteroposterior histological cross-section through transparent media (tear film, corneal epithelium, stroma, endothelium, anterior chamber, anterior lens capsule, cortex, and nucleus).
                </li>
                <li>
                  <strong className="text-cyan-300">Fluorescein &amp; Cobalt Blue:</strong> High-molecular-weight sodium fluorescein (495 nm excitation, 517 nm emission) pools in epithelial defects. Cobalt blue excitation highlights corneal abrasions, HSV epithelial dendritic arborizations with terminal bulbs, and aqueous leakage (positive Seidel sign).
                </li>
                <li>
                  <strong className="text-amber-300">Anterior Chamber Cells &amp; Flare:</strong> Utilizing the conical beam aperture (1x1 mm) at high magnification (25x–40x), the Tyndall effect reveals suspended inflammatory leukocytes (cells) and exuded serum protein (flare) in acute iridocyclitis.
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-amber-400 mb-3">Goldmann Applanation Tonometry &amp; CCT</h3>
              <p className="text-sm text-slate-300 mb-3">
                Goldmann Applanation Tonometry (GAT) remains the international gold standard based on the modified Imbert-Fick physical principle:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-yellow-300">The Imbert-Fick Equilibrium:</strong> <code className="text-yellow-300">W + S = P &times; A + B</code>. When the applanated circular diameter is precisely 3.06 mm (contact area 7.35 mm&sup2;), the tear film capillary attraction force (S) exactly cancels corneal rigidity resistance (B). Hence, force applied in grams multiplied by 10 equals intraocular pressure in mmHg.
                </li>
                <li>
                  <strong className="text-cyan-300">Fluorescein Meniscus Biprism Alignment:</strong> Under cobalt blue illumination, the split-prism divides the circular fluorescein ring into two semicircles. Accurate calibration requires dial adjustment until the inner margins of the upper and lower fluorescent semicircles precisely kiss.
                </li>
                <li>
                  <strong className="text-rose-400">Pachymetry &amp; CCT Correction:</strong> Calibrated for a standard central corneal thickness (CCT) of 540 &mu;m. Thinner corneas (&lt;500 &mu;m) yield artificially low IOP readings (masking glaucoma), whereas thick corneas (&gt;580 &mu;m) falsely overestimate IOP. Correction approximation: &plusmn;1 mmHg per 20 &mu;m deviation.
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-rose-400 mb-3">Van Herick Angle Grading &amp; Glaucoma Crisis</h3>
              <p className="text-sm text-slate-300 mb-2">
                <strong className="text-white">Van Herick Limbal Slit Evaluation:</strong> An optical slit beam is projected onto the extreme peripheral cornea at 60° angle. Peripheral anterior chamber depth (PACD) is compared to adjacent corneal optical section thickness (CT):
              </p>
              <ul className="text-sm text-slate-400 space-y-1 mb-3">
                <li>&bull; <strong className="text-emerald-400">Grade 4:</strong> PACD &ge; 100% CT (Angle wide open, safe to dilate)</li>
                <li>&bull; <strong className="text-cyan-300">Grade 3:</strong> PACD 25% to 50% CT (Open angle, closure unlikely)</li>
                <li>&bull; <strong className="text-amber-300">Grade 2:</strong> PACD = 25% CT (Narrow angle, closure possible)</li>
                <li>&bull; <strong className="text-orange-400">Grade 1:</strong> PACD &lt; 25% CT (Dangerously narrow, high risk)</li>
                <li>&bull; <strong className="text-rose-400">Grade 0:</strong> PACD = 0% CT (Closed angle iridocorneal contact)</li>
              </ul>
              <p className="text-sm text-slate-300">
                <strong className="text-white">Acute Angle-Closure Glaucoma Triad:</strong> Severe periorbital hemicranial pain, colored haloes around lights, and nausea. Exam reveals steamy corneal microcystic edema, mid-dilated nonreactive pupil, shallow anterior chamber, and IOP &gt; 50–70 mmHg. Immediate medical pressure lowering followed by bilateral Nd:YAG laser peripheral iridotomy is required.
              </p>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
