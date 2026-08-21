import { useState, useEffect } from 'react';

const DOMAIN_SCAFFOLD_MAP: Record<string, string> = {
  'allopathic': 'medical',
  'dental': 'bds',
  'ayush': 'bams',
  'pharmacy': 'pharmd',
  'nursing': 'bscNursing',
  'physiotherapy': 'bpt',
  'allied': 'alliedHealth',
  'veterinary': 'bvsc',
  'public-health': 'mph',
};

export function useDomainCurriculumCatalog() {
  const [activeDomain, setActiveDomain] = useState<string>('allopathic');
  const [scaffoldKey, setScaffoldKey] = useState<string>('medical');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('mediverse-active-domain') || 'allopathic';
    setActiveDomain(stored);
    setScaffoldKey(DOMAIN_SCAFFOLD_MAP[stored] || 'medical');
  }, []);

  return { activeDomain, scaffoldKey, isMBBS: activeDomain === 'allopathic' };
}
