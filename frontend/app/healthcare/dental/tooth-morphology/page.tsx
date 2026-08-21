import type { Metadata } from 'next';
import ToothMorphologyViewer from '@/components/dental/ToothMorphologyViewer';

export const metadata: Metadata = {
  title: 'Tooth Morphology 3D Explorer | BDS Dental Sciences | Mediverse',
  description: 'Interactive 3D tooth morphology explorer for all 32 permanent and 20 primary teeth. Visualize enamel, dentine, pulp, and root canal configurations with Vertucci classification for BDS dental students.',
};

export default function ToothMorphologyPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#0f172a' }}>
      <ToothMorphologyViewer />
    </main>
  );
}
