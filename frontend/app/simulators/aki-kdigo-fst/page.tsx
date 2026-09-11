import React from 'react';
import { Metadata } from 'next';
import AkiKdigoSimulator from '../../../components/simulators/AkiKdigoSimulator';

export const metadata: Metadata = {
  title: 'Acute Kidney Injury (AKI) & FST Precision Workstation | Mediverse',
  description:
    'Comprehensive Nephrology and ICU workstation modeling KDIGO 2024 dynamic AKI staging, FeNa vs FeUrea tubular differentiation with loop diuretic correction, the Renal Angina Index (RAI), Chawla Furosemide Stress Test (FST), and quantitative fluid overload kinetics.',
};

export default function AkiKdigoFstPage() {
  return <AkiKdigoSimulator />;
}
