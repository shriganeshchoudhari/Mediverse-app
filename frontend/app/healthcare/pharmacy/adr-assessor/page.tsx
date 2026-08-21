import type { Metadata } from 'next';
import ADRAssessor from '@/components/pharmacy/ADRAssessor';

export const metadata: Metadata = {
  title: 'Pharmacovigilance & ADR Assessor | Pharmacy | Mediverse',
  description: 'Naranjo Adverse Drug Reaction Probability Scale and WHO-UMC causality algorithm for clinical pharmacovigilance and drug safety reporting.'
};

export default function ADRAssessorPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#090d16', padding: '32px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <ADRAssessor />
      </div>
    </main>
  );
}
