'use client';

import css from './TravellersPage.module.css';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getUsers } from '@/lib/api/clientApi';
import TravelersList from '@/components/TravelersList/TravelersList';
import Button from '@/components/Button/Button';
import Loading from '@/app/loading';
import { useState, useEffect } from 'react';

// interface TravellersPageClientProps {
//   initialLimit: number;
// }

export default function TravellersPageClient() {
  const [initialLimit, setInitialLimit] = useState(8);

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
    queryKey: ['travelers', initialLimit],
    queryFn: async ({ pageParam = 1 }) => {
      console.log('Запит на бекенд:', pageParam);

      if (pageParam === 1) {
        return getUsers({ page: 1, perPage: initialLimit });
      }

      return getUsers({
        page: pageParam,
        perPage: 4,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });

  const users = data?.pages.flatMap((page) => page.users) ?? [];
  if (isError)
    return (
      <div className="center">
        <p>Помилка при завантаженні...</p>
      </div>
    );

  return (
    <main>
      <section className={`container ${css.section}`}>
        <div>
          <h2 className={`center ${css.title}`}>Мандрівники</h2>
        </div>
        <TravelersList users={users} />
        <div className={css.btnWrapper}>
          {hasNextPage && (
            <Button
              size="large"
              variant="primary"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage || !hasNextPage}
              className={css.trlBtn}
            >
              {isFetchingNextPage ? 'Завантаження...' : 'Показати ще'}
            </Button>
          )}
          {isLoading && <Loading />}
        </div>
      </section>
    </main>
  );
}
