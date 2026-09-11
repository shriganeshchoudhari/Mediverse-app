import { Metadata } from 'next';
import LastLipidRescueSimulator from '@/components/simulators/LastLipidRescueSimulator';

export const metadata: Metadata = {
  title: 'Local Anesthetic Systemic Toxicity (LAST) & 20% Lipid Rescue Workstation | Mediverse',
  description:
    'Interactive ASRA resuscitation solver for Local Anesthetic Systemic Toxicity (LAST). Simulate Bupivacaine cardiotoxicity, QRS widening, 20% Lipid Emulsion bolus and infusion, reduced-dose epinephrine, and ECMO alerts.',
};

export default function LastLipidRescuePage() {
  return <LastLipidRescueSimulator />;
}
