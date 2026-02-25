import type { Metadata } from 'next';
import { Nunito_Sans, Sora, Inter } from 'next/font/google';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import './globals.css';
import AuthProvider from '@/components/auth/AuthProvider/AuthProvider';

const nunitoSans = Nunito_Sans({
  variable: '--font-nunito-sans',
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

const sora = Sora({
  variable: '--font-sora',
  subsets: ['latin'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Travel App',
  description: 'App for traveling around the world',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="uk"
      className={`${nunitoSans.variable} ${sora.variable} ${inter.variable}`}
    >
      <body
      // className={`${nunitoSans.variable} ${sora.variable} ${inter.variable}`}
      >
        <TanStackProvider>
          <AuthProvider>{children}</AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
