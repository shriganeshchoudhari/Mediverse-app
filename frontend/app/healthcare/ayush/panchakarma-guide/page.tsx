import type { Metadata } from 'next';
import PanchakarmaGuideClient from '@/components/ayush/PanchakarmaGuideClient';

export const metadata: Metadata = {
  title: 'Panchakarma Guide & Clinical Scheduler | Mediverse AYUSH',
  description:
    'Interactive 5-fold purification protocol explorer and 7/14/21-day clinical Panchakarma protocol designer covering Purvakarma, Pradhanakarma, and Paschatkarma Samsarjana Krama.',
};

export default function PanchakarmaGuidePage() {
  return <PanchakarmaGuideClient />;
}
