import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { TransfusionAntibodyIdSimulator } from '../../../components/simulators/TransfusionAntibodyIdSimulator';

export const metadata = {
  title: 'Transfusion Medicine & 11-Cell Antibody ID Simulator | Mediverse',
  description:
    'Interactive 11-cell reagent red blood cell antibody identification panel, dosage effect resolution, proteolytic enzyme treatment, and antigen-negative donor unit crossmatch simulator.',
};

export default function TransfusionAntibodyIdPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 pt-4 pb-2">
        <Link
          href="/simulators"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-red-400 transition mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Clinical Simulators Catalog
        </Link>
      </div>
      <TransfusionAntibodyIdSimulator />
    </main>
  );
}
