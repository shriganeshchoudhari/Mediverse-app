import type { Metadata } from 'next';
import JointBiomechanicsViewer from '@/components/physiotherapy/JointBiomechanicsViewer';
import WebGLErrorBoundary from '@/components/WebGLErrorBoundary';

export const metadata: Metadata = {
  title: '3D Joint Biomechanics & Goniometry Visualizer | Physiotherapy | Mediverse',
  description: 'Interactive joint kinematics simulator with standard goniometer landmark alignment and physiological end-feel assessment for physical therapy education.'
};

export default function JointBiomechanicsPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#090d16', padding: '32px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <WebGLErrorBoundary
          fallbackTitle="Joint Biomechanics Viewer Unavailable"
          fallbackDescription="WebGL is required for 3D joint biomechanics visualization."
        >
          <JointBiomechanicsViewer />
        </WebGLErrorBoundary>
      </div>
    </main>
  );
}
