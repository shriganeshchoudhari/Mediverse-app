import type { Metadata } from 'next';
import OrthopedicSpecialTestsViewer from '@/components/physiotherapy/OrthopedicSpecialTestsViewer';

export const metadata: Metadata = {
  title: 'Orthopedic Special Diagnostic Tests & Sports Rehab | Physiotherapy | Mediverse',
  description: 'Physical therapy orthopedic diagnostic special tests with sensitivity, specificity metrics, execution techniques, and positive interpretations for clinicians and students.'
};

export default function SpecialTestsPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#090d16', padding: '32px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <OrthopedicSpecialTestsViewer />
      </div>
    </main>
  );
}
