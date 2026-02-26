'use client';

import { useQuery } from '@tanstack/react-query';
import Loading from '@/app/loading';
import { getOwnStories } from '@/lib/api/serverApi';
import OwnStoryItem from '../OwnStoryItem/OwnStoryItem';
import css from './OwnStories.module.css';

export default function OwnStories() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['profile', 'ownStories', 1, 8],
    queryFn: () => getOwnStories({ page: 1, perPage: 8 }),
    refetchOnMount: false,
  });

  if (isLoading) {
    return (
      <div className={css.center}>
        <Loading />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className={css.center}>
        <p>Помилка при завантаженні моїх історій…</p>
      </div>
    );
  }

  return (
    <div className={css.wrapper}>
      <ul className={css.list}>
        {data.stories.map((story) => (
          <li key={story._id} className={css.item}>
            <OwnStoryItem story={story} />
          </li>
        ))}
      </ul>
    </div>
  );
}