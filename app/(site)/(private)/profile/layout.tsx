import PageToggle from '@/components/Profile/PageToggle/PageToggle';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageToggle />
      {children}
    </>
  );
}