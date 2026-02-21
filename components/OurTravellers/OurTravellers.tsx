import Link from 'next/link';
import TravellersList from '../TravellersList/TravellersList';

const OurTravellers = () => {
  return (
    <section>
      <h2>Наші Мандрівники</h2>
      <TravellersList />
      <Link href="/travellers">Переглянути всіх</Link>
    </section>
  );
};

export default OurTravellers;
