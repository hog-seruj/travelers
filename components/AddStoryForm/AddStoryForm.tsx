'use client';

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useId, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button/Button';
import { createStory } from '@/lib/api/api';
import css from './AddStoryForm.module.css';

interface AddStoryFormValues {
img: File | null;
title: string;
category: string;
article: string;
}

const initialValues: AddStoryFormValues = {
img: null,
title: '',
category: '',
article: '',
};

const validationSchema = Yup.object({
img: Yup.mixed<File>().required('Поле обовʼязкове'),
title: Yup.string().required('Поле обовʼязкове'),
category: Yup.string().required('Поле обовʼязкове'),
article: Yup.string().required('Поле обовʼязкове'),
});

export default function AddStoryForm() {
const fieldId = useId();
const router = useRouter();

const [preview, setPreview] = useState<string>('');
const [isErrorOpen, setIsErrorOpen] = useState(false);

const handleSubmit = async (
values: AddStoryFormValues,
actions: FormikHelpers<AddStoryFormValues>
) => {
try {
const formData = new FormData();
if (values.img) formData.append('img', values.img);
formData.append('title', values.title);
formData.append('category', values.category);
formData.append('article', values.article);

const res = await createStory(formData);

router.push(`/stories/${res._id}`);
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
validationSchema={validationSchema}
onSubmit={handleSubmit}
validateOnBlur
validateOnChange
validateOnMount
>
{({ isSubmitting, isValid, dirty, setFieldValue, values }) => {
const isSaveDisabled =
isSubmitting || !isValid || !dirty || !values.img;

return (
<Form className={css.form} noValidate>
<div className={css.field}>
<label htmlFor={`${fieldId}-img`} className={css.label}>
Обкладинка статті*
</label>

<div className={css.preview}>
{preview ? (
<img src={preview} alt="preview" className={css.previewImage} />
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
setPreview(file ? URL.createObjectURL(file) : '');
}}
/>

<ErrorMessage name="img" component="span" className={css.error} />
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
<ErrorMessage name="title" component="span" className={css.error} />
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
<option value="travel">Travel</option>
<option value="city">City</option>
<option value="nature">Nature</option>
<option value="food">Food</option>
<option value="other">Other</option>
</Field>
<ErrorMessage name="category" component="span" className={css.error} />
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
<ErrorMessage name="article" component="span" className={css.error} />
</div>

<div className={css.actions}>
<Button
type="submit"
variant="primary"
disabled={isSaveDisabled}
>
{isSubmitting ? 'Збереження...' : 'Зберегти'}
</Button>

<Button
type="button"

disabled={isSubmitting}
onClick={() => router.back()}
>
Відмінити
</Button>

{isSubmitting && <span className={css.loader}>Loading...</span>}
</div>
</Form>
);
}}
</Formik>

{isErrorOpen && (
<div className={css.modalOverlay} onClick={() => setIsErrorOpen(false)}>
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