'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import css from './PageToggle.module.css';

export default function PageToggle() {
  const pathname = usePathname();

  const savedActive = pathname === '/profile/saved' || pathname === '/profile';
  const ownActive = pathname === '/profile/own';

  return (
    <nav className={css.tabs}>
      <Link
        href="/profile/saved"
        className={`${css.tab} ${savedActive ? css.active : ''}`}
      >
        Збережені історії
      </Link>

      <Link
        href="/profile/own"
        className={`${css.tab} ${ownActive ? css.active : ''}`}
      >
        Мої історії
      </Link>
    </nav>
  );
}
