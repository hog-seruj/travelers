'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import AddStoryForm from '@/components/AddStoryForm/AddStoryForm';
import { getStory, type StoryResponse } from '@/lib/api/api';

// перевикористовуємо стилі CreateStoryPage, щоб сторінка була аналогічна
import css from '../../create/CreateStoryPage.module.css';

export default function EditStoryPage() {
    const { storyId } = useParams<{ storyId: string }>();

    const [story, setStory] = useState<StoryResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                setIsLoading(true);
                setIsError(false);

                const data = await getStory(storyId);

                if (mounted) setStory(data);
            } catch {
                if (mounted) setIsError(true);
            } finally {
                if (mounted) setIsLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [storyId]);

    return (
        <main className={css.main}>
            <div className={css.container}>
                <h1 className={css.title}>Редагувати історію</h1>

                {isLoading && <p>Loading...</p>}

                {!isLoading && isError && (
                    <p>Не вдалося завантажити історію для редагування.</p>
                )}

                {!isLoading && !isError && story && (
                    // за ТЗ EditStoryPage використовує AddStoryForm,
                    // але ми передаємо initialData + storyId, щоб:
                    // - заповнити поля
                    // - показати існуючу картинку
                    // - при submit викликати PATCH
                    <AddStoryForm storyId={storyId} initialData={story} />
                )}
            </div>
        </main>
    );
}