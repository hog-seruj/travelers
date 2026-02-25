import { nextServer } from './api';
import { Category, Story } from '@/types/story';
import { User } from '@/types/user';

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

// silent authentication logic
type CheckSessionRequest = {
  success: boolean;
};

export const checkSession = async () => {
  const res = await nextServer.post<CheckSessionRequest>('/auth/refresh');
  return res.data.success;
};

// get me
export const getMe = async () => {
  const { data } = await nextServer.get<User>('/users/me');
  return data;
};

//logout
export const logout = async (): Promise<void> => {
  await nextServer.post('/auth/logout');
};
