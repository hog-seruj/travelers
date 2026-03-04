'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useField, useFormikContext } from 'formik';
import clsx from 'clsx';
import css from './CategorySelect.module.css';

type Option = { value: string; label: string };

interface Props {
  name: string; // "category"
  placeholder?: string; // "Категорія"
  options: Option[]; // categories
  disabled?: boolean;
}

export default function CategorySelect({
  name,
  placeholder = 'Select',
  options,
  disabled,
}: Props) {
  const [field, meta] = useField<string>(name);
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const selected = useMemo(
    () => options.find((o) => o.value === field.value) ?? null,
    [options, field.value]
  );

  // close on outside click
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  // close on Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const hasError = Boolean(meta.touched && meta.error);

  const choose = (value: string) => {
    setFieldValue(name, value);
    setFieldTouched(name, true, true);
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
          aria-hidden="true"
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
