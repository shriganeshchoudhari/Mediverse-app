import { Metadata } from 'next';
import UpperGiBleedingSimulator from '@/components/simulators/UpperGiBleedingSimulator';

export const metadata: Metadata = {
  title: 'Acute Upper GI Bleeding, Rockall & Hemostasis Workstation | Mediverse',
  description:
    'Interactive Glasgow-Blatchford Score (GBS) triage, Full Rockall scoring, Forrest ulcer classification, vasoactive octreotide/terlipressin infusions, endoscopic dual therapy, and salvage Sengstaken-Blakemore balloon tamponade.',
};

export default function UpperGiBleedingPage() {
  return <UpperGiBleedingSimulator />;
}
