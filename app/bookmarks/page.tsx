import getBookmarks from '@/actions/getBookmark';
import { BookmarksPage  } from '@/components/bookmarks-list/BookmarkLayout';

export default async function Page() {
  const bookmarks = await getBookmarks();
  return <>
    <BookmarksPage  bookmarks={bookmarks} />
  </>;
}
