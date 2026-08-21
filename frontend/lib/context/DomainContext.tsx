'use client';

/**
 * DomainContext
 *
 * React Context + Provider for the active Healthcare Education Domain.
 * Persists the selection to localStorage so it survives page navigation.
 *
 * Usage:
 *   // Wrap your layout (or a page subtree) with <DomainProvider>
 *   // Then in any component:
 *   const { activeDomain, setActiveDomain } = useActiveDomain();
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  DOMAIN_IDS,
  getDomainById,
  HEALTHCARE_DOMAINS,
  type HealthcareDomain,
} from '@/lib/curriculum/healthcareLandscapeScaffold';

// ─── Types ────────────────────────────────────────────────────────────────────

type DomainId = (typeof DOMAIN_IDS)[number];

interface DomainContextValue {
  /** The ID of the currently active healthcare domain */
  activeDomainId: DomainId;
  /** The full domain object for the active domain */
  activeDomain: HealthcareDomain;
  /** All available domains */
  allDomains: HealthcareDomain[];
  /** Change the active domain */
  setActiveDomain: (domainId: DomainId) => void;
  /** True when a domain change is occurring */
  isTransitioning: boolean;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const DomainContext = createContext<DomainContextValue | null>(null);

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'mediverse-active-domain' as const;
const DEFAULT_DOMAIN_ID: DomainId = 'allopathic';

// ─── Provider ─────────────────────────────────────────────────────────────────

interface DomainProviderProps {
  children: React.ReactNode;
  /**
   * Optional: Override the initial domain (e.g., set from URL segment in a
   * server component and pass down to the client provider).
   */
  initialDomainId?: DomainId;
}

export function DomainProvider({
  children,
  initialDomainId,
}: DomainProviderProps) {
  // Determine the initial active domain ID, preferring:
  //   1. initialDomainId prop (e.g., set from URL)
  //   2. localStorage persisted value
  //   3. DEFAULT_DOMAIN_ID ('allopathic')
  const [activeDomainId, setActiveDomainIdState] = useState<DomainId>(() => {
    if (initialDomainId && DOMAIN_IDS.includes(initialDomainId)) {
      return initialDomainId;
    }
    return DEFAULT_DOMAIN_ID;
  });

  const [isTransitioning, setIsTransitioning] = useState(false);

  // On mount: hydrate from localStorage (client-only)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && DOMAIN_IDS.includes(stored as DomainId) && !initialDomainId) {
        setActiveDomainIdState(stored as DomainId);
      }
    } catch {
      // localStorage may be unavailable in private browsing / SSR context
    }
  }, [initialDomainId]);

  const setActiveDomain = useCallback((domainId: DomainId) => {
    if (!DOMAIN_IDS.includes(domainId)) {
      console.warn(`[DomainContext] Unknown domain ID: "${domainId}". Ignoring.`);
      return;
    }
    setIsTransitioning(true);
    setActiveDomainIdState(domainId);
    try {
      localStorage.setItem(STORAGE_KEY, domainId);
    } catch {
      // ignore storage errors
    }
    // Brief transition flag so UI can animate between domains
    setTimeout(() => setIsTransitioning(false), 200);
  }, []);

  const activeDomain = useMemo(
    () => getDomainById(activeDomainId) ?? HEALTHCARE_DOMAINS[0],
    [activeDomainId]
  );

  const value = useMemo<DomainContextValue>(
    () => ({
      activeDomainId,
      activeDomain,
      allDomains: HEALTHCARE_DOMAINS,
      setActiveDomain,
      isTransitioning,
    }),
    [activeDomainId, activeDomain, setActiveDomain, isTransitioning]
  );

  return (
    <DomainContext.Provider value={value}>{children}</DomainContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useActiveDomain — access the active healthcare domain and change it.
 *
 * Must be used inside a <DomainProvider>.
 */
export function useActiveDomain(): DomainContextValue {
  const ctx = useContext(DomainContext);
  if (!ctx) {
    throw new Error(
      '[useActiveDomain] Must be used inside a <DomainProvider>. ' +
        'Wrap your component tree with <DomainProvider>.'
    );
  }
  return ctx;
}

export default DomainContext;
