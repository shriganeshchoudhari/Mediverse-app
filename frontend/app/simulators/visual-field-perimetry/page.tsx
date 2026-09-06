import React from 'react';
import type { Metadata } from 'next';
import VisualFieldPerimetrySimulator from '@/components/simulators/VisualFieldPerimetrySimulator';

export const metadata: Metadata = {
  title: 'Automated Perimetry & Glaucoma Visual Field Workstation | Mediverse',
  description:
    'Ophthalmology visual field perimetry simulator: Humphrey Field Analyzer (HFA) 24-2 SITA-Standard testing, decibel sensitivity mapping, Glaucoma Hemifield Test (GHT), Hodapp-Anderson-Parrish (HAP) glaucoma staging, corneal pachymetry CCT-adjusted IOP, and target IOP solver.',
};

export default function VisualFieldPerimetryPage() {
  return (
    <main>
      <VisualFieldPerimetrySimulator />

      {/* Curriculum Review Section */}
      <section className="bg-slate-950 border-t border-slate-800 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">
            High-Yield Clinical Review &mdash; Automated Static Perimetry &amp; Glaucomatous Field Interpretation
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-cyan-400 mb-3">
                Humphrey 24-2 Geometry &amp; Anatomy of Defect Patterns
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                The 24-2 test grid surveys 54 test locations spaced 6 degrees apart across the central 24 degrees of the visual field (extending to 30 degrees nasally):
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-cyan-300">Horizontal Raphe &amp; Nasal Step:</strong> Retinal nerve fibers originating in the temporal retina arc around the fovea as superior and inferior arcuate bundles, dividing sharply at the horizontal raphe. Glaucomatous damage to one pole of the optic nerve head produces a nasal step defect that strictly respects this horizontal dividing line.
                </li>
                <li>
                  <strong className="text-amber-300">Bjerrum (Arcuate) Scotoma:</strong> Continuous arcuate scotomas arching 10 to 20 degrees from the blind spot around fixation to the nasal horizontal midline indicate progressive loss of arcuate nerve fiber bundles.
                </li>
                <li>
                  <strong className="text-purple-300">Vertical Meridian Lesions:</strong> Visual field defects that strictly respect the vertical meridian indicate chiasmal (bitemporal hemianopia) or retrochiasmal (homonymous hemianopia) intracranial lesions rather than retinal or optic disc pathology.
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-amber-400 mb-3">
                Reliability Indices &amp; Quality Control
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                An automated perimetry printout must be vetted for reliability before any clinical inferences are made:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-rose-300">Fixation Losses (&gt;20% Unreliable):</strong> Monitored via the Heijl-Krakau blind spot technique (flashing stimuli into the mapped physiological blind spot). If the patient responds, gaze has drifted away from central fixation.
                </li>
                <li>
                  <strong className="text-emerald-300">False Positives (&gt;15% Unreliable):</strong> Assesses &quot;trigger-happy&quot; patients by introducing pauses where the machine makes an audible stimulus click without delivering light. High false positives artificially inflate sensitivity, generating an artifactual &quot;white scotoma&quot;.
                </li>
                <li>
                  <strong className="text-blue-300">False Negatives (&gt;20% Unreliable):</strong> A bright stimulus (much brighter than a previously seen stimulus at the same location) is flashed. Non-response indicates patient fatigue, distraction, or inattention (though severe glaucomatous field loss naturally increases test variability).
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-emerald-400 mb-3">
                Hodapp-Anderson-Parrish (HAP) Staging &amp; Target IOP
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                The HAP classification standardizes glaucoma progression and directly informs therapy targets:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-cyan-300">Stage 1 (Early):</strong> Mean Deviation (MD) &gt; -6.00 dB, &lt;18 points depressed at p &lt; 5%, &lt;10 points at p &lt; 1%, no points in central 5 degrees with &lt;15 dB sensitivity. Target IOP: 14 to 17 mmHg (25% reduction).
                </li>
                <li>
                  <strong className="text-amber-300">Stage 2 (Moderate):</strong> MD between -6.00 and -12.00 dB, &gt;18 points depressed at p &lt; 5%, or points in one hemifield within 5 degrees of fixation. Target IOP: 12 to 15 mmHg (35% reduction).
                </li>
                <li>
                  <strong className="text-rose-300">Stage 3-5 (Severe to End-Stage):</strong> MD &lt; -12.00 dB, defects involving both hemifields within 5 degrees of fixation, or small residual central macular island. Target IOP: &lt; 12 mmHg (45% to 50% reduction), often requiring surgical trabeculectomy with Mitomycin C or tube shunt.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
