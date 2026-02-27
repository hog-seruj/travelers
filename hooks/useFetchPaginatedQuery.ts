// import { useEffect, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

export interface PaginatedResponse<T> {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: T[];
}

interface UseAFetchPaginatedQueryParams {
  queryKey: (string | number)[];
  initialLimit: number;
  fetchFn: ({
    page,
    perPage,
  }: {
    page: number;
    perPage: number;
  }) => Promise<PaginatedResponse<T>>;
}

export default function useAFetchPaginatedQuery({
  queryKey,
  fetchFn,
  initialLimit,
}: UseAFetchPaginatedQueryParams) {
  const query = useInfiniteQuery({
    queryKey: [...queryKey, initialLimit],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => {
      //   const [, initialLimit] = queryKey;
      //   const perPage = initialLimit as number;
      return fetchFn({ page: pageParam, perPage: initialLimit });
    },
    getNextPageParam: (lastResponse) => {
      const nextPage = lastResponse.page + 1;
      return nextPage <= lastResponse.totalPages ? nextPage : undefined;
    },
    select: (data) => ({
      ...data,
      items: data.pages.flatMap((page) => page.items),
    }),
    staleTime: 5 * 60 * 1000, // 5 хвилин
  });

  return {
    ...query,
    items: query.data?.items ?? [],
  };
}
