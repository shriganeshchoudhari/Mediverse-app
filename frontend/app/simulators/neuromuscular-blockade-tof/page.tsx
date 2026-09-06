import { Metadata } from 'next';
import NeuromuscularBlockadeSimulator from '@/components/simulators/NeuromuscularBlockadeSimulator';

export const metadata: Metadata = {
  title: 'Neuromuscular Blockade, Train-of-Four & Reversal Workstation | Mediverse',
  description:
    'Interactive Train-of-Four (TOF) acceleromyography, Post-Tetanic Count (PTC), Postoperative Residual Curarization (PORC) defense, and precision Sugammadex vs Neostigmine reversal protocols.',
};

export default function NeuromuscularBlockadePage() {
  return <NeuromuscularBlockadeSimulator />;
}
