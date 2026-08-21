import useSWR from 'swr';
import { MDS_CURRICULUM } from '@/lib/curriculum/mdsCurriculumScaffold';

type ProgramCode = 'BDS' | 'MDS';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

// Need a dummy BDS_CURRICULUM and BDS_METADATA for fallback, or use any if not present
// assuming BDS_CURRICULUM is already there
import { BDS_CURRICULUM, BDS_METADATA } from '@/lib/curriculum/bdsCurriculumScaffold';

export function useDentalCurriculum(program: ProgramCode = 'BDS') {
  const { data, error, isLoading } = useSWR(
    `/api/v1/dental/${program.toLowerCase()}/${program === 'BDS' ? 'subjects' : 'specialties'}`,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 300_000 }
  );

  // Fall back to static scaffold on error
  const staticData = program === 'BDS' ? BDS_CURRICULUM : MDS_CURRICULUM;
  const staticMeta = program === 'BDS' ? BDS_METADATA : null; // MDS metadata handled dynamically

  return {
    curriculum: data ?? staticData,
    metadata: staticMeta,
    isLoading,
    isOffline: !!error,
    error,
  };
}
