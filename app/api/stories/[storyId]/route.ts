import { NextRequest, NextResponse } from 'next/server';
import { api, ApiError } from '../../api';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../../_utils/utils';

type Props = {
  params: Promise<{ storyId: string }>;
};

export async function GET(
  request: NextRequest,
  { params }: Props
) {
  try {
    const { storyId } = await params;
    const { data } = await api(`/stories/${storyId}`);
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

export async function POST(
  request: NextRequest,
  { params }: Props
) {
  try {
    const { storyId } = await params;
    const { data } = await api.post(`/stories/${storyId}/favoriteCount`);
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

export async function PATCH(
  request: NextRequest,
  { params }: Props
) {
  const cookieStore = await cookies();
  try {
    const { storyId } = await params;
    const body = await request.formData();
    const res = await api.patch(`/stories/${storyId}`, body, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
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
