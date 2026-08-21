import React from 'react';
import { BPHARM_CURRICULUM, BPHARM_METADATA } from '../../../../lib/curriculum/bpharmCurriculumScaffold';

export default function BPharmPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>{BPHARM_METADATA.programName} ({BPHARM_METADATA.abbreviation})</h1>
      <p>Duration: {BPHARM_METADATA.duration} | {BPHARM_METADATA.regulatoryBody}</p>

      <h2>Curriculum Viewer</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
        {BPHARM_CURRICULUM.map(year => (
          <div key={year.year} style={{ border: '1px solid #ccc', padding: '1rem', minWidth: '300px' }}>
            <h3>{year.title}</h3>
            {year.subjects.map(sub => (
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
