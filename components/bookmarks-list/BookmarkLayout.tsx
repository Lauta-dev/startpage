'use client';

import React, { useState, useMemo } from 'react';
import type { Bookmark } from '@/types/bookmark';
import './bookmarks.css';
import CompactList from '@/components/bookmark-shared/CompactList';
import BigList from '@/components/bookmark-shared/BigList';
import AccentPicker from '@/components/ui/AccentPicker';

type ViewMode = 'card' | 'list';
interface Props { bookmarks: Bookmark[]; }

export const BookmarksPage: React.FC<Props> = ({ bookmarks }) => {
  const [view, setView]                     = useState<ViewMode>('card');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch]                 = useState('');

  const categories = useMemo(() => {
    const cats = [...new Set(bookmarks.map(b => b.category))];
    return cats.sort((a, b) => a === 'General' ? 1 : b === 'General' ? -1 : a.localeCompare(b));
  }, [bookmarks]);

  const filtered = useMemo(() => bookmarks.filter(b => {
    const matchCat = !activeCategory || b.category === activeCategory;
    const q = search.toLowerCase();
    const matchQ = !q || (b.ogTitle ?? b.title).toLowerCase().includes(q) ||
      b.url.toLowerCase().includes(q) || (b.desc ?? '').toLowerCase().includes(q);
    return matchCat && matchQ;
  }), [bookmarks, activeCategory, search]);

  const grouped = useMemo(() => {
    const map: Record<string, Bookmark[]> = {};
    filtered.forEach(b => { if (!map[b.category]) map[b.category] = []; map[b.category].push(b); });
    return map;
  }, [filtered]);

  const showLabels = Object.keys(grouped).length > 1;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 28px 80px' }}>

      {/* Header — mismo patrón que StartPage */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '36px 0 20px',
        borderBottom: '1px solid var(--border-dim)',
        marginBottom: '24px',
      }}>
        <span style={{
          fontSize: '0.6rem', letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'var(--text-lo)',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <span style={{ opacity: 0.5 }}>//</span> bookmarks
          <span style={{
            fontSize: '0.58rem', color: 'var(--accent)',
            background: 'color-mix(in srgb, var(--accent) 10%, transparent)',
            border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)',
            padding: '1px 7px', borderRadius: '2px', marginLeft: '4px',
          }}>{bookmarks.length}</span>
        </span>
        <AccentPicker />
      </div>

      {/* Toolbar: search + view toggle + chips — en una sola section-head */}
      <div className="section">
        <div className="section-head">
          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Home icon */}
          <a
            href="/"
            title="Inicio"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '26px', height: '26px',
              border: '1px solid var(--border-dim)', borderRadius: '2px',
              background: 'transparent', color: 'var(--text-lo)',
              textDecoration: 'none', flexShrink: 0,
              transition: 'color 0.15s, border-color 0.15s, background 0.15s',
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
              <path d="M3 9.5L10 3l7 6.5V17a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M7 18v-6h6v6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
          </a>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <svg style={{ position: 'absolute', left: '9px', width: '13px', height: '13px', color: 'var(--text-lo)', pointerEvents: 'none' }} viewBox="0 0 20 20" fill="none">
              <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M13 13l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="buscar…"
              autoComplete="off"
              spellCheck={false}
              style={{
                background: 'var(--bg-surface)', border: '1px solid var(--border-dim)',
                borderRadius: '2px', outline: 'none', fontFamily: 'inherit',
                fontSize: '0.72rem', color: 'var(--text-hi)', padding: '5px 10px 5px 28px',
                width: '180px', transition: 'border-color 0.15s',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-dim)')}
            />
          </div>
          </div>

          {/* View toggle */}
          <div style={{ display: 'flex', border: '1px solid var(--border-dim)', borderRadius: '2px', overflow: 'hidden' }}>
            {(['card', 'list'] as const).map((v, i) => (
              <button key={v} onClick={() => setView(v)}
                style={{
                  background: view === v ? 'color-mix(in srgb, var(--accent) 10%, transparent)' : 'transparent',
                  border: 'none', borderRight: i === 0 ? '1px solid var(--border-dim)' : 'none',
                  padding: '5px 9px', cursor: 'pointer',
                  color: view === v ? 'var(--accent)' : 'var(--text-lo)',
                  fontFamily: 'inherit', fontSize: '0.6rem', letterSpacing: '0.08em',
                  display: 'flex', alignItems: 'center', transition: 'all 0.12s',
                }}
                onMouseEnter={e => { if (view !== v) (e.currentTarget as HTMLElement).style.color = 'var(--text-mid)'; }}
                onMouseLeave={e => { if (view !== v) (e.currentTarget as HTMLElement).style.color = 'var(--text-lo)'; }}
              >
                {v === 'card' ? (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor"/>
                    <rect x="9" y="1" width="6" height="6" rx="1" fill="currentColor"/>
                    <rect x="1" y="9" width="6" height="6" rx="1" fill="currentColor"/>
                    <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor"/>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <rect x="1" y="2.5" width="14" height="2" rx="1" fill="currentColor"/>
                    <rect x="1" y="7" width="14" height="2" rx="1" fill="currentColor"/>
                    <rect x="1" y="11.5" width="14" height="2" rx="1" fill="currentColor"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Category chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', padding: '10px 14px', borderBottom: '1px solid var(--border-dim)', background: 'var(--bg-raised)' }}>
          <button
            onClick={() => setActiveCategory(null)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              padding: '3px 10px', borderRadius: '2px', cursor: 'pointer',
              border: '1px solid', fontFamily: 'inherit',
              fontSize: '0.62rem', letterSpacing: '0.06em', transition: 'all 0.12s',
              borderColor: !activeCategory ? 'color-mix(in srgb, var(--accent) 35%, transparent)' : 'var(--border-dim)',
              background: !activeCategory ? 'color-mix(in srgb, var(--accent) 8%, transparent)' : 'transparent',
              color: !activeCategory ? 'var(--accent)' : 'var(--text-lo)',
            }}
          >
            todos <span style={{ opacity: 0.5 }}>{bookmarks.length}</span>
          </button>
          {categories.map(cat => {
            const count = bookmarks.filter(b => b.category === cat).length;
            const active = activeCategory === cat;
            return (
              <button key={cat} onClick={() => setActiveCategory(active ? null : cat)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  padding: '3px 10px', borderRadius: '2px', cursor: 'pointer',
                  border: '1px solid', fontFamily: 'inherit',
                  fontSize: '0.62rem', letterSpacing: '0.06em', transition: 'all 0.12s',
                  borderColor: active ? 'color-mix(in srgb, var(--accent) 35%, transparent)' : 'var(--border-dim)',
                  background: active ? 'color-mix(in srgb, var(--accent) 8%, transparent)' : 'transparent',
                  color: active ? 'var(--accent)' : 'var(--text-lo)',
                }}
                onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-mid)'; }}}
                onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-dim)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-lo)'; }}}
              >
                {cat.toLowerCase()} <span style={{ opacity: 0.5 }}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="section-body" style={{ borderTop: 'none', borderRadius: '0 0 2px 2px' }}>
          {filtered.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: '8px', padding: '64px 0', color: 'var(--text-lo)', fontSize: '0.72rem', letterSpacing: '0.06em' }}>
              <span style={{ fontSize: '1.8rem', opacity: 0.15 }}>⌖</span>
              no hay resultados{activeCategory && ` en "${activeCategory}"`}{search && ` para "${search}"`}
            </div>
          )}

          {view === 'card' && filtered.length > 0 && (
            <>
              {Object.entries(grouped).map(([cat, items]) => (
                <React.Fragment key={cat}>
                  {showLabels && (
                    <div style={{ padding: '8px 14px 4px', fontSize: '0.58rem', letterSpacing: '0.14em',
                      textTransform: 'uppercase', color: 'var(--text-lo)', display: 'flex', alignItems: 'center',
                      gap: '8px', borderBottom: '1px solid var(--border-dim)' }}>
                      <span style={{ opacity: 0.4 }}>//</span> {cat.toLowerCase()}
                      <span style={{ fontSize: '0.55rem', color: 'var(--accent)',
                        background: 'color-mix(in srgb, var(--accent) 10%, transparent)',
                        border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)',
                        padding: '1px 6px', borderRadius: '2px' }}>{items.length}</span>
                    </div>
                  )}
                  <BigList bookmarks={items} />
                </React.Fragment>
              ))}
            </>
          )}

          {view === 'list' && filtered.length > 0 && (
            <>
              {Object.entries(grouped).map(([cat, items]) => (
                <React.Fragment key={cat}>
                  {showLabels && (
                    <div style={{ padding: '8px 14px 4px', fontSize: '0.58rem', letterSpacing: '0.14em',
                      textTransform: 'uppercase', color: 'var(--text-lo)', display: 'flex', alignItems: 'center',
                      gap: '8px', borderBottom: '1px solid var(--border-dim)' }}>
                      <span style={{ opacity: 0.4 }}>//</span> {cat.toLowerCase()}
                      <span style={{ fontSize: '0.55rem', color: 'var(--accent)',
                        background: 'color-mix(in srgb, var(--accent) 10%, transparent)',
                        border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)',
                        padding: '1px 6px', borderRadius: '2px' }}>{items.length}</span>
                    </div>
                  )}
                  <CompactList bookmarks={items} />
                </React.Fragment>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookmarksPage;
