import React from 'react';
import type { Metadata } from 'next';
import StatusMigrainosusCSFLeakSimulator from '@/components/simulators/StatusMigrainosusCSFLeakSimulator';

export const metadata: Metadata = {
  title: 'Status Migrainosus & Intracranial Hypotension Workstation | Mediverse',
  description:
    'Interactive neurology and neurocritical care simulator: Monro-Kellie doctrine, CSF volume depletion, orthostatic headache mechanics, DHE-triptan 24h vasospasm contraindication, subdural hygroma burr hole hazard, and epidural blood patch.',
};

export default function StatusMigrainosusCSFLeakPage() {
  return <StatusMigrainosusCSFLeakSimulator />;
}
