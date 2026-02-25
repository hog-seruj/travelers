'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import css from './Header.module.css';
import BurgerMenu from '../BurgerMenu/BurgerMenu';
import AuthNavigation from '../AuthNavigation/AuthNavigation';

export default function Header() {
  const [isBurgerOpen, setIsBurgerOpen] = useState<boolean>(false);
  const pathname = usePathname();

  // Lock scroll when menu is open
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

  // Close menu on route change
  useEffect(() => {
    const timer = setTimeout(() => setIsBurgerOpen(false), 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Close menu on Escape key
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
          {/* Logo */}
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

          {/* Desktop Navigation */}
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
            </ul>

            <AuthNavigation variant="desktop" />
          </nav>

          {/* Tablet: Publish + Burger */}
          <div className={css.tabletActions}>
            <Link href="/stories/create" className={css.publishButton}>
              Опублікувати історію
            </Link>
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

          {/* Mobile: Burger only */}
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

      {/* Burger Menu Modal */}
      {isBurgerOpen && (
        <BurgerMenu onCloseAction={() => setIsBurgerOpen(false)} />
      )}
    </>
  );
}
