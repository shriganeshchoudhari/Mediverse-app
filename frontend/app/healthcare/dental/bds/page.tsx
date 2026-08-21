/**
 * /healthcare/dental/bds — BDS Dental Surgery Curriculum Page
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BDS_CURRICULUM, BDS_METADATA } from '@/lib/curriculum/bdsCurriculumScaffold';
import DCICompetencyMap from '@/components/dental/DCICompetencyMap';

export default function BDSCurriculumPage() {
  const [selectedYear, setSelectedYear] = useState<number>(1);
  const [showCompetencyMap, setShowCompetencyMap] = useState<boolean>(false);

  const currentYearData = BDS_CURRICULUM.find((y) => y.year === selectedYear) || BDS_CURRICULUM[0];

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 1.5rem' }}>
      {/* Breadcrumbs */}
      <nav style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem' }}>
        <Link href="/healthcare" style={{ color: '#4f46e5', textDecoration: 'none' }}>
          Healthcare Landscape
        </Link>{' '}
        / <Link href="/healthcare/dental" style={{ color: '#4f46e5', textDecoration: 'none' }}>Dental Sciences</Link>{' '}
        / BDS Curriculum
      </nav>

      {/* Header */}
      <header style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '2.5rem' }}>🦷</span>
          <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, margin: 0, color: '#0f172a' }}>
            {BDS_METADATA.programName} ({BDS_METADATA.abbreviation})
          </h1>
        </div>
        <p style={{ fontSize: '1rem', color: '#64748b', margin: '0 0 1rem', lineHeight: 1.6 }}>
          Comprehensive 5-year DCI-recognized curriculum covering basic dental sciences, applied oral biology,
          and advanced clinical dentistry with 3D maxillofacial landmarks &amp; simulation models.
        </p>

        {/* Clinical Simulators Bar */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <Link
            href="/healthcare/dental/tooth-morphology"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 0.9rem',
              background: '#0f172a',
              color: '#38bdf8',
              borderRadius: '0.5rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              textDecoration: 'none',
              border: '1px solid #1e293b'
            }}
          >
            🦷 Tooth Morphology 3D
          </Link>
          <Link
            href="/healthcare/dental/nerve-block"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 0.9rem',
              background: '#0f172a',
              color: '#34d399',
              borderRadius: '0.5rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              textDecoration: 'none',
              border: '1px solid #1e293b'
            }}
          >
            💉 Nerve Block Simulator
          </Link>
          <Link
            href="/healthcare/dental/tmj"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 0.9rem',
              background: '#0f172a',
              color: '#a78bfa',
              borderRadius: '0.5rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              textDecoration: 'none',
              border: '1px solid #1e293b'
            }}
          >
            🦴 TMJ Biomechanics
          </Link>
          <Link
            href="/healthcare/dental/cephalometric"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 0.9rem',
              background: '#0f172a',
              color: '#fbbf24',
              borderRadius: '0.5rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              textDecoration: 'none',
              border: '1px solid #1e293b'
            }}
          >
            📐 Cephalometric Analyzer
          </Link>
          <Link
            href="/healthcare/dental/composite-simulator"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 0.9rem',
              background: '#0f172a',
              color: '#f43f5e',
              borderRadius: '0.5rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              textDecoration: 'none',
              border: '1px solid #1e293b'
            }}
          >
            🔬 Composite C-Factor Sim
          </Link>
          <Link
            href="/healthcare/dental/mds"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 0.9rem',
              background: '#4f46e5',
              color: '#ffffff',
              borderRadius: '0.5rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            🎓 MDS Postgraduate (8 Specialties) →
          </Link>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.875rem', color: '#334155' }}>
          <span style={{ background: '#f1f5f9', padding: '0.35rem 0.75rem', borderRadius: '0.5rem', fontWeight: 600 }}>
            📚 {BDS_METADATA.totalSubjects} Subjects
          </span>
          <span style={{ background: '#f1f5f9', padding: '0.35rem 0.75rem', borderRadius: '0.5rem', fontWeight: 600 }}>
            📖 {BDS_METADATA.totalLessons} Core Lessons
          </span>
          <span style={{ background: '#ecfdf5', color: '#047857', padding: '0.35rem 0.75rem', borderRadius: '0.5rem', fontWeight: 600 }}>
            🫀 {BDS_METADATA.lessonsWith3D} 3D Interactive Lessons
          </span>
          <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '0.35rem 0.75rem', borderRadius: '0.5rem', fontWeight: 600 }}>
            ⚡ {BDS_METADATA.lessonsWithSimulation} Simulation Solvers
          </span>
          <button
            onClick={() => setShowCompetencyMap(!showCompetencyMap)}
            style={{
              background: showCompetencyMap ? '#4338ca' : '#e0e7ff',
              color: showCompetencyMap ? '#ffffff' : '#4338ca',
              border: 'none',
              padding: '0.35rem 0.75rem',
              borderRadius: '0.5rem',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            📋 {showCompetencyMap ? 'Hide' : 'View'} DCI Competency Map
          </button>
        </div>
      </header>

      {/* DCI Competency Map Section (Collapsible) */}
      {showCompetencyMap && (
        <section style={{ marginBottom: '2.5rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
            📋 DCI Competency-Based Framework
          </h2>
          <DCICompetencyMap />
        </section>
      )}

      {/* Year Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '2rem', overflowX: 'auto' }}>
        {BDS_CURRICULUM.map((year) => (
          <button
            key={year.year}
            onClick={() => setSelectedYear(year.year)}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: selectedYear === year.year ? '#10b981' : '#f8fafc',
              color: selectedYear === year.year ? '#ffffff' : '#475569',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
          >
            Year {year.year} (Sem {year.semesters.join(' & ')})
          </button>
        ))}
      </div>

      {/* Subjects & Lessons in Current Year */}
      <div style={{ display: 'grid', gap: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
          {currentYearData.title}
        </h2>

        {currentYearData.subjects.map((subj) => (
          <section
            key={subj.id}
            style={{
              border: '1.5px solid #e2e8f0',
              borderRadius: '1rem',
              padding: '1.5rem',
              background: '#ffffff',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', background: '#ecfdf5', color: '#065f46', padding: '0.2rem 0.5rem', borderRadius: 9999, fontWeight: 700 }}>
                  {subj.code}
                </span>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0.5rem 0 0.25rem', color: '#0f172a' }}>
                  {subj.name}
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>{subj.description}</p>
              </div>
              <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                Credit Hours: <strong>{subj.creditHours}</strong>
              </span>
            </div>

            {/* Lessons grid */}
            <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
              {subj.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  style={{
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    background: '#f8fafc',
                    border: '1px solid #f1f5f9',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace', fontWeight: 600 }}>
                        [{lesson.dciCode}]
                      </span>
                      <strong style={{ fontSize: '0.9375rem', color: '#1e293b' }}>
                        {lesson.title}
                      </strong>
                    </div>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      {lesson.has3DContent && (
                        <span style={{ fontSize: '0.7rem', background: '#ecfdf5', color: '#047857', padding: '0.1rem 0.4rem', borderRadius: 4, fontWeight: 600 }}>
                          3D Model
                        </span>
                      )}
                      {lesson.hasSimulation && (
                        <span style={{ fontSize: '0.7rem', background: '#eff6ff', color: '#1d4ed8', padding: '0.1rem 0.4rem', borderRadius: 4, fontWeight: 600 }}>
                          Simulation
                        </span>
                      )}
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8125rem', color: '#64748b', lineHeight: 1.5 }}>
                    {lesson.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <Link
          href="/healthcare/dental"
          style={{ padding: '0.75rem 1.5rem', background: '#f1f5f9', color: '#334155', borderRadius: '0.75rem', textDecoration: 'none', fontWeight: 600, fontSize: '0.9375rem' }}
        >
          ← Back to Dental Sciences
        </Link>
      </div>
    </main>
  );
}
