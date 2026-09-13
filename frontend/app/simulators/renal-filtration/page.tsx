import React from 'react';
import type { Metadata } from 'next';
import RenalFiltrationSimulator from '@/components/simulators/RenalFiltrationSimulator';

export const metadata: Metadata = {
  title: 'Glomerular Filtration Rate & Tubular Transport Simulator | Mediverse',
  description: 'Renal physiology laboratory modeling Starling filtration forces, myogenic and tubuloglomerular autoregulation, and nephron countercurrent multiplier solute handling.',
};

export const dynamic = 'force-static';

export default function RenalFiltrationPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <RenalFiltrationSimulator />
    </main>
  );
}
