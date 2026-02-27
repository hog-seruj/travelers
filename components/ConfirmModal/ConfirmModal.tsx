'use client';

import { useEffect } from 'react';
import css from './ConfirmModal.module.css';
import Button from '../Button/Button';

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmButtonText: string;
  cancelButtonText: string;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
}

export default function ConfirmModal({
  title,
  message,
  confirmButtonText,
  cancelButtonText,
  onConfirm,
  onCancel,
  isOpen,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onCancel]);

  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;
    document.body.style.top = `-${scrollY}px`;
    document.body.classList.add('bodyLock');

    return () => {
      document.body.classList.remove('bodyLock');
      document.body.style.top = '';
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={css.overlay} onClick={onCancel}>
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={css.closeButton}
          onClick={onCancel}
          aria-label="Закрити модальне вікно"
        >
          <svg className={css.closeIcon} aria-hidden="true">
            <use href="/sprite.svg#icon-close" />
          </svg>
        </button>

        <h2 className={css.title}>{title}</h2>
        <p className={css.message}>{message}</p>

        <div className={css.buttonGroup}>
          <Button
            type="button"
            variant=""
            size="large"
            className={css.cancelButton}
            onClick={onCancel}
          >
            {cancelButtonText}
          </Button>
          <Button
            type="button"
            variant="primary"
            size="large"
            className={css.confirmButton}
            onClick={onConfirm}
          >
            {confirmButtonText}
          </Button>
        </div>
      </div>
    </div>
  );
}
