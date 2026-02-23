export interface Bookmark {
  id: number;
  title: string;
  url: string;
  image: string | null;
  desc: string | null;
  ogTitle: string | null;
  category: string;
  category_id: number | null;
  createdAt: string;
}
