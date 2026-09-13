import React from 'react';
import type { Metadata } from 'next';
import SevereBurnResuscitationSimulator from '@/components/simulators/SevereBurnResuscitationSimulator';

export const metadata: Metadata = {
  title: 'Severe Burn Resuscitation & Fluid Creep Workstation | Mediverse',
  description: 'Interactive burn surgery and critical care simulator: Parkland vs Modified Brooke formula, urine output titration (0.5 mL/kg/hr), fluid creep & abdominal compartment syndrome (ACS), 5% albumin colloid rescue, inhalation airway edema, and circumferential escharotomy.',
  openGraph: {
    title: 'Severe Burn Resuscitation & Fluid Creep Workstation | Mediverse',
    description: 'Interactive burn surgery and critical care simulator: Parkland vs Modified Brooke formula, urine output titration (0.5 mL/kg/hr), fluid creep & abdominal compartment syndrome (ACS), 5% albumin colloid rescue, inhalation airway edema, and circumferential escharotomy.',
    url: 'https://mediverse.app/simulators/severe-burn-parkland-resuscitation',
    siteName: 'Mediverse Medical Simulation',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Severe Burn Resuscitation & Fluid Creep Workstation | Mediverse',
    description: 'Interactive burn surgery and critical care simulator: Parkland vs Modified Brooke formula, urine output titration (0.5 mL/kg/hr), fluid creep & abdominal compartment syndrome (ACS), 5% albumin colloid rescue, inhalation airway edema, and circumferential escharotomy.',
  },
};


export const dynamic = 'force-static';
export default function SevereBurnResuscitationPage() {
  return <SevereBurnResuscitationSimulator />;
}
