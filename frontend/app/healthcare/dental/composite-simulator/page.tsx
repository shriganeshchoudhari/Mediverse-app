import type { Metadata } from 'next';
import CompositeLiveSimulator from '@/components/dental/CompositeLiveSimulator';

export const metadata: Metadata = {
  title: 'Composite Polymerization Simulator | BDS Dental Sciences | Mediverse',
  description: 'Interactive simulator for composite resin layering techniques, C-factor calculations, and polymerization shrinkage stress visualization.',
};

export default function CompositeSimulatorPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#0f172a' }}>
      <CompositeLiveSimulator />
    </main>
  );
}
