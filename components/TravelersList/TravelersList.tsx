'use client';

import css from './TravelersList.module.css';
import Card from '../Card/Card';
import Button from '../Button/Button';
import { getUsers } from '@/lib/api/clientApi';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import Loading from '@/app/loading';

export default function TravelersList() {
  const {
    data: response,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers({ page: 1, perPage: 4 }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const users = response?.users;

  if (isLoading)
    return (
      <div className="center">
        <Loading />
      </div>
    );
  if (isError || !response)
    return (
      <div className="center">
        <p>Помилка при завантаженні...</p>
      </div>
    );

  return (
    <div className={css.wrapper}>
      <ul className={css.list}>
        {users?.map((user) => (
          <li key={user._id} className={css.item}>
            <Card user={user} />
          </li>
        ))}
      </ul>

      <Button
        size="large"
        variant="primary"
        href="/travellers"
        className={css.trlBtn}
      >
        Переглянути всі
      </Button>
    </div>
  );
}
