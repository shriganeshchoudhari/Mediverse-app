import { Metadata } from 'next';
import MassiveTransfusionDcrSimulator from '@/components/simulators/MassiveTransfusionDcrSimulator';

export const metadata: Metadata = {
  title: 'Massive Transfusion Protocol (MTP) & Damage Control Resuscitation | Mediverse',
  description:
    'Interactive Damage Control Resuscitation (DCR), Massive Transfusion Protocol (MTP) cooler dispatch, ABC Score activation, Lethal Triad biophysics, permissive hypotension, and viscoelastic TEG hemostatic guidance.',
};

export default function MassiveTransfusionDcrPage() {
  return <MassiveTransfusionDcrSimulator />;
}
