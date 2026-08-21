import useSWR from 'swr';
import { BPT_CURRICULUM } from '../lib/curriculum/bptCurriculumScaffold';

export function usePhysiotherapyCurriculum() {
  const { data, error, isLoading } = useSWR('/api/v1/physiotherapy/bpt/subjects', async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch');
      return await res.json();
    } catch (err) {
      // Offline fallback
      return BPT_CURRICULUM;
    }
  });

  return {
    curriculum: data || BPT_CURRICULUM,
    isLoading,
    isError: error
  };
}
