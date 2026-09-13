import React from 'react';
import type { Metadata } from 'next';
import MassivePulmonaryEmbolismSimulator from '@/components/simulators/MassivePulmonaryEmbolismSimulator';

export const metadata: Metadata = {
  title: 'Massive Pulmonary Embolism & RV Resuscitation Workstation | Mediverse',
  description:
    'Interactive ESC/AHA/CHEST clinical simulator for massive & submassive pulmonary embolism: RV death spiral biomechanics, echocardiographic strain markers (McConnell, 60/60 sign, TAPSE), judicious fluid restriction (<500 mL), vasopressor titration, systemic thrombolysis, catheter-directed therapies (EKOS/Inari), and ECMO.',
};

export default function MassivePulmonaryEmbolismPage() {
  return <MassivePulmonaryEmbolismSimulator />;
}
