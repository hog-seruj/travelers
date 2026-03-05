import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { checkServerSession, getServerMe } from '@/lib/api/serverApi';
import TravellerInfo from '@/components/TravellerInfo/TravellerInfo';
import PageToggle from '@/components/PageToggle/PageToggle';
import Loading from '@/app/loading';
import MainWrapper from '@/components/MainWrapper/MainWrapper';
import ReactQueryWrapper from '@/components/ReactQueryWrapper';

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let currentUser;

  try {
    await checkServerSession();
    currentUser = await getServerMe();
  } catch (error) {
    console.error('Profile layout error:', error);
    redirect('/auth/login');
  }

  return (
    <MainWrapper>
      <ReactQueryWrapper>
        <TravellerInfo id={currentUser._id} />
        <PageToggle />
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </ReactQueryWrapper>
    </MainWrapper>
  );
}
