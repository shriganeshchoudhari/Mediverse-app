import React from 'react';
import { Metadata } from 'next';
import StatusAsthmaticusSimulator from '../../../components/simulators/StatusAsthmaticusSimulator';

export const metadata: Metadata = {
  title: 'Status Asthmaticus & Respiratory Mechanics Workstation | Mediverse',
  description:
    'Advanced Pulmonology, Critical Care & Emergency Medicine simulation workstation modeling acute severe asthma, Peak Expiratory Flow kinetics, dynamic hyperinflation / intrinsic Auto-PEEP, venous return depression, stepwise bronchodilator escalation (Continuous SABA, SAMA, Steroids, IV Magnesium), and lung-protective mechanical ventilation with permissive hypercapnia protocols.',
};

export default function StatusAsthmaticusPage() {
  return <StatusAsthmaticusSimulator />;
}
