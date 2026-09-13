import React from 'react';
import { Metadata } from 'next';
import PharmacogenomicsCpicSimulator from '@/components/simulators/PharmacogenomicsCpicSimulator';

export const metadata: Metadata = {
  title: 'Clinical Pharmacogenomics (PGx) & CPIC Precision Drug Dosing Station | Mediverse',
  description: 'Precision clinical pharmacology workstation featuring star-allele genotype translation (CYP2D6, CYP2C19, CYP2C9, VKORC1, DPYD, SLCO1B1, HLA), IWPC warfarin dosing algorithms, and real-time CPIC Level A clinical decision support.'
};

export const dynamic = 'force-static';

export default function PharmacogenomicsCpicPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <PharmacogenomicsCpicSimulator />
    </main>
  );
}
