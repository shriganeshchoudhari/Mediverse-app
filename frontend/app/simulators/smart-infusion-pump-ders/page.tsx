import React from 'react';
import { Metadata } from 'next';
import SmartInfusionPumpSimulator from '@/components/simulators/SmartInfusionPumpSimulator';

export const metadata: Metadata = {
  title: 'Smart Infusion Pump Guardrails & Dose Error Reduction System (DERS) | Mediverse',
  description: 'Biomedical smart pump simulation modeling hard and soft DERS limits, downstream occlusion pressure biophysics, secondary piggyback hydrostatic height, and tenfold decimal error prevention.',
  openGraph: {
    title: 'Smart Infusion Pump Guardrails & Dose Error Reduction System (DERS) | Mediverse',
    description: 'Biomedical smart pump simulation modeling hard and soft DERS limits, downstream occlusion pressure biophysics, secondary piggyback hydrostatic height, and tenfold decimal error prevention.',
    url: 'https://mediverse.app/simulators/smart-infusion-pump-ders',
    siteName: 'Mediverse Medical Simulation',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smart Infusion Pump Guardrails & Dose Error Reduction System (DERS) | Mediverse',
    description: 'Biomedical smart pump simulation modeling hard and soft DERS limits, downstream occlusion pressure biophysics, secondary piggyback hydrostatic height, and tenfold decimal error prevention.',
  },
};

export const dynamic = 'force-static';

export default function SmartInfusionPumpPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <SmartInfusionPumpSimulator />
    </main>
  );
}
