import { NextRequest, NextResponse } from 'next/server';
import { api } from '../../api';
import { cookies } from 'next/headers';
//
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../../_utils/utils';
//

export async function GET(request: NextRequest) {
  const page = request.nextUrl.searchParams.get('page');
  const perPage = request.nextUrl.searchParams.get('perPage');

  try {
    const cookieStore = await cookies();

    const { data } = await api.get('/stories/my', {
      params: {
        page,
        perPage,
      },
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    //   catch (error) {
    //     return NextResponse.json(
    //       {
    //         error:
    //           (error as ApiError).response?.data?.error ??
    //           (error as ApiError).message,
    //       },
    //       { status: (error as ApiError).status }
    //     );
    //   }
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
