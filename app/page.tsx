import styles from './page.module.css';
import Block from '../components/Block/Block';
import StoriesList from '../components/StoriesList/StoriesList';
import TravelersList from '../components/TravelersList/TravelersList';
import Join from '../components/Join/Join';

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Block title="Популярні історії">
          <StoriesList />
        </Block>
        <Block title="Наші Мандрівники">
          <TravelersList />
        </Block>
        <Join />
      </main>
    </div>
  );
}
