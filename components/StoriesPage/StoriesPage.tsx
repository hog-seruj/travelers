'use client';

import { useQuery } from '@tanstack/react-query';
import { getStories } from '@/lib/api/clientApi';
import TravellersStories from '@/components/TravellersStories/TravellersStories';
import css from './StoriesPage.module.css';
import Categories from '@/components/Categories/Categories';
import { useState, useEffect } from 'react';
import type { Category, Story } from '@/types/story';

interface Props {
  initialStories: Story[];
  categories: Category[];
}


export default  function StoriesPage({
  initialStories,
  categories,
}: Props) {
  const [stories, setStories] = useState<Story[]>(initialStories);
  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState<string>('all');
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  const { data } = useQuery({
    queryKey: ['stories', categoryId],
    queryFn: () => getStories(1, 3, 'popular', categoryId),
    refetchOnMount: false,
  });

// Вираховуємо, планшет чи ні
  useEffect(() => {
    const handleResize = () => {
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1440);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

   const PER_PAGE = isTablet ? 8 : 9;
  const FIRST_LOAD = PER_PAGE;

  // Перша порція історій (від сервера) + скидання пагінації
  useEffect(() => {
    setStories(initialStories.slice(0, FIRST_LOAD));
    setPage(1);
    setHasMore(initialStories.length >= FIRST_LOAD);
  }, [initialStories, isTablet, FIRST_LOAD]); 


  const handleCategoryChange = async (newCategoryId: string) => {
    setCategoryId(newCategoryId);
    setLoading(true);
    try {
      const categoryParam = newCategoryId === 'all' ? undefined : newCategoryId;
      const data = await getStories(1, PER_PAGE, categoryParam);

      setStories(data.stories);
      setPage(1);
      setHasMore(data.stories.length === PER_PAGE);
    } catch (error) {
      console.error('Помилка отримання історій за категорією:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleLoadMore = async () => {
    if (!hasMore) return;

    setLoading(true);
    try {
      const nextPage = page + 1;
      const categoryParam = categoryId === 'all' ? undefined : categoryId;
      const newStories = await getStories(nextPage, PER_PAGE, categoryParam);
       setStories(prev => [...prev, ...newStories.stories]);   
      if (newStories.stories.length < FIRST_LOAD) {
        setHasMore(false);
      } else {
       
        setPage(nextPage);
      }
    } catch (error) {
      console.error('Помилка завантаження ще:', error);
    } finally {
      setLoading(false);
    }
  };



  return (
   <>
        <h2 className={css.title}>Історії Мандрівників</h2>

       <Categories
          categories={categories}  
          value={categoryId}
          onChange={handleCategoryChange}  
        />

        {data?.stories?.length > 0 && <TravellersStories stories={data.stories} />}

      {hasMore && (
  <div className={css.loadMoreWrapper}>
    <button
      className= {css.stories__more}
      onClick={handleLoadMore}
      disabled={loading}
    >
      Переглянути ще
    </button>
  </div>
)}
     </>
  );
}

   


