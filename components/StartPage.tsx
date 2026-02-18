import Clock from '@/components/ui/Clock';
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
    <div className="glass-container rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 m-2 sm:m-4 mx-auto bg-[#121212] border-0 abc">
      <Clock />
      <QuickLinks quickLinks={quickLinks} />
      <BookmarkGrid bookmarks={bookmarks} /> 
    </div>
  );
};

export default StartPage;
