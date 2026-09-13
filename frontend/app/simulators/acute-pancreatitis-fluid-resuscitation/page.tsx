import React from 'react';
import { Metadata } from 'next';
import AcutePancreatitisSimulator from '../../../components/simulators/AcutePancreatitisSimulator';

export const metadata: Metadata = {
  title: 'Acute Pancreatitis, Revised Atlanta & WATERFALL Resuscitation Workstation | Mediverse',
  description: 'Interactive gastroenterology and critical care workstation modeling the Revised Atlanta 2012 classification, Modified Marshall organ failure scoring, BISAP mortality index, and the NEJM WATERFALL goal-directed fluid resuscitation protocol.',
  openGraph: {
    title: 'Acute Pancreatitis, Revised Atlanta & WATERFALL Resuscitation Workstation | Mediverse',
    description: 'Interactive gastroenterology and critical care workstation modeling the Revised Atlanta 2012 classification, Modified Marshall organ failure scoring, BISAP mortality index, and the NEJM WATERFALL goal-directed fluid resuscitation protocol.',
    url: 'https://mediverse.app/simulators/acute-pancreatitis-fluid-resuscitation',
    siteName: 'Mediverse Medical Simulation',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Acute Pancreatitis, Revised Atlanta & WATERFALL Resuscitation Workstation | Mediverse',
    description: 'Interactive gastroenterology and critical care workstation modeling the Revised Atlanta 2012 classification, Modified Marshall organ failure scoring, BISAP mortality index, and the NEJM WATERFALL goal-directed fluid resuscitation protocol.',
  },
};


export const dynamic = 'force-static';
export default function AcutePancreatitisPage() {
  return <AcutePancreatitisSimulator />;
}
