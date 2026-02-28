import AddStoryForm from '@/components/AddStoryForm/AddStoryForm';
import css from './CreateStoryPage.module.css';

export default function CreateStoryPage() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Створити нову історію</h1>

        <div className={css.content}>
          <div className={css.left}>
            <AddStoryForm />
          </div>

          <div className={css.right}>{}</div>
        </div>
      </div>
    </main>
  );
}