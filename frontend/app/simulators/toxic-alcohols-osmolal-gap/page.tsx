import { Metadata } from 'next';
import ToxicAlcoholsSimulator from '@/components/simulators/ToxicAlcoholsSimulator';

export const metadata: Metadata = {
  title: 'Toxic Alcohols, Osmolal Gap & Fomepizole Precision Workstation | Mediverse',
  description: 'Critical care toxicology simulation for methanol, ethylene glycol, and isopropanol ingestions. Model osmolal gap vs anion gap crossover, calcium oxalate crystals, fomepizole dosing, and emergent hemodialysis.',
  openGraph: {
    title: 'Toxic Alcohols, Osmolal Gap & Fomepizole Precision Workstation | Mediverse',
    description: 'Critical care toxicology simulation for methanol, ethylene glycol, and isopropanol ingestions. Model osmolal gap vs anion gap crossover, calcium oxalate crystals, fomepizole dosing, and emergent hemodialysis.',
    url: 'https://mediverse.app/simulators/toxic-alcohols-osmolal-gap',
    siteName: 'Mediverse Medical Simulation',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Toxic Alcohols, Osmolal Gap & Fomepizole Precision Workstation | Mediverse',
    description: 'Critical care toxicology simulation for methanol, ethylene glycol, and isopropanol ingestions. Model osmolal gap vs anion gap crossover, calcium oxalate crystals, fomepizole dosing, and emergent hemodialysis.',
  },
};


export const dynamic = 'force-static';
export default function ToxicAlcoholsPage() {
  return <ToxicAlcoholsSimulator />;
}
