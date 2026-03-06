import Link from 'next/link';
import css from './Toggle.module.css';

export default function TogglePage() {
  return (
    <ul className={css.toggle}>
      <li className={css['toggle-item']}>
        <Link
          className={css['toggle-link'] + ' ' + css['toggle-link--active']}
          href="/profile/saved"
        >
          Збережені історії
        </Link>
      </li>
      <li className={css['toggle-item']}>
        <Link className={css['toggle-link']} href="/profile/own">
          Мої історії
        </Link>
      </li>
    </ul>
  );
}
