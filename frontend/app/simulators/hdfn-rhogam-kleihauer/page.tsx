import React from 'react';
import { Metadata } from 'next';
import HdfnRhogamSimulator from '../../../components/simulators/HdfnRhogamSimulator';

export const metadata: Metadata = {
  title: 'HDFN, RhIg (RhoGAM) & Kleihauer-Betke Precision Workstation | Mediverse',
  description: 'Interactive maternal-fetal medicine and transfusion immunohematology workstation for modeling RhD alloimmunization, Kleihauer-Betke acid-elution fetomaternal hemorrhage (FMH) quantification, AABB precision RhoGAM dosing, and Fetal MCA Doppler PSV screening.',
  openGraph: {
    title: 'HDFN, RhIg (RhoGAM) & Kleihauer-Betke Precision Workstation | Mediverse',
    description: 'Interactive maternal-fetal medicine and transfusion immunohematology workstation for modeling RhD alloimmunization, Kleihauer-Betke acid-elution fetomaternal hemorrhage (FMH) quantification, AABB precision RhoGAM dosing, and Fetal MCA Doppler PSV screening.',
    url: 'https://mediverse.app/simulators/hdfn-rhogam-kleihauer',
    siteName: 'Mediverse Medical Simulation',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HDFN, RhIg (RhoGAM) & Kleihauer-Betke Precision Workstation | Mediverse',
    description: 'Interactive maternal-fetal medicine and transfusion immunohematology workstation for modeling RhD alloimmunization, Kleihauer-Betke acid-elution fetomaternal hemorrhage (FMH) quantification, AABB precision RhoGAM dosing, and Fetal MCA Doppler PSV screening.',
  },
};


export const dynamic = 'force-static';
export default function HdfnRhogamPage() {
  return <HdfnRhogamSimulator />;
}
