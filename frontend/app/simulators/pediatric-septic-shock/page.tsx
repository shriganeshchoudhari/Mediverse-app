import { Metadata } from 'next';
import PediatricSepticShockSimulator from '../../../components/simulators/PediatricSepticShockSimulator';

export const metadata: Metadata = {
  title: 'Pediatric Septic Shock & Resuscitation Workstation | Mediverse',
  description:
    'Simulate pediatric septic shock resuscitation using PALS, Surviving Sepsis Campaign Pediatric (2020), and Phoenix Sepsis Criteria (2024). Cold vs warm shock phenotyping, Vasoactive-Inotropic Score (VIS), FEAST-informed fluid titration, and CIRCI stress-dose hydrocortisone rescue.',
};

export default function PediatricSepticShockPage() {
  return (
    <main className="min-h-screen bg-slate-950 py-8">
      <PediatricSepticShockSimulator />
    </main>
  );
}
