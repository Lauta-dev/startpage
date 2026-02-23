import { Bookmark } from "@/types/bookmark";

function getFavicon(url: string) {
  try { return `https://www.google.com/s2/favicons?sz=32&domain=${new URL(url).hostname}`; }
  catch { return ''; }
}
function getDomain(url: string) {
  try { return new URL(url).hostname.replace('www.', ''); }
  catch { return url; }
}
function getTitle(b: Bookmark) { return b.ogTitle ?? b.title; }

const mono: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace" };

const CompactList = ({ bookmarks }: { bookmarks: Bookmark[] }) => (
  <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--border-dim)' }}>
    {bookmarks.map(bookmark => (
      <a key={bookmark.id} href={bookmark.url} target="_blank" rel="noopener noreferrer"
        style={{ display: 'flex', alignItems: 'center', gap: '10px',
          padding: '9px 14px', borderBottom: '1px solid var(--border-dim)',
          textDecoration: 'none', color: 'var(--text-secondary)', transition: 'background 0.1s, padding-left 0.12s' }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.background = 'var(--bg-overlay)';
          el.style.paddingLeft = '18px';
          const title = el.querySelector('.cl-title') as HTMLElement;
          if (title) title.style.color = 'var(--accent)';
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.background = 'transparent';
          el.style.paddingLeft = '14px';
          const title = el.querySelector('.cl-title') as HTMLElement;
          if (title) title.style.color = 'var(--text-secondary)';
        }}
      >
        <div style={{ width: '24px', height: '24px', borderRadius: '2px', border: '1px solid var(--border-dim)',
          background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={getFavicon(bookmark.url)} alt="" style={{ width: '13px', height: '13px', objectFit: 'contain', opacity: 0.7 }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p className="cl-title" style={{ ...mono, fontSize: '0.75rem', fontWeight: 500,
            color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis',
            whiteSpace: 'nowrap', transition: 'color 0.12s', margin: 0 }}>
            {getTitle(bookmark)}
          </p>
          <p style={{ ...mono, fontSize: '0.62rem', color: 'var(--text-muted)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>
            {bookmark.desc ?? getDomain(bookmark.url)}
          </p>
        </div>
        <span style={{ ...mono, fontSize: '0.6rem', color: 'var(--text-muted)',
          letterSpacing: '0.04em', flexShrink: 0 }}>
          {getDomain(bookmark.url)}
        </span>
      </a>
    ))}
  </div>
);

export default CompactList;
