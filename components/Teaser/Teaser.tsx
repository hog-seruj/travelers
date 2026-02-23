import css from './Teaser.module.css';

export default function Teaser() {
  return (
    <div className={css.teaser}>
      <h3 className={css.title}>Teaser Title</h3>
      <p className={css.description}>Teaser description goes here.</p>
    </div>
  );
}
