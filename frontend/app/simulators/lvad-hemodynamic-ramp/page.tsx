import { Metadata } from 'next';
import LvadHemodynamicRampSimulator from '../../../components/simulators/LvadHemodynamicRampSimulator';

export const metadata: Metadata = {
  title: 'LVAD & RAMP Protocol Workstation | Mediverse',
  description:
    'Simulate HeartMate 3 Left Ventricular Assist Device (LVAD) speed optimization, echocardiographic RAMP test protocol, apical suction event recovery, and post-implant RV failure hemodynamics.',
};

export default function LvadHemodynamicRampPage() {
  return (
    <main className="min-h-screen bg-slate-950 py-8">
      <LvadHemodynamicRampSimulator />
    </main>
  );
}
