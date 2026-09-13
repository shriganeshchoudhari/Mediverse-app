import { Metadata } from 'next';
import PostOpTamponadeSimulator from '@/components/simulators/PostOpTamponadeSimulator';

export const metadata: Metadata = {
  title: 'Post-Op Cardiac Tamponade vs Restrictive Physiology Workstation | Mediverse',
  description: 'Cardiology, critical care, and cardiac surgery simulation of post-cardiopulmonary bypass localized hematomas, TEE vs TTE acoustic shadowing, blunted pulsus paradoxus, diastolic pressure equalization, and CALS emergency resternotomy.',
  openGraph: {
    title: 'Post-Op Cardiac Tamponade vs Restrictive Physiology Workstation | Mediverse',
    description: 'Cardiology, critical care, and cardiac surgery simulation of post-cardiopulmonary bypass localized hematomas, TEE vs TTE acoustic shadowing, blunted pulsus paradoxus, diastolic pressure equalization, and CALS emergency resternotomy.',
    url: 'https://mediverse.app/simulators/post-op-tamponade-resternotomy',
    siteName: 'Mediverse Medical Simulation',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Post-Op Cardiac Tamponade vs Restrictive Physiology Workstation | Mediverse',
    description: 'Cardiology, critical care, and cardiac surgery simulation of post-cardiopulmonary bypass localized hematomas, TEE vs TTE acoustic shadowing, blunted pulsus paradoxus, diastolic pressure equalization, and CALS emergency resternotomy.',
  },
};


export const dynamic = 'force-static';
export default function PostOpTamponadePage() {
  return <PostOpTamponadeSimulator />;
}
