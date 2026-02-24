'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';
import { useAuthStore } from '@/lib/store/authStore';

export default function Footer() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.top}>
            <Link href="/" className={styles.logo} aria-label="Подорожники">
              <Image
                src="/logo.svg"
                alt="Подорожники"
                width={30}
                height={30}
                className={styles.logoIcon}
                priority
              />
              <span className={styles.logoText}>Подорожники</span>
            </Link>

            <nav className={styles.socialNav} aria-label="Соціальні мережі">
              <ul className={styles.socialList}>
                <li>
                  <a
                    href="https://www.facebook.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                    aria-label="Facebook"
                  >
                    <svg
                      className={styles.socialIcon}
                      aria-hidden="true"
                      viewBox="0 0 32 32"
                    >
                      <use href="/sprite.svg#icon-Facebook" />
                    </svg>
                  </a>
                </li>

                <li>
                  <a
                    href="https://www.instagram.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                    aria-label="Instagram"
                  >
                    <svg
                      className={styles.socialIcon}
                      aria-hidden="true"
                      viewBox="0 0 32 32"
                    >
                      <use href="/sprite.svg#icon-Instagram" />
                    </svg>
                  </a>
                </li>

                <li>
                  <a
                    href="https://x.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                    aria-label="X"
                  >
                    <svg
                      className={styles.socialIcon}
                      aria-hidden="true"
                      viewBox="0 0 32 32"
                    >
                      <use href="/sprite.svg#icon-X" />
                    </svg>
                  </a>
                </li>

                <li>
                  <a
                    href="https://www.youtube.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                    aria-label="YouTube"
                  >
                    <svg
                      className={styles.socialIcon}
                      aria-hidden="true"
                      viewBox="0 0 32 32"
                    >
                      <use href="/sprite.svg#icon-Youtube" />
                    </svg>
                  </a>
                </li>
              </ul>
            </nav>

            <nav className={styles.nav} aria-label="Навігація футера">
              <ul className={styles.navList}>
                <li>
                  <Link href="/" className={styles.navLink}>
                    Головна
                  </Link>
                </li>
                <li>
                  <Link href="/stories" className={styles.navLink}>
                    Історії
                  </Link>
                </li>
                <li>
                  <Link href="/travellers" className={styles.navLink}>
                    Мандрівники
                  </Link>
                </li>
                {!isAuthenticated && (
                  <li>
                    <Link href="/profile" className={styles.navLink}>
                      Профіль
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          </div>

          <div className={styles.divider} />

          <p className={styles.copyright}>
            © {year} Подорожники. Усі права захищені.
          </p>
        </div>
      </div>
    </footer>
  );
}
