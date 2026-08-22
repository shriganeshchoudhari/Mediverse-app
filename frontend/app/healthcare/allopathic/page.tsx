import type { Metadata } from 'next';
import { DomainPageLayout } from '../DomainPageLayout';

export const metadata: Metadata = {
  title: 'Allopathic Medicine | MBBS MD MS | Mediverse',
  description:
    'MBBS, MD, MS, DM, MCh — 19 core disciplines, 12 postgraduate residency tracks, 3D multi-organ dissection, physiological simulation labs, and NMC CBME vignettes on Mediverse.',
};

export default function AllopathicPage() {
  return (
    <DomainPageLayout
      domainId="allopathic"
      curriculumCta={{ label: 'Browse MBBS Curriculum →', href: '/healthcare/allopathic/mbbs' }}
    />
  );
}
