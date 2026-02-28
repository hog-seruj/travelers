import StoryDetailsSection from '@/components/StoryDetailsSection/StoryDetailsSection';
import PopularStoriesSection from '@/components/PopularStoriesSection/PopularStoriesSection';
import { getStory, getStories } from '@/lib/api/clientApi';
import { notFound } from 'next/navigation';

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import styles from './page.module.css';

type Props = {
  params: Promise<{ storyId: string }>;
};

export default async function StoryPage({ params }: Props) {
  const { storyId } = await params;

  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['story', storyId],
      queryFn: () => getStory(storyId),
    }),
    queryClient.prefetchQuery({
      queryKey: ['popularStories', 4],
      queryFn: () => getStories(1, 4, 'popular'),
    }),
  ]);

  const story = queryClient.getQueryData(['story', storyId]);
  if (!story) notFound();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className={styles.page}>
        <StoryDetailsSection storyId={storyId} />
        <PopularStoriesSection perPage={4} mobileCount={2} />
      </main>
    </HydrationBoundary>
  );
}
