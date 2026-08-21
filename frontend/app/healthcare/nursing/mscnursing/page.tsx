'use client';
import React from 'react';
import { MSC_NURSING_CURRICULUM, MSC_NURSING_METADATA } from '../../../../lib/curriculum/mscNursingCurriculumScaffold';

export default function MScNursingPage() {
  return (
    <div style={{ padding: '24px' }}>
      <h1>{MSC_NURSING_METADATA.programName} Specialties</h1>
      <p>Select a postgraduate nursing specialty to explore advanced modules.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '24px' }}>
        {MSC_NURSING_CURRICULUM.map(spec => (
          <div key={spec.id} style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
            <h3>{spec.name}</h3>
            <p>{spec.description}</p>
            <p><strong>Code:</strong> {spec.incSpecialtyCode}</p>
            <button style={{ marginTop: '8px' }}>Explore Speciality</button>
          </div>
        ))}
      </div>
    </div>
  );
}
