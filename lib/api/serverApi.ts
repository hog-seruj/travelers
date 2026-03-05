import { cookies } from 'next/headers';
import { nextServer } from './api';
import { User } from '@/types/user';
import {
  GetUsersProps,
  GetUsersResponse,
  GetUserResponse, // ✅ Додано
} from './clientApi';
import { CategoriesResponse } from '@/types/story';
import type {
  StoryListResponse,
  getStoriesProps,
  SavedStory, // ✅ Додано
  UserSavedArticlesResponse, // ✅ Додано
  Story, // ✅ Додано
} from '@/types/story';

export const checkServerSession = async () => {
  // Дістаємо поточні cookie
  const cookieStore = await cookies();
  const res = await nextServer.post('/auth/refresh', null, {
    headers: {
      // передаємо кукі далі
      Cookie: cookieStore.toString(),
    },
  });
  // Повертаємо повний респонс, щоб proxy мав доступ до нових cookie
  return res;
};

export const getServerMe = async (): Promise<User> => {
  const cookieStore = await cookies();
  const { data } = await nextServer.get('/users/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data.user;
};

// getUsers
export async function getUsers({
  page = 1,
  perPage = 4,
}: GetUsersProps): Promise<GetUsersResponse> {
  const cookieStore = await cookies();
  const options = {
    params: {
      page,
      perPage,
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  };

  const response = await nextServer.get('/users', options);
  return response.data;
}

// getCategories

export const getCategories = async (): Promise<CategoriesResponse> => {
  const cookieStore = await cookies();
  const response = await nextServer.get<CategoriesResponse>('/categories', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response.data;
};

// getStories

export const getStories = async ({
  page,
  perPage,
  nextPerPage,
  sort,
  category,
}: getStoriesProps) => {
  const cookieStore = await cookies();
  const res = await nextServer.get<StoryListResponse>('/stories', {
    params: {
      page,
      perPage,
      sort,
      category,
      nextPerPage,
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res.data;
};

// ===== ПРОФІЛЬ: Збережені історії (сервер) - ВИПРАВЛЕНО =====
export const getSavedStoriesServer = async (): Promise<Story[]> => {
  const cookieStore = await cookies();

  try {
    // Спроба 1: прямий endpoint
    const res = await nextServer.get<UserSavedArticlesResponse>(
      '/users/me/saved',
      {
        headers: { Cookie: cookieStore.toString() },
      }
    );
    return res.data.data.savedStories as Story[];
  } catch (error: unknown) {
    // Спроба 2: якщо 404 — беремо ID і завантажуємо повні дані
    if (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      typeof (error as { response?: { status?: number } }).response?.status ===
        'number'
    ) {
      const status = (error as { response: { status: number } }).response
        .status;

      if (status === 404) {
        const profileRes = await nextServer.get<GetUserResponse>('/users/me', {
          headers: { Cookie: cookieStore.toString() },
        });
        const savedIds = profileRes.data.user.savedArticles;

        if (!savedIds || savedIds.length === 0) return [];

        // Завантажуємо повні дані кожної статті (Story[] з ownerId)
        const storiesPromises = savedIds.map((id: string) =>
          nextServer
            .get<Story>(`/stories/${id}`, {
              headers: { Cookie: cookieStore.toString() },
            })
            .then((res) => res.data)
        );

        const stories = await Promise.all(storiesPromises);
        return stories;
      }
    }
    throw error;
  }
};

// ===== ПРОФІЛЬ: Власні історії (сервер) =====
export const getOwnStoriesServer = async (
  page = 1,
  perPage = 10
): Promise<Story[]> => {
  const cookieStore = await cookies();
  try {
    const { data } = await nextServer.get<GetUserResponse>('/users/me', {
      params: { page, perPage },
      headers: { Cookie: cookieStore.toString() },
    });
    return data.articles?.articles ?? [];
  } catch (error) {
    console.error('Error fetching own stories:', error);
    return [];
  }
};
