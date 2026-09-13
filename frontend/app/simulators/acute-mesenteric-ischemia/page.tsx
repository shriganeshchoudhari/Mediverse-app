import { Metadata } from 'next';
import MesentericIschemiaSimulator from '@/components/simulators/MesentericIschemiaSimulator';

export const metadata: Metadata = {
  title: 'Acute Mesenteric Ischemia & Revascularization Workstation | Mediverse',
  description: 'Vascular surgery, critical care, and gastroenterology simulation of acute mesenteric ischemia (AMI), 4 subtypes (SMA embolism, thrombosis, NOMI, MVT), biphasic CTA, serum lactate false-negative pitfall, intra-arterial papaverine, and second-look laparotomy.'
};


export const dynamic = 'force-static';
export default function AcuteMesentericIschemiaPage() {
  return <MesentericIschemiaSimulator />;
}
