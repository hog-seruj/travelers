'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useField } from 'formik';
import clsx from 'clsx';
import css from './CategorySelect.module.css';

type Option = { value: string; label: string };

interface Props {
  name: string;
  placeholder?: string;
  options: Option[];
  disabled?: boolean;
}

export default function CategorySelect({
  name,
  placeholder = 'Select',
  options,
  disabled,
}: Props) {
  const [field, meta, helpers] = useField<string>(name);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const selected = useMemo(
    () => options.find((o) => o.value === field.value) ?? null,
    [options, field.value]
  );

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!open) return;
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const hasError = Boolean(meta.touched && meta.error);

  const choose = (value: string) => {
    helpers.setTouched(true, false);
    helpers.setValue(value, true);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={css.root}>
      <button
        type="button"
        className={clsx(css.trigger, open && css.open, hasError && css.invalid)}
        onClick={() => !disabled && setOpen((v) => !v)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={clsx(css.value, !selected && css.placeholder)}>
          {selected?.label ?? placeholder}
        </span>

        <svg
          className={clsx(css.icon, open && css.iconOpen)}
          width="16"
          height="16"
        >
          <use href="/sprite.svg#icon-down" />
        </svg>
      </button>

      {open && (
        <ul className={css.list} role="listbox">
          {options.map((opt) => {
            const isSelected = opt.value === field.value;
            return (
              <li key={opt.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  className={clsx(css.item, isSelected && css.itemSelected)}
                  onClick={() => choose(opt.value)}
                >
                  {opt.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
