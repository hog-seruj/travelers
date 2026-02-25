import axios from 'axios';

const baseURLT = process.env.NEXT_PUBLIC_SERVER_API_URL + '/api';

export const nextServer = axios.create({
  baseURL: baseURLT,
  withCredentials: true,
});

export type CreateStoryResponse = {
  _id: string;
};

export async function createStory(
  formData: FormData
): Promise<CreateStoryResponse> {
  const { data } = await api.post<CreateStoryResponse>('/stories', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
