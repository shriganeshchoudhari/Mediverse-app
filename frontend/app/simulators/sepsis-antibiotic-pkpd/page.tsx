import { Metadata } from 'next';
import SepsisAntibioticSimulator from '@/components/simulators/SepsisAntibioticSimulator';

export const metadata: Metadata = {
  title: 'Sepsis Bundles (SEP-1), Antibiotic PK/PD & Procalcitonin Workstation | Mediverse',
  description:
    'Interactive Surviving Sepsis Campaign Hour-1 (SEP-1) protocol adherence, antimicrobial PK/PD optimization, Augmented Renal Clearance (ARC) detection, and procalcitonin-guided de-escalation engine.',
};

export default function SepsisAntibioticPage() {
  return <SepsisAntibioticSimulator />;
}
