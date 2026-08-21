import { useState, useEffect } from 'react';
import { MDS_CURRICULUM } from '@/lib/curriculum/mdsCurriculumScaffold';
import { BDS_CURRICULUM, BDS_METADATA } from '@/lib/curriculum/bdsCurriculumScaffold';

type ProgramCode = 'BDS' | 'MDS';

export function useDentalCurriculum(program: ProgramCode = 'BDS') {
  const staticData = program === 'BDS' ? BDS_CURRICULUM : MDS_CURRICULUM;
  const staticMeta = program === 'BDS' ? BDS_METADATA : null;
  const [curriculum, setCurriculum] = useState<any>(staticData);
  const [isLoading, setIsLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    const url = `/api/v1/dental/${program.toLowerCase()}/${program === 'BDS' ? 'subjects' : 'specialties'}`;
    async function loadData() {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch dental curriculum');
        const json = await res.json();
        if (isMounted && json && Array.isArray(json) && json.length > 0) {
          setCurriculum(json);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setIsOffline(true);
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [program]);

  return {
    curriculum,
    metadata: staticMeta,
    isLoading,
    isOffline,
    error,
  };
}
