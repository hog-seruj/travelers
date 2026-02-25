'use client';

import css from '@/components/Error/Error.module.css';
import Button from '@/components/Button/Button';

type Props = {
  error: Error;
  reset: () => void;
};

const Error = ({ error, reset }: Props) => {
  return (
    <main className={css.main}>
      <div className="container">
        <h2 className={css.title}>Помилка при завантаженні</h2>
        <p className={css.message}>{error.message}</p>
        <Button
          variant="primary"
          size="medium"
          onClick={reset}
          className={css.resetBtn}
        >
          Спробувати знову
        </Button>
      </div>
    </main>
  );
};

export default Error;
