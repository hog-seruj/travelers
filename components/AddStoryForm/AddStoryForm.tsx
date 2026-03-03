'use client';
/* eslint-disable @next/next/no-img-element */

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import Button from '@/components/Button/Button';
import { createStory, updateStory } from '@/lib/api/api';
import { getStory, getCategories } from '@/lib/api/clientApi';
import { Category, Story } from '@/types/story';

import css from './AddStoryForm.module.css';

interface AddStoryFormValues {
    img: File | null;
    title: string;
    category: string;
    article: string;
}

interface Props {
    storyId?: string;
}

export default function AddStoryForm({ storyId }: Props) {
    const router = useRouter();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [error, setError] = useState<boolean>(false);

    // ✅ тільки для візуалу (auto-resize textarea)
    const articleRef = useRef<HTMLTextAreaElement | null>(null);

    const autoResizeArticle = () => {
        const el = articleRef.current;
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = `${el.scrollHeight}px`;
    };

    const {
        data: categories,
        isLoading: categoriesLoading,
        isError: categoriesError,
    } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: getCategories,
    });

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
        img: storyId ? Yup.mixed().nullable() : Yup.mixed().required('Обкладинка обов’язкова'),
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
        setError(false);
        const formData = new FormData();

        if (values.img) {
            formData.append('storyImage', values.img);
        }
        formData.append('title', values.title);
        formData.append('category', values.category);
        formData.append('article', values.article);

        try {
            const result = storyId ? await updateStory(storyId, formData) : await createStory(formData);
            router.push(`/stories/${result._id}`);
        } catch (err) {
            console.error(err);
            setError(true);
        } finally {
            setSubmitting(false);
        }
    };

    if (categoriesLoading || (storyId && storyLoading)) {
        return <div>Loading...</div>;
    }

    if (categoriesError || storyError) {
        return <div>Не вдалося завантажити дані</div>;
    }

    return (
        <div className={css.wrapper}>
            {error && (
                <div className={css.errorModal}>
                    Помилка збереження
                    <button onClick={() => setError(false)}>OK</button>
                </div>
            )}

            <Formik enableReinitialize initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting, isValid, setFieldValue }) => (
                    <Form className={css.form}>
                        <div className={css.fieldGroup}>
                            <label htmlFor="img">Обкладинка статті</label>

                            {previewUrl ? <img src={previewUrl} alt="preview" className={css.preview} /> : <div className={css.placeholder}>No image</div>}

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
                                    const file = e.currentTarget.files && e.currentTarget.files[0] ? e.currentTarget.files[0] : null;

                                    setFieldValue('img', file);

                                    if (file) {
                                        const url = URL.createObjectURL(file);
                                        setPreviewUrl(url);
                                    }
                                }}
                            />

                            <ErrorMessage name="img" component="div" className={css.error} />
                        </div>

                        <div className={css.fieldGroup}>
                            <label htmlFor="title">Заголовок</label>
                            <Field id="title" name="title" placeholder="Введіть заголовок історії" />
                            <ErrorMessage name="title" component="div" className={css.error} />
                        </div>

                        <div className={css.fieldGroup}>
                            <label htmlFor="category">Категорія</label>

                            <div className={css.selectWrapper}>
                                <Field as="select" id="category" name="category">
                                    <option value="">Категорія</option>
                                    {categories?.map((c) => (
                                        <option key={c._id} value={c._id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </Field>

                                <svg className={css.selectIcon} width="16" height="16">
                                    <use href="/sprite.svg#icon-down" />
                                </svg>
                            </div>

                            <ErrorMessage name="category" component="div" className={css.error} />
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
                                    // ✅ підлаштувати висоту одразу при маунті/ре-рендері
                                    requestAnimationFrame(autoResizeArticle);
                                }}
                                onInput={() => {
                                    autoResizeArticle();
                                }}
                            />

                            <ErrorMessage name="article" component="div" className={css.error} />
                        </div>

                        <div className={css.buttonGroup}>
                            <Button type="submit" disabled={!isValid || isSubmitting} variant="primary">
                                Зберегти
                            </Button>
                            <Button type="button" variant="" onClick={handleCancel}>
                                Відмінити
                            </Button>
                        </div>

                        {isSubmitting && <div>Loading...</div>}
                    </Form>
                )}
            </Formik>
        </div>
    );
}