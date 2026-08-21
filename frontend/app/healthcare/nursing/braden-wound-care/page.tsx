import type { Metadata } from 'next';
import BradenWoundSimulator from '@/components/nursing/BradenWoundSimulator';

export const metadata: Metadata = {
  title: 'Braden Scale & Wound Care Protocol Simulator | Nursing | Mediverse',
  description: 'Evidence-based pressure injury risk stratification and NPUAP/EPUAP wound staging and dressing protocol simulator for nursing students and clinicians.'
};

export default function BradenWoundCarePage() {
  return (
    <main style={{ minHeight: '100vh', background: '#090d16', padding: '32px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <BradenWoundSimulator />
      </div>
    </main>
  );
}
