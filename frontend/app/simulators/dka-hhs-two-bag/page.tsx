import React from 'react';
import { Metadata } from 'next';
import DkaHhsSimulator from '../../../components/simulators/DkaHhsSimulator';

export const metadata: Metadata = {
  title: 'DKA, HHS & Two-Bag Fluid Titration Workstation | Mediverse',
  description:
    'Comprehensive endocrinology and critical care workstation modeling Diabetic Ketoacidosis (DKA) vs Hyperosmolar Hyperglycemic State (HHS), potassium safety interlock, two-bag dextrose titration, and osmotic cerebral edema prevention.',
};

export default function DkaHhsPage() {
  return <DkaHhsSimulator />;
}
