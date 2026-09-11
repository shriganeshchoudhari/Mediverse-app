import React from 'react';
import { Metadata } from 'next';
import DigoxinToxicitySimulator from '../../../components/simulators/DigoxinToxicitySimulator';

export const metadata: Metadata = {
  title: 'Digoxin Toxicity, DigiFab Stoichiometry & Arrhythmia Workstation | Mediverse',
  description:
    'Interactive cardiovascular toxicology workstation modeling myocardial Na+/K+-ATPase paralysis, hyperkalemia prognostic mortality curve, DigiFab antibody fragment neutralization stoichiometry, and Salvador Dalí scooped ST depressions.',
};

export default function DigoxinToxicityPage() {
  return <DigoxinToxicitySimulator />;
}
