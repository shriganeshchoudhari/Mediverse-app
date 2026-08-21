import type { Metadata } from 'next';
import PKPDSimulator from '@/components/pharmacy/PKPDSimulator';

export const metadata: Metadata = {
  title: 'PK/PD Simulation Engine | Pharmacy & Pharmacotherapy | Mediverse',
  description: 'Interactive one-compartment and two-compartment pharmacokinetics & pharmacodynamics simulator for IV bolus, infusion, and oral dosing.'
};

export default function PKPDSimulatorPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#090d16', padding: '32px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <PKPDSimulator />
      </div>
    </main>
  );
}
