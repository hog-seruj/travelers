import { Story } from '../../types/story';
import TravellersStoriesItem from '../TravellersStoriesItem/TravellersStoriesItem';
import css from './TravellersStories.module.css';

interface TravellersStoriesProps {
  stories: Story[] | undefined;
  isAuthenticated: boolean;
  className?: string; // додатковий проп для кастомного стилю
  onRemoveSavedStory?: (id: string) => void; // ⬅ додаємо!
  isMyStory?: boolean;
}

export default function TravellersStories({
  stories,
  isAuthenticated,
  className,
  isMyStory,
  onRemoveSavedStory,
}: TravellersStoriesProps) {
  console.log(stories);
  return (
    <ul className={`${css.stories__list} ${className || ''}`}>
      {Array.isArray(stories) && stories.map(story => (
        <TravellersStoriesItem
          key={story._id}
          story={story}
          isAuthenticated={isAuthenticated}
          onRemoveSavedStory={onRemoveSavedStory}
          isMyStory={isMyStory}
        />
      ))}
    </ul>
  );
}