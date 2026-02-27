import styles from './page.module.css';
import Block from '../../components/Block/Block';
import TravelersList from '../../components/TravelersList/TravelersList';
import PopularStoriesSection from '@/components/PopularStoriesSection/PopularStoriesSection';
import Join from '../../components/Join/Join';
import Hero from '@/components/Hero/Hero';
import About from '@/components/About/About';

import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';
import { getStories } from '@/lib/api/clientApi';
import { getUsers } from '@/lib/api/clientApi';

export default async function Home() {
  const queryClient = new QueryClient();

  // PopularStoriesSection prefetch
  await queryClient.prefetchQuery({
    queryKey: ['popularStories'],
    queryFn: () => getStories(1, 3, 'popular'),
  });

  // getUsers prefetch
  await queryClient.prefetchQuery({
    queryKey: ['users'],
    queryFn: () => getUsers({}),
  });

  return (
    <main className={styles.main}>
      <Hero />
      <About />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PopularStoriesSection />
        <Block title="Наші Мандрівники">
          <TravelersList />
        </Block>
      </HydrationBoundary>
      <Join />
    </main>
  );
}
