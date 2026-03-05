'use client';

import MainWrapper from '@/components/MainWrapper/MainWrapper';
import { useAuthStore } from '@/lib/store/authStore';
import TravellerInfo from '@/components/TravellerInfo/TravellerInfo';
import css from './profile.module.css';

interface ProfileLayoutProps {
  children: React.ReactNode;
  toggle: React.ReactNode;
}

export default function ProfileLayout({
  children,
  toggle,
}: ProfileLayoutProps) {
  const user = useAuthStore((state) => state.user);

  console.log('User in ProfileLayout:', user);

  return (
    <>
      <MainWrapper className={css['profile-page']}>
        {user && <TravellerInfo id={user?._id} />}
        <section>
          <div className="container">
            <div>{toggle}</div>
            <div>{children}</div>
          </div>
        </section>
      </MainWrapper>
    </>
  );
}
