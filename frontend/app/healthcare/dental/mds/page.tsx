'use client';

import React from 'react';
import Link from 'next/link';
import { MDS_CURRICULUM, MDS_METADATA } from '@/lib/curriculum/mdsCurriculumScaffold';

export default function MDSPage() {
  const totalSubjects = MDS_CURRICULUM.reduce((acc, spec) => acc + spec.subjects.length, 0);
  const totalLessons = MDS_CURRICULUM.reduce((acc, spec) => acc + spec.subjects.reduce((subAcc, sub) => subAcc + sub.lessons.length, 0), 0);

  const colors = [
    'hsl(10, 80%, 50%)',
    'hsl(40, 80%, 50%)',
    'hsl(80, 80%, 40%)',
    'hsl(140, 80%, 40%)',
    'hsl(200, 80%, 50%)',
    'hsl(260, 80%, 60%)',
    'hsl(300, 80%, 50%)',
    'hsl(340, 80%, 50%)'
  ];

  return (
    <div className="mds-page" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <nav style={{ marginBottom: '1rem', color: '#666' }}>
          <Link href="/healthcare/dental">Dental</Link> / <span>MDS</span>
        </nav>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Master of Dental Surgery (MDS)</h1>
        <p style={{ color: '#555', fontSize: '1.2rem', marginBottom: '1rem' }}>
          Postgraduate specialization across 8 DCI-recognized specialties.
        </p>
        <div style={{ display: 'flex', gap: '1rem', color: '#666', fontSize: '0.9rem' }}>
          <span><strong>8</strong> Specialties</span>
          <span><strong>{totalSubjects}</strong> Subjects</span>
          <span><strong>{totalLessons}</strong> Lessons</span>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {MDS_CURRICULUM.map((spec, index) => (
          <Link key={spec.id} href={`/healthcare/dental/mds/${spec.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ 
              border: `1px solid ${colors[index % colors.length]}`, 
              borderRadius: '8px', 
              padding: '1.5rem', 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#fff',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2rem', marginRight: '1rem', color: colors[index % colors.length] }}>🦷</span>
                <div>
                  <h2 style={{ fontSize: '1.25rem', margin: 0 }}>{spec.name}</h2>
                  <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.25rem' }}>
                    {spec.dciSpecialtyCode} | {spec.neetMdsCode}
                  </div>
                </div>
              </div>
              <p style={{ color: '#555', fontSize: '0.95rem', flexGrow: 1 }}>{spec.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#777', marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '0.5rem' }}>
                <span>{spec.subjects.length} Subjects</span>
                <span>{spec.subjects.reduce((sum, s) => sum + s.lessons.length, 0)} Lessons</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <footer style={{ marginTop: '3rem', textAlign: 'center', color: '#777', fontSize: '0.9rem', fontStyle: 'italic' }}>
        * Admission requires qualification in NEET-MDS Entrance Exam.
      </footer>
    </div>
  );
}
