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

export interface CategoriesResponse {
  categories: Category[];
}

export interface getStoriesProps {
  page?: number;
  perPage?: number;
  sort?: 'newest' | 'popular';
  category?: string;
  nextPerPage?: number;
}

export type StoryListResponse = {
  page: number;
  perPage: number;
  nextPerPage: number;
  totalStories: number;
  totalPages: number;
  stories: Story[];
};

export interface SavedStory {
  _id: string;
  img: string;
  title: string;
  article: string;
  category: Category;
  date: string;
  favoriteCount: number;
}

export interface UserSavedArticlesResponse {
  status: number;
  message: string;
  data: {
    user: {
      _id: string;
      name: string;
      avatarUrl: string;
      description: string;
      createdAt: string;
    };
    savedStories: SavedStory[];
  };
}

export interface GetSavedStoriesProps {
  page: number;
  perPage: number;
}

export interface SavedStoriesResponse {
  page: number;
  perPage: number;
  totalStories: number;
  totalPages: number;
  stories: Story[];
}
