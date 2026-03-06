import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/app/api/api';
import { cookies } from 'next/headers';
import { logErrorResponse } from '@/app/api/_utils/utils';
import { isAxiosError } from 'axios';
import { refreshSession } from '@/app/api/_utils/refreshSession';

type Props = {
  params: Promise<{ storyId: string }>;
};

export async function POST(request: NextRequest, { params }: Props) {
  const cookieStore = await cookies();
  const { storyId } = await params;

  try {
    const res = await api.post(`/stories/${storyId}/saved`, null, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (
    error
    // {
    //   return NextResponse.json(
    //     {
    //       error:
    //         (error as ApiError).response?.data?.error ??
    //         (error as ApiError).message,
    //     },
    //     { status: (error as ApiError).status }
    //   );
    // }
  ) {
    //  refresh
    if (isAxiosError(error) && error.response?.status === 401) {
      try {
        const refreshedCookie = await refreshSession();

        // повторюємо оригінальний запит вже з оновленими cookies
        const retryRes = await api.post(`/stories/${storyId}/saved`, null, {
          headers: {
            Cookie: refreshedCookie,
          },
        });

        return NextResponse.json(retryRes.data, { status: retryRes.status });
      } catch {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }
    //
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.status }
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const cookieStore = await cookies();
  const { storyId } = await params;

  try {
    const res = await api.delete(`/stories/${storyId}/saved`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    //  refresh
    if (isAxiosError(error) && error.response?.status === 401) {
      try {
        const refreshedCookie = await refreshSession();

        // повторюємо оригінальний запит вже з оновленими cookies
        const retryRes = await api.delete(`/stories/${storyId}/saved`, {
          headers: {
            Cookie: refreshedCookie,
          },
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
        { status: error.status }
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
