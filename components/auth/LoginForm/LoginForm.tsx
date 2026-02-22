'use client';

import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useId, useState } from 'react';
import css from './LoginForm.module.css';
import Button from '../../Button/Button';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api/api';
import { useAuthStore } from '@/lib/store/authStore';

interface LoginFormValues {
  email: string;
  password: string;
}

const initialValues: LoginFormValues = {
  email: '',
  password: '',
};

const LoginFormSchema = Yup.object().shape({
  email: Yup.string()
    .email('Не валідний емейл')
    .max(64, 'Значення задовге')
    .required('Поле обовʼязкове'),
  password: Yup.string()
    .min(8, 'Мінімум 8 символів')
    .max(128, 'Значення задовге')
    .required('Поле обовʼязкове'),
});

function LoginForm() {
  const [error, setError] = useState('');
  const fieldId = useId();
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (
    values: LoginFormValues,
    actions: FormikHelpers<LoginFormValues>
  ) => {
    try {
      const res = await login(values);
      console.log(res);

      if (res) {
        setUser(res);
        actions.resetForm();
        router.push('/');
      } else {
        setError('Invalid email or password');
      }
    } catch {
      //тост про помилку, axios error
      setError('Invalid email or password');
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={LoginFormSchema}
      onSubmit={handleSubmit}
      validateOnBlur
      validateOnChange
    >
      {({ errors, touched, isSubmitting }) => {
        const emailError = touched.email && errors.email;
        const passwordError = touched.password && errors.password;
        return (
          <Form className={css.form}>
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
              {isSubmitting ? 'Вхід...' : 'Увійти'}
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

export default LoginForm;
