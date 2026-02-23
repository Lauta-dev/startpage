import Clock from '@/components/ui/Clock';
import SearchBar from '@/components/ui/SearchBar';
import AccentPicker from '@/components/ui/AccentPicker';
import ThemeToggle from '@/components/ui/ThemeToggle';
import QuickLinks from '@/components/quick-links/QuickLinks';
import BookmarkGrid from '@/components/bookmarks/BookmarkGrid';
import { Bookmark } from '@/types/bookmark';

interface QuickLink {
  id: number; name: string; url: string;
  icon: string | null; position: number; created_at: string;
}

const StartPage = ({ bookmarks, quickLinks }: { bookmarks: Bookmark[], quickLinks: QuickLink[] }) => (
  <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 28px 80px' }}>

    {/* HEADER — padding: 36px 0 32px igual al HTML */}
    <div style={{
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      padding: '36px 0 32px',
      borderBottom: '1px solid var(--border-dim)',
      marginBottom: '28px',
    }}>
      <Clock />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', paddingTop: '6px' }}>
        <AccentPicker />
      </div>
    </div>

    {/* search-wrap margin-bottom: 24px */}
    <div style={{ marginBottom: '24px' }}>
      <SearchBar />
    </div>

    <QuickLinks quickLinks={quickLinks} />
    <BookmarkGrid bookmarks={bookmarks} />
  </div>
);

export default StartPage;
