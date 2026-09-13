import React from 'react';
import { Metadata } from 'next';
import StatusEpilepticusSimulator from '../../../components/simulators/StatusEpilepticusSimulator';

export const metadata: Metadata = {
  title: 'Status Epilepticus Emergency Protocol Workstation | Mediverse',
  description: 'Comprehensive Neurocritical Care & Emergency Medicine workstation modeling the American Epilepsy Society (AES) & Neurocritical Care Society (NCS) status epilepticus protocol, ESETT trial second-line ASMs, refractory burst suppression, and Salzburg NCSE criteria.',
  openGraph: {
    title: 'Status Epilepticus Emergency Protocol Workstation | Mediverse',
    description: 'Comprehensive Neurocritical Care & Emergency Medicine workstation modeling the American Epilepsy Society (AES) & Neurocritical Care Society (NCS) status epilepticus protocol, ESETT trial second-line ASMs, refractory burst suppression, and Salzburg NCSE criteria.',
    url: 'https://mediverse.app/simulators/status-epilepticus-protocol',
    siteName: 'Mediverse Medical Simulation',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Status Epilepticus Emergency Protocol Workstation | Mediverse',
    description: 'Comprehensive Neurocritical Care & Emergency Medicine workstation modeling the American Epilepsy Society (AES) & Neurocritical Care Society (NCS) status epilepticus protocol, ESETT trial second-line ASMs, refractory burst suppression, and Salzburg NCSE criteria.',
  },
};


export const dynamic = 'force-static';
export default function StatusEpilepticusPage() {
  return <StatusEpilepticusSimulator />;
}
