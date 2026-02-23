'use client';

import Link from 'next/link';
import css from './Button.module.css';

type CommonProps = {
  variant?: 'primary' | 'cancel' | 'submit';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  children: React.ReactNode;
};

type ButtonOnlyProps = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type LinkOnlyProps = CommonProps & {
  href: string;
};

type ButtonProps = ButtonOnlyProps | LinkOnlyProps;

const Button = ({
  variant = 'primary',
  size = 'medium',
  href,
  children,
  className,
  ...props
}: ButtonProps) => {
  const classes = [css.button, css[variant], css[size], className]
    .filter(Boolean)
    .join(' ');

  if (href) {
    return (
      <Link href={href} prefetch={false} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button {...props} className={classes}>
      {children}
    </button>
  );
};

export default Button;
