import type { Metadata } from 'next';
import DrugInteractionChecker from '@/components/pharmacy/DrugInteractionChecker';

export const metadata: Metadata = {
  title: 'Drug–Drug Interaction & CYP450 Checker | Pharmacy | Mediverse',
  description: 'Clinical polypharmacy drug-drug interaction checker evaluating CYP450 metabolism, P-glycoprotein, and adverse pharmacological synergies.'
};

export default function DrugInteractionCheckerPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#090d16', padding: '32px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <DrugInteractionChecker />
      </div>
    </main>
  );
}
