'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import TravellersStories from '@/components/TravellersStories/TravellersStories';
import Categories from '@/components/Categories/Categories';
import { getStories, fetchSavedStoriesByUserId } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import css from './StoriesPageClient.module.css';
import type { Category, Story, SavedStory } from '@/types/story';

interface CategoryProps {
  initialStories: Story[];
  categories: Category[];
}

export default function StoriesPageClient({
  initialStories,
  categories,
}: CategoryProps) {
  const [stories, setStories] = useState<Story[]>(initialStories);
  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState<string>('all');
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  //  Дані про користувача
  const user = useAuthStore(state => state.user);
  const userId = user?._id || null;
  const isAuthenticated = !!userId;

  // Тягнемо збережені історії юзера 
  const { data: savedStories = [] } = useQuery<SavedStory[]>({
    queryKey: ['savedStoriesByUser', userId],
    queryFn: () => fetchSavedStoriesByUserId(userId as string),
    enabled: isAuthenticated,
  });

  // Масив ID збережених історій
  const savedIds = isAuthenticated
    ? savedStories.map(story => story._id)
    : [];

  // Мерджимо: додаємо isFavorite до історій цієї сторінки
  const mergedStories: Story[] = stories.map(story => ({
    ...story,
    isFavorite: isAuthenticated ? savedIds.includes(story._id) : false,
  }));

  // Вираховуємо, планшет чи ні
  useEffect(() => {
    const handleResize = () => {
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1440);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const PER_PAGE = isTablet ? 8 : 9;
  const FIRST_LOAD = PER_PAGE;

  // Перша порція історій (від сервера) + скидання пагінації
  useEffect(() => {
    setStories(initialStories.slice(0, FIRST_LOAD));
    setPage(1);
    setHasMore(initialStories.length >= FIRST_LOAD);
  }, [initialStories, isTablet, FIRST_LOAD]);

  const handleCategoryChange = async (newCategoryId: string) => {
    setCategoryId(newCategoryId);
    setLoading(true);
    try {
      const categoryParam = newCategoryId === 'all' ? undefined : newCategoryId;
      const data = await getStories(1, PER_PAGE, categoryParam);

      setStories(data.stories);
      setPage(1);
      setHasMore(data.stories.length === PER_PAGE);
    } catch (error) {
      console.error('Помилка отримання історій за категорією:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (!hasMore) return;

    setLoading(true);
    try {
      const nextPage = page + 1;
      const categoryParam = categoryId === 'all' ? undefined : categoryId;
      const newStories = await getStories(nextPage, PER_PAGE, categoryParam);
       setStories(prev => [...prev, ...newStories]);   
      if (newStories.length < FIRST_LOAD) {
        setHasMore(false);
      } else {
       
        setPage(nextPage);
      }
    } catch (error) {
      console.error('Помилка завантаження ще:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className={css.title}>Історії Мандрівників</h1>

      <Categories
        categories={categories}
        value={categoryId}
        onChange={handleCategoryChange}
      />

      <TravellersStories
        stories={mergedStories}
        className={css.storiesList}
        isAuthenticated={isAuthenticated}
      />

      {hasMore && mergedStories.length > 0 && (
        <div className={css.loadMoreWrapper}>
          {loading ? (
            <Loader className={css.loader} />
          ) : (
            <button
              className={`${css.traveller__btn__more} ${css.stories__more}`}
              onClick={handleLoadMore}
              disabled={loading}
            >
              Переглянути ще
            </button>
          )}
        </div>
      )}
    </>
  );
}









































// "use client";

// import TravellersStories from "@/components/TravellersStories/TravellersStories"
// import Categories from '@/components/Categories/Categories';
// import { getCategories, getStories } from "@/lib/api/clientApi";
// import {keepPreviousData, useInfiniteQuery,useQuery} from "@tanstack/react-query";
// import { useEffect, useState } from "react";
// import css from './StoriesPageClient.module.css';


// interface CategoryType {
//   value: string | null;
//   label: string;
//   _id: string | null;
// }

//  const StoriesPageClient = () => {
//   const { data: categories } = useQuery({
//     queryKey: ["categories"],
//     queryFn: () => getCategories(),
//     placeholderData: keepPreviousData,
//     refetchOnMount: false,
//   });

//   const SelectCategories: CategoryType[] = [
//     { value: null, label: "Всі історії", _id: null },
//     ...(categories?.map((category) => ({
//       value: category.name,
//       label: category.name,
//       _id: category._id,
//       name: category.name,
//     })) ?? []),
//   ];

//   const [category, setCategory] = useState<CategoryType | null>(SelectCategories[0]);
//   const [width, setWidth] = useState<number | null>(null);

//   useEffect(() => {
//     const handleResize = () => setWidth(window.innerWidth);
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const isTablet = width !== null && width >= 768 && width < 1440;
//   const isMobile = width !== null && width < 768;

//   const perPage = isTablet ? 8 : 9;

//   const {
//     data,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     error,
//     isLoading,
//   } = useInfiniteQuery({
//     queryKey: ["stories", category?._id ?? "all", perPage],
//     queryFn: async ({ pageParam = 1 }) => {
//       const data = await getStories(perPage, pageParam,  category?.value);
//       return data;
//     },
//     initialPageParam: 1,
//     getNextPageParam: (lastPage) =>
//       lastPage.hasNextPage ? lastPage.page + 1 : undefined,
//     placeholderData: keepPreviousData,
//     refetchOnMount: false,
//   });

//   const stories = data?.pages.flatMap((page) => page.stories) ?? [];

//   const handleClick = (category: CategoryType | null) => {
//     setCategory(category);
//   };

//   return (
//     <section className={css.container}>
//       <h1 className={css.title}>Історії Мандрівників</h1>

//       {isMobile ? (
//         <div className={css.mobileCategories}>
//           <p className={css.categoryTitle}>Категорії</p>
//           <Categories
//             categories={categories}
//             onChange={setCategory}
//             value={category ?? categories[0]}
//           />
//         </div>
//       ) : (
//         <div className={css.categories}>
//           <ul className={css.categoriesList}>
//             {categories.map((category) => (
//               <li key={category._id} className={css.categoriesItem}>
//                 <button
//                   className={`${css.categoriesButton} ${
//                     category?._id === category._id ? css.categoriesSelected : ""
//                   }`}
//                   onClick={() => handleClick(category)}
//                 >
//                   {category.label}
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

 
//       {error && <p>Щось пішло не так</p>}

//       {!isLoading && !error && stories.length > 0 && (
//         <TravellersStories
//           hasNextPage={hasNextPage}
//           isFetchingNextPage={isFetchingNextPage}
//           stories={stories}
//           onLoadMore={fetchNextPage}
//         />
//       )}
//     </section>
//   );
// };

// export default StoriesPageClient;