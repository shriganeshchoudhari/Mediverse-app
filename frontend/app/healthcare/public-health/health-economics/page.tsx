import type { Metadata } from 'next';
import HealthEconomicsSimulator from '@/components/public-health/HealthEconomicsSimulator';

export const metadata: Metadata = {
  title: 'Health Economics Cost-Effectiveness & QALY Calculator | Public Health | Mediverse',
  description: 'Interactive health technology assessment: evaluate Incremental Cost-Effectiveness Ratio (ICER), Quality-Adjusted Life Years (QALY), and WHO GDP-per-capita decision thresholds.'
};

export default function HealthEconomicsPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#090d16', padding: '32px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <HealthEconomicsSimulator />
      </div>
    </main>
  );
}
