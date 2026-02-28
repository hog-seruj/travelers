import axios from 'axios';
import { User } from '@/types/user';

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! використовується у тих, хто ще робить запити напряму на наш бекенд !!
// const baseURL = 'http://localhost:3000/api';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// export const nextServer = axios.create({
export const api = axios.create({
  baseURL: baseURL,
  // withCredentials: true,
});

// axios Next Server !!!! Використовують ті, що переробляє через Next Server !!!!!!!!!!!!!!

const baseURLT = 'http://localhost:3000/ + /api'
// const baseURLT = process.env.NEXT_PUBLIC_SERVER_URL + '/api';

export const nextServer = axios.create({
  baseURL: baseURLT,
  withCredentials: true,
});
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

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
  const response = await api.get('/users', options);
  return response.data;
}

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
