import React from 'react';
import type { Metadata } from 'next';
import ToxicologyAntidoteSimulator from '@/components/simulators/ToxicologyAntidoteSimulator';

export const metadata: Metadata = {
  title: 'Clinical Toxicology, Toxidromes & Antidote Precision | Mediverse',
  description: 'Interactive medical toxicology workstation: toxidrome pattern recognition (Hunter Serotonin vs Sympathomimetic, Cholinergic Killer Bs), Rumack-Matthew APAP nomogram solver, Osmolar/Anion gap diagnostics, and targeted antidote titration.',
};

export default function ToxicologyAntidotePage() {
  return (
    <main>
      <ToxicologyAntidoteSimulator />

      {/* Curriculum Review Section */}
      <section className="bg-slate-950 border-t border-slate-800 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">
            High-Yield Clinical Review — Medical Toxicology & Antidote Therapeutics
          </h2>
          <div className="grid md:grid-cols-3 gap-6">

            {/* Card 1 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-amber-400 mb-3">
                Core Toxidromes & The Hunter Decision Tree
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Toxidromes are syndromic constellations of physical signs and vital signs reflecting distinct classes of toxic exposures:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-rose-300">Anticholinergic vs Sympathomimetic:</strong> Both present with hyperthermia, tachycardia, hypertension, and mydriasis. The crucial differentiator is skin moisture: anticholinergic toxicity produces flushed, bone-dry skin and anhidrosis (&quot;dry as a bone&quot;), whereas sympathomimetic storm causes profuse diaphoresis and hyperactive bowel sounds.
                </li>
                <li>
                  <strong className="text-cyan-300">Cholinergic Muscarinic &quot;Killer B&apos;s&quot;:</strong> Bronchorrhea, Bronchospasm, and Bradycardia are the primary causes of death in organophosphate/carbamate poisoning, treated aggressively with high-dose Atropine titrated to pulmonary drying rather than heart rate.
                </li>
                <li>
                  <strong className="text-emerald-300">Hunter Serotonin Toxicity Criteria:</strong> Clonus (inducible, spontaneous, or ocular) is the single most sensitive and specific sign distinguishing Serotonin Syndrome from Neuroleptic Malignant Syndrome (lead-pipe rigidity, hyporeflexia) and sympathomimetic excess.
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-sky-400 mb-3">
                Rumack-Matthew Nomogram & NAC Protocols
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Acetaminophen (APAP) hepatotoxicity is mediated by CYP2E1-generated N-acetyl-p-benzoquinone imine (NAPQI) depleting hepatocellular glutathione:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-emerald-300">150 Treatment Line:</strong> The Rumack-Matthew nomogram applies to single acute ingestions presenting between 4 and 24 hours post-ingestion. In the US/international standard, the treatment line starts at 150 &micro;g/mL at 4 hours (providing a 25% safety margin beneath the 200 &micro;g/mL probable hepatic necrosis line).
                </li>
                <li>
                  <strong className="text-teal-300">N-Acetylcysteine (NAC) Regimen:</strong> NAC replenishes glutathione and serves as a direct sulfate/cysteine donor. The standard 21-hour 3-bag IV protocol delivers 150 mg/kg loading over 1 hour, 50 mg/kg over 4 hours, and 100 mg/kg over 16 hours. Near 100% hepatoprotection is achieved if begun within 8 hours of ingestion.
                </li>
                <li>
                  <strong className="text-amber-300">King&apos;s College Liver Transplant Criteria:</strong> Arterial pH &lt; 7.30 after resuscitation, OR concurrent INR &gt; 6.5 (PT &gt; 100s), Creatinine &gt; 3.4 mg/dL (300 &micro;mol/L), and grade III/IV hepatic encephalopathy.
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-emerald-400 mb-3">
                Osmolar/Anion Gap & Salicylate Trapping
              </h3>
              <p className="text-sm text-slate-300 mb-2">
                <strong className="text-white">Toxic Alcohol Osmolar Gap:</strong> Calculated Osm = 2[Na+] + [Glucose]/18 + [BUN]/2.8. An Osmolar Gap &gt; 10 mOsm/kg indicates unmeasured osmotically active particles (methanol, ethylene glycol, isopropanol). Treat early with Fomepizole (alcohol dehydrogenase inhibitor) before toxic metabolites (formic acid, glycolic/oxalic acid) trigger severe HAGMA and tissue injury.
              </p>
              <p className="text-sm text-slate-300 mb-2">
                <strong className="text-white">Salicylate Urine Alkalinization:</strong> Salicylic acid has a pKa of 3.0. Infusing sodium bicarbonate alkalinizes urine to pH 7.5&ndash;8.0, converting non-ionized salicylic acid to ionized salicylate in renal tubules. Ion trapping prevents tubular reabsorption and accelerates urinary clearance 10- to 20-fold.
              </p>
              <p className="text-sm text-slate-300">
                <strong className="text-rose-400">Emergent Hemodialysis Triggers:</strong> Salicylate level &gt; 90&ndash;100 mg/dL acute (&gt; 50&ndash;60 mg/dL chronic), refractory acidemia (pH &lt; 7.20), pulmonary edema, or altered mental status/seizures.
              </p>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
