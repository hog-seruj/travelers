'use client';

import css from './TravellersPage.module.css';
import { useInfiniteQuery } from '@tanstack/react-query';
// import { getUsers } from '@/lib/api/api';
// import { getUsers } from '@/lib/api/clientApi;

interface TravellersPageClientProps {
  initialLimit: number;
}

export default function TravellersPageClient({
  initialLimit,
}: TravellersPageClientProps) {
  return (
    <main>
      <div className="container">
        <h2 className={`center ${css.title}`}>Мандрівники</h2>
      </div>
      {/* <TravelersList users={users} /> */}
      {/* <div className={css.btnWrapper}>
          <Button
            size="large"
            variant="primary"
            href="/travellers"
            className={css.trlBtn}
          >
            Переглянути всі
          </Button>
        </div> */}
    </main>
  );
}
