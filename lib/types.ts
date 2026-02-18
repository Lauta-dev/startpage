export interface Bookmark {
  id: number;
  title: string;
  site: string;
  favicon: string;
  ogImage: string
}

export interface BookmarkEdit {
  title: string; url: string;
}
