'use client';

import { useQuery } from '@tanstack/react-query';
import Button from '../Button/Button';
import PopularStories from '../PopularStories/PopularStories';
import { getStories } from '@/lib/api/clientApi';
import css from './PopularStoriesSection.module.css';

function PopularStoriesSection() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['stories'],
    queryFn: () => getStories(1, 3, 'popular'),
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error || !data) return <p>Some error..</p>;

  return (
    <section className={css.section}>
      <div className="container">
        <h2 className={css.title}>Популярні історії</h2>
        {data?.stories.length > 0 && <PopularStories stories={data.stories} />}
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
