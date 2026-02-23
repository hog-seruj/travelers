'use client';
// import {Traveller} from '@/types/story';
import TravellersStoriesItem from '../TravellersStoriesItem/TravellersStoriesItem';
import css from './TravellersStories.module.css';
import { useState, useEffect } from 'react';



export type Traveller = {
  _id: string;
  img: string;
  title: string;
  article: string;
  category: Category;
  ownerId: {
  _id: string;
  name: string;
}
  date: string;
  favoriteCount: number;
  isFavorite?: boolean;
};

export interface Category {
  _id: string;
  name: string;
}


export const travellers: Traveller[] = [
  {
    _id: '1',
    img: '/images/hero/hero_desk@2x.webp',
    title: 'Trip to the Mountains',
    article: 'Amazing trip to the Himalayas...',
    category: { _id: '1', name: 'Adventure' },
    ownerId: { _id: 'user1', name: '/images/hero/hero_desk@2x.webp' },
    date: '2023-02-22',
    favoriteCount: 15,
  },
  {
    _id: '2',
    img: '/images/hero/hero_desk@2x.webp',
    title: 'Beach Vacation',
    article: 'Spent a week in Bali...',
    category: { _id: '2', name: 'Beach' },
    ownerId: { _id: 'user2', name: 'Jane Doe' },
    date: '2023-02-23',
    favoriteCount: 25,
  },
   {
    _id: '3',
    img: '/images/hero/hero_desk@2x.webp',
    title: 'Mountain Hiking',
    article: 'Hiked the Alps...',
    category: { _id: '3', name: 'Hiking' },
    ownerId: { _id: 'user3', name: 'Bob Smith' },
    date: '2023-02-23',
    favoriteCount: 25,
  },
   {
    _id: '4',
    img: '/images/hero/hero_desk@2x.webp',
    title: 'Beach Vacation',
    article: 'Spent a week in Bali...',
    category: { _id: '4', name: 'Beach' },
    ownerId: { _id: 'user2', name: 'Jane Doe' },
    date: '2023-02-23',
    favoriteCount: 25,
  }
];

interface TravellersStoriesProps {
    travellers: Traveller[];
}





export default function TravellersStories({travellers}: TravellersStoriesProps){  
     const [data, setData] = useState<Traveller[]>([]);

  useEffect(() => {
    // Імітуємо асинхронний запит до бази даних (API)
    setTimeout(() => {
      setData(travellers);  // Після затримки дані будуть "завантажені"
    }, 1000); // затримка 1 секунда
  }, [travellers]);
return(
    <ul className={css.storiesList}>
        {data.map(traveller=>(
            <TravellersStoriesItem
            key={traveller._id}
            traveller={traveller} 
    />
    ))}
    </ul>           
    );
}

