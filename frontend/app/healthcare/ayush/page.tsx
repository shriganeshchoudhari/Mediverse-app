import type { Metadata } from 'next';
import { DomainPageLayout } from '../DomainPageLayout';

export const metadata: Metadata = {
  title: 'AYUSH Medicine | BAMS BHMS BNYS | Mediverse',
  description: 'BAMS, BHMS, BUMS, BNYS — 3D Marma Point map, Tridosha-ANS correlation, Panchakarma guides, Dravyaguna pharmacology on Mediverse.',
};

export default function AYUSHPage() {
  return (
    <DomainPageLayout
      domainId="ayush"
      curriculumCta={{ label: 'Browse BAMS Curriculum →', href: '/healthcare/ayush/bams' }}
    />
  );
}
