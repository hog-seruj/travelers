import { Story } from '@/types/story';
import TravelersStoriesItem from '../TravelersStoriesItem/TravelersStoriesItem';;
import css from './TravellersStories.module.css';

interface TravellersStoriesProps {
  stories: Story[]
}

export default function TravellersStories({
  stories}: TravellersStoriesProps) {
  
  return (
    <ul className={css.stories__list}>
      {stories.map((story) => (
        <TravelersStoriesItem key={story._id}  story={story}/>
      ))}
    </ul>
  );
}



