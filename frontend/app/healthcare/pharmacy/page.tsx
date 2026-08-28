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

      <h2>Interactive Simulators & Clinical Tools</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
        <Link href="/healthcare/pharmacy/prescribing-simulator" style={{ padding: '1.25rem', background: '#0f172a', color: '#38bdf8', borderRadius: '8px', border: '1px solid #1e293b', textDecoration: 'none' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Prescription Simulator</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>Multi-case prescribing simulator with live contraindications & Miller rubrics</p>
        </Link>
        <Link href="/healthcare/pharmacy/pkpd-simulator" style={{ padding: '1.25rem', background: '#0f172a', color: '#c084fc', borderRadius: '8px', border: '1px solid #1e293b', textDecoration: 'none' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>PK/PD Simulation</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>1 & 2-compartment pharmacokinetic & pharmacodynamic modeling</p>
        </Link>
        <Link href="/healthcare/pharmacy/tdm-calculator" style={{ padding: '1.25rem', background: '#0f172a', color: '#34d399', borderRadius: '8px', border: '1px solid #1e293b', textDecoration: 'none' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Therapeutic Drug Monitoring</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>Narrow therapeutic index dosing and renal clearance calculator</p>
        </Link>
        <Link href="/healthcare/pharmacy/drug-interactions" style={{ padding: '1.25rem', background: '#0f172a', color: '#fbbf24', borderRadius: '8px', border: '1px solid #1e293b', textDecoration: 'none' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Drug Interaction Checker</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>CYP450 metabolism and polypharmacy synergy analyzer</p>
        </Link>
        <Link href="/healthcare/pharmacy/adr-assessor" style={{ padding: '1.25rem', background: '#0f172a', color: '#f87171', borderRadius: '8px', border: '1px solid #1e293b', textDecoration: 'none' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>ADR & Pharmacovigilance</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>Naranjo Algorithm and WHO-UMC causality assessment</p>
        </Link>
      </div>
    </div>
  );
}
