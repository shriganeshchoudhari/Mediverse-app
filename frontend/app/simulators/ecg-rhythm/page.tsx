import React from 'react';
import type { Metadata } from 'next';
import EcgRhythmSimulator from '@/components/simulators/EcgRhythmSimulator';

export const metadata: Metadata = {
  title: '12-Lead ECG Rhythm & Arrhythmia Synthesizer | Mediverse',
  description: 'Interactive electrophysiology workstation synthesizing PQRST intervals, PR/QRS/QTc calculations, and acute pathology waveforms (STEMI, LBBB, AF, VT).',
};

export const dynamic = 'force-static';

export default function EcgRhythmSimulatorPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <EcgRhythmSimulator />
    </main>
  );
}
