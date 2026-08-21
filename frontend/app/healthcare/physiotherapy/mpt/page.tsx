import React from 'react';
import { MPT_CURRICULUM, MPT_METADATA } from '../../../../lib/curriculum/mptCurriculumScaffold';

export default function MPTPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>{MPT_METADATA.programName} ({MPT_METADATA.abbreviation})</h1>
      <p>{MPT_METADATA.duration} - {MPT_METADATA.regulatoryBody}</p>

      <section>
        <h2>MPT Specialties</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {MPT_CURRICULUM.map(specialty => (
            <div key={specialty.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
              <h3>{specialty.name}</h3>
              <p>{specialty.description}</p>
              <ul>
                {specialty.subjects.map(sub => (
                  <li key={sub.id}>{sub.name} ({sub.code})</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
