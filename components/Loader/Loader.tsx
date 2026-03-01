'use client';


import Icon from '../Icon/Icon';

const Loader = () => {
  return (
    <div className={css.spinnerContainer}>
      <div className={css.spinner}></div>
      <div className={css.spinnerText}>
        Подорожуй за мить...
        <Icon src="/logo.svg" useSprite={false} className={css.logoIcon} />
      </div>
    </div>
  );
};

export default Loader;
