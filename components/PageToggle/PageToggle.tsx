'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import css from './PageToggle.module.css';

export default function PageToggle() {
  const pathname = usePathname();

  return (
    <nav className={css.toggleNav} aria-label="Profile tabs">
      <Link
        href="/profile/saved"
        className={`${css.toggleLink} ${pathname === '/profile/saved' || pathname === '/profile' ? css.active : ''}`}
      >
        Збережені історії
      </Link>
      <Link
        href="/profile/own"
        className={`${css.toggleLink} ${pathname === '/profile/own' ? css.active : ''}`}
      >
        Мої історії
      </Link>
    </nav>
  );
}
