import { cookies } from 'next/headers';
import { nextServer } from './api';
import { User } from '@/types/user';
import {
  GetOwnStoriesResponse,
  GetUsersProps,
  GetUsersResponse,
} from './clientApi';
import {
  CategoriesResponse,
  GetSavedStoriesProps,
  SavedStoriesResponse,
} from '@/types/story';
import type { StoryListResponse, getStoriesProps } from '@/types/story';

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

// getCategories

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

export const getStories = async ({
  page,
  perPage,
  nextPerPage,
  sort,
  category,
}: getStoriesProps) => {
  const cookieStore = await cookies();
  const res = await nextServer.get<StoryListResponse>('/stories', {
    params: {
      page,
      perPage,
      sort,
      category,
      nextPerPage,
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res.data;
};

// getOwnStories (private)

export const getServerOwnStories = async (page?: number, perPage?: number) => {
  const cookieStore = await cookies();

  const { data } = await nextServer.get<GetOwnStoriesResponse>(`/stories/my`, {
    params: {
      page,
      perPage,
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return data;
};

// getSavedStories

export const getSavedStories = async ({
  page = 1,
  perPage = 6,
}: GetSavedStoriesProps) => {
  const cookieStore = await cookies();
  const res = await nextServer.get<SavedStoriesResponse>('/stories/saved', {
    params: {
      page,
      perPage,
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  
  return res.data;
};
