'use client';

import Link from 'next/link';
import css from './UserMenu.module.css';

interface UserMenuProps {
  userName: string;
  onLogout: () => void;
  variant?: 'desktop' | 'modal';
}

export default function UserMenu({
  userName,
  onLogout,
  variant = 'desktop',
}: UserMenuProps) {
  if (variant === 'modal') {
    return (
      <div className={css.modalUserMenu}>
        <Link href="/profile" className={css.modalUserInfo}>
          <div className={css.modalAvatarPlaceholder}>
            <svg className={css.modalAvatarPlaceholderIcon} aria-hidden="true">
              <use href="/sprite.svg#icon-avatar" />
            </svg>
          </div>
          <span className={css.modalUserName}>{userName}</span>
        </Link>

        <div className={css.modalSeparator} />

        <button
          type="button"
          className={css.modalLogoutButton}
          onClick={onLogout}
          aria-label="Logout"
        >
          <svg className={css.modalLogoutIcon} aria-hidden="true">
            <use href="/sprite.svg#icon-logout" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className={css.userMenu}>
      <Link href="/profile" className={css.userInfo}>
        <div className={css.avatarPlaceholder}>
          <svg className={css.avatarPlaceholderIcon} aria-hidden="true">
            <use href="/sprite.svg#icon-avatar" />
          </svg>
        </div>
        <span className={css.userName}>{userName}</span>
      </Link>

      <div className={css.separator} />

      <button
        type="button"
        className={css.logoutButton}
        onClick={onLogout}
        aria-label="Logout"
      >
        <svg className={css.logoutIcon} aria-hidden="true">
          <use href="/sprite.svg#icon-logout" />
        </svg>
      </button>
    </div>
  );
}
