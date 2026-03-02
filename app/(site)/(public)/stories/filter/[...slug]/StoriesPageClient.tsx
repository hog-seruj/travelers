'use client';

import TravellersStories from '@/components/TravellersStories/TravellersStories';
import Categories from '@/components/Categories/Categories';
import { getStories, fetchSavedStoriesByUserId } from '@/lib/api/clientApi';
import css from './StoriesPageClient.module.css';
import type { Category, Story, SavedStory } from '@/types/story';

export default function StoriesPageClient() {
  return (
    <>
      <h1 className={css.title}>Історії Мандрівників</h1>

      {/* <Categories
        categories={categories}
        value={categoryId}
        onChange={handleCategoryChange}
      />

      <TravellersStories
        stories={mergedStories}
        className={css.storiesList}
        isAuthenticated={isAuthenticated}
      /> */}
    </>
  );
}
