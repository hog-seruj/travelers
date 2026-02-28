'use client';

import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useId, useState } from 'react';
import Button from '@/components/Button/Button';
import css from './RegisterForm.module.css';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { register } from '@/lib/api/clientApi';
import { toast } from 'sonner';
import axios from 'axios';

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
    .email('Не валідний формат')
    .max(64, 'Значення задовге')
    .required('Поле обовʼязкове'),
  password: Yup.string()
    .min(8, 'Мінімум 8 символів')
    .max(128, 'Значення задовге')
    .required('Поле обовʼязкове'),
});

function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const fieldId = useId();
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (
    values: RegisterFormValues,
    actions: FormikHelpers<RegisterFormValues>
  ) => {
    try {
      const res = await register(values);

      if (!res) {
        toast.error('Не вдалося створити акаунт');
        return;
      }

      setUser(res);
      actions.resetForm();
      router.push('/?toast=register_success');
    } catch (err) {
      if (!axios.isAxiosError(err)) {
        toast.error('Щось пішло не так. Спробуйте ще раз.');
        return;
      }
      if (err.response?.status === 400) {
        toast.error('Користувач з таким email уже існує');
      } else {
        toast.error('Щось пішло не так. Спробуйте ще раз.');
      }
    } finally {
      actions.setSubmitting(false);
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
                placeholder="Ваше імʼя та прізвище"
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
                placeholder="hello@podorozhnyky.ua"
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
              <div className={css.passwordWrapper}>
                <Field
                  className={`${css.input} ${passwordError ? css.inputError : ''}`}
                  id={`${fieldId}-password`}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="********"
                />
                <button
                  type="button"
                  className={css.toggleBtn}
                  onClick={() => setShowPassword((prev) => !prev)}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <svg className={css.icon} width="20" height="20">
                    <use
                      href={`/sprite.svg#${showPassword ? 'icon-eye-off' : 'icon-eye'}`}
                    />
                  </svg>
                </button>
              </div>
              <ErrorMessage
                className={css.error}
                name="password"
                component="span"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="medium"
              disabled={isSubmitting}
              className={css.btn}
            >
              {isSubmitting ? 'Реєстрація...' : 'Зареєструватись'}
            </Button>
          </Form>
        );
      }}
    </Formik>
  );
}

export default RegisterForm;
