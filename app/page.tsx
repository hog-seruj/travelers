import styles from './page.module.css';
import Block from '../components/Block/Block';
import StoriesList from '../components/StoriesList/StoriesList';
import TravelersList from '../components/TravelersList/TravelersList';
import Hero from '@/components/Hero/Hero';
import About from '@/components/About/About';
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';
import { getUsers } from '@/lib/api/api';

export default async function Home() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['users'],
    queryFn: () => getUsers({}),
  });

  return (
    <div className={styles.page}>
      <Hero />
      <About />
      <main className={styles.main}>
        <Block title="Популярні історії">
          <StoriesList />
        </Block>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Block title="Наші Мандрівники">
            <TravelersList />
          </Block>
        </HydrationBoundary>
      </main>
    </div>
  );
}
