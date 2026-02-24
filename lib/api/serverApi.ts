
import { api } from './api';
import {
  // CategoriesResponse,
  // Category,
  StoriesResponse,
  Story,
} from '@/types/story';




export async function fetchStoriesServer(
  page: number = 1,
  perPage: number = 10,

//   excludeId?: string
): Promise<Story[]> {
  const response = await api.get<StoriesResponse>(`/stories`, {
    params: { page, perPage}},
  );

  return response.data?.data || [];
}
// sort: 'favoriteCount', excludeId 

// export async function fetchCategories(): Promise<Category[]> {
//   const res = await api.get<CategoriesResponse>('/categories');
//   return res.data.data || [];
// }


