import React from 'react';
import { Metadata } from 'next';
import TtmCardiacArrestSimulator from '../../../components/simulators/TtmCardiacArrestSimulator';

export const metadata: Metadata = {
  title: 'Targeted Temperature Management (TTM) & Neuroprognostication Workstation | Mediverse',
  description:
    'Interactive resuscitation and neurocritical care workstation modeling core hypothermia induction (32-36°C), shivering metabolic surge, controlled rewarming electrolyte shifts, and Day 3 multimodal neuroprognostication (SSEP N20, continuous EEG, NSE, and CT GWR).',
};

export default function TtmCardiacArrestPage() {
  return <TtmCardiacArrestSimulator />;
}
