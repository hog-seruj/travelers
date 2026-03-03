import TravelersStoriesItem from '@/components/TravelersStoriesItem/TravelersStoriesItem';
import { Story } from '@/types/story';
import css from './TravelersStories.module.css';

interface TravelersStoriesProps {
  stories: Story[];
}

function TravelersStories({ stories }: TravelersStoriesProps) {
  return (
    <ul className={css.list}>
      {stories.map((story) => {
        return <TravelersStoriesItem key={story._id} story={story} />;
      })}
    </ul>
  );
}

export default TravelersStories;
 