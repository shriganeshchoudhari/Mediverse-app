import type { Metadata } from 'next';
import ZoonoticSpilloverSimulator from '@/components/veterinary/ZoonoticSpilloverSimulator';

export const metadata: Metadata = {
  title: 'One Health Zoonotic Spillover Simulator | Veterinary Medicine | Mediverse',
  description: 'Interactive wildlife-to-human pathogen spillover simulator: evaluate transmission chains, basic reproduction numbers (R0), and veterinary-public health One Health interventions.'
};

export default function ZoonoticSpilloverPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#090d16', padding: '32px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <ZoonoticSpilloverSimulator />
      </div>
    </main>
  );
}
