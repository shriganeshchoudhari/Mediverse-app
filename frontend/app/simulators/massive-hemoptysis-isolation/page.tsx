import { Metadata } from 'next';
import MassiveHemoptysisSimulator from '@/components/simulators/MassiveHemoptysisSimulator';

export const metadata: Metadata = {
  title: 'Massive Hemoptysis & Endobronchial Isolation Workstation | Mediverse',
  description: 'Pulmonology, critical care, and thoracic surgery simulation of massive hemoptysis, asphyxiation risk, "bad lung down" positioning, endobronchial blocker isolation, bronchial artery embolization (BAE), and Artery of Adamkiewicz spinal safety.'
};


export const dynamic = 'force-static';
export default function MassiveHemoptysisPage() {
  return <MassiveHemoptysisSimulator />;
}
