import React from 'react';
import type { Metadata } from 'next';
import HighSpinalSimulator from '@/components/simulators/HighSpinalSimulator';

export const metadata: Metadata = {
  title: 'High Spinal & Total Spinal Workstation | Mediverse',
  description: 'Biophysical neuraxial simulator for cephalad local anesthetic spread, sympathetic cardioaccelerator denervation (T1–T4), the Bezold-Jarisch reflex asystolic collapse, the Phenylephrine pressor trap, and emergent airway intubation.',
  openGraph: {
    title: 'High Spinal & Total Spinal Workstation | Mediverse',
    description: 'Biophysical neuraxial simulator for cephalad local anesthetic spread, sympathetic cardioaccelerator denervation (T1–T4), the Bezold-Jarisch reflex asystolic collapse, the Phenylephrine pressor trap, and emergent airway intubation.',
    url: 'https://mediverse.app/simulators/high-spinal-anesthesia-total',
    siteName: 'Mediverse Medical Simulation',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'High Spinal & Total Spinal Workstation | Mediverse',
    description: 'Biophysical neuraxial simulator for cephalad local anesthetic spread, sympathetic cardioaccelerator denervation (T1–T4), the Bezold-Jarisch reflex asystolic collapse, the Phenylephrine pressor trap, and emergent airway intubation.',
  },
};


export const dynamic = 'force-static';
export default function HighSpinalPage() {
  return <HighSpinalSimulator />;
}
