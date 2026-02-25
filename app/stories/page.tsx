import StoriesPage from '@/components/StoriesPage/StoriesPage';
import css from './Stories.module.css';



export default async function StoryPage() {
     const initialStories = await fetchStoriesServer(1, 9);
  

  return (
    <section className={css.stories}>
      <div className="container">
        <StoriesPage 
          initialStories={initialStories}
          categories={categories}
        /> 
      </div>
    </section>
  );
}

