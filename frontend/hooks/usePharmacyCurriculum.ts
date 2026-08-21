import { useState, useEffect } from 'react';
import { PHARMD_CURRICULUM } from '../lib/curriculum/pharmdCurriculumScaffold';

export function usePharmacyCurriculum(program: 'pharmd' | 'bpharm' | 'mpharm') {
  const fallback = program === 'pharmd' ? PHARMD_CURRICULUM : undefined;
  const [curriculum, setCurriculum] = useState<any>(fallback);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const res = await fetch(`/api/v1/pharmacy/${program}/subjects`);
        if (!res.ok) throw new Error('Failed to fetch pharmacy curriculum');
        const data = await res.json();
        if (isMounted && data && Array.isArray(data) && data.length > 0) {
          setCurriculum(data);
        }
      } catch (err: unknown) {
        if (isMounted) setIsError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [program]);

  return {
    curriculum,
    isLoading,
    isError
  };
}
