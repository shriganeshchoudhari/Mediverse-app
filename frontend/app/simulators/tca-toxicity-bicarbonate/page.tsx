import React from 'react';
import { Metadata } from 'next';
import TcaToxicityBicarbonateSimulator from '../../../components/simulators/TcaToxicityBicarbonateSimulator';

export const metadata: Metadata = {
  title: 'Tricyclic Antidepressant (TCA) Overdose & Bicarbonate Workstation | Mediverse',
  description:
    'Advanced Toxicology, Critical Care & Emergency Medicine workstation modeling Tricyclic Antidepressant (TCA) overdose, myocardial Nav1.5 fast sodium-channel blockade, terminal R wave in aVR (> 3 mm), QRS duration risk stratification, hypertonic sodium bicarbonate (8.4% NaHCO3) titration, absolute Physostigmine contraindication traps, and 20% Lipid Emulsion rescue protocols.',
};

export default function TcaToxicityPage() {
  return <TcaToxicityBicarbonateSimulator />;
}
