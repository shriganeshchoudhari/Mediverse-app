import { Metadata } from 'next';
import MethemoglobinSimulator from '@/components/simulators/MethemoglobinSimulator';

export const metadata: Metadata = {
  title: 'Methemoglobinemia & Sulfhemoglobinemia Workstation | Mediverse',
  description: 'Clinical toxicology simulation of methemoglobinemia, pulse oximetry saturation gap (~85% plateau), multi-wavelength co-oximetry, methylene blue kinetics, and G6PD hemolysis risk.'
};

export default function MethemoglobinemiaPage() {
  return <MethemoglobinSimulator />;
}
