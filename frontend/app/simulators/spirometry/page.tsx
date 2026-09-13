import React from 'react';
import type { Metadata } from 'next';
import SpirometrySimulator from '@/components/simulators/SpirometrySimulator';

export const metadata: Metadata = {
  title: 'Clinical Spirometry & Flow-Volume Loop Analyzer | Mediverse',
  description: 'Pulmonary function testing laboratory modeling forced vital capacity (FVC), FEV1, PEF, and obstructive vs. restrictive ventilatory defect loops.',
  openGraph: {
    title: 'Clinical Spirometry & Flow-Volume Loop Analyzer | Mediverse',
    description: 'Pulmonary function testing laboratory modeling forced vital capacity (FVC), FEV1, PEF, and obstructive vs. restrictive ventilatory defect loops.',
    url: 'https://mediverse.app/simulators/spirometry',
    siteName: 'Mediverse Medical Simulation',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Clinical Spirometry & Flow-Volume Loop Analyzer | Mediverse',
    description: 'Pulmonary function testing laboratory modeling forced vital capacity (FVC), FEV1, PEF, and obstructive vs. restrictive ventilatory defect loops.',
  },
};

export const dynamic = 'force-static';

export default function SpirometryPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <SpirometrySimulator />
    </main>
  );
}
