'use client';

import Link from 'next/link';
import css from './AuthTabs.module.css';

interface AuthTabsProps {
  isRegister: boolean;
  isLogin: boolean;
}

function AuthTabs({ isRegister, isLogin }: AuthTabsProps) {
  return (
    <div className={css.tabs}>
      <Link
        className={`${css.tab} ${isRegister ? css.active : ''}`}
        href="/auth/register"
      >
        Реєстрація
      </Link>

      <Link
        className={`${css.tab} ${isLogin ? css.active : ''}`}
        href="/auth/login"
      >
        Вхід
      </Link>
    </div>
  );
}

export default AuthTabs;
