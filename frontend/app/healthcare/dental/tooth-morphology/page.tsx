import type { Metadata } from 'next';
import ToothMorphologyViewer from '@/components/dental/ToothMorphologyViewer';
import WebGLErrorBoundary from '@/components/WebGLErrorBoundary';

export const metadata: Metadata = {
  title: 'Tooth Morphology 3D Explorer | BDS Dental Sciences | Mediverse',
  description: 'Interactive 3D tooth morphology explorer for all 32 permanent and 20 primary teeth. Visualize enamel, dentine, pulp, and root canal configurations with Vertucci classification for BDS dental students.',
};

export default function ToothMorphologyPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#0f172a' }}>
      <WebGLErrorBoundary
        fallbackTitle="Tooth Morphology Viewer Unavailable"
        fallbackDescription="WebGL is required for 3D tooth visualization. Please use a desktop browser with hardware acceleration enabled."
      >
        <ToothMorphologyViewer />
      </WebGLErrorBoundary>
    </main>
  );
}
