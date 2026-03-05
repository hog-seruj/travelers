'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { getSavedStories } from '@/lib/api/clientApi';
import SavedStories from '@/components/SavedStories/SavedStories';
import type { Story } from '@/types/story';

export default function SavedStoriesPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user?._id) return;

    getSavedStories(user._id)
      .then(setStories)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isAuthenticated, user]);

  if (loading) return <div className="center">Завантаження...</div>;
  if (!isAuthenticated) return null;

  return <SavedStories initialStories={stories} />;
}
