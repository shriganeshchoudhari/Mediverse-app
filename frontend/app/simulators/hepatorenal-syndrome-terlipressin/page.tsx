import React from 'react';
import type { Metadata } from 'next';
import HepatorenalSyndromeSimulator from '@/components/simulators/HepatorenalSyndromeSimulator';

export const metadata: Metadata = {
  title: 'Hepatorenal Syndrome (HRS-AKI), SBP & Terlipressin Workstation | Mediverse',
  description: 'Interactive ICA-AKI clinical simulator: 48h albumin challenge, splanchnic arterial vasodilation, Terlipressin vs pressors, CONFIRM trial hypoxemic respiratory failure warning, LVP/PPCD albumin dosing, and SBP Sort protocol.',
  openGraph: {
    title: 'Hepatorenal Syndrome (HRS-AKI), SBP & Terlipressin Workstation | Mediverse',
    description: 'Interactive ICA-AKI clinical simulator: 48h albumin challenge, splanchnic arterial vasodilation, Terlipressin vs pressors, CONFIRM trial hypoxemic respiratory failure warning, LVP/PPCD albumin dosing, and SBP Sort protocol.',
    url: 'https://mediverse.app/simulators/hepatorenal-syndrome-terlipressin',
    siteName: 'Mediverse Medical Simulation',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hepatorenal Syndrome (HRS-AKI), SBP & Terlipressin Workstation | Mediverse',
    description: 'Interactive ICA-AKI clinical simulator: 48h albumin challenge, splanchnic arterial vasodilation, Terlipressin vs pressors, CONFIRM trial hypoxemic respiratory failure warning, LVP/PPCD albumin dosing, and SBP Sort protocol.',
  },
};


export const dynamic = 'force-static';
export default function HepatorenalSyndromePage() {
  return <HepatorenalSyndromeSimulator />;
}
