import { Metadata } from 'next';
import SynovialFluidGoutSimulator from '@/components/simulators/SynovialFluidGoutSimulator';

export const metadata: Metadata = {
  title: 'Synovial Fluid Polarized Microscopy & Gout Workstation | Mediverse',
  description:
    'Interactive Compensated Polarized Light Microscopy (CPLM), Monosodium Urate (MSU) vs CPPD birefringence, arthrocentesis sepsis triaging, 2015 ACR/EULAR Gout Classification, and HLA-B*5801 precision pharmacotherapy.',
};

export default function SynovialFluidGoutPage() {
  return <SynovialFluidGoutSimulator />;
}
