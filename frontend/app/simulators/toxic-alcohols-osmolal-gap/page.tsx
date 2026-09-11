import { Metadata } from 'next';
import ToxicAlcoholsSimulator from '@/components/simulators/ToxicAlcoholsSimulator';

export const metadata: Metadata = {
  title: 'Toxic Alcohols, Osmolal Gap & Fomepizole Precision Workstation | Mediverse',
  description:
    'Critical care toxicology simulation for methanol, ethylene glycol, and isopropanol ingestions. Model osmolal gap vs anion gap crossover, calcium oxalate crystals, fomepizole dosing, and emergent hemodialysis.',
};

export default function ToxicAlcoholsPage() {
  return <ToxicAlcoholsSimulator />;
}
