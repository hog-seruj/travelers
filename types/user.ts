export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  avatarUrl: string;
  description: string;
  articlesAmount: number;
  savedArticles: string[];
}
