'use client';

import { Story } from '@/types/story';
import TravelersStoriesItem from '../TravelersStoriesItem/TravelersStoriesItem';
import css from './TravellersStories.module.css';

interface TravellersStoriesProps {
  stories: Story[];
  variant: 'saved' | 'own';
  emptyMessage: string;
}

export default function TravellersStories({
  stories,
  variant,
  emptyMessage,
}: TravellersStoriesProps) {
  if (stories.length === 0) {
    return (
      <div className={css.emptyState}>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <ul className={css.list}>
      {stories.map((story) => (
        <TravelersStoriesItem key={story._id} story={story} variant={variant} />
      ))}
    </ul>
  );
}
