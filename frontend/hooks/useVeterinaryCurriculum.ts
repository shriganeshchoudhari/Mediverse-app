import useSWR from 'swr';
import { BVSC_CURRICULUM } from '../lib/curriculum/bvscCurriculumScaffold';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useVeterinaryCurriculum() {
  const { data, error, isLoading } = useSWR('/api/v1/veterinary/bvsc/subjects', fetcher, {
    fallbackData: BVSC_CURRICULUM,
  });

  return {
    curriculum: data || BVSC_CURRICULUM,
    isLoading,
    isError: error,
  };
}
