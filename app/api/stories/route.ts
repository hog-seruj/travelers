import { NextRequest, NextResponse } from 'next/server';
import { api, ApiError } from '../api';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../_utils/utils';
import { refreshSession } from '../_utils/refreshSession';

export async function GET(request: NextRequest) {
  const page = request.nextUrl.searchParams.get('page');
  const perPage = request.nextUrl.searchParams.get('perPage');
  const nextPerPage = request.nextUrl.searchParams.get('nextPerPage');
  const sort = request.nextUrl.searchParams.get('sort');
  const category = request.nextUrl.searchParams.get('category');

  try {
    const { data } = await api('/stories', {
      params: {
        page,
        perPage,
        nextPerPage,
        sort,
        category,
      },
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          (error as ApiError).response?.data?.error ??
          (error as ApiError).message,
      },
      { status: (error as ApiError).status }
    );
  }
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  // forward multipart/form-data body as is
  const body = await request.formData();
  try {
    const res = await api.post('/stories', body, {
      headers: {
        Cookie: cookieStore.toString(),
        // let axios set the content type boundary automatically
      },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    //  refresh
    if (isAxiosError(error) && error.response?.status === 401) {
      try {
        const refreshedCookie = await refreshSession();

        // повторюємо оригінальний запит вже з оновленими cookies
        const retryRes = await api.post('/stories', body, {
          headers: { Cookie: refreshedCookie },
        });

        return NextResponse.json(retryRes.data, { status: retryRes.status });
      } catch {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.response?.status ?? 500 }
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
