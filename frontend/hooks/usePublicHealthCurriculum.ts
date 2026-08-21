import { useState, useEffect } from 'react';
import { MPH_CURRICULUM, MPHSubject } from '../lib/curriculum/mphCurriculumScaffold';
import { MHA_CURRICULUM, MHASubject } from '../lib/curriculum/mhaCurriculumScaffold';

export function usePublicHealthCurriculum(program: 'mph' | 'mha' = 'mph') {
  const fallback = program === 'mph' ? MPH_CURRICULUM : MHA_CURRICULUM;
  const [curriculum, setCurriculum] = useState<MPHSubject[] | MHASubject[]>(fallback as any);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const res = await fetch(`/api/v1/public-health/${program}/subjects`);
        if (!res.ok) throw new Error('Failed to fetch public health curriculum');
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
    isError,
  };
}
