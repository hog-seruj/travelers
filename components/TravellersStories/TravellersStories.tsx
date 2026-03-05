"use client";

import TravellersStoriesItem from '../TravelersStoriesItem/TravelersStoriesItem';
import MessageNoStories from '@/components/MessageNoStories/MessageNoStories';
import Button from '@/components/Button/Button';
import { Story } from '@/types/story';
import css from './TravellersStories.module.css';

interface TravellersStoriesProps {
  stories: Story[];
  variant: 'own' | 'saved';
  onLoadMore?: () => void;
  page?: number;
  totalPages?: number;
  isFetching?: boolean;
  editButton?: boolean;
}

export default function TravellersStories({
  stories,
  variant,
  onLoadMore,
  page = 1,
  totalPages = 0,
  isFetching = false,
  editButton = false,
}: TravellersStoriesProps) {
  if (!stories || stories.length === 0) {
    const isOwn = variant === 'own';
    return (
      <MessageNoStories 
        text={isOwn
          ? "У вас ще немає створених історій. Поділіться своїми пригодами з іншими!"
          : "Ваш список збережених історій поки що порожній."
        }
        buttonText={isOwn ? "Опублікувати історію" : "Перейти до історій"}
        href={isOwn ? "/stories/create" : "/stories"} 
      />
    );
  }

  return (
    <div className={css.container}>
      <ul className={css.grid}>
        {stories.map((story) => (
          <TravellersStoriesItem 
            key={story._id}
            story={story}
            isOwnStory={variant === 'own'}
            isSaved={variant === 'saved'}
            isAuthenticated={true}
          />
        ))}
      </ul>

      {editButton && variant === 'own' && (
        <div className={css.editButtonWrapper}>
          <Button onClick={() => console.log('Редагувати історію')}>
            Редагувати
          </Button>
        </div>
      )}

      {onLoadMore && page < totalPages && (
        <div className={css.buttonWrapper}>
          <Button onClick={onLoadMore} isFetching={isFetching}>
            {isFetching ? 'Завантаження...' : 'Завантажити ще'}
          </Button>
        </div>
      )}
    </div>
  );
}