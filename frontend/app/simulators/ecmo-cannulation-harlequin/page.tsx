import React from 'react';
import type { Metadata } from 'next';
import EcmoCannulationSimulator from '@/components/simulators/EcmoCannulationSimulator';

export const metadata: Metadata = {
  title: 'ECMO Cannulation & Harlequin Syndrome Workstation | Mediverse',
  description: 'Interactive cardiothoracic surgery and critical care simulator: VV vs VA vs VAV hybrid ECMO, Harlequin (North-South) dual circulation, right radial arterial line monitoring, ECPELLA LV unloading, and distal perfusion catheters.',
  openGraph: {
    title: 'ECMO Cannulation & Harlequin Syndrome Workstation | Mediverse',
    description: 'Interactive cardiothoracic surgery and critical care simulator: VV vs VA vs VAV hybrid ECMO, Harlequin (North-South) dual circulation, right radial arterial line monitoring, ECPELLA LV unloading, and distal perfusion catheters.',
    url: 'https://mediverse.app/simulators/ecmo-cannulation-harlequin',
    siteName: 'Mediverse Medical Simulation',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ECMO Cannulation & Harlequin Syndrome Workstation | Mediverse',
    description: 'Interactive cardiothoracic surgery and critical care simulator: VV vs VA vs VAV hybrid ECMO, Harlequin (North-South) dual circulation, right radial arterial line monitoring, ECPELLA LV unloading, and distal perfusion catheters.',
  },
};


export const dynamic = 'force-static';
export default function EcmoCannulationPage() {
  return <EcmoCannulationSimulator />;
}
