export interface Bookmark {
  id: number;
  title: string;
  url: string;
  category: string;
  image: string | null;
  desc: string | null;
  ogTitle: string | null;
  createdAt: string;
}
