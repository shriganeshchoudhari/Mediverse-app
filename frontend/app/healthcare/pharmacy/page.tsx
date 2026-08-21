import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pharmacy | Pharm.D B.Pharm M.Pharm | Mediverse',
  description: 'Pharmacy education programs.',
};

export default function PharmacyPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Pharmacy & Clinical Pharmacotherapy</h1>
      
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
        <Link href="/healthcare/pharmacy/pharmd" style={{ padding: '2rem', border: '1px solid blue', borderRadius: '8px', textDecoration: 'none', color: 'blue' }}>
          <h2>Pharm.D</h2>
          <p>Doctor of Pharmacy</p>
        </Link>
        <Link href="/healthcare/pharmacy/bpharm" style={{ padding: '2rem', border: '1px solid green', borderRadius: '8px', textDecoration: 'none', color: 'green' }}>
          <h2>B.Pharm</h2>
          <p>Bachelor of Pharmacy</p>
        </Link>
        <Link href="/healthcare/pharmacy/mpharm" style={{ padding: '2rem', border: '1px solid purple', borderRadius: '8px', textDecoration: 'none', color: 'purple' }}>
          <h2>M.Pharm</h2>
          <p>Master of Pharmacy</p>
        </Link>
      </div>

      <h2>Interactive Simulators</h2>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <div style={{ padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>PK/PD Simulation</div>
        <div style={{ padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>Therapeutic Drug Monitoring</div>
        <div style={{ padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>Drug-Drug Interaction Checker</div>
        <div style={{ padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>Pharmacovigilance Dashboard</div>
      </div>
    </div>
  );
}
