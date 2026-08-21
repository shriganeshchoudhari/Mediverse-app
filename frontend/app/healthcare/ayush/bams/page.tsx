/**
 * /healthcare/ayush/bams — BAMS Ayurvedic Medicine Curriculum Page
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BAMS_CURRICULUM, BAMS_METADATA } from '@/lib/curriculum/bamsCurriculumScaffold';
import CCIMCompetencyMap from '@/components/ayush/CCIMCompetencyMap';

export default function BAMSCurriculumPage() {
  const [selectedYear, setSelectedYear] = useState<number>(1);
  const [showCompetencyMap, setShowCompetencyMap] = useState<boolean>(false);

  const currentYearData = BAMS_CURRICULUM.find((y) => y.year === selectedYear) || BAMS_CURRICULUM[0];

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 1.5rem' }}>
      {/* Breadcrumbs */}
      <nav style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem' }}>
        <Link href="/healthcare" style={{ color: '#4f46e5', textDecoration: 'none' }}>
          Healthcare Landscape
        </Link>{' '}
        / <Link href="/healthcare/ayush" style={{ color: '#4f46e5', textDecoration: 'none' }}>AYUSH Systems</Link>{' '}
        / BAMS Curriculum
      </nav>

      {/* Header */}
      <header style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '2.5rem' }}>🌿</span>
          <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, margin: 0, color: '#0f172a' }}>
            {BAMS_METADATA.programName} ({BAMS_METADATA.abbreviation})
          </h1>
        </div>
        <p style={{ fontSize: '1rem', color: '#64748b', margin: '0 0 1rem', lineHeight: 1.6 }}>
          5.5-year CCIM-recognized curriculum integrating traditional Ayurvedic epistemology (Tridosha, Dhatu, Agni)
          with modern biophysical sciences, the 107 Marma Points interactive 3D map, and Dravyaguna phytopharmacology.
        </p>

        {/* Clinical Simulators Bar */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <Link
            href="/healthcare/ayush/marma-map"
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
            📍 107 Marma Points 3D Map
          </Link>
          <Link
            href="/healthcare/ayush/tridosha-ans"
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
            ⚡ Tridosha-ANS Simulator
          </Link>
          <Link
            href="/healthcare/ayush/prakriti-assessment"
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
            🧬 Prakriti Assessment Tool
          </Link>
          <Link
            href="/healthcare/ayush/panchakarma-guide"
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
            🏺 Panchakarma Stage Sim
          </Link>
          <Link
            href="/healthcare/ayush/dravyaguna-explorer"
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
            🌿 Dravyaguna Herb Explorer
          </Link>
          <Link
            href="/healthcare/ayush/md-ayurveda"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 0.9rem',
              background: '#d97706',
              color: '#ffffff',
              borderRadius: '0.5rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            🎓 MD/MS Ayurveda (8 Specialties) →
          </Link>
          <Link
            href="/healthcare/ayush/bhms"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 0.9rem',
              background: '#059669',
              color: '#ffffff',
              borderRadius: '0.5rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            🧪 BHMS Homeopathy →
          </Link>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.875rem', color: '#334155' }}>
          <span style={{ background: '#f1f5f9', padding: '0.35rem 0.75rem', borderRadius: '0.5rem', fontWeight: 600 }}>
            📚 {BAMS_METADATA.totalSubjects} Subjects
          </span>
          <span style={{ background: '#f1f5f9', padding: '0.35rem 0.75rem', borderRadius: '0.5rem', fontWeight: 600 }}>
            📖 {BAMS_METADATA.totalLessons} Core Lessons
          </span>
          <span style={{ background: '#fef3c7', color: '#b45309', padding: '0.35rem 0.75rem', borderRadius: '0.5rem', fontWeight: 600 }}>
            📍 {BAMS_METADATA.marmaLessons} Marma Point Maps
          </span>
          <span style={{ background: '#ecfdf5', color: '#047857', padding: '0.35rem 0.75rem', borderRadius: '0.5rem', fontWeight: 600 }}>
            🫀 {BAMS_METADATA.lessonsWith3D} 3D Lessons
          </span>
          <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '0.35rem 0.75rem', borderRadius: '0.5rem', fontWeight: 600 }}>
            ⚡ {BAMS_METADATA.lessonsWithSimulation} Simulation Labs
          </span>
          <button
            onClick={() => setShowCompetencyMap(!showCompetencyMap)}
            style={{
              background: showCompetencyMap ? '#b45309' : '#fef3c7',
              color: showCompetencyMap ? '#ffffff' : '#b45309',
              border: 'none',
              padding: '0.35rem 0.75rem',
              borderRadius: '0.5rem',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            📋 {showCompetencyMap ? 'Hide' : 'View'} CCIM Competency Map
          </button>
        </div>
      </header>

      {/* CCIM Competency Map Section (Collapsible) */}
      {showCompetencyMap && (
        <section style={{ marginBottom: '2.5rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
            📋 CCIM / NCISM Competency-Based Framework
          </h2>
          <CCIMCompetencyMap />
        </section>
      )}

      {/* Year Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '2rem', overflowX: 'auto' }}>
        {BAMS_CURRICULUM.map((year) => (
          <button
            key={year.year}
            onClick={() => setSelectedYear(year.year)}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: selectedYear === year.year ? '#f59e0b' : '#f8fafc',
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
                <span style={{ fontSize: '0.75rem', background: '#fef3c7', color: '#92400e', padding: '0.2rem 0.5rem', borderRadius: 9999, fontWeight: 700 }}>
                  {subj.code}
                </span>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0.5rem 0 0.25rem', color: '#0f172a' }}>
                  {subj.name} <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#b45309' }}>({subj.sanskritName})</span>
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
                        [{lesson.ccimCode}]
                      </span>
                      <strong style={{ fontSize: '0.9375rem', color: '#1e293b' }}>
                        {lesson.title}
                      </strong>
                    </div>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      {lesson.hasMarmaDiagram && (
                        <span style={{ fontSize: '0.7rem', background: '#fef3c7', color: '#b45309', padding: '0.1rem 0.4rem', borderRadius: 4, fontWeight: 600 }}>
                          Marma Map
                        </span>
                      )}
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
          href="/healthcare/ayush"
          style={{ padding: '0.75rem 1.5rem', background: '#f1f5f9', color: '#334155', borderRadius: '0.75rem', textDecoration: 'none', fontWeight: 600, fontSize: '0.9375rem' }}
        >
          ← Back to AYUSH Systems
        </Link>
      </div>
    </main>
  );
}
