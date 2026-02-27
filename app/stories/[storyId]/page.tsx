import StoryDetailsSection from '@/components/StoryDetailsSection/StoryDetailsSection';
import PopularStoriesSection from '@/components/PopularStoriesSection/PopularStoriesSection';
import { getStory } from '@/lib/api/clientApi';
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

  await queryClient.prefetchQuery({
    queryKey: ['story', storyId],
    queryFn: () => getStory(storyId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className={styles.page}>
        <div className="container">
          <StoryDetailsSection storyId={storyId} />
        </div>
        <PopularStoriesSection />
      </main>
    </HydrationBoundary>
  );
}
