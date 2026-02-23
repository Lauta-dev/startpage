import Clock from '@/components/ui/Clock';
import SearchBar from '@/components/ui/SearchBar';
import AccentPicker from '@/components/ui/AccentPicker';
import QuickLinks from '@/components/quick-links/QuickLinks';
import BookmarkGrid from '@/components/bookmarks/BookmarkGrid';
import type { QuickLink } from '@/components/quick-links/QuickLinks';
import type { Bookmark } from '@/types/bookmark';

interface Props {
  bookmarks:  Bookmark[];
  quickLinks: QuickLink[];
}

const StartPage: React.FC<Props> = ({ bookmarks, quickLinks }) => (
  <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 28px 80px' }}>

    <div
      className="flex items-start justify-between"
      style={{ padding: '36px 0 32px', borderBottom: '1px solid var(--border-dim)', marginBottom: '28px' }}
    >
      <Clock />
      <div className="flex flex-col items-end gap-2.5 pt-1.5">
        <AccentPicker />
      </div>
    </div>

    <div style={{ marginBottom: '24px' }}>
      <SearchBar />
    </div>

    <BookmarkGrid bookmarks={bookmarks} />
  </div>
);

export default StartPage;
