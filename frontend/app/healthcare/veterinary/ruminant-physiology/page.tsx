import type { Metadata } from 'next';
import RuminantPhysiologyViewer from '@/components/veterinary/RuminantPhysiologyViewer';

export const metadata: Metadata = {
  title: 'Ruminant Forestomach Physiology & Fermentation | Veterinary Medicine | Mediverse',
  description: 'Interactive 4-chambered bovine forestomach explorer with dietary forage-to-concentrate ratio sliders, live rumen pH calculation, and VFA stoichiometry for veterinary students.'
};

export default function RuminantPhysiologyPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#090d16', padding: '32px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <RuminantPhysiologyViewer />
      </div>
    </main>
  );
}
