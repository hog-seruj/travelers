'use client';

import { Story } from '@/types/story';
import Image from 'next/image';
import Button from '../Button/Button';
import css from './TravelersStoriesItem.module.css';
import { useAuthStore } from '@/lib/store/authStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addStoryToSaved, removeStoryFromSaved } from '@/lib/api/clientApi';
import { toast } from 'sonner';
import { useState } from 'react';
import AuthNavModal from '../AuthNavModal/AuthNavModal';

const DEFAULT_AVATAR =
  'https://ac.goit.global/fullstack/react/default-avatar.jpg';

interface TravelersStoriesItemProps {
  story: Story;
  className?: string;
  variant?: 'saved' | 'own';
}

export default function TravelersStoriesItem({
  story,
  className,
  variant = 'saved',
}: TravelersStoriesItemProps) {
  const { isAuthenticated, user, updateUser } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const mutationAddStory = useMutation({
    mutationFn: addStoryToSaved,
    onSuccess: (data) => {
      updateUser({ savedArticles: data.savedArticles });
      queryClient.invalidateQueries({ queryKey: ['popularStories'] });
      queryClient.invalidateQueries({ queryKey: ['travelerOwnStories'] });
      queryClient.invalidateQueries({ queryKey: ['storiesPage'] });
      toast.success(`Історія "${story.title}" успішно додана до збережених!`);
    },
    onError: (error) => {
      console.error('Error adding to saved:', error);
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
      toast.success(`Історія "${story.title}" успішно видалена із збережених!`);
    },
    onError: (error) => {
      console.error('Error removing from saved:', error);
      toast.error('Виникла помилка, спробуйте ще раз');
    },
  });

  const handleClick = () => {
    if (!isAuthenticated) {
      setIsModalOpen(true);
      return;
    }
    if (user?.savedArticles?.includes(story._id)) {
      mutationRemoveStory.mutate(story._id);
    } else {
      mutationAddStory.mutate(story._id);
    }
  };

  const ownerIdString =
    typeof story.ownerId === 'string'
      ? story.ownerId
      : (story.ownerId as { _id?: string })?._id || '';

  const isMyStory = Boolean(user?._id && user._id === ownerIdString);

  const showSaveButton = variant === 'saved';
  const showEditButton = variant === 'own';

  const isSaved = user?.savedArticles?.includes(story._id) ?? false;
  const classes = isSaved
    ? `${css.buttonAdd} ${css.buttonAddSaved}`
    : css.buttonAdd;
  const isButtonDisabled =
    mutationAddStory.isPending || mutationRemoveStory.isPending;

  const authorAvatar = isMyStory
    ? user?.avatarUrl && user.avatarUrl.trim() !== ''
      ? user.avatarUrl.trim()
      : DEFAULT_AVATAR
    : typeof story.ownerId === 'object' &&
        story.ownerId !== null &&
        'avatarUrl' in story.ownerId &&
        (story.ownerId as { avatarUrl?: string }).avatarUrl
      ? ((story.ownerId as { avatarUrl?: string }).avatarUrl as string).trim()
      : DEFAULT_AVATAR;

  const authorName = isMyStory
    ? user?.name && user.name.trim() !== ''
      ? user.name.trim()
      : 'Автор'
    : typeof story.ownerId === 'object' &&
        story.ownerId !== null &&
        'name' in story.ownerId &&
        (story.ownerId as { name?: string }).name
      ? ((story.ownerId as { name?: string }).name as string).trim()
      : 'Автор';

  return (
    <>
      <li className={`${css.item} ${className || ''}`}>
        <Image
          src={story.img}
          alt={story.title}
          width={335}
          height={223}
          className={css.image}
        />
        <div className={css.wrapper}>
          <div className={css.info}>
            <p className={css.category}>
              {story?.category?.name || 'Про все на світі'}
            </p>
            <h3 className={css.title}>{story.title}</h3>
            <p className={css.article}>{story.article}</p>
          </div>
          <div className={css.publication}>
            <Image
              src={authorAvatar}
              alt={authorName}
              width={48}
              height={48}
              className={css.photo}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = DEFAULT_AVATAR;
              }}
            />
            <div>
              <p className={css.name}>{authorName}</p>
              <div className={css.dateSaved}>
                <p className={css.date}>{story.date}</p>
                <div className={css.point}></div>
                <p className={css.count}>{story.favoriteCount}</p>
                <svg width="16" height="16">
                  <use href="/sprite.svg#icon-bookmark"></use>
                </svg>
              </div>
            </div>
          </div>
          <div className={css.buttons}>
            <Button
              variant=""
              size="large"
              href={`/stories/${story._id}`}
              className={css.buttonView}
            >
              Переглянути статтю
            </Button>

            {showSaveButton && (
              <button
                onClick={handleClick}
                className={classes}
                disabled={isButtonDisabled}
                aria-label={
                  isSaved ? 'Видалити зі збережених' : 'Зберегти історію'
                }
              >
                <svg width="24" height="24">
                  <use href="/sprite.svg#icon-bookmark"></use>
                </svg>
              </button>
            )}

            {showEditButton && (
              <Button
                variant=""
                size="large"
                href={`/stories/${story._id}/edit`}
                className={css.buttonEdit}
                aria-label="Редагувати історію"
              >
                <svg width="24" height="24">
                  <use href="/sprite.svg#icon-edit"></use>
                </svg>
              </Button>
            )}
          </div>
        </div>
      </li>
      {isModalOpen && <AuthNavModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}
