import axios from 'axios';
import { User } from '@/types/user';
import { Story, StoriesResponse, SavedStory, UserSavedArticlesResponse, StoryByIdResponse} from '@/types/story';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: baseURL,
  // withCredentials: true,
});

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export async function register(userData: RegisterRequest): Promise<User> {
  const { data } = await api.post<User>(`/auth/register`, userData);
  return data;
}

export type LoginRequest = {
  email: string;
  password: string;
};

export async function login(userData: LoginRequest): Promise<User> {
  const { data } = await api.post<User>(`/auth/login`, userData);
  return data;
}


export async function fetchStories(
  page = 1,
  perPage = 3,
  categoryId?: string
): Promise<Story[]> {
  const response = await api.get<StoriesResponse>(`/stories`, {
    params: { page, perPage, sort: 'favoriteCount', category: categoryId },
  });
  return response.data?.data || [];
}


export async function fetchStoryByIdClient(storyId: string): Promise<Story> {
  const response = await api.get<StoryByIdResponse>(`/stories/${storyId}`);
  return response.data.data;
}

export async function fetchSavedStoriesByUserId(
  userId: string
): Promise<SavedStory[]> {
  const res = await api.get<UserSavedArticlesResponse>(
    `/users/${userId}/saved-articles`
  );

  return res.data.data.savedStories;
}