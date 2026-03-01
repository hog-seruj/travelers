import TravelersStoriesItem from '../TravelersStoriesItem/TravelersStoriesItem';
import { Story } from '@/types/story';
import css from './PopularStories.module.css';

interface PopularStoriesProps {
  stories: Story[];
  mobileCount?: number;
}

function PopularStories({ stories, mobileCount = 3 }: PopularStoriesProps) {
  return (
    <ul className={css.list}>
      {stories.map((story, index) => {
        const classes = [];
        if (index >= mobileCount) classes.push(css.hiddenOnMobile);
        if (index >= 3) classes.push(css.hiddenOnDesktop);

        return (
          <TravelersStoriesItem
            key={story._id}
            story={story}
            className={classes.join(' ')}
          />
        );
      })}
    </ul>
  );
}

export default PopularStories;
