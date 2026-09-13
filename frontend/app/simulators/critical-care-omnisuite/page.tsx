import React from 'react';
import type { Metadata } from 'next';
import CriticalCareOmnisuiteSimulator from '@/components/simulators/CriticalCareOmnisuiteSimulator';

export const metadata: Metadata = {
  title: 'Critical Care & Extracorporeal Resuscitation Omnisuite | Mediverse',
  description:
    'The Grand Capstone Workstation: Swan-Ganz thermodilution, mechanical circulatory support (VA/VV/VAV ECMO, ECPELLA Impella), neurocritical Monro-Kellie dynamics, ARDS driving pressure mechanics, and abdominal compartment resuscitation.',
};


export const dynamic = 'force-static';
export default function CriticalCareOmnisuitePage() {
  return <CriticalCareOmnisuiteSimulator />;
}
