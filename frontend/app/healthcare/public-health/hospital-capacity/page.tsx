import type { Metadata } from 'next';
import HospitalCapacitySimulator from '@/components/public-health/HospitalCapacitySimulator';

export const metadata: Metadata = {
  title: 'Hospital Capacity & Bed Occupancy Simulator | Public Health | Mediverse',
  description: 'Interactive hospital operations model: evaluate Bed Occupancy Rate (BOR%), Average Length of Stay (ALOS), Bed Turnover Interval (BTI), and Erlang-C ICU queueing bottlenecks for MHA students.'
};

export default function HospitalCapacityPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#090d16', padding: '32px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <HospitalCapacitySimulator />
      </div>
    </main>
  );
}
