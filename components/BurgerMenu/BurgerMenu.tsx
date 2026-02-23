'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import css from './BurgerMenu.module.css';
import AuthNavigation from '../AuthNavigation/AuthNavigation';

interface BurgerMenuProps {
  onCloseAction: () => void;
}

export default function BurgerMenu({ onCloseAction }: BurgerMenuProps) {
  const pathname = usePathname();

  const handleNavClick = () => {
    onCloseAction();
  };

  return (
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
          </ul>
        </nav>
        <AuthNavigation variant="modal" onCloseAction={onCloseAction} />
      </div>
    </div>
  );
}
