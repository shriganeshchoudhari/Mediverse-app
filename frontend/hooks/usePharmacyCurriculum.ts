import useSWR from 'swr';
import { PHARMD_CURRICULUM } from '../lib/curriculum/pharmdCurriculumScaffold';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function usePharmacyCurriculum(program: 'pharmd' | 'bpharm' | 'mpharm') {
  const { data, error, isLoading } = useSWR(`/api/v1/pharmacy/${program}/subjects`, fetcher, {
    fallbackData: program === 'pharmd' ? PHARMD_CURRICULUM : undefined,
  });

  return {
    curriculum: data,
    isLoading,
    isError: error
  };
}
