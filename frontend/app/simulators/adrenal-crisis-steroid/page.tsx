import { Metadata } from 'next';
import AdrenalCrisisSimulator from '@/components/simulators/AdrenalCrisisSimulator';

export const metadata: Metadata = {
  title: 'Acute Adrenal Crisis & Steroid Equivalency Workstation | Mediverse',
  description: 'Interactive Addisonian crisis resuscitation, Cosyntropin (ACTH) stimulation testing, stress-dose protocols, and synthetic glucocorticoid/mineralocorticoid pharmacokinetics.',
  openGraph: {
    title: 'Acute Adrenal Crisis & Steroid Equivalency Workstation | Mediverse',
    description: 'Interactive Addisonian crisis resuscitation, Cosyntropin (ACTH) stimulation testing, stress-dose protocols, and synthetic glucocorticoid/mineralocorticoid pharmacokinetics.',
    url: 'https://mediverse.app/simulators/adrenal-crisis-steroid',
    siteName: 'Mediverse Medical Simulation',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Acute Adrenal Crisis & Steroid Equivalency Workstation | Mediverse',
    description: 'Interactive Addisonian crisis resuscitation, Cosyntropin (ACTH) stimulation testing, stress-dose protocols, and synthetic glucocorticoid/mineralocorticoid pharmacokinetics.',
  },
};


export const dynamic = 'force-static';
export default function AdrenalCrisisPage() {
  return <AdrenalCrisisSimulator />;
}
