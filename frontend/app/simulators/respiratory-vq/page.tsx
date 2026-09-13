import React from 'react';
import type { Metadata } from 'next';
import RespiratoryVqSimulator from '@/components/simulators/RespiratoryVqSimulator';

export const metadata: Metadata = {
  title: 'Respiratory Ventilation-Perfusion (V/Q) & Alveolar Gas Solver | Mediverse',
  description: 'Pulmonary physiology workstation modeling the alveolar gas equation, Riley V/Q matching, shunt fraction calculations, and oxyhemoglobin dissociation dynamics.',
};

export const dynamic = 'force-static';

export default function RespiratoryVqPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <RespiratoryVqSimulator />
    </main>
  );
}
