'use client';

import Image from 'next/image';
import Button from '@/components/Button/Button';
import type { Story } from '@/types/story';
import css from './OwnStoryItem.module.css';

export default function OwnStoryItem({ story }: { story: Story }) {
  return (
    <article className={css.card}>
      <div className={css.imageWrap}>
        <Image
          src={story.img}
          alt={story.title}
          width={360}
          height={240}
          className={css.image}
        />
      </div>

      <h3 className={css.title}>{story.title}</h3>

      <Button
        size="small"
        variant="primary"
        href={`/stories/${story._id}/edit`}
        className={css.editBtn}
      >
        Редагувати
      </Button>
    </article>
  );
}