import { ReactNode } from 'react';
// import ProfileTabs from '@/components/Profile/ProfileTabs/ProfileTabs';
import ProfileInfo from '@/components/Profile/ProfileInfo/ProfileInfo';
import MainWrapper from '@/components/MainWrapper/MainWrapper';

interface Props {
  children: ReactNode;
}

export default function ProfileLayout({ children }: Props) {
  return (
    <MainWrapper>
      <ProfileInfo />
      {/* <ProfileTabs /> */}
      <main>
        {children}
      </main>
    </MainWrapper>
  );
}
