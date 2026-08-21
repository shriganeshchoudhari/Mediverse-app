import type { Metadata } from 'next';
import IVDripRateSimulator from '@/components/nursing/IVDripRateSimulator';

export const metadata: Metadata = {
  title: 'IV Drip Rate & Vasoactive Infusion Simulator | Nursing | Mediverse',
  description: 'Interactive IV gravity flow rate calculator with animated drip chamber and weight-based vasoactive critical care infusion pump rate solver.'
};

export default function IVDripRatePage() {
  return (
    <main style={{ minHeight: '100vh', background: '#090d16', padding: '32px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <IVDripRateSimulator />
      </div>
    </main>
  );
}
