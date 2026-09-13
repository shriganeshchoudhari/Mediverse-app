import { Metadata } from 'next';
import ElbwNicuSimulator from '../../../components/simulators/ElbwNicuSimulator';

export const metadata: Metadata = {
  title: 'ELBW NICU Resuscitation Workstation | Mediverse',
  description: 'Simulate extremely low birth weight (< 1000g) micropremie intensive care: insensible water loss thermodynamics, Total Parenteral Nutrition (TPN) and Glucose Infusion Rate (GIR), hemodynamically significant PDA ductal steal, and RDS surfactant administration with post-delivery weaning.',
  openGraph: {
    title: 'ELBW NICU Resuscitation Workstation | Mediverse',
    description: 'Simulate extremely low birth weight (< 1000g) micropremie intensive care: insensible water loss thermodynamics, Total Parenteral Nutrition (TPN) and Glucose Infusion Rate (GIR), hemodynamically significant PDA ductal steal, and RDS surfactant administration with post-delivery weaning.',
    url: 'https://mediverse.app/simulators/elbw-nicu-resuscitation',
    siteName: 'Mediverse Medical Simulation',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ELBW NICU Resuscitation Workstation | Mediverse',
    description: 'Simulate extremely low birth weight (< 1000g) micropremie intensive care: insensible water loss thermodynamics, Total Parenteral Nutrition (TPN) and Glucose Infusion Rate (GIR), hemodynamically significant PDA ductal steal, and RDS surfactant administration with post-delivery weaning.',
  },
};


export const dynamic = 'force-static';
export default function ElbwNicuResuscitationPage() {
  return (
    <main className="min-h-screen bg-slate-950 py-8">
      <ElbwNicuSimulator />
    </main>
  );
}
