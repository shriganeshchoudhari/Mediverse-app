import useSWR from 'swr';
import { ALLIED_HEALTH_MAJORS, AlliedMajor } from '../lib/curriculum/alliedHealthCurriculumScaffold';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch allied health curriculum');
  return res.json();
};

export function useAlliedHealthCurriculum() {
  const { data, error, isLoading } = useSWR<AlliedMajor[]>(
    '/api/v1/allied/programs',
    fetcher,
    { fallbackData: ALLIED_HEALTH_MAJORS }
  );

  return {
    majors: data || ALLIED_HEALTH_MAJORS,
    isLoading,
    isError: error
  };
}
