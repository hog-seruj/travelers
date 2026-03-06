'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { getSavedStories } from '@/lib/api/clientApi';
import { useState, useEffect } from 'react';
import TravellersStories from '@/components/TravellersStories/TravellersStories';
import Loader from '@/components/Loader/Loader';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import Button from '@/components/Button/Button';
import css from './MySavedStoryPage.module.css';
import MessageNoStories from '@/components/MessageNoStories/MessageNoStories';

export default function MySavedStoryPage() {
  const [initialLimit, setInitialLimit] = useState<number>(4);
  useEffect(() => {
    const updateLimit = () => {
      // Якщо десктоп (ширина > 1440px) — ставимо 6, інакше 4
      setInitialLimit(window.innerWidth >= 1440 ? 6 : 4);
    };

    updateLimit();
    window.addEventListener('resize', updateLimit);
    return () => window.removeEventListener('resize', updateLimit);
  }, []);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    isFetched,
  } = useInfiniteQuery({
    queryKey: ['savedStories', initialLimit],
    queryFn: async ({ queryKey, pageParam }) => {
      const [, initialLimit] = queryKey;
      const data = await getSavedStories({
        page: pageParam,
        perPage: initialLimit as number,
      });
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastResponse) => {
      const nextPage = Number(lastResponse.page) + 1;
      return nextPage <= lastResponse.totalPages ? nextPage : undefined;
    },
    select: (data) => {
      return {
        ...data,
        stories: data.pages.flatMap((page) => page.stories),
      };
    },
    refetchOnMount: false,
  });
  const savedStories = data?.stories || [];
  const hasSavedStories = savedStories.length > 0;
  const showNoStories = isFetched && !isError && !hasSavedStories;

  // console.log('data:', data);

  return (
    <>
      {isLoading && <Loader />}
      {showNoStories && (
        <MessageNoStories
          text="У вас ще немає збережених історій, мершій збережіть вашу першу історію!"
          buttonText="До історій"
          href="/stories"
        />
      )}
      {hasSavedStories && <TravellersStories stories={savedStories} />}
      {isError && <ErrorMessage />}
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
    </>
  );
}
