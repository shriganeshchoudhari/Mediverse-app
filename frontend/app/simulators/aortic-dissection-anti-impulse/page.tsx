import React from 'react';
import type { Metadata } from 'next';
import AorticDissectionSimulator from '@/components/simulators/AorticDissectionSimulator';

export const metadata: Metadata = {
  title: 'Acute Aortic Syndromes & Aortic Dissection Workstation | Mediverse',
  description: 'Interactive cardiovascular surgery and critical care simulator: Stanford Type A vs B, Anti-Impulse Therapy (dP/dt reduction: beta-blocker first rule [HR < 60 bpm] before vasodilators [SBP 100-120 mmHg]), branch vessel malperfusion, cardiac tamponade pericardiocentesis dilemma, and TEVAR.',
  openGraph: {
    title: 'Acute Aortic Syndromes & Aortic Dissection Workstation | Mediverse',
    description: 'Interactive cardiovascular surgery and critical care simulator: Stanford Type A vs B, Anti-Impulse Therapy (dP/dt reduction: beta-blocker first rule [HR < 60 bpm] before vasodilators [SBP 100-120 mmHg]), branch vessel malperfusion, cardiac tamponade pericardiocentesis dilemma, and TEVAR.',
    url: 'https://mediverse.app/simulators/aortic-dissection-anti-impulse',
    siteName: 'Mediverse Medical Simulation',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Acute Aortic Syndromes & Aortic Dissection Workstation | Mediverse',
    description: 'Interactive cardiovascular surgery and critical care simulator: Stanford Type A vs B, Anti-Impulse Therapy (dP/dt reduction: beta-blocker first rule [HR < 60 bpm] before vasodilators [SBP 100-120 mmHg]), branch vessel malperfusion, cardiac tamponade pericardiocentesis dilemma, and TEVAR.',
  },
};


export const dynamic = 'force-static';
export default function AorticDissectionPage() {
  return <AorticDissectionSimulator />;
}
