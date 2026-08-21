import type { Metadata } from 'next';
import OTWorkflowsStation from '@/components/allied/OTWorkflowsStation';

export const metadata: Metadata = {
  title: 'Operation Theatre Workflows & WHO Safety Checklist | Allied Health | Mediverse',
  description: 'Interactive 3-phase WHO Surgical Safety Checklist validator, sterilization cycle verification, and high-tech surgical suite workstation workflows for OT technology students.'
};

export default function OTWorkflowsPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#090d16', padding: '32px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <OTWorkflowsStation />
      </div>
    </main>
  );
}
