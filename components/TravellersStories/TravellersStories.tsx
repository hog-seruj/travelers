import { Story } from '@/types/story';
import TravelersStoriesItem from '../TravelersStoriesItem/TravelersStoriesItem';;
import css from './TravellersStories.module.css';
import Button from '../Button/Button';

interface TravellersStoriesProps {
  stories: Story[],
}

export default function TravellersStories({
  stories 
}: TravellersStoriesProps) {
  
  return (
    <div className={css.wrapper}> 
    <ul className={css.stories__list}>
      {stories.map((story) => (
        <TravelersStoriesItem story={story}   key={story._id} /> 
      ))}
    </ul>
    
      <Button
        size="large"
        variant="primary"
        href="/stories"
        className={css.trlBtn }
      >
        Переглянути всі
      </Button>
     </div> 
    );
};



