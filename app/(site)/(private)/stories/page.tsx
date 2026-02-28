import style from './Stories.module.css';
import StoriesPageSection from '@/components/StoriesPage/StoriesPage'
import {QueryClient,HydrationBoundary,dehydrate} from '@tanstack/react-query';


export default async function Home() {
  const queryClient = new QueryClient();

  return (
    <div className={style.page}>
      <main className={style.main}>
        <HydrationBoundary state={dehydrate(queryClient)}>
   <h2 className={`center ${style.title}`}>Історії Мандрівників</h2>
            <StoriesPageSection/>
        </HydrationBoundary>
       
      </main>
    </div>
  );
}

