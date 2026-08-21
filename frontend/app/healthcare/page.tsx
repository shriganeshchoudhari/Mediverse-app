/**
 * /healthcare — Healthcare Education Landscape Root Page
 *
 * The central hub page showcasing all 9 Healthcare Education Domains.
 * Server component — no 'use client' needed here; the HealthcareLandscapeExplorer
 * handles its own client-side state.
 */

import type { Metadata } from 'next';
import HealthcareLandscapeExplorer from '@/components/HealthcareLandscapeExplorer';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Healthcare Education Landscape | Mediverse',
  description:
    'Explore all 9 healthcare education domains — Allopathic (MBBS/MD), Dental (BDS), AYUSH (BAMS/BHMS), Pharmacy, Nursing, Physiotherapy, Allied Health, Veterinary, and Public Health on Mediverse.',
};

export default function HealthcareLandscapePage() {
  return (
    <main className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <p className={styles.heroEyebrow}>Mediverse — Medical Education & Simulation</p>
        <h1 className={styles.heroTitle}>
          Healthcare Education Landscape
        </h1>
        <p className={styles.heroSubtitle}>
          The complete spectrum of medical education in one platform —
          from MBBS and BDS to BAMS, Nursing, Physiotherapy, Allied Health,
          and beyond. Select your domain to begin.
        </p>
      </section>

      {/* Domain grid */}
      <HealthcareLandscapeExplorer showTierFilter compact={false} />
    </main>
  );
}
