import React from 'react';
import { Metadata } from 'next';
import AcsRiskSimulator from '../../../components/simulators/AcsRiskSimulator';

export const metadata: Metadata = {
  title: 'ACS Risk Stratification & hs-cTn Delta Workstation | Mediverse',
  description: 'Comprehensive Acute Coronary Syndrome risk stratification workstation modeling the HEART Score, TIMI, GRACE 2.0, European Society of Cardiology (ESC) 0/1h and 0/2h high-sensitivity troponin algorithms, and evidence-based revascularization timing.',
  openGraph: {
    title: 'ACS Risk Stratification & hs-cTn Delta Workstation | Mediverse',
    description: 'Comprehensive Acute Coronary Syndrome risk stratification workstation modeling the HEART Score, TIMI, GRACE 2.0, European Society of Cardiology (ESC) 0/1h and 0/2h high-sensitivity troponin algorithms, and evidence-based revascularization timing.',
    url: 'https://mediverse.app/simulators/acs-heart-troponin',
    siteName: 'Mediverse Medical Simulation',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ACS Risk Stratification & hs-cTn Delta Workstation | Mediverse',
    description: 'Comprehensive Acute Coronary Syndrome risk stratification workstation modeling the HEART Score, TIMI, GRACE 2.0, European Society of Cardiology (ESC) 0/1h and 0/2h high-sensitivity troponin algorithms, and evidence-based revascularization timing.',
  },
};


export const dynamic = 'force-static';
export default function AcsRiskTroponinPage() {
  return <AcsRiskSimulator />;
}
