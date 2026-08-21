import DravyagunaExplorer from '@/components/ayush/DravyagunaExplorer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dravyaguna Explorer | Mediverse AYUSH',
  description: 'Searchable herb pharmacology database.',
};

export default function DravyagunaExplorerPage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>AYUSH Domain: Dravyaguna Explorer</h1>
      <DravyagunaExplorer />
    </div>
  );
}
