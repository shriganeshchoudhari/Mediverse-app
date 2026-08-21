import type { Metadata } from 'next';
import CTSliceWindowViewer from '@/components/allied/CTSliceWindowViewer';

export const metadata: Metadata = {
  title: 'CT Hounsfield Unit & 3D Slice Windowing Explorer | Allied Health | Mediverse',
  description: 'Interactive computed tomography diagnostic windowing tool with live Window Width (WW) and Window Level (WL) adjustment for radiology imaging students.'
};

export default function CTSliceExplorerPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#090d16', padding: '32px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <CTSliceWindowViewer />
      </div>
    </main>
  );
}
