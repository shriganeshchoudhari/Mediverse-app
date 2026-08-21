import type { Metadata } from 'next';
import OSCENursingStation from '@/components/nursing/OSCENursingStation';

export const metadata: Metadata = {
  title: 'OSCE Nursing Skill Stations & Medication Safety | Nursing | Mediverse',
  description: 'Interactive Objective Structured Clinical Examination (OSCE) nursing station simulator with timing, critical safety steps, and automated competency scoring.'
};

export default function OSCESkillsPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#090d16', padding: '32px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <OSCENursingStation />
      </div>
    </main>
  );
}
