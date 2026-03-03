import AddStoryForm from '@/components/AddStoryForm/AddStoryForm';
import css from './page.module.css';
import MainWrapper from '@/components/MainWrapper/MainWrapper';

interface Props {
    params: {
        storyId: string;
    };
}

export default function EditStoryPage({ params }: Props) {
    const { storyId } = params;

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
