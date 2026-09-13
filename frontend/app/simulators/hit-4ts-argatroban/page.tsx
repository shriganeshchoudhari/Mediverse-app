import React from 'react';
import { Metadata } from 'next';
import HitArgatrobanSimulator from '../../../components/simulators/HitArgatrobanSimulator';

export const metadata: Metadata = {
  title: 'Heparin-Induced Thrombocytopenia (HIT) Precision Workstation | Mediverse',
  description: 'Comprehensive Hematology & Critical Care workstation modeling Warkentin 4Ts clinical scoring, quantitative anti-PF4 ELISA optical density vs functional Serotonin Release Assay (SRA), organ-adjusted Direct Thrombin Inhibitor dosing (Argatroban vs Bivalirudin), and Warfarin gangrene safeguards.',
  openGraph: {
    title: 'Heparin-Induced Thrombocytopenia (HIT) Precision Workstation | Mediverse',
    description: 'Comprehensive Hematology & Critical Care workstation modeling Warkentin 4Ts clinical scoring, quantitative anti-PF4 ELISA optical density vs functional Serotonin Release Assay (SRA), organ-adjusted Direct Thrombin Inhibitor dosing (Argatroban vs Bivalirudin), and Warfarin gangrene safeguards.',
    url: 'https://mediverse.app/simulators/hit-4ts-argatroban',
    siteName: 'Mediverse Medical Simulation',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Heparin-Induced Thrombocytopenia (HIT) Precision Workstation | Mediverse',
    description: 'Comprehensive Hematology & Critical Care workstation modeling Warkentin 4Ts clinical scoring, quantitative anti-PF4 ELISA optical density vs functional Serotonin Release Assay (SRA), organ-adjusted Direct Thrombin Inhibitor dosing (Argatroban vs Bivalirudin), and Warfarin gangrene safeguards.',
  },
};


export const dynamic = 'force-static';
export default function HitArgatrobanPage() {
  return <HitArgatrobanSimulator />;
}
