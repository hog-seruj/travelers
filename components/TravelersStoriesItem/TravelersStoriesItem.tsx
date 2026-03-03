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

interface TravelersStoriesItemProps {
  story: Story;
  className?: string;
  editButton?: boolean;
  isAuthenticated?: boolean;
  isSaved?: boolean;
  isOwnStory?: boolean;
  onNeedAuth?: () => void;
}

function TravelersStoriesItem({ story, className }: TravelersStoriesItemProps) {
  const { isAuthenticated, user, updateUser } = useAuthStore();
  // const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  // const user = useAuthStore((state) => state.user);
  // const updateUser = useAuthStore((state) => state.updateUser);
  console.log(user);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const mutationAddStory = useMutation({
    mutationFn: addStoryToSaved,
    onSuccess: (data) => {
      console.log(data.savedArticles);
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
      console.log(story._id);
      // console.log(user?.savedArticles); показує не оновлені дані
      console.log(useAuthStore.getState().user?.savedArticles);
      console.log(
        useAuthStore.getState().user?.savedArticles.includes(story._id)
      );
      toast.success(`Історія "${story.title}" успішно додана до збережених!`);
    },
    onError: (error) => {
      console.log('Error', error);
      toast.error('Виникла помилка, спробуйте ще раз');
    },
  });

  const mutationRemoveStory = useMutation({
    mutationFn: removeStoryFromSaved,
    onSuccess: (data) => {
      console.log(data.stories);
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
      console.log(story._id);
      // console.log(user?.savedArticles); показує не оновлені дані
      console.log(useAuthStore.getState().user?.savedArticles);
      console.log(
        useAuthStore.getState().user?.savedArticles.includes(story._id)
      );
      toast.success(`Істоія "${story.title}" успішно видалена із збережених!`);
    },
    onError: (error) => {
      console.log('Error', error);
      toast.error('Виникла помилка, спробуйте ще раз');
    },
  });

  // логіка зміни стилів кнопки
  let classesArray: string[] = [];
  if (isAuthenticated && user && user.savedArticles?.includes(story._id)) {
    classesArray = [css.buttonAdd, css.buttonAddSaved];
    // console.log(classesArray);
  } else {
    classesArray = [css.buttonAdd];
    // console.log(classesArray);
  }
  const classes = classesArray.join(' ');
  //

  // loader
  let isButtonDisabled = false;
  if (mutationAddStory.isPending || mutationRemoveStory.isPending) {
    isButtonDisabled = true;
  }
  //

  // modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  //

  const handleClick = () => {
    if (!isAuthenticated) {
      // console.log('Not authorized');
      // відкриваємо модальне вікно AuthNavModal
      openModal();
      return;
    }

    console.log(user);

    if (isAuthenticated && user && user.savedArticles?.includes(story._id)) {
      console.log('Історія вже збережена');
      // робимо запит delete на /stories/:storyId/saved
      mutationRemoveStory.mutate(story._id);
    } else {
      console.log('Історія ще не збережена');
      // робимо запит post на /stories/:storyId/save
      mutationAddStory.mutate(story._id);
    }
  };

  // logic for editStory button
  const isMyStory = isAuthenticated && user && user._id === story.ownerId._id;
  console.log(isMyStory);
  //

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
              src={story.ownerId.avatarUrl}
              alt={story.ownerId.name}
              width={48}
              height={48}
              className={css.photo}
            />
            <div>
              <p className={css.name}>{story.ownerId.name}</p>
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
            {!isMyStory && (
              <button
                onClick={() => handleClick()}
                className={classes}
                disabled={isButtonDisabled}
              >
                <svg width="24" height="24">
                  <use href="/sprite.svg#icon-bookmark"></use>
                </svg>
              </button>
            )}
            {/* edit button */}
            {isMyStory && (
              <Button
                variant=""
                size="large"
                href={`/stories/${story._id}/edit`}
                className={css.buttonEdit}
              >
                <svg width="24" height="24">
                  <use href="/sprite.svg#icon-edit"></use>
                </svg>
              </Button>
            )}
          </div>
        </div>
      </li>
      {isModalOpen && <AuthNavModal onClose={closeModal} />}
    </>
  );
}

export default TravelersStoriesItem;
