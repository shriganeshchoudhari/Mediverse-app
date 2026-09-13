import React from 'react';
import type { Metadata } from 'next';
import NerveMuscleSimulator from '@/components/simulators/NerveMuscleSimulator';

export const metadata: Metadata = {
  title: 'Hodgkin-Huxley Nerve-Muscle Electrophysiology Chamber | Mediverse',
  description: 'Neurophysiology laboratory modeling Goldman-Hodgkin-Katz membrane potentials, action potential ion channel conductances, and skeletal muscle isometric twitch summation.',
};

export const dynamic = 'force-static';

export default function NerveMusclePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <NerveMuscleSimulator />
    </main>
  );
}
