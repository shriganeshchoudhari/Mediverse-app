import React from 'react';
import { MPHARM_CURRICULUM, MPHARM_METADATA } from '../../../../lib/curriculum/mpharmCurriculumScaffold';

export default function MPharmPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>{MPHARM_METADATA.programName} ({MPHARM_METADATA.abbreviation})</h1>
      <p>Duration: {MPHARM_METADATA.duration} | {MPHARM_METADATA.regulatoryBody}</p>

      <h2>Specialty Selector</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
        {MPHARM_CURRICULUM.map(spec => (
          <div key={spec.id} style={{ border: '1px solid #ccc', padding: '1rem', minWidth: '300px' }}>
            <h3>{spec.name}</h3>
            <p>{spec.description}</p>
            {spec.subjects.map(sub => (
              <div key={sub.id} style={{ marginBottom: '1rem' }}>
                <strong>{sub.name}</strong> ({sub.code})
                <ul>
                  {sub.lessons.map(l => (
                    <li key={l.id}>{l.title}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
