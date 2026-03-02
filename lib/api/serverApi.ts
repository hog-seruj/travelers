import { cookies } from 'next/headers';
import { nextServer } from './api';
import { User } from '@/types/user';
import { GetUsersProps, GetUsersResponse } from './clientApi';
import { Category, CategoriesResponse } from '@/types/story';
import type { StoryListResponse } from './clientApi';

export const checkServerSession = async () => {
  // Дістаємо поточні cookie
  const cookieStore = await cookies();
  const res = await nextServer.post('/auth/refresh', null, {
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
  return data.user;
};

// getUsers
export async function getUsers({
  page = 1,
  perPage = 4,
}: GetUsersProps): Promise<GetUsersResponse> {
  const cookieStore = await cookies();
  const options = {
    params: {
      page,
      perPage,
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  };

  const response = await nextServer.get('/users', options);
  return response.data;
}

export const getCategories = async (): Promise<CategoriesResponse> => {
  const cookieStore = await cookies();
  const response = await nextServer.get<CategoriesResponse>('/categories', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response.data;
};

// getStories

export interface GetStoriesProps {
  page?: number;
  perPage?: number;
  sort?: string;
  category?: string;
}
export const getStories = async ({
  page,
  perPage,
  sort,
  category,
}: GetStoriesProps) => {
  const cookieStore = await cookies();
  const res = await nextServer.get<StoryListResponse>('/stories', {
    params: {
      page,
      perPage,
      sort,
      category,
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res.data;
};
