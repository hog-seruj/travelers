import { Story } from '@/types/story';
import TravelersStoriesItem from '../TravelersStoriesItem/TravelersStoriesItem';;
import css from './TravellersStories.module.css';

interface TravellersStoriesProps {
  stories: Story[] | undefined;
  isAuthenticated: boolean;
  className?: string; 
  onRemoveSavedStory?: (id: string) => void; 
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
        <TravelersStoriesItem
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