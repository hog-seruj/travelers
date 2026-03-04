'use client';
import { PulseLoader } from 'react-spinners';
import css from './Loader.module.css';

export default function Loading() {
  return (
    <div className={css.container}>
      <PulseLoader color="#7a96ea" margin={6} size={18} speedMultiplier={0.5} />
    </div>
  );
}
