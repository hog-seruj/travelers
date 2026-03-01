import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parse } from 'cookie';
import { checkServerSession } from './lib/api/serverApi';

const publicRoutes = ['/auth'];

function isPrivatePath(pathname: string) {
  if (pathname.startsWith('/profile')) return true;
  if (pathname === '/stories/create') return true;
  // /stories/:storyId/edit
  if (pathname.startsWith('/stories/') && pathname.endsWith('/edit'))
    return true;
  return false;
}

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const { pathname } = request.nextUrl;
  const isPrivateRoute = isPrivatePath(pathname);
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isPublicRoute && accessToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (isPrivateRoute) {
    if (!accessToken) {
      if (refreshToken) {
        // Отримуємо нові cookie
        const data = await checkServerSession();
        const setCookie = data.headers['set-cookie'];

        if (setCookie) {
          const cookieArray = Array.isArray(setCookie)
            ? setCookie
            : [setCookie];
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

          // важливо — передаємо нові cookie далі, щоб оновити їх у браузері
          return NextResponse.next({
            headers: {
              Cookie: cookieStore.toString(),
            },
          });
        }
      }

      // немає жодного токена — редірект на сторінку входу
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  // публічний маршрут або accessToken є — дозволяємо доступ
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/auth/:path*',
    '/stories/create',
    '/stories/:storyId/edit',
  ],
};
