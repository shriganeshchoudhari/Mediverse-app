import type { Metadata } from 'next';
import RadiologyPatternQuiz from '@/components/allied/RadiologyPatternQuiz';

export const metadata: Metadata = {
  title: 'Radiology Pattern Recognition Station | Allied Health Sciences | Mediverse',
  description:
    'Interactive case-based radiology quiz station for allied health and medical students featuring tension pneumothorax, lobar consolidation, extradural hemorrhage, acute appendicitis, and pneumoperitoneum with normal vs pathological comparisons.'
};

export default function RadiologyPatternRecognitionPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#070b14', padding: '32px 20px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <RadiologyPatternQuiz />
      </div>
    </main>
  );
}
