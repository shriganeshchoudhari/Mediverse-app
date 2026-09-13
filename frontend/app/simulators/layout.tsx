import React from 'react';
import ClinicalSimulationDisclaimer from '@/components/simulators/ClinicalSimulationDisclaimer';

export default function SimulatorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        {children}
      </div>
      <ClinicalSimulationDisclaimer />
    </div>
  );
}
