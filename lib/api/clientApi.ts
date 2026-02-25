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

// getUsers

export interface GetUsersProps {
  page?: number;
  perPage?: number;
}

export interface GetUsersResponse {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  users: User[];
}

export async function getUsers({
  page = 1,
  perPage = 4,
}: GetUsersProps): Promise<GetUsersResponse> {
  const options = {
    params: {
      page,
      perPage,
    },
  };
  // const response = await api.get('/users', options);
  const response = await nextServer.get('/users', options);
  return response.data;
}
