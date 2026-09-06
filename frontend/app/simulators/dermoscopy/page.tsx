import React from 'react';
import type { Metadata } from 'next';
import DermoscopySimulator from '@/components/simulators/DermoscopySimulator';

export const metadata: Metadata = {
  title: 'Dermatology Dermoscopy & Wood\'s Lamp | Mediverse',
  description: 'Clinical dermoscopy workstation: polarized vs contact non-polarized optical microscopy, 365 nm UVA Wood\'s lamp fluorescence, Argenziano 7-point melanoma checklist, basal cell carcinoma arborizing vessels, and excisional biopsy planning.',
};

export default function DermoscopyPage() {
  return (
    <main>
      <DermoscopySimulator />

      {/* Curriculum Section */}
      <section className="bg-slate-950 border-t border-slate-800 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">High-Yield Clinical Review — Dermoscopy &amp; Cutaneous Oncology</h2>
          <div className="grid md:grid-cols-3 gap-6">

            {/* Card 1 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-amber-400 mb-3">Optical Dermoscopy Physics &amp; Polarization</h3>
              <p className="text-sm text-slate-300 mb-3">
                Dermoscopy utilizes epiluminescence microscopy to visualize subsurface anatomical structures in the epidermis, dermoepidermal junction, and papillary dermis:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-emerald-300">Non-Polarized Contact Dermoscopy:</strong> Requires an immersion fluid (mineral oil or ultrasound gel) to eliminate refractive index mismatch between air and stratum corneum. Best for visualizing superficial epidermal structures like milia-like cysts and comedo openings in seborrheic keratosis.
                </li>
                <li>
                  <strong className="text-cyan-300">Cross-Polarized Non-Contact Dermoscopy:</strong> Employs two orthogonal polarizing filters that extinguish glare and specular reflections from the skin surface, allowing light backscattered from the deeper dermis to pass through. Essential for detecting shiny white lines (chrysalis structures), collagen remodeling, and deep melanin.
                </li>
                <li>
                  <strong className="text-amber-300">Vascular Patterns:</strong> Arborizing (tree-like branching) telangiectasias strongly correlate with basal cell carcinoma (BCC); polymorphous vessels (dotted, corkscrew, linear irregular) raise high suspicion for invasive melanoma.
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-rose-400 mb-3">Argenziano 7-Point Melanoma Checklist</h3>
              <p className="text-sm text-slate-300 mb-3">
                The 7-point checklist is a validated, weighted scoring system for differentiating melanoma from benign melanocytic lesions:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-yellow-300">Major Criteria (2 Points Each):</strong>
                  <br />&bull; <em>Atypical Pigment Network:</em> Broadened, hyperpigmented cords with irregular polygonal meshes.
                  <br />&bull; <em>Blue-White Veil:</em> Confluent, structureless blue pigmentation with an overlying white ground-glass haze (dermal melanin under hyperkeratosis).
                  <br />&bull; <em>Atypical Vascular Pattern:</em> Linear irregular, corkscrew, or dotted vessels distributed non-uniformly.
                </li>
                <li>
                  <strong className="text-cyan-300">Minor Criteria (1 Point Each):</strong> Irregular pigmentation (blotches), irregular dots/globules at the periphery, radial streaming / pseudopods, and regression structures (peppery peppering or scar-like depigmentation).
                </li>
                <li>
                  <strong className="text-rose-400">Decision Threshold:</strong> Total score &ge; 3 is suspicious; &ge; 5 is highly predictive of cutaneous melanoma. Complete excisional biopsy with 1–2 mm normal skin margin is mandatory (avoid superficial shave biopsy which destroys Breslow depth staging).
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-cyan-400 mb-3">Wood&apos;s Lamp UVA (365 nm) Fluorescence</h3>
              <p className="text-sm text-slate-300 mb-2">
                <strong className="text-white">Mechanism of Fluorescence:</strong> A mercury arc lamp with a nickel oxide filter emits peak long-wave ultraviolet A (365 nm). Absorbed photons excite biological fluorophores that re-emit visible light:
              </p>
              <ul className="text-sm text-slate-400 space-y-1 mb-3">
                <li>&bull; <strong className="text-rose-400">Coral-Pink / Copper-Red:</strong> <em>Corynebacterium minutissimum</em> (Erythrasma) due to coproporphyrin III synthesis. Differentiates intertrigo from tinea cruris.</li>
                <li>&bull; <strong className="text-emerald-400">Yellow-Green / Apple-Green:</strong> <em>Pseudomonas aeruginosa</em> wound infections due to pyoverdin.</li>
                <li>&bull; <strong className="text-yellow-300">Pale Yellow / Gold:</strong> <em>Malassezia furfur</em> in pityriasis versicolor.</li>
                <li>&bull; <strong className="text-sky-300">Chalky Bright White:</strong> Vitiligo (total loss of epidermal melanin allows maximum UVA dermal reflection with sharp, distinct margins).</li>
              </ul>
              <p className="text-sm text-slate-300">
                <strong className="text-white">Melasma Pigment Depth:</strong> Epidermal melasma exhibits increased contrast under Wood&apos;s light because excess epidermal melanin absorbs 365 nm light; dermal melasma does not enhance.
              </p>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
