'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import css from './Toggle.module.css';

export default function PageToggle() {
  const pathname = usePathname();

  const savedActive = pathname === '/profile/saved' || pathname === '/profile';
  const ownActive = pathname === '/profile/own';

  return (
    <nav className={css.toggle}>
      <Link
        href="/profile/saved"
        className={`${css.toggleLink} ${savedActive ? css.toggleLinkActive : ''}`}
      >
        Збережені історії
      </Link>

      <Link
        href="/profile/own"
        className={`${css.toggleLink} ${ownActive ? css.toggleLinkActive : ''}`}
      >
        Мої історії
      </Link>
    </nav>
  );
}
