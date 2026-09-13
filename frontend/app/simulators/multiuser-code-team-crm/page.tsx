import React from 'react';
import { Metadata } from 'next';
import CodeTeamCrmSimulator from '@/components/simulators/CodeTeamCrmSimulator';

export const metadata: Metadata = {
  title: 'Multi-User Code Team & Virtual OR Crisis Resource Management (CRM) Workstation | Mediverse',
  description: 'Interprofessional resuscitation workstation modeling 6 clinical code roles, AHA ACLS 2-minute cycle loops, closed-loop communication verification, chest compression fraction (CCF), and reversible H and T etiologies.',
  openGraph: {
    title: 'Multi-User Code Team & Virtual OR Crisis Resource Management (CRM) Workstation | Mediverse',
    description: 'Interprofessional resuscitation workstation modeling 6 clinical code roles, AHA ACLS 2-minute cycle loops, closed-loop communication verification, chest compression fraction (CCF), and reversible H and T etiologies.',
    url: 'https://mediverse.app/simulators/multiuser-code-team-crm',
    siteName: 'Mediverse Medical Simulation',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Multi-User Code Team & Virtual OR Crisis Resource Management (CRM) Workstation | Mediverse',
    description: 'Interprofessional resuscitation workstation modeling 6 clinical code roles, AHA ACLS 2-minute cycle loops, closed-loop communication verification, chest compression fraction (CCF), and reversible H and T etiologies.',
  },
};

export const dynamic = 'force-static';

export default function MultiuserCodeTeamCrmPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <CodeTeamCrmSimulator />
    </main>
  );
}
