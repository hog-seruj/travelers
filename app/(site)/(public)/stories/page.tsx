import MainWrapper from '@/components/MainWrapper/MainWrapper';
import { getStories, getCategories } from '@/lib/api/serverApi';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import StoriesPageClient from './StoriesPageClient';

export default async function StoriesPage() {
  const queryClient = new QueryClient();
  const initialLimit = 9;
  const nextPerPage = 3;

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['categories'],
      queryFn: getCategories,
    }),
    queryClient.prefetchInfiniteQuery({
      queryKey: ['storiesPage', initialLimit, nextPerPage],
      queryFn: () =>
        getStories({
          page: 1,
          perPage: initialLimit,
          nextPerPage,
          sort: 'popular',
        }),
      initialPageParam: 1,
    }),
  ]);

  return (
    <MainWrapper>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <StoriesPageClient />
      </HydrationBoundary>
    </MainWrapper>
  );
}
