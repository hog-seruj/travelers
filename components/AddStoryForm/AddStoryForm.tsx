'use client';

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useEffect, useId, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button/Button';

// додаємо updateStory/getStory тип,
// але createStory залишається як було.
import {
    createStory,
    updateStory,
    type StoryResponse,
} from '@/lib/api/api';

import css from './AddStoryForm.module.css';

interface AddStoryFormValues {
    img: File | null;
    title: string;
    category: string;
    article: string;
}

// додаємо опціональні props для edit-mode.
// Якщо їх не передали — це create-mode і поведінка як раніше.
interface AddStoryFormProps {
    initialData?: StoryResponse | null;
    storyId?: string;
}

// створюємо initialValues для Formik.
// - create-mode: порожні
// - edit-mode: підставляємо title/article/categoryId
const buildInitialValues = (
    initialData?: StoryResponse | null,
    isEditMode?: boolean
): AddStoryFormValues => ({
    img: null,
    title: initialData?.title ?? '',
    // важливо! бекенд чекає category як ObjectId.
    // У edit-mode ставимо category._id, щоб PATCH працював коректно.
    // У create-mode лишаємо як було (порожнє, поки користувач не вибере).
    category: isEditMode ? initialData?.category?._id ?? '' : '',
    article: initialData?.article ?? '',
});

// валідація:
// - create-mode: img обов'язкове (як було)
// - edit-mode: img не обов'язкове (бо вже є картинка на сервері)
const buildValidationSchema = (isEditMode: boolean) =>
    Yup.object({
        img: isEditMode
            ? Yup.mixed<File>().nullable()
            : Yup.mixed<File>().required('Поле обовʼязкове'),
        title: Yup.string().required('Поле обовʼязкове'),
        category: Yup.string().required('Поле обовʼязкове'),
        article: Yup.string().required('Поле обовʼязкове'),
    });

export default function AddStoryForm({
    initialData,
    storyId,
}: AddStoryFormProps = {}) {
    const fieldId = useId();
    const router = useRouter();

    // edit-mode визначаємо тільки по storyId (EditStoryPage його передає).
    const isEditMode = Boolean(storyId);


    const initialValues = useMemo(
        () => buildInitialValues(initialData, isEditMode),
        [initialData, isEditMode]
    );

    // preview у edit-mode має показати вже існуюче фото з бекенда.
    const [preview, setPreview] = useState<string>(initialData?.img ?? '');
    const [isErrorOpen, setIsErrorOpen] = useState(false);

    // коли initialData прийшла асинхронно — оновлюємо preview.
    useEffect(() => {
        if (isEditMode) setPreview(initialData?.img ?? '');
    }, [isEditMode, initialData?.img]);

    const handleSubmit = async (
        values: AddStoryFormValues,
        actions: FormikHelpers<AddStoryFormValues>
    ) => {
        try {
            const formData = new FormData();

            // якщо файл не вибрали — у edit-mode ми НЕ шлемо img,
            // щоб бекенд не перезатирав поле порожнім.
            if (values.img) formData.append('img', values.img);

            formData.append('title', values.title);
            formData.append('category', values.category);
            formData.append('article', values.article);

            // ключова логіка — create vs edit.
            // create-mode працює як було, edit-mode робить PATCH.
            if (isEditMode && storyId) {
                await updateStory(storyId, formData);
                router.push(`/stories/${storyId}`);
            } else {
                const res = await createStory(formData);
                router.push(`/stories/${res._id}`);
            }

            actions.resetForm();
            setPreview('');
        } catch {
            setIsErrorOpen(true);
        } finally {
            actions.setSubmitting(false);
        }
    };

    return (
        <>
            <Formik
                initialValues={initialValues}
                validationSchema={buildValidationSchema(isEditMode)}
                onSubmit={handleSubmit}
                validateOnBlur
                validateOnChange
                validateOnMount

                // критично для edit-mode.
                // Дозволяє Formik підхопити initialValues після того, як прийде initialData.
                enableReinitialize
            >
                {({ isSubmitting, isValid, dirty, setFieldValue, values }) => {
                    // кнопка Save має бути активна в edit-mode навіть якщо файл не обирали,
                    // але preview (картинка з бекенда) вже є.
                    const hasImage = values.img !== null || Boolean(preview);

                    const isSaveDisabled =
                        isSubmitting || !isValid || !dirty || !hasImage;

                    return (
                        <Form className={css.form} noValidate>
                            <div className={css.field}>
                                <label htmlFor={`${fieldId}-img`} className={css.label}>
                                    Обкладинка статті*
                                </label>

                                <div className={css.preview}>
                                    {preview ? (
                                        <img
                                            src={preview}
                                            alt="preview"
                                            className={css.previewImage}
                                        />
                                    ) : (
                                        <div className={css.placeholder}>Обкладинка</div>
                                    )}
                                </div>

                                <input
                                    id={`${fieldId}-img`}
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    className={css.file}
                                    disabled={isSubmitting}
                                    onChange={(e) => {
                                        const file = e.currentTarget.files?.[0] ?? null;
                                        setFieldValue('img', file);

                                        // якщо файл вибрали — показуємо його.
                                        // Якщо очистили — у edit-mode повертаємо старе фото з бекенда.
                                        setPreview(
                                            file
                                                ? URL.createObjectURL(file)
                                                : isEditMode
                                                    ? initialData?.img ?? ''
                                                    : ''
                                        );
                                    }}
                                />

                                <ErrorMessage
                                    name="img"
                                    component="span"
                                    className={css.error}
                                />
                            </div>

                            <div className={css.field}>
                                <label htmlFor={`${fieldId}-title`} className={css.label}>
                                    Заголовок*
                                </label>
                                <Field
                                    id={`${fieldId}-title`}
                                    name="title"
                                    className={css.input}
                                    disabled={isSubmitting}
                                />
                                <ErrorMessage
                                    name="title"
                                    component="span"
                                    className={css.error}
                                />
                            </div>

                            <div className={css.field}>
                                <label htmlFor={`${fieldId}-category`} className={css.label}>
                                    Категорія*
                                </label>

                                <Field
                                    as="select"
                                    id={`${fieldId}-category`}
                                    name="category"
                                    className={css.select}
                                    disabled={isSubmitting}
                                >
                                    <option value="" disabled>
                                        Обери категорію
                                    </option>


                                    {isEditMode && initialData?.category?._id && (
                                        <option value={initialData.category._id}>
                                            {initialData.category.name}
                                        </option>
                                    )}


                                    <option value="travel">Travel</option>
                                    <option value="city">City</option>
                                    <option value="nature">Nature</option>
                                    <option value="food">Food</option>
                                    <option value="other">Other</option>
                                </Field>

                                <ErrorMessage
                                    name="category"
                                    component="span"
                                    className={css.error}
                                />
                            </div>

                            <div className={css.field}>
                                <label htmlFor={`${fieldId}-article`} className={css.label}>
                                    Текст історії*
                                </label>
                                <Field
                                    as="textarea"
                                    id={`${fieldId}-article`}
                                    name="article"
                                    rows={8}
                                    className={css.textarea}
                                    disabled={isSubmitting}
                                />
                                <ErrorMessage
                                    name="article"
                                    component="span"
                                    className={css.error}
                                />
                            </div>

                            <div className={css.actions}>
                                <Button type="submit" variant="primary" disabled={isSaveDisabled}>
                                    {isSubmitting ? 'Збереження...' : 'Зберегти'}
                                </Button>

                                <Button
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={() => router.back()}
                                >
                                    Відмінити
                                </Button>

                                {isSubmitting && (
                                    <span className={css.loader}>Loading...</span>
                                )}
                            </div>
                        </Form>
                    );
                }}
            </Formik>

            {isErrorOpen && (
                <div
                    className={css.modalOverlay}
                    onClick={() => setIsErrorOpen(false)}
                >
                    <div className={css.modal} onClick={(e) => e.stopPropagation()}>
                        <h2 className={css.modalTitle}>Помилка збереження</h2>
                        <p className={css.modalText}>
                            Не вдалося зберегти історію. Спробуй ще раз.
                        </p>
                        <button
                            type="button"
                            className={css.modalButton}
                            onClick={() => setIsErrorOpen(false)}
                        >
                            Закрити
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}