'use client';

import TravelersStories from '@/components/TravelersStories/TravelersStories';
import css from './SavedStories.module.css';

export default function SavedStories() {
  return (
    <div className={css.wrapper}>
      <TravelersStories />
    </div>
  );
}