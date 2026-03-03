'use client';

import css from './TravelersStoriesSection.module.css';
import Button from '@/components/Button/Button';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import TravelersStories from '../TravelersStories/TravelersStories';
import { getUserById } from '@/lib/api/clientApi';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MessageNoStories from '../MessageNoStories/MessageNoStories';
import { useWindowWidth } from '@/hooks/useWindowWidth';

function TravelersStoriesSection() {
  const { travellerId } = useParams<{ travellerId: string }>();

  const windowWidth = useWindowWidth();

  // perPage depending on screen width
  const perPage: number = windowWidth && windowWidth > 1440 ? 6 : 4;
  console.log(perPage);
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
    queryKey: ['travelerOwnStories', travellerId, perPage],
    queryFn: ({ queryKey, pageParam }) => {
      const [, currentTravellerId, perPage] = queryKey;
      return getUserById(
        currentTravellerId as string,
        pageParam,
        perPage as number
      );
    },
    refetchOnMount: false,
    initialPageParam: 1,
    getNextPageParam: (lastResponse) => {
      const nextPage = Number(lastResponse.articles.page) + 1;
      // console.log(
      //   nextPage < lastResponse.articles.totalPages ? nextPage : undefined
      // );
      return nextPage <= lastResponse.articles.totalPages
        ? nextPage
        : undefined;
    },
    select: (data) => {
      const userInfo = data.pages[0].user;
      const ownerId = {
        _id: userInfo._id,
        name: userInfo.name,
        avatarUrl: userInfo.avatarUrl,
      };

      return {
        ...data,
        travelerStories: data.pages
          .flatMap((page) => page.articles.articles)
          .map((story) => {
            return { ...story, ownerId: ownerId };
          }),
      };
    },
  });

  console.log(data);

  const travelerStories = data?.travelerStories ?? [];
  const hasStories = travelerStories.length > 0;
  const showNoStories = isFetched && !isError && !hasStories;

  return (
    <section className={css.section}>
      <div className="container">
        <h2 className={css.title}>Історії Мандрівника</h2>
        {isLoading && <Loader />}
        {isError && <ErrorMessage />}
        {showNoStories && (
          <MessageNoStories
            text="Цей користувач ще не публікував історій"
            buttonText="Назад до історій"
            href="/stories"
          />
        )}
        {hasStories && <TravelersStories stories={travelerStories} />}
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
    </section>
  );
}

export default TravelersStoriesSection;
