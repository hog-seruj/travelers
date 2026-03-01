import axios from 'axios';

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// використовується у тих, хто ще робить запити напряму на наш бекенд !!
// const baseURL = 'http://localhost:3000/api';

// ✅ беремо бекенд з env (Render або localhost)
const baseURL = process.env.NEXT_PUBLIC_API_URL;

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
export const api = axios.create({
  baseURL: baseURL,
  // withCredentials тут не потрібен,
  // бо ці запити йдуть напряму на backend
});

// axios Next Server !!!! Використовують ті, що переробляє через Next Server !!!!!!!!!!!!!!

// ✅ залишаємо як у командному проєкті
// Next proxy працює через /api
const baseURLT = process.env.NEXT_PUBLIC_SERVER_URL + '/api';

export const nextServer = axios.create({
  baseURL: baseURLT,
  withCredentials: true,
});

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

/*
|--------------------------------------------------------------------------
| TYPES
|--------------------------------------------------------------------------
*/

export type CreateStoryResponse = {
  _id: string;
};

// ✅ МОЯ ПРАВКА:
// потрібен тип історії для сторінки редагування
// (EditStoryPage отримує дані історії)
export interface StoryResponse {
  _id: string;
  img: string;
  title: string;
  article: string;
  category: {
    _id: string;
    name: string;
  };
  ownerId: {
    _id: string;
    name: string;
    avatarUrl: string;
  };
  date: string;
  favoriteCount: number;
}

/*
|--------------------------------------------------------------------------
| CREATE STORY
|--------------------------------------------------------------------------
*/

export async function createStory(
  formData: FormData
): Promise<CreateStoryResponse> {
  const { data } = await api.post<CreateStoryResponse>(
    '/stories',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );

  return data;
}

/*
|--------------------------------------------------------------------------
| GET STORY BY ID
|--------------------------------------------------------------------------
*/
// ✅ МОЯ ПРАВКА:
// потрібна для EditStoryPage,
// щоб заповнити форму існуючими даними

export async function getStory(
  storyId: string
): Promise<StoryResponse> {
  const { data } = await api.get<StoryResponse>(
    `/stories/${storyId}`
  );

  return data;
}

/*
|--------------------------------------------------------------------------
| UPDATE STORY
|--------------------------------------------------------------------------
*/
// ✅ МОЯ ПРАВКА:
// використовується тільки сторінкою редагування історії

export async function updateStory(
  storyId: string,
  formData: FormData
): Promise<CreateStoryResponse> {
  const { data } = await api.patch<CreateStoryResponse>(
    `/stories/${storyId}`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );

  return data;
}