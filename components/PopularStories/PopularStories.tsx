import TravelersStoriesItem from '../TravelersStoriesItem/TravelersStoriesItem';
import { Story } from '@/types/story';
import css from './PopularStories.module.css';

interface PopularStoriesProps {
  stories: Story[];
}

function PopularStories({ stories }: PopularStoriesProps) {
  return (
    <ul className={css.list}>
      {stories.map((story) => (
        <TravelersStoriesItem key={story._id} story={story} />
      ))}
    </ul>
  );
}

export default PopularStories;
