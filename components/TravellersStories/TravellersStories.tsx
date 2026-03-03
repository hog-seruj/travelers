import TravelersStoriesItem from '@/components/TravelersStoriesItem/TravelersStoriesItem';
import { Story } from '@/types/story';
import css from './TravelersStories.module.css';

interface TravelersStoriesProps {
  stories: Story[];
  onLoadMore: () => void;
  page: number;
  totalPages: number;
  isFetching: boolean;
  editButton?: boolean; // додано для кнопки редагування
}

function TravelersStories({
  stories,
  onLoadMore,
  page,
  totalPages,
  isFetching,
  editButton = false,
}: TravelersStoriesProps) {
  if (!stories || stories.length === 0) {
    return <p>Історії відсутні</p>;
  }

  return (
    <div>
      <ul className={css.list}>
        {stories.map((story) => (
          <TravelersStoriesItem
            key={story._id}
            story={story}
            editButton={editButton} // передаємо в картку, щоб вона знала показувати кнопку редагування
          />
        ))}
      </ul>

      {page < totalPages && (
        <div className={css.buttonWrapper}>
          <button onClick={onLoadMore} disabled={isFetching} className={css.loadMore}>
            {isFetching ? 'Завантаження...' : 'Завантажити ще'}
          </button>
        </div>
      )}
    </div>
  );
}

export default TravelersStories;