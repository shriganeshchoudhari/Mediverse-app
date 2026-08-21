'use client';
import React, { useState } from 'react';
import { useNursingCurriculum } from '../../../../hooks/useNursingCurriculum';
import { INCCompetencyMap } from '../../../../components/nursing/INCCompetencyMap';

export default function BScNursingPage() {
  const { curriculum, isLoading } = useNursingCurriculum();
  const [activeYear, setActiveYear] = useState<number>(1);
  const [showCompetencyMap, setShowCompetencyMap] = useState(false);

  if (isLoading) return <div>Loading curriculum...</div>;

  const currentYear = curriculum.find((y: any) => y.year === activeYear);

  return (
    <div style={{ padding: '24px' }}>
      <h1>B.Sc Nursing Curriculum</h1>
      <p>Explore the 4-year undergraduate nursing program mapped to INC guidelines.</p>
      
      <div style={{ margin: '16px 0' }}>
        {[1, 2, 3, 4].map(y => (
          <button 
            key={y} 
            onClick={() => setActiveYear(y)}
            style={{ marginRight: '8px', padding: '8px 16px', fontWeight: activeYear === y ? 'bold' : 'normal' }}
          >
            Year {y}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h3>Quick Launch Simulators</h3>
        <button style={{ marginRight: '8px' }}>IV Insertion Simulator</button>
        <button style={{ marginRight: '8px' }}>ECG Simulator</button>
        <button style={{ marginRight: '8px' }}>Wound Care Simulator</button>
        <button>Ventilator Simulator</button>
      </div>

      <button onClick={() => setShowCompetencyMap(!showCompetencyMap)} style={{ marginBottom: '16px' }}>
        {showCompetencyMap ? 'Hide INC Competency Map' : 'Show INC Competency Map'}
      </button>

      {showCompetencyMap && <INCCompetencyMap />}

      {currentYear && (
        <div>
          <h2>{currentYear.title}</h2>
          <p>{currentYear.description}</p>
          {currentYear.subjects.map((sub: any) => (
            <div key={sub.id} style={{ border: '1px solid #ccc', padding: '16px', margin: '16px 0', borderRadius: '8px' }}>
              <h4>{sub.name} ({sub.code})</h4>
              <ul>
                {sub.lessons.map((lesson: any) => (
                  <li key={lesson.id}>{lesson.title} - {lesson.incCode}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
