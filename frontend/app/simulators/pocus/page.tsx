import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  Activity,
  Radio,
  ShieldAlert,
  BookOpen,
  Waves,
  Zap,
  CheckCircle2
} from 'lucide-react';
import PocusUltrasoundSimulator from '@/components/simulators/PocusUltrasoundSimulator';

export const metadata: Metadata = {
  title: 'Point-of-Care Ultrasound (POCUS) Simulator | Mediverse',
  description: 'Interactive virtual sonography workstation: eFAST trauma survey, BLUE acute respiratory protocol, 2D B-mode and M-mode sweeps, tissue attenuation physics, and electronic caliper measurement.',
};

export default function PocusSimulatorPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/simulators"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Physiology Simulators
          </Link>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
              ACUTE CARE SONOGRAPHY
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              ATLS / eFAST ALIGNED
            </span>
          </div>
        </div>

        {/* Main Interactive Simulator Component */}
        <PocusUltrasoundSimulator />

        {/* High-Yield Clinical Sonography Curriculum & Reference Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          
          {/* Card 1: Physics of Clinical Ultrasound */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2.5 text-blue-400 mb-3">
              <Waves className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Acoustic Physics &amp; Transducers
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li>
                <strong className="text-white">Piezoelectric Transduction:</strong> Ceramic lead zirconate titanate (PZT) crystals vibrate when energized by alternating voltage, generating longitudinal compressional sound waves (2–12 MHz).
              </li>
              <li>
                <strong className="text-white">Acoustic Impedance ($Z = \rho \cdot c$):</strong> Sound reflects at interfaces with differing impedance. Large mismatch (soft tissue vs. bone or air) reflects 99% of energy, casting deep shadows or ring-down reverberations.
              </li>
              <li>
                <strong className="text-white">Attenuation ($\alpha \cdot f \cdot z$):</strong> Acoustic energy is lost exponentially with depth via absorption and scattering. High frequency (Linear 10 MHz) gives superior axial resolution but shallow penetration; low frequency (Curvilinear 3.5 MHz) penetrates deep into the abdomen.
              </li>
            </ul>
          </div>

          {/* Card 2: eFAST Protocol in Trauma */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2.5 text-rose-400 mb-3">
              <ShieldAlert className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                eFAST Trauma Protocol
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li>
                <strong className="text-white">1. RUQ Morison&apos;s Pouch:</strong> Most sensitive single dependent space in the supine patient (holds ~250 mL of blood before spilling). Scan the hepatorenal junction and inferior pole of the right kidney.
              </li>
              <li>
                <strong className="text-white">2. Subxiphoid 4-Chamber:</strong> Evaluates for pericardial effusion. Fluid anterior to RV or circumferential indicates hemopericardium. Diastolic collapse of RV signifies tamponade physiology.
              </li>
              <li>
                <strong className="text-white">3. LUQ Splenorenal Recess:</strong> Fluid accumulates preferentially subdiaphragmatically superior to the spleen as well as between spleen and left kidney.
              </li>
              <li>
                <strong className="text-white">4. Pelvic Window:</strong> Pouch of Douglas (females) or retrovesical pouch (males) behind the distended urinary bladder acoustic window.
              </li>
            </ul>
          </div>

          {/* Card 3: Thoracic BLUE Protocol & Signs */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2.5 text-sky-400 mb-3">
              <BookOpen className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Thoracic &amp; BLUE Protocol
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li>
                <strong className="text-white">Bat Sign:</strong> Upper rib, lower rib, and connecting hyperechoic horizontal pleural line (~0.5 cm deep).
              </li>
              <li>
                <strong className="text-white">Pleural Sliding (Seashore Sign):</strong> Glistening horizontal shimmering of visceral on parietal pleura. On M-mode: laminar chest wall (waves) over granular speckled lung (sand).
              </li>
              <li>
                <strong className="text-white">Barcode / Stratosphere Sign:</strong> Pathognomonic for pneumothorax on M-mode. Completely parallel horizontal laminar lines throughout the entire sweep due to loss of sliding.
              </li>
              <li>
                <strong className="text-white">B-Lines (&quot;Lung Rockets&quot;):</strong> Vertical hyperechoic laser-like reverberations extending to the bottom of the screen. &gt;3 per intercostal space indicates acute pulmonary edema or interstitial syndrome.
              </li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}
