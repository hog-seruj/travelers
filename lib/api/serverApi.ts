import { cookies } from 'next/headers';
import { nextServer } from './api';
import { User } from '@/types/user';
import { Story } from '@/types/story';

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
export type StoriesResponse = {
  page: number;
  perPage: number;
  totalStories: number;
  totalPages: number;
  stories: Story[];
};

type GetStoriesParams = {
  page?: number;
  perPage?: number;
};

// Saved stories (private)
export const getSavedStories = async ({
  page = 1,
  perPage = 8,
}: GetStoriesParams): Promise<StoriesResponse> => {
  const res = await nextServer.get<StoriesResponse>('/stories/saved', {
    params: { page, perPage },
  });
  return res.data;
};

// Own stories (private)
export const getOwnStories = async ({
  page = 1,
  perPage = 8,
}: GetStoriesParams): Promise<StoriesResponse> => {
  const res = await nextServer.get<StoriesResponse>('/stories/my', {
    params: { page, perPage },
  });
  return res.data;
};