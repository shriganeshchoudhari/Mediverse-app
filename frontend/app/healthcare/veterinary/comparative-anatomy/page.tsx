import type { Metadata } from 'next';
import ComparativeAnatomyViewer from '@/components/veterinary/ComparativeAnatomyViewer';
import WebGLErrorBoundary from '@/components/WebGLErrorBoundary';

export const metadata: Metadata = {
  title: 'Comparative Vertebrate Anatomy Explorer | Veterinary Medicine | Mediverse',
  description: 'Interactive multi-species comparative anatomy explorer: Human vs Canine vs Feline vs Equine vs Bovine across digestive, skeletal, and dental organ systems for veterinary students.'
};

export default function ComparativeAnatomyPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#090d16', padding: '32px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <WebGLErrorBoundary
          fallbackTitle="Comparative Anatomy Viewer Unavailable"
          fallbackDescription="WebGL is required for 3D comparative anatomy visualization."
        >
          <ComparativeAnatomyViewer />
        </WebGLErrorBoundary>
      </div>
    </main>
  );
}
