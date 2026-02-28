import { Story } from '@/types/story';
import TravelersStoriesItem from '../TravelersStoriesItem/TravelersStoriesItem';;
import css from './TravellersStories.module.css';

interface TravellersStoriesProps {
  stories: Story[],
  onLoadMore?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  isHiddenOnMobileButton?: boolean;
}

export default function TravellersStories({
  stories,
onLoadMore,
  hasNextPage,
  isFetchingNextPage,
  isHiddenOnMobileButton}: TravellersStoriesProps) {
  
  return (
    <> 
    <ul className={css.stories__list}>
      {stories.map((story) => (
        <TravelersStoriesItem story={story}   key={story._id} /> 
      ))}
    </ul>
    {onLoadMore && hasNextPage && !isHiddenOnMobileButton && (
        <button
          className={css.paginationButton}
          type="button"
          onClick={onLoadMore}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? "Завантаження..." : "Переглянути всі"}
        </button>
      )}
      </>
    );
};



