import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { getSavedStories } from '@/lib/api/serverApi';
import MySavedStoryPage from './MySavedStory.client';

export default async function SavedPage() {
  const queryClient = new QueryClient();
  const initialLimit = 6;

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['savedStories', initialLimit],
    queryFn: () =>
      getSavedStories({
        page: 1,
        perPage: initialLimit,
      }),
    initialPageParam: 1,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MySavedStoryPage />
    </HydrationBoundary>
  );
}
