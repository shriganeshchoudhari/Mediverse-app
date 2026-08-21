import type { Metadata } from 'next';
import Link from 'next/link';
import MarmaMapViewer from '@/components/ayush/MarmaMapViewer';

export const metadata: Metadata = {
  title: '107 Marma Points 3D Body Map | Mediverse',
  description:
    'Interactive 3D Body Map of the 107 Marma points from Sushruta Samhita with modern neurovascular correlations.',
};

export default function RootMarmaMapPage() {
  return (
    <main style={{ maxWidth: 1280, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <nav style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem' }}>
        <Link href="/" style={{ color: '#4f46e5', textDecoration: 'none' }}>
          Home
        </Link>{' '}
        / <Link href="/healthcare" style={{ color: '#4f46e5', textDecoration: 'none' }}>Healthcare Landscape</Link>{' '}
        / 107 Marma Points Map
      </nav>

      <MarmaMapViewer initialMarmaId="sthapani" />
    </main>
  );
}
