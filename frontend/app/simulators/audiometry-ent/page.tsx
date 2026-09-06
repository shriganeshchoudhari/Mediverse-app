import React from 'react';
import type { Metadata } from 'next';
import AudiometrySimulator from '@/components/simulators/AudiometrySimulator';

export const metadata: Metadata = {
  title: 'Pure Tone Audiometry & Tympanometry | Mediverse',
  description: 'ENT & audiological medicine workstation: octave pure tone air/bone conduction audiograms, Jerger middle ear compliance curves (Type A, As, Ad, B, C), speech discrimination rollover, and stapedial reflex testing.',
};

export default function AudiometryEntPage() {
  return (
    <main>
      <AudiometrySimulator />

      {/* Curriculum Review Section */}
      <section className="bg-slate-950 border-t border-slate-800 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">High-Yield Clinical Review — Otolaryngology &amp; Audiology Diagnostics</h2>
          <div className="grid md:grid-cols-3 gap-6">

            {/* Card 1 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-teal-400 mb-3">Audiometric Biophysics &amp; The Decibel Scale</h3>
              <p className="text-sm text-slate-300 mb-3">
                Audiograms plot hearing threshold in decibels Hearing Level (dB HL) across octave frequencies from 125 Hz to 8000 Hz. The scale is inverted, with 0 dB HL at the top (normal threshold) and 120 dB HL at the bottom (profound deficit):
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-emerald-300">dB HL vs dB SPL:</strong> 0 dB HL represents the median hearing threshold of young healthy otologically normal adults at each frequency, calibrating for the human ear&apos;s natural resonance peak near 3000 Hz.
                </li>
                <li>
                  <strong className="text-cyan-300">Air vs Bone Conduction:</strong> Air Conduction (AC) tests the entire auditory pathway (pinna, ear canal, tympanic membrane, ossicles, cochlea, and CN VIII). Bone Conduction (BC) bypasses the outer and middle ear by vibrating the temporal bone to stimulate the cochlea directly.
                </li>
                <li>
                  <strong className="text-amber-300">Air-Bone Gap (ABG):</strong> Defined as <code className="text-amber-300">AC threshold &minus; BC threshold</code>. An ABG &ge; 15 dB across speech frequencies indicates conductive pathology in the outer or middle ear (cerumen, effusion, perforation, or ossicular fixation).
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-cyan-400 mb-3">Middle Ear Impedance &amp; Jerger Curves</h3>
              <p className="text-sm text-slate-300 mb-3">
                The middle ear serves as an acoustic impedance matcher between air (low impedance) and cochlear perilymph (high impedance), providing a ~30 dB gain via a 1.3:1 ossicular lever and a 17:1 tympanic membrane-to-stapes footplate areal ratio. Tympanometry evaluates this mobility:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-emerald-300">Type A (Normal):</strong> Peak compliance (0.3 to 1.6 mL) centered between &minus;100 and +50 daPa. Normal middle ear aeration and mobile ossicular chain.
                </li>
                <li>
                  <strong className="text-amber-300">Type As (Shallow):</strong> Normal peak pressure with reduced compliance (&lt;0.3 mL). Indicates increased stiffness: stapedial otosclerosis or tympanosclerosis.
                </li>
                <li>
                  <strong className="text-purple-300">Type Ad (Deep):</strong> Peak off-scale (&gt;1.8 mL). Indicates hypermobility: incudostapedial joint disarticulation or monomeric healed eardrum.
                </li>
                <li>
                  <strong className="text-rose-400">Type B (Flat):</strong> No compliance peak. Normal Ear Canal Volume (0.8–1.5 mL) indicates middle ear effusion (Glue Ear). Large Ear Canal Volume (&gt;2.2 mL) indicates tympanic membrane perforation or patent grommet.
                </li>
                <li>
                  <strong className="text-sky-300">Type C (Negative):</strong> Peak shifted negative (&lt; &minus;100 daPa). Pathognomonic for Eustachian Tube Dysfunction (ETD) with retraction.
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-rose-400 mb-3">Retrocochlear Red Flags &amp; SSNHL</h3>
              <p className="text-sm text-slate-300 mb-2">
                <strong className="text-white">Idiopathic Sudden SNHL (SSNHL):</strong> Defined as a sensorineural hearing loss &ge; 30 dB over at least 3 contiguous frequencies occurring within 72 hours. This is an otologic emergency requiring immediate high-dose systemic corticosteroids (Prednisone 1 mg/kg/day for 14 days) or intratympanic steroid perfusion.
              </p>
              <p className="text-sm text-slate-300 mb-2">
                <strong className="text-white">Vestibular Schwannoma (Acoustic Neuroma):</strong> Any unilateral or asymmetric sensorineural hearing loss (&gt;15 dB interaural difference) warrants a Contrast-Enhanced MRI of the Internal Auditory Canals (IAC) and Cerebellopontine Angle (CPA).
              </p>
              <p className="text-sm text-slate-300">
                <strong className="text-white">Rollover Phenomenon &amp; Reflex Decay:</strong> In cochlear lesions, speech recognition plateaus at high volumes. In retrocochlear lesions, speech recognition severely degrades at higher intensities (Rollover Index &gt; 0.45), accompanied by acoustic reflex decay (&gt;50% amplitude reduction within 10 seconds of sustained pure tone).
              </p>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
