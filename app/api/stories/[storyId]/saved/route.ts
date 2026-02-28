import { NextRequest, NextResponse } from 'next/server';
import { api, ApiError } from '@/app/api/api';
import { cookies } from 'next/headers';

type Props = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, { params }: Props) {
  const cookieStore = await cookies();
  const { id } = await params;

  try {
    const res = await api.post(`/stories/${id}/saved`, null, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return NextResponse.json(res.data, { status: res.status });
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

// copy
// import { NextRequest, NextResponse } from 'next/server';
// import { api, ApiError } from '@/app/api/api';
// import { cookies } from 'next/headers';
// import { logErrorResponse } from '@/app/api/_utils/utils';
// import { isAxiosError } from 'axios';

// type Props = {
//   params: Promise<{ id: string }>;
// };

// export async function POST(request: NextRequest, { params }: Props) {
//   const { id } = await params;

//   try {
//     const cookieStore = await cookies();
//     const res = await api.post(`/stories/${id}/saved`, {
//       headers: {
//         Cookie: cookieStore.toString(),
//       },
//     });
//     return NextResponse.json(res.data, { status: res.status });
//   } catch (error) {
//     if (isAxiosError(error)) {
//       logErrorResponse(error.response?.data);
//       return NextResponse.json(
//         { error: error.message, response: error.response?.data },
//         { status: error.status }
//       );
//     }
//     logErrorResponse({ message: (error as Error).message });
//     return NextResponse.json(
//       { error: 'Internal Server Error' },
//       { status: 500 }
//     );
//   }
// }
