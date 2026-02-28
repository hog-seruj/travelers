export interface Story {
  _id: string;
  img: string;
  title: string;
  article: string;
  category: Category;
  ownerId: {
    _id: string;
    name: string;
    avatarUrl: string;
  };
  date: string;
  favoriteCount: number;
}

export interface Category {
  _id: string;
  name: string;
}


export type StoryListResponse = {
  page: number;
  perPage: number;
  totalStories: number;
  totalPages: number;
  stories: Story[];
};

export type PaginatedStoriesResponse = {
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  data: Story[];
};