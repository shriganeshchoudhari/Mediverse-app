/**
 * Shared domain page renderer used by all /healthcare/* sub-pages.
 * Accepts a domain ID and renders a consistent layout.
 */

import Link from 'next/link';
import { getDomainById, type HealthcareDomain } from '@/lib/curriculum/healthcareLandscapeScaffold';

interface DomainPageLayoutProps {
  domainId: string;
  curriculumCta?: { label: string; href: string };
}

export function DomainPageLayout({ domainId, curriculumCta }: DomainPageLayoutProps) {
  const domain = getDomainById(domainId);

  if (!domain) {
    return (
      <main style={{ maxWidth: 800, margin: '4rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
        <h1>Domain not found</h1>
        <Link href="/healthcare">← Back to Healthcare Landscape</Link>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 1.5rem' }}>
      {/* Breadcrumb */}
      <nav style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem' }}>
        <Link href="/healthcare" style={{ color: '#4f46e5', textDecoration: 'none' }}>
          Healthcare Landscape
        </Link>{' '}
        / {domain.shortName}
      </nav>

      {/* Header */}
      <header style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '3rem' }}>{domain.icon}</span>
          <div>
            <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, margin: 0, color: '#0f172a' }}>
              {domain.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
              <span
                style={{
                  fontSize: '0.7rem',
                  padding: '0.15rem 0.6rem',
                  borderRadius: 9999,
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  background: domain.tier === 1 ? '#dcfce7' : domain.tier === 2 ? '#dbeafe' : '#f3e8ff',
                  color: domain.tier === 1 ? '#166534' : domain.tier === 2 ? '#1d4ed8' : '#7c3aed',
                }}
              >
                Tier {domain.tier}
              </span>
              <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                {domain.lessonCount}+ lessons &middot; {domain.programs.length} programs
              </span>
            </div>
          </div>
        </div>
        <p style={{ fontSize: '1.0625rem', color: '#64748b', maxWidth: 720, lineHeight: 1.7, margin: 0 }}>
          {domain.longDescription}
        </p>
      </header>

      {/* Key highlights */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>
          Platform Features
        </h2>
        <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '0.75rem', listStyle: 'none', padding: 0, margin: 0 }}>
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
                alignItems: 'flex-start',
                gap: '0.5rem',
              }}
            >
              <span style={{ color: domain.color, fontWeight: 600, flexShrink: 0 }}>✦</span>
              {h}
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
                  <span
                    style={{
                      fontSize: '0.7rem',
                      background: prog.available ? '#dcfce7' : '#f1f5f9',
                      color: prog.available ? '#166534' : '#64748b',
                      padding: '0.15rem 0.5rem',
                      borderRadius: 9999,
                      fontWeight: 600,
                    }}
                  >
                    {prog.available ? 'LIVE' : 'COMING SOON'}
                  </span>
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
        {curriculumCta && (
          <Link
            href={curriculumCta.href}
            style={{
              padding: '0.75rem 1.5rem',
              background: domain.color,
              color: '#fff',
              borderRadius: '0.75rem',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9375rem',
            }}
          >
            {curriculumCta.label}
          </Link>
        )}
        <Link
          href="/healthcare"
          style={{
            padding: '0.75rem 1.5rem',
            border: '1.5px solid #e2e8f0',
            color: '#334155',
            borderRadius: '0.75rem',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '0.9375rem',
          }}
        >
          ← All Domains
        </Link>
      </div>
    </main>
  );
}
