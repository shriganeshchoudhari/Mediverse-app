import { Metadata } from 'next';
import SpinalCordInjurySimulator from '@/components/simulators/SpinalCordInjurySimulator';

export const metadata: Metadata = {
  title: 'Acute Spinal Cord Injury & Neurogenic Shock Workstation | Mediverse',
  description: 'Neurotrauma, neurocritical care, and emergency medicine simulation of acute traumatic spinal cord injury (SCI), neurogenic shock vs spinal shock, AANS/CNS MAP augmentation (85-90 mmHg), bulbocavernosus reflex (S2-S4), ASIA impairment scale, and autonomic dysreflexia.',
  openGraph: {
    title: 'Acute Spinal Cord Injury & Neurogenic Shock Workstation | Mediverse',
    description: 'Neurotrauma, neurocritical care, and emergency medicine simulation of acute traumatic spinal cord injury (SCI), neurogenic shock vs spinal shock, AANS/CNS MAP augmentation (85-90 mmHg), bulbocavernosus reflex (S2-S4), ASIA impairment scale, and autonomic dysreflexia.',
    url: 'https://mediverse.app/simulators/spinal-cord-injury-neurogenic-shock',
    siteName: 'Mediverse Medical Simulation',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Acute Spinal Cord Injury & Neurogenic Shock Workstation | Mediverse',
    description: 'Neurotrauma, neurocritical care, and emergency medicine simulation of acute traumatic spinal cord injury (SCI), neurogenic shock vs spinal shock, AANS/CNS MAP augmentation (85-90 mmHg), bulbocavernosus reflex (S2-S4), ASIA impairment scale, and autonomic dysreflexia.',
  },
};


export const dynamic = 'force-static';
export default function SpinalCordInjuryPage() {
  return <SpinalCordInjurySimulator />;
}
