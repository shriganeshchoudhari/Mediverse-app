import { Metadata } from 'next';
import AdrenalCrisisSimulator from '@/components/simulators/AdrenalCrisisSimulator';

export const metadata: Metadata = {
  title: 'Acute Adrenal Crisis & Steroid Equivalency Workstation | Mediverse',
  description:
    'Interactive Addisonian crisis resuscitation, Cosyntropin (ACTH) stimulation testing, stress-dose protocols, and synthetic glucocorticoid/mineralocorticoid pharmacokinetics.',
};

export default function AdrenalCrisisPage() {
  return <AdrenalCrisisSimulator />;
}
