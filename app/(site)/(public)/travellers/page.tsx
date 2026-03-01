import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { getUsers } from '@/lib/api/serverApi';
import TravellersPageClient from './TravellersPageClient';
import MainWrapper from '@/components/MainWrapper/MainWrapper';

export default async function TravellersPage() {
  const queryClient = new QueryClient();
  const initialLimit = 12;

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['travellersPage', initialLimit],
    queryFn: () =>
      getUsers({
        page: 1,
        perPage: initialLimit,
      }),
    initialPageParam: 1,
  });

  return (
    <MainWrapper>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TravellersPageClient />
      </HydrationBoundary>
    </MainWrapper>
  );
}
