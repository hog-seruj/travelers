import MainWrapper from '@/components/MainWrapper/MainWrapper';
import { getStories, getCategories } from '@/lib/api/serverApi';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import StoriesPageClient from './StoriesPageClient';

interface StoriesPageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function StoriesPage({ params }: StoriesPageProps) {
  const queryClient = new QueryClient();
  const initialLimit: number = 9;
  const { slug } = await params;
  const category = slug[0] === 'all' ? undefined : slug[0];

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['categories'],
      queryFn: getCategories,
    }),
    queryClient.prefetchInfiniteQuery({
      queryKey: ['storiesPage', initialLimit, category],
      queryFn: () =>
        getStories({
          page: 1,
          perPage: initialLimit,
          sort: 'popular',
          category,
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
