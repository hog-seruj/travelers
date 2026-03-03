import { useEffect } from 'react';
import css from './AuthNavModal.module.css';
import { createPortal } from 'react-dom';
import Button from '../Button/Button';

interface AuthNavModalProps {
  onClose: () => void;
}

function AuthNavModal({ onClose }: AuthNavModalProps) {
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return createPortal(
    <div
      className={css.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div className={css.modal}>
        <button
          className={css.closeButton}
          onClick={onClose}
          aria-label="Закрити модальне вікно"
        >
          <svg className={css.closeIcon} aria-hidden="true">
            <use href="/sprite.svg#icon-close" />
          </svg>
        </button>
        <h2 className={css.title}>Помилка під час збереження</h2>
        <p className={css.message}>
          Щоб зберегти статтю вам треба увійти, якщо ще немає облікового запису
          зареєструйтесь
        </p>
        <div className={css.buttonGroup}>
          <Button
            variant=""
            size="large"
            href="/auth/login"
            className={css.button}
          >
            Увійти
          </Button>
          <Button
            variant="primary"
            size="large"
            href="/auth/register"
            className={css.button}
          >
            Зареєструватись
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default AuthNavModal;
