import axios from 'axios';

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! використовується у тих, хто ще робить запити напряму на наш бекенд !!
const baseURL = 'http://localhost:3000/api';

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// export const nextServer = axios.create({
export const api = axios.create({
  baseURL: baseURL,
  // withCredentials: true,
});

const baseURLT = process.env.NEXT_PUBLIC_SERVER_URL + '/api';
export const nextServer = axios.create({
  baseURL: baseURLT,
  withCredentials: true,
});
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

import { Story, Category } from '@/types/story';

export type CreateStoryResponse = {
  _id: string;
};

// convenient alias used by AddStoryForm (was previously imported but not defined)
export type StoryResponse = Story;

export async function createStory(
  formData: FormData
): Promise<CreateStoryResponse> {
  // use nextServer proxy so cookies are forwarded automatically
  const res = await nextServer.post('/stories', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  // backend may return _id either at root or inside data
  return { _id: res.data.data?._id ?? res.data._id };
}

// update existing story (edit mode)
export async function updateStory(
  storyId: string,
  formData: FormData
): Promise<CreateStoryResponse> {
  const res = await nextServer.patch(`/stories/${storyId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return { _id: res.data.data?._id ?? res.data._id };
}

// fetch categories list for forms
export async function getCategories(): Promise<Category[]> {
  const res = await nextServer.get<{ categories: Category[] }>('/categories');
  return res.data.categories;
}
