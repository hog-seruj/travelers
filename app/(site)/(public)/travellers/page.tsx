import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { getUsers } from '@/lib/api/serverApi';
import TravellersPageClient from './TravellersPageClient';

export default async function TravellersPage() {
  const queryClient = new QueryClient();
  const limit = 8;

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['travelers', limit],
    queryFn: () => getUsers({ page: 1, perPage: limit }),
    initialPageParam: 1,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TravellersPageClient initialLimit={limit} />
    </HydrationBoundary>
  );
}
