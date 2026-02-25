import StoryDetails from '@/components/StoryDetails/StoryDetails';

import styles from './page.module.css';

type Props = {
  params: Promise<{ storyId: string }>;
};

export default async function StoryPage({ params }: Props) {
  const { storyId } = await params;
  console.log(storyId);
  return (
    <main className={styles.page}>
      <div className="container">
        <StoryDetails storyId={storyId} />
        {/* <Popular currentStoryId={storyId} /> */}
      </div>
    </main>
  );
}
