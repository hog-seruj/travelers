'use client';
import css from './Join.module.css';
import Button from '../Button/Button';
import { useAuthStore } from '@/lib/store/authStore';

export default function Join() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return (
    <section className={css.join} id="join">
      <div className="container">
        <div className={css.join_image_container}>
          <div className={css.join_content_container}>
            <h2 className={css.join_name}>Приєднуйтесь до нашої спільноти</h2>
            <p className={css.join_text}>
              Долучайтеся до мандрівників, які діляться своїми історіями та
              надихають на нові пригоди.
            </p>
            {isAuthenticated ? (
              <Button
                variant="primary"
                href="/auth/profile"
                size="large"
                className={css.join_button}
              >
                Збережені
              </Button>
            ) : (
              <Button
                variant="primary"
                href="/auth/register"
                size="large"
                className={css.join_button}
              >
                Зареєструватися
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
