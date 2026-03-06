import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';
import { getServerOwnStories } from '@/lib/api/serverApi';
import MyOwnStoriesPage from './myOwnStories.Client';

export default async function OwnStoriesPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['myOwnStories', 4],
    queryFn: () => getServerOwnStories(1, 4),
    initialPageParam: 1,
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <MyOwnStoriesPage />
      </HydrationBoundary>
    </>
  );
}
