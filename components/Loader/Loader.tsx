'use client';

import css from './Loader.module.css';
import  Icon  from '../Icon/Icon';


const Loader = () => {
  return (
    <div className={css.spinnerContainer}>
      <div className={css.spinner}></div>
      <div className={css.spinnerText}>ЗаПодорожуй за мить...
        <Icon src="/logo.svg" useSprite={false} className={css.logoIcon} />
      </div>
    </div>
       

  );
}
             
export default Loader;