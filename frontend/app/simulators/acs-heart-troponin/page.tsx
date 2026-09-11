import React from 'react';
import { Metadata } from 'next';
import AcsRiskSimulator from '../../../components/simulators/AcsRiskSimulator';

export const metadata: Metadata = {
  title: 'ACS Risk Stratification & hs-cTn Delta Workstation | Mediverse',
  description:
    'Comprehensive Acute Coronary Syndrome risk stratification workstation modeling the HEART Score, TIMI, GRACE 2.0, European Society of Cardiology (ESC) 0/1h and 0/2h high-sensitivity troponin algorithms, and evidence-based revascularization timing.',
};

export default function AcsRiskTroponinPage() {
  return <AcsRiskSimulator />;
}
