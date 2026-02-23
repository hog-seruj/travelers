import css from './StoriesList.module.css';
import Teaser from '../Teaser/Teaser';
import Button from '../Button/Button';

export default function StoriesList() {
  return (
    <div className={css.wrapper}>
      <ul className={css.list}>
        <li className={css.item}>
          <Teaser />
        </li>
      </ul>
      <Button variant="primary" href="/stories">
        Переглянути всі
      </Button>
    </div>
  );
}
