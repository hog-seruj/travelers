import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { api } from '../../api';

export async function POST() {
  // Передаємо поточні cookie до API
  const cookieStore = await cookies();
  await api.post('auth/logout', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  // Очищаємо токени після запиту
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');

  return NextResponse.json({ message: 'Logged out successfully' });
}
