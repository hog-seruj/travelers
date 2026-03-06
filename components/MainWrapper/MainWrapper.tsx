'use client';

import { ReactNode } from 'react';
import css from './MainWrapper.module.css';
import { useHeaderVariant } from '@/hooks/useHeaderVariant';

interface MainWrapperProps {
  children: ReactNode;
  className?: string;
}

export default function MainWrapper({ children, className }: MainWrapperProps) {
  const headerVariant = useHeaderVariant();

  return (
    <div
      className={`${css.wrapper} ${
        headerVariant === 'transparent' ? css.transparent : ''
      } ${className || ''}`}
    >
      {children}
    </div>
  );
}
