'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { getSavedStories } from '@/lib/api/clientApi';
import type { Story } from '@/types/story';
import TravellersStories from '../TravellersStories/TravellersStories';
import css from './SavedStories.module.css';

export interface SavedStoriesProps {
  initialStories?: Story[];
}

export default function SavedStories({ initialStories }: SavedStoriesProps) {
  const [stories, setStories] = useState<Story[]>(() => {
    if (!initialStories) return [];
    return initialStories;
  });

  const [loading, setLoading] = useState<boolean>(!initialStories);
  const [error, setError] = useState<string | null>(null);

  const userId = useAuthStore((state) => state.user?._id);

  useEffect(() => {
    if (initialStories) return;
    if (!userId) return;

    async function fetchStories(id: string) {
      try {
        const data = await getSavedStories(id);
        setStories(data);
      } catch (err) {
        console.error('Error:', err);
        setError('Не вдалося завантажити збережені історії');
      } finally {
        setLoading(false);
      }
    }

    fetchStories(userId);
  }, [userId, initialStories]);

  if (loading) return <div className={css.loading}>Завантаження...</div>;
  if (error) return <div className={css.error}>{error}</div>;

  return (
    <TravellersStories
      stories={stories}
      variant="saved"
      emptyMessage="У вас ще немає збережених історій"
    />
  );
}
