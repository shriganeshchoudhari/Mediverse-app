import React from 'react';
import { Metadata } from 'next';
import HeartFailureStevensonSimulator from '../../../components/simulators/HeartFailureStevensonSimulator';

export const metadata: Metadata = {
  title: 'ADHF Stevenson Profiles & Hemodynamic Workstation | Mediverse',
  description: 'Comprehensive Cardiology, Critical Care & Hemodynamic workstation modeling Stevenson-Nohria Forrester profiles (A, B, L, C), congestive nephropathy backpressure mechanics (RPP = MAP - CVP), DOSE trial diuretic titration, and inotrope/vasodilator safety interlocks.',
  openGraph: {
    title: 'ADHF Stevenson Profiles & Hemodynamic Workstation | Mediverse',
    description: 'Comprehensive Cardiology, Critical Care & Hemodynamic workstation modeling Stevenson-Nohria Forrester profiles (A, B, L, C), congestive nephropathy backpressure mechanics (RPP = MAP - CVP), DOSE trial diuretic titration, and inotrope/vasodilator safety interlocks.',
    url: 'https://mediverse.app/simulators/heart-failure-stevenson',
    siteName: 'Mediverse Medical Simulation',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ADHF Stevenson Profiles & Hemodynamic Workstation | Mediverse',
    description: 'Comprehensive Cardiology, Critical Care & Hemodynamic workstation modeling Stevenson-Nohria Forrester profiles (A, B, L, C), congestive nephropathy backpressure mechanics (RPP = MAP - CVP), DOSE trial diuretic titration, and inotrope/vasodilator safety interlocks.',
  },
};


export const dynamic = 'force-static';
export default function HeartFailureStevensonPage() {
  return <HeartFailureStevensonSimulator />;
}
