import React from 'react';
import type { Metadata } from 'next';
import HemodynamicsShockSimulator from '@/components/simulators/HemodynamicsShockSimulator';

export const metadata: Metadata = {
  title: 'Swan-Ganz Hemodynamics & Shock Phenotype Classifier | Mediverse',
  description: 'Critical care workstation classifying cardiogenic, hypovolemic, distributive, and obstructive shock using pulmonary artery catheter thermodilution parameters.',
};

export const dynamic = 'force-static';

export default function HemodynamicsShockSimulatorPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <HemodynamicsShockSimulator />
    </main>
  );
}
