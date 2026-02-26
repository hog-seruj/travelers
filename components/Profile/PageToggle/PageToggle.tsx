'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './PageToggle.module.css';

export default function PageToggle() {
  const pathname = usePathname();

  const isSaved = pathname === '/profile/saved';
  const isOwn = pathname === '/profile/own';

  return (
    <nav className={styles.toggle}>
      <Link
        href="/profile/saved"
        className={`${styles.link} ${isSaved ? styles.active : ''}`}
      >
        Збережені історії
      </Link>

      <Link
        href="/profile/own"
        className={`${styles.link} ${isOwn ? styles.active : ''}`}
      >
        Мої історії
      </Link>
    </nav>
  );
}