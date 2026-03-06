'use client';

import Button from '@/components/Button/Button';
import { useInfiniteQuery } from '@tanstack/react-query';
import TravellersStories from '@/components/TravellersStories/TravellersStories';
import { getOwnStories } from '@/lib/api/clientApi';
import Loader from '@/components/Loader/Loader';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import MessageNoStories from '@/components/MessageNoStories/MessageNoStories';
import { useWindowWidth } from '@/hooks/useWindowWidth';
import css from './myOwnStories.module.css';

export default function MyOwnStoriesPage() {
  const windowWidth = useWindowWidth();

  // perPage depending on screen width
  const perPage: number = windowWidth && windowWidth > 1440 ? 6 : 4;
  // console.log(perPage);
  //
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isError,
    isLoading,
    isFetched,
  } = useInfiniteQuery({
    queryKey: ['myOwnStories', perPage],
    queryFn: ({ queryKey, pageParam }) => {
      const [, perPage] = queryKey;
      return getOwnStories(pageParam, perPage as number);
    },
    refetchOnMount: false,
    initialPageParam: 1,
    getNextPageParam: (lastResponse) => {
      const nextPage = Number(lastResponse.page) + 1;
      return nextPage <= lastResponse.totalPages ? nextPage : undefined;
    },
    select: (data) => {
      return {
        ...data,
        myStories: data.pages.flatMap((page) => page.stories),
      };
    },
  });

  // console.log(data);

  const myStories = data?.myStories ?? [];
  const hasStories = myStories.length > 0;
  const showNoStories = isFetched && !isError && !hasStories;

  return (
    <div>
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {showNoStories && (
        <MessageNoStories
          text="Ви ще нічого не публікували, поділіться своєю першою історією!"
          buttonText="Опублікувати історію"
          href="/stories/create"
        />
      )}
      {hasStories && <TravellersStories stories={myStories} />}
      {hasNextPage && (
        <div className={css.btn}>
          <Button
            onClick={() => fetchNextPage()}
            variant="primary"
            size="large"
            className={css.button}
            disabled={isFetching}
          >
            {isFetchingNextPage ? 'Завантаження...' : 'Показати ще'}
          </Button>
        </div>
      )}
    </div>
  );
}
