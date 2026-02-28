// import StoriesPage from '@/components/StoriesPage/StoriesPage';
// import css from './Stories.module.css';



// export default async function StoryPage() {
//      const initialStories = await fetchStoriesServer(1, 9);
  

//   return (
//     <section className={css.stories}>
//       <div className="container">
//         <StoriesPage 
//           initialStories={initialStories}
//           categories={categories}
//         /> 
//       </div>
//     </section>
//   );
// }

import styles from './Stories.module.css';
import Block from '../../../../components/Block/Block';
import TravelersList from '../../../../components/TravelersList/TravelersList';
import  Categories  from '@/components/Categories/Categories';


import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';
import { getStories } from '@/lib/api/clientApi';
import { getUsers } from '@/lib/api/api';









export default async function Home() {
  const queryClient = new QueryClient();

  // PopularStoriesSection prefetch
  await queryClient.prefetchQuery({
    queryKey: ['stories'],
    queryFn: () => getStories(1, 3, 'popular'),
  });

  // getUsers prefetch
  await queryClient.prefetchQuery({
    queryKey: ['users'],
    queryFn: () => getUsers({}),
  });

  return (
    <div className={styles.page}>
      <main className={styles.main}>
       
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Block title="Історії Мандрівників">
            <Categories  
                        />
            <TravelersList />
          </Block>
          <div className="App">
  
    </div>
        </HydrationBoundary>
       
      </main>
    </div>
  );
}

