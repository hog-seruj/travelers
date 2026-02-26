'use client';

import Button from '../Button/Button';
import { getUsers } from '@/lib/api/clientApi';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import TravelersList from '../TravelersList/TravelersList';
import css from './OurTravellers.module.css';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

export default function OurTravellers() {
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

  return (
    <>
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {users && users?.length > 0 && <TravelersList users={users} />}

      <div className={css.btnWrapper}>
        <Button
          size="large"
          variant="primary"
          href="/travellers"
          className={css.trlBtn}
        >
          Переглянути всі
        </Button>
      </div>
    </>
  );
}
