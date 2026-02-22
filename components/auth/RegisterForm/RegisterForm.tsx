'use client';

import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useId, useState } from 'react';
import css from './RegisterForm.module.css';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { register } from '@/lib/api/api';

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
}

const initialValues: RegisterFormValues = {
  name: '',
  email: '',
  password: '',
};

const RegisterFormSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Мінімум 2 символи')
    .max(32, 'Значення задовге')
    .required('Поле обовʼязкове'),
  email: Yup.string()
    .email('Invalid email format')
    .max(64, 'Значення задовге')
    .required('Поле обовʼязкове'),
  password: Yup.string()
    .min(8, 'Мінімум 8 символів')
    .max(128, 'Значення задовге')
    .required('Поле обовʼязкове'),
});

function RegisterForm() {
  const [error, setError] = useState('');
  const fieldId = useId();
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (
    values: RegisterFormValues,
    actions: FormikHelpers<RegisterFormValues>
  ) => {
    try {
      const res = await register(values);

      if (res) {
        setUser(res);
        actions.resetForm();
        router.push('/');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      //тост про помилку
      console.log(err);
      setError('Invalid email or password');
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={RegisterFormSchema}
      onSubmit={handleSubmit}
      validateOnBlur
      validateOnChange
    >
      {({ errors, touched, isSubmitting }) => {
        const nameError = touched.name && errors.name;
        const emailError = touched.email && errors.email;
        const passwordError = touched.password && errors.password;
        return (
          <Form className={css.form}>
            <div className={css.field}>
              <label className={css.label} htmlFor={`${fieldId}-name`}>
                Імʼя та Прізвище*
              </label>
              <Field
                className={`${css.input} ${nameError ? css.inputError : ''}`}
                id={`${fieldId}-name`}
                type="text"
                name="name"
              />
              <ErrorMessage
                className={css.error}
                name="name"
                component="span"
              />
            </div>
            <div className={css.field}>
              <label className={css.label} htmlFor={`${fieldId}-email`}>
                Пошта*
              </label>
              <Field
                className={`${css.input} ${emailError ? css.inputError : ''}`}
                id={`${fieldId}-email`}
                type="email"
                name="email"
              />
              <ErrorMessage
                className={css.error}
                name="email"
                component="span"
              />
            </div>
            <div className={css.field}>
              <label className={css.label} htmlFor={`${fieldId}-password`}>
                Пароль*
              </label>
              <Field
                className={`${css.input} ${passwordError ? css.inputError : ''}`}
                id={`${fieldId}-password`}
                type="password"
                name="password"
              />
              <ErrorMessage
                className={css.error}
                name="password"
                component="span"
              />
            </div>
            <button
              className={css.submit}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Реєстрація...' : 'Зареєструватись'}
            </button>
            {/* <Button
              type="submit"
              variant="primary"
              size="large"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Вхід...' : 'Увійти'}
            </Button> */}
            <p className={css.error}>{error}</p>
          </Form>
        );
      }}
    </Formik>
  );
}

export default RegisterForm;
