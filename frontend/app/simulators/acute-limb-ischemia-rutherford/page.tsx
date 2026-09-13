import React from 'react';
import type { Metadata } from 'next';
import AcuteLimbIschemiaSimulator from '@/components/simulators/AcuteLimbIschemiaSimulator';

export const metadata: Metadata = {
  title: 'Acute Limb Ischemia & Rutherford Staging Workstation | Mediverse',
  description: 'Interactive vascular surgery and critical care simulator: Rutherford classification (I, IIa, IIb, III), The 6 Ps, Fogarty balloon catheter embolectomy, Catheter-Directed Thrombolysis (CDT) timing traps, reperfusion compartment syndrome (Delta Pressure), and the lethal washout catastrophe.',
  openGraph: {
    title: 'Acute Limb Ischemia & Rutherford Staging Workstation | Mediverse',
    description: 'Interactive vascular surgery and critical care simulator: Rutherford classification (I, IIa, IIb, III), The 6 Ps, Fogarty balloon catheter embolectomy, Catheter-Directed Thrombolysis (CDT) timing traps, reperfusion compartment syndrome (Delta Pressure), and the lethal washout catastrophe.',
    url: 'https://mediverse.app/simulators/acute-limb-ischemia-rutherford',
    siteName: 'Mediverse Medical Simulation',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Acute Limb Ischemia & Rutherford Staging Workstation | Mediverse',
    description: 'Interactive vascular surgery and critical care simulator: Rutherford classification (I, IIa, IIb, III), The 6 Ps, Fogarty balloon catheter embolectomy, Catheter-Directed Thrombolysis (CDT) timing traps, reperfusion compartment syndrome (Delta Pressure), and the lethal washout catastrophe.',
  },
};


export const dynamic = 'force-static';
export default function AcuteLimbIschemiaPage() {
  return <AcuteLimbIschemiaSimulator />;
}
