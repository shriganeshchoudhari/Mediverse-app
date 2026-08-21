import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Physiotherapy | BPT MPT | Mediverse',
  description: 'BPT, MPT — 3D joint biomechanics visualizer, ROM & gait analysis, neurorehabilitation protocols, and sports physiotherapy case studies on Mediverse.',
};

export default function PhysiotherapyPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Physiotherapy & Rehabilitation Sciences</h1>
      <p>Explore our undergraduate and postgraduate physiotherapy programs.</p>

      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <Link href="/healthcare/physiotherapy/bpt" style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', textDecoration: 'none', color: 'inherit', flex: 1 }}>
          <h2>Bachelor of Physiotherapy (BPT)</h2>
          <p>4.5 Years including internship</p>
        </Link>

        <Link href="/healthcare/physiotherapy/mpt" style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', textDecoration: 'none', color: 'inherit', flex: 1 }}>
          <h2>Master of Physiotherapy (MPT)</h2>
          <p>2 Years specialization</p>
        </Link>
      </div>

      <section style={{ marginTop: '40px' }}>
        <h2>Simulators Quick Launch</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
            <h3>Goniometry & ROM</h3>
            <p>Interactive joint ROM measurement.</p>
          </div>
          <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
            <h3>Gait Analysis</h3>
            <p>Pathological gait simulators.</p>
          </div>
          <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
            <h3>Electrotherapy</h3>
            <p>TENS, Ultrasound, and IFT setups.</p>
          </div>
          <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
            <h3>Neuro Rehab</h3>
            <p>PNF and Bobath techniques.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
