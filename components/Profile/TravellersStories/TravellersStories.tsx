import TravellersStoriesItem from '../../TravelersStoriesItem/TravelersStoriesItem';
import MessageNoStories from '@/components/MessageNoStories/MessageNoStories';
import css from './TravellersStories.module.css';
import Button from '@/components/Button/Button';
import { ApiStory } from '@/types/story';

interface Props {
  stories: ApiStory[];
  variant: "own" | "saved";
  onLoadMore: () => void;
  page: number;
  totalPages: number;
  isFetching: boolean;
  editButton?: boolean;
}

const TravellersStories = ({
  stories,
  variant,
  onLoadMore,
  page,
  totalPages = 0,
  isFetching,
}: Props) => {
  // Якщо немає історій
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
      
      {/* Кнопка показується тільки якщо є ще сторінки для завантаження */}
      {page < totalPages && ( 
        <div className={css.buttonWrapper}>
          <Button 
            onClick={onLoadMore}
            isFetching={isFetching}
          >
            {isFetching ? 'Завантаження...' : 'Завантажити ще'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default TravellersStories;