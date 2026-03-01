'use client';

import { ReactNode } from 'react';
import css from './MainWrapper.module.css';
import { useHeaderVariant } from '@/hooks/useHeaderVariant';

interface MainWrapperProps {
  children: ReactNode;
}

export default function MainWrapper({ children }: MainWrapperProps) {
  const headerVariant = useHeaderVariant();
  console.log(headerVariant);

  return (
    <div
      className={`${css.wrapper} ${
        headerVariant === 'transparent' ? css.transparent : ''
      }`}
    >
      {children}
    </div>
  );
}
