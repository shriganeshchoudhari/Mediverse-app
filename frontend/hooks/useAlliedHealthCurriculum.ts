import { useState, useEffect } from 'react';
import { ALLIED_HEALTH_MAJORS, AlliedMajor } from '../lib/curriculum/alliedHealthCurriculumScaffold';

export function useAlliedHealthCurriculum() {
  const [majors, setMajors] = useState<AlliedMajor[]>(ALLIED_HEALTH_MAJORS);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const res = await fetch('/api/v1/allied/programs');
        if (!res.ok) throw new Error('Failed to fetch allied health curriculum');
        const data = await res.json();
        if (isMounted && data && Array.isArray(data) && data.length > 0) {
          setMajors(data);
        }
      } catch (err: unknown) {
        if (isMounted) setIsError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  return {
    majors,
    isLoading,
    isError
  };
}
