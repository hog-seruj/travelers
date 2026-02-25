'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/api';
import { useAuthStore } from '@/lib/store/authStore';
import { Story } from '@/types/story';
import toast from 'react-hot-toast';
import styles from './StoryDetails.module.css';

interface StoryDetailsProps {
  storyId: string;
}

export default function StoryDetails({ storyId }: StoryDetailsProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const {
    data: story,
    isLoading,
    isError,
    error,
  } = useQuery<Story>({
    queryKey: ['story', storyId],
    queryFn: async () => {
      const response = await api.get<Story>(`/stories/${storyId}`);
      return response.data;
    },
  });

  console.log(story);

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.error('Увійдіть, щоб зберегти історію');
      return;
    }

    try {
      await api.post(`/stories/${storyId}/favoriteCount`);
      toast.success('Історію збережено!');
    } catch {
      toast.error('Невдалось зберегти історію');
    }
  };

  if (isLoading) {
    return <p className={styles.loader}>Завантаження...</p>;
  }

  if (isError) {
    return <p className={styles.error}>Помилка: {error?.message}</p>;
  }

  if (!story) {
    return <p>Історію не знайдено</p>;
  }

  return (
    <article className={styles.article}>
      <h1 className={styles.title}>{story.title}</h1>
      <div className={styles.meta}>
        <p className={styles.author}>
          <span className={styles.label}>Автор статті </span>
          {story.ownerId.name}
        </p>
        <p className={styles.date}>
          <span className={styles.label}>Опубліковано </span>
          {story.date}
        </p>
        <p className={styles.country}>{story.category.name}</p>
      </div>
      <div className={styles.imageWrapper}>
        <img src={story.img} alt={story.title} className={styles.image} />
      </div>
      <div className={styles.content}>
        <div className={styles.description}>
          <p>{story.article}</p>
        </div>
        <div className={styles.saveBlock}>
          <h3 className={styles.saveTitle}>Збережіть собі історію</h3>
          <p className={styles.saveText}>
            Вона буде доступна у вашому профілі у розділі збережене
          </p>
          <button
            type="button"
            className={styles.saveButton}
            onClick={handleSave}
          >
            Зберегти
          </button>
        </div>
      </div>
    </article>
  );
}
