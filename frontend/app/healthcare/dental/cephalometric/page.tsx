import type { Metadata } from 'next';
import DentalSpotterStation from '@/components/dental/DentalSpotterStation';
import CephalometricAnalyzer from '@/components/dental/CephalometricAnalyzer';

export const metadata: Metadata = {
  title: 'Cephalometric & OPG Spotter Exam | BDS Dental Sciences | Mediverse',
  description: 'Interactive cephalometric tracing, OPG landmark analysis, and 60-second spotter exam.',
};

export default function CephalometricPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#0f172a', padding: '2rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
      <DentalSpotterStation />
      <div style={{ marginTop: '2rem' }}>
        <CephalometricAnalyzer />
      </div>
    </main>
  );
}
