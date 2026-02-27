'use client';

import css from './TravellersPage.module.css';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getUsers } from '@/lib/api/clientApi';
import TravelersList from '@/components/TravelersList/TravelersList';
import Button from '@/components/Button/Button';
import { useState, useEffect } from 'react';
import Loader from '@/components/Loader/Loader';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
// import useAFetchPaginatedQuery from '@/hooks/useFetchPaginatedQuery';

export default function TravellersPageClient() {
  const [initialLimit, setInitialLimit] = useState<number>(8);

  useEffect(() => {
    const updateLimit = () => {
      // Якщо десктоп (ширина > 1440px) — ставимо 12, інакше 8
      setInitialLimit(window.innerWidth >= 1440 ? 12 : 8);
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
  } = useInfiniteQuery({
    queryKey: ['travellersPage', initialLimit],
    queryFn: async ({ queryKey, pageParam }) => {
      const [, initialLimit] = queryKey;
      const data = await getUsers({
        page: pageParam,
        perPage: initialLimit as number,
      });
      return data;
    },

    initialPageParam: 1,
    getNextPageParam: (lastResponse) => {
      console.log('Last response from getNextPageParam:', lastResponse);
      const nextPage = (lastResponse.page as number) + 1;
      return nextPage < lastResponse.totalPages ? nextPage : undefined;
    },

    select: (data) => {
      return {
        ...data,
        users: data.pages.flatMap((page) => page.users),
      };
    },
  });

  // з хуком
  // const {
  //   data,
  //   items,
  //   fetchNextPage,
  //   hasNextPage,
  //   isFetchingNextPage,
  //   isLoading,
  //   isError,
  // } = useAFetchPaginatedQuery({
  //   initialLimit,
  //   queryKey: ['travellersPage'],
  //   fetchFn: async ({ page, perPage }) => {
  //     const res = await getUsers({ page, perPage });
  //     return { ...res, items: res.users };
  //   },
  // });

  const users = data?.users ?? [];
  const hasUsers = users.length > 0;

  // console.log(users);

  // console.log('Data from useInfiniteQuery:', data?.pages);

  return (
    <main>
      <section className={`container ${css.section}`}>
        <div>
          <h2 className={`center ${css.title}`}>Мандрівники</h2>
        </div>
        {isLoading && <Loader />}
        {isError && <ErrorMessage />}
        {hasUsers && <TravelersList users={users} />}

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
    </main>
  );
}
