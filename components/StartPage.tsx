import Clock from '@/components/ui/Clock';
import SearchBar from '@/components/ui/SearchBar';
import QuickLinks from '@/components/quick-links/QuickLinks';
import BookmarkGrid from '@/components/bookmarks/BookmarkGrid';
import { Bookmark } from '@/lib/types';

interface QuickLink {
  id: number;
  name: string;
  url: string;
  icon: string | null;
  position: number;
  created_at: string;
}

const StartPage = ({
  bookmarks,
  quickLinks
}: { bookmarks: Bookmark[], quickLinks: QuickLink[] }) => {
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <Clock />
      <SearchBar />
      <QuickLinks quickLinks={quickLinks} />
      <BookmarkGrid bookmarks={bookmarks} />
    </div>
  );
};

export default StartPage;
