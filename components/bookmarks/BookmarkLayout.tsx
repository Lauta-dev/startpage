'use client';

import React, { useState, useMemo } from 'react';
import type { Bookmark } from '@/types/bookmark';
import AccentPicker from '@/components/ui/AccentPicker';
import BigList from './cards/BigList';
import BigListMobile from './cards/BigListMobile';
import { IconLayoutGrid, IconLayoutList } from '@tabler/icons-react';

type ViewMode = 'card' | 'list';

interface Props {
  bookmarks: Bookmark[];
}

export const BookmarkLayout: React.FC<Props> = ({ bookmarks }) => {
  const [view, setView]                       = useState<ViewMode>('card');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery]         = useState('');
  const [isListView, setIsListView]       = useState(false);

  const categories = useMemo(() => {
    const cats = [...new Set(bookmarks.map(b => b.category))];
    return cats.sort((a, b) => a === 'General' ? 1 : b === 'General' ? -1 : a.localeCompare(b));
  }, [bookmarks]);

  const filteredBookmarks = useMemo(() => bookmarks.filter(b => {
    const matchesCategory = !activeCategoryFilter || b.category === activeCategoryFilter;
    const q = searchQuery.toLowerCase();
    const matchesQuery = !q
      || (b.ogTitle ?? b.title).toLowerCase().includes(q)
      || b.url.toLowerCase().includes(q)
      || (b.desc ?? '').toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  }), [bookmarks, activeCategoryFilter, searchQuery]);

  const groupedByCategory = useMemo(() => {
    const map: Record<string, Bookmark[]> = {};
    filteredBookmarks.forEach(b => {
      if (!map[b.category]) map[b.category] = [];
      map[b.category].push(b);
    });
    return map;
  }, [filteredBookmarks]);

  const hasMultipleCategories = Object.keys(groupedByCategory).length > 1;

  const CategoryLabel = ({ cat, count }: { cat: string; count: number }) => (
    <div style={{
      padding: '8px 14px 4px',
      fontSize: '0.58rem',
      letterSpacing: '0.14em',
      textTransform: 'uppercase' as const,
      color: 'var(--text-lo)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      borderBottom: '1px solid var(--border-dim)',
    }}>
      <span style={{ opacity: 0.4 }}>//</span>
      {cat.toLowerCase()}
      <span style={{
        fontSize: '0.55rem',
        color: 'var(--accent)',
        background: 'color-mix(in srgb, var(--accent) 10%, transparent)',
        border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)',
        padding: '1px 6px',
        borderRadius: '2px',
      }}>
        {count}
      </span>
    </div>
  );

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 28px 80px' }}>

      {/* Header */}
      <div className="flex items-center justify-between" style={{
        padding: '36px 0 20px',
        borderBottom: '1px solid var(--border-dim)',
        marginBottom: '24px',
      }}>
        <span className="flex items-center gap-1.5" style={{
          fontSize: '0.6rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--text-lo)',
        }}>
          <span style={{ opacity: 0.5 }}>//</span>
          bookmarks
          <span style={{
            fontSize: '0.58rem',
            color: 'var(--accent)',
            background: 'color-mix(in srgb, var(--accent) 10%, transparent)',
            border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)',
            padding: '1px 7px',
            borderRadius: '2px',
            marginLeft: '4px',
          }}>
            {bookmarks.length}
          </span>
        </span>
        <AccentPicker />
      </div>

      <div className="section">
        {/* Toolbar */}
        <div className="section-head">
          <div className="flex items-center gap-1.5">
            {/* Home button */}
            <a
              href="/"
              title="Inicio"
              className="flex items-center justify-center transition-all duration-150"
              style={{
                width: '26px', height: '26px',
                border: '1px solid var(--border-dim)',
                borderRadius: '2px',
                color: 'var(--text-lo)',
                textDecoration: 'none',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = 'var(--accent)';
                el.style.borderColor = 'var(--accent)';
                el.style.background = 'color-mix(in srgb, var(--accent) 6%, transparent)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = 'var(--text-lo)';
                el.style.borderColor = 'var(--border-dim)';
                el.style.background = 'transparent';
              }}
            >
              <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
                <path d="M3 9.5L10 3l7 6.5V17a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M7 18v-6h6v6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            </a>

            {/* Search */}
            <div className="relative flex items-center">
              <svg
                className="absolute pointer-events-none"
                style={{ left: '9px', width: '13px', height: '13px', color: 'var(--text-lo)' }}
                viewBox="0 0 20 20" fill="none"
              >
                <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M13 13l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="buscar…"
                autoComplete="off"
                spellCheck={false}
                className="transition-colors duration-150"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-dim)',
                  borderRadius: '2px',
                  outline: 'none',
                  fontFamily: 'inherit',
                  fontSize: '0.72rem',
                  color: 'var(--text-hi)',
                  padding: '5px 10px 5px 28px',
                  width: '180px',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-dim)')}
              />
            </div>
          </div>

          {/* View toggle */}
          <div className="bm-view-toggle flex" style={{ border: '1px solid var(--border-dim)', borderRadius: '2px' }}>
            {([false, true] as const).map((listMode, i) => (
              <button
                key={String(listMode)}
                onClick={() => setIsListView(listMode)}
                className="flex items-center p-1.5 cursor-pointer"
                style={{
                  background: isListView === listMode ? 'color-mix(in srgb, var(--accent) 10%, transparent)' : 'transparent',
                  border: 'none',
                  borderRight: i === 0 ? '1px solid var(--border-dim)' : 'none',
                  color: isListView === listMode ? 'var(--accent)' : 'var(--text-lo)',
                  transition: 'color 0.15s, background 0.15s',
                }}
              >
                {listMode
                  ? <IconLayoutList size={18} stroke={1.75} />
                  : <IconLayoutGrid size={18} stroke={1.75} />
                }
              </button>
            ))}
          </div>
        </div>

        {/* Category filter chips */}
        <div
          className="flex flex-wrap gap-1"
          style={{
            padding: '10px 14px',
            borderBottom: '1px solid var(--border-dim)',
            background: 'var(--bg-raised)',
          }}
        >
          {[{ label: 'todos', value: null, count: bookmarks.length }, ...categories.map(cat => ({
            label: cat.toLowerCase(),
            value: cat,
            count: bookmarks.filter(b => b.category === cat).length,
          }))].map(({ label, value, count }) => {
            const isActive = activeCategoryFilter === value;
            return (
              <button
                key={label}
                onClick={() => setActiveCategoryFilter(isActive ? null : value)}
                className="flex items-center gap-1.5 cursor-pointer transition-all duration-120"
                style={{
                  padding: '3px 10px',
                  borderRadius: '2px',
                  fontFamily: 'inherit',
                  fontSize: '0.62rem',
                  letterSpacing: '0.06em',
                  border: `1px solid ${isActive ? 'color-mix(in srgb, var(--accent) 35%, transparent)' : 'var(--border-dim)'}`,
                  background: isActive ? 'color-mix(in srgb, var(--accent) 8%, transparent)' : 'transparent',
                  color: isActive ? 'var(--accent)' : 'var(--text-lo)',
                }}
                onMouseEnter={e => { if (!isActive) { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border)'; el.style.color = 'var(--text-mid)'; } }}
                onMouseLeave={e => { if (!isActive) { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border-dim)'; el.style.color = 'var(--text-lo)'; } }}
              >
                {label} <span style={{ opacity: 0.5 }}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="section-body" style={{ borderTop: 'none', borderRadius: '0 0 2px 2px' }}>
          {filteredBookmarks.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2" style={{
              padding: '64px 0',
              color: 'var(--text-lo)',
              fontSize: '0.72rem',
              letterSpacing: '0.06em',
            }}>
              <span style={{ fontSize: '1.8rem', opacity: 0.15 }}>⌖</span>
              no hay resultados
              {activeCategoryFilter && ` en "${activeCategoryFilter}"`}
              {searchQuery && ` para "${searchQuery}"`}
            </div>
          )}
          

          {filteredBookmarks.length > 0 && Object.entries(groupedByCategory).map(([cat, items]) => (
            <React.Fragment key={cat}>
              {hasMultipleCategories && <CategoryLabel cat={cat} count={items.length} />}
              <div className="section-body">
                <div className={isListView ? 'hidden' : 'bm-card-view'}>
                  <BigList bookmarks={bookmarks} />
                </div>
                <div className={isListView ? 'block' : 'bm-feed-view'}>
                  <BigListMobile bookmarks={bookmarks} />
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookmarkLayout;
