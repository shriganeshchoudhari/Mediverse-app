import type { Metadata } from 'next';
import NEWS2Simulator from '@/components/nursing/NEWS2Simulator';

export const metadata: Metadata = {
  title: 'NEWS2 Clinical Deterioration & SBAR Escalation Simulator | Nursing | Mediverse',
  description: 'National Early Warning Score 2 (NEWS2) clinical deterioration score calculator and automated SBAR communication tool for nursing escalation.'
};

export default function NEWS2EscalationPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#090d16', padding: '32px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <NEWS2Simulator />
      </div>
    </main>
  );
}
