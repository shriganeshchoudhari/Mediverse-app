import type { Metadata } from 'next';
import SOAPIENotesSimulator from '@/components/nursing/SOAPIENotesSimulator';

export const metadata: Metadata = {
  title: 'SOAPIE Nursing Documentation Simulator | Clinical Nursing Portal | Mediverse',
  description:
    'Master accredited clinical nursing documentation in SOAPIE format across post-op atelectasis, sepsis escalation, and acute pulmonary edema scenarios with real-time INC rubric evaluation.'
};

export default function SOAPIEDocumentationPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#070b14', padding: '32px 20px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <SOAPIENotesSimulator />
      </div>
    </main>
  );
}
