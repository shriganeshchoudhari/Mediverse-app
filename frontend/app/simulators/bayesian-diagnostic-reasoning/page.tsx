import React from 'react';
import { Metadata } from 'next';
import BayesianDiagnosticSimulator from '@/components/simulators/BayesianDiagnosticSimulator';

export const metadata: Metadata = {
  title: 'Clinical Diagnostic Reasoning & Bayesian Likelihood Ratio (LR) Workstation | Mediverse',
  description: 'Evidence-based diagnostic decision support modeling pre-test odds, multi-step Bayesian probability cascades, Fagan nomogram vector rays, 2x2 natural frequency matrices, and Pauker-Kassirer treatment thresholds.',
  openGraph: {
    title: 'Clinical Diagnostic Reasoning & Bayesian Likelihood Ratio (LR) Workstation | Mediverse',
    description: 'Evidence-based diagnostic decision support modeling pre-test odds, multi-step Bayesian probability cascades, Fagan nomogram vector rays, 2x2 natural frequency matrices, and Pauker-Kassirer treatment thresholds.',
    url: 'https://mediverse.app/simulators/bayesian-diagnostic-reasoning',
    siteName: 'Mediverse Medical Simulation',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Clinical Diagnostic Reasoning & Bayesian Likelihood Ratio (LR) Workstation | Mediverse',
    description: 'Evidence-based diagnostic decision support modeling pre-test odds, multi-step Bayesian probability cascades, Fagan nomogram vector rays, 2x2 natural frequency matrices, and Pauker-Kassirer treatment thresholds.',
  },
};

export const dynamic = 'force-static';

export default function BayesianDiagnosticPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <BayesianDiagnosticSimulator />
    </main>
  );
}
