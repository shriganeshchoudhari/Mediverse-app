import type { Metadata } from 'next';
import TMJBiomechanicsViewer from '@/components/dental/TMJBiomechanicsViewer';

export const metadata: Metadata = {
  title: 'TMJ Biomechanics Simulator | BDS Dental Sciences | Mediverse',
  description: 'Interactive temporomandibular joint biomechanics simulator for exploring normal motion, ADR, and ADWR with TMD classifications.',
};

export default function TMJPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#0f172a' }}>
      <TMJBiomechanicsViewer />
    </main>
  );
}
