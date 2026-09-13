import React from 'react';
import type { Metadata } from 'next';
import AcidBaseSimulator from '@/components/simulators/AcidBaseSimulator';

export const metadata: Metadata = {
  title: 'Acid-Base Davenport & Henderson-Hasselbalch Solver | Mediverse',
  description: 'Interactive classical acid-base laboratory modeling Henderson-Hasselbalch equilibrium, Davenport diagram trajectories, anion gap, and delta-delta compensation.',
  openGraph: {
    title: 'Acid-Base Davenport & Henderson-Hasselbalch Solver | Mediverse',
    description: 'Interactive classical acid-base laboratory modeling Henderson-Hasselbalch equilibrium, Davenport diagram trajectories, anion gap, and delta-delta compensation.',
    url: 'https://mediverse.app/simulators/acid-base',
    siteName: 'Mediverse Medical Simulation',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Acid-Base Davenport & Henderson-Hasselbalch Solver | Mediverse',
    description: 'Interactive classical acid-base laboratory modeling Henderson-Hasselbalch equilibrium, Davenport diagram trajectories, anion gap, and delta-delta compensation.',
  },
};

export const dynamic = 'force-static';

export default function AcidBasePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <AcidBaseSimulator />
    </main>
  );
}
