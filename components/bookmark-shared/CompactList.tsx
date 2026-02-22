import { Bookmark } from "@/types/bookmark";

function getFavicon(url: string) {
  try { return `https://www.google.com/s2/favicons?sz=32&domain=${new URL(url).hostname}`; }
  catch { return ''; }
}

function getDomain(url: string) {
  try { return new URL(url).hostname.replace('www.', ''); }
  catch { return url; }
}

function getTitle(bookmark: Bookmark) {
  return bookmark.ogTitle ?? bookmark.title;
}

const CompactList = ({ bookmarks }: { bookmarks: Bookmark[] }) => {
  return (
    <ul
      className="list rounded-box border-0"
    >
      {bookmarks.map((bookmark) => (
        <li
          key={bookmark.id}
          className="mb-4"
          style={{ borderColor: "var(--border)" }}
        >
            <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex list-row items-center gap-3  px-4 py-3 rounded-box duration-150"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'var(--bg-overlay)';
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'var(--bg-surface)';
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
            }}
          >
            {/* Favicon */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div className="w-8 h-8 rounded-lg p-1.5 flex-shrink-0 flex items-center justify-center"
                 style={{ background: 'var(--bg-elevated)' }}>
              <img src={getFavicon(bookmark.url)} alt={bookmark.title} className="w-full h-full object-contain" />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate flex gap-1 items-center" style={{ color: "var(--text-primary)" }}>
                {getTitle(bookmark)}
                <span
              className="text-xs hidden sm:block shrink-0 px-1 py-0.3 rounded-full"
              style={{
                color: "var(--text-secondary)",
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
              }}
            >
              {getDomain(bookmark.url)}
            </span>
              </p>
              <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
                {bookmark.desc ?? getDomain(bookmark.url)}
              </p>
            </div>
            
          </a>
        </li>
      ))}
    </ul>
  );
};

export default CompactList;
