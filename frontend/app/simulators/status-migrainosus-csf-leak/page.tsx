import React from 'react';
import type { Metadata } from 'next';
import StatusMigrainosusCSFLeakSimulator from '@/components/simulators/StatusMigrainosusCSFLeakSimulator';

export const metadata: Metadata = {
  title: 'Status Migrainosus & Intracranial Hypotension Workstation | Mediverse',
  description: 'Interactive neurology and neurocritical care simulator: Monro-Kellie doctrine, CSF volume depletion, orthostatic headache mechanics, DHE-triptan 24h vasospasm contraindication, subdural hygroma burr hole hazard, and epidural blood patch.',
  openGraph: {
    title: 'Status Migrainosus & Intracranial Hypotension Workstation | Mediverse',
    description: 'Interactive neurology and neurocritical care simulator: Monro-Kellie doctrine, CSF volume depletion, orthostatic headache mechanics, DHE-triptan 24h vasospasm contraindication, subdural hygroma burr hole hazard, and epidural blood patch.',
    url: 'https://mediverse.app/simulators/status-migrainosus-csf-leak',
    siteName: 'Mediverse Medical Simulation',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Status Migrainosus & Intracranial Hypotension Workstation | Mediverse',
    description: 'Interactive neurology and neurocritical care simulator: Monro-Kellie doctrine, CSF volume depletion, orthostatic headache mechanics, DHE-triptan 24h vasospasm contraindication, subdural hygroma burr hole hazard, and epidural blood patch.',
  },
};


export const dynamic = 'force-static';
export default function StatusMigrainosusCSFLeakPage() {
  return <StatusMigrainosusCSFLeakSimulator />;
}
