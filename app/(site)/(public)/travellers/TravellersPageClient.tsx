'use client';

import css from './TravellersPage.module.css';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getUsers } from '@/lib/api/clientApi';
import TravelersList from '@/components/TravelersList/TravelersList';
import Button from '@/components/Button/Button';

interface TravellersPageClientProps {
  initialLimit: number;
}

export default function TravellersPageClient({
  initialLimit,
}: TravellersPageClientProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['travelers', initialLimit],
    queryFn: ({ pageParam = 1 }) =>
      getUsers({ page: pageParam, perPage: initialLimit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const currentPage = Number(lastPage.page);
      const total = lastPage.totalPages;
      return currentPage < total ? currentPage + 1 : undefined;
    },
  });

  const allUsers = data?.pages.flatMap((page) => page.users) ?? [];

  console.log('Fetched users:', allUsers);

  return (
    <main>
      <div className="container">
        <h2 className={`center ${css.title}`}>Мандрівники</h2>
      </div>
      <TravelersList users={allUsers} />
      <div className={css.btnWrapper}>
        <Button
          size="large"
          variant="primary"
          href="/travellers"
          className={css.trlBtn}
        >
          Показати ще
        </Button>
      </div>
    </main>
  );
}
