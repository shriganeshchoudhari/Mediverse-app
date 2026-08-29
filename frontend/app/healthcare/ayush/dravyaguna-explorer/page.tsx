import DravyagunaHerbMatrix from '@/components/ayush/DravyagunaHerbMatrix';
import DravyagunaExplorer from '@/components/ayush/DravyagunaExplorer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dravyaguna Herbology Matrix & Interaction Sentinel | Mediverse AYUSH',
  description: 'Searchable Ayurvedic pharmacognosy, Rasa Panchaka atlas, and Western herb-drug interaction checker.',
};

export default function DravyagunaExplorerPage() {
  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
      <DravyagunaHerbMatrix />
      <div style={{ marginTop: '2rem' }}>
        <DravyagunaExplorer />
      </div>
    </div>
  );
}
