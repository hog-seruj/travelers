import { parse } from 'cookie';
import { api } from '../api';
import { cookies } from 'next/headers';

export async function refreshSession() {
  const cookieStore = await cookies();

  const apiRes = await api.post('/auth/refresh', null, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  // Якщо бекенд повернув нові токени — встановлюємо їх
  const setCookie = apiRes.headers['set-cookie'];
  if (setCookie) {
    const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
    for (const cookieStr of cookieArray) {
      const parsed = parse(cookieStr);
      const options = {
        expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
        path: parsed.Path,
        maxAge: Number(parsed['Max-Age']),
      };
      if (parsed.accessToken)
        cookieStore.set('accessToken', parsed.accessToken, options);
      if (parsed.refreshToken)
        cookieStore.set('refreshToken', parsed.refreshToken, options);
      if (parsed.sessionId)
        cookieStore.set('sessionId', parsed.sessionId, options);
    }
  }
  return cookieStore.toString();
}
