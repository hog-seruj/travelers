'use client';
/* eslint-disable @next/next/no-img-element */

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import Button from '@/components/Button/Button';
import Loader from '@/components/Loader/Loader';
import { createStory, updateStory } from '@/lib/api/api';
import { getStory, getCategories } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { Category, Story } from '@/types/story';

import css from './AddStoryForm.module.css';
import CategorySelect from '../CategorySelect/CategorySelect';
import { toast } from 'sonner';

interface AddStoryFormValues {
    img: File | null;
    title: string;
    category: string;
    article: string;
}

interface Props {
    storyId?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

function isCategory(value: unknown): value is Category {
    return (
        isRecord(value) &&
        typeof value._id === 'string' &&
        typeof value.name === 'string'
    );
}

function isCategoryArray(value: unknown): value is Category[] {
    return Array.isArray(value) && value.every(isCategory);
}

function extractCategories(value: unknown): Category[] {
    if (isCategoryArray(value)) return value;

    if (isRecord(value) && isCategoryArray(value.data)) return value.data;

    if (isRecord(value) && isCategoryArray(value.categories)) {
        return value.categories;
    }

    return [];
}

export default function AddStoryForm({ storyId }: Props) {
    const router = useRouter();
    const queryClient = useQueryClient();

    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isOwnerChecked, setIsOwnerChecked] = useState(!storyId);

    const articleRef = useRef<HTMLTextAreaElement | null>(null);

    const autoResizeArticle = () => {
        const el = articleRef.current;
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = `${el.scrollHeight}px`;
    };

    const {
        data: categoriesRaw,
        isLoading: categoriesLoading,
        isError: categoriesError,
    } = useQuery<unknown>({
        queryKey: ['categories'],
        queryFn: getCategories,
    });

    const categoriesList = extractCategories(categoriesRaw);

    const {
        data: story,
        isLoading: storyLoading,
        isError: storyError,
    } = useQuery<Story>({
        queryKey: ['story', storyId],
        queryFn: () => getStory(storyId!),
        enabled: Boolean(storyId),
    });

    useEffect(() => {
        if (story?.img) {
            setPreviewUrl(story.img);
        }
    }, [story]);

    useEffect(() => {
        if (!storyId) {
            setIsOwnerChecked(true);
            return;
        }

        if (storyLoading) return;

        if (storyError) {
            setIsOwnerChecked(true);
            return;
        }

        if (!story) return;

        if (!isAuthenticated || !user?._id) return;

        if (story.ownerId._id !== user._id) {
            toast.error('Ви не можете редагувати чужу історію');
            router.replace('/stories');
            return;
        }

        setIsOwnerChecked(true);
    }, [storyId, story, storyLoading, storyError, user?._id, isAuthenticated, router]);

    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const initialValues: AddStoryFormValues = {
        img: null,
        title: story?.title || '',
        category: story?.category?._id || '',
        article: story?.article || '',
    };

    const validationSchema = Yup.object().shape({
        img: storyId
            ? Yup.mixed().nullable()
            : Yup.mixed().required('Обкладинка обов’язкова'),
        title: Yup.string().required('Заголовок обов’язковий'),
        category: Yup.string().required('Категорія обов’язкова'),
        article: Yup.string().required('Текст обов’язковий'),
    });

    const handleCancel = () => {
        router.back();
    };

    const handleSubmit = async (
        values: AddStoryFormValues,
        { setSubmitting }: FormikHelpers<AddStoryFormValues>
    ) => {
        const formData = new FormData();

        if (values.img) {
            formData.append('storyImage', values.img);
        }

        formData.append('title', values.title);
        formData.append('category', values.category);
        formData.append('article', values.article);

        try {
            const result = storyId
                ? await updateStory(storyId, formData)
                : await createStory(formData);

            await queryClient.invalidateQueries();

            toast.success(
                storyId ? 'Історію успішно оновлено' : 'Історію успішно створено'
            );

            router.push(`/stories/${result._id}`);
            router.refresh();
        } catch (err) {
            console.error(err);
            toast.error('Сталася помилка, спробуйте пізніше');
        } finally {
            setSubmitting(false);
        }
    };

    if (categoriesLoading || (storyId && storyLoading)) {
        return <Loader />;
    }

    if (storyId && !isOwnerChecked) {
        return <Loader />;
    }

    if (categoriesError || storyError) {
        return <div>Не вдалося завантажити дані</div>;
    }

    return (
        <div className={css.wrapper}>
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                validateOnChange
                validateOnBlur
                validateOnMount={false}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, isValid, setFieldValue }) => (
                    <Form className={css.form}>
                        <div className={css.fieldGroup}>
                            <label htmlFor="img">Обкладинка статті</label>

                            {previewUrl ? (
                                <img src={previewUrl} alt="preview" className={css.preview} />
                            ) : (
                                <div className={css.placeholder}>No image</div>
                            )}

                            <label htmlFor="img" className={css.uploadBtn}>
                                Завантажити фото
                            </label>

                            <input
                                id="img"
                                name="img"
                                type="file"
                                accept="image/*"
                                className={css.fileInput}
                                onChange={(e) => {
                                    const file =
                                        e.currentTarget.files && e.currentTarget.files[0]
                                            ? e.currentTarget.files[0]
                                            : null;

                                    setFieldValue('img', file);

                                    if (previewUrl && previewUrl.startsWith('blob:')) {
                                        URL.revokeObjectURL(previewUrl);
                                    }

                                    if (file) {
                                        const url = URL.createObjectURL(file);
                                        setPreviewUrl(url);
                                    } else if (story?.img) {
                                        setPreviewUrl(story.img);
                                    } else {
                                        setPreviewUrl(null);
                                    }
                                }}
                            />

                            <ErrorMessage name="img" component="div" className={css.error} />
                        </div>

                        <div className={css.fieldGroup}>
                            <label htmlFor="title">Заголовок</label>
                            <Field
                                id="title"
                                name="title"
                                placeholder="Введіть заголовок історії"
                            />
                            <ErrorMessage name="title" component="div" className={css.error} />
                        </div>

                        <div className={css.fieldGroup}>
                            <label>Категорія</label>

                            <div className={css.selectWrapper}>
                                <CategorySelect
                                    name="category"
                                    placeholder="Категорія"
                                    options={categoriesList.map((c) => ({
                                        value: c._id,
                                        label: c.name,
                                    }))}
                                />
                            </div>

                            <ErrorMessage
                                name="category"
                                component="div"
                                className={css.error}
                            />
                        </div>

                        <div className={css.fieldGroup}>
                            <label htmlFor="article">Текст історії</label>

                            <Field
                                as="textarea"
                                id="article"
                                name="article"
                                rows={1}
                                placeholder="Ваша історія тут"
                                innerRef={(node: HTMLTextAreaElement | null) => {
                                    articleRef.current = node;
                                    requestAnimationFrame(autoResizeArticle);
                                }}
                                onInput={() => {
                                    autoResizeArticle();
                                }}
                            />

                            <ErrorMessage
                                name="article"
                                component="div"
                                className={css.error}
                            />
                        </div>

                        <div className={css.buttonGroup}>
                            <Button
                                type="submit"
                                disabled={!isValid || isSubmitting}
                                variant="primary"
                            >
                                Зберегти
                            </Button>

                            <Button type="button" variant="" onClick={handleCancel}>
                                Відмінити
                            </Button>
                        </div>

                        {isSubmitting && <Loader />}
                    </Form>
                )}
            </Formik>
        </div>
    );
}