import React from 'react';
import { Metadata } from 'next';
import BedsideFlowsheetNews2Simulator from '@/components/simulators/BedsideFlowsheetNews2Simulator';

export const metadata: Metadata = {
  title: 'Bedside Flowsheet, Fluid Balance & Early Warning Deterioration (NEWS2) | Mediverse',
  description: 'Inpatient ICU and surgical ward flowsheet modeling 24-hour vital trends, Royal College of Physicians NEWS2 escalation pathways, cumulative fluid balance, and percent fluid overload (%FO).'
};

export const dynamic = 'force-static';

export default function BedsideFlowsheetNews2Page() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <BedsideFlowsheetNews2Simulator />
    </main>
  );
}
