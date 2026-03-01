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
    queryKey: ['user'],
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
  if (isError || !data)
    return (
      <div className="center">
        <p>Помилка при завантаженні...</p>
      </div>
    );

  return (
    <section className={css.travellerInfo}>
      <Image
        src={data.avatarUrl}
        alt={data.name}
        className={css.photo}
        width={112}
        height={112}
      />
      <h3 className={css.title}>{data.name}</h3>
      <p className={css.description}>{data.description}</p>
    </section>
  );
}
