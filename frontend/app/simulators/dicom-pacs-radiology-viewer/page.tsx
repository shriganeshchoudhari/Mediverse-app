import { Metadata } from 'next';
import DicomPacsSimulator from '@/components/simulators/DicomPacsSimulator';

export const metadata: Metadata = {
  title: 'DICOM Radiology PACS Viewer & MPR Workstation | Mediverse',
  description: 'High-performance clinical DICOM PACS viewer with multi-planar reconstruction (Axial, Coronal, Sagittal), dynamic Hounsfield Unit (HU) windowing (Brain, Subdural, Lung, Bone, Soft Tissue), electronic distance calipers, and ROI density meters.',
  openGraph: {
    title: 'DICOM Radiology PACS Viewer & MPR Workstation | Mediverse',
    description: 'High-performance clinical DICOM PACS viewer with multi-planar reconstruction (Axial, Coronal, Sagittal), dynamic Hounsfield Unit (HU) windowing (Brain, Subdural, Lung, Bone, Soft Tissue), electronic distance calipers, and ROI density meters.',
    url: 'https://mediverse.app/simulators/dicom-pacs-radiology-viewer',
    siteName: 'Mediverse Medical Simulation',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DICOM Radiology PACS Viewer & MPR Workstation | Mediverse',
    description: 'High-performance clinical DICOM PACS viewer with multi-planar reconstruction (Axial, Coronal, Sagittal), dynamic Hounsfield Unit (HU) windowing (Brain, Subdural, Lung, Bone, Soft Tissue), electronic distance calipers, and ROI density meters.',
  },
};


export const dynamic = 'force-static';
export default function DicomPacsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <DicomPacsSimulator />
    </div>
  );
}
