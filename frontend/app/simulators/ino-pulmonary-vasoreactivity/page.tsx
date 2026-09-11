import React from 'react';
import { Metadata } from 'next';
import InoVasoreactivitySimulator from '../../../components/simulators/InoVasoreactivitySimulator';

export const metadata: Metadata = {
  title: 'Inhaled Nitric Oxide (iNO) & Acute Vasoreactivity Testing Workstation | Mediverse',
  description:
    'Interactive pulmonology and critical care workstation modeling selective pulmonary vasodilation, ESC/ERS acute vasoreactivity testing (Sitbon criteria), PVR/SVR hemodynamics, rebound pulmonary hypertension, and MetHb/NO2 toxicity.',
};

export default function InoPulmonaryVasoreactivityPage() {
  return <InoVasoreactivitySimulator />;
}
