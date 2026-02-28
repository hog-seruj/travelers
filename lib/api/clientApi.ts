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

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export async function register(userData: RegisterRequest): Promise<User> {
  const { data } = await nextServer.post<User>(`/auth/register`, userData);
  return data;
}

export type LoginRequest = {
  email: string;
  password: string;
};

export async function login(userData: LoginRequest): Promise<User> {
  const { data } = await nextServer.post<User>(`/auth/login`, userData);
  return data;
}
// getUsers

interface GetUsersProps {
  page?: number;
  perPage?: number;
}

interface GetUsersResponse {
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

// Add story to saved
interface addStoryToSavedResponse {
  savedArticles: User['savedArticles'];
}

export const addStoryToSaved = async (
  storyId: Story['_id']
): Promise<addStoryToSavedResponse> => {
  const response = await nextServer.post<addStoryToSavedResponse>(
    `/stories/${storyId}/saved`
    // {
    //   headers: {},
    // }
  );
  return response.data;
};
