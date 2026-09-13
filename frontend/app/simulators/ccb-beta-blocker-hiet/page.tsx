import React from 'react';
import { Metadata } from 'next';
import CcbBetaBlockerHietSimulator from '../../../components/simulators/CcbBetaBlockerHietSimulator';

export const metadata: Metadata = {
  title: 'CCB & Beta-Blocker Poisoning / HIET Workstation | Mediverse',
  description: 'Advanced Toxicology & Critical Care resuscitation engine for Calcium Channel Blocker and Beta-Blocker toxicity. Simulates High-Dose Insulin Euglycemia Therapy (HIET) titration, dextrose clamp mechanics, potassium shifting guardrails, IV calcium stoichiometry (Chloride vs Gluconate), glucagon non-adrenergic adenylyl cyclase bypass, and 20% Lipid Emulsion / VA-ECMO refractory rescue protocols.',
  openGraph: {
    title: 'CCB & Beta-Blocker Poisoning / HIET Workstation | Mediverse',
    description: 'Advanced Toxicology & Critical Care resuscitation engine for Calcium Channel Blocker and Beta-Blocker toxicity. Simulates High-Dose Insulin Euglycemia Therapy (HIET) titration, dextrose clamp mechanics, potassium shifting guardrails, IV calcium stoichiometry (Chloride vs Gluconate), glucagon non-adrenergic adenylyl cyclase bypass, and 20% Lipid Emulsion / VA-ECMO refractory rescue protocols.',
    url: 'https://mediverse.app/simulators/ccb-beta-blocker-hiet',
    siteName: 'Mediverse Medical Simulation',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CCB & Beta-Blocker Poisoning / HIET Workstation | Mediverse',
    description: 'Advanced Toxicology & Critical Care resuscitation engine for Calcium Channel Blocker and Beta-Blocker toxicity. Simulates High-Dose Insulin Euglycemia Therapy (HIET) titration, dextrose clamp mechanics, potassium shifting guardrails, IV calcium stoichiometry (Chloride vs Gluconate), glucagon non-adrenergic adenylyl cyclase bypass, and 20% Lipid Emulsion / VA-ECMO refractory rescue protocols.',
  },
};


export const dynamic = 'force-static';
export default function CcbBetaBlockerHietPage() {
  return <CcbBetaBlockerHietSimulator />;
}
