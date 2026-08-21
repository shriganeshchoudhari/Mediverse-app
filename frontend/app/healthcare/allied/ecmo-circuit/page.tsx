import type { Metadata } from 'next';
import ECMICircuitSimulator from '@/components/allied/ECMICircuitSimulator';

export const metadata: Metadata = {
  title: 'ECMO & Cardiopulmonary Bypass Circuit Simulator | Allied Health | Mediverse',
  description: 'Interactive high-tech extracorporeal circuit simulator: Cardiopulmonary Bypass (CPB), VA-ECMO, and VV-ECMO with real-time hemodynamic and blood gas responses for perfusion students.'
};

export default function ECMOCircuitPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#090d16', padding: '32px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <ECMICircuitSimulator />
      </div>
    </main>
  );
}
