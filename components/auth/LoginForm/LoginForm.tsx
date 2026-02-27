'use client';

import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useId, useState } from 'react';
import Button from '../../Button/Button';
import css from './LoginForm.module.css';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { toast } from 'sonner';

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
  const [showPassword, setShowPassword] = useState(false);
  const fieldId = useId();
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (
    values: LoginFormValues,
    actions: FormikHelpers<LoginFormValues>
  ) => {
    try {
      const res = await login(values);

      if (!res) {
        toast.error('Невірна електронна пошта або пароль');
        return;
      }

      setUser(res);
      actions.resetForm();

      router.push('/?toast=login_success');
    } catch {
      toast.error('Невірна електронна пошта або пароль');
    } finally {
      actions.setSubmitting(false);
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
              {isSubmitting ? 'Вхід...' : 'Увійти'}
            </Button>
          </Form>
        );
      }}
    </Formik>
  );
}

export default LoginForm;
