import css from './Card.module.css';

export default function Card() {
  return (
    <div className={css.card}>
      <h3 className={css.title}>Card Title</h3>
      <p className={css.description}>Card description goes here.</p>
    </div>
  );
}
