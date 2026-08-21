import type { Metadata } from 'next';
import GaitCycleAnalyzer from '@/components/physiotherapy/GaitCycleAnalyzer';

export const metadata: Metadata = {
  title: 'Gait Cycle Kinematics & Pathological Gait Simulator | Physiotherapy | Mediverse',
  description: 'Interactive 8-phase Rancho Los Amigos gait cycle kinematics analyzer with joint angles, muscle EMG activity, and clinical pathological gait simulator.'
};

export default function GaitAnalysisPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#090d16', padding: '32px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <GaitCycleAnalyzer />
      </div>
    </main>
  );
}
