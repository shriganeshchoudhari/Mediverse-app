import { Metadata } from 'next';
import CompartmentSyndromeSimulator from '@/components/simulators/CompartmentSyndromeSimulator';

export const metadata: Metadata = {
  title: 'Acute Compartment Syndrome & Fasciotomy Workstation | Mediverse',
  description: 'Emergency medicine, orthopedic surgery, and critical care simulation of acute traumatic compartment syndrome (ATCS), intracompartmental pressure (ICP) transduction, McQueen Delta Pressure criteria (ΔP <= 30 mmHg), two-incision four-compartment fasciotomy, and crush syndrome rhabdomyolysis nephroprotection.'
};


export const dynamic = 'force-static';
export default function CompartmentSyndromePage() {
  return <CompartmentSyndromeSimulator />;
}
