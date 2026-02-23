'use client';

import React, { useState, useEffect } from 'react';
import { IconCirclePlus, IconLayoutGrid, IconLayoutList } from '@tabler/icons-react';
import BookmarkModal from './BookmarkModal';
import { SaveBookmark, UpdateBookmark, DeleteBookmark } from '@/actions/Bookmarks';
import { fetchMetadata } from '@/actions/fetchMetadata';
import { getCategories, createCategory, Category } from '@/actions/getCategories';
import BigList from './cards/BigList';
import BigListMobile from './cards/BigListMobile';
import { Bookmark } from '@/types/bookmark';
import { toastFlow } from '@/components/ui/Toast';

interface Props {
  bookmarks: Bookmark[];
}

const BookmarkGrid: React.FC<Props> = ({ bookmarks }) => {
  const [showModal, setShowModal]         = useState(false);
  const [isClosing, setIsClosing]         = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<{ id: number; bookmark: Bookmark } | null>(null);
  const [isListView, setIsListView]       = useState(false);
  const [categories, setCategories]       = useState<Category[]>([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setEditingBookmark(null);
      setIsClosing(false);
    }, 150);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    categoryId: number,
    categoryName: string,
  ) => {
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
    if (editingBookmark) {
      const result = await UpdateBookmark({
        id: editingBookmark.id, title: (data.name as string) || meta.title,
        url: meta.url, ogImage: meta.ogImage,
        categoryId: finalCatId, categoryName: finalCatName,
      });
      if (result.ok) toastFlow.success(tid, 'Bookmark actualizado');
      else           toastFlow.error(tid, result.message);
    } else {
      const result = await SaveBookmark({
        title: meta.title, url: meta.url, ogImage: meta.ogImage,
        description: meta.description, categoryId: finalCatId, categoryName: finalCatName,
      });
      if (result.ok) toastFlow.success(tid, 'Bookmark guardado');
      else           toastFlow.error(tid, result.message);
    }
  };

  const editHandlers = {
    onEdit:   (b: Bookmark) => { setEditingBookmark({ id: b.id, bookmark: b }); setShowModal(true); },
    onDelete: async (id: number) => {
      const tid = toastFlow.start('Eliminando bookmark...');
      const result = await DeleteBookmark(id);
      if (result.ok) toastFlow.success(tid, 'Bookmark eliminado');
      else           toastFlow.error(tid, result.message);
    },
  };

  return (
    <div className="section">
      <div className="section-head">
        <a
          href="/bookmarks"
          className="section-label"
          style={{ textDecoration: 'none', transition: 'color 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-lo)')}
        >
          Bookmarks
        </a>

        <div className="flex items-center gap-1.5">
          {/* View toggle — hidden on mobile via CSS, no JS needed */}
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

          <button
            onClick={() => { setEditingBookmark(null); setShowModal(true); }}
            className="flex items-center gap-1.5 cursor-pointer"
            style={{
              background: 'transparent',
              border: '1px solid var(--border-dim)',
              borderRadius: '2px',
              color: 'var(--text-lo)',
              fontFamily: 'inherit',
              fontSize: '0.6rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '4px 10px',
              transition: 'color 0.15s, border-color 0.15s, background 0.15s',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = 'var(--accent)';
              el.style.borderColor = 'color-mix(in srgb, var(--accent) 35%, transparent)';
              el.style.background = 'color-mix(in srgb, var(--accent) 5%, transparent)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = 'var(--text-lo)';
              el.style.borderColor = 'var(--border-dim)';
              el.style.background = 'transparent';
            }}
          >
            <IconCirclePlus size={18} stroke={1.5} /> Añadir
          </button>
        </div>
      </div>

      <div className="section-body">
        {/*
          CSS handles mobile vs desktop — no JS, no flash:
          - .bm-card-view: visible on desktop, hidden on mobile (CSS)
          - .bm-feed-view: hidden on desktop, visible on mobile (CSS)
          - When isListView is true on desktop: card hidden, feed shown via JS (no mobile concern)
        */}
        <div className={isListView ? 'hidden' : 'bm-card-view'}>
          <BigList bookmarks={bookmarks} {...editHandlers} />
        </div>
        <div className={isListView ? 'block' : 'bm-feed-view'}>
          <BigListMobile bookmarks={bookmarks} {...editHandlers} />
        </div>
      </div>

      <BookmarkModal
        isOpen={showModal}
        isClosing={isClosing}
        editingBookmark={editingBookmark}
        categories={categories}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default BookmarkGrid;
