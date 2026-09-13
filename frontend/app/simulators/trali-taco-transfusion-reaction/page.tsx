import React from 'react';
import type { Metadata } from 'next';
import TransfusionReactionSimulator from '@/components/simulators/TransfusionReactionSimulator';

export const metadata: Metadata = {
  title: 'AHTR & TRALI vs TACO Workstation | Mediverse',
  description:
    'Immunohematology & critical care simulator: Acute hemolytic transfusion reaction (ABO incompatibility, DAT, haptoglobin, Coca-Cola urine, pigment nephropathy) and the TRALI vs TACO differential matrix.',
};

export default function TransfusionReactionPage() {
  return <TransfusionReactionSimulator />;
}
