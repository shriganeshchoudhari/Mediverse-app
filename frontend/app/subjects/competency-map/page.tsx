import React from 'react';
import VerticalIntegrationMap, { Integration } from '@/components/curriculum/VerticalIntegrationMap';

// Dummy scaffold import fallback for this example
// import { medicalCurriculumScaffold } from '@/lib/curriculum/medicalCurriculumScaffold';

export default function CompetencyMapPage({
  searchParams,
}: {
  searchParams: { code?: string };
}) {
  const code = searchParams.code || 'UNKNOWN';

  // Sample data simulating a fetch or scaffold lookup
  const sampleIntegrations: Integration[] = [
    {
      type: 'vertical',
      targetSubject: 'Pathology',
      targetCode: 'PATH',
      competencyRef: 'PA2.1',
      description: 'Understanding cellular adaptations in response to physiological stress.',
    },
    {
      type: 'horizontal',
      targetSubject: 'Anatomy',
      targetCode: 'ANAT',
      competencyRef: 'AN10.2',
      description: 'Structural correlation with functional aspects of the heart.',
    },
    {
      type: 'vertical',
      targetSubject: 'Medicine',
      targetCode: 'MED',
      competencyRef: 'IM4.5',
      description: 'Clinical implications of altered physiological mechanisms in heart failure.',
    }
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#fff', marginBottom: '2rem', fontFamily: 'sans-serif' }}>
        Competency Integration Map
      </h1>
      <VerticalIntegrationMap
        subjectCode={code}
        subjectTitle={`Subject ${code}`}
        integrations={sampleIntegrations}
      />
    </div>
  );
}
