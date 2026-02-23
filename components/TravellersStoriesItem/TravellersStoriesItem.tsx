'use client';

import Image from 'next/image';
import css from './TravellersStoriesItem.module.css';
import { Traveller } from '../TravellersStories/TravellersStories';

interface TravellersStoriesProps {
  traveller: Traveller;
}

export default function TravellersStoriesItem({ traveller }: TravellersStoriesProps) {
  return (
    <li className={css.story}>
      <Image
        src={traveller.img}
        alt={traveller.title}
        width={400}
        height={200}
        className={css.story__img}
      />

      <div className={css.story__content}>
        <p className={css.story__category}>{traveller.category.name}</p>
        <h3 className={css.story__title}>{traveller.title}</h3>
        <p className={css.story__text}>{traveller.article}</p>

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