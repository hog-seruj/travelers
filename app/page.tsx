import styles from './page.module.css';
import Block from '../components/Block/Block';
import TravelersList from '../components/TravelersList/TravelersList';
import PopularStoriesSection from '@/components/PopularStoriesSection/PopularStoriesSection';
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';
import { getStories } from '@/lib/api/clientApi';

export default async function Home() {
  const queryClient = new QueryClient();

  // PopularStoriesSection prefetch
  await queryClient.prefetchQuery({
    queryKey: ['stories'],
    queryFn: () => getStories(1, 3, 'popular'),
  });

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <PopularStoriesSection />
        </HydrationBoundary>
        <Block title="Наші Мандрівники">
          <TravelersList />
        </Block>
      </main>
    </div>
  );
}
