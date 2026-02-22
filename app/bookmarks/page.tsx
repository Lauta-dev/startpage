import { BookmarksPage  } from '@/components/bookmarks-list/BookmarkLayout';
import client from '@/lib/db'; // adjust to your db client
import { Bookmark } from '@/types/bookmark';

async function getBookmarks(): Promise<Bookmark[]> {
  const result = await client
    .execute(`
      SELECT id, title, url, category,
             og_image, og_description, og_title, created_at
      FROM bookmarks
      ORDER BY created_at DESC
    `)
  
  const rows = result.rows.map(({
    id,
    title,
    url,
    category,
    og_image,
    og_description, og_title, created_at}) => ({
    id, title, url, image: og_image,
      desc: og_description, ogTitle: og_title, createdAt: created_at, category
  })) as unknown as Bookmark[]

  return rows
}

export default async function Page() {
  const bookmarks = await getBookmarks();
  return <>
    <BookmarksPage  bookmarks={bookmarks} />
  </>;
}
