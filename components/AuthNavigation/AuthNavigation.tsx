'use client';

import Link from 'next/link';
import css from './AuthNavigation.module.css';

type AuthNavigationProps = {
  variant?: 'desktop' | 'modal';
  onCloseAction?: () => void;
};

export default function AuthNavigation({
  variant = 'desktop',
  onCloseAction,
}: AuthNavigationProps) {
  const handleClick = () => {
    if (onCloseAction) onCloseAction();
  };

  if (variant === 'modal') {
    return (
      <div className={css.modalAuth}>
        <Link
          href="/auth/login"
          className={css.modalLogin}
          onClick={handleClick}
        >
          Вхід
        </Link>
        <Link
          href="/auth/register"
          className={css.modalRegister}
          onClick={handleClick}
        >
          Реєстрація
        </Link>
      </div>
    );
  }

  // Desktop variant
  return (
    <div className={css.desktopAuth}>
      <Link href="/auth/login" className={css.loginButton}>
        Вхід
      </Link>
      <Link href="/auth/register" className={css.registerButton}>
        Реєстрація
      </Link>
    </div>
  );
}
