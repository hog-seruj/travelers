'use client';

import { Story } from '@/types/story';
import Image from 'next/image';
import Button from '../Button/Button';
import css from './TravelersStoriesItem.module.css';
import { useAuthStore } from '@/lib/store/authStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addStoryToSaved } from '@/lib/api/clientApi';
import toast from 'react-hot-toast';

interface TravelersStoriesItemProps {
  story: Story;
}

function TravelersStoriesItem({ story }: TravelersStoriesItemProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addStoryToSaved,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          'popularStories',
          { page: 1, perPage: 4, sort: 'popular', category: null },
        ],
      });
      toast.success(`Story ${story.title} added to saved successfully`);
    },
    onError: (error) => {
      console.log('Error', error);
      toast.error('An error occurred');
    },
  });

  const handleClick = () => {
    if (!isAuthenticated) {
      console.log('Not authorized');
      return 'Not authorized';
      // відкривати модальне вікно AuthNavModal
    }

    console.log(user);

    if (isAuthenticated && user && user.savedArticles.includes(story._id)) {
      console.log('Історія вже збережена');
      // робимо запит delete на /stories/:storyId/saved
      console.log(story._id);
      console.log(user.savedArticles);
    } else {
      console.log('Історія ще не збережена');
      // робимо запит post на /stories/:storyId/save
      mutation.mutate(story._id);
      console.log(story._id);
      console.log(user?.savedArticles);
    }

    // додавання/видалення статті з збережених статей користувача
    // лоадер
    // кількість закладок збільшується/зменшується
    // кнопка змінює стилі
  };

  return (
    <li className={css.item}>
      <Image
        src={story.img}
        alt={story.title}
        width={335}
        height={223}
        className={css.image}
      />
      <div className={css.wrapper}>
        <div className={css.info}>
          <p className={css.category}>{story.category.name}</p>
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
          <Button onClick={() => handleClick()} className={css.buttonAdd}>
            <svg width="24" height="24">
              <use href="/sprite.svg#icon-bookmark"></use>
            </svg>
          </Button>
        </div>
      </div>
    </li>
  );
}

export default TravelersStoriesItem;
