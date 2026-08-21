import type { Metadata } from 'next';
import EpidemicOutbreakSimulator from '@/components/public-health/EpidemicOutbreakSimulator';

export const metadata: Metadata = {
  title: 'Epidemiological SIR / SEIR Outbreak Simulator | Public Health | Mediverse',
  description: 'Interactive compartmental mathematical epidemic model: evaluate basic reproduction number (R0), effective Re, Herd Immunity Threshold (HIT), and Non-Pharmaceutical Interventions (NPIs) for public health students.'
};

export default function EpidemicOutbreakPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#090d16', padding: '32px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <EpidemicOutbreakSimulator />
      </div>
    </main>
  );
}
