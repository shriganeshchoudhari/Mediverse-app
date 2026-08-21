import type { Metadata } from 'next';
import CephalometricAnalyzer from '@/components/dental/CephalometricAnalyzer';

export const metadata: Metadata = {
  title: 'Cephalometric Analysis | BDS Dental Sciences | Mediverse',
  description: 'Interactive cephalometric tracing and analysis tool for Steiner, Tweed, and Ricketts norms.',
};

export default function CephalometricPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#0f172a' }}>
      <CephalometricAnalyzer />
    </main>
  );
}
