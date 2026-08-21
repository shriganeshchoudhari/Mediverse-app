import { useState, useEffect } from 'react';
import { MD_AYURVEDA_CURRICULUM } from '@/lib/curriculum/mdAyurvedaCurriculumScaffold';

export function useAYUSHCurriculum(type: 'bams' | 'md-ayurveda') {
  const fallback = type === 'md-ayurveda' ? MD_AYURVEDA_CURRICULUM : [];
  const [data, setData] = useState<any>(fallback);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    const endpoint = type === 'bams' 
      ? '/api/v1/ayush/bams/subjects' 
      : '/api/v1/ayush/md/specialties';

    async function loadData() {
      try {
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error('Failed to fetch AYUSH curriculum');
        const json = await res.json();
        if (isMounted && json && Array.isArray(json) && json.length > 0) {
          setData(json);
        }
      } catch (err: unknown) {
        if (isMounted) setIsError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [type]);

  return {
    data,
    isLoading,
    isError
  };
}
