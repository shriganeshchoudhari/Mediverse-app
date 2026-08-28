import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Nursing | B.Sc Nursing M.Sc Nursing | Mediverse',
  description: 'B.Sc Nursing, M.Sc Nursing — ICU critical care protocols, OSCE nursing skill stations, medication administration safety, and wound care modules on Mediverse.',
};

export default function NursingPage() {
  return (
    <div style={{ padding: '24px' }}>
      <h1>Nursing Education Portal</h1>
      <p>Explore undergraduate and postgraduate programs along with simulation modules.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '24px' }}>
        <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
          <h2>B.Sc Nursing</h2>
          <p>4-year INC curriculum.</p>
          <Link href="/healthcare/nursing/bscnursing">
            <button>View Curriculum</button>
          </Link>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
          <h2>M.Sc Nursing</h2>
          <p>Postgraduate specialties.</p>
          <Link href="/healthcare/nursing/mscnursing">
            <button>View Specialties</button>
          </Link>
        </div>
      </div>

      <h2 style={{ marginTop: '32px' }}>Simulators Launcher</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '16px' }}>
        <div style={{ border: '1px solid #334155', padding: '16px', borderRadius: '8px', background: '#0f172a', color: '#f8fafc' }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#38bdf8' }}>SOAPIE Documentation</h4>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 12px 0' }}>Accredited clinical documentation & real-time rubric evaluator.</p>
          <Link href="/healthcare/nursing/soapie-documentation">
            <button style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Launch Simulator</button>
          </Link>
        </div>
        <div style={{ border: '1px solid #334155', padding: '16px', borderRadius: '8px', background: '#0f172a', color: '#f8fafc' }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#38bdf8' }}>NEWS2 Escalation</h4>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 12px 0' }}>Deterioration score calculator & SBAR communication tool.</p>
          <Link href="/healthcare/nursing/news2-escalation">
            <button style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Launch Simulator</button>
          </Link>
        </div>
        <div style={{ border: '1px solid #334155', padding: '16px', borderRadius: '8px', background: '#0f172a', color: '#f8fafc' }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#38bdf8' }}>Braden Wound Care</h4>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 12px 0' }}>Pressure injury risk scoring & dressing selection guide.</p>
          <Link href="/healthcare/nursing/braden-wound-care">
            <button style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Launch Simulator</button>
          </Link>
        </div>
        <div style={{ border: '1px solid #334155', padding: '16px', borderRadius: '8px', background: '#0f172a', color: '#f8fafc' }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#38bdf8' }}>IV Drip Rate Calculator</h4>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 12px 0' }}>Drop rate calculation with visual drip chamber animation.</p>
          <Link href="/healthcare/nursing/iv-drip-rate">
            <button style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Launch Calculator</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
