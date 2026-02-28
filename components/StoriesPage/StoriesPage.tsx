'use client';

// import { useQuery } from '@tanstack/react-query';
// import { getStories } from '@/lib/api/clientApi';
// import TravellersStories from '@/components/TravellersStories/TravellersStories';
// import css from './StoriesPage.module.css';
      // import Categories from '@/components/Categories/Categories';
      // import { useState, useEffect } from 'react';
      // import type { Category, Story } from '@/types/story';

      // interface Props {
      //   initialStories: Story[];
      
      // }


      // export default  function StoriesPage({
      //   initialStories,
      //   categories,
      // }: Props) {
      //   const [stories, setStories] = useState<Story[]>(initialStories);
      //   const [page, setPage] = useState(1);
      //   const [categoryId, setCategoryId] = useState<string>('all');
      //   const [hasMore, setHasMore] = useState(true);
      //   const [loading, setLoading] = useState(false);
      //   const [isTablet, setIsTablet] = useState(false);

      //   const { data } = useQuery({
      //     queryKey: ['stories', ],
      //     queryFn: () => getStories(1, 9, 'popular'),
      //     refetchOnMount: false,
      //   });

      // // Вираховуємо, планшет чи ні
      //   useEffect(() => {
      //     const handleResize = () => {
      //       setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1440);
      //     };

      //     handleResize();
      //     window.addEventListener('resize', handleResize);
      //     return () => window.removeEventListener('resize', handleResize);
      //   }, []);

      //    const PER_PAGE = isTablet ? 8 : 9;
      //   const FIRST_LOAD = PER_PAGE;

      //   // Перша порція історій (від сервера) + скидання пагінації
      //   useEffect(() => {
      //     setStories(initialStories.slice(0, FIRST_LOAD));
      //     setPage(1);
      //     setHasMore(initialStories.length >= FIRST_LOAD);
      //   }, [initialStories, isTablet, FIRST_LOAD]); 


      //   const handleCategoryChange = async (newCategoryId: string) => {
      //     setCategoryId(newCategoryId);
      //     setLoading(true);
      //     try {
      //       const categoryParam = newCategoryId === 'all' ? undefined : newCategoryId;
      //       const data = await getStories(1, PER_PAGE, categoryParam);

      //       setStories(data.stories);
      //       setPage(1);
      //       setHasMore(data.stories.length === PER_PAGE);
      //     } catch (error) {
      //       console.error('Помилка отримання історій за категорією:', error);
      //     } finally {
      //       setLoading(false);
      //     }
      //   };


      //   const handleLoadMore = async () => {
      //     if (!hasMore) return;

      //     setLoading(true);
      //     try {
      //       const nextPage = page + 1;
      //       const categoryParam = categoryId === 'all' ? undefined : categoryId;
      //       const newStories = await getStories(nextPage, PER_PAGE, categoryParam);
      //        setStories(prev => [...prev, ...newStories.stories]);   
      //       if (newStories.stories.length < FIRST_LOAD) {
      //         setHasMore(false);
      //       } else {
            
      //         setPage(nextPage);
      //       }
      //     } catch (error) {
      //       console.error('Помилка завантаження ще:', error);
      //     } finally {
      //       setLoading(false);
      //     }
      //   };



//   return (
//    <>
//         <h2 className={css.title}>Історії Мандрівників</h2>

//        <Categories
//           categories={categories}  
//           value={categoryId}
//           onChange={handleCategoryChange}  
//         />

//         {data?.stories?.length > 0 && <TravellersStories stories={data.stories} />}

//       {hasMore && (
//   <div className={css.loadMoreWrapper}>
//     <button
//       className= {css.stories__more}
//       onClick={handleLoadMore}
//       disabled={loading}
//     >
//       Переглянути ще
//     </button>
//   </div>
// )}
//      </>
//   );
// }

   




// import Button from '../Button/Button';
import  Categories  from '@/components/Categories/Categories';
import { fetchStories } from '@/lib/api/clientApi';
import TravellersStories from '@/components/TravellersStories/TravellersStories';
import css from './StoriesPage.module.css';
import {
  keepPreviousData,
  useInfiniteQuery,
  
} from "@tanstack/react-query";
import { useEffect, useState } from "react";
// import Loader from '../Loader/Loader';




function StoriesPageSection() {
 const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isTablet = width !== null && width >= 768 && width < 1440;
 

  const perPage = isTablet ? 8 : 9;


  const { data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
     isLoading, 
     error } = useInfiniteQuery({
    queryKey: ['stories', perPage],
    queryFn: async ({pageParam=1}) =>{
      const data=await fetchStories(perPage, pageParam, undefined );
      return data;
    },
    initialPageParam:1,
    getNextPageParam:(lastPage)=>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
     placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const stories = data?.pages.flatMap((page) => page.data) ?? [];

  if (isLoading) return <p>Loading...</p>;
  if (error || !data) return <p>Some error..</p>;

  return (
    <section className={css.section}>
      <div className="container">
      
<Categories/>
          {isLoading && (
  <div style={{ display: "flex", justifyContent: "center", marginTop: "40px" }}>
    {/* <Loader isFullScreen={false} /> */}
  </div>
)}
      {error && <p>Щось пішло не так</p>}
        { !isLoading && !error && stories.length > 0 &&(
 <TravellersStories   hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          stories={stories}
          onLoadMore={fetchNextPage} 
 />
        )}
        <div className={css.btn}>
          {/* <Button
            variant="primary"
            size="large"
            href="/stories"
            className={css.button}
          >
            Переглянути всі
          </Button> */}
        </div>
      </div>
    </section>
  );
}

export default StoriesPageSection;
