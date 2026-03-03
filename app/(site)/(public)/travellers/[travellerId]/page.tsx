import MainWrapper from '@/components/MainWrapper/MainWrapper';
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';
import TravellerInfo from '@/components/TravellerInfo/TravellerInfo';
import { getUserById } from '@/lib/api/clientApi';
import TravelersStoriesSection from '@/components/TravelersStoriesSection/TravelersStoriesSection';

interface TravellerPublicPageProps {
  params: Promise<{ travellerId: string }>;
}

export default async function TravellerPublicPage({
  params,
}: TravellerPublicPageProps) {
  const queryClient = new QueryClient();

  const { travellerId } = await params;

  await queryClient.prefetchQuery({
    queryKey: ['user', travellerId],
    queryFn: () => getUserById(travellerId),
  });

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['travelerOwnStories', travellerId, 4],
    queryFn: () => getUserById(travellerId, 1, 4),
    initialPageParam: 1,
  });

  return (
    <main>
      <MainWrapper>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <TravellerInfo id={travellerId} />
        </HydrationBoundary>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <TravelersStoriesSection />
        </HydrationBoundary>
      </MainWrapper>
    </main>
  );
}
