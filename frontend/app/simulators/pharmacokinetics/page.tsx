import React from 'react';
import type { Metadata } from 'next';
import PharmacokineticsSimulator from '@/components/simulators/PharmacokineticsSimulator';

export const metadata: Metadata = {
  title: 'Pharmacokinetics Two-Compartment PK/PD Solver | Mediverse',
  description: 'Quantitative pharmacology solver simulating IV/Oral/IM disposition curves, Cmax, AUC, volume of distribution, clearance kinetics, and MTC/MEC therapeutic safety margins.',
};

export const dynamic = 'force-static';

export default function PharmacokineticsSimulatorPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <PharmacokineticsSimulator />
    </main>
  );
}
