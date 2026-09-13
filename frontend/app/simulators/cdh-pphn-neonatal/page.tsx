import { Metadata } from 'next';
import CdhPphnSimulator from '@/components/simulators/CdhPphnSimulator';

export const metadata: Metadata = {
  title: 'Congenital Diaphragmatic Hernia & PPHN Workstation | Mediverse',
  description: 'Neonatal ICU simulation of CDH, pre- vs post-ductal saturation gradients, CDH EURO Consortium gentle ventilation with permissive hypercapnia, iNO titration, and neonatal ECMO criteria.'
};

export default function CdhPphnPage() {
  return <CdhPphnSimulator />;
}
