import React from 'react';
import { Metadata } from 'next';
import ThyroidStormSimulator from '../../../components/simulators/ThyroidStormSimulator';

export const metadata: Metadata = {
  title: 'Thyroid Storm & Burch-Wartofsky Crisis Workstation | Mediverse',
  description:
    'Comprehensive Endocrine & Neurocritical Care workstation modeling the Burch-Wartofsky Point Scale (BWPS), Japan Thyroid Association (Akamizu) diagnostic criteria, 5-Stage Multimodal Pharmacotherapy chain, mandatory Wolff-Chaikoff 60-minute iodine delay, and Aspirin TBG displacement hazards.',
};

export default function ThyroidStormPage() {
  return <ThyroidStormSimulator />;
}
