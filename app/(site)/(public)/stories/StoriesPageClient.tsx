'use client';

import TravellersStories from '@/components/TravellersStories/TravellersStories';
import Categories from '@/components/Categories/Categories';
import { getStories, getCategories } from '@/lib/api/clientApi';
import css from './StoriesPageClient.module.css';
import { useWindowWidth } from '@/hooks/useWindowWidth';
import { useState } from 'react';
import type { Category } from '@/types/story';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import Loader from '@/components/Loader/Loader';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import Button from '@/components/Button/Button';
import Loading from '@/app/loading';

// interface StoriesPageClientProps {
//   category?: string | undefined;
// }

export default function StoriesPageClient() {
  const [activeCategory, setActiveCategory] = useState('all');
  const handleCategoryChange = (id: string) => {
    setActiveCategory(id);
  };

  const windowWidth = useWindowWidth();

  const isTablet = windowWidth && windowWidth >= 768 && windowWidth < 1440;
  const initialLimit = isTablet ? 8 : 9;
  const nextPerPage = isTablet ? 2 : 3;

  const { data } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
    refetchOnMount: false,
  });

  const categories: Category[] = data?.categories || [];

  const {
    data: response,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: [
      'storiesPage',
      initialLimit,
      nextPerPage,
      activeCategory as string,
    ],
    queryFn: async ({ queryKey, pageParam }) => {
      const [, initialLimit, nextPerPage, activeCategory] = queryKey;
      const data = await getStories({
        page: pageParam,
        perPage: initialLimit as number,
        nextPerPage: nextPerPage as number,
        category:
          activeCategory === 'all' ? undefined : (activeCategory as string),
      });
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastResponse) => {
      const currentPage = Number(lastResponse.page);
      const nextPage = currentPage + 1;
      return nextPage <= lastResponse.totalPages ? nextPage : undefined;
    },
    select: (data) => {
      return {
        ...data,
        stories: data.pages.flatMap((page) => page.stories),
      };
    },
  });

  const stories = response?.stories ?? [];
  console.log('stories', stories);
  const hasStories = stories.length > 0;

  return (
    <section className="container">
      <h2 className={`center ${css.title}`}>Історії Мандрівників</h2>

      {categories && (
        <Categories
          categories={categories}
          value={activeCategory}
          onChange={handleCategoryChange}
        />
      )}
      {isLoading && <Loader />}
      {hasStories && <TravellersStories stories={stories} />}
      {isError && <ErrorMessage />}
      {isFetchingNextPage && (
        <div className="container center">
          <Loading />
        </div>
      )}
      <div className={css.btnWrapper}>
        {hasNextPage && (
          <Button
            size="large"
            variant="primary"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className={css.trlBtn}
          >
            {isFetchingNextPage ? 'Завантаження...' : 'Показати ще'}
          </Button>
        )}
      </div>
    </section>
  );
}
