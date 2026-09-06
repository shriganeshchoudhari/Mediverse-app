import React from 'react';
import type { Metadata } from 'next';
import HivAntiretroviralSimulator from '@/components/simulators/HivAntiretroviralSimulator';

export const metadata: Metadata = {
  title: 'HIV Antiretroviral Therapy & CD4 Prophylaxis Solver | Mediverse',
  description:
    'Infectious disease and HIV pharmacotherapy workstation: DHHS/WHO first-line ART regimens (Biktarvy, Triumeq, Dovato), CD4 T-cell opportunistic infection prophylaxis thresholds (PCP, Toxoplasmosis, MAC), HLA-B*5701 hypersensitivity pharmacogenomics, HBV/TB drug interactions, and Immune Reconstitution Inflammatory Syndrome (IRIS) timing.',
};

export default function HivAntiretroviralPage() {
  return (
    <main>
      <HivAntiretroviralSimulator />

      {/* Curriculum Review Section */}
      <section className="bg-slate-950 border-t border-slate-800 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">
            High-Yield Clinical Review &mdash; HIV Antiretroviral Therapy, OI Prophylaxis &amp; IRIS
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-purple-400 mb-3">
                CD4 Thresholds &amp; Primary OI Prophylaxis
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Opportunistic infection risk is tightly linked to absolute CD4 T-lymphocyte count:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-cyan-300">CD4 &lt; 200 /&mu;L (PCP / PJP):</strong> Trimethoprim-Sulfamethoxazole (TMP-SMX DS 1 tab PO daily or SS 1 tab daily). Second-line: Dapsone 100 mg daily, Atovaquone 1500 mg daily, or monthly aerosolized Pentamidine 300 mg. Discontinue once CD4 &gt; 200 /&mu;L for &gt; 3 months on suppressive ART.
                </li>
                <li>
                  <strong className="text-rose-300">CD4 &lt; 100 /&mu;L (Toxoplasmosis &amp; CrAg):</strong> If Toxoplasma IgG is positive, TMP-SMX DS daily provides cross-protection. Perform serum Cryptococcal Antigen (CrAg) lateral flow assay; if positive, LP is required to rule out meningitis.
                </li>
                <li>
                  <strong className="text-amber-300">CD4 &lt; 50 /&mu;L (Disseminated MAC):</strong> Azithromycin 1200 mg PO weekly (or Clarithromycin 500 mg BID). Modern DHHS guidelines allow deferral of MAC prophylaxis if fully suppressive ART is initiated immediately.
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-sky-400 mb-3">
                First-Line ART &amp; Pharmacogenomics
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Preferred initial regimens combine an Integrase Strand Transfer Inhibitor (INSTI) with a 2-NRTI backbone:
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-emerald-300">Biktarvy (BIC / TAF / FTC):</strong> Preferred single-tablet regimen with high barrier to resistance, negligible nephrotoxicity/bone loss compared to TDF, and full dual coverage for Hepatitis B co-infection.
                </li>
                <li>
                  <strong className="text-rose-300">HLA-B*5701 &amp; Abacavir (Triumeq):</strong> Screening for HLA-B*5701 is legally and clinically mandatory before initiating Abacavir. Positive patients develop a multi-organ, life-threatening hypersensitivity reaction (fever, rash, GI and pulmonary symptoms); re-challenge is fatal.
                </li>
                <li>
                  <strong className="text-amber-300">Dovato (DTG / 3TC 2-Drug) Restrictions:</strong> Contraindicated if HIV RNA &gt; 500,000 copies/mL, if HBV co-infection exists (3TC monotherapy triggers HBV M204I mutation), or if M184V mutation is present.
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <h3 className="text-base font-bold text-teal-400 mb-3">
                IRIS Dynamics &amp; Acute Infection Timing
              </h3>
              <p className="text-sm text-slate-300 mb-2">
                <strong className="text-rose-400">Cryptococcal Meningitis (COAT Trial):</strong> ART must be <em>deferred for 2 to 6 weeks</em> after starting antifungal induction (Amphotericin B + Flucytosine). Early ART increases mortality by 50% due to catastrophic intracranial hypertension from CNS IRIS.
              </p>
              <p className="text-sm text-slate-300 mb-2">
                <strong className="text-amber-300">Tuberculosis (SAPIT Trial):</strong> If CD4 &lt; 50 /&mu;L, initiate ART within 2 weeks of anti-TB therapy (improves overall survival). If CD4 &ge; 50 /&mu;L, ART can be initiated within 2 to 8 weeks.
              </p>
              <p className="text-sm text-slate-300">
                <strong className="text-cyan-300">Rifampin &amp; Integrase Inhibitors:</strong> Rifampin potently induces CYP3A4 and UGT1A1. Biktarvy is contraindicated. Dolutegravir dose must be increased to 50 mg twice daily (BID) to maintain therapeutic trough levels.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
