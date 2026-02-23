'use client';

import {useState, useEffect} from 'react';
import {useQuery} from '@tanstack/react-query'
import TravellersStories from '../TravellersStories/TravellersStories';
import CategorySelect from '../Category/Category';
import Loader from '../Loader/Loader';
import {fetchStories, fetchSavedStoriesByUserId} from '@/lib/api/clientApi';
import {useAuthStore} from '../../lib/store/authStore';
import css from './StoriesPage.module.css';
import { Category, Story, SavedStory } from '../../types/story';



interface Props{
    initialStories: Story[];
    categories: Category[];
}

export default function StoriesPage({initialStories, categories}: Props){
    const [stories, setStories]=useState<Story[]>(initialStories);
    const [page, setPage]=useState(1);
    const [categoryId, setCategoryId]=useState<string>('all');
    const [hasMore, setHasMore]=useState(true);
    const [loading, setLoading]=useState(false);
    const [isTablet, setIsTablet]=useState(false);

    //Дані про користувача 
    const {user}=useAuthStore(state=>state.user);
    const userId=user?._id || null;
    isAuthenticated=!!userId;

    //Тягнемо збережені історії користувача
    const {data: savedStories, isLoading: loadingSavedStories}=useQuery<SavedStory[]>({
        queryKey: ['savedStoriesByUser', userId],
        queryFn: () => fetchSavedStoriesByUserId(userId as string),
        enabled: isAuthenticated,
    });

    //Масив збережених історій
    const savedIds==isAuthenticated ? savedStories?.map(story=>story._id) : [];

    //Мерджимо додаємо isFavorite до історій цієї сторінки
    const mergedStories: Story[]=stories.map(story=>({
        ...story,
        isFavorite: isAuthenticated  ? savedIds?.includes(story._id) || false,
    }));

    //Вираховуємо планшет чи ні 
    useEffect(()=? {
        const handleRelize=()=>{
            setIsTablet(window.innerWidth <= 768 && window.innerWidth<1440);
        };

        handleRelize();
        window.addEventListener('resize', handleRelize);
        return ()=>window.removeEventListener('resize', handleRelize);
        },[]);

        const PER_PAGE=isTablet ? 8 : 9;
        const FIRST_LOAD=PER_PAGE;

        //Перша загрузка сторінок від сервера +скидання пагінації
        useEffect(()=>{
            setStories(initialStories.slice(0, FIRST_LOAD));
            setPage(1);
            setHasMore(initialStories.length >= FIRST_LOAD);
        },[initialStories, isTablet, FIRST_LOAD]);

        const handleCategoryChange=async(newCategoryId:string)=>{
            setCategoryId(newCategoryId);
            setLoading(true);
            setPage(1);
            try{
               const categoryParam=newCategoryId === 'all' ? undefined : newCategoryId;
               const data =await fetchStories({ perPage:PER_PAGE, categoryId: categoryParam});
                setStories(data);
                setPage(1);
                setHasMore(data.length === PER_PAGE);
            }catch(error){
                console.error('Помилка при завантаженні історій:', error);
            }finally{
                setLoading(false);
            }
         };

         const handleLoadMore-async ()=>{
            if (!hasMore || loading) return;
            setLoading(true);   
            try{
                const nextPage=page + 1;
                const categoryParam=categoryId === 'all' ? undefined : categoryId;
                const newStories=await fetchStories({perPage: PER_PAGE, page: nextPage, categoryId: categoryParam});
                setStories(prev=>[...prev, ...newStories]);
                if(newStories.length > FIRST_LOAD){
                    setHasMore(false);
                } else {
                     setPage(nextPage);
                }
            }catch(error){
                console.error('Помилка при завантаженні історій:', error);
                }finally{
                    setLoading(false);
                }
            };
               
            return (
                <>
                <h1 className={css.title}>Історії Мандрівників</h1>

                <CategorySelect categories={categories} value={categoryId} onChange={handleCategoryChange} />

                {loading && <Loader />}

                <TravellersStories stories={mergedStories} isAuthenticated={isAuthenticated} className={css.storiesList} />

                {hasMore && mergedStories.length > 0 && (
                    <div className={css.loadMoreWrapper}>
                        {loading ? (<Loader className={css.loader} />) : (
                            <button className={`${css.traveller_btn_more} ${css.stories_more}`}
                             onClick={handleLoadMore}
                                disabled={loading}>
                             Переглянути ще 
                            </button>
                        )}
                        </div>
                )}
                </>
            );
         }
  





// export const stories: Story[] = [
//   {
//     _id: '1',
//     img: '/images/hero/hero_desk@2x.webp',
//     title: 'Trip to the Mountains',
//     article: 'Amazing trip to the Himalayas...',
//     category: { _id: '1', name: 'Adventure' },
//     ownerId: { _id: 'user1', name: '/images/hero/hero_desk@2x.webp' },
//     date: '2023-02-22',
//     favoriteCount: 15,
//   },
//   {
//     _id: '2',
//     img: '/images/hero/hero_desk@2x.webp',
//     title: 'Beach Vacation',
//     article: 'Spent a week in Bali...',
//     category: { _id: '2', name: 'Beach' },
//     ownerId: { _id: 'user2', name: 'Jane Doe' },
//     date: '2023-02-23',
//     favoriteCount: 25,
//   },
//    {
//     _id: '3',
//     img: '/images/hero/hero_desk@2x.webp',
//     title: 'Mountain Hiking',
//     article: 'Hiked the Alps...',
//     category: { _id: '3', name: 'Hiking' },
//     ownerId: { _id: 'user3', name: 'Bob Smith' },
//     date: '2023-02-23',
//     favoriteCount: 25,
//   },
//    {
//     _id: '4',
//     img: '/images/hero/hero_desk@2x.webp',
//     title: 'Beach Vacation',
//     article: 'Spent a week in Bali...',
//     category: { _id: '4', name: 'Beach' },
//     ownerId: { _id: 'user2', name: 'Jane Doe' },
//     date: '2023-02-23',
//     favoriteCount: 25,
//   }
// ];