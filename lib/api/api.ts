import axios from 'axios';
import { User } from '@/types/user';

const baseURLT = process.env.NEXT_PUBLIC_SERVER_API_URL + '/api';

export const nextServer = axios.create({
  baseURL: baseURLT,
  withCredentials: true,
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

export type CreateStoryResponse = {
  _id: string;
};

export async function createStory(
  formData: FormData
): Promise<CreateStoryResponse> {
  const { data } = await api.post<CreateStoryResponse>('/stories', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
