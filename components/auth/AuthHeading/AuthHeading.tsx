import css from './AuthHeading.module.css';

interface AuthHeadingProps {
  title: string;
  subtitle: string;
}

function AuthHeading({ title, subtitle }: AuthHeadingProps) {
  return (
    <div className={css.wrap}>
      <h1 className={css.title}>{title}</h1>
      <p className={css.subtitle}>{subtitle}</p>
    </div>
  );
}

export default AuthHeading;
