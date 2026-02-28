import { cookies } from 'next/headers';
import { nextServer } from './api';
import { User } from '@/types/user';

export const checkServerSession = async () => {
  // Дістаємо поточні cookie
  const cookieStore = await cookies();
  const res = await nextServer.post('/auth/refresh', {
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
  return data;
};

// Add story to saved
// interface addStoryToSavedResponse {
//   savedArticles: User['savedArticles'];
// }

// export const addStoryToSaved = async (
//   storyId: Story['_id']
// ): Promise<addStoryToSavedResponse> => {
//   const cookieStore = await cookies();
//   const response = await nextServer.post<addStoryToSavedResponse>(
//     `/stories/${storyId}/saved`,
//     {
//       headers: {
//         Cookie: cookieStore.toString(),
//       },
//     }
//   );
//   return response.data;
// };
