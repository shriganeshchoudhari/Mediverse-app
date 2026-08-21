import type { Metadata } from 'next';
import NeurorehabSimulator from '@/components/physiotherapy/NeurorehabSimulator';

export const metadata: Metadata = {
  title: 'Neurorehabilitation & PNF / Stroke Recovery Protocol | Physiotherapy | Mediverse',
  description: 'Brunnstrom 6 stages of stroke motor recovery assessment, PNF diagonal movement patterns, and Modified Ashworth Scale spasticity evaluator for physiotherapy students.'
};

export default function NeurorehabPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#090d16', padding: '32px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <NeurorehabSimulator />
      </div>
    </main>
  );
}
