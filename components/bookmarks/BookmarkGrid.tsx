'use client';

import React, { useState, useEffect } from 'react';
import { IconCirclePlus, IconLayoutGrid, IconLayoutList } from '@tabler/icons-react';
import BookmarkModal from './BookmarkModal';
import { CreateBookmark, EditBookark, DeleteBookmark } from '@/actions/Bookmarks';
import { getCategories, createCategory, Category } from '@/actions/getCategories';
import BigList from './cards/BigList';
import BigListMobile from './cards/BigListMobile';
import { Bookmark } from '@/types/bookmark';

const MOBILE_BREAKPOINT = 640;

interface Props {
  bookmarks: Bookmark[];
}

const BookmarkGrid: React.FC<Props> = ({ bookmarks }) => {
  const [showModal, setShowModal]     = useState(false);
  const [isClosing, setIsClosing]     = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<{ id: number; bookmark: Bookmark } | null>(null);
  const [isListView, setIsListView]   = useState(false);
  const [isMobile, setIsMobile]       = useState(false);
  const [categories, setCategories]   = useState<Category[]>([]);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

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

    try {
      let finalCatId   = categoryId;
      let finalCatName = categoryName;

      if (categoryId === -1 && categoryName) {
        const newCat = await createCategory(categoryName);
        finalCatId   = newCat.id;
        finalCatName = newCat.name;
        setCategories(prev => [...prev, newCat].sort((a, b) => a.name.localeCompare(b.name)));
      }

      if (editingBookmark) {
        await EditBookark({
          customTitle:  data.name as string,
          newUrl:       data.site as string,
          id:           editingBookmark.id,
          categoryId:   finalCatId,
          categoryName: finalCatName,
        });
      } else {
        await CreateBookmark(data.site as string, finalCatId, finalCatName);
      }
    } catch (err) {
      console.error(err);
    }
    closeModal();
  };

  const showCompact = isMobile || isListView;

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
          {!isMobile && (
            <div
              className="flex overflow-hidden"
              style={{ border: '1px solid var(--border-dim)', borderRadius: '2px' }}
            >
              {([false, true] as const).map((listMode, i) => (
                <button
                  key={String(listMode)}
                  onClick={() => setIsListView(listMode)}
                  className="flex items-center p-1.5 cursor-pointer transition-all duration-120"
                  style={{
                    background: isListView === listMode
                      ? 'color-mix(in srgb, var(--accent) 10%, transparent)'
                      : 'transparent',
                    border: 'none',
                    borderRight: i === 0 ? '1px solid var(--border-dim)' : 'none',
                    color: isListView === listMode ? 'var(--accent)' : 'var(--text-lo)',
                  }}
                >
                  {listMode
                    ? <IconLayoutList size={18} stroke={1.75} />
                    : <IconLayoutGrid size={18} stroke={1.75} />
                  }
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => { setEditingBookmark(null); setShowModal(true); }}
            className="flex items-center gap-1.5 cursor-pointer transition-all duration-150"
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
        {showCompact
          ? <BigListMobile
              bookmarks={bookmarks}
              onEdit={b => { setEditingBookmark({ id: b.id, bookmark: b }); setShowModal(true); }}
              onDelete={async id => { await DeleteBookmark(id); }}
            />
          : <BigList
              bookmarks={bookmarks}
              onEdit={b => { setEditingBookmark({ id: b.id, bookmark: b }); setShowModal(true); }}
              onDelete={async id => { await DeleteBookmark(id); }}
            />
        }
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