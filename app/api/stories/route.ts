import { NextRequest, NextResponse } from 'next/server';
import { api, ApiError } from '../api';

export async function GET(request: NextRequest) {
  const page = request.nextUrl.searchParams.get('page');
  const perPage = request.nextUrl.searchParams.get('perPage');
  const sort = request.nextUrl.searchParams.get('sort');
  const category = request.nextUrl.searchParams.get('category');

  try {
    const { data } = await api('/stories', {
      params: {
        page,
        perPage,
        sort,
        category: category || undefined,
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
