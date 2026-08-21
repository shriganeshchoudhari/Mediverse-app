import useSWR from 'swr';
import { MD_AYURVEDA_CURRICULUM } from '@/lib/curriculum/mdAyurvedaCurriculumScaffold';
// Assuming BAMS_CURRICULUM exists in bamsCurriculumScaffold, mocking import for now as per instructions (we use fallback)
// import { BAMS_CURRICULUM } from '@/lib/curriculum/bamsCurriculumScaffold';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useAYUSHCurriculum(type: 'bams' | 'md-ayurveda') {
  const endpoint = type === 'bams' 
    ? '/api/v1/ayush/bams/subjects' 
    : '/api/v1/ayush/md/specialties';

  const { data, error, isLoading } = useSWR(endpoint, fetcher, {
    fallbackData: type === 'md-ayurveda' ? MD_AYURVEDA_CURRICULUM : [] // fallback to BAMS_CURRICULUM if available
  });

  return {
    data,
    isLoading,
    isError: error
  };
}
