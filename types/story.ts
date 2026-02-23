
export type Story = {
  _id: string;
  img: string;
  title: string;
  article: string;
  category: Category; 
  ownerId: {
    _id: string;
    name: string
  };
  date: string;
  favoriteCount: number;
  isFavorite?: boolean;
};

export interface Category {
  _id: string;
  name: string;
}


export interface SavedStory {
  _id: string;
  img: string;
  title: string;
  article: string;
  category: Category;
  date: string;
  favoriteCount: number;
}


export interface StoriesResponse {
  status: number;
  message: string;
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  data: Story[];
}


export interface UserSavedArticlesResponse {
  status: number;
  message: string;
  data: {
    user?: {
      _id: string;
      name: string;
      avatarUrl: string;
      description: string;
      createdAt: string;
    };
    savedStories: SavedStory[];
  };
}

export type StoryByIdResponse = {
  status: number;
  message: string;
  data: {
    _id: string;
    img: string;
    title: string;
    article: string;
    category: {
     _id: string;
      name: string;
    };
    ownerId: {
      _id: string;
      name: string;
      avatarUrl: string;
      description: string;
    };
    date: string;
    favoriteCount: number;
  };
};