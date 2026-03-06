'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import {
  getStory,
  addStoryToSaved,
  removeStoryFromSaved,
} from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { Story } from '@/types/story';
import AuthNavModal from '@/components/AuthNavModal/AuthNavModal';
import Button from '@/components/Button/Button';
import Loader from '@/components/Loader/Loader'; // ⭐ FIX: використовується готовий Loader
import Image from 'next/image';
import css from './StoryDetailsSection.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import Link from 'next/link';

interface StoryDetailsProps {
  storyId: string;
}

export default function StoryDetailsSection({ storyId }: StoryDetailsProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: story,
    isLoading,
    isError,
    error,
  } = useQuery<Story>({
    queryKey: ['story', storyId],
    queryFn: () => getStory(storyId),
  });

  const mutationAddStory = useMutation({
    mutationFn: addStoryToSaved,
    onSuccess: (data) => {
      updateUser({ savedArticles: data.savedArticles });

      queryClient.invalidateQueries({ queryKey: ['popularStories'] });
      queryClient.invalidateQueries({ queryKey: ['travelerOwnStories'] });
      queryClient.invalidateQueries({ queryKey: ['storiesPage'] });

      toast.success(`Історія "${story?.title}" успішно додана до збережених!`);
    },
    onError: () => {
      toast.error('Виникла помилка, спробуйте ще раз');
    },
  });

  const mutationRemoveStory = useMutation({
    mutationFn: removeStoryFromSaved,
    onSuccess: (data) => {
      updateUser({ savedArticles: data.stories });

      queryClient.invalidateQueries({ queryKey: ['popularStories'] });
      queryClient.invalidateQueries({ queryKey: ['travelerOwnStories'] });
      queryClient.invalidateQueries({ queryKey: ['storiesPage'] });

      toast.success(
        `Історія "${story?.title}" успішно видалена із збережених!`
      );
    },
    onError: () => {
      toast.error('Виникла помилка, спробуйте ще раз');
    },
  });

  let isButtonDisabled = false;
  if (mutationAddStory.isPending || mutationRemoveStory.isPending) {
    isButtonDisabled = true;
  }

  const handleClick = () => {
    if (!isAuthenticated) {
      setIsModalOpen(true);
      return;
    }

    if (
      story &&
      isAuthenticated &&
      user &&
      user.savedArticles?.includes(story._id)
    ) {
      mutationRemoveStory.mutate(story._id);
    } else {
      mutationAddStory.mutate(storyId);
    }
  };

  // ⭐ FIX: Loader тепер у правильному layout і буде по центру
  if (isLoading) {
    return (
      <section className={css.section}>
        <div className="container">
          <div className={css.loaderWrapper}>
            <Loader />
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className={css.section}>
        <div className="container">
          <p className={css.error}>Помилка: {error?.message}</p>
        </div>
      </section>
    );
  }

  if (!story) {
    return (
      <section className={css.section}>
        <div className="container">
          <p>Історію не знайдено</p>
        </div>
      </section>
    );
  }

  return (
    <section className={css.section}>
      <div className="container">
        <h1 className={css.title}>{story.title}</h1>

        <div className={css.meta}>
          <Link
            href={`/travellers/${story.ownerId._id}`}
            className={css.author}
          >
            <span className={css.label}>Автор статті </span>
            {story.ownerId.name}
          </Link>

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

          <div className={css.saveBlock}>
            <h3 className={css.saveTitle}>
              {story &&
                isAuthenticated &&
                user &&
                user.savedArticles?.includes(story._id)
                ? 'Історія вже збрежена'
                : 'Збережіть собі історію'}
            </h3>

            <p className={css.saveText}>
              {story &&
                isAuthenticated &&
                user &&
                user.savedArticles?.includes(story._id)
                ? 'Вона доступна у вашому профілі у розділі збережене'
                : 'Вона буде доступна у вашому профілі у розділі збережене'}
            </p>

            <Button
              variant="primary"
              size="large"
              className={css.saveButton}
              onClick={handleClick}
              disabled={isButtonDisabled}
            >
              {story &&
                isAuthenticated &&
                user &&
                user.savedArticles?.includes(story._id)
                ? 'Видалити'
                : 'Зберегти'}
            </Button>
          </div>
        </div>
      </div>

      {isModalOpen && <AuthNavModal onClose={() => setIsModalOpen(false)} />}
    </section>
  );
}