import React from 'react';
import { Metadata } from 'next';
import AcetaminophenSimulator from '../../../components/simulators/AcetaminophenSimulator';

export const metadata: Metadata = {
  title: 'Acetaminophen Toxicity, Rumack-Matthew & NAC Precision Workstation | Mediverse',
  description:
    'Interactive toxicology and hepatology workstation modeling the Rumack-Matthew nomogram, NAPQI glutathione depletion kinetics, N-Acetylcysteine (NAC) precision protocols, and King\'s College emergency liver transplant criteria.',
};

export default function AcetaminophenToxicityPage() {
  return <AcetaminophenSimulator />;
}
