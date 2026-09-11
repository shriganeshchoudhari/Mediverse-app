import { Metadata } from 'next';
import PupilAnisocoriaHornerSimulator from '@/components/simulators/PupilAnisocoriaHornerSimulator';

export const metadata: Metadata = {
  title: 'Anisocoria, Pupillary Light Reflex & Horner Syndrome Workstation | Mediverse',
  description:
    'Interactive neuro-ophthalmology solver for anisocoria, Horner syndrome 3-neuron localization, Compressive CN III palsy, Adie tonic pupil, swinging flashlight RAPD, and Apraclonidine/Cocaine/Pilocarpine pharmacology.',
};

export default function PupilAnisocoriaHornerPage() {
  return <PupilAnisocoriaHornerSimulator />;
}
