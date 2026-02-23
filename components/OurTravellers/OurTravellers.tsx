import Link from 'next/link';
import TravelersList from '../TravelersList/TravelersList';

const OurTravellers = () => {
  return (
    <section>
      <h2>Наші Мандрівники</h2>
      <TravelersList mode="preview" />
      <Link href="/travellers">Переглянути всіх</Link>
    </section>
  );
};

export default OurTravellers;
