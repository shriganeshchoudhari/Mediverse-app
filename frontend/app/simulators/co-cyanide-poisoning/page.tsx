import { Metadata } from 'next';
import CoCyanidePoisoningSimulator from '../../../components/simulators/CoCyanidePoisoningSimulator';

export const metadata: Metadata = {
  title: 'CO & Cyanide Poisoning Workstation | Mediverse',
  description:
    'Simulate smoke inhalation dual toxicity: carboxyhemoglobin multi-mode elimination kinetics, pulse oximetry pitfall, mitochondrial Complex IV cyanide shutdown, Hydroxocobalamin (Cyanokit) stoichiometry, and Hyperbaric Oxygen (HBO2) protocols.',
};

export default function CoCyanidePoisoningPage() {
  return (
    <main className="min-h-screen bg-slate-950 py-8">
      <CoCyanidePoisoningSimulator />
    </main>
  );
}
