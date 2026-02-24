import { notFound } from 'next/navigation';
import AuthTabs from '@/components/auth/AuthTabs/AuthTabs';
import AuthHeading from '@/components/auth/AuthHeading/AuthHeading';
import RegisterForm from '@/components/auth/RegisterForm/RegisterForm';
import LoginForm from '@/components/auth/LoginForm/LoginForm';
import css from './AuthPage.module.css';
import Link from 'next/link';
import Image from 'next/image';

interface AuthPageProps {
  params: Promise<{ authType: string }>;
}

async function AuthPage({ params }: AuthPageProps) {
  const { authType } = await params;
  if (authType !== 'login' && authType !== 'register') {
    notFound();
  }
  const isRegister = authType === 'register';
  const isLogin = authType === 'login';
  const year = new Date().getFullYear();

  return (
    <div className={css.auth}>
      <header className={css.header}>
        <Link href="/" className={css.brand}>
          <Image
            src="/logo.svg"
            width={22}
            height={22}
            alt="logo"
            aria-hidden="true"
            className={css.logo}
          />
          <span className={css.logoText}>Подорожники</span>
        </Link>
      </header>
      <section className={css.wrap}>
        <AuthTabs isRegister={isRegister} isLogin={isLogin} />
        <AuthHeading
          title={isRegister ? 'Реєстрація' : 'Вхід'}
          subtitle={
            isRegister
              ? 'Раді вас бачити у спільноті мандрівників!'
              : 'Вітаємо знову у спільноті мандрівників!'
          }
        />
        {isRegister ? <RegisterForm /> : <LoginForm />}
      </section>
      <footer className={css.footer}>
        <p className={css.text}>&copy; {year} Подорожники</p>
      </footer>
    </div>
  );
}

export default AuthPage;
