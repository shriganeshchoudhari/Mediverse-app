import type { Metadata } from 'next';
import { DomainPageLayout } from '../DomainPageLayout';

export const metadata: Metadata = {
  title: 'Dental Sciences | BDS MDS | Mediverse',
  description: 'BDS and MDS programs — 3D maxillofacial anatomy, nerve block simulation, tooth morphology models, and DCI competency-mapped dental modules on Mediverse.',
};

export default function DentalPage() {
  return (
    <DomainPageLayout
      domainId="dental"
      curriculumCta={{ label: 'Browse BDS Curriculum →', href: '/healthcare/dental/bds' }}
    />
  );
}
