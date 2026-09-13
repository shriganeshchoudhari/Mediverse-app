import React from 'react';
import type { Metadata } from 'next';
import TransfusionReactionSimulator from '@/components/simulators/TransfusionReactionSimulator';

export const metadata: Metadata = {
  title: 'AHTR & TRALI vs TACO Workstation | Mediverse',
  description: 'Immunohematology & critical care simulator: Acute hemolytic transfusion reaction (ABO incompatibility, DAT, haptoglobin, Coca-Cola urine, pigment nephropathy) and the TRALI vs TACO differential matrix.',
  openGraph: {
    title: 'AHTR & TRALI vs TACO Workstation | Mediverse',
    description: 'Immunohematology & critical care simulator: Acute hemolytic transfusion reaction (ABO incompatibility, DAT, haptoglobin, Coca-Cola urine, pigment nephropathy) and the TRALI vs TACO differential matrix.',
    url: 'https://mediverse.app/simulators/trali-taco-transfusion-reaction',
    siteName: 'Mediverse Medical Simulation',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AHTR & TRALI vs TACO Workstation | Mediverse',
    description: 'Immunohematology & critical care simulator: Acute hemolytic transfusion reaction (ABO incompatibility, DAT, haptoglobin, Coca-Cola urine, pigment nephropathy) and the TRALI vs TACO differential matrix.',
  },
};


export const dynamic = 'force-static';
export default function TransfusionReactionPage() {
  return <TransfusionReactionSimulator />;
}
