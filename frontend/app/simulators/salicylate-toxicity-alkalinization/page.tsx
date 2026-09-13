import React from 'react';
import { Metadata } from 'next';
import SalicylateToxicitySimulator from '../../../components/simulators/SalicylateToxicitySimulator';

export const metadata: Metadata = {
  title: 'Salicylate Toxicity, Ion Trapping & EXTRIP Hemodialysis Workstation | Mediverse',
  description: 'Interactive clinical toxicology and nephrology workstation modeling mitochondrial uncoupling, mixed respiratory alkalosis + HAGMA, blood-brain barrier ion trapping biophysics, hypokalemic paradoxical aciduria, and EXTRIP emergent hemodialysis indications.',
  openGraph: {
    title: 'Salicylate Toxicity, Ion Trapping & EXTRIP Hemodialysis Workstation | Mediverse',
    description: 'Interactive clinical toxicology and nephrology workstation modeling mitochondrial uncoupling, mixed respiratory alkalosis + HAGMA, blood-brain barrier ion trapping biophysics, hypokalemic paradoxical aciduria, and EXTRIP emergent hemodialysis indications.',
    url: 'https://mediverse.app/simulators/salicylate-toxicity-alkalinization',
    siteName: 'Mediverse Medical Simulation',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Salicylate Toxicity, Ion Trapping & EXTRIP Hemodialysis Workstation | Mediverse',
    description: 'Interactive clinical toxicology and nephrology workstation modeling mitochondrial uncoupling, mixed respiratory alkalosis + HAGMA, blood-brain barrier ion trapping biophysics, hypokalemic paradoxical aciduria, and EXTRIP emergent hemodialysis indications.',
  },
};


export const dynamic = 'force-static';
export default function SalicylateToxicityPage() {
  return <SalicylateToxicitySimulator />;
}
