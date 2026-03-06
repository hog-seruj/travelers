import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';
// import { getOwnStories } from '@/lib/api/serverApi';
import MyOwnStoriesPage from './myOwnStories.Client';

export default function OwnStoriesPage() {
  const queryClient = new QueryClient();

  //  префетч + пагінація

  return (
    <>
      <h1>Мої історії</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <MyOwnStoriesPage />
      </HydrationBoundary>
    </>
  );
}
