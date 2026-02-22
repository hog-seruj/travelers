import Button from '../Button/Button';
import css from './Hero.module.css';

const Hero = () => {
  return (
    <section className={css.hero}>
      <div className="container">
        <div className={css.content}>
          <h1 className={css.title}>Відкрийте світ подорожей з нами!</h1>

          <p className={css.text}>
            Приєднуйтесь до нашої спільноти мандрівників, де ви зможете ділитися
            своїми історіями та отримувати натхнення для нових пригод. Відкрийте
            для себе нові місця та знайдіть однодумців!
          </p>

          <Button variant="primary" href="#join">
            Доєднатись
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
