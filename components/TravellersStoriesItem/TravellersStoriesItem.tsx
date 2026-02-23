'use client';

import Image from 'next/image';
import css from './TravellersStoriesItem.module.css';
import { Story} from '../../types/story';

interface TravellersStoriesProps {
  story: Story;
  
}

export default function TravellersStoriesItem({ story }: TravellersStoriesProps) {
  return (
    <li className={css.story}>
      <Image
        src={story.img}
        alt={story.title}
        width={400}
        height={200}
        className={css.story__img}
      />

      <div className={css.story__content}>
        <p className={css.story__category}>{story.category.name}</p>
        <h3 className={css.story__title}>{story.title}</h3>
        <p className={css.story__text}>{story.article}</p>

        <div className={css.story__author}>
          <Image
            src={'/images/hero/hero_desk@2x.webp'}
            alt="Автор"
            width={48}
            height={48}
            className={css.story__avatar}
          />
        </div>
      </div>
    </li>
  );
}