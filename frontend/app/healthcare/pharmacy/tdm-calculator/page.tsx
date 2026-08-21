import type { Metadata } from 'next';
import TDMCalculator from '@/components/pharmacy/TDMCalculator';

export const metadata: Metadata = {
  title: 'TDM Dosing Calculator | Pharmacy & Pharmacotherapy | Mediverse',
  description: 'Therapeutic Drug Monitoring clinical calculator for Narrow Therapeutic Index (NTI) drugs with Cockcroft-Gault creatinine clearance dosage adjustment.'
};

export default function TDMCalculatorPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#090d16', padding: '32px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <TDMCalculator />
      </div>
    </main>
  );
}
