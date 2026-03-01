import MainWrapper from '../../../../../components/MainWrapper/MainWrapper';
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';
import TravellerInfo from '@/components/TravellerInfo/TravellerInfo';
import { getUserById } from '@/lib/api/clientApi';

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

  return (
    <MainWrapper>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TravellerInfo id={travellerId} />
      </HydrationBoundary>
    </MainWrapper>
  );
}
