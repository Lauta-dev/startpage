export const dynamic = 'force-dynamic';

import getBookmarks from '@/actions/getBookmark';
import GetQuickLinks from '@/actions/getQuickLinks';
import StartPage from '@/components/StartPage';

export default async function Home() {
  const bookmarks = await getBookmarks()
  const x = await GetQuickLinks()
  return <StartPage bookmarks={bookmarks} quickLinks={x.res}  />;
}
