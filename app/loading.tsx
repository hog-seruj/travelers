import { PulseLoader } from 'react-spinners';
import style from './(site)/page.module.css';

export default function Loading() {
  return (
    <div className={style.loading}>
      <PulseLoader color="#7a96ea" margin={6} size={18} speedMultiplier={0.5} />
    </div>
  );
}
