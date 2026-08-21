import type { Metadata } from 'next';
import VeterinarySurgeryStation from '@/components/veterinary/VeterinarySurgeryStation';

export const metadata: Metadata = {
  title: 'Veterinary Emergency Surgery Station | Veterinary Medicine | Mediverse',
  description: 'Interactive high-stakes small and large animal surgical emergency workflows: step-by-step procedure checks, anesthetic considerations, and intraoperative safety traps.'
};

export default function VeterinarySurgeryPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#090d16', padding: '32px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <VeterinarySurgeryStation />
      </div>
    </main>
  );
}
