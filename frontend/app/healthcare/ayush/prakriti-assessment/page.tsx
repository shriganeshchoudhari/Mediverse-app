import PrakritiAssessmentViewer from '@/components/ayush/PrakritiAssessmentViewer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prakriti Assessment | Mediverse AYUSH',
  description: 'Interactive psychobiological constitution questionnaire.',
};

export default function PrakritiAssessmentPage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>AYUSH Domain: Prakriti Assessment</h1>
      <PrakritiAssessmentViewer />
    </div>
  );
}
