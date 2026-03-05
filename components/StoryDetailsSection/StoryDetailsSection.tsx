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
      // console.log(data.savedArticles);
      updateUser({ savedArticles: data.savedArticles });
      queryClient.invalidateQueries({
        queryKey: ['popularStories'],
      });
      queryClient.invalidateQueries({
        queryKey: ['travelerOwnStories'],
      });
      queryClient.invalidateQueries({
        queryKey: ['storiesPage'],
      });
      // console.log(story?._id);
      // console.log(user?.savedArticles); показує не оновлені дані
      // console.log(useAuthStore.getState().user?.savedArticles);
      //  console.log(
      //    useAuthStore.getState().user?.savedArticles.includes(story?._id)
      //  );
      toast.success(`Історія "${story?.title}" успішно додана до збережених!`);
    },
    onError: () => {
      // console.log('Error', error);
      toast.error('Виникла помилка, спробуйте ще раз');
    },
  });

  const mutationRemoveStory = useMutation({
    mutationFn: removeStoryFromSaved,
    onSuccess: (data) => {
      // console.log(data.stories);
      updateUser({ savedArticles: data.stories });
      queryClient.invalidateQueries({
        queryKey: ['popularStories'],
      });
      queryClient.invalidateQueries({
        queryKey: ['travelerOwnStories'],
      });
      queryClient.invalidateQueries({
        queryKey: ['storiesPage'],
      });
      // console.log(story?._id);
      // console.log(user?.savedArticles); показує не оновлені дані
      // console.log(useAuthStore.getState().user?.savedArticles);
      // console.log(
      //   useAuthStore.getState().user?.savedArticles.includes(story?._id)
      // );
      toast.success(`Істоія "${story?.title}" успішно видалена із збережених!`);
    },
    onError: () => {
      // console.log('Error', error);
      toast.error('Виникла помилка, спробуйте ще раз');
    },
  });

  // loader
  let isButtonDisabled = false;
  if (mutationAddStory.isPending || mutationRemoveStory.isPending) {
    isButtonDisabled = true;
  }
  //

  const handleClick = () => {
    if (!isAuthenticated) {
      setIsModalOpen(true);
      return;
    }

    // console.log(user);

    if (
      story &&
      isAuthenticated &&
      user &&
      user.savedArticles?.includes(story._id)
    ) {
      // console.log('Історія вже збережена');
      // робимо запит delete на /stories/:storyId/saved
      mutationRemoveStory.mutate(story._id);
    } else {
      // console.log('Історія ще не збережена');
      // робимо запит post на /stories/:storyId/save
      mutationAddStory.mutate(storyId);
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
