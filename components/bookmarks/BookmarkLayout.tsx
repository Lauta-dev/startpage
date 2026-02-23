'use client';

import React, { useState, useMemo } from 'react';
import type { Bookmark } from '@/types/bookmark';
import AccentPicker from '@/components/ui/AccentPicker';
import BigList from './cards/BigList';
import BigListMobile from './cards/BigListMobile';
import BookmarkModal from './BookmarkModal';
import { DeleteBookmark, SaveBookmark, UpdateBookmark } from '@/actions/Bookmarks';
import { fetchMetadata } from '@/actions/fetchMetadata';
import { getCategories, createCategory, Category } from '@/actions/getCategories';
import { useEffect } from 'react';
import { IconLayoutGrid, IconLayoutList } from '@tabler/icons-react';
import { toastFlow } from '@/components/ui/Toast';

const PAGE_SIZE = 6;

interface Props {
  bookmarks: Bookmark[];
}

export const BookmarkLayout: React.FC<Props> = ({ bookmarks: initialBookmarks }) => {
  const [bookmarks, setBookmarks]           = useState<Bookmark[]>(initialBookmarks);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery]       = useState('');
  const [isListView, setIsListView]         = useState(false);
  const [page, setPage]                     = useState(1);          // cuántos grupos de PAGE_SIZE mostrar
  const [categories, setCategories]         = useState<Category[]>([]);
  const [showModal, setShowModal]           = useState(false);
  const [isClosing, setIsClosing]           = useState(false);
  const [editingBm, setEditingBm]           = useState<{ id: number; bookmark: Bookmark } | null>(null);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  // Reset page cuando cambia el filtro o la búsqueda
  const handleCategoryFilter = (val: string | null) => {
    setActiveCategoryFilter(prev => (prev === val ? null : val));
    setPage(1);
  };

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setPage(1);
  };

  // ── Filtrado ──────────────────────────────────────────────
  const filtered = useMemo(() => bookmarks.filter(b => {
    const matchesCat = !activeCategoryFilter || b.category === activeCategoryFilter;
    const q = searchQuery.toLowerCase();
    const matchesQ = !q
      || (b.ogTitle ?? b.title).toLowerCase().includes(q)
      || b.url.toLowerCase().includes(q)
      || (b.desc ?? '').toLowerCase().includes(q);
    return matchesCat && matchesQ;
  }), [bookmarks, activeCategoryFilter, searchQuery]);

  // ── Paginación: solo aplica cuando estamos en TODOS sin búsqueda ──
  const paginationActive = !activeCategoryFilter && !searchQuery;
  const visible          = paginationActive ? filtered.slice(0, page * PAGE_SIZE) : filtered;
  const hasMore          = paginationActive && visible.length < filtered.length;

  // ── Categorías únicas ─────────────────────────────────────
  const categoryList = useMemo(() => {
    const cats = [...new Set(bookmarks.map(b => b.category))];
    return cats.sort((a, b) => a === 'General' ? 1 : b === 'General' ? -1 : a.localeCompare(b));
  }, [bookmarks]);

  // ── Modal helpers ─────────────────────────────────────────
  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => { setShowModal(false); setEditingBm(null); setIsClosing(false); }, 150);
  };

  const handleEdit = (b: Bookmark) => {
    setEditingBm({ id: b.id, bookmark: b });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    const id_toast = toastFlow.start('Eliminando bookmark...');
    const result = await DeleteBookmark(id);
    if (result.ok) {
      setBookmarks(prev => prev.filter(b => b.id !== id));
      toastFlow.success(id_toast, 'Bookmark eliminado');
    } else {
      toastFlow.error(id_toast, result.message);
    }
  };

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
    categoryId: number,
    categoryName: string,
  ) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    let finalCatId = categoryId, finalCatName = categoryName;
    closeModal();

    // Paso 1 — metadata
    const tid = toastFlow.start('Obteniendo metadata...');
    const meta = await fetchMetadata(data.site as string);
    if (!meta.ok) { toastFlow.error(tid, meta.message); return; }

    // Categoría nueva si hace falta
    if (categoryId === -1 && categoryName) {
      const newCat = await createCategory(categoryName);
      finalCatId   = newCat.id;
      finalCatName = newCat.name;
      setCategories(prev => [...prev, newCat].sort((a, b) => a.name.localeCompare(b.name)));
    }

    // Paso 2 — DB
    toastFlow.step(tid, 'Guardando en base de datos...');
    let result;
    if (editingBm) {
      result = await UpdateBookmark({
        id:           editingBm.id,
        title:        (data.name as string) || meta.title,
        url:          meta.url,
        ogImage:      meta.ogImage,
        categoryId:   finalCatId,
        categoryName: finalCatName,
      });
      if (result.ok) toastFlow.success(tid, 'Bookmark actualizado');
      else           toastFlow.error(tid, result.message);
    } else {
      result = await SaveBookmark({
        title:        meta.title,
        url:          meta.url,
        ogImage:      meta.ogImage,
        description:  meta.description,
        categoryId:   finalCatId,
        categoryName: finalCatName,
      });
      if (result.ok) toastFlow.success(tid, 'Bookmark guardado');
      else           toastFlow.error(tid, result.message);
    }

    window.location.reload();
  }

  const mono = "'IBM Plex Mono', monospace";

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 28px 80px' }}>

      {/* ── Header ── */}
      <div className="flex items-center justify-between" style={{
        padding: '36px 0 20px',
        borderBottom: '1px solid var(--border-dim)',
        marginBottom: '24px',
      }}>
        <span className="flex items-center gap-1.5" style={{
          fontSize: '0.6rem', letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'var(--text-lo)',
        }}>
          <span style={{ opacity: 0.5 }}>//</span>
          bookmarks
          <span style={{
            fontSize: '0.58rem', color: 'var(--accent)',
            background: 'color-mix(in srgb, var(--accent) 10%, transparent)',
            border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)',
            padding: '1px 7px', borderRadius: '2px', marginLeft: '4px',
          }}>
            {bookmarks.length}
          </span>
        </span>
        <AccentPicker />
      </div>

      <div className="section">
        {/* ── Toolbar ── */}
        <div className="section-head">
          <div className="flex items-center gap-1.5">
            {/* Home */}
            <a href="/" title="Inicio" className="flex items-center justify-center transition-all duration-150"
              style={{ width: '26px', height: '26px', border: '1px solid var(--border-dim)', borderRadius: '2px', color: 'var(--text-lo)', textDecoration: 'none' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'var(--accent)'; el.style.borderColor = 'var(--accent)'; el.style.background = 'color-mix(in srgb, var(--accent) 6%, transparent)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'var(--text-lo)'; el.style.borderColor = 'var(--border-dim)'; el.style.background = 'transparent'; }}
            >
              <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
                <path d="M3 9.5L10 3l7 6.5V17a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M7 18v-6h6v6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            </a>

            {/* Search */}
            <div className="relative flex items-center">
              <svg className="absolute pointer-events-none" style={{ left: '9px', width: '13px', height: '13px', color: 'var(--text-lo)' }} viewBox="0 0 20 20" fill="none">
                <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M13 13l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                placeholder="buscar…"
                autoComplete="off"
                spellCheck={false}
                className="transition-colors duration-150"
                style={{
                  background: 'var(--bg-surface)', border: '1px solid var(--border-dim)',
                  borderRadius: '2px', outline: 'none', fontFamily: 'inherit',
                  fontSize: '0.72rem', color: 'var(--text-hi)',
                  padding: '5px 10px 5px 28px', width: '180px',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-dim)')}
              />
            </div>
          </div>

          {/* View toggle */}
          <div className="flex" style={{ border: '1px solid var(--border-dim)', borderRadius: '2px' }}>
            {([false, true] as const).map((listMode, i) => (
              <button
                key={String(listMode)}
                onClick={() => setIsListView(listMode)}
                className="flex items-center p-1.5 cursor-pointer"
                style={{
                  background: isListView === listMode ? 'color-mix(in srgb, var(--accent) 10%, transparent)' : 'transparent',
                  border: 'none', borderRight: i === 0 ? '1px solid var(--border-dim)' : 'none',
                  color: isListView === listMode ? 'var(--accent)' : 'var(--text-lo)',
                  transition: 'color 0.15s, background 0.15s',
                }}
              >
                {listMode ? <IconLayoutList size={18} stroke={1.75} /> : <IconLayoutGrid size={18} stroke={1.75} />}
              </button>
            ))}
          </div>
        </div>

        {/* ── Category chips ── */}
        <div className="flex flex-wrap gap-1" style={{
          padding: '10px 14px', borderBottom: '1px solid var(--border-dim)', background: 'var(--bg-raised)',
        }}>
          {[
            { label: 'todos', value: null, count: bookmarks.length },
            ...categoryList.map(cat => ({ label: cat.toLowerCase(), value: cat, count: bookmarks.filter(b => b.category === cat).length })),
          ].map(({ label, value, count }) => {
            const isActive = activeCategoryFilter === value;
            return (
              <button
                key={label}
                onClick={() => handleCategoryFilter(value)}
                className="flex items-center gap-1.5 cursor-pointer"
                style={{
                  padding: '3px 10px', borderRadius: '2px', fontFamily: 'inherit',
                  fontSize: '0.62rem', letterSpacing: '0.06em',
                  border: `1px solid ${isActive ? 'color-mix(in srgb, var(--accent) 35%, transparent)' : 'var(--border-dim)'}`,
                  background: isActive ? 'color-mix(in srgb, var(--accent) 8%, transparent)' : 'transparent',
                  color: isActive ? 'var(--accent)' : 'var(--text-lo)',
                  transition: 'all 0.12s',
                }}
                onMouseEnter={e => { if (!isActive) { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border)'; el.style.color = 'var(--text-mid)'; } }}
                onMouseLeave={e => { if (!isActive) { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border-dim)'; el.style.color = 'var(--text-lo)'; } }}
              >
                {label} <span style={{ opacity: 0.5 }}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* ── Content ── */}
        <div className="section-body" style={{ borderTop: 'none', borderRadius: '0 0 2px 2px' }}>
          {/* Empty state */}
          {visible.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2" style={{
              padding: '64px 0', color: 'var(--text-lo)', fontSize: '0.72rem', letterSpacing: '0.06em',
            }}>
              <span style={{ fontSize: '1.8rem', opacity: 0.15 }}>⌖</span>
              no hay resultados
              {activeCategoryFilter && ` en "${activeCategoryFilter}"`}
              {searchQuery && ` para "${searchQuery}"`}
            </div>
          )}

          {/* Cards / Lista — sin agrupamiento, sin labels de categoría */}
          {visible.length > 0 && (
            isListView
              ? <BigListMobile bookmarks={visible} onEdit={handleEdit} onDelete={handleDelete} />
              : <BigList       bookmarks={visible} onEdit={handleEdit} onDelete={handleDelete} />
          )}

          {/* ── Botón "Cargar más" — solo en TODOS sin búsqueda ── */}
          {hasMore && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0 8px', borderTop: '1px solid var(--border-dim)' }}>
              <button
                onClick={() => setPage(p => p + 1)}
                style={{
                  fontFamily: mono,
                  fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                  padding: '7px 20px', borderRadius: '2px',
                  border: '1px solid var(--border-dim)',
                  background: 'transparent', color: 'var(--text-lo)',
                  cursor: 'pointer', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--accent)'; el.style.color = 'var(--accent)'; el.style.background = 'color-mix(in srgb, var(--accent) 6%, transparent)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border-dim)'; el.style.color = 'var(--text-lo)'; el.style.background = 'transparent'; }}
              >
                cargar más
                <span style={{ opacity: 0.5, fontSize: '0.58rem' }}>
                  {visible.length} / {filtered.length}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Modal ── */}
      <BookmarkModal
        isOpen={showModal}
        isClosing={isClosing}
        editingBookmark={editingBm}
        categories={categories}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default BookmarkLayout;
