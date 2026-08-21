import type { Metadata } from 'next';
import DialysisClearanceSimulator from '@/components/allied/DialysisClearanceSimulator';

export const metadata: Metadata = {
  title: 'Renal Dialysis Clearance & Kt/V Calculator | Allied Health | Mediverse',
  description: 'Interactive countercurrent hemodialysis circuit simulator with Daugirdas single-pool Kt/V and Urea Reduction Ratio (URR) adequacy analysis for dialysis technology students.'
};

export default function DialysisClearancePage() {
  return (
    <main style={{ minHeight: '100vh', background: '#090d16', padding: '32px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <DialysisClearanceSimulator />
      </div>
    </main>
  );
}
