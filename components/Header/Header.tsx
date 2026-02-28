'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import css from './Header.module.css';
import BurgerMenu from '../BurgerMenu/BurgerMenu';
import AuthNavigation from '../AuthNavigation/AuthNavigation';
import Button from '../Button/Button';
import UserMenu from '../UserMenu/UserMenu';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import { useAuthStore } from '@/lib/store/authStore';
import { logout } from '@/lib/api/clientApi';

export default function Header() {
  const [isBurgerOpen, setIsBurgerOpen] = useState<boolean>(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearIsAuthenticated);

  const pathname = usePathname();
  const router = useRouter();

  const userName = user?.name?.trim() || 'Мандрівник';

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuth();
      setIsLogoutModalOpen(false);
      router.push('/');
      router.refresh();
    }
  };

  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false);
  };

  useEffect(() => {
    if (!isBurgerOpen) return;
    const scrollY = window.scrollY;
    document.body.style.top = `-${scrollY}px`;
    document.body.classList.add('bodyLock');
    return () => {
      document.body.classList.remove('bodyLock');
      document.body.style.top = '';
      window.scrollTo(0, scrollY);
    };
  }, [isBurgerOpen]);

  useEffect(() => {
    const timer = setTimeout(() => setIsBurgerOpen(false), 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (!isBurgerOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsBurgerOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isBurgerOpen]);

  return (
    <>
      <header className={css.header}>
        <div className={`container ${css.container}`}>
          <Link href="/" aria-label="Home" className={css.logoLink}>
            <Image
              src="/logo.svg"
              width={22}
              height={22}
              alt="logo"
              aria-hidden="true"
              className={css.logoIcon}
            />
            <span className={css.logoText}>Подорожники</span>
          </Link>

          <nav aria-label="Main navigation" className={css.desktopNav}>
            <ul className={css.navigation}>
              <li>
                <Link href="/" className={css.navigationLink}>
                  Головна
                </Link>
              </li>
              <li>
                <Link href="/stories" className={css.navigationLink}>
                  Історії
                </Link>
              </li>
              <li>
                <Link href="/travellers" className={css.navigationLink}>
                  Мандрівники
                </Link>
              </li>
              {user && (
                <li>
                  <Link href="/profile" className={css.navigationLink}>
                    Мій Профіль
                  </Link>
                </li>
              )}
            </ul>

            {user && (
              <Button
                type="button"
                size="medium"
                className={css.desktopPublishButton}
                onClick={() => router.push('/stories/create')}
              >
                Опублікувати історію
              </Button>
            )}

            {user ? (
              <UserMenu
                userName={userName}
                onLogout={handleLogoutClick}
                variant="desktop"
              />
            ) : (
              <AuthNavigation variant="desktop" />
            )}
          </nav>

          <div className={css.tabletActions}>
            <Button
              type="button"
              size="medium"
              className={css.publishButton}
              onClick={() => router.push('/stories/create')}
            >
              Опублікувати історію
            </Button>

            <button
              type="button"
              className={css.burgerButton}
              onClick={() => setIsBurgerOpen(true)}
              aria-label="Open menu"
            >
              <svg className={css.burgerIcon} aria-hidden="true">
                <use href="/sprite.svg#icon-menu" />
              </svg>
            </button>
          </div>

          <button
            type="button"
            className={css.mobileBurger}
            onClick={() => setIsBurgerOpen(true)}
            aria-label="Open menu"
          >
            <svg className={css.burgerIcon} aria-hidden="true">
              <use href="/sprite.svg#icon-menu" />
            </svg>
          </button>
        </div>
      </header>

      {isBurgerOpen && (
        <BurgerMenu onCloseAction={() => setIsBurgerOpen(false)} />
      )}

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        title="Ви точно хочете вийти?"
        message="Ми будемо сумувати за вами!"
        confirmButtonText="Вийти"
        cancelButtonText="Відмінити"
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </>
  );
}
