/**
 * /healthcare/ayush/marma-map — 107 Ayurvedic Marma Points Explorer Page
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import MarmaMapViewer from '@/components/ayush/MarmaMapViewer';
import WebGLErrorBoundary from '@/components/WebGLErrorBoundary';

export const metadata: Metadata = {
  title: '107 Marma Points 3D Body Map | AYUSH BAMS | Mediverse',
  description:
    'Explore the 107 vital Marma points of classical Ayurvedic anatomy from Sushruta Samhita with 3D projection, vulnerability classification, and modern surgical correlates.',
};

export default function MarmaMapPage() {
  return (
    <main style={{ maxWidth: 1280, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* Breadcrumbs */}
      <nav style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem' }}>
        <Link href="/healthcare" style={{ color: '#4f46e5', textDecoration: 'none' }}>
          Healthcare Landscape
        </Link>{' '}
        / <Link href="/healthcare/ayush" style={{ color: '#4f46e5', textDecoration: 'none' }}>AYUSH Systems</Link>{' '}
        / <Link href="/healthcare/ayush/bams" style={{ color: '#4f46e5', textDecoration: 'none' }}>BAMS Curriculum</Link>{' '}
        / 107 Marma Points 3D Map
      </nav>

      {/* Main Interactive Visualizer */}
      <WebGLErrorBoundary
        fallbackTitle="Marma Map Viewer Unavailable"
        fallbackDescription="WebGL is required for 3D Marma point visualization."
      >
        <MarmaMapViewer initialMarmaId="sthapani" />
      </WebGLErrorBoundary>

      {/* Back CTA */}
      <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
        <Link
          href="/healthcare/ayush/bams"
          style={{
            padding: '0.75rem 1.5rem',
            background: '#f1f5f9',
            color: '#334155',
            borderRadius: '0.75rem',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '0.9375rem',
          }}
        >
          ← Back to BAMS Ayurvedic Curriculum
        </Link>
      </div>
    </main>
  );
}
