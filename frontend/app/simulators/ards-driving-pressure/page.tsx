import React from 'react';
import { Metadata } from 'next';
import ArdsSimulator from '../../../components/simulators/ArdsSimulator';

export const metadata: Metadata = {
  title: 'ARDS Berlin Phenotyping, Driving Pressure & Mechanical Power | Mediverse',
  description:
    'Interactive critical care and mechanical ventilation workstation modeling Berlin ARDS definitions, Amato driving pressure, Gattinoni mechanical power, and PROSEVA prone positioning protocols.',
};

export default function ArdsDrivingPressurePage() {
  return <ArdsSimulator />;
}
