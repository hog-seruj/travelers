// hooks/useHeaderVariant.ts
'use client';

import { usePathname } from 'next/navigation';

export type HeaderVariant = 'transparent' | 'solid';

const TRANSPARENT_PAGES = ['/'];

export const useHeaderVariant = (): HeaderVariant => {
  const pathname = usePathname();

  const isTransparent = TRANSPARENT_PAGES.includes(pathname);

  return isTransparent ? 'transparent' : 'solid';
};
