'use client';

import style from './(site)/page.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFoundPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.push('/'), 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className={style.main}>
      <div className={style.notFound}>
        <Link href="/" aria-label="Home" className={style.logoLink}>
          <Image
            src="/logo.svg"
            width={33}
            height={33}
            alt="logo"
            aria-hidden="true"
            className={style.logoIcon}
          />
        </Link>
        <h2>404 | Сторінку не знайдено</h2>
        <p>Вас буде перенаправлено на головну сторінку через кілька секунд…</p>
      </div>
    </main>
  );
}
