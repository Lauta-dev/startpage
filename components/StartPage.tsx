import Clock from '@/components/ui/Clock';
import SearchBar from '@/components/ui/SearchBar';
import AccentPicker from '@/components/ui/AccentPicker';
import ThemeToggle from '@/components/ui/ThemeToggle';
import QuickLinks from '@/components/quick-links/QuickLinks';
import BookmarkGrid from '@/components/bookmarks/BookmarkGrid';
import { Bookmark } from '@/types/bookmark';

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
      <div className="flex justify-between items-start mb-8 sm:mb-10 pt-2">
        <Clock />
        <div className="flex items-center gap-3 pt-1">
          <ThemeToggle />
          <AccentPicker />
        </div>
      </div>
      <SearchBar />
      <QuickLinks quickLinks={quickLinks} />
      <BookmarkGrid bookmarks={bookmarks} />
    </div>
  );
};

export default StartPage;
