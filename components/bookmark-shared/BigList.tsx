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

function getTitle(bookmark: Bookmark) {
  return bookmark.ogTitle ?? bookmark.title;
}

const BigList: React.FC<{ bookmarks: Bookmark[] }> = ({ bookmarks }) => {
  return (
    <div className="bm-grid">
      {bookmarks.map((bookmark, i) => (
        <a
          key={bookmark.id}
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bm-card"
          style={{ animationDelay: `${Math.min(i * 35, 350)}ms` }}
        >
          {/* Image */}
          <div className="bm-card__img-wrap">
            {bookmark.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="bm-card__img"
                src={bookmark.image}
                alt=""
                loading="lazy"
              />
            ) : (
              <div className="bm-card__img-fallback">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={getFavicon(bookmark.url)} alt="" />
              </div>
            )}
            <div className="bm-card__img-overlay" />
          </div>

          {/* Body */}
          <div className="bm-card__body">
            <div className="bm-card__meta">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="bm-card__favicon" src={getFavicon(bookmark.url)} alt="" />
              <span className="bm-card__domain">{getDomain(bookmark.url)}</span>
            </div>
            <h3 className="bm-card__title">{getTitle(bookmark)}</h3>
            {bookmark.desc && (
              <p className="bm-card__desc">{bookmark.desc}</p>
            )}
          </div>
        </a>
      ))}
    </div>
  );
};

export default BigList;
