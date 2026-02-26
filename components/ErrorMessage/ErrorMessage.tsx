import css from './ErrorMessage.module.css';

export default function ErrorMessage() {
  return <p className={css.text}>Помилка при завантаженні. Спробуйте знову.</p>;
}
