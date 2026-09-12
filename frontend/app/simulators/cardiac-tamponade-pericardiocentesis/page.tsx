import { Metadata } from 'next';
import PericardialTamponadeSimulator from '../../../components/simulators/PericardialTamponadeSimulator';

export const metadata: Metadata = {
  title: 'Cardiac Tamponade & Pericardiocentesis Workstation | Mediverse',
  description:
    'Simulate acute cardiac tamponade, Beck\'s triad, respiro-phasic ventricular interdependence (pulsus paradoxus), invasive diastolic pressure equalization, and emergency ultrasound-guided pericardiocentesis.',
};

export default function CardiacTamponadePericardiocentesisPage() {
  return (
    <main className="min-h-screen bg-slate-950 py-8">
      <PericardialTamponadeSimulator />
    </main>
  );
}
