import React from 'react';
import { Metadata } from 'next';
import HospitalCommandCenterSimulator from '@/components/simulators/HospitalCommandCenterSimulator';

export const metadata: Metadata = {
  title: 'Virtual Hospital Ward & Operational Command Center | Mediverse',
  description: 'Enterprise hospital operations workstation modeling multi-unit bed capacity, ED boarding, nurse-to-patient staffing ratios, HAC quality surveillance, and hospital surge mitigation.',
  openGraph: {
    title: 'Virtual Hospital Ward & Operational Command Center | Mediverse',
    description: 'Enterprise hospital operations workstation modeling multi-unit bed capacity, ED boarding, nurse-to-patient staffing ratios, HAC quality surveillance, and hospital surge mitigation.',
    url: 'https://mediverse.app/simulators/hospital-ward-command-center',
    siteName: 'Mediverse Medical Simulation',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Virtual Hospital Ward & Operational Command Center | Mediverse',
    description: 'Enterprise hospital operations workstation modeling multi-unit bed capacity, ED boarding, nurse-to-patient staffing ratios, HAC quality surveillance, and hospital surge mitigation.',
  },
};

export const dynamic = 'force-static';

export default function HospitalCommandCenterPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <HospitalCommandCenterSimulator />
    </main>
  );
}
