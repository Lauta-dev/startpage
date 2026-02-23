import { Bookmark } from "@/types/bookmark";
import "./bookmark.css";

function getFavicon(url: string) {
  try { return `https://www.google.com/s2/favicons?sz=32&domain=${new URL(url).hostname}`; }
  catch { return ''; }
}
function getDomain(url: string) {
  try { return new URL(url).hostname.replace('www.', ''); }
  catch { return url; }
}
function getTitle(b: Bookmark) { return b.ogTitle ?? b.title; }

const BigList: React.FC<{ bookmarks: Bookmark[] }> = ({ bookmarks }) => (
  <div className="bm-grid gap-4 p-4">
    {bookmarks.map((bookmark, i) => (
      <a key={bookmark.id} href={bookmark.url} target="_blank" rel="noopener noreferrer"
        className="bm-card"
        style={{ animationDelay: `${Math.min(i * 35, 350)}ms` }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.color = 'var(--accent)';
          el.style.background = 'color-mix(in srgb, var(--accent) 5%, transparent)';
        }}
         
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.color = 'var(--text-lo)';
          el.style.background = 'transparent';
        }}
      >
        <div className="bm-card__img-wrap">
          {bookmark.image
            ? <img className="bm-card__img" src={bookmark.image} alt="" loading="lazy" />  // eslint-disable-line
            : <div className="bm-card__img-fallback">
                <img src={getFavicon(bookmark.url)} alt="" /> {/* eslint-disable-line */}
              </div>
          }
          <div className="bm-card__img-overlay" />
        </div>
        <div className="bm-card__body">
          <div className="bm-card__meta">
            <img className="bm-card__favicon" src={getFavicon(bookmark.url)} alt="" /> {/* eslint-disable-line */}
            <span className="bm-card__domain">{getDomain(bookmark.url)}</span>
          </div>
          <h3 className="bm-card__title">{getTitle(bookmark)}</h3>
          {bookmark.desc && <p className="bm-card__desc">{bookmark.desc}</p>}
        </div>
      </a>
    ))}
  </div>
);

export default BigList;
