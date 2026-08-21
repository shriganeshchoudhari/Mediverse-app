import { useState, useEffect } from 'react';
import { BSC_NURSING_CURRICULUM } from '../lib/curriculum/bscNursingCurriculumScaffold';

export function useNursingCurriculum() {
  const [curriculum, setCurriculum] = useState<any>(BSC_NURSING_CURRICULUM);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const res = await fetch('/api/v1/nursing/bscnursing/subjects');
        if (!res.ok) throw new Error('Failed to fetch nursing curriculum');
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
  }, []);

  return {
    curriculum,
    isLoading,
    isError
  };
}
