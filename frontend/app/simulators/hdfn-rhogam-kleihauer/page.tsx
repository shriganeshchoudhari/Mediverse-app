import React from 'react';
import { Metadata } from 'next';
import HdfnRhogamSimulator from '../../../components/simulators/HdfnRhogamSimulator';

export const metadata: Metadata = {
  title: 'HDFN, RhIg (RhoGAM) & Kleihauer-Betke Precision Workstation | Mediverse',
  description:
    'Interactive maternal-fetal medicine and transfusion immunohematology workstation for modeling RhD alloimmunization, Kleihauer-Betke acid-elution fetomaternal hemorrhage (FMH) quantification, AABB precision RhoGAM dosing, and Fetal MCA Doppler PSV screening.',
};

export default function HdfnRhogamPage() {
  return <HdfnRhogamSimulator />;
}
