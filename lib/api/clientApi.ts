import { nextServer } from './api';
import { Story, SavedStory, UserSavedArticlesResponse } from '@/types/story';
import { User } from '@/types/user';
import {
  CategoriesResponse,
  getStoriesProps,
  StoryListResponse,
  Category,
} from '@/types/story';

// getStories with pagination, sorting and filtering by category

export async function getStories({
  page,
  perPage,
  sort,
  category,
  nextPerPage,
}: getStoriesProps): Promise<StoryListResponse> {
  const res = await nextServer.get<StoryListResponse>('/stories', {
    params: {
      page,
      perPage,
      sort,
      category,
      nextPerPage,
    },
  });
  return res.data;
}

export const getStory = async (storyId: string) => {
  const res = await nextServer.get<Story>(`/stories/${storyId}`);
  return res.data;
};

// fetch list of categories (used in create / edit story forms)
export const getCategories = async (): Promise<Category[]> => {
  const res = await nextServer.get<{ categories: Category[] }>('/categories');
  return res.data.categories;
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
interface GetMeResponse {
  success: boolean;
  user: User;
}

export const getMe = async (): Promise<User> => {
  const { data } = await nextServer.get<GetMeResponse>('/users/me');
  return data.user;
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

export interface GetUsersProps {
  page?: number;
  perPage?: number;
  nextPerPage?: number;
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
  nextPerPage,
}: GetUsersProps): Promise<GetUsersResponse> {
  const options = {
    params: {
      page,
      perPage,
      nextPerPage,
    },
  };

  const response = await nextServer.get('/users', options);
  return response.data;
}

export const getCategoriesT = async (): Promise<CategoriesResponse> => {
  const response = await nextServer.get<CategoriesResponse>('/categories');
  return response.data;
};

export const fetchSavedStoriesByUserId = async (
  userId: string
): Promise<SavedStory[]> => {
  const res = await nextServer.get<UserSavedArticlesResponse>(
    `/users/${userId}/saved`
  );

  return res.data.data.savedStories;
};
// Add story to saved
interface addStoryToSavedResponse {
  savedArticles: User['savedArticles'];
}

export const addStoryToSaved = async (
  storyId: Story['_id']
): Promise<addStoryToSavedResponse> => {
  const response = await nextServer.post<addStoryToSavedResponse>(
    `/stories/${storyId}/saved`
  );
  console.log(response.data);
  return response.data;
};

// Remove story from saved
interface removeStoryFromSavedResponse {
  stories: User['savedArticles'];
}

export const removeStoryFromSaved = async (
  storyId: Story['_id']
): Promise<removeStoryFromSavedResponse> => {
  const response = await nextServer.delete<removeStoryFromSavedResponse>(
    `/stories/${storyId}/saved`
  );
  console.log(response.data);
  return response.data;
};

export interface GetUserResponse {
  user: User;
  articles: {
    page: number;
    perPage: number;
    totalPages: number;
    articles: Story[];
    totalArticles: number;
  };
}

export async function getUserById(
  id: User['_id'],
  page?: number,
  perPage?: number
) {
  const { data } = await nextServer.get<GetUserResponse>(`/users/${id}`, {
    params: {
      page,
      perPage,
    },
  });
  return data;
}

// getOwnStories (private)

interface GetOwnStoriesResponse {
  page: number;
  perPage: number;
  totalStories: number;
  totalPages: number;
  stories: Story[];
}

export const getOwnStories = async (page?: number, perPage?: number) => {
  const { data } = await nextServer.get<GetOwnStoriesResponse>(`/stories/my`, {
    params: {
      page,
      perPage,
    },
  });

  return data;
};
