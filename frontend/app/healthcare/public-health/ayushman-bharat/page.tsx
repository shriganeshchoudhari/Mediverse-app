import type { Metadata } from 'next';
import AyushmanBharatSimulator from '@/components/public-health/AyushmanBharatSimulator';

export const metadata: Metadata = {
  title: 'Ayushman Bharat PM-JAY Benefits & Claims Simulator | Public Health | Mediverse',
  description: 'Interactive National Health Protection Scheme workflow: Beneficiary eKYC verification, Health Benefit Package (HBP 2.2) selection, Pre-Auth clearance, and electronic claim settlement for healthcare administration students.'
};

export default function AyushmanBharatPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#090d16', padding: '32px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <AyushmanBharatSimulator />
      </div>
    </main>
  );
}
