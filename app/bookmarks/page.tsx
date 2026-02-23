import getBookmarks from '@/actions/getBookmark';
import { BookmarkLayout } from '@/components/bookmarks/BookmarkLayout';

export const dynamic = 'force-dynamic';

export default async function BookmarksPage() {
  const bookmarks = await getBookmarks();
  return <BookmarkLayout bookmarks={bookmarks} />;
}
