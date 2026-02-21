'use client';

import css from './Block.module.css';

interface BlockProps {
  title: string;
  children: React.ReactNode;
}

export default function Block({ title, children }: BlockProps) {
  return (
    <div className={css.block}>
      <div className="container">
        <h2 className={css.title}>{title}</h2>
        <div className={css.content}>{children}</div>
      </div>
    </div>
  );
}
