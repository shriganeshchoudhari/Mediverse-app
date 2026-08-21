import useSWR from 'swr';
import { BSC_NURSING_CURRICULUM } from '../lib/curriculum/bscNursingCurriculumScaffold';

export function useNursingCurriculum() {
  const { data, error, isLoading } = useSWR('/api/v1/nursing/bscnursing/subjects', async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch');
      return await res.json();
    } catch (e) {
      console.warn('Falling back to local curriculum scaffold', e);
      return BSC_NURSING_CURRICULUM;
    }
  });

  return {
    curriculum: data || BSC_NURSING_CURRICULUM,
    isLoading,
    isError: error
  };
}
