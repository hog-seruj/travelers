// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// import { nextServer } from './api';

import { Category, Story } from '@/types/story';
import { api } from './api';
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
  // const res = await nextServer.get<StoryListResponse>('/stories', {
  const res = await api.get<StoryListResponse>('/stories', {
    params: {
      page,
      perPage,
      sort,
      category,
    },
  });
  return res.data;
};





