import type { Metadata } from 'next';
import Link from 'next/link';
import DentalNerveBlockViewer from '@/components/dental/DentalNerveBlockViewer';

export const metadata: Metadata = {
  title: '3D Dental Nerve Block Simulator | Mediverse',
  description:
    'Interactive dental local anesthesia and nerve block simulator with real-time insertion angle, depth, and aspiration testing.',
};

export default function RootDentalSimPage() {
  return (
    <main style={{ maxWidth: 1280, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <nav style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem' }}>
        <Link href="/" style={{ color: '#4f46e5', textDecoration: 'none' }}>
          Home
        </Link>{' '}
        / <Link href="/healthcare" style={{ color: '#4f46e5', textDecoration: 'none' }}>Healthcare Landscape</Link>{' '}
        / 3D Dental Nerve Block Simulator
      </nav>

      <DentalNerveBlockViewer initialTechniqueId="ianb" />
    </main>
  );
}
