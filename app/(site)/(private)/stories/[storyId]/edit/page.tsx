import AddStoryForm from '@/components/AddStoryForm/AddStoryForm';
import css from './page.module.css';
import MainWrapper from '@/components/MainWrapper/MainWrapper';

interface Props {
  params: Promise<{
    storyId: string;
  }>;
}

export default async function EditStoryPage({ params }: Props) {
  const { storyId } = await params;

  return (
    <MainWrapper>
      <main className={css.main}>
        <div className={css.container}>
          <h1 className={css.title}>Редагувати історію</h1>
          <AddStoryForm storyId={storyId} />
        </div>
      </main>
    </MainWrapper>
  );
}
