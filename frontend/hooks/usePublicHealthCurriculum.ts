import useSWR from 'swr';
import { MPH_CURRICULUM, MPHSubject } from '../lib/curriculum/mphCurriculumScaffold';
import { MHA_CURRICULUM, MHASubject } from '../lib/curriculum/mhaCurriculumScaffold';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function usePublicHealthCurriculum(program: 'mph' | 'mha' = 'mph') {
  const { data, error, isLoading } = useSWR(`/api/v1/public-health/${program}/subjects`, fetcher, {
    fallbackData: program === 'mph' ? MPH_CURRICULUM : MHA_CURRICULUM,
  });

  return {
    curriculum: data as MPHSubject[] | MHASubject[],
    isLoading,
    isError: error,
  };
}
