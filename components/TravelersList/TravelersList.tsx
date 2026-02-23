'use client';

import css from './TravelersList.module.css';
import Card from '../Card/Card';
import Button from '../Button/Button';
import { getUsers } from '@/lib/api/api';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

export default function TravelersList() {
  const {
    data: response,
    isSuccess,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers({ page: 1, perPage: 4 }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const users = response?.users;
  console.log(users);

  // const user = {
  //   _id: '123',
  //   name: 'Іван Іванов',
  //   avatarUrl:
  //     'https://ftp.goit.study/img/harmoniq/users/6881563901add19ee16fd010.webp',
  //   description: 'Мандрівник з України, який обожнює подорожувати світом.',
  //   email: 'test@email.com',
  //   password: 'password',
  //   articlesAmount: 5,
  //   savedArticles: ['article1', 'article2'],
  // };

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
        href="/travelers"
        className={css.trlBtn}
      >
        Переглянути всі
      </Button>
    </div>
  );
}
