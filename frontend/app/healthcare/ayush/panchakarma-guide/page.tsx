import PanchakarmaProcedureViewer from '@/components/ayush/PanchakarmaProcedureViewer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Panchakarma Guide | Mediverse AYUSH',
  description: 'Interactive 5-fold purification protocol explorer.',
};

export default function PanchakarmaGuidePage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>AYUSH Domain: Panchakarma Guide</h1>
      <PanchakarmaProcedureViewer />
    </div>
  );
}
