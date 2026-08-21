'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMDSSpecialtyById } from '@/lib/curriculum/mdsCurriculumScaffold';

export default function MDSSpecialtyPage({ params }: { params: { specialty: string } }) {
  const specialty = getMDSSpecialtyById(params.specialty);
  
  if (!specialty) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Specialty not found</h1>
        <Link href="/healthcare/dental/mds" style={{ color: 'blue', textDecoration: 'underline' }}>
          Back to MDS Curriculum
        </Link>
      </div>
    );
  }

  const [activeYear, setActiveYear] = useState<1 | 2 | 3>(1);

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <Link href="/healthcare/dental/mds" style={{ color: '#0066cc', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block' }}>
        &larr; Back to MDS
      </Link>
      
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{specialty.name}</h1>
        <div style={{ display: 'flex', gap: '1rem', color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
          <span>DCI Code: {specialty.dciSpecialtyCode}</span>
          <span>NEET Code: {specialty.neetMdsCode}</span>
          <span>Duration: {specialty.duration}</span>
        </div>
        <p style={{ fontSize: '1.1rem', color: '#444' }}>{specialty.description}</p>
      </header>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #ddd' }}>
        {[1, 2, 3].map((year) => (
          <button
            key={year}
            onClick={() => setActiveYear(year as 1 | 2 | 3)}
            style={{
              padding: '0.5rem 1rem',
              background: 'none',
              border: 'none',
              borderBottom: activeYear === year ? '2px solid #0066cc' : '2px solid transparent',
              color: activeYear === year ? '#0066cc' : '#666',
              fontWeight: activeYear === year ? 'bold' : 'normal',
              cursor: 'pointer',
              fontSize: '1.1rem'
            }}
          >
            Year {year}
          </button>
        ))}
      </div>

      <div>
        {specialty.subjects.filter(s => s.year === activeYear).map(subject => (
          <div key={subject.id} style={{ marginBottom: '2rem', background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{subject.name}</h2>
            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
              Code: {subject.code} | {subject.creditHours} Credits
            </div>
            <p style={{ marginBottom: '1.5rem', color: '#555' }}>{subject.description}</p>
            
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Lessons</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {subject.lessons.map(lesson => (
                <div key={lesson.id} style={{ background: '#fff', padding: '1rem', borderRadius: '4px', borderLeft: '4px solid #0066cc' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{lesson.title}</h4>
                    <span style={{ fontSize: '0.8rem', background: '#eee', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      {lesson.dciCode}
                    </span>
                  </div>
                  <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.95rem' }}>{lesson.description}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {lesson.has3DContent && <span style={{ fontSize: '0.8rem', color: '#0066cc' }}>[3D]</span>}
                    {lesson.hasSimulation && <span style={{ fontSize: '0.8rem', color: '#009900' }}>[Sim]</span>}
                    {lesson.isResearchBased && <span style={{ fontSize: '0.8rem', color: '#990099' }}>[Research]</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {specialty.subjects.filter(s => s.year === activeYear).length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
            No subjects scheduled for Year {activeYear}.
          </div>
        )}
      </div>
    </div>
  );
}
