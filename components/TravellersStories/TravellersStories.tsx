import { Story } from '@/types/story';
import TravelersStoriesItem from '../TravelersStoriesItem/TravelersStoriesItem';
import css from './TravellersStories.module.css';

interface TravellersStoriesProps {
  stories: Story[];
}

export default function TravellersStories({ stories }: TravellersStoriesProps) {
  return (
    <div className={css.wrapper}>
      <ul className={css.list}>
        {stories.map((story) => (
          <TravelersStoriesItem story={story} key={story._id} />
        ))}
      </ul>
    </div>
  );
}
