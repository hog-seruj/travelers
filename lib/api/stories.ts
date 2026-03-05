import { Story, StoryListResponse } from "@/types/story";

export const getSavedStories = async (page: number): Promise<StoryListResponse> => {
  const res = await fetch(`/api/stories/saved?page=${page}`);
  if (!res.ok) throw new Error("Failed to fetch saved stories");
  return res.json(); // TS зрозуміє, що це StoryListResponse
};

export const getOwnStories = async (page: number): Promise<StoryListResponse> => {
  const res = await fetch(`/api/stories/own?page=${page}`);
  if (!res.ok) throw new Error("Failed to fetch own stories");
  return res.json(); // TS зрозуміє, що це StoryListResponse
};


export interface StoriesResponse {
  stories: Story[];
  totalPages: number;
};

