import PageToggle from '@/components/PageToggle/PageToggle';

interface ToggleLayoutProps {
  children: React.ReactNode;
}

export default function ToggleLayout({ children }: ToggleLayoutProps) {
  return (
    <>
      <PageToggle />
      <div>{children}</div>
    </>
  );
}
