import TridoshaANSSimulator from '@/components/ayush/TridoshaANSSimulator';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tridosha ANS Simulator | Mediverse AYUSH',
  description: 'Interactive physiological equilibrium solver for Vata, Pitta, and Kapha.',
};

export default function TridoshaANSPage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>AYUSH Domain: Tridosha ANS Dynamics</h1>
      <TridoshaANSSimulator />
    </div>
  );
}
