import React from 'react';
import { Metadata } from 'next';
import MyxedemaComaSimulator from '../../../components/simulators/MyxedemaComaSimulator';

export const metadata: Metadata = {
  title: 'Myxedema Coma & Thyroid Crisis Workstation | Mediverse',
  description: 'Comprehensive Endocrine & Neurocritical Care workstation modeling the Popoveniuc Diagnostic Scoring System, mandatory Steroids-Before-Thyroid adrenal crisis prevention, IV Levothyroxine (T4) vs Liothyronine (T3) titration, and passive rewarming vs vasodilatory shock mechanics.',
  openGraph: {
    title: 'Myxedema Coma & Thyroid Crisis Workstation | Mediverse',
    description: 'Comprehensive Endocrine & Neurocritical Care workstation modeling the Popoveniuc Diagnostic Scoring System, mandatory Steroids-Before-Thyroid adrenal crisis prevention, IV Levothyroxine (T4) vs Liothyronine (T3) titration, and passive rewarming vs vasodilatory shock mechanics.',
    url: 'https://mediverse.app/simulators/myxedema-coma-thyroid',
    siteName: 'Mediverse Medical Simulation',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Myxedema Coma & Thyroid Crisis Workstation | Mediverse',
    description: 'Comprehensive Endocrine & Neurocritical Care workstation modeling the Popoveniuc Diagnostic Scoring System, mandatory Steroids-Before-Thyroid adrenal crisis prevention, IV Levothyroxine (T4) vs Liothyronine (T3) titration, and passive rewarming vs vasodilatory shock mechanics.',
  },
};


export const dynamic = 'force-static';
export default function MyxedemaComaPage() {
  return <MyxedemaComaSimulator />;
}
