import React from 'react';
import { Metadata } from 'next';
import SpatialAuscultationSimulator from '@/components/simulators/SpatialAuscultationSimulator';

export const metadata: Metadata = {
  title: '3D Spatial Auscultation & Directional Phonocardiogram Workstation | Mediverse',
  description: 'Precision clinical examination simulator featuring spatial thoracic chest acoustic mapping, inverse-square attenuation, dynamic auscultatory maneuvers, and synchronized PCG / Lead II ECG wave synthesis.'
};

export const dynamic = 'force-static';

export default function SpatialAuscultationPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <SpatialAuscultationSimulator />
    </main>
  );
}
