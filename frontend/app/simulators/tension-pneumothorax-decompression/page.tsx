import { Metadata } from 'next';
import TensionPneumothoraxSimulator from '@/components/simulators/TensionPneumothoraxSimulator';

export const metadata: Metadata = {
  title: 'Tension Pneumothorax & Thoracic Decompression Workstation | Mediverse',
  description: 'Trauma and critical care simulation of tension pneumothorax, obstructive shock hemodynamics, needle vs finger vs tube thoracostomy, 3-bottle drainage, and massive hemothorax autotransfusion.'
};


export const dynamic = 'force-static';
export default function TensionPneumothoraxPage() {
  return <TensionPneumothoraxSimulator />;
}
