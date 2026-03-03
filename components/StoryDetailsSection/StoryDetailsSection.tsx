'use client';

import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { getStory, addStoryToSaved } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { Story } from '@/types/story';
import AuthNavModal from '@/components/AuthNavModal/AuthNavModal';
import toast from 'react-hot-toast';
import Button from '@/components/Button/Button';
import Image from 'next/image';
import css from './StoryDetailsSection.module.css';

interface StoryDetailsProps {
  storyId: string;
}

export default function StoryDetailsSection({ storyId }: StoryDetailsProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const [isSaved, setIsSaved] = useState(
    user?.savedArticles?.includes(storyId) ?? false
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    if (user?.savedArticles?.includes(storyId)) {
      setIsSaved(true);
    }
  }, [user, storyId]);

  const {
    data: story,
    isLoading,
    isError,
    error,
  } = useQuery<Story>({
    queryKey: ['story', storyId],
    queryFn: () => getStory(storyId),
  });

  const handleSave = async () => {
    if (!isAuthenticated) {
      setIsModalOpen(true);
      return;
    }

    try {
      await addStoryToSaved(storyId);
      setIsSaved(true);
      toast.success('Історію збережено!');
    } catch {
      toast.error('Невдалось зберегти історію');
    }
  };

  if (isLoading) {
    return <p className={css.loader}>Завантаження...</p>;
  }

  if (isError) {
    return <p className={css.error}>Помилка: {error?.message}</p>;
  }

  if (!story) {
    return <p>Історію не знайдено</p>;
  }

  return (
    <section className={css.section}>
      <div className="container">
        <h1 className={css.title}>{story.title}</h1>
        <div className={css.meta}>
          <p className={css.author}>
            <span className={css.label}>Автор статті </span>
            {story.ownerId.name}
          </p>
          <p className={css.date}>
            <span className={css.label}>Опубліковано </span>
            {story.date}
          </p>
          <p className={css.country}>{story.category.name}</p>
        </div>
        <div className={css.imageWrapper}>
          <Image
            src={story.img}
            alt={story.title}
            fill
            sizes="(max-width: 374px) calc(100vw - 40px), (max-width: 767px) 335px, (max-width: 1439px) 704px, 1312px"
            className={css.image}
          />
        </div>
        <div className={css.content}>
          <div className={css.description}>
            <p>{story.article}</p>
          </div>
          {!isSaved && (
            <div className={css.saveBlock}>
              <h3 className={css.saveTitle}>Збережіть собі історію</h3>
              <p className={css.saveText}>
                Вона буде доступна у вашому профілі у розділі збережене
              </p>
              <Button
                variant="primary"
                size="large"
                className={css.saveButton}
                onClick={handleSave}
              >
                Зберегти
              </Button>
            </div>
          )}
        </div>
      </div>
      {isModalOpen && <AuthNavModal onClose={() => setIsModalOpen(false)} />}
    </section>
  );
}
