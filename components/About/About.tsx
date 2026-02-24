import css from './About.module.css';

const About = () => {
  return (
    <section className={css.about} aria-label="About">
      <div className="container">
        <div className={css.wrapper}>
          <div className={css.left}>
            <h2 className={css.title}>
              Проєкт, створений для тих, хто живе подорожами
            </h2>

            <p className={css.lead}>
              Ми віримо, що кожна подорож — це унікальна історія, варта того,
              щоб нею поділилися. Наша платформа створена, щоб об&apos;єднати
              людей, закоханих у відкриття нового. Тут ви можете ділитися
              власним досвідом, знаходити друзів та надихатися на наступні
              пригоди разом з нами.
            </p>
          </div>

          <div className={css.right}>
            <ul className={css.list}>
              <li className={css.item}>
                <svg className={css.icon} aria-hidden="true">
                  <use href="/sprite.svg#icon-wand_stars" />
                </svg>
                <div className={css.textBlock}>
                  <h3 className={css.itemTitle}>Наша місія</h3>
                  <p className={css.itemText}>
                    Об&apos;єднувати людей через любов до пригод та надихати на
                    нові відкриття.
                  </p>
                </div>
              </li>

              <li className={css.item}>
                <svg className={css.icon} aria-hidden="true">
                  <use href="/sprite.svg#icon-travel" />
                </svg>
                <div className={css.textBlock}>
                  <h3 className={css.itemTitle}>Автентичні історії</h3>
                  <p className={css.itemText}>
                    Ми цінуємо справжні, нередаговані враження від мандрівників
                    з усього світу.
                  </p>
                </div>
              </li>

              <li className={css.item}>
                <svg className={css.icon} aria-hidden="true">
                  <use href="/sprite.svg#icon-communication" />
                </svg>
                <div className={css.textBlock}>
                  <h3 className={css.itemTitle}>Ваша спільнота</h3>
                  <p className={css.itemText}>
                    Станьте частиною спільноти, де кожен може бути і автором, і
                    читачем.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
