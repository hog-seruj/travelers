import css from './TravelersList.module.css';
import Card from '../Card/Card';
import Button from '../Button/Button';

export default function TravelersList() {
  return (
    <div className={css.wrapper}>
      <ul className={css.list}>
        <li className={css.item}>
          <Card />
        </li>
      </ul>
      <Button href="/travelers" variant="primary">
        Переглянути всі
      </Button>
    </div>
  );
}
