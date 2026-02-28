'use client';

import { useQuery } from '@tanstack/react-query';
import Button from '../Button/Button';
import PopularStories from '../PopularStories/PopularStories';
import { getStories } from '@/lib/api/clientApi';
import css from './PopularStoriesSection.module.css';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { useWindowWidth } from '@/hooks/useWindowWidth';

function PopularStoriesSection() {
  const windowWidth = useWindowWidth();

  // number of stories depending on screen width
  const storiesNumber: number =
    windowWidth && windowWidth >= 768 && windowWidth < 1440 ? 4 : 3;
  console.log(storiesNumber);
  //

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      'popularStories',
      { page: 1, perPage: 4, sort: 'popular', category: null },
    ],
    queryFn: () => getStories(1, 4, 'popular'),
    refetchOnMount: false,
  });

  if (isLoading)
    return (
      <div className="center">
        <Loader />
      </div>
    );
  if (isError || !data)
    return (
      <div className="center">
        <ErrorMessage />
      </div>
    );

  return (
    <section className={css.section}>
      <div className="container">
        <h2 className={css.title}>Популярні історії</h2>
        {data?.stories?.length > 0 && (
          <PopularStories stories={data.stories.slice(0, storiesNumber)} />
        )}
        <div className={css.btn}>
          <Button
            variant="primary"
            size="large"
            href="/stories"
            className={css.button}
          >
            Переглянути всі
          </Button>
        </div>
      </div>
    </section>
  );
}

export default PopularStoriesSection;
