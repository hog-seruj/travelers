'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import css from './BurgerMenu.module.css';
import AuthNavigation from '../AuthNavigation/AuthNavigation';
import UserMenu from '../UserMenu/UserMenu';
import Button from '../Button/Button';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import { useAuthStore } from '@/lib/store/authStore';
import { logout } from '@/lib/api/clientApi';

interface BurgerMenuProps {
  onCloseAction: () => void;
}

export default function BurgerMenu({ onCloseAction }: BurgerMenuProps) {
  const pathname = usePathname();
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated
  );

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleNavClick = () => {
    onCloseAction();
  };

  const handlePublishClick = () => {
    onCloseAction();
    router.push('/stories/create');
  };

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearIsAuthenticated();
      setIsLogoutModalOpen(false);
      onCloseAction();
      router.push('/');
      router.refresh();
    }
  };

  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false);
  };

  const isAuthenticated = !!user;
  const userName = user?.name?.trim() || 'Мандрівник';

  return (
    <>
      <div className={css.overlay} onClick={onCloseAction}>
        <div className={css.modal} onClick={(e) => e.stopPropagation()}>
          <div className={css.modalHeader}>
            <div className={css.logoModal}>
              <Image
                src="/logo.svg"
                width={22}
                height={22}
                alt=""
                aria-hidden="true"
                className={css.logoModalIcon}
              />
              <span className={css.logoModalText}>Подорожники</span>
            </div>
            <button
              type="button"
              className={css.closeButton}
              onClick={onCloseAction}
              aria-label="Close menu"
            >
              <svg className={css.closeIcon} aria-hidden="true">
                <use href="/sprite.svg#icon-close" />
              </svg>
            </button>
          </div>

          <nav className={css.modalNav}>
            <ul className={css.navigation}>
              <li>
                <Link
                  href="/"
                  className={`${css.navigationLink} ${pathname === '/' ? css.active : ''}`}
                  onClick={handleNavClick}
                >
                  Головна
                </Link>
              </li>
              <li>
                <Link
                  href="/stories"
                  className={`${css.navigationLink} ${pathname === '/stories' ? css.active : ''}`}
                  onClick={handleNavClick}
                >
                  Історії
                </Link>
              </li>
              <li>
                <Link
                  href="/travellers"
                  className={`${css.navigationLink} ${pathname === '/travellers' ? css.active : ''}`}
                  onClick={handleNavClick}
                >
                  Мандрівники
                </Link>
              </li>

              {isAuthenticated && (
                <li>
                  <Link
                    href="/profile"
                    className={`${css.navigationLink} ${pathname === '/profile' ? css.active : ''}`}
                    onClick={handleNavClick}
                  >
                    Мій Профіль
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          {isAuthenticated && (
            <div className={css.publishSection}>
              <Button
                type="button"
                variant="primary"
                size="medium"
                className={css.publishButton}
                onClick={handlePublishClick}
              >
                Опублікувати історію
              </Button>
            </div>
          )}

          <div className={css.authSection}>
            {isAuthenticated ? (
              <UserMenu
                userName={userName}
                onLogout={handleLogoutClick}
                variant="modal"
              />
            ) : (
              <AuthNavigation variant="modal" onCloseAction={onCloseAction} />
            )}
          </div>
        </div>
      </div>

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
