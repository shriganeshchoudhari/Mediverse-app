import React from 'react';
import type { Metadata } from 'next';
import CardiacCycleSimulator from '@/components/simulators/CardiacCycleSimulator';

export const metadata: Metadata = {
  title: 'Cardiac Cycle & Pressure-Volume (PV) Loop Simulator | Mediverse',
  description: 'Interactive cardiovascular mechanics modeling left ventricular PV loops, Wiggers synchronized electrocardiogram-pressure waveforms, and Frank-Starling compliance curves.',
};

export const dynamic = 'force-static';

export default function CardiacCyclePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <CardiacCycleSimulator />
    </main>
  );
}
