'use client';
import css from './TravellerInfo.module.css';
import Image from 'next/image';
import { getUserById } from '@/lib/api/clientApi';
import Loading from '@/app/loading';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

interface Props {
  id: string;
}

export default function TravellerInfo({ id }: Props) {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: () => getUserById(id),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  if (isLoading)
    return (
      <div className="center">
        <Loading />
      </div>
    );

  const user = data?.user;

  if (isError || !user)
    return (
      <div className="center">
        <p>Помилка при завантаженні...</p>
      </div>
    );

  return (
    <section className={css.travellerInfo}>
      <div className="container">
        <div className={css.travellerInfo_content}>
          <Image
            src={user.avatarUrl}
            alt={user.name}
            className={css.photo}
            width={199}
            height={199}
          />
          <div className={css.travellerInfo_about}>
            <h3 className={css.title}>{user.name}</h3>
            <p className={css.description}>{user.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
