import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Skull, Activity, Gauge, ShieldAlert, Sparkles, Stethoscope, Zap, Wind } from 'lucide-react';
import ToxicGasInhalationSimulator from '../../../components/simulators/ToxicGasInhalationSimulator';

export const metadata: Metadata = {
  title: 'Toxic Gas & Chemical Inhalation Workstation | Mediverse Simulators',
  description:
    'Clinical toxicology and hazmat simulation of toxic gas and chemical warfare inhalation injuries: Cyanide, Hydrogen Sulfide (H2S), Chlorine, and Phosgene. Mitochondrial Complex IV arrest, Hydroxocobalamin, Nitrite contraindication in smoke/CO, Nebulized Bicarbonate, and latent ARDS.',
};


export const dynamic = 'force-static';
export default function ToxicGasInhalationPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/simulators"
            className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-amber-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Clinical Simulators Catalog
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span>Medical Toxicology &amp; Chemical Countermeasures</span>
            <span>&bull;</span>
            <span className="text-amber-400">Track B28 (Route #229)</span>
          </div>
        </div>

        {/* Interactive Simulator Component */}
        <ToxicGasInhalationSimulator />

        {/* Evidence & Deep Physiology Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* 1. Cellular Asphyxiants & Complex IV Inhibition */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              1. Cellular Asphyxiants (Cyanide vs H<sub>2</sub>S)
            </h3>
            <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <p>
                <strong>Mitochondrial Arrest:</strong> Cyanide and Hydrogen Sulfide both reversibly inhibit the ferric iron (Fe<sup>3+</sup>) of Cytochrome <em>c</em> Oxidase (Complex IV), completely halting aerobic ATP production. This forces massive anaerobic glycolysis, resulting in profound lactic acidosis and histotoxic hypoxia with high mixed venous oxygen saturation (S<sub>v</sub>O<sub>2</sub> &gt; 85&ndash;90%).
              </p>
              <p>
                <strong>The Nitrite Hazard in Smoke Inhalation:</strong> Sodium Nitrite induces methemoglobinemia (Fe<sup>3+</sup>). In smoke inhalation with concomitant Carbon Monoxide (COHb &gt; 10%), inducing methemoglobin destroys the patient&rsquo;s remaining functional oxygen-carrying capacity and precipitates fatal cerebral/cardiac arrest. Hydroxocobalamin is the non-toxic first-line antidote.
              </p>
            </div>
          </div>

          {/* 2. Irritant Gases & Solubility Penetration */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Wind className="w-4 h-4 text-amber-400" />
              2. Water Solubility &amp; Airway Penetration
            </h3>
            <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <p>
                <strong>Intermediate Solubility (Chlorine):</strong> Chlorine rapidly dissolves in airway moisture, hydrolyzing into hydrochloric acid (HCl) and hypochlorous acid (HOCl). This triggers acute ocular burning, severe bronchospasm, and non-cardiogenic pulmonary edema. Nebulized 3.75%&ndash;4.2% Sodium Bicarbonate neutralizes epithelial acid.
              </p>
              <p>
                <strong>Low Solubility (Phosgene):</strong> Phosgene passes freely through upper airways without immediate burning. It acylates alveolar membranes, producing a silent 4&ndash;24 hour latent phase followed by catastrophic capillary leak and fulminant ARDS.
              </p>
            </div>
          </div>

          {/* 3. Antidote Pharmacology & Protocols */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Skull className="w-4 h-4 text-amber-400" />
              3. Targeted Antidote Pharmacology
            </h3>
            <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <p>
                <strong>Hydroxocobalamin (Cyanokit 5g IV):</strong> Directly binds CN<sup>&minus;</sup> with high affinity to synthesize nontoxic Cyanocobalamin (Vitamin B<sub>12</sub>), safely excreted in urine without methemoglobin generation.
              </p>
              <p>
                <strong>Sodium Nitrite for H<sub>2</sub>S Knockdown:</strong> Hydroxocobalamin does not bind sulfide effectively. Sodium Nitrite (300 mg IV) is required to generate MetHb (target 15&ndash;25%), creating an alternative ferric iron sink that extracts sulfide from Complex IV.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
