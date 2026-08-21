/**
 * /healthcare/allopathic — Allopathic Medicine & Super-Specialties Page
 * MBBS | MD | MS | DM | MCh | DNB
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { getDomainById } from '@/lib/curriculum/healthcareLandscapeScaffold';

export const metadata: Metadata = {
  title: 'Allopathic Medicine | MBBS MD MS | Mediverse',
  description:
    'MBBS, MD, MS, DM, MCh — 19 core disciplines, 12 postgraduate residency tracks, 3D multi-organ dissection, physiological simulation labs, and NMC CBME vignettes on Mediverse.',
};

export default function AllopathicPage() {
  const domain = getDomainById('allopathic')!;

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 1.5rem' }}>
      {/* Breadcrumb */}
      <nav style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem' }}>
        <Link href="/healthcare" style={{ color: '#4f46e5', textDecoration: 'none' }}>
          Healthcare Landscape
        </Link>{' '}
        / {domain.name}
      </nav>

      {/* Header */}
      <header style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '3rem' }}>{domain.icon}</span>
          <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, margin: 0, color: '#0f172a' }}>
            {domain.name}
          </h1>
        </div>
        <p style={{ fontSize: '1.125rem', color: '#64748b', maxWidth: 720, lineHeight: 1.7, margin: 0 }}>
          {domain.longDescription}
        </p>
      </header>

      {/* Key highlights */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>
          Platform Features
        </h2>
        <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem', listStyle: 'none', padding: 0, margin: 0 }}>
          {domain.keyHighlights.map((h) => (
            <li
              key={h}
              style={{
                padding: '0.875rem 1rem',
                borderRadius: '0.75rem',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                fontSize: '0.875rem',
                color: '#334155',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span style={{ color: domain.color, fontWeight: 600 }}>✦</span> {h}
            </li>
          ))}
        </ul>
      </section>

      {/* Programs */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>
          Programs
        </h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {domain.programs.map((prog) => (
            <div
              key={prog.id}
              style={{
                padding: '1.25rem 1.5rem',
                borderRadius: '0.875rem',
                border: '1.5px solid',
                borderColor: prog.available ? domain.color : '#e2e8f0',
                background: prog.available ? '#f0f9ff' : '#fafafa',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>{prog.name}</strong>
                  {prog.available ? (
                    <span style={{ fontSize: '0.7rem', background: '#dcfce7', color: '#166534', padding: '0.15rem 0.5rem', borderRadius: 9999, fontWeight: 600 }}>
                      LIVE
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.7rem', background: '#f1f5f9', color: '#64748b', padding: '0.15rem 0.5rem', borderRadius: 9999, fontWeight: 600 }}>
                      COMING SOON
                    </span>
                  )}
                </div>
                <p style={{ margin: '0 0 0.25rem', fontSize: '0.875rem', color: '#64748b' }}>{prog.fullName}</p>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569' }}>{prog.description}</p>
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#64748b', textAlign: 'right', flexShrink: 0 }}>
                <div><strong>Duration:</strong> {prog.duration}</div>
                <div><strong>Regulator:</strong> {prog.regulatoryBody}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Link
          href="/subjects"
          style={{ padding: '0.75rem 1.5rem', background: domain.color, color: '#fff', borderRadius: '0.75rem', textDecoration: 'none', fontWeight: 600, fontSize: '0.9375rem' }}
        >
          Browse MBBS Curriculum →
        </Link>
        <Link
          href="/healthcare"
          style={{ padding: '0.75rem 1.5rem', border: '1.5px solid #e2e8f0', color: '#334155', borderRadius: '0.75rem', textDecoration: 'none', fontWeight: 600, fontSize: '0.9375rem' }}
        >
          ← All Domains
        </Link>
      </div>
    </main>
  );
}
