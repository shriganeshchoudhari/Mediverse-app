import React from 'react';
import { Metadata } from 'next';
import AcutePancreatitisSimulator from '../../../components/simulators/AcutePancreatitisSimulator';

export const metadata: Metadata = {
  title: 'Acute Pancreatitis, Revised Atlanta & WATERFALL Resuscitation Workstation | Mediverse',
  description:
    'Interactive gastroenterology and critical care workstation modeling the Revised Atlanta 2012 classification, Modified Marshall organ failure scoring, BISAP mortality index, and the NEJM WATERFALL goal-directed fluid resuscitation protocol.',
};

export default function AcutePancreatitisPage() {
  return <AcutePancreatitisSimulator />;
}
