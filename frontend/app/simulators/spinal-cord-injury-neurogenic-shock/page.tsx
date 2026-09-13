import { Metadata } from 'next';
import SpinalCordInjurySimulator from '@/components/simulators/SpinalCordInjurySimulator';

export const metadata: Metadata = {
  title: 'Acute Spinal Cord Injury & Neurogenic Shock Workstation | Mediverse',
  description: 'Neurotrauma, neurocritical care, and emergency medicine simulation of acute traumatic spinal cord injury (SCI), neurogenic shock vs spinal shock, AANS/CNS MAP augmentation (85-90 mmHg), bulbocavernosus reflex (S2-S4), ASIA impairment scale, and autonomic dysreflexia.'
};

export default function SpinalCordInjuryPage() {
  return <SpinalCordInjurySimulator />;
}
