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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', marginTop: '16px' }}>
        <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
          <h4>IV Insertion</h4>
          <button>Launch</button>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
          <h4>ECG Simulator</h4>
          <button>Launch</button>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
          <h4>Wound Care</h4>
          <button>Launch</button>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
          <h4>Ventilator Settings</h4>
          <button>Launch</button>
        </div>
      </div>
    </div>
  );
}
