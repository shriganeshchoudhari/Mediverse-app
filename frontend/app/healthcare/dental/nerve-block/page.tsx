/**
 * /healthcare/dental/nerve-block — 3D Dental Nerve Block Simulator Page
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import DentalNerveBlockViewer from '@/components/dental/DentalNerveBlockViewer';

export const metadata: Metadata = {
  title: '3D Dental Nerve Block Simulator | BDS Dental Sciences | Mediverse',
  description:
    'Interactive dental local anesthesia and nerve block simulator for BDS students covering IANB, Gow-Gates, Akinosi, and Mental blocks with real-time insertion angle and depth calibration.',
};

export default function DentalNerveBlockPage() {
  return (
    <main style={{ maxWidth: 1280, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* Breadcrumbs */}
      <nav style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem' }}>
        <Link href="/healthcare" style={{ color: '#4f46e5', textDecoration: 'none' }}>
          Healthcare Landscape
        </Link>{' '}
        / <Link href="/healthcare/dental" style={{ color: '#4f46e5', textDecoration: 'none' }}>Dental Sciences</Link>{' '}
        / <Link href="/healthcare/dental/bds" style={{ color: '#4f46e5', textDecoration: 'none' }}>BDS Curriculum</Link>{' '}
        / 3D Nerve Block Simulator
      </nav>

      {/* Main Interactive Visualizer */}
      <DentalNerveBlockViewer initialTechniqueId="ianb" />

      {/* Back CTA */}
      <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
        <Link
          href="/healthcare/dental/bds"
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
          ← Back to BDS Dental Curriculum
        </Link>
      </div>
    </main>
  );
}
