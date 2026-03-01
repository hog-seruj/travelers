import { cookies } from 'next/headers';
import { nextServer } from './api';
import { User } from '@/types/user';
import {Story, Category, CategoriesResponse} from '@/types/story'



export const checkServerSession = async () => {
  // Дістаємо поточні cookie
  const cookieStore = await cookies();
  const res = await nextServer.post('/auth/refresh', {
    headers: {
      // передаємо кукі далі
      Cookie: cookieStore.toString(),
    },
  });
  // Повертаємо повний респонс, щоб proxy мав доступ до нових cookie
  return res;
};

export const getServerMe = async (): Promise<User> => {
  const cookieStore = await cookies();
  const { data } = await nextServer.get('/users/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};




export type StoryListResponse = {
   page: number;
  perPage: number;
  totalStories: number;
  totalPages: number;
  stories: Story[];
};

export const getStories = async (
  page?: number,
  perPage?: number,
  sort?: 'newest' | 'popular',
  category?: Category
) => {
  const res = await nextServer.get<StoryListResponse>('/stories', {
    params: {
      page,
      perPage,
      sort,
      category,
    },
  });
  return res.data;
};


export const getCategories= async (): Promise<Category[]>=> {
  const {data} = await nextServer.get<CategoriesResponse>('/categories');
  return data.data;
};

