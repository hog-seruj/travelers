import AddStoryForm from '@/components/AddStoryForm/AddStoryForm';
import css from './CreateStoryPage.module.css';
import MainWrapper from '@/components/MainWrapper/MainWrapper';

export default function CreateStoryPage() {
  return (
    <MainWrapper>
      <main className={css.main}>
        <div className={css.container}>
          <h1 className={css.title}>Створити нову історію</h1>
          <AddStoryForm />
        </div>
      </main>
    </MainWrapper>
  );
}
