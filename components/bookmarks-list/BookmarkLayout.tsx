'use client';

import React, { useState, useMemo } from 'react';
import type { Bookmark } from '@/types/bookmark';
import './bookmarks.css';
import CompactList from '@/components/bookmark-shared/CompactList';
import BigList from '@/components/bookmark-shared/BigList';
import AccentPicker from '@/components/ui/AccentPicker';

// ── Helpers ──────────────────────────────────────────────
function getFavicon(url: string) {
  try { return `https://www.google.com/s2/favicons?sz=32&domain=${new URL(url).hostname}`; }
  catch { return ''; }
}
function getDomain(url: string) {
  try { return new URL(url).hostname.replace('www.', ''); }
  catch { return url; }
}

// ── Types ─────────────────────────────────────────────────
type ViewMode = 'card' | 'list';

interface Props {
  bookmarks: Bookmark[];
}

// ═══════════════════════════════════════════════════════════
//  BookmarksPage
// ═══════════════════════════════════════════════════════════
export const BookmarksPage: React.FC<Props> = ({ bookmarks }) => {
  const [view, setView]                   = useState<ViewMode>('card');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch]               = useState('');

  const categories = useMemo(() => {
    const cats = [...new Set(bookmarks.map(b => b.category))];
    return cats.sort((a, b) =>
      a === 'General' ? 1 : b === 'General' ? -1 : a.localeCompare(b)
    );
  }, [bookmarks]);

  const filtered = useMemo(() => {
    return bookmarks.filter(b => {
      const matchCat = !activeCategory || b.category === activeCategory;
      const q = search.toLowerCase();
      const matchQ = !q ||
        (b.ogTitle ?? b.title).toLowerCase().includes(q) ||
        b.url.toLowerCase().includes(q) ||
        (b.desc ?? '').toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [bookmarks, activeCategory, search]);

  // Group filtered bookmarks by category (preserving sort order)
  const grouped = useMemo(() => {
    const map: Record<string, Bookmark[]> = {};
    filtered.forEach(b => {
      if (!map[b.category]) map[b.category] = [];
      map[b.category].push(b);
    });
    return map;
  }, [filtered]);

  const showLabels = Object.keys(grouped).length > 1;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* ── Toolbar ── */}
      <div className="bm-toolbar">
        <span className="bm-toolbar__title">Bookmarks</span>
        <span className="bm-toolbar__count">{bookmarks.length} guardados</span>

        {/* Search */}
        <div className="bm-search-wrap">
          <svg className="bm-search-icon" viewBox="0 0 20 20" fill="none">
            <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M13 13l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            className="bm-search-input"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar…"
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        {/* View toggle */}
        <div className="bm-view-toggle">
          <button
            className={`bm-view-btn${view === 'card' ? ' bm-view-btn--active' : ''}`}
            onClick={() => setView('card')}
            title="Cards"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor"/>
              <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor"/>
              <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor"/>
              <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor"/>
            </svg>
          </button>
          <button
            className={`bm-view-btn${view === 'list' ? ' bm-view-btn--active' : ''}`}
            onClick={() => setView('list')}
            title="Lista"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="2.5" width="14" height="2" rx="1" fill="currentColor"/>
              <rect x="1" y="7"   width="14" height="2" rx="1" fill="currentColor"/>
              <rect x="1" y="11.5" width="14" height="2" rx="1" fill="currentColor"/>
            </svg>
          </button>
        </div>
        <AccentPicker />
      </div>

      {/* ── Category chips ── */}
      <div className="bm-chips">
        <button
          className={`bm-chip${!activeCategory ? ' bm-chip--active' : ''}`}
          onClick={() => setActiveCategory(null)}
        >
          Todos <span className="bm-chip__count">{bookmarks.length}</span>
        </button>
        {categories.map(cat => {
          const count = bookmarks.filter(b => b.category === cat).length;
          return (
            <button
              key={cat}
              className={`bm-chip${activeCategory === cat ? ' bm-chip--active' : ''}`}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
            >
              {cat} <span className="bm-chip__count">{count}</span>
            </button>
          );
        })}
      </div>

      {/* ── Empty state ── */}
      {filtered.length === 0 && (
        <div className="bm-empty">
          <div className="bm-empty__icon">⌖</div>
          <span>
            No hay bookmarks
            {activeCategory && ` en "${activeCategory}"`}
            {search && ` para "${search}"`}
          </span>
        </div>
      )}

      {/* ── Card view ── */}
      {view === 'card' && filtered.length > 0 && (
        <div className="flex flex-col gap-5">
          {Object.entries(grouped).map(([cat, items]) => (
            <React.Fragment key={cat}>
              {showLabels && (
                <div className="bm-section-label bm-section-label--grid">
                  <span>{cat}</span>
                  <span className="bm-section-label__badge">{items.length}</span>
                </div>
              )}
              <BigList bookmarks={bookmarks} />
            </React.Fragment>
          ))}
        </div>
      )}

      {/* ── List view ── */}
      {view === 'list' && filtered.length > 0 && (
        <div className="bm-list">
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat}>
              {showLabels && (
                <div className="bm-section-label">
                  <span>{cat}</span>
                  <span className="bm-section-label__badge">{items.length}</span>
                </div>
              )}
              <CompactList bookmarks={items} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
//  CardItem
// ═══════════════════════════════════════════════════════════
const CardItem: React.FC<{ bookmark: Bookmark; index: number }> = ({ bookmark, index }) => {
  const title   = bookmark.ogTitle ?? bookmark.title;
  const favicon = getFavicon(bookmark.url);
  const domain  = getDomain(bookmark.url);

  return (
    <a
      href={bookmark.url}
      target="_blank"
      rel="noopener noreferrer"
      className="bm-card"
      style={{ animationDelay: `${Math.min(index * 35, 350)}ms` }}
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
            <img src={favicon} alt="" />
          </div>
        )}
        <div className="bm-card__img-overlay" />
      </div>

      {/* Body */}
      <div className="bm-card__body">
        <div className="bm-card__meta">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="bm-card__favicon" src={favicon} alt="" />
          <span className="bm-card__domain">{domain}</span>
        </div>
        <h3 className="bm-card__title">{title}</h3>
        {bookmark.desc && (
          <p className="bm-card__desc">{bookmark.desc}</p>
        )}
      </div>
    </a>
  );
};

// ═══════════════════════════════════════════════════════════
//  ListItem
// ═══════════════════════════════════════════════════════════
const ListItem: React.FC<{ bookmark: Bookmark; index: number }> = ({ bookmark, index }) => {
  const title   = bookmark.ogTitle ?? bookmark.title;
  const favicon = getFavicon(bookmark.url);
  const domain  = getDomain(bookmark.url);

  return (
    <a
      href={bookmark.url}
      target="_blank"
      rel="noopener noreferrer"
      className="bm-list-row"
      style={{ animationDelay: `${Math.min(index * 25, 300)}ms` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="bm-list-row__favicon" src={favicon} alt="" />

      {/* Thumbnail */}
      <div className="bm-list-row__thumb">
        {bookmark.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={bookmark.image} alt="" loading="lazy" />
        ) : (
          <div className="bm-list-row__thumb-fallback">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={favicon} alt="" />
          </div>
        )}
      </div>

      {/* Main text */}
      <div className="bm-list-row__main">
        <div className="bm-list-row__title">{title}</div>
        {bookmark.desc && (
          <div className="bm-list-row__desc">{bookmark.desc}</div>
        )}
      </div>

      {/* Right */}
      <div className="bm-list-row__right">
        <span className="bm-list-row__domain">{domain}</span>
      </div>
    </a>
  );
};
