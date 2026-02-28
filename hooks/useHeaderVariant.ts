// hooks/useHeaderVariant.ts
'use client';

import { usePathname } from 'next/navigation';

export type HeaderVariant = 'transparent' | 'solid';

// Масив сторінок з прозорим хедером (тільки головна)
const TRANSPARENT_PAGES = ['/'];

export const useHeaderVariant = (): HeaderVariant => {
  const pathname = usePathname();

  // Перевіряємо чи поточний роут у списку прозорих
  const isTransparent = TRANSPARENT_PAGES.some((route) => {
    if (route === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(route);
  });

  return isTransparent ? 'transparent' : 'solid';
};
