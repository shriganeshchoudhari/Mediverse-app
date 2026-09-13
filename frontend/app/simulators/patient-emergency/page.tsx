import React from 'react';
import type { Metadata } from 'next';
import PatientEmergencySimulator from '@/components/simulators/PatientEmergencySimulator';

export const metadata: Metadata = {
  title: 'Acute Patient Emergency Resuscitation Workstation | Mediverse',
  description: 'Emergency medicine simulation environment for rapid assessment, ABCDE stabilization, pharmacologic dosing titration, and acute clinical crisis management.',
};

export const dynamic = 'force-static';

export default function PatientEmergencyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <PatientEmergencySimulator />
    </main>
  );
}
