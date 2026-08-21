'use client';

/**
 * HealthcareLandscapeExplorer
 *
 * A responsive 9-domain card grid showcasing all Healthcare Education
 * domains (Allopathic, Dental, AYUSH, Pharmacy, Nursing, Physiotherapy,
 * Allied Health, Veterinary, Public Health).
 *
 * Props:
 *   onDomainSelect? — callback when a domain card is clicked (optional;
 *                     the component navigates directly if not provided)
 *   showTierFilter? — whether to show the Tier 1/2/3 filter tabs
 *   compact?        — use compact card layout (smaller padding)
 */

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  HEALTHCARE_DOMAINS,
  getDomainsByTier,
  TOTAL_LESSON_COUNT,
  type DomainTier,
  type HealthcareDomain,
} from '@/lib/curriculum/healthcareLandscapeScaffold';
import styles from './HealthcareLandscapeExplorer.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────

interface HealthcareLandscapeExplorerProps {
  onDomainSelect?: (domain: HealthcareDomain) => void;
  showTierFilter?: boolean;
  compact?: boolean;
}

type TierFilter = 'all' | DomainTier;

// ─── Tier badge label map ─────────────────────────────────────────────────────

const TIER_LABELS: Record<DomainTier, string> = {
  1: 'Tier 1 — Immediate Priority',
  2: 'Tier 2 — Allied High-Tech',
  3: 'Tier 3 — Integrative & Admin',
};

const TIER_BADGE_LABELS: Record<DomainTier, string> = {
  1: 'Tier 1',
  2: 'Tier 2',
  3: 'Tier 3',
};

// ─── DomainCard ───────────────────────────────────────────────────────────────

interface DomainCardProps {
  domain: HealthcareDomain;
  compact: boolean;
  onSelect?: (domain: HealthcareDomain) => void;
}

function DomainCard({ domain, compact, onSelect }: DomainCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (onSelect) {
      e.preventDefault();
      onSelect(domain);
    }
  };

  const availablePrograms = domain.programs.filter((p) => p.available);
  const totalPrograms = domain.programs.length;

  return (
    <Link
      href={domain.routePath}
      className={`${styles.card} ${compact ? styles.cardCompact : ''}`}
      style={
        {
          '--domain-color': domain.color,
          '--domain-accent': domain.accentColor,
        } as React.CSSProperties
      }
      onClick={handleClick}
      aria-label={`Explore ${domain.name}`}
    >
      {/* Tier badge */}
      <span
        className={`${styles.tierBadge} ${styles[`tier${domain.tier}`]}`}
      >
        {TIER_BADGE_LABELS[domain.tier]}
      </span>

      {/* Domain icon */}
      <div className={styles.iconWrapper}>
        <span className={styles.icon} role="img" aria-hidden="true">
          {domain.icon}
        </span>
      </div>

      {/* Domain name */}
      <h3 className={styles.domainName}>{domain.shortName}</h3>
      <p className={styles.domainFullName}>{domain.name}</p>

      {/* Description */}
      <p className={styles.description}>{domain.description}</p>

      {/* Stats row */}
      <div className={styles.statsRow}>
        <span className={styles.stat}>
          <strong>{domain.lessonCount}+</strong> lessons
        </span>
        <span className={styles.statDivider} />
        <span className={styles.stat}>
          <strong>{totalPrograms}</strong> program{totalPrograms !== 1 ? 's' : ''}
        </span>
        {availablePrograms.length > 0 && (
          <>
            <span className={styles.statDivider} />
            <span className={`${styles.stat} ${styles.statAvailable}`}>
              {availablePrograms.length} live
            </span>
          </>
        )}
      </div>

      {/* Key highlights */}
      {!compact && domain.keyHighlights.length > 0 && (
        <ul className={styles.highlights}>
          {domain.keyHighlights.slice(0, 3).map((highlight) => (
            <li key={highlight} className={styles.highlightItem}>
              <span className={styles.highlightDot} aria-hidden="true" />
              {highlight}
            </li>
          ))}
        </ul>
      )}

      {/* CTA arrow */}
      <div className={styles.cta}>
        <span>Explore</span>
        <span className={styles.ctaArrow} aria-hidden="true">→</span>
      </div>
    </Link>
  );
}

// ─── HealthcareLandscapeExplorer (main component) ────────────────────────────

export default function HealthcareLandscapeExplorer({
  onDomainSelect,
  showTierFilter = true,
  compact = false,
}: HealthcareLandscapeExplorerProps) {
  const [tierFilter, setTierFilter] = useState<TierFilter>('all');

  const filteredDomains = useMemo(() => {
    if (tierFilter === 'all') return HEALTHCARE_DOMAINS;
    return getDomainsByTier(tierFilter as DomainTier);
  }, [tierFilter]);

  return (
    <section className={styles.explorer}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>Healthcare Education Landscape</h2>
        <p className={styles.subtitle}>
          {HEALTHCARE_DOMAINS.length} domains &middot; {TOTAL_LESSON_COUNT}+ lessons
          &middot; covering the complete Indian & global medical education spectrum
        </p>
      </div>

      {/* Tier filter tabs */}
      {showTierFilter && (
        <div className={styles.tierTabs} role="tablist" aria-label="Filter by tier">
          {(['all', 1, 2, 3] as TierFilter[]).map((tier) => (
            <button
              key={tier}
              role="tab"
              aria-selected={tierFilter === tier}
              className={`${styles.tierTab} ${
                tierFilter === tier ? styles.tierTabActive : ''
              }`}
              onClick={() => setTierFilter(tier)}
            >
              {tier === 'all'
                ? `All Domains (${HEALTHCARE_DOMAINS.length})`
                : `${TIER_LABELS[tier as DomainTier]} (${
                    getDomainsByTier(tier as DomainTier).length
                  })`}
            </button>
          ))}
        </div>
      )}

      {/* Domain card grid */}
      <div className={`${styles.grid} ${compact ? styles.gridCompact : ''}`}>
        {filteredDomains.map((domain) => (
          <DomainCard
            key={domain.id}
            domain={domain}
            compact={compact}
            onSelect={onDomainSelect}
          />
        ))}
      </div>
    </section>
  );
}
